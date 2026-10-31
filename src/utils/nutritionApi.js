import { API } from "../config/api.js";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const detail = data && data.detail;
    const error = new Error(
      (detail && (detail.message || (typeof detail === "string" ? detail : null))) ||
        `Request failed (${res.status})`
    );
    error.status = res.status;
    error.detail = detail;
    throw error;
  }
  return data;
}

export const getNutritionTargets = () => request("/nutrition-coach/targets");
export const getNutritionSettings = () => request("/nutrition-coach/settings");
export const saveNutritionSettings = settings =>
  request("/nutrition-coach/settings", { method: "PUT", body: JSON.stringify(settings) });
export const generateMealPlan = () =>
  request("/nutrition-coach/meal-plans/generate", { method: "POST", body: JSON.stringify({}) });
export const getLatestMealPlan = () => request("/nutrition-coach/meal-plans/latest");
export const getProfile = () => request("/profile/get");
