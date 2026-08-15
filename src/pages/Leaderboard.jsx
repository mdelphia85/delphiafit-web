import React, { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const leaderboardData = [
  { rank: 1, name: "Ava", score: 1420, tag: "Strength leader" },
  { rank: 2, name: "Marcus", score: 1365, tag: "Cardio king" },
  { rank: 3, name: "Jasmine", score: 1288, tag: "Streak star" },
  { rank: 4, name: "Daniel", score: 1190, tag: "Recovery expert" },
  { rank: 5, name: "You", score: 1045, tag: "On the rise" }
];

export default function Leaderboard() {
  const { setMenuOpen } = useContext(MenuContext);
  const [mode, setMode] = useState("weekly");

  const LEADERBOARD_COLOR = "dodgerblue";

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "black",
        padding: "20px 20px 90px",
        overflowY: "auto",
        boxSizing: "border-box",
        position: "relative",
        color: "white"
      }}
    >
      <p
        style={{
          color: LEADERBOARD_COLOR,
          fontSize: "32px",
          textAlign: "center",
          marginBottom: "20px"
        }}
      >
        Leaderboard
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        {[
          { label: "Weekly", value: "weekly" },
          { label: "Monthly", value: "monthly" },
          { label: "All Time", value: "alltime" }
        ].map(item => (
          <button
            key={item.value}
            onClick={() => setMode(item.value)}
            style={{
              background: mode === item.value ? LEADERBOARD_COLOR : "transparent",
              color: mode === item.value ? "black" : LEADERBOARD_COLOR,
              border: `1px solid ${LEADERBOARD_COLOR}`,
              borderRadius: "999px",
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: "700"
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {leaderboardData.map(entry => (
          <div
            key={entry.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#111",
              border: entry.name === "You" ? `1px solid ${LEADERBOARD_COLOR}` : "1px solid #333",
              borderRadius: "12px",
              padding: "12px 14px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ color: LEADERBOARD_COLOR, fontSize: "20px", fontWeight: "700" }}>
                #{entry.rank}
              </div>
              <div>
                <div style={{ color: "white", fontSize: "18px", fontWeight: "600" }}>{entry.name}</div>
                <div style={{ color: "#aaa", fontSize: "12px" }}>{entry.tag}</div>
              </div>
            </div>

            <div style={{ color: LEADERBOARD_COLOR, fontSize: "18px", fontWeight: "700" }}>
              {entry.score} pts
            </div>
          </div>
        ))}
      </div>

      <p
        onClick={() => setMenuOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          color: LEADERBOARD_COLOR,
          fontSize: "22px",
          textDecoration: "underline",
          cursor: "pointer",
          zIndex: 20
        }}
      >
        Return to Menu
      </p>
    </div>
  );
}
