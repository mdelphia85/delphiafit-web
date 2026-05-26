import React from "react";
import { useNavigate } from "react-router-dom";
import DemoBanner from "../../components/DemoBanner";
import DemoNav from "../../components/DemoNav";

export default function DemoTactical() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20, minHeight: "100vh", background: "#f4f6f8" }}>
      <DemoBanner />

      <div style={{ maxWidth: 980, margin: "0 auto" }}>

        {/* REUSABLE NAVIGATION */}
        <DemoNav current="tactical" />

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
