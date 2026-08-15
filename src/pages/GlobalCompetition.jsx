import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const tournaments = [
  { name: "Global Athletics Championship", date: "2026-09-15", tier: "Elite", participants: 1240 },
  { name: "Regional Basketball League", date: "2026-09-20", tier: "Pro", participants: 520 },
  { name: "International Youth Games", date: "2026-10-05", tier: "Youth", participants: 3100 }
];

export default function GlobalCompetition() {
  const { setMenuOpen } = useContext(MenuContext);
  const GLOBAL_COLOR = "#06b6d4";

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
          <div style={{ color: GLOBAL_COLOR, fontSize: "28px", fontWeight: "700" }}>🌍 Global Tournaments</div>
        </div>

        {tournaments.map((tournament, idx) => (
          <div
            key={idx}
            style={{
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "10px"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = GLOBAL_COLOR)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <div style={{ fontWeight: "600" }}>{tournament.name}</div>
              <div style={{ color: GLOBAL_COLOR, fontSize: "11px", fontWeight: "600" }}>{tournament.tier}</div>
            </div>
            <div style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>{tournament.date}</div>
            <div style={{ fontSize: "11px", color: "#666" }}>👥 {tournament.participants} registered</div>
          </div>
        ))}

        <button
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            background: GLOBAL_COLOR,
            color: "#000",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          + Join Tournament
        </button>
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
            color: GLOBAL_COLOR,
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
