import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const features = [
  "Unified cloud platform",
  "Cross-device syncing",
  "Edge-AI processing",
  "Offline mode support",
  "Global scaling infrastructure",
  "Real-time data sync"
];

export default function CloudOS() {
  const { setMenuOpen } = useContext(MenuContext);
  const CLOUD_COLOR = "#10b981";

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
          <div style={{ color: CLOUD_COLOR, fontSize: "28px", fontWeight: "700" }}>☁️ Cloud OS</div>
        </div>

        {features.map((feature, idx) => (
          <div
            key={idx}
            style={{
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
          >
            <div style={{ color: CLOUD_COLOR, fontSize: "18px" }}>✓</div>
            <div style={{ fontWeight: "500" }}>{feature}</div>
          </div>
        ))}

        <button
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            background: CLOUD_COLOR,
            color: "#000",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Enable Cloud Sync
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
            color: CLOUD_COLOR,
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
