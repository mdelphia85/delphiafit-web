import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function SportsAcademy() {
  const { setMenuOpen } = useContext(MenuContext);
  const SPORTS_COLOR = "#f59e0b";

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
          <div style={{ color: SPORTS_COLOR, fontSize: "28px", fontWeight: "700" }}>⚽ Sports Academy</div>
        </div>

        {[
          { name: "Basketball Training", drills: 24 },
          { name: "Soccer Skills", drills: 31 },
          { name: "Tennis Mastery", drills: 18 },
          { name: "Swimming Technique", drills: 22 }
        ].map((sport, idx) => (
          <div
            key={idx}
            style={{
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = SPORTS_COLOR)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
          >
            <div style={{ fontSize: "16px", fontWeight: "600" }}>{sport.name}</div>
            <div style={{ fontSize: "12px", color: SPORTS_COLOR, fontWeight: "600" }}>{sport.drills} drills</div>
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
            color: SPORTS_COLOR,
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
