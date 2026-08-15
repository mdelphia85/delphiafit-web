import React, { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const athleteStats = {
  totalWorkouts: 145,
  totalHours: 187,
  avgIntensity: 72,
  streakDays: 23,
  personalRecords: 8,
  weeklyVolume: 12.5
};

const trainingLoad = [
  { week: "W1", volume: 10.2, intensity: 75, fatigue: 42 },
  { week: "W2", volume: 11.8, intensity: 78, fatigue: 55 },
  { week: "W3", volume: 9.5, intensity: 82, fatigue: 48 },
  { week: "W4", volume: 12.5, intensity: 68, fatigue: 35 }
];

const stressModel = {
  acuteStress: 65,
  chronicStress: 58,
  fatigue: 45,
  form: 72
};

export default function AthleteAnalytics() {
  const { setMenuOpen } = useContext(MenuContext);
  const [view, setView] = useState("overview");

  const ANALYTICS_COLOR = "#a78bfa";
  const BLACK = "#000";
  const WHITE = "#fff";

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
          <div style={{ color: ANALYTICS_COLOR, fontSize: "28px", fontWeight: "700" }}>
            📈 Athlete Analytics
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <button
            onClick={() => setView("overview")}
            style={{
              flex: 1,
              padding: "12px",
              background: view === "overview" ? ANALYTICS_COLOR : "#222",
              color: view === "overview" ? BLACK : WHITE,
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Overview
          </button>
          <button
            onClick={() => setView("load")}
            style={{
              flex: 1,
              padding: "12px",
              background: view === "load" ? ANALYTICS_COLOR : "#222",
              color: view === "load" ? BLACK : WHITE,
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Load
          </button>
          <button
            onClick={() => setView("stress")}
            style={{
              flex: 1,
              padding: "12px",
              background: view === "stress" ? ANALYTICS_COLOR : "#222",
              color: view === "stress" ? BLACK : WHITE,
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Stress
          </button>
        </div>

        {/* Overview */}
        {view === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "Total Workouts", value: athleteStats.totalWorkouts, icon: "🏋️" },
              { label: "Total Hours", value: athleteStats.totalHours, icon: "⏱️" },
              { label: "Avg Intensity", value: `${athleteStats.avgIntensity}%`, icon: "🔥" },
              { label: "Current Streak", value: `${athleteStats.streakDays} days`, icon: "📅" },
              { label: "Personal Records", value: athleteStats.personalRecords, icon: "🏆" },
              { label: "Weekly Volume", value: `${athleteStats.weeklyVolume} hrs`, icon: "📊" }
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  background: "#111",
                  border: `1px solid #2a2a2a`,
                  borderRadius: "12px",
                  padding: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ fontSize: "20px" }}>{stat.icon}</div>
                  <div style={{ fontSize: "14px", color: "#999" }}>{stat.label}</div>
                </div>
                <div style={{ fontSize: "18px", fontWeight: "700", color: ANALYTICS_COLOR }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Training Load */}
        {view === "load" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                background: "#111",
                border: `1px solid #2a2a2a`,
                borderRadius: "12px",
                padding: "14px",
                marginBottom: "8px"
              }}
            >
              <div style={{ fontSize: "14px", color: "#999", marginBottom: "12px" }}>
                Training Load (Last 4 Weeks)
              </div>

              {trainingLoad.map((week, idx) => (
                <div key={idx} style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <div style={{ fontSize: "12px", fontWeight: "600" }}>{week.week}</div>
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      Volume: {week.volume}h | Intensity: {week.intensity}%
                    </div>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: "24px",
                      background: "#222",
                      borderRadius: "6px",
                      overflow: "hidden",
                      display: "flex"
                    }}
                  >
                    <div
                      style={{
                        flex: week.volume / 3,
                        background: "#6ee7b7",
                        height: "100%"
                      }}
                    />
                    <div
                      style={{
                        flex: week.intensity / 3,
                        background: ANALYTICS_COLOR,
                        height: "100%"
                      }}
                    />
                    <div
                      style={{
                        flex: week.fatigue / 3,
                        background: "#f87171",
                        height: "100%"
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "12px", marginTop: "4px", fontSize: "10px", color: "#999" }}>
                    <div>
                      <span style={{ color: "#6ee7b7" }}>█</span> Volume
                    </div>
                    <div>
                      <span style={{ color: ANALYTICS_COLOR }}>█</span> Intensity
                    </div>
                    <div>
                      <span style={{ color: "#f87171" }}>█</span> Fatigue
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stress/Fatigue Model */}
        {view === "stress" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "Acute Stress", value: stressModel.acuteStress, icon: "⚡", color: "#f87171" },
              { label: "Chronic Stress", value: stressModel.chronicStress, icon: "📉", color: "#fbbf24" },
              { label: "Fatigue Index", value: stressModel.fatigue, icon: "😴", color: "#f87171" },
              { label: "Form Index", value: stressModel.form, icon: "💪", color: "#6ee7b7" }
            ].map((metric, idx) => (
              <div
                key={idx}
                style={{
                  background: "#111",
                  border: `1px solid #2a2a2a`,
                  borderRadius: "12px",
                  padding: "14px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ fontSize: "18px" }}>{metric.icon}</div>
                    <div style={{ fontSize: "14px", fontWeight: "600" }}>{metric.label}</div>
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: metric.color }}>
                    {metric.value}
                  </div>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "10px",
                    background: "#222",
                    borderRadius: "999px",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      width: `${metric.value}%`,
                      height: "100%",
                      background: metric.color,
                      borderRadius: "999px"
                    }}
                  />
                </div>
              </div>
            ))}

            <div
              style={{
                background: "#111",
                border: `1px solid #2a2a2a`,
                borderRadius: "12px",
                padding: "14px",
                marginTop: "8px"
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: ANALYTICS_COLOR }}>
                Readiness Assessment
              </div>
              <div style={{ fontSize: "12px", color: "#ccc", lineHeight: "1.6" }}>
                <div style={{ marginBottom: "8px" }}>
                  • Acute stress is elevated; suggest moderate intensity training
                </div>
                <div style={{ marginBottom: "8px" }}>
                  • Form index is good; capable of performance-focused work
                </div>
                <div>
                  • Fatigue is manageable; recovery window recommended soon
                </div>
              </div>
            </div>
          </div>
        )}
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
            color: ANALYTICS_COLOR,
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
