// ---------------------------------------------------------
// WORKOUT TAXONOMY — JS PORT OF workout_taxonomy.py
// ---------------------------------------------------------

// -----------------------------
// MAIN CATEGORIES (UI)
// -----------------------------
export const UI_MAIN_CATEGORIES = [
  "Strength",
  "Cardio",
  "HIIT",
  "Functional",
  "Mobility",
  "Recovery",
  "Mind-Body",
  "Group Fitness"
];

// -----------------------------
// SUBCATEGORIES (UI)
// -----------------------------
export const UI_SUBCATEGORY_MAP = {
  Strength: [
    "Bodybuilding",
    "Powerlifting",
    "Olympic Weightlifting",
    "Resistance Training",
    "CrossFit",
    "Circuit Training"
  ],

  Cardio: [
    "Running",
    "Cycling",
    "Rowing",
    "Elliptical",
    "Stair Climber",
    "Walking",
    "Treadmill Intervals"
  ],

  HIIT: ["Tabata", "Interval Sprints", "Plyometric HIIT", "EMOM", "AMRAP"],

  Functional: [
    "Bootcamp",
    "Circuit Training",
    "CrossFit",
    "Athletic Conditioning",
    "Movement Prep"
  ],

  Mobility: [
    "Dynamic Stretching",
    "Static Stretching",
    "Yoga Mobility",
    "Joint Prep",
    "Range of Motion Drills"
  ],

  Recovery: [
    "Foam Rolling",
    "Light Stretching",
    "Breathing Work",
    "Low-Intensity Cardio",
    "Massage Gun Work"
  ],

  "Mind-Body": ["Yoga", "Pilates", "Meditation", "Breathwork", "Tai Chi"],

  "Group Fitness": ["Spin", "Zumba", "Bootcamp", "Kickboxing", "Dance Fitness"]
};

// -----------------------------
// STRENGTH-BASED SUBCATEGORIES
// -----------------------------
export const STRENGTH_TYPES = [
  "Bodybuilding",
  "Powerlifting",
  "Olympic Weightlifting",
  "Resistance Training",
  "CrossFit",
  "Circuit Training"
];

// -----------------------------
// INTERNAL CATEGORY MAPPING
// -----------------------------
export const CATEGORY_MAP = Object.fromEntries(
  Object.entries(UI_SUBCATEGORY_MAP).flatMap(([main, subs]) =>
    subs.map(sub => [sub, main])
  )
);

// -----------------------------
// WEIGHT OPTIONS
// -----------------------------
export const WEIGHT_OPTIONS_LBS = [
  5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60
];

export const WEIGHT_OPTIONS_KG = [
  2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25
];

// -----------------------------
// EQUIPMENT GROUPS
// -----------------------------
export const EQUIPMENT_GROUPS = {
  "Free Weights": ["Dumbbells", "Kettlebells", "Barbell", "Plates"],
  Machines: ["Cable Machine", "Leg Press", "Smith Machine"],
  Bands: ["Resistance Bands", "Loop Bands"],
  Bodyweight: ["Pull-Up Bar", "Dip Bars", "None"]
};

// -----------------------------
// EXERCISE CATALOG
// (JS port of your Python EXERCISE_CATALOG)
// -----------------------------
export const EXERCISE_CATALOG = [
  // Strength / Lower
  {
    name: "Goblet Squat",
    categories: ["Strength", "Functional"],
    patterns: ["squat"],
    equipment: ["Dumbbells", "Kettlebells"],
    intensity: "moderate"
  },
  {
    name: "Romanian Deadlift",
    categories: ["Strength"],
    patterns: ["hinge"],
    equipment: ["Dumbbells", "Barbell"],
    intensity: "moderate"
  },
  {
    name: "Reverse Lunge",
    categories: ["Strength", "Functional"],
    patterns: ["lunge"],
    equipment: ["Dumbbells", "Bodyweight"],
    intensity: "moderate"
  },

  // Strength / Upper
  {
    name: "Dumbbell Bench Press",
    categories: ["Strength"],
    patterns: ["push"],
    equipment: ["Dumbbells", "Bench"],
    intensity: "moderate"
  },
  {
    name: "One-Arm Dumbbell Row",
    categories: ["Strength"],
    patterns: ["pull"],
    equipment: ["Dumbbells", "Bench"],
    intensity: "moderate"
  },
  {
    name: "Overhead Press",
    categories: ["Strength"],
    patterns: ["push"],
    equipment: ["Dumbbells"],
    intensity: "moderate"
  },

  // Functional / Core / Carry
  {
    name: "Farmer Carry",
    categories: ["Functional"],
    patterns: ["carry"],
    equipment: ["Dumbbells", "Kettlebells"],
    intensity: "moderate"
  },
  {
    name: "Plank Hold",
    categories: ["Functional", "Core"],
    patterns: ["core"],
    equipment: ["Bodyweight"],
    intensity: "low"
  },
  {
    name: "Dead Bug",
    categories: ["Functional", "Core"],
    patterns: ["core"],
    equipment: ["Bodyweight"],
    intensity: "low"
  },

  // HIIT / Conditioning
  {
    name: "Kettlebell Swing",
    categories: ["HIIT", "Functional"],
    patterns: ["hinge"],
    equipment: ["Kettlebells"],
    intensity: "high"
  },
  {
    name: "Mountain Climbers",
    categories: ["HIIT"],
    patterns: ["core"],
    equipment: ["Bodyweight"],
    intensity: "high"
  },
  {
    name: "Jump Squats",
    categories: ["HIIT"],
    patterns: ["squat"],
    equipment: ["Bodyweight"],
    intensity: "high"
  },

  // Cardio
  {
    name: "Treadmill Run",
    categories: ["Cardio"],
    patterns: ["cardio"],
    equipment: ["Treadmill"],
    intensity: "moderate"
  },
  {
    name: "Bike Intervals",
    categories: ["Cardio", "HIIT"],
    patterns: ["cardio"],
    equipment: ["Bike"],
    intensity: "high"
  },

  // Mobility / Recovery
  {
    name: "World's Greatest Stretch",
    categories: ["Mobility", "Recovery"],
    patterns: ["mobility"],
    equipment: ["Bodyweight"],
    intensity: "low"
  },
  {
    name: "Cat-Cow",
    categories: ["Mobility"],
    patterns: ["mobility"],
    equipment: ["Bodyweight"],
    intensity: "low"
  },
  {
    name: "Hamstring Stretch",
    categories: ["Mobility", "Recovery"],
    patterns: ["mobility"],
    equipment: ["Bodyweight"],
    intensity: "low"
  },

  // Mind-Body
  {
    name: "Box Breathing",
    categories: ["Mind-Body", "Recovery"],
    patterns: ["breathing"],
    equipment: ["Bodyweight"],
    intensity: "low"
  },
  {
    name: "Child's Pose",
    categories: ["Mind-Body", "Mobility"],
    patterns: ["mobility"],
    equipment: ["Bodyweight"],
    intensity: "low"
  }
];

