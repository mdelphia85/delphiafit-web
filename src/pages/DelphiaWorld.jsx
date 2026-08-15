import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const stats = [
  { name: "Global Athletes", value: "12.4M", growth: "+18%" },
  { name: "Teams", value: "2.1M", growth: "+24%" },
  { name: "Countries", value: "187", growth: "+12 new" },
  { name: "Training Sessions/Day", value: "94.2M", growth: "+31%" }
];

export default function DelphiaWorld() {
  const { setMenuOpen } = useContext(MenuContext);
  const WORLD_COLOR = "#3b82f6";

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
          <div style={{ color: WORLD_COLOR, fontSize: "28px", fontWeight: "700" }}>🌎 DelphiaFit World</div>
        </div>

        {stats.map((stat, idx) => (
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
            <div style={{ fontSize: "12px", color: "#999", marginBottom: "6px" }}>{stat.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: WORLD_COLOR, fontSize: "20px", fontWeight: "700" }}>{stat.value}</div>
              <div style={{ color: "#10b981", fontSize: "12px", fontWeight: "600" }}>{stat.growth}</div>
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
            color: WORLD_COLOR,
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
