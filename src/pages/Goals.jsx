import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { getNutritionSettings, saveNutritionSettings } from "../utils/nutritionApi.js";

const AVOID = ["dairy", "egg", "fish", "nuts", "gluten", "soy"];

export default function Goals() {
  const { setMenuOpen } = useContext(MenuContext);

  const GOALS_COLOR = "dodgerblue";

  const [goals, setGoals] = useState({
    targetWeight: "",
    weeklyChange: "",
    customGoal: "",
    moodGoal: "",
    habits: "",
    remindWeekly: "No"
  });
  const [nutrition, setNutrition] = useState({ goalType: "", diet: "none", mealsPerDay: "5", avoid: [] });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    getNutritionSettings()
      .then(s => {
        const x = s.extras || {};
        setGoals(g => ({
          ...g,
          targetWeight: s.target_weight ?? "",
          weeklyChange: s.weekly_rate ?? "",
          customGoal: x.customGoal ?? "",
          moodGoal: x.moodGoal ?? "",
          habits: x.habits ?? "",
          remindWeekly: x.remindWeekly ?? "No"
        }));
        setNutrition({
          goalType: s.goal_type || "",
          diet: s.diet || "none",
          mealsPerDay: String(s.meals_per_day || 5),
          avoid: s.avoid || []
        });
      })
      .catch(() => {});
  }, []);

  async function saveGoals() {
    if (!localStorage.getItem("token")) {
      setStatus("Log in to save your goals.");
      return;
    }
    setStatus("Saving...");
    try {
      await saveNutritionSettings({
        goal_type: nutrition.goalType || null,
        target_weight: goals.targetWeight === "" ? null : Number(goals.targetWeight),
        weekly_rate: goals.weeklyChange === "" ? null : Number(goals.weeklyChange),
        goal_unit: "lbs",
        diet: nutrition.diet,
        avoid: nutrition.avoid,
        meals_per_day: Number(nutrition.mealsPerDay),
        extras: {
          customGoal: goals.customGoal,
          moodGoal: goals.moodGoal,
          habits: goals.habits,
          remindWeekly: goals.remindWeekly
        }
      });
      setStatus("Goals saved.");
    } catch (e) {
      setStatus(e.message);
    }
  }

  function toggleAvoid(a) {
    setNutrition(n => ({
      ...n,
      avoid: n.avoid.includes(a) ? n.avoid.filter(x => x !== a) : [...n.avoid, a]
    }));
  }

  const selectStyle = {
    width: "100%",
    height: "40px",
    backgroundColor: "black",
    color: GOALS_COLOR,
    border: `2px solid ${GOALS_COLOR}`,
    borderRadius: "6px",
    marginBottom: "20px",
    paddingLeft: "10px",
    fontSize: "20px",
    outline: "none"
  };

  function updateField(key, value) {
    setGoals({ ...goals, [key]: value });
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        padding: "20px",
        overflowY: "auto",
        boxSizing: "border-box",
        position: "relative"
      }}
    >
      {/* STREAK */}
      <p
        style={{
          color: GOALS_COLOR,
          fontSize: "26px",
          marginBottom: "20px"
        }}
      >
        Streak: 0 days
      </p>

      {/* GOAL TYPE */}
      <p style={{ color: GOALS_COLOR, marginBottom: "5px" }}>Nutrition goal</p>
      <select
        value={nutrition.goalType}
        onChange={(e) => setNutrition({ ...nutrition, goalType: e.target.value })}
        style={selectStyle}
      >
        <option value=""></option>
        <option value="lose">Lose weight</option>
        <option value="maintain">Maintain weight</option>
        <option value="gain">Gain muscle</option>
      </select>

      {/* TARGET WEIGHT */}
      <p style={{ color: GOALS_COLOR, marginBottom: "5px" }}>
        Target weight (lbs)
      </p>
      <input
        type="number"
        value={goals.targetWeight}
        onChange={(e) => updateField("targetWeight", e.target.value)}
        style={{
          width: "100%",
          height: "40px",
          backgroundColor: "black",
          color: GOALS_COLOR,
          border: `2px solid ${GOALS_COLOR}`,
          borderRadius: "6px",
          marginBottom: "20px",
          paddingLeft: "10px",
          fontSize: "20px",
          outline: "none",
          caretColor: GOALS_COLOR
        }}
      />

      {/* WEEKLY CHANGE */}
      <p style={{ color: GOALS_COLOR, marginBottom: "5px" }}>
        Weekly change (lbs)
      </p>
      <input
        type="number"
        value={goals.weeklyChange}
        onChange={(e) => updateField("weeklyChange", e.target.value)}
        style={{
          width: "100%",
          height: "40px",
          backgroundColor: "black",
          color: GOALS_COLOR,
          border: `2px solid ${GOALS_COLOR}`,
          borderRadius: "6px",
          marginBottom: "20px",
          paddingLeft: "10px",
          fontSize: "20px",
          outline: "none",
          caretColor: GOALS_COLOR
        }}
      />

      {/* CUSTOM GOAL */}
      <p style={{ color: GOALS_COLOR, marginBottom: "5px" }}>Custom goal</p>
      <input
        type="text"
        value={goals.customGoal}
        onChange={(e) => updateField("customGoal", e.target.value)}
        style={{
          width: "100%",
          height: "40px",
          backgroundColor: "black",
          color: GOALS_COLOR,
          border: `2px solid ${GOALS_COLOR}`,
          borderRadius: "6px",
          marginBottom: "20px",
          paddingLeft: "10px",
          fontSize: "20px",
          outline: "none",
          caretColor: GOALS_COLOR
        }}
      />

      {/* MOOD GOAL */}
      <p style={{ color: GOALS_COLOR, marginBottom: "5px" }}>Mood goal</p>
      <select
        value={goals.moodGoal}
        onChange={(e) => updateField("moodGoal", e.target.value)}
        style={{
          width: "100%",
          height: "40px",
          backgroundColor: "black",
          color: GOALS_COLOR,
          border: `2px solid ${GOALS_COLOR}`,
          borderRadius: "6px",
          marginBottom: "20px",
          paddingLeft: "10px",
          fontSize: "20px",
          outline: "none"
        }}
      >
        <option value=""></option>
        <option value="Happy">Happy</option>
        <option value="Calm">Calm</option>
        <option value="Focused">Focused</option>
      </select>

      {/* HABITS */}
      <p style={{ color: GOALS_COLOR, marginBottom: "5px" }}>Habits</p>
      <select
        value={goals.habits}
        onChange={(e) => updateField("habits", e.target.value)}
        style={{
          width: "100%",
          height: "40px",
          backgroundColor: "black",
          color: GOALS_COLOR,
          border: `2px solid ${GOALS_COLOR}`,
          borderRadius: "6px",
          marginBottom: "20px",
          paddingLeft: "10px",
          fontSize: "20px",
          outline: "none"
        }}
      >
        <option value=""></option>
        <option value="Hydration">Hydration</option>
        <option value="Steps">Steps</option>
        <option value="Mindfulness">Mindfulness</option>
      </select>

      {/* REMINDER */}
      <p style={{ color: GOALS_COLOR, marginBottom: "5px" }}>
        Enable weekly progress reminder
      </p>
      <select
        value={goals.remindWeekly}
        onChange={(e) => updateField("remindWeekly", e.target.value)}
        style={{
          width: "100%",
          height: "40px",
          backgroundColor: "black",
          color: GOALS_COLOR,
          border: `2px solid ${GOALS_COLOR}`,
          borderRadius: "6px",
          marginBottom: "40px",
          paddingLeft: "10px",
          fontSize: "20px",
          outline: "none"
        }}
      >
        <option value="No">No</option>
        <option value="Yes">Yes</option>
      </select>

      {/* MEAL PREFERENCES */}
      <p style={{ color: GOALS_COLOR, marginBottom: "5px" }}>Diet preference</p>
      <select
        value={nutrition.diet}
        onChange={(e) => setNutrition({ ...nutrition, diet: e.target.value })}
        style={selectStyle}
      >
        <option value="none">No restriction</option>
        <option value="pescatarian">Pescatarian</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
      </select>

      <p style={{ color: GOALS_COLOR, marginBottom: "5px" }}>Meals per day</p>
      <select
        value={nutrition.mealsPerDay}
        onChange={(e) => setNutrition({ ...nutrition, mealsPerDay: e.target.value })}
        style={selectStyle}
      >
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>

      <p style={{ color: GOALS_COLOR, marginBottom: "5px" }}>Avoid</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "30px", color: GOALS_COLOR }}>
        {AVOID.map(a => (
          <label key={a} style={{ fontSize: "18px", textTransform: "capitalize" }}>
            <input type="checkbox" checked={nutrition.avoid.includes(a)} onChange={() => toggleAvoid(a)} /> {a}
          </label>
        ))}
      </div>

      <p
        onClick={saveGoals}
        style={{ color: GOALS_COLOR, fontSize: "22px", textDecoration: "underline", cursor: "pointer", marginBottom: "8px" }}
      >
        Save Goals
      </p>
      {status && <p style={{ color: GOALS_COLOR, marginBottom: "60px" }}>{status}</p>}
      <p style={{ color: GOALS_COLOR, fontSize: "13px", opacity: 0.8, marginBottom: "60px" }}>
        Goals drive your estimated calorie and protein targets. Estimates are not medical advice.
      </p>

      {/* RETURN TO MENU */}
      <p
        onClick={() => setMenuOpen(true)}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          color: GOALS_COLOR,
          fontSize: "22px",
          textDecoration: "underline",
          cursor: "pointer"
        }}
      >
        Return to Menu
      </p>
    </div>
  );
}