// -----------------------------
// DURATION & VOLUME MODEL
// -----------------------------
export const DURATION_MAP = {
  "20 min": 20,
  "30 min": 30,
  "45 min": 45,
  "60 min": 60
};

export const MAIN_BLOCK_EXERCISE_COUNTS = {
  20: 4,
  30: 5,
  45: 6,
  60: 7
};

// -----------------------------
// CATEGORY WEIGHTING MODEL
// -----------------------------
export const CATEGORY_WEIGHTS = {
  Strength: {
    warmup: { Mobility: 0.6, Functional: 0.3, Strength: 0.1 },
    main_primary: { Strength: 0.7, Functional: 0.2, Core: 0.1 },
    main_secondary: { Functional: 0.4, Strength: 0.3, Core: 0.3 },
    finisher: { HIIT: 0.6, Functional: 0.2, Cardio: 0.2 },
    cooldown: { Mobility: 0.7, Recovery: 0.3 }
  },

  Cardio: {
    warmup: { Mobility: 0.5, Functional: 0.3, Cardio: 0.2 },
    main_primary: { Cardio: 0.6, HIIT: 0.3, Functional: 0.1 },
    main_secondary: { Functional: 0.4, Core: 0.3, Cardio: 0.3 },
    finisher: { HIIT: 0.7, Cardio: 0.3 },
    cooldown: { Mobility: 0.6, Recovery: 0.4 }
  },

  HIIT: {
    warmup: { Mobility: 0.6, Functional: 0.3, Cardio: 0.1 },
    main_primary: { HIIT: 0.7, Functional: 0.2, Strength: 0.1 },
    main_secondary: { Functional: 0.4, Core: 0.3, HIIT: 0.3 },
    finisher: { HIIT: 0.8, Cardio: 0.2 },
    cooldown: { Mobility: 0.6, Recovery: 0.4 }
  },

  Functional: {
    warmup: { Mobility: 0.5, Functional: 0.5 },
    main_primary: { Functional: 0.6, Strength: 0.2, Core: 0.2 },
    main_secondary: { Functional: 0.4, Core: 0.4, Strength: 0.2 },
    finisher: { HIIT: 0.5, Functional: 0.3, Cardio: 0.2 },
    cooldown: { Mobility: 0.6, Recovery: 0.4 }
  },

  Mobility: {
    warmup: { Mobility: 0.8, Functional: 0.2 },
    main_primary: { Mobility: 0.7, Functional: 0.3 },
    main_secondary: { Mobility: 0.6, Core: 0.4 },
    finisher: { Mobility: 0.7, "Mind-Body": 0.3 },
    cooldown: { Mobility: 0.7, "Mind-Body": 0.3 }
  },

  Recovery: {
    warmup: { Mobility: 0.7, Recovery: 0.3 },
    main_primary: { Recovery: 0.6, Mobility: 0.4 },
    main_secondary: { Recovery: 0.6, "Mind-Body": 0.4 },
    finisher: { "Mind-Body": 0.7, Recovery: 0.3 },
    cooldown: { Mobility: 0.5, Recovery: 0.5 }
  },

  "Mind-Body": {
    warmup: { Mobility: 0.6, "Mind-Body": 0.4 },
    main_primary: { "Mind-Body": 0.6, Mobility: 0.4 },
    main_secondary: { "Mind-Body": 0.6, Recovery: 0.4 },
    finisher: { "Mind-Body": 0.7, Mobility: 0.3 },
    cooldown: { "Mind-Body": 0.7, Mobility: 0.3 }
  },

  "Group Fitness": {
    warmup: { Mobility: 0.5, Functional: 0.3, Cardio: 0.2 },
    main_primary: { Cardio: 0.4, Strength: 0.3, Functional: 0.3 },
    main_secondary: { Functional: 0.4, Core: 0.3, Cardio: 0.3 },
    finisher: { HIIT: 0.5, Cardio: 0.3, Functional: 0.2 },
    cooldown: { Mobility: 0.6, Recovery: 0.4 }
  }
};

export const DEFAULT_WEIGHTS = CATEGORY_WEIGHTS["Strength"];
