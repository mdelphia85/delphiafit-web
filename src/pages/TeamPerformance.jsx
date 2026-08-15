import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function TeamPerformance() {
  const { setMenuOpen } = useContext(MenuContext);
  const PERF_COLOR = "#34d399";

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
          <div style={{ color: PERF_COLOR, fontSize: "28px", fontWeight: "700" }}>📊 Team Performance</div>
        </div>

        {[
          { label: "Team Workload", value: "High", trend: "↑ 12%" },
          { label: "Avg Recovery", value: "72%", trend: "→ Stable" },
          { label: "Injury Risk", value: "Low", trend: "↓ 3%" },
          { label: "Performance Index", value: "8.2/10", trend: "↑ 5%" }
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
            <div style={{ fontWeight: "600" }}>{metric.label}</div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "16px", fontWeight: "700", color: PERF_COLOR }}>{metric.value}</div>
              <div style={{ fontSize: "11px", color: "#999" }}>{metric.trend}</div>
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
            color: PERF_COLOR,
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
