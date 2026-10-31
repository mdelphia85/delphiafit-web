import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api.js";

// Loads a server-computed insight (streaks, achievements, summary) for the signed-in user.
export default function useInsights(path, fallbackMessage = "Unable to load data.") {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  useEffect(() => {
    let active = true;
    apiRequest(path)
      .then((data) => active && setState({ data, loading: false, error: "" }))
      .catch((err) => active && setState({ data: null, loading: false, error: err.message || fallbackMessage }));
    return () => { active = false; };
  }, [path, fallbackMessage]);
  return state;
}
