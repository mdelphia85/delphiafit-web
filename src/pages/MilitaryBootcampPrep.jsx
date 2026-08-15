import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const initialPhases = [
  { id: 1, name: "Physical Conditioning Phase 1", duration: "6 weeks", focus: "Strength", completed: false },
  { id: 2, name: "Military Basics & Discipline", duration: "4 weeks", focus: "Theory", completed: false },
  { id: 3, name: "Combat Fitness", duration: "8 weeks", focus: "Endurance", completed: false },
  { id: 4, name: "Team Operations Basics", duration: "6 weeks", focus: "Tactics", completed: false },
  { id: 5, name: "Survival & Navigation", duration: "4 weeks", focus: "Wilderness", completed: false },
  { id: 6, name: "Final Bootcamp Assessment", duration: "2 weeks", focus: "Evaluation", completed: false }
];

export default function MilitaryBootcampPrep() {
  const { setMenuOpen } = useContext(MenuContext);
  const [phases, setPhases] = useState(() => readJson("military-bootcamp-prep", initialPhases));
  const TACTICAL_COLOR = "#2d5f3a";

  useEffect(() => writeJson("military-bootcamp-prep", phases), [phases]);

  function togglePhase(id) {
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === id ? { ...phase, completed: !phase.completed } : phase
      )
    );
  }

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>🎖️ Military Bootcamp Prep</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>Preparation Program</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {phases.map((phase) => (
            <div key={phase.id} onClick={() => togglePhase(phase.id)} style={{ background: phase.completed ? "#1a2a1f" : "#111", border: `1px solid ${phase.completed ? TACTICAL_COLOR : "#333"}`, borderRadius: "10px", padding: "12px", cursor: "pointer", opacity: phase.completed ? 0.7 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ color: "white", fontSize: "16px", fontWeight: "600", textDecoration: phase.completed ? "line-through" : "none" }}>{phase.name}</div>
                <div style={{ color: TACTICAL_COLOR, fontWeight: "700" }}>{phase.completed ? "✓" : "○"}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
                <div>{phase.duration}</div>
                <div style={{ color: TACTICAL_COLOR }}>{phase.focus}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", padding: "12px", background: "#111", border: `1px solid ${TACTICAL_COLOR}`, borderRadius: "10px", fontSize: "13px", color: "#ccc" }}>
          <div style={{ color: TACTICAL_COLOR, fontWeight: "700", marginBottom: "8px" }}>Completion</div>
          <div>{phases.filter((p) => p.completed).length} of {phases.length} phases completed</div>
        </div>
      </div>

      <div onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", color: TACTICAL_COLOR, fontSize: "22px", textDecoration: "underline", cursor: "pointer", zIndex: 20 }}>
        Return to Menu
      </div>
    </div>
  );
}
