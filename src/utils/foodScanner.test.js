import { describe, expect, it } from "vitest";
import { formatNutrient, normalizeBarcode, portionNutrients } from "./foodScanner.js";

const completeProduct = {
  barcode: "0012345678905",
  product_name: "Plain Yogurt",
  nutrition_unit: "g",
  nutrition_per_100g_or_100ml: {
    calories_kcal: 80, protein_g: 8, carbs_g: 7, fat_g: 2,
  },
};

describe("Food scanner calculations", () => {
  it("preserves leading zero barcodes and rejects malformed codes", () => {
    expect(normalizeBarcode(" 0012345678905 ")).toBe("0012345678905");
    expect(normalizeBarcode("001-234-567-8905")).toBe("0012345678905");
    expect(normalizeBarcode("00123456789abc")).toBeNull();
    expect(normalizeBarcode("123")).toBeNull();
  });

  it("computes nutrition for the explicit quantity, without guessing a serving", () => {
    expect(portionNutrients(completeProduct, 150)).toMatchObject({
      calories: 120, protein: 12, carbs: 11, fats: 3
    });
    expect(portionNutrients(completeProduct, 150).notes).toContain("150 g");
    expect(portionNutrients(completeProduct, 150).notes).toContain("0012345678905");
  });

  it("does not log when units or nutrients are unknown", () => {
    expect(portionNutrients({ ...completeProduct, nutrition_unit: null }, 100)).toBeNull();
    expect(portionNutrients({
      ...completeProduct,
      nutrition_per_100g_or_100ml: { calories_kcal: 80, protein_g: null, carbs_g: 5, fat_g: 2 }
    }, 100)).toBeNull();
    expect(portionNutrients(completeProduct, -1)).toBeNull();
    expect(portionNutrients(completeProduct, "unknown")).toBeNull();
  });

  it("distinguishes missing values from zero in product facts", () => {
    expect(formatNutrient(null, "g")).toBe("Not reported");
    expect(formatNutrient(0, "g")).toBe("0 g");
  });
});
