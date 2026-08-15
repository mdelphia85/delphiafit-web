import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const sportModules = [
  {
    id: "basketball",
    name: "Basketball Training",
    drills: [
      { name: "Form shooting", duration: "12 min" },
      { name: "Defensive slides", duration: "10 min" },
      { name: "Plyo jump training", duration: "15 min" }
    ]
  },
  {
    id: "soccer",
    name: "Soccer Skills",
    drills: [
      { name: "First touch rondo", duration: "14 min" },
      { name: "Finishing patterns", duration: "18 min" },
      { name: "Change of direction", duration: "12 min" }
    ]
  },
  {
    id: "tennis",
    name: "Tennis Mastery",
    drills: [
      { name: "Serve placement", duration: "10 min" },
      { name: "Footwork ladder", duration: "8 min" },
      { name: "Return drill", duration: "12 min" }
    ]
  },
  {
    id: "swimming",
    name: "Swimming Technique",
    drills: [
      { name: "Catch timing", duration: "11 min" },
      { name: "Turns and pushes", duration: "9 min" },
      { name: "Pull pattern", duration: "13 min" }
    ]
  }
];

export default function SportsAcademy() {
  const { setMenuOpen } = useContext(MenuContext);
  const SPORTS_COLOR = "#f59e0b";
  const [selectedSportId, setSelectedSportId] = useState(() => readJson("delphia-sports-selected", sportModules[0].id));
  const [completed, setCompleted] = useState(() => readJson("delphia-sports-completed", {}));

  useEffect(() => writeJson("delphia-sports-selected", selectedSportId), [selectedSportId]);
  useEffect(() => writeJson("delphia-sports-completed", completed), [completed]);

  const selectedSport = sportModules.find((sport) => sport.id === selectedSportId) || sportModules[0];

  function toggleCompleted(drillName) {
    setCompleted((prev) => ({
      ...prev,
      [`${selectedSport.id}:${drillName}`]: !prev[`${selectedSport.id}:${drillName}`]
    }));
  }

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: SPORTS_COLOR, fontSize: "28px", fontWeight: "700" }}>⚽ Sports Academy</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "22px" }}>
          {sportModules.map((sport, idx) => (
            <div key={idx} onClick={() => setSelectedSportId(sport.id)} style={{ background: selectedSportId === sport.id ? "#1a1a1a" : "#111", border: selectedSportId === sport.id ? `1px solid ${SPORTS_COLOR}` : "1px solid #2a2a2a", borderRadius: "12px", padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = SPORTS_COLOR)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = selectedSportId === sport.id ? SPORTS_COLOR : "#2a2a2a")}>
              <div style={{ fontSize: "16px", fontWeight: "600" }}>{sport.name}</div>
              <div style={{ fontSize: "12px", color: SPORTS_COLOR, fontWeight: "600" }}>{sport.drills.length} drills</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#111", border: `1px solid ${SPORTS_COLOR}`, borderRadius: "12px", padding: "14px" }}>
          <div style={{ color: SPORTS_COLOR, fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>{selectedSport.name}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {selectedSport.drills.map((drill) => {
              const key = `${selectedSport.id}:${drill.name}`;
              const isComplete = !!completed[key];

              return (
                <div key={drill.name} onClick={() => toggleCompleted(drill.name)} style={{ background: "#171717", border: isComplete ? `1px solid ${SPORTS_COLOR}` : "1px solid #333", borderRadius: "10px", padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontWeight: "600" }}>{drill.name}</div>
                    <div style={{ fontSize: "12px", color: "#999" }}>{drill.duration}</div>
                  </div>
                  <div style={{ color: isComplete ? SPORTS_COLOR : "#777", fontWeight: "700" }}>{isComplete ? "Done" : "Open"}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: "40px", background: "#000", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 16px", boxSizing: "border-box", zIndex: 20 }}>
        <div style={{ color: SPORTS_COLOR, fontSize: "18px", textDecoration: "underline", cursor: "pointer" }} onClick={() => setMenuOpen(true)}>
          Return to Menu
        </div>
      </div>
    </div>
  );
}
