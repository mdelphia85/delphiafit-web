import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const initialReplays = [
  { id: 1, name: "Urban Rescue - 2026-08-14", duration: "1:23:45", score: "92%", mistakes: 3, timestamp: "Today" },
  { id: 2, name: "Desert Patrol - 2026-08-12", duration: "0:45:22", score: "88%", mistakes: 5, timestamp: "2 days ago" },
  { id: 3, name: "Maritime Op - 2026-08-10", duration: "2:10:15", score: "95%", mistakes: 1, timestamp: "4 days ago" },
  { id: 4, name: "Mountain Extraction - 2026-08-08", duration: "1:55:30", score: "85%", mistakes: 8, timestamp: "1 week ago" }
];

export default function MissionReplay() {
  const { setMenuOpen } = useContext(MenuContext);
  const [replays, setReplays] = useState(() => readJson("mission-replays", initialReplays));
  const [selectedReplay, setSelectedReplay] = useState(null);
  const TACTICAL_COLOR = "#2d5f3a";

  useEffect(() => writeJson("mission-replays", replays), [replays]);

  const getScoreColor = (score) => {
    const num = parseInt(score);
    if (num >= 90) return "#10b981";
    if (num >= 80) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>▶️ Mission Replay</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>Review & Analysis</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {replays.map((replay) => (
            <div key={replay.id} onClick={() => setSelectedReplay(replay.id)} style={{ background: selectedReplay === replay.id ? "#1a2a1f" : "#111", border: `1px solid ${selectedReplay === replay.id ? TACTICAL_COLOR : "#333"}`, borderRadius: "10px", padding: "12px", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>{replay.name}</div>
                <div style={{ color: getScoreColor(replay.score), fontSize: "14px", fontWeight: "700" }}>{replay.score}</div>
              </div>

              <div style={{ fontSize: "12px", color: "#999", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span>{replay.duration}</span>
                <span>•</span>
                <span style={{ color: TACTICAL_COLOR }}>{replay.mistakes} mistakes</span>
                <span>•</span>
                <span>{replay.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {selectedReplay && (
          <div style={{ background: "#111", border: `1px solid ${TACTICAL_COLOR}`, borderRadius: "10px", padding: "14px", marginTop: "20px" }}>
            <div style={{ color: TACTICAL_COLOR, fontSize: "16px", fontWeight: "700", marginBottom: "12px" }}>Analysis</div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "#ccc" }}>
              <div style={{ padding: "10px", background: "#000", borderRadius: "6px" }}>
                <div style={{ color: TACTICAL_COLOR, fontWeight: "700", marginBottom: "4px" }}>Movement Patterns</div>
                <div>Analyzed 127 position changes</div>
              </div>

              <div style={{ padding: "10px", background: "#000", borderRadius: "6px" }}>
                <div style={{ color: TACTICAL_COLOR, fontWeight: "700", marginBottom: "4px" }}>Team Coordination</div>
                <div>Sync score: 94% • Communication: Clear</div>
              </div>

              <div style={{ padding: "10px", background: "#000", borderRadius: "6px" }}>
                <div style={{ color: TACTICAL_COLOR, fontWeight: "700", marginBottom: "4px" }}>Gear Impact</div>
                <div>Load affected mobility by 18%</div>
              </div>

              <div style={{ padding: "10px", background: "#000", borderRadius: "6px" }}>
                <div style={{ color: TACTICAL_COLOR, fontWeight: "700", marginBottom: "4px" }}>Key Mistakes</div>
                <div>• Delayed formation breach (0:12:30)</div>
                <div>• Missed sector sweep (0:45:15)</div>
                <div>• Slow equipment transition (1:05:22)</div>
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
