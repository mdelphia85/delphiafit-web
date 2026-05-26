import React from "react";
import { useNavigate } from "react-router-dom";
import DemoBanner from "../../components/DemoBanner";
import DemoNav from "../../components/DemoNav";
import demoTactical from "../../demo/demoTactical.js";

export default function DemoPolice() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20, minHeight: "100vh", background: "#f4f6f8" }}>
      <DemoBanner />

      <div style={{ maxWidth: 980, margin: "0 auto" }}>

        {/* REUSABLE NAVIGATION */}
        <DemoNav current="police" />

        <h1>Police Tactical Drills (Demo Mode)</h1>
        <p style={{ marginBottom: 20, color: "#555" }}>
          This is a read‑only preview. Creating, editing, deleting, and generating drills are disabled.
        </p>

        {demoTactical.police.map((drill, index) => (
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
            <h3 style={{ margin: 0 }}>{drill}</h3>

            <p style={{ marginTop: 10, color: "#444" }}>
              This is a sample police tactical drill used for demo preview mode.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
