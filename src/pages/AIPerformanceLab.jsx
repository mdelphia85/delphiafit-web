import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const biomechanics = [
  { metric: "Form Score", value: "8.7/10", status: "Excellent" },
  { metric: "Velocity", value: "12.4 m/s", status: "Peak" },
  { metric: "Force Production", value: "1240 lbs", status: "Strong" },
  { metric: "Injury Risk", value: "2.1%", status: "Low" }
];

export default function AIPerformanceLab() {
  const { setMenuOpen } = useContext(MenuContext);
  const LAB_COLOR = "#8b5cf6";

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
          <div style={{ color: LAB_COLOR, fontSize: "28px", fontWeight: "700" }}>🔬 Performance Lab</div>
        </div>

        {biomechanics.map((bio, idx) => (
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
              <div style={{ fontWeight: "600" }}>{bio.metric}</div>
              <div style={{ color: LAB_COLOR, fontWeight: "600" }}>{bio.value}</div>
            </div>
            <div style={{ fontSize: "11px", color: "#999" }}>Status: {bio.status}</div>
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
            color: LAB_COLOR,
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
