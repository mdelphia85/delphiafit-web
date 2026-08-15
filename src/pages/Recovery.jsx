import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const recoveryMetrics = [
  { name: "Sleep Quality", score: 78, target: 85, icon: "😴" },
  { name: "Stress Level", score: 62, target: 70, icon: "🧠" },
  { name: "Muscle Soreness", score: 45, target: 80, icon: "💪" },
  { name: "Heart Rate Variability", score: 88, target: 90, icon: "❤️" },
  { name: "Hydration Status", score: 92, target: 90, icon: "💧" },
  { name: "Nutrition Balance", score: 71, target: 85, icon: "🍎" }
];

const recoveryScore = Math.round(
  (78 + 62 + 45 + 88 + 92 + 71) / 6
);

export default function Recovery() {
  const { setMenuOpen } = useContext(MenuContext);

  const RECOVERY_COLOR = "#6ee7b7";
  const BLACK = "#000";
  const WHITE = "#fff";

  const getScoreColor = (score) => {
    if (score >= 85) return "#6ee7b7";
    if (score >= 70) return "#fbbf24";
    return "#f87171";
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: BLACK,
        padding: "16px 16px 90px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        overflowY: "auto",
        color: WHITE
      }}
    >
      <div style={{ width: "360px", maxWidth: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: RECOVERY_COLOR, fontSize: "28px", fontWeight: "700" }}>💚 Recovery</div>
        </div>

        {/* Overall Recovery Score */}
        <div
          style={{
            background: "#111",
            border: `2px solid ${RECOVERY_COLOR}`,
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
            marginBottom: "20px"
          }}
        >
          <div style={{ fontSize: "48px", color: RECOVERY_COLOR, fontWeight: "700", marginBottom: "8px" }}>
            {recoveryScore}
          </div>
          <div style={{ fontSize: "14px", color: "#999" }}>Recovery Score (0-100)</div>
          <div style={{ fontSize: "12px", color: RECOVERY_COLOR, marginTop: "8px", fontWeight: "600" }}>
            {recoveryScore >= 85
              ? "Ready for intense training"
              : recoveryScore >= 70
              ? "Good recovery state"
              : "Prioritize rest and recovery"}
          </div>
        </div>

        {/* Recovery Metrics */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: RECOVERY_COLOR }}>
            Recovery Metrics
          </div>

          {recoveryMetrics.map((metric, idx) => (
            <div
              key={idx}
              style={{
                background: "#111",
                borderRadius: "12px",
                padding: "12px 14px",
                marginBottom: "10px",
                border: `1px solid #2a2a2a`
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ fontSize: "18px" }}>{metric.icon}</div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "600" }}>{metric.name}</div>
                    <div style={{ fontSize: "11px", color: "#999" }}>Target: {metric.target}</div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: getScoreColor(metric.score)
                  }}
                >
                  {metric.score}
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: "#222",
                  borderRadius: "999px",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    width: `${Math.min(metric.score, 100)}%`,
                    height: "100%",
                    background: getScoreColor(metric.score),
                    borderRadius: "999px"
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Recovery Recommendations */}
        <div
          style={{
            background: "#111",
            border: `1px solid #2a2a2a`,
            borderRadius: "12px",
            padding: "14px"
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: RECOVERY_COLOR }}>
            Recommendations
          </div>
          <div style={{ fontSize: "13px", color: "#ccc", lineHeight: "1.6" }}>
            <div style={{ marginBottom: "8px" }}>
              • Aim for 8+ hours of quality sleep tonight
            </div>
            <div style={{ marginBottom: "8px" }}>
              • Increase water intake by 20%
            </div>
            <div style={{ marginBottom: "8px" }}>
              • Light stretching or foam rolling session
            </div>
            <div>
              • Consider an active recovery day over intense training
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "40px",
          background: BLACK,
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
            color: RECOVERY_COLOR,
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
