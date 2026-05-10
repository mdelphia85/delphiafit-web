import React, { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

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
