import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function Achievements() {
  const { setMenuOpen } = useContext(MenuContext);

  // Native Achievements color
  const ACHIEVEMENTS_COLOR = "dodgerblue";

  // Placeholder achievements (structure only)
  const achievements = [
    { title: "Hydration Badge", category: "Profile Badge" },
    { title: "Step Master", category: "Profile Badge" },
    { title: "Strength Streak", category: "Profile Badge" },
    { title: "Community Contributor", category: "Profile Badge" },
    { title: "Top 10 Weekly", category: "Leaderboard Badge" }
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
          color: ACHIEVEMENTS_COLOR,
          fontSize: "32px",
          textAlign: "center",
          marginBottom: "30px"
        }}
      >
        Achievements
      </p>

      {/* ACHIEVEMENT LIST */}
      {achievements.map((a, index) => (
        <p
          key={index}
          style={{
            color: ACHIEVEMENTS_COLOR,
            fontSize: "24px",
            marginBottom: "20px"
          }}
        >
          {a.title} - {a.category}
        </p>
      ))}

      {/* RETURN TO MENU */}
      <p
        onClick={() => setMenuOpen(true)}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          color: ACHIEVEMENTS_COLOR,
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
