import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const graphs = [
  { name: "Athlete Graph", nodes: 2400000, connections: 12000000 },
  { name: "Team Graph", nodes: 850000, connections: 5200000 },
  { name: "Coach Graph", nodes: 240000, connections: 1100000 },
  { name: "Performance Graph", nodes: 15000000, connections: 32000000 },
  { name: "Recovery Graph", nodes: 8200000, connections: 18000000 },
  { name: "Skill Graph", nodes: 5100000, connections: 11000000 }
];

export default function IntelligenceGraph() {
  const { setMenuOpen } = useContext(MenuContext);
  const INTEL_COLOR = "#6366f1";

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
          <div style={{ color: INTEL_COLOR, fontSize: "28px", fontWeight: "700" }}>🧠 Intelligence Graph</div>
        </div>

        {graphs.map((graph, idx) => (
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
            <div style={{ fontWeight: "600", marginBottom: "6px" }}>{graph.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
              <div>🔹 {(graph.nodes / 1000000).toFixed(1)}M nodes</div>
              <div>🔗 {(graph.connections / 1000000).toFixed(1)}M edges</div>
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
            color: INTEL_COLOR,
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
