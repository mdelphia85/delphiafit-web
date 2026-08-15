import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const initialCrew = [
  { id: 1, name: "Helicopter Crew Coordination", duration: "90 min", focus: "Communication", completed: false },
  { id: 2, name: "Emergency Egress Procedures", duration: "75 min", focus: "Safety", completed: false },
  { id: 3, name: "Air Medical Evacuation Drills", duration: "120 min", focus: "Medical", completed: false },
  { id: 4, name: "High Altitude Readiness", duration: "100 min", focus: "Physiology", completed: false },
  { id: 5, name: "Rapid Deployment Protocol", duration: "85 min", focus: "Tactics", completed: false },
  { id: 6, name: "Equipment Management In-Flight", duration: "65 min", focus: "Operations", completed: false }
];

export default function AviationCrewReadiness() {
  const { setMenuOpen } = useContext(MenuContext);
  const [crew, setCrew] = useState(() => readJson("aviation-crew", initialCrew));
  const TACTICAL_COLOR = "#2d5f3a";

  useEffect(() => writeJson("aviation-crew", crew), [crew]);

  function toggleDrill(id) {
    setCrew((prev) =>
      prev.map((drill) =>
        drill.id === id ? { ...drill, completed: !drill.completed } : drill
      )
    );
  }

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>🚁 Aviation Crew Readiness</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>Helicopter, Air Medical</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {crew.map((drill) => (
            <div key={drill.id} onClick={() => toggleDrill(drill.id)} style={{ background: drill.completed ? "#1a2a1f" : "#111", border: `1px solid ${drill.completed ? TACTICAL_COLOR : "#333"}`, borderRadius: "10px", padding: "12px", cursor: "pointer", opacity: drill.completed ? 0.7 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ color: "white", fontSize: "16px", fontWeight: "600", textDecoration: drill.completed ? "line-through" : "none" }}>{drill.name}</div>
                <div style={{ color: TACTICAL_COLOR, fontWeight: "700" }}>{drill.completed ? "✓" : "○"}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
                <div>{drill.duration}</div>
                <div style={{ color: TACTICAL_COLOR }}>{drill.focus}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", padding: "12px", background: "#111", border: `1px solid ${TACTICAL_COLOR}`, borderRadius: "10px", fontSize: "13px", color: "#ccc" }}>
          <div style={{ color: TACTICAL_COLOR, fontWeight: "700", marginBottom: "8px" }}>Progress</div>
          <div>{crew.filter((d) => d.completed).length} of {crew.length} drills completed</div>
        </div>
      </div>

      <div onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", color: TACTICAL_COLOR, fontSize: "22px", textDecoration: "underline", cursor: "pointer", zIndex: 20 }}>
        Return to Menu
      </div>
    </div>
  );
}
