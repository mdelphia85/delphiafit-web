import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const achievements = [
  { title: "Hydration Badge", category: "Profile Badge", earned: true, progress: 100 },
  { title: "Step Master", category: "Profile Badge", earned: true, progress: 100 },
  { title: "Strength Streak", category: "Profile Badge", earned: false, progress: 72 },
  { title: "Community Contributor", category: "Profile Badge", earned: false, progress: 60 },
  { title: "Top 10 Weekly", category: "Leaderboard Badge", earned: true, progress: 100 }
];

export default function Achievements() {
  const { setMenuOpen } = useContext(MenuContext);
  const ACHIEVEMENTS_COLOR = "dodgerblue";

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
          color: ACHIEVEMENTS_COLOR,
          fontSize: "32px",
          textAlign: "center",
          marginBottom: "30px"
        }}
      >
        Achievements
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {achievements.map((achievement, index) => (
          <div
            key={index}
            style={{
              background: "#111",
              border: `1px solid ${achievement.earned ? ACHIEVEMENTS_COLOR : "#333"}`,
              borderRadius: "12px",
              padding: "14px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
              <div style={{ color: ACHIEVEMENTS_COLOR, fontSize: "18px", fontWeight: "700" }}>
                {achievement.title}
              </div>
              <div style={{ color: achievement.earned ? "#b7f7c2" : "#ddd", fontSize: "12px" }}>
                {achievement.earned ? "Earned" : "In Progress"}
              </div>
            </div>

            <div style={{ color: "#ddd", fontSize: "14px", marginTop: "6px" }}>
              {achievement.category}
            </div>

            <div
              style={{
                width: "100%",
                height: "10px",
                background: "#222",
                borderRadius: "999px",
                overflow: "hidden",
                marginTop: "12px"
              }}
            >
              <div
                style={{
                  width: `${achievement.progress}%`,
                  height: "100%",
                  background: ACHIEVEMENTS_COLOR,
                  borderRadius: "999px"
                }}
              />
            </div>

            <div style={{ color: ACHIEVEMENTS_COLOR, fontSize: "12px", marginTop: "8px" }}>
              {achievement.progress}%
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
          color: ACHIEVEMENTS_COLOR,
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
