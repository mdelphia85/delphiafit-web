import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const organizations = [
  { name: "Premier Sports Academy", teams: 5, members: 240 },
  { name: "Elite Training Center", teams: 3, members: 180 },
  { name: "Youth Sports League", teams: 8, members: 520 }
];

export default function OrganizationLayer() {
  const { setMenuOpen } = useContext(MenuContext);
  const ORG_COLOR = "#14b8a6";

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
          <div style={{ color: ORG_COLOR, fontSize: "28px", fontWeight: "700" }}>🏛️ Organization</div>
        </div>

        {organizations.map((org, idx) => (
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
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = ORG_COLOR)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
          >
            <div style={{ fontWeight: "600", marginBottom: "6px" }}>{org.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
              <div>{org.teams} teams</div>
              <div>{org.members} members</div>
            </div>
          </div>
        ))}

        <button
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            background: ORG_COLOR,
            color: "#000",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          + Create Organization
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
            color: ORG_COLOR,
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
