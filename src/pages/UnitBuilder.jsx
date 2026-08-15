import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const initialUnits = [
  { id: 1, name: "Custom Urban Team", type: "4-man", specialty: "Building Clearance", drills: 12, active: true },
  { id: 2, name: "Wilderness Rescue Unit", type: "8-man", specialty: "Terrain Navigation", drills: 8, active: true },
  { id: 3, name: "Hazmat Response Team", type: "6-man", specialty: "Chemical Handling", drills: 5, active: false }
];

export default function UnitBuilder() {
  const { setMenuOpen } = useContext(MenuContext);
  const [units, setUnits] = useState(() => readJson("custom-units", initialUnits));
  const [building, setBuilding] = useState(false);
  const [newUnit, setNewUnit] = useState({
    name: "",
    type: "4-man",
    specialty: "",
    drills: 0
  });

  const TACTICAL_COLOR = "#2d5f3a";

  useEffect(() => writeJson("custom-units", units), [units]);

  function createUnit() {
    if (!newUnit.name.trim() || !newUnit.specialty.trim()) return;

    const unit = {
      id: Date.now(),
      name: newUnit.name,
      type: newUnit.type,
      specialty: newUnit.specialty,
      drills: 0,
      active: true
    };

    setUnits((prev) => [unit, ...prev]);
    setNewUnit({ name: "", type: "4-man", specialty: "", drills: 0 });
    setBuilding(false);
  }

  function toggleUnit(id) {
    setUnits((prev) =>
      prev.map((unit) =>
        unit.id === id ? { ...unit, active: !unit.active } : unit
      )
    );
  }

  function deleteUnit(id) {
    setUnits((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>🛠️ Unit Builder</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>Custom Unit Configuration</div>
        </div>

        {!building ? (
          <>
            <button onClick={() => setBuilding(true)} style={{ width: "100%", padding: "12px", background: TACTICAL_COLOR, color: "black", border: "none", borderRadius: "10px", fontWeight: "700", marginBottom: "20px", cursor: "pointer" }}>
              + Create Custom Unit
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {units.map((unit) => (
                <div key={unit.id} style={{ background: "#111", border: `1px solid ${unit.active ? TACTICAL_COLOR : "#333"}`, borderRadius: "10px", padding: "12px", opacity: unit.active ? 1 : 0.6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <div style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>{unit.name}</div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <div onClick={() => toggleUnit(unit.id)} style={{ color: TACTICAL_COLOR, cursor: "pointer", fontWeight: "700" }}>
                        {unit.active ? "●" : "○"}
                      </div>
                      <div onClick={() => deleteUnit(unit.id)} style={{ color: "#ef4444", cursor: "pointer", fontSize: "16px" }}>
                        ✕
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: "12px", color: "#999", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ color: TACTICAL_COLOR }}>{unit.type}</span>
                    <span>•</span>
                    <span>{unit.specialty}</span>
                    <span>•</span>
                    <span>{unit.drills} drills</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ background: "#111", border: `1px solid ${TACTICAL_COLOR}`, borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ color: "#999", fontSize: "12px", marginBottom: "4px", display: "block" }}>Unit Name</label>
                <input type="text" value={newUnit.name} onChange={(e) => setNewUnit((prev) => ({ ...prev, name: e.target.value }))} placeholder="E.g., Team Alpha" style={{ width: "100%", padding: "8px", background: "#000", border: "1px solid #333", borderRadius: "6px", color: "white", boxSizing: "border-box" }} />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ color: "#999", fontSize: "12px", marginBottom: "4px", display: "block" }}>Team Size</label>
                <select value={newUnit.type} onChange={(e) => setNewUnit((prev) => ({ ...prev, type: e.target.value }))} style={{ width: "100%", padding: "8px", background: "#000", border: "1px solid #333", borderRadius: "6px", color: "white" }}>
                  <option>2-man</option>
                  <option>4-man</option>
                  <option>6-man</option>
                  <option>8-man</option>
                  <option>Squad</option>
                  <option>Platoon</option>
                </select>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ color: "#999", fontSize: "12px", marginBottom: "4px", display: "block" }}>Specialty</label>
                <input type="text" value={newUnit.specialty} onChange={(e) => setNewUnit((prev) => ({ ...prev, specialty: e.target.value }))} placeholder="E.g., Urban Ops" style={{ width: "100%", padding: "8px", background: "#000", border: "1px solid #333", borderRadius: "6px", color: "white", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={createUnit} style={{ flex: 1, padding: "10px", background: TACTICAL_COLOR, color: "black", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}>
                  Build Unit
                </button>
                <button onClick={() => { setBuilding(false); setNewUnit({ name: "", type: "4-man", specialty: "", drills: 0 }); }} style={{ flex: 1, padding: "10px", background: "#222", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
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
