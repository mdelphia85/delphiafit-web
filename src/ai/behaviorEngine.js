import { PersonalizationModel, persistPersonalizationModel } from "./personalizationModel";

export function updateBehavior(workout) {
  const timestamp = new Date(workout.timestamp);
  const day = Number.isNaN(timestamp.getTime()) ? new Date().getDay() : timestamp.getDay();

  PersonalizationModel.skipPatterns[day] =
    (PersonalizationModel.skipPatterns[day] || 0) +
    (workout.completed ? 0 : 1);

  if (Number.isFinite(workout.intensityScore) && workout.intensityScore < 0.3) {
    PersonalizationModel.fatiguePatterns[day] =
      (PersonalizationModel.fatiguePatterns[day] || 0) + 1;
  }

  persistPersonalizationModel();
}
