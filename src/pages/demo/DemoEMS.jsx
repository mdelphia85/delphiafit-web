import React from "react";
import demoTactical from "../../demo/demoTactical.js";

export default function DemoEMS() {
  return (
    <div style={{ padding: 20, minHeight: "100vh", background: "#f4f6f8" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h1>EMS Tactical Drills (Demo Mode)</h1>
        <p style={{ marginBottom: 20, color: "#555" }}>
          This is a read‑only preview. Creating, editing, deleting, and generating drills are disabled.
        </p>

        {demoTactical.ems.map((drill, index) => (
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
              This is a sample EMS tactical drill used for demo preview mode.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
