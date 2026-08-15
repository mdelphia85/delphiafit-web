import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const initialDrills = [
  { id: 1, name: "Urban Breach Drill", trainees: 12, duration: "2 hours", status: "Active", created: "2 weeks ago" },
  { id: 2, name: "Wilderness Navigation", trainees: 8, duration: "4 hours", status: "Active", created: "3 weeks ago" },
  { id: 3, name: "Medical Response Scenario", trainees: 6, duration: "3 hours", status: "Paused", created: "1 month ago" },
  { id: 4, name: "Team Coordination Drill", trainees: 14, duration: "2.5 hours", status: "Active", created: "10 days ago" }
];

export default function InstructorPortal() {
  const { setMenuOpen } = useContext(MenuContext);
  const [drills, setDrills] = useState(() => readJson("instructor-drills", initialDrills));
  const [building, setBuilding] = useState(false);
  const TACTICAL_COLOR = "#2d5f3a";

  useEffect(() => writeJson("instructor-drills", drills), [drills]);

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>👨‍🏫 Instructor Portal</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>Drill Management & Training</div>
        </div>

        <button onClick={() => setBuilding(!building)} style={{ width: "100%", padding: "12px", background: TACTICAL_COLOR, color: "black", border: "none", borderRadius: "10px", fontWeight: "700", marginBottom: "20px", cursor: "pointer" }}>
          {building ? "Cancel" : "+ Create Drill"}
        </button>

        {building && (
          <div style={{ background: "#111", border: `1px solid ${TACTICAL_COLOR}`, borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ color: "#999", fontSize: "12px", marginBottom: "4px", display: "block" }}>Drill Name</label>
              <input type="text" placeholder="E.g., Extraction Drill" style={{ width: "100%", padding: "8px", background: "#000", border: "1px solid #333", borderRadius: "6px", color: "white", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ color: "#999", fontSize: "12px", marginBottom: "4px", display: "block" }}>Number of Trainees</label>
              <input type="number" placeholder="0" style={{ width: "100%", padding: "8px", background: "#000", border: "1px solid #333", borderRadius: "6px", color: "white", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ color: "#999", fontSize: "12px", marginBottom: "4px", display: "block" }}>Duration (hours)</label>
              <input type="number" placeholder="0" style={{ width: "100%", padding: "8px", background: "#000", border: "1px solid #333", borderRadius: "6px", color: "white", boxSizing: "border-box" }} />
            </div>

            <button style={{ width: "100%", padding: "10px", background: TACTICAL_COLOR, color: "black", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}>
              Create Drill
            </button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {drills.map((drill) => (
            <div key={drill.id} style={{ background: "#111", border: `1px solid ${drill.status === "Active" ? TACTICAL_COLOR : "#333"}`, borderRadius: "10px", padding: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>{drill.name}</div>
                <div style={{ color: drill.status === "Active" ? TACTICAL_COLOR : "#999", fontSize: "11px", fontWeight: "700" }}>{drill.status}</div>
              </div>

              <div style={{ fontSize: "12px", color: "#999", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span>{drill.trainees} trainees</span>
                <span>•</span>
                <span>{drill.duration}</span>
                <span>•</span>
                <span>Created {drill.created}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", color: TACTICAL_COLOR, fontSize: "22px", textDecoration: "underline", cursor: "pointer", zIndex: 20 }}>
        Return to Menu
      </div>
    </div>
  );
}
