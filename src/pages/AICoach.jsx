import React, { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function AICoach() {
  const { setMenuOpen } = useContext(MenuContext);
  const [message, setMessage] = useState("");
  const AI_COLOR = "#a78bfa";

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
          <div style={{ color: AI_COLOR, fontSize: "28px", fontWeight: "700" }}>🤖 AI Coach</div>
        </div>

        <div
          style={{
            background: "#111",
            borderRadius: "12px",
            padding: "14px",
            marginBottom: "16px",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            overflowY: "auto",
            border: "1px solid #2a2a2a"
          }}
        >
          <div
            style={{
              background: "#222",
              borderRadius: "8px",
              padding: "10px",
              maxWidth: "80%",
              fontSize: "13px"
            }}
          >
            Good morning! I've analyzed your recovery metrics. Ready for today's training?
          </div>
          <div
            style={{
              background: AI_COLOR,
              color: "#000",
              borderRadius: "8px",
              padding: "10px",
              maxWidth: "80%",
              fontSize: "13px",
              marginLeft: "auto"
            }}
          >
            Yes, let's go!
          </div>
          <div
            style={{
              background: "#222",
              borderRadius: "8px",
              padding: "10px",
              maxWidth: "80%",
              fontSize: "13px"
            }}
          >
            Perfect! Today's adaptive plan: 15min warm-up, 45min strength focus on legs, 10min cooldown. Form analysis enabled.
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask AI Coach..."
            style={{
              flex: 1,
              padding: "10px",
              background: "#111",
              border: `1px solid #2a2a2a`,
              borderRadius: "8px",
              color: "#fff",
              fontSize: "12px",
              boxSizing: "border-box"
            }}
          />
          <button
            style={{
              padding: "10px 16px",
              background: AI_COLOR,
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Send
          </button>
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
            color: AI_COLOR,
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
