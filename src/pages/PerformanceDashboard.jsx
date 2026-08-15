import React, { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const performanceData = [
  { date: "2026-08-12", vo2Max: 52, power: 320, speed: 18.5, distance: 12.4 },
  { date: "2026-08-13", vo2Max: 51, power: 325, speed: 18.8, distance: 13.1 },
  { date: "2026-08-14", vo2Max: 53, power: 335, speed: 19.2, distance: 13.5 }
];

const recentWorkouts = [
  { date: "Aug 14", type: "Tempo Run", duration: "45 min", pace: "5:30/km", effort: "Hard" },
  { date: "Aug 13", type: "Strength", duration: "60 min", pace: "N/A", effort: "Hard" },
  { date: "Aug 12", type: "Long Run", duration: "90 min", pace: "5:50/km", effort: "Easy" },
  { date: "Aug 11", type: "Interval", duration: "40 min", pace: "4:45/km", effort: "Max" }
];

export default function Performance() {
  const { setMenuOpen } = useContext(MenuContext);
  const [period, setPeriod] = useState("week");

  const PERFORMANCE_COLOR = "#fbbf24";
  const BLACK = "#000";
  const WHITE = "#fff";

  const latestData = performanceData[performanceData.length - 1];
  const previousData = performanceData[performanceData.length - 2];

  const calculateTrend = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    return { value: change.toFixed(1), color: change > 0 ? "#6ee7b7" : "#f87171" };
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
          <div style={{ color: PERFORMANCE_COLOR, fontSize: "28px", fontWeight: "700" }}>
            📊 Performance
          </div>
        </div>

        {/* Period Selector */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {["day", "week", "month"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                flex: 1,
                padding: "10px",
                background: period === p ? PERFORMANCE_COLOR : "#222",
                color: period === p ? BLACK : WHITE,
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
          {[
            { label: "VO₂ Max", value: latestData.vo2Max, unit: "ml/kg/min", trend: calculateTrend(latestData.vo2Max, previousData.vo2Max) },
            {
              label: "Power Output",
              value: latestData.power,
              unit: "watts",
              trend: calculateTrend(latestData.power, previousData.power)
            },
            {
              label: "Max Speed",
              value: latestData.speed,
              unit: "km/h",
              trend: calculateTrend(latestData.speed, previousData.speed)
            },
            {
              label: "Distance",
              value: latestData.distance,
              unit: "km",
              trend: calculateTrend(latestData.distance, previousData.distance)
            }
          ].map((metric, idx) => (
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
              <div>
                <div style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>{metric.label}</div>
                <div style={{ fontSize: "20px", fontWeight: "700" }}>
                  {metric.value}
                  <span style={{ fontSize: "12px", color: "#999", marginLeft: "4px" }}>{metric.unit}</span>
                </div>
              </div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: metric.trend.color
                }}
              >
                {metric.trend.value > 0 ? "↑" : "↓"} {metric.trend.value}%
              </div>
            </div>
          ))}
        </div>

        {/* Recent Workouts */}
        <div>
          <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: PERFORMANCE_COLOR }}>
            Recent Workouts
          </div>

          {recentWorkouts.map((workout, idx) => (
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
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ fontSize: "14px", fontWeight: "600" }}>{workout.type}</div>
                <div style={{ fontSize: "12px", color: "#999" }}>{workout.date}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
                <div>{workout.duration}</div>
                <div>{workout.pace}</div>
                <div
                  style={{
                    color:
                      workout.effort === "Max"
                        ? "#f87171"
                        : workout.effort === "Hard"
                        ? PERFORMANCE_COLOR
                        : "#6ee7b7"
                  }}
                >
                  {workout.effort}
                </div>
              </div>
            </div>
          ))}
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
            color: PERFORMANCE_COLOR,
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
