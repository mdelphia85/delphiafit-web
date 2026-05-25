import React from "react";

export default function DemoTactical() {
  return (
    <div style={{ padding: 20, minHeight: "100vh", background: "#f4f6f8" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h1>Tactical Drills (Demo Mode)</h1>
        <p style={{ marginBottom: 20, color: "#555" }}>
          Choose a tactical division to explore in read‑only demo mode.
        </p>

        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))"
          }}
        >
          <div
            onClick={() => (window.location.href = "/demo/firefighter")}
            style={{
              padding: 20,
              borderRadius: 12,
              background: "#fff",
              border: "1px solid #e5e7eb",
              cursor: "pointer"
            }}
          >
            <h3>Firefighter</h3>
            <p>View sample fireground tactical drills</p>
          </div>

          <div
            onClick={() => (window.location.href = "/demo/ems")}
            style={{
              padding: 20,
              borderRadius: 12,
              background: "#fff",
              border: "1px solid #e5e7eb",
              cursor: "pointer"
            }}
          >
            <h3>EMS</h3>
            <p>View sample emergency medical drills</p>
          </div>

          <div
            onClick={() => (window.location.href = "/demo/military")}
            style={{
              padding: 20,
              borderRadius: 12,
              background: "#fff",
              border: "1px solid #e5e7eb",
              cursor: "pointer"
            }}
          >
            <h3>Military</h3>
            <p>View sample military tactical drills</p>
          </div>

          <div
            onClick={() => (window.location.href = "/demo/police")}
            style={{
              padding: 20,
              borderRadius: 12,
              background: "#fff",
              border: "1px solid #e5e7eb",
              cursor: "pointer"
            }}
          >
            <h3>Police</h3>
            <p>View sample law enforcement drills</p>
          </div>
        </div>
      </div>
    </div>
  );
}
