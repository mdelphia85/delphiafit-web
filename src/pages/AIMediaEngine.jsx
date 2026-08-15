import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const content = [
  { type: "Training Video", title: "Perfect Form Squat Tutorial", ai: "Generated", views: 12400 },
  { type: "Drill Breakdown", title: "3-Point Shot Technique", ai: "AI Analyzed", views: 8900 },
  { type: "Highlight Reel", title: "Weekly Top Plays", ai: "Generated", views: 34200 },
  { type: "Commentary", title: "Championship Match Analysis", ai: "AI Commentary", views: 5600 }
];

export default function AIMediaEngine() {
  const { setMenuOpen } = useContext(MenuContext);
  const MEDIA_COLOR = "#f59e0b";

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
          <div style={{ color: MEDIA_COLOR, fontSize: "28px", fontWeight: "700" }}>🎬 AI Media Engine</div>
        </div>

        {content.map((item, idx) => (
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
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <div style={{ fontWeight: "600" }}>{item.title}</div>
              <div style={{ color: MEDIA_COLOR, fontSize: "11px", fontWeight: "600" }}>{item.type}</div>
            </div>
            <div style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>🤖 {item.ai}</div>
            <div style={{ fontSize: "11px", color: "#666" }}>👁️ {item.views.toLocaleString()} views</div>
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
            color: MEDIA_COLOR,
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
