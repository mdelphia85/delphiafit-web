import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const teamMembers = [
  { id: 1, name: "Alex Johnson", position: "Forward", status: "Active", joinDate: "2026-06-01" },
  { id: 2, name: "Sarah Chen", position: "Midfielder", status: "Active", joinDate: "2026-07-15" },
  { id: 3, name: "Mike Davis", position: "Defender", status: "Pending", joinDate: null }
];

export default function TeamOperations() {
  const { setMenuOpen } = useContext(MenuContext);
  const TEAM_COLOR = "#f472b6";

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
          <div style={{ color: TEAM_COLOR, fontSize: "28px", fontWeight: "700" }}>👥 Team Roster</div>
        </div>

        {teamMembers.map((member) => (
          <div
            key={member.id}
            style={{
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "10px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <div style={{ fontWeight: "600" }}>{member.name}</div>
              <div
                style={{
                  fontSize: "11px",
                  color: member.status === "Active" ? "#6ee7b7" : "#fbbf24",
                  fontWeight: "600"
                }}
              >
                {member.status}
              </div>
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
              {member.position} • Joined {member.joinDate}
            </div>
          </div>
        ))}

        <button
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            background: TEAM_COLOR,
            color: "#000",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          + Invite Player
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
            color: TEAM_COLOR,
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
