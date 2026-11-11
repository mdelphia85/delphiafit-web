import { useEffect, useState } from "react";
import AdminLayout from "./Admin.jsx";
import { adminFetch, formatDateTime } from "./adminApi.js";
import { ACCENT, BORDER, TEXT_MAIN, TEXT_MUTED, card, container, errorBox, subtitle, title, toggleBtn } from "./adminTheme.js";

const FILTERS = [
  ["all", "All"],
  ["system", "System"],
  ["auth", "Auth"],
  ["workout", "Workouts"],
  ["daily", "Daily Logs"],
  ["error", "Errors"],
];

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    adminFetch(filter === "all" ? "/admin/logs" : `/admin/logs?type=${filter}`)
      .then((json) => {
        if (cancelled) return;
        setLogs(json?.logs || []);
        setError("");
      })
      .catch((err) => !cancelled && setError(err.message || "Failed to load logs."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [filter, refreshKey]);

  const logItem = {
    padding: "12px",
    borderBottom: `1px solid ${BORDER}`,
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  };

  return (
    <AdminLayout>
      <div style={container}>
        <div>
          <div style={title}>Admin Logs</div>
          <div style={subtitle}>System activity, admin actions, logins, and user logs from the database.</div>
          <button type="button" style={toggleBtn(false)} onClick={() => { setLoading(true); setRefreshKey(key => key + 1); }}>
            Refresh Logs
          </button>
        </div>

        <div style={card}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {FILTERS.map(([key, label]) => (
              <div key={key} style={toggleBtn(filter === key)} onClick={() => { setLoading(true); setFilter(key); }}>
                {label}
              </div>
            ))}
          </div>
        </div>

        {error && <div style={errorBox}>{error}</div>}

        <div style={card}>
          {loading && <div style={{ color: TEXT_MAIN }}>Loading logs...</div>}

          {!loading && logs.map(log => (
            <div key={log.id} style={logItem}>
              <div style={{ fontSize: "12px", color: ACCENT, fontWeight: "600" }}>
                {log.type?.toUpperCase() || "UNKNOWN"}
              </div>
              <div style={{ fontSize: "14px", color: TEXT_MAIN }}>{log.message}</div>
              <div style={{ fontSize: "12px", color: TEXT_MUTED }}>
                {log.user_email ? `${log.user_email} • ` : ""}
                {formatDateTime(log.timestamp)}
              </div>
            </div>
          ))}

          {!loading && !error && logs.length === 0 && (
            <div style={{ color: TEXT_MUTED, fontSize: "14px" }}>
              No logs found for this filter.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
