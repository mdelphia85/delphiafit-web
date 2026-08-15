import { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const streaks = [
  { title: "Hydration Streak", days: 4, tone: "Daily" },
  { title: "Workout Streak", days: 6, tone: "Consistency" },
  { title: "Meal Logging Streak", days: 3, tone: "Routine" },
  { title: "Community Posting Streak", days: 2, tone: "Momentum" },
  { title: "Challenge Completion Streak", days: 5, tone: "Focus" },
  { title: "Journal Streak", days: 7, tone: "Reflection" }
];

export default function Streaks() {
  const { setMenuOpen } = useContext(MenuContext);

  const BLACK = "rgb(0,0,0)";
  const BLUE = "#4464FF";

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: BLACK,
        padding: "16px 16px 90px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        overflowY: "auto",
        color: "#fff"
      }}
    >
      <div
        style={{
          width: "360px",
          maxWidth: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}
      >
        <div
          style={{
            color: BLUE,
            fontSize: "22px",
            textAlign: "center",
            marginTop: "8px",
            marginBottom: "8px"
          }}
        >
          Streaks
        </div>

        {streaks.map((s, i) => (
          <div
            key={i}
            style={{
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "12px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ color: BLUE, fontSize: "18px", fontWeight: "700" }}>{s.title}</div>
              <div style={{ color: "#bbb", fontSize: "12px", marginTop: "4px" }}>{s.tone}</div>
            </div>
            <div style={{ color: BLUE, fontSize: "18px", fontWeight: "700" }}>{s.days} days</div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "40px",
          background: BLACK,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 16px",
          boxSizing: "border-box",
          zIndex: 20
        }}
      >
        <div
          style={{
            color: BLUE,
            fontSize: "18px",
            textDecoration: "underline",
            cursor: "pointer"
          }}
          onClick={() => setMenuOpen(true)}
        >
          Return to Menu
        </div>
      </div>
    </div>
  );
}
