import { useCallback, useEffect, useRef, useState } from "react";
import { apiRequest } from "../utils/api.js";

// Persists a running daily total (calories or protein) as consumption entries in /nutrition/.
// Saving posts only the difference from what is already stored, so totals survive reloads and devices.
export default function useDailyConsumption(field) {
  const [savedTotal, setSavedTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [loaded, setLoaded] = useState(false);
  const savedRef = useRef(0);

  useEffect(() => {
    let active = true;
    apiRequest("/nutrition/")
      .then((entries) => {
        if (!active) return;
        const today = new Date().toISOString().slice(0, 10);
        const total = (Array.isArray(entries) ? entries : [])
          .filter((entry) => String(entry.recorded_at).startsWith(today))
          .reduce((sum, entry) => sum + (Number(entry[field]) || 0), 0);
        savedRef.current = total;
        setSavedTotal(total);
      })
      .catch(() => active && setStatus("Could not load saved entries."))
      .finally(() => active && setLoaded(true));
    return () => { active = false; };
  }, [field]);

  const save = useCallback(async (value) => {
    const delta = Math.round(Number(value) || 0) - savedRef.current;
    if (delta === 0) { setStatus("Already saved."); return true; }
    try {
      await apiRequest("/nutrition/", { method: "POST", body: { [field]: delta } });
      savedRef.current += delta;
      setSavedTotal(savedRef.current);
      setStatus("Saved.");
      return true;
    } catch (err) {
      setStatus(err.message || "Save failed.");
      return false;
    }
  }, [field]);

  return { savedTotal, loaded, status, save };
}
