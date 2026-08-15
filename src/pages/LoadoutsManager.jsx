import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const gearPresets = [
  { id: 1, name: "Firefighter Turnout", weight: "75 lbs", type: "Fire", items: ["Turnout Gear", "SCBA", "Helmet", "Boots"], selected: false },
  { id: 2, name: "Police Duty", weight: "35 lbs", type: "Police", items: ["Duty Belt", "Duty Uniform", "Vest", "Equipment"], selected: false },
  { id: 3, name: "EMS Trauma Kit", weight: "25 lbs", type: "Medical", items: ["Medic Bag", "Cardiac Monitor", "Airway Kit", "Trauma Supplies"], selected: false },
  { id: 4, name: "Military Ruck", weight: "80 lbs", type: "Military", items: ["Rucksack", "Ammunition", "Rations", "Water", "Gear"], selected: false },
  { id: 5, name: "SWAT Breach", weight: "60 lbs", type: "Tactical", items: ["Breaching Tool", "Charge", "Vest", "Helmet", "Weapon"], selected: false },
  { id: 6, name: "SOF Dive", weight: "90 lbs", type: "Maritime", items: ["Dive Gear", "Rebreather", "Weapons", "Explosives"], selected: false }
];

export default function LoadoutsManager() {
  const { setMenuOpen } = useContext(MenuContext);
  const [loadouts, setLoadouts] = useState(() => readJson("loadouts", gearPresets));
  const [selectedLoadout, setSelectedLoadout] = useState(null);
  const TACTICAL_COLOR = "#2d5f3a";

  useEffect(() => writeJson("loadouts", loadouts), [loadouts]);

  function toggleLoadout(id) {
    setLoadouts((prev) =>
      prev.map((loadout) =>
        loadout.id === id ? { ...loadout, selected: !loadout.selected } : loadout
      )
    );
    setSelectedLoadout(id);
  }

  const activeLoadout = loadouts.find((l) => l.selected);

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>🎒 Loadouts Manager</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>Gear Selection & Customization</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          {loadouts.map((loadout) => (
            <div key={loadout.id} onClick={() => toggleLoadout(loadout.id)} style={{ background: loadout.selected ? "#1a2a1f" : "#111", border: `1px solid ${loadout.selected ? TACTICAL_COLOR : "#333"}`, borderRadius: "10px", padding: "12px", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>{loadout.name}</div>
                <div style={{ color: TACTICAL_COLOR, fontWeight: "700" }}>{loadout.selected ? "✓" : "○"}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
                <div style={{ color: TACTICAL_COLOR }}>{loadout.type}</div>
                <div style={{ color: TACTICAL_COLOR, fontWeight: "600" }}>{loadout.weight}</div>
              </div>
            </div>
          ))}
        </div>

        {activeLoadout && (
          <div style={{ background: "#111", border: `1px solid ${TACTICAL_COLOR}`, borderRadius: "10px", padding: "14px" }}>
            <div style={{ color: TACTICAL_COLOR, fontSize: "16px", fontWeight: "700", marginBottom: "12px" }}>Active Loadout</div>

            <div style={{ marginBottom: "12px" }}>
              <div style={{ color: "#999", fontSize: "12px", marginBottom: "8px" }}>Equipment:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {activeLoadout.items.map((item, idx) => (
                  <div key={idx} style={{ color: "#ccc", fontSize: "13px", paddingLeft: "12px" }}>
                    • {item}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "12px", background: "#000", borderRadius: "8px", marginTop: "12px" }}>
              <div style={{ color: TACTICAL_COLOR, fontWeight: "700", marginBottom: "6px" }}>Load Impact</div>
              <div style={{ color: "#999", fontSize: "12px" }}>
                <div>Weight: {activeLoadout.weight}</div>
                <div>Movement Speed: -25%</div>
                <div>Endurance Drain: +15%</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", color: TACTICAL_COLOR, fontSize: "22px", textDecoration: "underline", cursor: "pointer", zIndex: 20 }}>
        Return to Menu
      </div>
    </div>
  );
}
