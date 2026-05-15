import { useState } from "react";
import AdminLayout from "./Admin.jsx";

export default function AdminLogs() {
  const BG = "rgb(0,0,0)";
  const CARD_BG = "rgb(15,15,15)";
  const BORDER = "rgb(60,60,60)";
  const TEXT_MAIN = "rgb(240,240,240)";
  const TEXT_MUTED = "rgb(160,160,160)";
  const ACCENT = "rgb(128,0,128)";

  // ⭐ Log categories
  const categories = ["Workout Logs", "Sports Logs", "Free Training Logs", "Daily Logs", "Login Logs"];

  const [selectedCategory, setSelectedCategory] = useState("Workout Logs");

  // ⭐ Static UI-only logs (NOT backend)
  const logs = {
    "Workout Logs": [
      { id: 1, user: "user1@example.com", detail: "Strength – Upper Body", time: "2026-05-12 14:22" },
      { id: 2, user: "user2@example.com", detail: "Cardio – Running", time: "2026-05-12 13:10" }
    ],
    "Sports Logs": [
      { id: 3, user: "user3@example.com", detail: "Basketball", time: "2026-05-12 11:45" }
    ],
    "Free Training Logs": [
      { id: 4, user: "user4@example.com", detail: "Custom Workout", time: "2026-05-12 10:12" }
    ],
    "Daily Logs": [
      { id: 5, user: "user5@example.com", detail: "Completed daily log", time: "2026-05-12 09:30" }
    ],
    "Login Logs": [
      { id: 6, user: "user1@example.com", detail: "Successful login", time: "2026-05-12 08:15" },
      { id: 7, user: "user2@example.com", detail: "Failed login attempt", time: "2026-05-12 07:50" }
    ]
  };

  function deleteLog(id) {
    // ⭐ Frontend-only delete
    const updated = logs[selectedCategory].filter(l => l.id !== id);
    logs[selectedCategory] = updated;
    setSelectedCategory(selectedCategory); // force re-render
  }

  const container = {
    width: "100%",
    height: "100%",
    backgroundColor: BG,
    color: TEXT_MAIN,
    padding: "20px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    overflow: "auto"
  };

  const title = {
    fontSize: "26px",
    fontWeight: "600"
  };

  const subtitle = {
    fontSize: "14px",
    color: TEXT_MUTED
  };

  const selectorRow = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  };

  const selectorBtn = active => ({
    padding: "10px 16px",
    borderRadius: "6px",
    border: `1px solid ${active ? ACCENT : BORDER}`,
    backgroundColor: active ? ACCENT : CARD_BG,
    color: active ? "white" : TEXT_MAIN,
    cursor: "pointer",
    fontSize: "14px"
  });

  const card = {
    backgroundColor: CARD_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: "10px",
    padding: "16px",
    boxSizing: "border-box"
  };

  const tableHeader = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr auto",
    padding: "10px 0",
    borderBottom: `1px solid ${BORDER}`,
    fontWeight: "600",
    fontSize: "14px"
  };

  const tableRow = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr auto",
    padding: "10px 0",
    borderBottom: `1px solid ${BORDER}`,
    fontSize: "14px"
  };

  const deleteBtn = {
    color: "red",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "13px"
  };

  return (
    <AdminLayout>
      <div style={container}>
        {/* HEADER */}
        <div>
          <div style={title}>Admin Logs</div>
          <div style={subtitle}>View and manage all user activity logs.</div>
        </div>

        {/* CATEGORY SELECTOR */}
        <div style={selectorRow}>
          {categories.map(cat => (
            <div
              key={cat}
              style={selectorBtn(selectedCategory === cat)}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* LOG TABLE */}
        <div style={card}>
          <div style={tableHeader}>
            <div>User</div>
            <div>Detail</div>
            <div>Time</div>
            <div></div>
          </div>

          {logs[selectedCategory].map(log => (
            <div key={log.id} style={tableRow}>
              <div>{log.user}</div>
              <div>{log.detail}</div>
              <div>{log.time}</div>
              <div style={deleteBtn} onClick={() => deleteLog(log.id)}>
                Delete
              </div>
            </div>
          ))}

          {logs[selectedCategory].length === 0 && (
            <div style={{ padding: "20px 0", color: TEXT_MUTED, textAlign: "center" }}>
              No logs found.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
