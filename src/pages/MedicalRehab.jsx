import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const protocols = [
  { name: "ACL Rehabilitation", phase: "Phase 2", progress: "65%", nextSession: "2026-08-16" },
  { name: "Shoulder Mobility", phase: "Phase 1", progress: "40%", nextSession: "2026-08-15" },
  { name: "Return to Play", phase: "Phase 3", progress: "80%", nextSession: "2026-08-18" }
];

export default function MedicalRehab() {
  const { setMenuOpen } = useContext(MenuContext);
  const MED_COLOR = "#ef4444";

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
          <div style={{ color: MED_COLOR, fontSize: "28px", fontWeight: "700" }}>🏥 Medical + Rehab</div>
        </div>

        {protocols.map((protocol, idx) => (
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
            <div style={{ fontWeight: "600", marginBottom: "6px" }}>{protocol.name}</div>
            <div style={{ fontSize: "12px", color: "#999", marginBottom: "6px" }}>{protocol.phase}</div>
            <div style={{ width: "100%", height: "6px", background: "#222", borderRadius: "3px", marginBottom: "6px", overflow: "hidden" }}>
              <div style={{ width: protocol.progress, height: "100%", background: MED_COLOR, borderRadius: "3px" }}></div>
            </div>
            <div style={{ fontSize: "11px", color: "#666" }}>Next: {protocol.nextSession}</div>
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
            color: MED_COLOR,
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
