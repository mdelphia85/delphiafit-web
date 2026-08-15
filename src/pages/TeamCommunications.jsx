import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function TeamCommunications() {
  const { setMenuOpen } = useContext(MenuContext);
  const COMM_COLOR = "#38bdf8";

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
          <div style={{ color: COMM_COLOR, fontSize: "28px", fontWeight: "700" }}>💬 Team Comms</div>
        </div>

        {[
          { title: "Team Announcements", unread: 2, icon: "📢" },
          { title: "Practice Schedule", unread: 0, icon: "📅" },
          { title: "Coach Feedback", unread: 1, icon: "✍️" },
          { title: "Team Messages", unread: 3, icon: "💬" }
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              background: "#111",
              border: `1px solid ${item.unread > 0 ? COMM_COLOR : "#2a2a2a"}`,
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "10px",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = COMM_COLOR)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = item.unread > 0 ? COMM_COLOR : "#2a2a2a")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ fontSize: "18px" }}>{item.icon}</div>
                <div style={{ fontWeight: "600" }}>{item.title}</div>
              </div>
              {item.unread > 0 && <div style={{ color: COMM_COLOR, fontWeight: "600" }}>{item.unread}</div>}
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
            color: COMM_COLOR,
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
