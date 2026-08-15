import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function DelphiaProAnalytics() {
  const { setMenuOpen } = useContext(MenuContext);
  const PRO_COLOR = "#06b6d4";

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
          <div style={{ color: PRO_COLOR, fontSize: "28px", fontWeight: "700" }}>⚡ DelphiaFit Pro</div>
        </div>

        {[
          { label: "VO₂ Max", value: "52.3", unit: "ml/kg/min", icon: "💨" },
          { label: "Power Output", value: "385", unit: "watts", icon: "⚡" },
          { label: "Max Speed", value: "21.5", unit: "km/h", icon: "🚀" },
          { label: "Sport Score", value: "8.7/10", unit: "Elite", icon: "🏆" }
        ].map((metric, idx) => (
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
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>{metric.icon}</div>
              <div style={{ fontSize: "12px", color: "#999" }}>{metric.label}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "20px", fontWeight: "700", color: PRO_COLOR }}>{metric.value}</div>
              <div style={{ fontSize: "11px", color: "#999" }}>{metric.unit}</div>
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
            color: PRO_COLOR,
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
