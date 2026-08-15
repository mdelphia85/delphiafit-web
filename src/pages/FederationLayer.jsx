import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const federations = [
  { name: "International Track & Field", members: 214, sports: 12 },
  { name: "Global Basketball Federation", members: 152, sports: 8 },
  { name: "World Rowing Commission", members: 98, sports: 3 }
];

export default function FederationLayer() {
  const { setMenuOpen } = useContext(MenuContext);
  const FED_COLOR = "#ec4899";

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
          <div style={{ color: FED_COLOR, fontSize: "28px", fontWeight: "700" }}>🏛️ Federations</div>
        </div>

        {federations.map((fed, idx) => (
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
            <div style={{ fontWeight: "600", marginBottom: "6px" }}>{fed.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
              <div>👥 {fed.members} members</div>
              <div>🏅 {fed.sports} sports</div>
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
            color: FED_COLOR,
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
