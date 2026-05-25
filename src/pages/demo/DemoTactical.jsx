import React from "react";
import { useNavigate } from "react-router-dom";
import DemoBanner from "../../components/DemoBanner";

export default function DemoTactical() {
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

        <h1>Tactical Drills (Demo Mode)</h1>

        <p
          style={{
            color: "#007bff",
            textDecoration: "underline",
            cursor: "pointer",
            marginTop: 20,
            fontSize: 18
          }}
          onClick={() => navigate("/demo/firefighter")}
        >
          Firefighter Drills →
        </p>

        <p
          style={{
            color: "#007bff",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: 18
          }}
          onClick={() => navigate("/demo/ems")}
        >
          EMS Drills →
        </p>

        <p
          style={{
            color: "#007bff",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: 18
          }}
          onClick={() => navigate("/demo/military")}
        >
          Military Drills →
        </p>

        <p
          style={{
            color: "#007bff",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: 18
          }}
          onClick={() => navigate("/demo/police")}
        >
          Police Drills →
        </p>
      </div>
    </div>
  );
}
