import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const ecosystem = [
  { component: "Autonomous Coaching", status: "Fully Active", uptime: "99.98%" },
  { component: "Autonomous Scheduling", status: "Fully Active", uptime: "99.97%" },
  { component: "Autonomous Nutrition", status: "Fully Active", uptime: "99.96%" },
  { component: "Autonomous Recovery", status: "Fully Active", uptime: "99.98%" },
  { component: "Performance Forecasting", status: "Fully Active", uptime: "99.95%" },
  { component: "Adaptation Engine", status: "Fully Active", uptime: "99.99%" }
];

export default function AutonomousEcosystem() {
  const { setMenuOpen } = useContext(MenuContext);
  const AUTO_COLOR = "#0891b2";

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
          <div style={{ color: AUTO_COLOR, fontSize: "28px", fontWeight: "700" }}>⚙️ Autonomous Ecosystem</div>
        </div>

        {ecosystem.map((component, idx) => (
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
            <div style={{ fontWeight: "600", marginBottom: "6px" }}>{component.component}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
              <div style={{ color: AUTO_COLOR }}>● {component.status}</div>
              <div>⬆️ {component.uptime}</div>
            </div>
          </div>
        ))}

        <div
          style={{
            background: "linear-gradient(135deg, #0891b2, #06b6d4)",
            borderRadius: "12px",
            padding: "16px",
            marginTop: "20px",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: "12px", color: "#fff", opacity: 0.9, marginBottom: "4px" }}>ECOSYSTEM STATUS</div>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "#fff" }}>FULLY AUTONOMOUS</div>
        </div>
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
