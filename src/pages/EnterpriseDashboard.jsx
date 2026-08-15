import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function EnterpriseDashboard() {
  const { setMenuOpen } = useContext(MenuContext);
  const ENTERPRISE_COLOR = "#8b5cf6";

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
          <div style={{ color: ENTERPRISE_COLOR, fontSize: "28px", fontWeight: "700" }}>🏢 Enterprise</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          {[
            { label: "Organizations", value: 3, icon: "🏢" },
            { label: "Total Users", value: 1240, icon: "👥" },
            { label: "API Calls", value: "2.3M", icon: "📡" },
            { label: "Uptime", value: "99.9%", icon: "✓" }
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: "#111",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                padding: "14px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "18px", marginBottom: "6px" }}>{stat.icon}</div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: ENTERPRISE_COLOR, marginBottom: "4px" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "11px", color: "#999" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            style={{
              padding: "12px",
              background: ENTERPRISE_COLOR,
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Manage Organizations
          </button>
          <button
            style={{
              padding: "12px",
              background: "#222",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            API Documentation
          </button>
          <button
            style={{
              padding: "12px",
              background: "#222",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            White-Label Settings
          </button>
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
            color: ENTERPRISE_COLOR,
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
