// DelphiaFit workout generator: broad exercise selection with experience-aware progression.
// Keeps the existing { warmup, main, finisher, cooldown, equipment } API used by Workouts.jsx.
import {
  EXERCISE_CATALOG,
  CATEGORY_WEIGHTS,
  DEFAULT_WEIGHTS,
  DURATION_MAP,
  MAIN_BLOCK_EXERCISE_COUNTS
} from "./workoutTaxonomy.js";
import { EXTENDED_EXERCISES } from "./extendedExerciseLibrary.js";

export const EXPERIENCE_LEVELS = ["beginner", "intermediate", "advanced", "expert"];
const LEVEL_RANK = Object.fromEntries(EXPERIENCE_LEVELS.map((level, index) => [level, index]));
const LEVEL_OVERRIDES = { "Kettlebell Swing": "intermediate", "Jump Squats": "intermediate" };

// Preserve the original catalog and append the expanded exercise library.
export const WORKOUT_EXERCISES = [...EXERCISE_CATALOG, ...EXTENDED_EXERCISES]
  .map((exercise) => ({
    ...exercise,
    minLevel: LEVEL_OVERRIDES[exercise.name] || exercise.minLevel || "beginner",
    styles: exercise.styles || []
  }));

export function durationToMinutes(label) {
  return DURATION_MAP[label] || 30;
}

function mainBlockExerciseCount(minutes) {
  if (minutes <= 15) return MAIN_BLOCK_EXERCISE_COUNTS[15];
  if (minutes <= 20) return MAIN_BLOCK_EXERCISE_COUNTS[20];
  if (minutes <= 30) return MAIN_BLOCK_EXERCISE_COUNTS[30];
  if (minutes <= 45) return MAIN_BLOCK_EXERCISE_COUNTS[45];
  if (minutes <= 60) return MAIN_BLOCK_EXERCISE_COUNTS[60];
  if (minutes <= 75) return MAIN_BLOCK_EXERCISE_COUNTS[75];
  if (minutes <= 90) return MAIN_BLOCK_EXERCISE_COUNTS[90];
  if (minutes <= 105) return MAIN_BLOCK_EXERCISE_COUNTS[105];
  return MAIN_BLOCK_EXERCISE_COUNTS[120];
}

function isAvailable(exercise, equipmentAvailable) {
  if (equipmentAvailable == null || equipmentAvailable.length === 0) return true;
  return exercise.equipment.some((item) => equipmentAvailable.includes(item));
}

