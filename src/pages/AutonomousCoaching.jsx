import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const coaches = [
  { role: "AI Head Coach", status: "Active", teams: 320 },
  { role: "AI Assistant Coach", status: "Active", teams: 1200 },
  { role: "AI Position Coach", status: "Active", teams: 2840 },
  { role: "AI Recovery Coordinator", status: "Active", teams: 1560 },
  { role: "AI Nutrition Coordinator", status: "Active", teams: 980 },
  { role: "AI Performance Analyst", status: "Active", teams: 1420 }
];

export default function AutonomousCoaching() {
  const { setMenuOpen } = useContext(MenuContext);
  const AUTO_COLOR = "#14b8a6";

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
          <div style={{ color: AUTO_COLOR, fontSize: "28px", fontWeight: "700" }}>🤖 Autonomous Coaching</div>
        </div>

        {coaches.map((coach, idx) => (
          <div
            key={idx}
            style={{
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "10px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <div style={{ fontWeight: "600" }}>{coach.role}</div>
              <div style={{ color: AUTO_COLOR, fontSize: "11px", fontWeight: "600" }}>● {coach.status}</div>
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>📊 {coach.teams.toLocaleString()} teams</div>
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
            color: AUTO_COLOR,
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
