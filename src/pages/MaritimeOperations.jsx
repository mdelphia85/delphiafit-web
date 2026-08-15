import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const initialOps = [
  { id: 1, name: "Small Boat Operations", duration: "100 min", skill: "Boarding", completed: false },
  { id: 2, name: "Vessel Boarding Techniques", duration: "120 min", skill: "Tactics", completed: false },
  { id: 3, name: "Diving Fundamentals", duration: "150 min", skill: "Diving", completed: false },
  { id: 4, name: "Water Rescue Protocols", duration: "90 min", skill: "Rescue", completed: false },
  { id: 5, name: "Harbor Security Drills", duration: "110 min", skill: "Security", completed: false },
  { id: 6, name: "Underwater Navigation", duration: "130 min", skill: "Diving", completed: false }
];

export default function MaritimeOperations() {
  const { setMenuOpen } = useContext(MenuContext);
  const [ops, setOps] = useState(() => readJson("maritime-ops", initialOps));
  const TACTICAL_COLOR = "#2d5f3a";

  useEffect(() => writeJson("maritime-ops", ops), [ops]);

  function toggleOp(id) {
    setOps((prev) =>
      prev.map((op) =>
        op.id === id ? { ...op, completed: !op.completed } : op
      )
    );
  }

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>⛵ Maritime Operations</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>Boarding, Diving, Rescue</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {ops.map((op) => (
            <div key={op.id} onClick={() => toggleOp(op.id)} style={{ background: op.completed ? "#1a2a1f" : "#111", border: `1px solid ${op.completed ? TACTICAL_COLOR : "#333"}`, borderRadius: "10px", padding: "12px", cursor: "pointer", opacity: op.completed ? 0.7 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ color: "white", fontSize: "16px", fontWeight: "600", textDecoration: op.completed ? "line-through" : "none" }}>{op.name}</div>
                <div style={{ color: TACTICAL_COLOR, fontWeight: "700" }}>{op.completed ? "✓" : "○"}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
                <div>{op.duration}</div>
                <div style={{ color: TACTICAL_COLOR }}>{op.skill}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", padding: "12px", background: "#111", border: `1px solid ${TACTICAL_COLOR}`, borderRadius: "10px", fontSize: "13px", color: "#ccc" }}>
          <div style={{ color: TACTICAL_COLOR, fontWeight: "700", marginBottom: "8px" }}>Progress</div>
          <div>{ops.filter((o) => o.completed).length} of {ops.length} operations completed</div>
        </div>
      </div>

      <div onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", color: TACTICAL_COLOR, fontSize: "22px", textDecoration: "underline", cursor: "pointer", zIndex: 20 }}>
        Return to Menu
      </div>
    </div>
  );
}
