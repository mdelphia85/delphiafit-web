import { useEffect, useState } from "react";
import AdminLayout from "./Admin.jsx";
import { API } from "../config/api";

export default function AdminLogs() {
  const BG = "rgb(0,0,0)";
  const CARD_BG = "rgb(15,15,15)";
  const BORDER = "rgb(60,60,60)";
  const TEXT_MAIN = "rgb(240,240,240)";
  const TEXT_MUTED = "rgb(160,160,160)";
  const ACCENT = "rgb(128,0,128)";

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function loadLogs() {
      try {
        const token = localStorage.getItem("adminToken");

        const url =
          filter === "all"
            ? `${API}/admin/logs`
            : `${API}/admin/logs?type=${filter}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const json = await res.json();
        setLogs(json.logs || json);
      } catch (err) {
        console.error("Failed to load logs:", err);
      }

      setLoading(false);
    }

    loadLogs();
  }, [filter]);

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

  const title = { fontSize: "26px", fontWeight: "600" };
  const subtitle = { fontSize: "14px", color: TEXT_MUTED };

  const card = {
    backgroundColor: CARD_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: "10px",
    padding: "16px",
    boxSizing: "border-box"
  };

  const filterRow = {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    flexWrap: "wrap"
  };

  const filterBtn = active => ({
    padding: "6px 12px",
    borderRadius: "6px",
    border: `1px solid ${active ? ACCENT : BORDER}`,
    backgroundColor: active ? ACCENT : CARD_BG,
    color: active ? "white" : TEXT_MAIN,
    cursor: "pointer",
    fontSize: "13px"
  });

  const logItem = {
    padding: "12px",
    borderBottom: `1px solid ${BORDER}`,
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  };

  const logType = {
    fontSize: "12px",
    color: ACCENT,
    fontWeight: "600"
  };

  const logMessage = {
    fontSize: "14px",
    color: TEXT_MAIN
  };

  const logMeta = {
    fontSize: "12px",
    color: TEXT_MUTED
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: "20px", color: TEXT_MAIN }}>Loading logs...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={container}>
        <div>
          <div style={title}>Admin Logs</div>
          <div style={subtitle}>View system logs, errors, and user activity.</div>
        </div>

        <div style={card}>
          <div style={filterRow}>
            <div style={filterBtn(filter === "all")} onClick={() => setFilter("all")}>
              All
            </div>
            <div style={filterBtn(filter === "system")} onClick={() => setFilter("system")}>
              System
            </div>
            <div style={filterBtn(filter === "auth")} onClick={() => setFilter("auth")}>
              Auth
            </div>
            <div style={filterBtn(filter === "workout")} onClick={() => setFilter("workout")}>
              Workouts
            </div>
            <div style={filterBtn(filter === "daily")} onClick={() => setFilter("daily")}>
              Daily Logs
            </div>
            <div style={filterBtn(filter === "error")} onClick={() => setFilter("error")}>
              Errors
            </div>
          </div>
        </div>

        <div style={card}>
          {logs.map(log => (
            <div key={log.id} style={logItem}>
              <div style={logType}>{log.type?.toUpperCase() || "UNKNOWN"}</div>
              <div style={logMessage}>{log.message}</div>
              <div style={logMeta}>
                {log.user_email ? `${log.user_email} • ` : ""}
                {log.timestamp}
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div style={{ color: TEXT_MUTED, fontSize: "14px" }}>
              No logs found for this filter.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
