import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const initialDrills = [
  { id: 1, name: "Scent Detection Fundamentals", duration: "45 min", difficulty: "Beginner", completed: false },
  { id: 2, name: "Apprehension Technique Drills", duration: "60 min", difficulty: "Intermediate", completed: false },
  { id: 3, name: "Tracking Through Urban Terrain", duration: "90 min", difficulty: "Advanced", completed: false },
  { id: 4, name: "Cross-Wind Scent Work", duration: "50 min", difficulty: "Intermediate", completed: false },
  { id: 5, name: "Handler Communication Protocol", duration: "40 min", difficulty: "Beginner", completed: false },
  { id: 6, name: "Night Operations Training", duration: "120 min", difficulty: "Advanced", completed: false }
];

export default function K9Operations() {
  const { setMenuOpen } = useContext(MenuContext);
  const [drills, setDrills] = useState(() => readJson("k9-drills", initialDrills));
  const TACTICAL_COLOR = "#2d5f3a";

  useEffect(() => writeJson("k9-drills", drills), [drills]);

  function toggleDrill(id) {
    setDrills((prev) =>
      prev.map((drill) =>
        drill.id === id ? { ...drill, completed: !drill.completed } : drill
      )
    );
  }

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>🐕 K9 Operations</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>Tracking, Apprehension, Scent Work</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {drills.map((drill) => (
            <div key={drill.id} onClick={() => toggleDrill(drill.id)} style={{ background: drill.completed ? "#1a2a1f" : "#111", border: `1px solid ${drill.completed ? TACTICAL_COLOR : "#333"}`, borderRadius: "10px", padding: "12px", cursor: "pointer", opacity: drill.completed ? 0.7 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ color: "white", fontSize: "16px", fontWeight: "600", textDecoration: drill.completed ? "line-through" : "none" }}>{drill.name}</div>
                <div style={{ color: TACTICAL_COLOR, fontWeight: "700" }}>{drill.completed ? "✓" : "○"}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
                <div>{drill.duration}</div>
                <div style={{ color: TACTICAL_COLOR }}>{drill.difficulty}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", padding: "12px", background: "#111", border: `1px solid ${TACTICAL_COLOR}`, borderRadius: "10px", fontSize: "13px", color: "#ccc" }}>
          <div style={{ color: TACTICAL_COLOR, fontWeight: "700", marginBottom: "8px" }}>Progress</div>
          <div>{drills.filter((d) => d.completed).length} of {drills.length} drills completed</div>
        </div>
      </div>

      <div onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", color: TACTICAL_COLOR, fontSize: "22px", textDecoration: "underline", cursor: "pointer", zIndex: 20 }}>
        Return to Menu
      </div>
    </div>
  );
}
