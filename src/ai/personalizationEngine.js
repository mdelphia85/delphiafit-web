import { PersonalizationModel } from "./personalizationModel";

export function updatePersonalizationEngine(workout) {
  // 1. Completion rate
  PersonalizationModel.completionRate =
    ((PersonalizationModel.completionRate * 0.9) +
      (workout.completed ? 1 : 0)) / 2;

  // 2. Block completion
  if (workout.blockCompletion) {
    Object.keys(workout.blockCompletion).forEach(block => {
      const prev = PersonalizationModel.avgBlockCompletion[block] || 0;
      PersonalizationModel.avgBlockCompletion[block] =
        (prev * 0.8 + workout.blockCompletion[block] * 0.2);
    });
  }

  // 3. Intensity
  if (workout.intensityScore) {
    PersonalizationModel.avgIntensity =
      (PersonalizationModel.avgIntensity * 0.85 +
        workout.intensityScore * 0.15);
  }

  // 4. Duration accuracy
  if (workout.durationAccuracy) {
    PersonalizationModel.avgDurationAccuracy =
      (PersonalizationModel.avgDurationAccuracy * 0.85 +
        workout.durationAccuracy * 0.15);
  }

  // 5. Preferred times
  const hour = new Date(workout.timestamp).getHours();
  const bucket =
    hour < 12 ? "morning" : hour < 18 ? "afternoon" : "night";

  PersonalizationModel.preferredTimes[bucket] =
    (PersonalizationModel.preferredTimes[bucket] || 0) + 1;

  // 6. Category preferences
  PersonalizationModel.preferredCategories[workout.sport] =
    (PersonalizationModel.preferredCategories[workout.sport] || 0) + 1;

  // 7. Save last recommended/completed
  PersonalizationModel.lastCompleted = workout;
}
