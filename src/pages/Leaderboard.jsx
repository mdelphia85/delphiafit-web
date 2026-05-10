import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function Leaderboard() {
  const { setMenuOpen } = useContext(MenuContext);

  const LEADERBOARD_COLOR = "dodgerblue";

  const leaderboard = [
    { rank: 1, name: "Alex", score: 1200 },
    { rank: 2, name: "Jordan", score: 1100 },
    { rank: 3, name: "Taylor", score: 950 },
    { rank: 4, name: "Chris", score: 900 },
    { rank: 5, name: "Morgan", score: 850 }
  ];

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        padding: "20px",
        overflowY: "auto",
        boxSizing: "border-box",
        position: "relative"
      }}
    >
      {/* TITLE */}
      <p
        style={{
          color: LEADERBOARD_COLOR,
          fontSize: "32px",
          textAlign: "center",
          marginBottom: "30px"
        }}
      >
        Leaderboard
      </p>

      {/* LEADERBOARD LIST */}
      {leaderboard.map((entry, index) => (
        <p
          key={index}
          style={{
            color: LEADERBOARD_COLOR,
            fontSize: "24px",
            marginBottom: "20px"
          }}
        >
          #{entry.rank} {entry.name} – {entry.score} pts
        </p>
      ))}

      {/* RETURN TO MENU */}
      <p
        onClick={() => setMenuOpen(true)}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          color: LEADERBOARD_COLOR,
          fontSize: "22px",
          textDecoration: "underline",
          cursor: "pointer"
        }}
      >
        Return to Menu
      </p>
    </div>
  );
}
