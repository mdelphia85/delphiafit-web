import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const initialModules = [
  { id: 1, name: "Physical Readiness Assessment", duration: "6 weeks", focus: "Conditioning", completed: false },
  { id: 2, name: "EMT-B Fundamentals", duration: "12 weeks", focus: "Theory", completed: false },
  { id: 3, name: "Patient Handling & Lifting", duration: "4 weeks", focus: "Techniques", completed: false },
  { id: 4, name: "Paramedic Skills Lab", duration: "10 weeks", focus: "Advanced", completed: false },
  { id: 5, name: "Endurance & Stress Testing", duration: "6 weeks", focus: "Peak Performance", completed: false },
  { id: 6, name: "Certification Exam Prep", duration: "3 weeks", focus: "Final Prep", completed: false }
];

export default function EMTParamedicPrep() {
  const { setMenuOpen } = useContext(MenuContext);
  const [modules, setModules] = useState(() => readJson("emt-paramedic-prep", initialModules));
  const TACTICAL_COLOR = "#2d5f3a";

  useEffect(() => writeJson("emt-paramedic-prep", modules), [modules]);

  function toggleModule(id) {
    setModules((prev) =>
      prev.map((module) =>
        module.id === id ? { ...module, completed: !module.completed } : module
      )
    );
  }

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>🚑 EMT/Paramedic Prep</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>Certification Program</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {modules.map((module) => (
            <div key={module.id} onClick={() => toggleModule(module.id)} style={{ background: module.completed ? "#1a2a1f" : "#111", border: `1px solid ${module.completed ? TACTICAL_COLOR : "#333"}`, borderRadius: "10px", padding: "12px", cursor: "pointer", opacity: module.completed ? 0.7 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ color: "white", fontSize: "16px", fontWeight: "600", textDecoration: module.completed ? "line-through" : "none" }}>{module.name}</div>
                <div style={{ color: TACTICAL_COLOR, fontWeight: "700" }}>{module.completed ? "✓" : "○"}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
                <div>{module.duration}</div>
                <div style={{ color: TACTICAL_COLOR }}>{module.focus}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", padding: "12px", background: "#111", border: `1px solid ${TACTICAL_COLOR}`, borderRadius: "10px", fontSize: "13px", color: "#ccc" }}>
          <div style={{ color: TACTICAL_COLOR, fontWeight: "700", marginBottom: "8px" }}>Completion</div>
          <div>{modules.filter((m) => m.completed).length} of {modules.length} modules completed</div>
        </div>
      </div>

      <div onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", color: TACTICAL_COLOR, fontSize: "22px", textDecoration: "underline", cursor: "pointer", zIndex: 20 }}>
        Return to Menu
      </div>
    </div>
  );
}
