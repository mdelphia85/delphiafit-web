import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const network = [
  { type: "Hospitals", count: 12400, patients: "48.2M" },
  { type: "Clinics", count: 28900, patients: "73.1M" },
  { type: "PT/Rehab Centers", count: 34200, patients: "62.8M" },
  { type: "Nutritionists", count: 127400, patients: "86.4M" },
  { type: "Therapists", count: 89300, patients: "52.1M" }
];

export default function GlobalHealthNetwork() {
  const { setMenuOpen } = useContext(MenuContext);
  const HEALTH_COLOR = "#dc2626";

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
          <div style={{ color: HEALTH_COLOR, fontSize: "28px", fontWeight: "700" }}>🌍 Global Health</div>
        </div>

        {network.map((provider, idx) => (
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
            <div style={{ fontWeight: "600", marginBottom: "6px" }}>{provider.type}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
              <div>🏥 {provider.count.toLocaleString()}</div>
              <div>👥 {provider.patients}</div>
            </div>
          </div>
        ))}

        <div
          style={{
            background: "#111",
            border: "1px solid #2a2a2a",
            borderRadius: "12px",
            padding: "14px",
            marginTop: "20px",
            textAlign: "center"
          }}
        >
          <div style={{ color: HEALTH_COLOR, fontWeight: "600", marginBottom: "4px" }}>Total Reach</div>
          <div style={{ fontSize: "18px", fontWeight: "700" }}>372.6M People</div>
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
            color: HEALTH_COLOR,
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
