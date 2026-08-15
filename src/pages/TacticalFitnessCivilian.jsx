import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const initialWorkouts = [
  { id: 1, name: "Rucking Fundamentals", duration: "60 min", weight: "25 lbs", completed: false },
  { id: 2, name: "Advanced Conditioning", duration: "90 min", weight: "35 lbs", completed: false },
  { id: 3, name: "Preparedness Training", duration: "75 min", weight: "20 lbs", completed: false },
  { id: 4, name: "Obstacle Course Mastery", duration: "100 min", weight: "45 lbs", completed: false },
  { id: 5, name: "Endurance Challenge", duration: "120 min", weight: "50 lbs", completed: false },
  { id: 6, name: "Speed & Agility Drills", duration: "50 min", weight: "15 lbs", completed: false }
];

export default function TacticalFitnessCivilian() {
  const { setMenuOpen } = useContext(MenuContext);
  const [workouts, setWorkouts] = useState(() => readJson("tactical-fitness-civilian", initialWorkouts));
  const TACTICAL_COLOR = "#2d5f3a";

  useEffect(() => writeJson("tactical-fitness-civilian", workouts), [workouts]);

  function toggleWorkout(id) {
    setWorkouts((prev) =>
      prev.map((workout) =>
        workout.id === id ? { ...workout, completed: !workout.completed } : workout
      )
    );
  }

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>💪 Tactical Fitness</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>Civilian Readiness & Conditioning</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {workouts.map((workout) => (
            <div key={workout.id} onClick={() => toggleWorkout(workout.id)} style={{ background: workout.completed ? "#1a2a1f" : "#111", border: `1px solid ${workout.completed ? TACTICAL_COLOR : "#333"}`, borderRadius: "10px", padding: "12px", cursor: "pointer", opacity: workout.completed ? 0.7 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ color: "white", fontSize: "16px", fontWeight: "600", textDecoration: workout.completed ? "line-through" : "none" }}>{workout.name}</div>
                <div style={{ color: TACTICAL_COLOR, fontWeight: "700" }}>{workout.completed ? "✓" : "○"}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
                <div>{workout.duration}</div>
                <div style={{ color: TACTICAL_COLOR }}>{workout.weight}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", padding: "12px", background: "#111", border: `1px solid ${TACTICAL_COLOR}`, borderRadius: "10px", fontSize: "13px", color: "#ccc" }}>
          <div style={{ color: TACTICAL_COLOR, fontWeight: "700", marginBottom: "8px" }}>Progress</div>
          <div>{workouts.filter((w) => w.completed).length} of {workouts.length} workouts completed</div>
        </div>
      </div>

      <div onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", color: TACTICAL_COLOR, fontSize: "22px", textDecoration: "underline", cursor: "pointer", zIndex: 20 }}>
        Return to Menu
      </div>
    </div>
  );
}
