import { PersonalizationModel } from "./personalizationModel";

export function updateBehavior(workout) {
  const day = new Date(workout.timestamp).getDay();

  PersonalizationModel.skipPatterns[day] =
    (PersonalizationModel.skipPatterns[day] || 0) +
    (workout.completed ? 0 : 1);

  if (workout.intensityScore < 0.3) {
    PersonalizationModel.fatiguePatterns[day] =
      (PersonalizationModel.fatiguePatterns[day] || 0) + 1;
  }
}
