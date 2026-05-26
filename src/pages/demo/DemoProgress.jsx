import React from "react";
import { useNavigate } from "react-router-dom";
import DemoBanner from "../../components/DemoBanner";
import DemoNav from "../../components/DemoNav";
import demoProgress from "../../demo/demoProgress.js";

export default function DemoProgress() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20, minHeight: "100vh", background: "#f4f6f8" }}>
      <DemoBanner />

      <div style={{ maxWidth: 980, margin: "0 auto" }}>

        {/* REUSABLE NAVIGATION */}
        <DemoNav current="progress" />

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
