// src/generators/mealGenerator.js

// Random helpers
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Base meal generators
export function randomMeal() {
  return {
    protein: pickRandom(["Chicken", "Turkey", "Eggs"]),
    carbs: pickRandom(["Rice", "Pasta", "Oats"]),
    veggies: pickRandom(["Broccoli", "Spinach", "Peppers"])
  };
}

export function randomDinner() {
  return {
    protein: pickRandom(["Steak", "Chicken", "Fish"]),
    fats: pickRandom(["Avocado", "Olive Oil", "Nuts"]),
    veggies: pickRandom(["Broccoli", "Spinach", "Peppers"])
  };
}

// Full daily generator
export function generateDailyMeals() {
  return {
    breakfast: randomMeal(),
    snack1: randomMeal(),
    lunch: randomMeal(),
    snack2: randomMeal(),
    dinner: randomDinner()
  };
}

// Go-To generator
export function generateGoToMeals() {
  return {
    goToBreakfast: randomMeal(),
    goToLunch: randomMeal(),
    goToDinner: randomDinner()
  };
}

// Apply Go-To meals to today
export function useGoToMealsToday(goTo) {
  return {
    breakfast: goTo.goToBreakfast,
    snack1: goTo.goToBreakfast,
    lunch: goTo.goToLunch,
    snack2: goTo.goToLunch,
    dinner: goTo.goToDinner
  };
}

// Save Go-To meals
export function saveGoToMeals(goTo) {
  localStorage.setItem("goToMeals", JSON.stringify(goTo));
}

// Load Go-To meals
export function loadGoToMeals() {
  const data = localStorage.getItem("goToMeals");
  return data ? JSON.parse(data) : null;
}
