import { useCallback, useEffect, useState } from "react";
import { getNutritionTargets, saveNutritionSettings } from "../utils/nutritionApi";

export default function useNutritionTargets() {
  const [state, setState] = useState({ loading: true, data: null, error: null });

  const refresh = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setState({ loading: false, data: null, error: "unauthenticated" });
      return;
    }
    try {
      const data = await getNutritionTargets();
      setState({ loading: false, data, error: null });
    } catch (e) {
      setState({ loading: false, data: null, error: e.message || "error" });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!localStorage.getItem("token")) {
      Promise.resolve().then(() => {
        if (!cancelled) setState({ loading: false, data: null, error: "unauthenticated" });
      });
      return () => {
        cancelled = true;
      };
    }
    getNutritionTargets()
      .then(data => !cancelled && setState({ loading: false, data, error: null }))
      .catch(e => !cancelled && setState({ loading: false, data: null, error: e.message || "error" }));
    return () => {
      cancelled = true;
    };
  }, []);

  const saveOverrides = useCallback(
    async (overrides) => {
      await saveNutritionSettings(overrides);
      await refresh();
    },
    [refresh]
  );

  return { ...state, refresh, saveOverrides };
}
