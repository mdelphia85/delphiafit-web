import { PersonalizationModel } from "./personalizationModel";
import { getAdaptiveDifficulty } from "./adaptiveDifficulty";

export function getRecommendation() {
  const difficulty = getAdaptiveDifficulty();
  const prefs = PersonalizationModel.preferredCategories;

  const topCategory = Object.entries(prefs)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "Strength";

  return {
    nextWorkout: topCategory,
    difficulty,
    reason: `Based on your recent performance and preferences.`,
  };
}
