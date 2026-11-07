export function validCategory(value) {
  return typeof value === "string" && value.trim() !== "" && !["undefined", "null"].includes(value.trim().toLowerCase());
}

export function validCategories(categories) {
  if (!categories || typeof categories !== "object" || Array.isArray(categories)) return {};
  return Object.fromEntries(Object.entries(categories).filter(([category, count]) => validCategory(category) && Number.isFinite(count) && count > 0));
}
