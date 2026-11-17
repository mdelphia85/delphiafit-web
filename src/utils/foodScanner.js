export function normalizeBarcode(input) {
  const value = String(input ?? "").replace(/[\s-]+/g, "");
  return /^[0-9]{8,14}$/.test(value) ? value : null;
}

export const NUTRIENT_LABELS = Object.freeze([
  ["calories_kcal", "Calories", "kcal"],
  ["protein_g", "Protein", "g"],
  ["carbs_g", "Carbohydrates", "g"],
  ["fat_g", "Total fat", "g"],
  ["saturated_fat_g", "Saturated fat", "g"],
  ["sugars_g", "Total sugars", "g"],
  ["fiber_g", "Fiber", "g"],
  ["sodium_mg", "Sodium", "mg"],
]);

export function portionNutrients(product, quantity) {
  const n = product?.nutrition_per_100g_or_100ml;
  const unit = product?.nutrition_unit;
  const amount = Number(quantity);
  if (!n || !["g", "ml"].includes(unit) || !Number.isFinite(amount) ||
      amount <= 0 || amount > 5000) {
    return null;
  }
  const needed = ["calories_kcal", "protein_g", "carbs_g", "fat_g"];
  if (needed.some((key) => n[key] === null || n[key] === undefined ||
    !Number.isFinite(Number(n[key])) || Number(n[key]) < 0)) return null;
  const factor = amount / 100;
  return {
    calories: Math.max(0, Math.round(n.calories_kcal * factor)),
    protein: Math.max(0, Math.round(n.protein_g * factor)),
    carbs: Math.max(0, Math.round(n.carbs_g * factor)),
    fats: Math.max(0, Math.round(n.fat_g * factor)),
    notes: "Barcode food: " + String(product.product_name || "Product").slice(0, 120) +
      " (" + product.barcode + "), " + amount + " " + unit +
      ". Nutrition estimates from Open Food Facts; verify package label.",
  };
}

export function formatNutrient(value, unit = "") {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return "Not reported";
  const number = Number(value);
  return (Number.isInteger(number) ? String(number) : number.toFixed(1)) + (unit ? " " + unit : "");
}
