import React, { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function DelphiaLive() {
  const { setMenuOpen } = useContext(MenuContext);
  const LIVE_COLOR = "#ff0000";
  const [isLive] = useState(true);

  const sessions = [
    { title: "Morning Strength Training", instructor: "Coach Mike", viewers: 1240, duration: "45 min" },
    { title: "Evening HIIT Session", instructor: "Coach Sarah", viewers: 820, duration: "30 min" },
    { title: "Live Competition: Elite Track", instructor: "Ref James", viewers: 3100, duration: "90 min" }
  ];

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
        <div style={{ textAlign: "center", marginBottom: "20px", position: "relative" }}>
          <div style={{ color: LIVE_COLOR, fontSize: "28px", fontWeight: "700" }}>🔴 DelphiaFit LIVE</div>
          {isLive && <div style={{ color: LIVE_COLOR, fontSize: "12px", fontWeight: "600", marginTop: "4px" }}>● LIVE NOW</div>}
        </div>

        {sessions.map((session, idx) => (
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
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = LIVE_COLOR)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <div style={{ fontWeight: "600" }}>{session.title}</div>
              <div style={{ color: LIVE_COLOR, fontSize: "11px", fontWeight: "600" }}>🔴</div>
            </div>
            <div style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>by {session.instructor}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#666" }}>
              <div>👁️ {session.viewers.toLocaleString()}</div>
              <div>⏱️ {session.duration}</div>
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
            color: LIVE_COLOR,
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
