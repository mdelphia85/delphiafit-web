import React from "react";
import demoProgress from "../demo/demoProgress";

export default function DemoProgress() {
  return (
    <div style={{ padding: 20, minHeight: "100vh", background: "#f4f6f8" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h1>Progress Overview (Demo Mode)</h1>
        <p style={{ marginBottom: 20, color: "#555" }}>
          This is a read‑only preview. Tracking and analytics updates are disabled.
        </p>

        <div
          style={{
            padding: 16,
            borderRadius: 10,
            background: "#fff",
            border: "1px solid #e5e7eb",
            marginBottom: 20
          }}
        >
          <p><strong>Workouts Completed:</strong> {demoProgress.workoutsCompleted}</p>
          <p><strong>Meals Logged:</strong> {demoProgress.mealsLogged}</p>
          <p><strong>Tactical Drills Completed:</strong> {demoProgress.tacticalDrillsCompleted}</p>
        </div>

        <h2>Weekly Stats</h2>

        {demoProgress.weeklyStats.map((week) => (
          <div
            key={week.week}
            style={{
              padding: 16,
              borderRadius: 10,
              background: "#fff",
              border: "1px solid #e5e7eb",
              marginBottom: 14
            }}
          >
            <h3 style={{ margin: 0 }}>{week.week}</h3>
            <p><strong>Workouts:</strong> {week.workouts}</p>
            <p><strong>Meals:</strong> {week.meals}</p>
            <p><strong>Drills:</strong> {week.drills}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
