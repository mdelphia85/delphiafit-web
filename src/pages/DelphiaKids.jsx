import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function DelphiaKids() {
  const { setMenuOpen } = useContext(MenuContext);
  const KIDS_COLOR = "#ec4899";

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
          <div style={{ color: KIDS_COLOR, fontSize: "28px", fontWeight: "700" }}>🎮 DelphiaFit Kids</div>
        </div>

        {["Today's Challenge", "Class Activities", "My Progress", "Parent Controls"].map((item, idx) => (
          <div
            key={idx}
            style={{
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "10px",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = KIDS_COLOR)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
          >
            <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "6px" }}>{item}</div>
            <div style={{ fontSize: "12px", color: "#999" }}>Safe, fun, and educational</div>
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
            color: KIDS_COLOR,
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
