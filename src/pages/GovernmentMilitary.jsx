import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const departments = [
  { name: "Government Wellness", metrics: "2.8M employees", status: "Active" },
  { name: "Military Readiness", metrics: "1.2M personnel", status: "Active" },
  { name: "Police Readiness", metrics: "850K officers", status: "Active" },
  { name: "Firefighter Fitness", metrics: "340K firefighters", status: "Active" },
  { name: "National Standards", metrics: "187 countries", status: "Live" }
];

export default function GovernmentMilitary() {
  const { setMenuOpen } = useContext(MenuContext);
  const GOV_COLOR = "#064e3b";

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
          <div style={{ color: GOV_COLOR, fontSize: "28px", fontWeight: "700" }}>🏛️ Government + Military</div>
        </div>

        {departments.map((dept, idx) => (
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
            <div style={{ fontWeight: "600", marginBottom: "6px" }}>{dept.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
              <div>{dept.metrics}</div>
              <div style={{ color: GOV_COLOR }}>● {dept.status}</div>
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
            color: GOV_COLOR,
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
