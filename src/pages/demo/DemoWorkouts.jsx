import React from "react";
import { useNavigate } from "react-router-dom";
import DemoBanner from "../../components/DemoBanner";
import demoWorkouts from "../../demo/demoWorkouts.js";

export default function DemoWorkouts() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20, minHeight: "100vh", background: "#f4f6f8" }}>
      <DemoBanner />

      <div style={{ maxWidth: 980, margin: "0 auto" }}>

        {/* CLICKABLE TEXT NAVIGATION */}
        <p
          style={{
            color: "#007bff",
            textDecoration: "underline",
            cursor: "pointer",
            marginBottom: 8,
            fontSize: 18
          }}
          onClick={() => navigate("/demo/dashboard")}
        >
          ← Back to Demo Dashboard
        </p>

        <p
          style={{
            color: "#28a745",
            textDecoration: "underline",
            cursor: "pointer",
            marginBottom: 8,
            fontSize: 18
          }}
          onClick={() => navigate("/register")}
        >
          Create Your Account →
        </p>

        <p
          style={{
            color: "#007bff",
            textDecoration: "underline",
            cursor: "pointer",
            marginBottom: 30,
            fontSize: 18
          }}
          onClick={() => navigate("/login")}
        >
          Already have an account? Log In →
        </p>

        <h1>Workouts (Demo Mode)</h1>
        <p style={{ marginBottom: 20, color: "#555" }}>
          This is a read‑only preview. Creating, editing, and logging workouts are disabled.
        </p>

        {demoWorkouts.map((workout, index) => (
          <div
            key={index}
            style={{
              padding: 16,
              borderRadius: 10,
              background: "#fff",
              border: "1px solid #e5e7eb",
              marginBottom: 14
            }}
          >
            <h3 style={{ margin: 0 }}>{workout.name}</h3>

            <p style={{ margin: "6px 0" }}>
              <strong>Category:</strong> {workout.category}
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Duration:</strong> {workout.duration}
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Intensity:</strong> {workout.intensity}
            </p>

            <p style={{ marginTop: 10 }}>
              <strong>Exercises:</strong>
            </p>

            <ul style={{ marginTop: 6 }}>
              {workout.exercises.map((ex, idx) => (
                <li key={idx}>
                  {ex.name} — {ex.sets} sets × {ex.reps} reps
                </li>
              ))}
            </ul>

            {workout.notes && (
              <p style={{ marginTop: 10, color: "#444" }}>{workout.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
