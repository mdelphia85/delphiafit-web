export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`Unable to read ${key}:`, error);
    return fallback;
  }
}

export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Unable to save ${key}:`, error);
    return false;
  }
}

export function getTrendColor(value) {
  if (value > 0) return { arrow: "▲", color: "#6ee7b7" };
  if (value < 0) return { arrow: "▼", color: "#f87171" };
  return { arrow: "■", color: "#fbbf24" };
}
