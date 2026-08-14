import { PersonalizationModel } from "./personalizationModel";

export function getAdaptiveDifficulty() {
  const { completionRate, avgIntensity, avgDurationAccuracy } =
    PersonalizationModel;

  let difficulty = "medium";

  if (completionRate > 0.85 && avgIntensity > 0.7) {
    difficulty = "hard";
  }

  if (completionRate < 0.5 || avgDurationAccuracy < 0.5) {
    difficulty = "easy";
  }

  return difficulty;
}
