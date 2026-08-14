import { getRecommendation } from "./recommendations";

export function generateWeeklyPlan() {
  const rec = getRecommendation();

  return [
    { day: "Monday", type: rec.nextWorkout, difficulty: rec.difficulty },
    { day: "Tuesday", type: "Mobility", difficulty: "easy" },
    { day: "Wednesday", type: rec.nextWorkout, difficulty: rec.difficulty },
    { day: "Thursday", type: "Conditioning", difficulty: "medium" },
    { day: "Friday", type: rec.nextWorkout, difficulty: rec.difficulty },
    { day: "Saturday", type: "Active Recovery", difficulty: "easy" },
    { day: "Sunday", type: "Rest", difficulty: "none" },
  ];
}
