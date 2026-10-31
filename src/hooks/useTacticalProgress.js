import { useEffect, useRef, useState } from "react";
import { apiRequest } from "../utils/api.js";
import { readJson } from "../utils/dataPersistence.js";

export function useTacticalProgress(module, legacyKey, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ready = useRef(false);
  const lastSaved = useRef(null);
  const initial = useRef(initialValue);

  useEffect(() => {
    let active = true;
    ready.current = false;
    lastSaved.current = null;
    apiRequest(`/tactical/progress/${module}`)
      .then(async (result) => {
        if (!active) return;
        if (result.data !== null && result.data !== undefined) {
          setValue(result.data);
          lastSaved.current = JSON.stringify(result.data);
        } else {
          const legacy = readJson(legacyKey, null);
          const next = legacy === null ? initial.current : legacy;
          setValue(next);
          await apiRequest(`/tactical/progress/${module}`, { method: "PUT", body: { item_key: "state", data: next } });
          lastSaved.current = JSON.stringify(next);
          if (legacy !== null) localStorage.removeItem(legacyKey);
        }
        if (active) {
          ready.current = true;
          setLoading(false);
        }
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError.message || "Unable to load tactical progress.");
        setLoading(false);
      });
    return () => { active = false; };
  }, [module, legacyKey]);

  useEffect(() => {
    if (!ready.current) return;
    const serialized = JSON.stringify(value);
    if (lastSaved.current === serialized) return;
    let active = true;
    lastSaved.current = serialized;
    apiRequest(`/tactical/progress/${module}`, { method: "PUT", body: { item_key: "state", data: value } })
      .then(() => { if (active) setError(""); })
      .catch((requestError) => {
        if (active) {
          lastSaved.current = null;
          setError(requestError.message || "Unable to save tactical progress.");
        }
      });
    return () => { active = false; };
  }, [module, value]);

  return [value, setValue, { loading, error }];
}
