// ---------------------------------------------------------
// WORKOUT GENERATOR — JS PORT OF workout_generator.py
// ---------------------------------------------------------

import {
  EXERCISE_CATALOG,
  CATEGORY_WEIGHTS,
  DEFAULT_WEIGHTS,
  DURATION_MAP,
  MAIN_BLOCK_EXERCISE_COUNTS
} from "./workoutTaxonomy.js";

// -----------------------------
// HELPERS
// -----------------------------
function durationToMinutes(label) {
  return DURATION_MAP[label] || 30;
}

function mainBlockExerciseCount(minutes) {
  if (minutes <= 20) return MAIN_BLOCK_EXERCISE_COUNTS[20];
  if (minutes <= 30) return MAIN_BLOCK_EXERCISE_COUNTS[30];
  if (minutes <= 45) return MAIN_BLOCK_EXERCISE_COUNTS[45];
  return MAIN_BLOCK_EXERCISE_COUNTS[60];
}

function filterByEquipment(exercises, equipmentAvailable) {
  if (!equipmentAvailable || equipmentAvailable.length === 0) return exercises;

  const eqSet = new Set(equipmentAvailable);

  const filtered = exercises.filter(ex => {
    const exEq = new Set(ex.equipment);
    return [...exEq].some(eq => eqSet.has(eq));
  });

  if (filtered.length === 0) {
    return exercises.filter(ex => ex.equipment.includes("Bodyweight"));
  }

  return filtered.length > 0 ? filtered : exercises;
}

function filterByCategories(exercises, targetCategories) {
  const target = new Set(targetCategories);
  return exercises.filter(ex =>
    ex.categories.some(cat => target.has(cat))
  );
}

function ensurePatternDiversity(exercises, targetCount) {
  if (!exercises.length) return [];

  const selected = [];
  const usedPatterns = new Set();

  const shuffled = [...exercises].sort(() => Math.random() - 0.5);

  for (const ex of shuffled) {
    const patterns = ex.patterns || [];
    if (!patterns.length) continue;

    const intersects = patterns.some(p => usedPatterns.has(p));
    if (!intersects) {
      selected.push(ex);
      patterns.forEach(p => usedPatterns.add(p));
    }
    if (selected.length >= targetCount) return selected;
  }

  const remaining = shuffled.filter(ex => !selected.includes(ex));
  selected.push(...remaining.slice(0, targetCount - selected.length));

  return selected.slice(0, targetCount);
}

function weightedCategoryChoice(weights) {
  const cats = Object.keys(weights);
  const probs = Object.values(weights);
  const total = probs.reduce((a, b) => a + b, 0);

  if (total <= 0) return cats[Math.floor(Math.random() * cats.length)];

  const normalized = probs.map(p => p / total);
  let r = Math.random();
  let cumulative = 0;

  for (let i = 0; i < cats.length; i++) {
    cumulative += normalized[i];
    if (r <= cumulative) return cats[i];
  }

  return cats[cats.length - 1];
}

function selectBlockExercises(baseCategory, blockKey, targetCount, equipmentAvailable) {
  const weights =
    CATEGORY_WEIGHTS[baseCategory]?.[blockKey] ||
    DEFAULT_WEIGHTS[blockKey] ||
    {};

  let pool = [];

  for (let i = 0; i < targetCount * 4; i++) {
    const chosenCat = weightedCategoryChoice(weights);
    const catEx = filterByCategories(EXERCISE_CATALOG, [chosenCat]);
    pool.push(...catEx);
  }

  pool = filterByEquipment(pool, equipmentAvailable);

  const unique = {};
  for (const ex of pool) unique[ex.name] = ex;
  pool = Object.values(unique);

  return ensurePatternDiversity(pool, targetCount);
}

function formatExercise(ex, note) {
  return note ? `${ex.name} - ${note}` : ex.name;
}

// ---------------------------------------------------------
// PUBLIC API
// ---------------------------------------------------------
export function generateWorkout({
  category_label,
  duration_label,
  equipment_available = null
}) {
  const minutes = durationToMinutes(duration_label);
  const mainCount = mainBlockExerciseCount(minutes);

  const primaryCount = Math.max(2, Math.floor(mainCount / 2));
  const secondaryCount = Math.max(2, mainCount - primaryCount);

  const warmupCount = minutes >= 30 ? 3 : 2;
  const finisherCount = minutes >= 30 ? 2 : 1;
  const cooldownCount = minutes >= 30 ? 3 : 2;

  const warmupEx = selectBlockExercises(
    category_label,
    "warmup",
    warmupCount,
    equipment_available
  );

  const mainPrimaryEx = selectBlockExercises(
    category_label,
    "main_primary",
    primaryCount,
    equipment_available
  );

  const mainSecondaryEx = selectBlockExercises(
    category_label,
    "main_secondary",
    secondaryCount,
    equipment_available
  );

  const finisherEx = selectBlockExercises(
    category_label,
    "finisher",
    finisherCount,
    equipment_available
  );

  const cooldownEx = selectBlockExercises(
    category_label,
    "cooldown",
    cooldownCount,
    equipment_available
  );

  const equipmentUsed = new Set();
  [warmupEx, mainPrimaryEx, mainSecondaryEx, finisherEx, cooldownEx].forEach(
    block => {
      block.forEach(ex => {
        ex.equipment.forEach(eq => equipmentUsed.add(eq));
      });
    }
  );

  return {
    equipment: [...equipmentUsed].sort(),
    warmup: warmupEx.map(ex => formatExercise(ex, "warm-up")),
    main: [
      ...mainPrimaryEx.map(ex => formatExercise(ex, "primary")),
      ...mainSecondaryEx.map(ex => formatExercise(ex, "secondary"))
    ],
    finisher: finisherEx.map(ex => formatExercise(ex, "finisher")),
    cooldown: cooldownEx.map(ex => formatExercise(ex, "cool-down"))
  };
}
