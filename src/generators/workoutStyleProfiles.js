// Training-style aliases and movement restrictions. These are internal matching
// rules; experience level is chosen separately by the athlete.
export const STYLE_PROFILES = {
  "Full Body Strength": {
    "aliases": [
      "Beginner Full Body",
      "Resistance Training",
      "Gentle Strength"
    ]
  },
  "Upper Body Strength": {
    "aliases": [
      "Bodybuilding",
      "Resistance Training",
      "Dumbbell Basics",
      "Resistance Band Basics",
      "Gym Machines 101"
    ],
    "patterns": [
      "push",
      "pull"
    ]
  },
  "Lower Body Strength": {
    "aliases": [
      "Bodybuilding",
      "Resistance Training",
      "Gentle Strength",
      "Dumbbell Basics"
    ],
    "patterns": [
      "squat",
      "hinge",
      "lunge",
      "calf"
    ]
  },
  "Bodyweight Strength": {
    "aliases": [
      "No-Equipment Basics",
      "Calisthenics",
      "Gentle Strength",
      "Beginner Full Body"
    ],
    "equipment": [
      "Bodyweight",
      "Yoga Mat",
      "Chair"
    ]
  },
  "Dumbbell Training": {
    "aliases": [
      "Dumbbell Basics",
      "Bodybuilding",
      "Resistance Training"
    ],
    "equipment": [
      "Dumbbells"
    ]
  },
  "Resistance Band Training": {
    "aliases": [
      "Resistance Band Basics"
    ],
    "equipment": [
      "Resistance Bands",
      "Loop Bands"
    ]
  },
  "Machine Training": {
    "aliases": [
      "Gym Machines 101",
      "Bodybuilding"
    ],
    "equipment": [
      "Machine",
      "Cable Machine",
      "Leg Press",
      "Assisted Pull-Up Machine",
      "Assisted Dip Machine"
    ]
  },
  "Core Strength": {
    "aliases": [
      "Beginner Core",
      "Bodybuilding",
      "Resistance Training",
      "Calisthenics"
    ],
    "patterns": [
      "core",
      "rotation"
    ]
  },
  "Push-Pull Training": {
    "aliases": [
      "Bodybuilding",
      "Resistance Training",
      "Dumbbell Basics",
      "Gym Machines 101"
    ],
    "patterns": [
      "push",
      "pull"
    ]
  },
  "Glute Training": {
    "aliases": [
      "Beginner Full Body",
      "Bodybuilding",
      "Gentle Strength",
      "Resistance Training"
    ],
    "patterns": [
      "hinge",
      "lunge",
      "squat"
    ],
    "nameIncludes": [
      "glute",
      "hip",
      "lunge",
      "deadlift",
      "squat",
      "step"
    ]
  },
  "Unilateral Training": {
    "aliases": [
      "Bodybuilding",
      "Athletic Conditioning",
      "Resistance Training",
      "Gentle Strength"
    ],
    "nameIncludes": [
      "single",
      "one-arm",
      "split",
      "lunge",
      "step",
      "side",
      "unilateral"
    ]
  },
  "Walking Intervals": {
    "aliases": [
      "Walking for Fitness",
      "Beginner Cardio",
      "Low-Impact Cardio",
      "Treadmill Intervals"
    ],
    "nameIncludes": [
      "walk",
      "march",
      "step"
    ]
  },
  "Low-Impact Cardio": {
    "aliases": [
      "Low-Impact Cardio",
      "Walking for Fitness",
      "Seated Cardio",
      "Beginner Cardio",
      "Low-Intensity Cardio"
    ]
  },
  "Seated Cardio": {
    "aliases": [
      "Seated Cardio"
    ]
  },
  "Steady-State Cardio": {
    "aliases": [
      "Walking",
      "Cycling",
      "Rowing",
      "Swimming",
      "Beginner Cardio",
      "Low-Intensity Cardio"
    ],
    "categories": [
      "Cardio"
    ]
  },
  "Cardio Endurance": {
    "aliases": [
      "Running",
      "Cycling",
      "Rowing",
      "Swimming",
      "Hiking",
      "Beginner Cardio"
    ],
    "categories": [
      "Cardio"
    ]
  },
  "Recumbent Cycling": {
    "aliases": [
      "Low-Impact Cardio",
      "Beginner Cardio"
    ],
    "nameIncludes": [
      "recumbent"
    ]
  },
  "Aqua Fitness": {
    "aliases": [
      "Swimming",
      "Low-Impact Cardio"
    ],
    "equipment": [
      "Pool"
    ]
  },
  "Incline Walking": {
    "aliases": [
      "Walking for Fitness",
      "Hiking",
      "Walking"
    ],
    "nameIncludes": [
      "incline",
      "hill",
      "hiking",
      "stair"
    ]
  },
  "Cardio Circuit": {
    "aliases": [
      "Circuit Training",
      "Low-Impact Circuit",
      "Beginner Cardio",
      "Athletic Conditioning"
    ],
    "categories": [
      "Cardio",
      "HIIT"
    ]
  },
  "Bodyweight Intervals": {
    "aliases": [
      "Tabata",
      "AMRAP",
      "EMOM",
      "No-Equipment Basics",
      "Low-Impact Circuit"
    ],
    "equipment": [
      "Bodyweight"
    ]
  },
  "Low-Impact Intervals": {
    "aliases": [
      "Low-Impact Circuit",
      "Low-Impact Cardio",
      "Beginner Cardio",
      "Seated Cardio"
    ]
  },
  "Kettlebell Intervals": {
    "aliases": [
      "CrossFit",
      "Athletic Conditioning",
      "Resistance Training"
    ],
    "equipment": [
      "Kettlebells"
    ]
  },
  "Sprint Intervals": {
    "aliases": [
      "Interval Sprints",
      "Sprint Training",
      "Treadmill Intervals",
      "Athletic Conditioning"
    ]
  },
  "Conditioning Circuits": {
    "aliases": [
      "Circuit Training",
      "Athletic Conditioning",
      "Bootcamp",
      "AMRAP",
      "Low-Impact Circuit"
    ]
  },
  "Home Fitness": {
    "aliases": [
      "Home Workout Basics",
      "No-Equipment Basics",
      "Resistance Band Basics",
      "Dumbbell Basics",
      "Beginner Full Body"
    ]
  },
  "Balance Training": {
    "aliases": [
      "Balance Basics",
      "Active Aging",
      "Tai Chi",
      "Movement Prep"
    ]
  },
  "Chair Fitness": {
    "aliases": [
      "Chair Fitness"
    ]
  },
  "Functional Strength": {
    "aliases": [
      "Resistance Training",
      "Beginner Full Body",
      "Gentle Strength",
      "Strongman",
      "Athletic Conditioning"
    ],
    "categories": [
      "Strength",
      "Functional"
    ]
  },
  "Core Stability": {
    "aliases": [
      "Beginner Core",
      "Pilates",
      "Movement Prep"
    ],
    "patterns": [
      "core",
      "balance",
      "rotation"
    ]
  },
  "Carry Training": {
    "aliases": [
      "Strongman",
      "Athletic Conditioning",
      "Resistance Training"
    ],
    "patterns": [
      "carry"
    ]
  },
  "Movement Skills": {
    "aliases": [
      "Movement Prep",
      "Agility Training",
      "Balance Basics",
      "MMA Conditioning"
    ],
    "patterns": [
      "skill",
      "agility",
      "balance",
      "mobility"
    ]
  },
  "Low-Impact Circuit": {
    "aliases": [
      "Low-Impact Circuit",
      "Low-Impact Cardio",
      "Chair Fitness",
      "No-Equipment Basics"
    ]
  },
  "Functional Circuit": {
    "aliases": [
      "Circuit Training",
      "Bootcamp",
      "Athletic Conditioning",
      "Beginner Full Body"
    ]
  },
  "Kettlebell Training": {
    "aliases": [
      "Resistance Training",
      "CrossFit",
      "Athletic Conditioning"
    ],
    "equipment": [
      "Kettlebells"
    ]
  },
  "Daily Movement": {
    "aliases": [
      "First Workout",
      "No-Equipment Basics",
      "Home Workout Basics",
      "Active Aging",
      "Return to Fitness",
      "Gentle Mobility"
    ]
  },
  "Gentle Mobility": {
    "aliases": [
      "Gentle Mobility",
      "Gentle Stretching",
      "Joint Prep",
      "Yoga Mobility"
    ]
  },
  "Hip Mobility": {
    "aliases": [
      "Gentle Mobility",
      "Yoga Mobility",
      "Dynamic Stretching",
      "Range of Motion Drills"
    ],
    "nameIncludes": [
      "hip",
      "glute",
      "90-90",
      "lunge",
      "squat",
      "pigeon"
    ]
  },
  "Shoulder Mobility": {
    "aliases": [
      "Gentle Mobility",
      "Yoga Mobility",
      "Joint Prep",
      "Dynamic Stretching"
    ],
    "nameIncludes": [
      "shoulder",
      "arm",
      "thoracic",
      "chest",
      "wall slide",
      "rotator"
    ]
  },
  "Ankle Mobility": {
    "aliases": [
      "Gentle Mobility",
      "Joint Prep",
      "Range of Motion Drills"
    ],
    "nameIncludes": [
      "ankle",
      "calf",
      "heel",
      "toe",
      "dorsiflexion"
    ]
  },
  "Spinal Mobility": {
    "aliases": [
      "Gentle Mobility",
      "Yoga Mobility",
      "Dynamic Stretching",
      "Range of Motion Drills"
    ],
    "nameIncludes": [
      "spine",
      "spinal",
      "thoracic",
      "cat-cow",
      "twist",
      "back"
    ]
  },
  "Mobility Flow": {
    "aliases": [
      "Gentle Mobility",
      "Yoga Mobility",
      "Dynamic Stretching",
      "Joint Prep"
    ]
  },
  "Active Recovery": {
    "aliases": [
      "Recovery Mobility",
      "Low-Intensity Cardio",
      "Light Stretching",
      "Foam Rolling",
      "Gentle Mobility"
    ]
  },
  "Restorative Movement": {
    "aliases": [
      "Gentle Mobility",
      "Gentle Stretching",
      "Recovery Mobility",
      "Light Stretching",
      "Yoga Mobility"
    ]
  },
  "Gentle Stretching": {
    "aliases": [
      "Gentle Stretching",
      "Light Stretching",
      "Static Stretching",
      "Yoga Mobility"
    ]
  },
  "Relaxation Breathing": {
    "aliases": [
      "Breathing Work",
      "Breathwork",
      "Meditation"
    ]
  },
  "Post-Workout Recovery": {
    "aliases": [
      "Foam Rolling",
      "Light Stretching",
      "Recovery Mobility",
      "Gentle Stretching"
    ]
  },
  "Seated Mobility": {
    "aliases": [
      "Chair Fitness",
      "Gentle Mobility",
      "Gentle Stretching"
    ],
    "nameIncludes": [
      "seated",
      "chair",
      "ankle",
      "wrist"
    ]
  },
  "Gentle Yoga": {
    "aliases": [
      "Yoga",
      "Yoga Mobility",
      "Gentle Stretching"
    ]
  },
  "Chair Yoga": {
    "aliases": [
      "Chair Fitness",
      "Yoga Mobility",
      "Gentle Mobility"
    ],
    "equipment": [
      "Chair"
    ]
  },
  "Yoga Flow": {
    "aliases": [
      "Yoga",
      "Yoga Mobility"
    ]
  },
  "Posture and Balance": {
    "aliases": [
      "Balance Basics",
      "Pilates",
      "Gentle Mobility",
      "Active Aging"
    ]
  },
  "Mindful Movement": {
    "aliases": [
      "Tai Chi",
      "Yoga",
      "Pilates",
      "Gentle Mobility"
    ]
  },
  "Low-Impact Group Fitness": {
    "aliases": [
      "Low-Impact Cardio",
      "Low-Impact Circuit",
      "Dance Fitness",
      "Zumba",
      "Active Aging"
    ]
  },
  "Total Body Circuit": {
    "aliases": [
      "Circuit Training",
      "Beginner Full Body",
      "Functional Circuit",
      "Bootcamp"
    ]
  },
  "Aerobic Dance": {
    "aliases": [
      "Dance Fitness",
      "Zumba"
    ]
  },
  "Step Fitness": {
    "aliases": [
      "Dance Fitness",
      "Low-Impact Circuit",
      "Zumba"
    ],
    "nameIncludes": [
      "step",
      "march",
      "tap",
      "side"
    ]
  },
  "Group Strength": {
    "aliases": [
      "Resistance Training",
      "Beginner Full Body",
      "Bodybuilding",
      "Gentle Strength"
    ]
  },
  "Cardio Dance": {
    "aliases": [
      "Dance Fitness",
      "Zumba"
    ]
  },
  "Aqua Aerobics": {
    "aliases": [
      "Swimming",
      "Low-Impact Cardio"
    ],
    "equipment": [
      "Pool"
    ]
  },
  "Mat Pilates": {
    "aliases": [
      "Pilates",
      "Beginner Core"
    ],
    "equipment": [
      "Yoga Mat"
    ]
  },
  "Shadowboxing": {
    "aliases": [
      "Boxing",
      "Kickboxing",
      "MMA Conditioning",
      "Muay Thai"
    ],
    "nameIncludes": [
      "shadow",
      "jab",
      "stance",
      "footwork",
      "boxing",
      "punch",
      "kick"
    ]
  },
  "Heavy Bag Training": {
    "aliases": [
      "Boxing",
      "Kickboxing",
      "Muay Thai",
      "MMA Conditioning"
    ],
    "equipment": [
      "Heavy Bag"
    ]
  },
  "Combat Footwork": {
    "aliases": [
      "Boxing",
      "Kickboxing",
      "MMA Conditioning",
      "Wrestling",
      "Fight Camp"
    ],
    "patterns": [
      "skill",
      "agility"
    ]
  },
  "Striking Conditioning": {
    "aliases": [
      "Boxing",
      "Kickboxing",
      "Muay Thai",
      "MMA Conditioning",
      "Fight Camp"
    ]
  },
  "Grappling Mobility": {
    "aliases": [
      "Grappling",
      "Brazilian Jiu-Jitsu",
      "Wrestling",
      "Yoga Mobility",
      "Gentle Mobility"
    ]
  },
  "Speed Development": {
    "aliases": [
      "Sprint Training",
      "Agility Training",
      "Athletic Conditioning"
    ],
    "patterns": [
      "power",
      "agility",
      "cardio"
    ]
  },
  "Explosive Power": {
    "aliases": [
      "Plyometric HIIT",
      "Athletic Conditioning",
      "CrossFit",
      "Olympic Weightlifting"
    ],
    "patterns": [
      "power",
      "squat",
      "push"
    ]
  },
  "Jump Training": {
    "aliases": [
      "Plyometric HIIT",
      "Athletic Conditioning"
    ],
    "patterns": [
      "power",
      "agility",
      "squat"
    ]
  },
  "Reaction Training": {
    "aliases": [
      "Agility Training",
      "Athletic Conditioning",
      "Movement Prep"
    ],
    "patterns": [
      "agility",
      "balance",
      "skill"
    ]
  },
  "Acceleration Training": {
    "aliases": [
      "Sprint Training",
      "Athletic Conditioning"
    ],
    "patterns": [
      "power",
      "agility",
      "cardio"
    ]
  },
  "Sports Conditioning": {
    "aliases": [
      "Athletic Conditioning",
      "Fight Camp",
      "Circuit Training",
      "Sprint Training",
      "HIIT"
    ]
  },
  "Lateral Movement": {
    "aliases": [
      "Agility Training",
      "Athletic Conditioning",
      "Movement Prep",
      "Balance Basics"
    ],
    "patterns": [
      "agility",
      "balance",
      "lunge"
    ]
  },
  "Conditioning Intervals": {
    "aliases": [
      "Interval Sprints",
      "Athletic Conditioning",
      "EMOM",
      "AMRAP",
      "Fight Camp"
    ]
  },
  "Off-Season Conditioning": {
    "aliases": [
      "Athletic Conditioning",
      "Resistance Training",
      "Sprint Training",
      "Plyometric HIIT",
      "Movement Prep"
    ]
  }
};

export function matchesWorkoutStyle(exercise, style) {
  const profile = STYLE_PROFILES[style];
  const tags = [style, ...(profile?.aliases || [])];
  const exerciseStyles = exercise.styles || [];
  if (!tags.some((tag) => exerciseStyles.includes(tag))) return false;
  if (profile?.categories && !profile.categories.some((category) => exercise.categories.includes(category))) return false;
  if (profile?.patterns && !profile.patterns.some((pattern) => exercise.patterns.includes(pattern))) return false;
  if (profile?.equipment && !profile.equipment.some((item) => exercise.equipment.includes(item))) return false;
  if (profile?.nameIncludes && !profile.nameIncludes.some((term) => exercise.name.toLowerCase().includes(term))) return false;
  return true;
}
