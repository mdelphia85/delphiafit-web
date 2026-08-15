import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const events = [
  { name: "Regional Championship", date: "2026-09-15", type: "Tournament", status: "Upcoming" },
  { name: "Practice Match", date: "2026-08-20", type: "Game", status: "Upcoming" },
  { name: "District Finals", date: "2026-10-01", type: "Tournament", status: "Scheduled" }
];

export default function CompetitionEvents() {
  const { setMenuOpen } = useContext(MenuContext);
  const EVENTS_COLOR = "#c2185b";

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
          <div style={{ color: EVENTS_COLOR, fontSize: "28px", fontWeight: "700" }}>🏆 Competition</div>
        </div>

        {events.map((event, idx) => (
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
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = EVENTS_COLOR)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <div style={{ fontWeight: "600" }}>{event.name}</div>
              <div style={{ fontSize: "11px", color: EVENTS_COLOR, fontWeight: "600" }}>{event.type}</div>
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>{event.date}</div>
          </div>
        ))}

        <button
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            background: EVENTS_COLOR,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          + Add Event
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
            color: EVENTS_COLOR,
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
