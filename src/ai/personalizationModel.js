const STORAGE_KEY = "delphiafit-personalization-model";

function loadModel() {
  if (typeof localStorage === "undefined") return null;

  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

const savedModel = loadModel();

export const PersonalizationModel = {
  // Performance signals
  completionRate: 0,          // % of workouts completed
  avgBlockCompletion: {},     // warmup/main/finisher/cooldown
  avgIntensity: 0,            // based on weights, reps, RPE
  avgDurationAccuracy: 0,     // how close they stick to planned time

  // Behavioral signals
  preferredTimes: {},         // morning/afternoon/night
  preferredCategories: {},    // strength/cardio/sports
  skipPatterns: {},           // what they skip and when
  fatiguePatterns: {},        // when they slow down or quit

  // Progress signals
  strengthTrend: 0,           // increasing or decreasing
  enduranceTrend: 0,
  mobilityTrend: 0,

  // Recommendation memory
  lastRecommended: null,
  lastCompleted: null,
  ...savedModel,
};

export function persistPersonalizationModel() {
  if (typeof localStorage === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(PersonalizationModel));
  } catch {
    return;
  }
}
