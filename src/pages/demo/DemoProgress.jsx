import React from "react";
import { useNavigate } from "react-router-dom";
import DemoBanner from "../../components/DemoBanner";
import demoProgress from "../../demo/demoProgress.js";

export default function DemoProgress() {
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

        <h1>Progress (Demo Mode)</h1>

        {demoProgress.map((item, index) => (
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
            <h3 style={{ margin: 0 }}>{item.metric}</h3>
            <p><strong>Value:</strong> {item.value}</p>
            <p><strong>Trend:</strong> {item.trend}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

