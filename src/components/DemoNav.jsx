import React from "react";
import { useNavigate } from "react-router-dom";

export default function DemoNav({ current }) {
  const navigate = useNavigate();

  const linkStyle = {
    color: "#007bff",
    textDecoration: "underline",
    cursor: "pointer",
    marginBottom: 8,
    fontSize: 18
  };

  const greenStyle = {
    ...linkStyle,
    color: "#28a745"
  };

  return (
    <div style={{ marginBottom: 30 }}>
      {/* Core navigation */}
      <p style={linkStyle} onClick={() => navigate("/demo/dashboard")}>
        ← Back to Demo Dashboard
      </p>

      <p style={greenStyle} onClick={() => navigate("/register")}>
        Create Your Account →
      </p>

      <p style={linkStyle} onClick={() => navigate("/login")}>
        Already have an account? Log In →
      </p>

      {/* Mini demo navigation */}
      <div style={{ marginTop: 20 }}>
        <p style={linkStyle} onClick={() => navigate("/demo/workouts")}>
          Workouts
        </p>

        <p style={linkStyle} onClick={() => navigate("/demo/meals")}>
          Meals
        </p>

        <p style={linkStyle} onClick={() => navigate("/demo/progress")}>
          Progress
        </p>

        <p style={linkStyle} onClick={() => navigate("/demo/tactical")}>
          Tactical Drills
        </p>
      </div>
    </div>
  );
}
