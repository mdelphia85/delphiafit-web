import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const initialMissions = [
  { id: 1, name: "Wilderness Rescue Basics", duration: "90 min", type: "Wilderness", completed: false },
  { id: 2, name: "Urban Building Search", duration: "75 min", type: "Urban", completed: false },
  { id: 3, name: "Disaster Rubble Navigation", duration: "120 min", type: "Disaster", completed: false },
  { id: 4, name: "Rope Rescue Fundamentals", duration: "100 min", type: "Wilderness", completed: false },
  { id: 5, name: "Water Rescue Operations", duration: "85 min", type: "Water", completed: false },
  { id: 6, name: "Night Search Coordination", duration: "110 min", type: "Advanced", completed: false }
];

export default function SearchRescue() {
  const { setMenuOpen } = useContext(MenuContext);
  const [missions, setMissions] = useState(() => readJson("sar-missions", initialMissions));
  const TACTICAL_COLOR = "#2d5f3a";

  useEffect(() => writeJson("sar-missions", missions), [missions]);

  function toggleMission(id) {
    setMissions((prev) =>
      prev.map((mission) =>
        mission.id === id ? { ...mission, completed: !mission.completed } : mission
      )
    );
  }

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>🧗 Search & Rescue</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>Wilderness, Urban, Disaster</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {missions.map((mission) => (
            <div key={mission.id} onClick={() => toggleMission(mission.id)} style={{ background: mission.completed ? "#1a2a1f" : "#111", border: `1px solid ${mission.completed ? TACTICAL_COLOR : "#333"}`, borderRadius: "10px", padding: "12px", cursor: "pointer", opacity: mission.completed ? 0.7 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ color: "white", fontSize: "16px", fontWeight: "600", textDecoration: mission.completed ? "line-through" : "none" }}>{mission.name}</div>
                <div style={{ color: TACTICAL_COLOR, fontWeight: "700" }}>{mission.completed ? "✓" : "○"}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
                <div>{mission.duration}</div>
                <div style={{ color: TACTICAL_COLOR }}>{mission.type}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", padding: "12px", background: "#111", border: `1px solid ${TACTICAL_COLOR}`, borderRadius: "10px", fontSize: "13px", color: "#ccc" }}>
          <div style={{ color: TACTICAL_COLOR, fontWeight: "700", marginBottom: "8px" }}>Progress</div>
          <div>{missions.filter((m) => m.completed).length} of {missions.length} missions completed</div>
        </div>
      </div>

      <div onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", color: TACTICAL_COLOR, fontSize: "22px", textDecoration: "underline", cursor: "pointer", zIndex: 20 }}>
        Return to Menu
      </div>
    </div>
  );
}
