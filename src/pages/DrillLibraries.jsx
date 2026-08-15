import React, { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const drillCategories = [
  {
    category: "Strength",
    drills: [
      { id: 1, name: "Barbell Squat", reps: "5x5", intensity: "High" },
      { id: 2, name: "Deadlift", reps: "3x3", intensity: "High" },
      { id: 3, name: "Bench Press", reps: "4x6", intensity: "High" }
    ]
  },
  {
    category: "Cardio",
    drills: [
      { id: 4, name: "Tempo Run", distance: "5km", pace: "5:30/km" },
      { id: 5, name: "High Intensity Intervals", distance: "8x400m", pace: "90sec" },
      { id: 6, name: "Long Run", distance: "15km", pace: "6:00/km" }
    ]
  },
  {
    category: "Sports",
    drills: [
      { id: 7, name: "Cone Dribbling", reps: "3x30sec", focus: "Agility" },
      { id: 8, name: "Pass Accuracy", reps: "20 passes", focus: "Technique" },
      { id: 9, name: "Shot On Goal", reps: "15 shots", focus: "Accuracy" }
    ]
  }
];

export default function DrillLibraries() {
  const { setMenuOpen } = useContext(MenuContext);
  const [selectedCategory, setSelectedCategory] = useState("Strength");
  const [selectedDrill, setSelectedDrill] = useState(null);

  const COACH_COLOR = "#ec4899";
  const BLACK = "#000";
  const WHITE = "#fff";

  const drills = drillCategories.find((c) => c.category === selectedCategory)?.drills || [];

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: BLACK,
        padding: "16px 16px 90px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        overflowY: "auto",
        color: WHITE
      }}
    >
      <div style={{ width: "360px", maxWidth: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: COACH_COLOR, fontSize: "28px", fontWeight: "700" }}>🎯 Drill Library</div>
        </div>

        {!selectedDrill ? (
          <>
            {/* Category Selector */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
              {drillCategories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.category)}
                  style={{
                    padding: "10px 14px",
                    background: selectedCategory === cat.category ? COACH_COLOR : "#222",
                    color: selectedCategory === cat.category ? BLACK : WHITE,
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            {/* Drills List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {drills.map((drill) => (
                <div
                  key={drill.id}
                  onClick={() => setSelectedDrill(drill)}
                  style={{
                    background: "#111",
                    border: `1px solid #2a2a2a`,
                    borderRadius: "12px",
                    padding: "14px",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = COACH_COLOR)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
                >
                  <div style={{ fontWeight: "600", marginBottom: "6px" }}>{drill.name}</div>
                  <div style={{ fontSize: "12px", color: "#999" }}>
                    {drill.reps || drill.distance} • {drill.intensity || drill.pace || drill.focus}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Drill Detail */}
            <button
              onClick={() => setSelectedDrill(null)}
              style={{
                padding: "12px",
                background: "#222",
                color: WHITE,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                marginBottom: "20px",
                width: "100%"
              }}
            >
              ← Back
            </button>

            <div
              style={{
                background: "#111",
                border: `1px solid ${COACH_COLOR}`,
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "20px"
              }}
            >
              <div style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px", color: COACH_COLOR }}>
                {selectedDrill.name}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                <div>
                  <div style={{ color: "#999", fontSize: "12px" }}>Volume</div>
                  <div>{selectedDrill.reps || selectedDrill.distance}</div>
                </div>
                <div>
                  <div style={{ color: "#999", fontSize: "12px" }}>Target</div>
                  <div>{selectedDrill.intensity || selectedDrill.pace || selectedDrill.focus}</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                style={{
                  padding: "12px",
                  background: COACH_COLOR,
                  color: BLACK,
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Assign to Client
              </button>
              <button
                style={{
                  padding: "12px",
                  background: "#222",
                  color: WHITE,
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                View Analytics
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "40px",
          background: BLACK,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 16px",
          boxSizing: "border-box",
          zIndex: 20
        }}
      >
        <div
          style={{
            color: COACH_COLOR,
            fontSize: "18px",
            textDecoration: "underline",
            cursor: "pointer"
          }}
          onClick={() => setMenuOpen(true)}
        >
          Return to Menu
        </div>
      </div>
    </div>
  );
}
