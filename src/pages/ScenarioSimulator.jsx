import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const environments = ["Urban", "Rural", "Wilderness", "Maritime", "Mountain", "Desert", "Arctic", "Jungle"];
const threatLevels = ["Low", "Medium", "High", "Critical"];
const teamSizes = ["2-man", "4-man", "Squad", "Platoon", "Fire Crew", "EMS Team", "SWAT Stack", "SOF Element"];
const objectives = ["Rescue", "Extraction", "Containment", "Patrol", "Surveillance", "Direct Action"];

const initialScenarios = [
  { id: 1, name: "Urban Rescue", environment: "Urban", threat: "Medium", teamSize: "4-man", objective: "Rescue", completed: false }
];

export default function ScenarioSimulator() {
  const { setMenuOpen } = useContext(MenuContext);
  const [scenarios, setScenarios] = useState(() => readJson("scenarios", initialScenarios));
  const [building, setBuilding] = useState(false);
  const [newScenario, setNewScenario] = useState({
    name: "",
    environment: "Urban",
    threat: "Medium",
    teamSize: "4-man",
    objective: "Rescue"
  });

  const TACTICAL_COLOR = "#2d5f3a";

  useEffect(() => writeJson("scenarios", scenarios), [scenarios]);

  function startBuilding() {
    setBuilding(true);
  }

  function cancelBuild() {
    setBuilding(false);
    setNewScenario({ name: "", environment: "Urban", threat: "Medium", teamSize: "4-man", objective: "Rescue" });
  }

  function createScenario() {
    if (!newScenario.name.trim()) return;

    const scenario = {
      id: Date.now(),
      name: newScenario.name,
      environment: newScenario.environment,
      threat: newScenario.threat,
      teamSize: newScenario.teamSize,
      objective: newScenario.objective,
      completed: false
    };

    setScenarios((prev) => [scenario, ...prev]);
    setNewScenario({ name: "", environment: "Urban", threat: "Medium", teamSize: "4-man", objective: "Rescue" });
    setBuilding(false);
  }

  function toggleScenario(id) {
    setScenarios((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, completed: !s.completed } : s
      )
    );
  }

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>🎯 Scenario Simulator</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>Custom Training Scenarios</div>
        </div>

        {!building ? (
          <>
            <button onClick={startBuilding} style={{ width: "100%", padding: "12px", background: TACTICAL_COLOR, color: "black", border: "none", borderRadius: "10px", fontWeight: "700", marginBottom: "20px", cursor: "pointer" }}>
              + Create Scenario
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {scenarios.map((scenario) => (
                <div key={scenario.id} onClick={() => toggleScenario(scenario.id)} style={{ background: scenario.completed ? "#1a2a1f" : "#111", border: `1px solid ${scenario.completed ? TACTICAL_COLOR : "#333"}`, borderRadius: "10px", padding: "12px", cursor: "pointer", opacity: scenario.completed ? 0.7 : 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <div style={{ color: "white", fontSize: "16px", fontWeight: "600", textDecoration: scenario.completed ? "line-through" : "none" }}>{scenario.name}</div>
                    <div style={{ color: TACTICAL_COLOR, fontWeight: "700" }}>{scenario.completed ? "✓" : "○"}</div>
                  </div>

                  <div style={{ fontSize: "12px", color: "#999", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ color: TACTICAL_COLOR }}>{scenario.environment}</span>
                    <span>•</span>
                    <span style={{ color: TACTICAL_COLOR }}>{scenario.threat}</span>
                    <span>•</span>
                    <span>{scenario.teamSize}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ background: "#111", border: `1px solid ${TACTICAL_COLOR}`, borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ color: "#999", fontSize: "12px", marginBottom: "4px", display: "block" }}>Scenario Name</label>
                <input type="text" value={newScenario.name} onChange={(e) => setNewScenario((prev) => ({ ...prev, name: e.target.value }))} placeholder="E.g., Desert Rescue" style={{ width: "100%", padding: "8px", background: "#000", border: "1px solid #333", borderRadius: "6px", color: "white", boxSizing: "border-box" }} />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ color: "#999", fontSize: "12px", marginBottom: "4px", display: "block" }}>Environment</label>
                <select value={newScenario.environment} onChange={(e) => setNewScenario((prev) => ({ ...prev, environment: e.target.value }))} style={{ width: "100%", padding: "8px", background: "#000", border: "1px solid #333", borderRadius: "6px", color: "white" }}>
                  {environments.map((env) => (
                    <option key={env} value={env}>
                      {env}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ color: "#999", fontSize: "12px", marginBottom: "4px", display: "block" }}>Threat Level</label>
                <select value={newScenario.threat} onChange={(e) => setNewScenario((prev) => ({ ...prev, threat: e.target.value }))} style={{ width: "100%", padding: "8px", background: "#000", border: "1px solid #333", borderRadius: "6px", color: "white" }}>
                  {threatLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ color: "#999", fontSize: "12px", marginBottom: "4px", display: "block" }}>Team Size</label>
                <select value={newScenario.teamSize} onChange={(e) => setNewScenario((prev) => ({ ...prev, teamSize: e.target.value }))} style={{ width: "100%", padding: "8px", background: "#000", border: "1px solid #333", borderRadius: "6px", color: "white" }}>
                  {teamSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ color: "#999", fontSize: "12px", marginBottom: "4px", display: "block" }}>Objective</label>
                <select value={newScenario.objective} onChange={(e) => setNewScenario((prev) => ({ ...prev, objective: e.target.value }))} style={{ width: "100%", padding: "8px", background: "#000", border: "1px solid #333", borderRadius: "6px", color: "white" }}>
                  {objectives.map((obj) => (
                    <option key={obj} value={obj}>
                      {obj}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={createScenario} style={{ flex: 1, padding: "10px", background: TACTICAL_COLOR, color: "black", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}>
                  Launch Scenario
                </button>
                <button onClick={cancelBuild} style={{ flex: 1, padding: "10px", background: "#222", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", color: TACTICAL_COLOR, fontSize: "22px", textDecoration: "underline", cursor: "pointer", zIndex: 20 }}>
        Return to Menu
      </div>
    </div>
  );
}
