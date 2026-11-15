import { describe, expect, it } from "vitest";
import {
  generateWorkout,
  durationToMinutes,
  EXPERIENCE_LEVELS,
  WORKOUT_EXERCISES
} from "./workoutGenerator.js";
import { UI_MAIN_CATEGORIES, UI_SUBCATEGORY_MAP, CATEGORY_MAP } from "./workoutTaxonomy.js";

const names = (plan) => [
  ...plan.warmup,
  ...plan.main,
  ...plan.finisher,
  ...plan.cooldown
].map((line) => line.split(" — ")[0]);

describe("DelphiaFit expanded workout generator", () => {
  it("offers a broad library while preserving the original catalog", () => {
    expect(WORKOUT_EXERCISES.length).toBeGreaterThan(190);
    expect(WORKOUT_EXERCISES.some((ex) => ex.name === "Goblet Squat")).toBe(true);
    expect(WORKOUT_EXERCISES.some((ex) => ex.name === "Barbell Back Squat")).toBe(true);
    expect(WORKOUT_EXERCISES.some((ex) => ex.name === "BJJ Hip Escape")).toBe(true);
    expect(WORKOUT_EXERCISES.some((ex) => ex.name === "Full Snatch")).toBe(true);
  });

  it("recognizes short and extended duration options", () => {
    for (const minutes of [15, 20, 30, 45, 60, 75, 90, 105, 120]) {
      expect(durationToMinutes(`${minutes} min`)).toBe(minutes);
    }
  });

  it("scales the number of exercises for longer sessions without repeating movements", () => {
    const standard = generateWorkout({ category_label: "Strength", type_label: "Bodybuilding", duration_label: "45 min", experience_level: "intermediate" });
    const extended = generateWorkout({ category_label: "Strength", type_label: "Bodybuilding", duration_label: "120 min", experience_level: "intermediate" });
    expect(extended.main.length).toBeGreaterThan(standard.main.length);
    expect(extended.main.length).toBe(11);
    const extendedNames = names(extended);
    expect(new Set(extendedNames).size).toBe(extendedNames.length);
  });

  it("respects beginner safety levels", () => {
    for (let index = 0; index < 12; index += 1) {
      const plan = generateWorkout({
        category_label: "Strength",
        type_label: "Olympic Weightlifting",
        duration_label: "45 min",
        experience_level: "beginner"
      });
      const beginnerNames = names(plan);
      expect(beginnerNames.length).toBeGreaterThan(5);
      for (const name of beginnerNames) {
        const ex = WORKOUT_EXERCISES.find((item) => item.name === name);
        expect(ex).toBeDefined();
        expect(ex.minLevel).toBe("beginner");
      }
    }
  });

  it("prioritizes the selected style instead of treating all strength workouts alike", () => {
    const plan = generateWorkout({
      category_label: "Strength",
      type_label: "Powerlifting",
      duration_label: "45 min",
      experience_level: "advanced"
    });
    const mainNames = plan.main.map((line) => line.split(" — ")[0]);
    const specialized = mainNames.filter((name) =>
      WORKOUT_EXERCISES.find((ex) => ex.name === name)?.styles.includes("Powerlifting")
    );
    expect(specialized.length).toBeGreaterThan(0);
  });

  it("filters exercises by available equipment", () => {
    const gear = ["Bodyweight", "Chair", "Yoga Mat"];
    const plan = generateWorkout({
      category_label: "Functional",
      type_label: "Bootcamp",
      duration_label: "30 min",
      experience_level: "beginner",
      equipment_available: gear
    });
    for (const name of names(plan)) {
      const ex = WORKOUT_EXERCISES.find((item) => item.name === name);
      expect(ex.equipment.some((item) => gear.includes(item))).toBe(true);
    }
  });

  it("generates unique, complete workouts across every listed training style and level", () => {
    for (const category of UI_MAIN_CATEGORIES) {
      for (const style of UI_SUBCATEGORY_MAP[category]) {
        for (const experience_level of EXPERIENCE_LEVELS) {
          const plan = generateWorkout({
            category_label: CATEGORY_MAP[style],
            type_label: style,
            duration_label: "30 min",
            experience_level
          });
          expect(plan.warmup.length).toBeGreaterThan(0);
          expect(plan.main.length).toBeGreaterThan(0);
          expect(plan.finisher.length).toBeGreaterThan(0);
          expect(plan.cooldown.length).toBeGreaterThan(0);
          const exerciseNames = names(plan);
          expect(new Set(exerciseNames).size).toBe(exerciseNames.length);
        }
      }
    }
  });
});