function shuffle(array) {
  const result = [...array];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function pickVaried(exercises, count, alreadyUsed) {
  const picked = [];
  const patterns = new Set();
  const candidates = shuffle(exercises.filter((ex) => !alreadyUsed.has(ex.name)));

  // Favor distinct movement patterns, then fill with other compatible exercises.
  for (const ex of candidates) {
    if (picked.length >= count) break;
    const fresh = (ex.patterns || []).some((p) => !patterns.has(p));
    if (fresh || !ex.patterns?.length) {
      picked.push(ex);
      for (const pattern of ex.patterns || []) patterns.add(pattern);
    }
  }
  for (const ex of candidates) {
    if (picked.length >= count) break;
    if (!picked.includes(ex)) picked.push(ex);
  }
  return picked;
}

function selectExercises(baseCategory, style, block, count, experienceLevel, equipmentAvailable, usedNames) {
  const rank = LEVEL_RANK[experienceLevel] ?? LEVEL_RANK.beginner;
  const compatible = WORKOUT_EXERCISES.filter((ex) =>
    (LEVEL_RANK[ex.minLevel] ?? 0) <= rank &&
    isAvailable(ex, equipmentAvailable) &&
    !usedNames.has(ex.name)
  );
  const weights = CATEGORY_WEIGHTS[baseCategory]?.[block] || DEFAULT_WEIGHTS[block];
  const isMain = block === "main_primary" || block === "main_secondary";
  const selections = [];

  // The selected discipline drives main work: powerlifting, Olympic lifting,
  // bodybuilding, combat sports, yoga and other styles no longer collapse to
  // the same generic workout.
  if (isMain && style) {
    const matchingStyle = compatible.filter((ex) => ex.styles.includes(style));
    // Higher-level athletes should receive an appropriate selection of the
    // higher-skill variations, not just beginner drills with more repetitions.
    const moreChallenging = matchingStyle.filter((ex) =>
      (LEVEL_RANK[ex.minLevel] ?? 0) >= Math.max(0, rank - 1)
    );
    const targeted = pickVaried(moreChallenging, count, usedNames);
    const targetedNames = new Set(targeted.map((ex) => ex.name));
    if (targeted.length < count) {
      targeted.push(...pickVaried(
        matchingStyle.filter((ex) => !targetedNames.has(ex.name)),
        count - targeted.length,
        new Set([...usedNames, ...targetedNames])
      ));
    }
    selections.push(...targeted);
  }
  if (selections.length < count) {
    const excluded = new Set([...usedNames, ...selections.map((ex) => ex.name)]);
    const matchingCategory = shuffle(compatible
      .filter((ex) => ex.categories.some((category) => (weights[category] || 0) > 0)))
      .sort((a, b) => {
        const score = (ex) => ex.categories.reduce((sum, category) => sum + (weights[category] || 0), 0);
        return score(b) - score(a);
      });
    selections.push(...pickVaried(matchingCategory.filter((ex) => !excluded.has(ex.name)), count - selections.length, excluded));
  }
  // When equipment/discipline combinations narrow a pool, use other safe,
  // level-compatible exercises rather than returning an empty workout.
  if (selections.length < count) {
    const excluded = new Set([...usedNames, ...selections.map((ex) => ex.name)]);
    const fallback = compatible.filter((ex) => !excluded.has(ex.name));
    selections.push(...pickVaried(fallback, count - selections.length, excluded));
  }
  for (const ex of selections) usedNames.add(ex.name);
  return selections.slice(0, count);
}

function formatExercise(ex, block, experienceLevel) {
  if (block === "warmup") return `${ex.name} — easy warm-up, 30–60 sec`;
  if (block === "cooldown") return `${ex.name} — gentle cool-down, 30–60 sec`;
  if (block === "finisher") {
    return `${ex.name} — ${experienceLevel === "beginner" ? "1–2" : "2–3"} controlled rounds`;
  }
  if (ex.patterns?.includes("skill")) return `${ex.name} — 2–3 technique rounds; prioritize form`;
  if (ex.categories.includes("Cardio") && !ex.categories.includes("Strength")) {
    return `${ex.name} — ${experienceLevel === "beginner" ? "3–5" : "5–8"} min, adjust pace to ability`;
  }
  if (ex.categories.includes("Mobility") || ex.categories.includes("Recovery") ||
      ex.categories.includes("Mind-Body")) {
    return `${ex.name} — 2–3 controlled rounds`;
  }
  const doses = {
    beginner: "2 sets × 8–12 reps",
    intermediate: "3 sets × 6–12 reps",
    advanced: "3–4 sets × 4–10 reps",
    expert: "4 sets × 3–8 reps"
  };
  return `${ex.name} — ${doses[experienceLevel] || doses.beginner}`;
}

export function generateWorkout({
  category_label,
  type_label = "",
  duration_label,
  experience_level = "beginner",
  equipment_available = null
}) {
  const level = EXPERIENCE_LEVELS.includes(experience_level) ? experience_level : "beginner";
  const minutes = durationToMinutes(duration_label);
  const mainCount = mainBlockExerciseCount(minutes);
  const primaryCount = Math.ceil(mainCount / 2);
  const secondaryCount = mainCount - primaryCount;
  const warmupCount = minutes >= 30 ? 3 : 2;
  const finisherCount = minutes >= 30 ? 2 : 1;
  const cooldownCount = minutes >= 30 ? 3 : 2;
  const usedNames = new Set();

  const warmup = selectExercises(category_label, type_label, "warmup", warmupCount, level, equipment_available, usedNames);
  const primary = selectExercises(category_label, type_label, "main_primary", primaryCount, level, equipment_available, usedNames);
  const secondary = selectExercises(category_label, type_label, "main_secondary", secondaryCount, level, equipment_available, usedNames);
  const finisher = selectExercises(category_label, type_label, "finisher", finisherCount, level, equipment_available, usedNames);
  const cooldown = selectExercises(category_label, type_label, "cooldown", cooldownCount, level, equipment_available, usedNames);
  const all = [...warmup, ...primary, ...secondary, ...finisher, ...cooldown];

  return {
    equipment: [...new Set(all.flatMap((ex) => ex.equipment))].sort(),
    warmup: warmup.map((ex) => formatExercise(ex, "warmup", level)),
    main: [...primary, ...secondary].map((ex) => formatExercise(ex, "main", level)),
    finisher: finisher.map((ex) => formatExercise(ex, "finisher", level)),
    cooldown: cooldown.map((ex) => formatExercise(ex, "cooldown", level))
  };
}
