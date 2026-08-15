import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const athletes = [
  { name: "Alex Johnson", sport: "Soccer", height: "6'0\"", score: 8.9 },
  { name: "Emma Wilson", sport: "Basketball", height: "5'11\"", score: 8.7 },
  { name: "James Lee", sport: "Track", height: "5'9\"", score: 8.5 }
];

export default function RecruitingProfiles() {
  const { setMenuOpen } = useContext(MenuContext);
  const RECRUIT_COLOR = "#f97316";

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#000",
        padding: "16px 16px 90px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        overflowY: "auto",
        color: "#fff"
      }}
    >
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: RECRUIT_COLOR, fontSize: "28px", fontWeight: "700" }}>⭐ Recruiting</div>
        </div>

        {athletes.map((athlete, idx) => (
          <div
            key={idx}
            style={{
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "10px",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = RECRUIT_COLOR)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <div style={{ fontWeight: "600" }}>{athlete.name}</div>
              <div style={{ color: RECRUIT_COLOR, fontWeight: "600" }}>★ {athlete.score}</div>
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
              {athlete.sport} • {athlete.height}
            </div>
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
          background: "#000",
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
            color: RECRUIT_COLOR,
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
