import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const initialPhases = [
  { id: 1, name: "Physical Readiness", duration: "6 weeks", focus: "Strength & endurance", objective: "Build running, push-up, core, and loaded-carry capacity.", completed: false },
  { id: 2, name: "Military Customs & Discipline", duration: "3 weeks", focus: "Foundations", objective: "Practice routines, attention to detail, time management, and accountability.", completed: false },
  { id: 3, name: "Rucking & Load Carriage", duration: "4 weeks", focus: "Work capacity", objective: "Progress distance and load while protecting feet, joints, and recovery.", completed: false },
  { id: 4, name: "Teamwork & Leadership", duration: "4 weeks", focus: "Team skills", objective: "Develop communication, followership, initiative, and small-team problem solving.", completed: false },
  { id: 5, name: "Field Skills & Navigation", duration: "4 weeks", focus: "Field craft", objective: "Train land navigation, movement, environmental awareness, and field readiness.", completed: false },
  { id: 6, name: "Resilience & Recovery", duration: "3 weeks", focus: "Readiness", objective: "Build sleep, nutrition, stress-management, and injury-prevention habits.", completed: false },
  { id: 7, name: "Military Fitness Test Prep", duration: "3 weeks", focus: "Assessment", objective: "Prepare for timed fitness events and repeatable performance under fatigue.", completed: false },
  { id: 8, name: "Final Recruit Readiness Assessment", duration: "2 weeks", focus: "Evaluation", objective: "Confirm physical, mental, and team readiness before reporting to training.", completed: false }
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
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>🎖️ Military Basic Training Prep</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>Recruit readiness program</div>
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

              <div style={{ marginTop: "8px", fontSize: "12px", lineHeight: "1.4", color: "#bbb" }}>{phase.objective}</div>
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
