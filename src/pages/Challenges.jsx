import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const challenges = [
  { title: "7-Day Hydration Challenge", badge: "Hydration Badge", progress: 70, reward: "50 pts" },
  { title: "10,000 Steps Daily", badge: "Step Master Badge", progress: 82, reward: "75 pts" },
  { title: "Strength Streak", badge: "Strength Streak Badge", progress: 55, reward: "60 pts" },
  { title: "Calorie Control", badge: "Calorie Discipline Badge", progress: 61, reward: "40 pts" },
  { title: "Community Contributor", badge: "Community Contributor Badge", progress: 93, reward: "100 pts" }
];

export default function Challenges() {
  const { setMenuOpen } = useContext(MenuContext);
  const CHALLENGES_COLOR = "dodgerblue";

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
        color: "white",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <p
          style={{
            color: CHALLENGES_COLOR,
            fontSize: "32px",
            textAlign: "center",
            margin: "0 0 30px"
          }}
        >
          Community Challenges
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {challenges.map((challenge, index) => (
            <div
              key={index}
              style={{
                background: "#111",
                border: "1px solid #333",
                borderRadius: "12px",
                padding: "14px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                <div style={{ color: CHALLENGES_COLOR, fontSize: "18px", fontWeight: "700" }}>
                  {challenge.title}
                </div>
                <div style={{ color: "#ddd", fontSize: "12px" }}>{challenge.reward}</div>
              </div>

              <div style={{ color: "#ddd", fontSize: "14px", marginTop: "8px" }}>
                {challenge.badge}
              </div>

              <div
                style={{
                  width: "100%",
                  height: "10px",
                  background: "#222",
                  marginTop: "12px",
                  borderRadius: "999px",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    width: `${challenge.progress}%`,
                    height: "100%",
                    background: CHALLENGES_COLOR,
                    borderRadius: "999px"
                  }}
                />
              </div>

              <div style={{ color: CHALLENGES_COLOR, fontSize: "12px", marginTop: "8px" }}>
                {challenge.progress}% complete
              </div>
            </div>
          ))}
        </div>
      </div>

      <p
        onClick={() => setMenuOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          color: CHALLENGES_COLOR,
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
