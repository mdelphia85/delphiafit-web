// src/pages/Streaks.jsx
import { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function Streaks() {
  const { openMenu } = useContext(MenuContext);

  const BLACK = "rgb(0,0,0)";
  const BLUE = "#4464FF";
  const WHITE = "rgb(255,255,255)";

  // Temporary hardcoded streaks (SQLite backend will replace this later)
  const streaks = [
    { title: "Hydration Streak", days: 4 },
    { title: "Workout Streak", days: 6 },
    { title: "Meal Logging Streak", days: 3 },
    { title: "Community Posting Streak", days: 2 },
    { title: "Challenge Completion Streak", days: 5 },
    { title: "Journal Streak", days: 7 }
  ];

  const container = {
    width: "100vw",
    height: "100vh",
    background: BLACK,
    padding: "16px",
    paddingBottom: "60px", // space above footer
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    overflowY: "auto"
  };

  const inner = {
    width: "360px",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  };

  const header = {
    color: BLUE,
    fontSize: "22px",
    textAlign: "center",
    marginTop: "8px",
    marginBottom: "8px"
  };

  const streakText = {
    color: BLUE,
    fontSize: "18px",
    marginBottom: "4px"
  };

  const footer = {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "40px",
    background: BLACK,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    boxSizing: "border-box"
  };

  const returnStyle = {
    color: BLUE,
    fontSize: "18px",
    textDecoration: "underline",
    cursor: "pointer",
    marginLeft: "auto"
  };

  return (
    <div style={container}>
      <div style={inner}>
        <div style={header}>Streaks</div>

        {streaks.map((s, i) => (
          <div key={i} style={streakText}>
            {s.title} - {s.days} days
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={footer}>
        <div style={returnStyle} onClick={openMenu}>
          Return to Menu
        </div>
      </div>
    </div>
  );
}
