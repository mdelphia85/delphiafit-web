import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const features = [
  "Enterprise AI",
  "Enterprise analytics",
  "Enterprise compliance",
  "Enterprise scheduling",
  "Enterprise forecasting",
  "Multi-organization management"
];

export default function EnterpriseCloud() {
  const { setMenuOpen } = useContext(MenuContext);
  const ENT_COLOR = "#a855f7";

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
          <div style={{ color: ENT_COLOR, fontSize: "28px", fontWeight: "700" }}>🏢 Enterprise Cloud</div>
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
            <div style={{ color: ENT_COLOR, fontSize: "18px" }}>⬢</div>
            <div style={{ fontWeight: "500" }}>{feature}</div>
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
            color: ENT_COLOR,
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
