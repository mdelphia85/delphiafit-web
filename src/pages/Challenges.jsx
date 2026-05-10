import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function Challenges() {
  const { setMenuOpen } = useContext(MenuContext);

  // Native Challenges color (same as Achievements)
  const CHALLENGES_COLOR = "dodgerblue";

  // Placeholder challenge list (structure only)
  const challenges = [
    { title: "7-Day Hydration Challenge", badge: "Hydration Badge" },
    { title: "10,000 Steps Daily", badge: "Step Master Badge" },
    { title: "Strength Streak", badge: "Strength Streak Badge" },
    { title: "Calorie Control", badge: "Calorie Discipline Badge" },
    { title: "Community Contributor", badge: "Community Contributor Badge" }
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
          color: CHALLENGES_COLOR,
          fontSize: "32px",
          textAlign: "center",
          marginBottom: "30px"
        }}
      >
        Community Challenges
      </p>

      {/* CHALLENGE LIST */}
      {challenges.map((c, index) => (
        <p
          key={index}
          style={{
            color: CHALLENGES_COLOR,
            fontSize: "24px",
            marginBottom: "20px"
          }}
        >
          {c.title} - {c.badge}
        </p>
      ))}

      {/* RETURN TO MENU */}
      <p
        onClick={() => setMenuOpen(true)}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          color: CHALLENGES_COLOR,
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
