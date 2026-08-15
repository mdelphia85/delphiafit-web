import React, { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const devices = [
  { id: 1, name: "Apple Health", status: "Connected", icon: "🍎", lastSync: "2 hours ago" },
  { id: 2, name: "Google Fit", status: "Disconnected", icon: "🔍", lastSync: "Never" },
  { id: 3, name: "Garmin", status: "Connected", icon: "⌚", lastSync: "30 min ago" },
  { id: 4, name: "Fitbit", status: "Connected", icon: "📊", lastSync: "1 hour ago" },
  { id: 5, name: "Whoop", status: "Connected", icon: "💪", lastSync: "15 min ago" },
  { id: 6, name: "Oura Ring", status: "Disconnected", icon: "💍", lastSync: "Never" }
];

export default function HardwareIntegrations() {
  const { setMenuOpen } = useContext(MenuContext);
  const [connectedDevices, setConnectedDevices] = useState(devices);

  const HARDWARE_COLOR = "#f59e0b";

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#000",
        padding: "16px 16px 90px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        overflowY: "auto",
        color: "#fff"
      }}
    >
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: HARDWARE_COLOR, fontSize: "28px", fontWeight: "700" }}>⚙️ Integrations</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {connectedDevices.map((device) => (
            <div
              key={device.id}
              style={{
                background: "#111",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                padding: "14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ fontSize: "20px" }}>{device.icon}</div>
                <div>
                  <div style={{ fontWeight: "600" }}>{device.name}</div>
                  <div style={{ fontSize: "11px", color: "#999" }}>{device.lastSync}</div>
                </div>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: device.status === "Connected" ? "#6ee7b7" : "#999",
                  fontWeight: "600"
                }}
              >
                {device.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "40px",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 16px",
          boxSizing: "border-box",
          zIndex: 20
        }}
      >
        <div
          style={{
            color: HARDWARE_COLOR,
            fontSize: "18px",
            textDecoration: "underline",
            cursor: "pointer"
          }}
          onClick={() => setMenuOpen(true)}
        >
          Return to Menu
        </div>
      </div>
    </div>
  );
}
