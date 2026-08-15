import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const initialScenarios = [
  { id: 1, name: "Building Collapse Rescue", duration: "120 min", hazard: "Structural", completed: false },
  { id: 2, name: "Mass Casualty Response", duration: "150 min", hazard: "Medical", completed: false },
  { id: 3, name: "Wildfire Evacuation Coordination", duration: "90 min", hazard: "Fire", completed: false },
  { id: 4, name: "Flood Response Operations", duration: "100 min", hazard: "Water", completed: false },
  { id: 5, name: "Chemical Spill Containment", duration: "110 min", hazard: "Hazmat", completed: false },
  { id: 6, name: "Multi-Agency Coordination Drill", duration: "180 min", hazard: "Complex", completed: false }
];

export default function DisasterResponse() {
  const { setMenuOpen } = useContext(MenuContext);
  const [scenarios, setScenarios] = useState(() => readJson("disaster-scenarios", initialScenarios));
  const TACTICAL_COLOR = "#2d5f3a";

  useEffect(() => writeJson("disaster-scenarios", scenarios), [scenarios]);

  function toggleScenario(id) {
    setScenarios((prev) =>
      prev.map((scenario) =>
        scenario.id === id ? { ...scenario, completed: !scenario.completed } : scenario
      )
    );
  }

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>🚨 Disaster Response</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>FEMA-Style Scenarios</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {scenarios.map((scenario) => (
            <div key={scenario.id} onClick={() => toggleScenario(scenario.id)} style={{ background: scenario.completed ? "#1a2a1f" : "#111", border: `1px solid ${scenario.completed ? TACTICAL_COLOR : "#333"}`, borderRadius: "10px", padding: "12px", cursor: "pointer", opacity: scenario.completed ? 0.7 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ color: "white", fontSize: "16px", fontWeight: "600", textDecoration: scenario.completed ? "line-through" : "none" }}>{scenario.name}</div>
                <div style={{ color: TACTICAL_COLOR, fontWeight: "700" }}>{scenario.completed ? "✓" : "○"}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
                <div>{scenario.duration}</div>
                <div style={{ color: TACTICAL_COLOR }}>{scenario.hazard}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", padding: "12px", background: "#111", border: `1px solid ${TACTICAL_COLOR}`, borderRadius: "10px", fontSize: "13px", color: "#ccc" }}>
          <div style={{ color: TACTICAL_COLOR, fontWeight: "700", marginBottom: "8px" }}>Progress</div>
          <div>{scenarios.filter((s) => s.completed).length} of {scenarios.length} scenarios completed</div>
        </div>
      </div>

      <div onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", color: TACTICAL_COLOR, fontSize: "22px", textDecoration: "underline", cursor: "pointer", zIndex: 20 }}>
        Return to Menu
      </div>
    </div>
  );
}
