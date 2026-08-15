import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const initialPrograms = [
  { id: 1, name: "Hotshot Fundamentals", duration: "120 min", cert: "Hotshot Crew", completed: false },
  { id: 2, name: "Smokejumper Conditioning", duration: "150 min", cert: "Smokejumper", completed: false },
  { id: 3, name: "High Altitude Fire Response", duration: "100 min", cert: "Mountain Fire", completed: false },
  { id: 4, name: "Chainsaw Proficiency", duration: "90 min", cert: "Equipment", completed: false },
  { id: 5, name: "Wildfire Behavior Analysis", duration: "75 min", cert: "Theory", completed: false },
  { id: 6, name: "Deployment & Escape Procedures", duration: "80 min", cert: "Safety", completed: false }
];

export default function WildlandFire() {
  const { setMenuOpen } = useContext(MenuContext);
  const [programs, setPrograms] = useState(() => readJson("wildland-fire", initialPrograms));
  const TACTICAL_COLOR = "#2d5f3a";

  useEffect(() => writeJson("wildland-fire", programs), [programs]);

  function toggleProgram(id) {
    setPrograms((prev) =>
      prev.map((program) =>
        program.id === id ? { ...program, completed: !program.completed } : program
      )
    );
  }

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>🔥 Wildland Fire</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>Hotshot, Smokejumper</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {programs.map((program) => (
            <div key={program.id} onClick={() => toggleProgram(program.id)} style={{ background: program.completed ? "#1a2a1f" : "#111", border: `1px solid ${program.completed ? TACTICAL_COLOR : "#333"}`, borderRadius: "10px", padding: "12px", cursor: "pointer", opacity: program.completed ? 0.7 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ color: "white", fontSize: "16px", fontWeight: "600", textDecoration: program.completed ? "line-through" : "none" }}>{program.name}</div>
                <div style={{ color: TACTICAL_COLOR, fontWeight: "700" }}>{program.completed ? "✓" : "○"}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
                <div>{program.duration}</div>
                <div style={{ color: TACTICAL_COLOR }}>{program.cert}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", padding: "12px", background: "#111", border: `1px solid ${TACTICAL_COLOR}`, borderRadius: "10px", fontSize: "13px", color: "#ccc" }}>
          <div style={{ color: TACTICAL_COLOR, fontWeight: "700", marginBottom: "8px" }}>Progress</div>
          <div>{programs.filter((p) => p.completed).length} of {programs.length} programs completed</div>
        </div>
      </div>

      <div onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", color: TACTICAL_COLOR, fontSize: "22px", textDecoration: "underline", cursor: "pointer", zIndex: 20 }}>
        Return to Menu
      </div>
    </div>
  );
}
