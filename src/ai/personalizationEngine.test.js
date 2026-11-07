import { beforeEach, describe, expect, it, vi } from "vitest";
import { PersonalizationModel } from "./personalizationModel";
import { updatePersonalizationEngine } from "./personalizationEngine";
import { getRecommendation } from "./recommendations";
import { validCategories } from "./categories";

vi.mock("./adaptiveSync", () => ({ pushAdaptiveProfile: vi.fn() }));

beforeEach(() => {
  PersonalizationModel.preferredCategories = {};
});

describe("workout categories", () => {
  it("does not learn a category for a manual workout without one", () => {
    updatePersonalizationEngine({ mode: "manual", timestamp: "2026-11-06T12:00:00Z" });
    expect(PersonalizationModel.preferredCategories).toEqual({});
  });

  it("learns the actual generated workout type", () => {
    updatePersonalizationEngine({ workout_type: "Strength", timestamp: "2026-11-06T12:00:00Z" });
    expect(PersonalizationModel.preferredCategories).toEqual({ Strength: 1 });
  });

  it("ignores invalid categories saved by older versions", () => {
    PersonalizationModel.preferredCategories = { undefined: 5, null: 3, Strength: 1 };
    expect(validCategories(PersonalizationModel.preferredCategories)).toEqual({ Strength: 1 });
    expect(getRecommendation().nextWorkout).toBe("Strength");
  });
});
