import { useEffect, useState } from "react";
import AdminLayout from "./Admin.jsx";
import { adminFetch, formatDateTime } from "./adminApi.js";
import { ACCENT, BORDER, CARD_BG, TEXT_MAIN, TEXT_MUTED, card, container, errorBox, subtitle, title } from "./adminTheme.js";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [system, setSystem] = useState(null);
  const [actions, setActions] = useState([]);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [dash, sys, act] = await Promise.all([
          adminFetch("/admin/dashboard"),
          adminFetch("/admin/system/health"),
          adminFetch("/admin/actions/recent"),
        ]);
        if (!active) return;
        setDashboard(dash);
        setSystem(sys);
        setActions(act?.actions || []);
        setError("");
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        if (active) setError(err.message || "Unable to refresh the dashboard.");
      }
    }

    load();
    const timer = setInterval(load, 60000);
    return () => { active = false; clearInterval(timer); };
  }, [refreshKey]);

  if (error && (!dashboard || !system)) {
    return <AdminLayout><div style={container}><div style={errorBox}>{error}</div>
      <button type="button" onClick={() => setRefreshKey(key => key + 1)}>Retry</button>
    </div></AdminLayout>;
  }

  if (!dashboard || !system) {
    return (
      <AdminLayout>
        <div
          style={{
            width: "100%",
            height: "100%",
            color: TEXT_MAIN,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "18px"
          }}
        >
          Loading dashboard...
        </div>
      </AdminLayout>
    );
  }

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px"
  };
  const cardLabel = { fontSize: "14px", color: TEXT_MUTED, marginBottom: "6px" };
  const cardValue = { fontSize: "24px", fontWeight: "600", color: ACCENT };
  const sectionTitle = { fontSize: "18px", fontWeight: "500", marginBottom: "10px" };
  const listItem = {
    padding: "10px 0",
    borderBottom: `1px solid ${BORDER}`,
    display: "flex",
    justifyContent: "space-between"
  };

  const stats = [
    ["Total Users", dashboard.total_users],
    ["New Users (7 days)", dashboard.new_users_last_7_days],
    ["Logins (7 days)", dashboard.logins_last_7_days],
    ["Unread Messages", dashboard.unread_messages],
    ["Active Announcements", dashboard.active_announcements],
    ["Suspended Users", dashboard.suspended_users],
    ["Total Logs", dashboard.total_logs],
  ];

  return (
    <AdminLayout>
      <div style={container}>
        <div>
          <div style={title}>Admin Dashboard</div>
          <div style={subtitle}>Live system activity, health, and admin actions.</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setRefreshKey(key => key + 1)}>
              Refresh Data
            </button>
            {lastUpdated && <small style={{ color: TEXT_MUTED }}>Last updated {lastUpdated} · auto-refreshes every minute</small>}
          </div>
          {error && <div role="alert" style={errorBox}>{error}</div>
        </div>

        <div style={grid}>
          {stats.map(([label, value]) => (
            <div key={label} style={card}>
              <div style={cardLabel}>{label}</div>
              <div style={cardValue}>{value ?? 0}</div>
            </div>
          ))}
        </div>

        <div style={{ ...card, backgroundColor: CARD_BG }}>
          <div style={sectionTitle}>System Status</div>

          <div style={listItem}>
            <span>API</span>
            <span style={{ color: ACCENT }}>{system.api_status}</span>
          </div>
          <div style={listItem}>
            <span>Database</span>
            <span style={{ color: ACCENT }}>{system.database_status}</span>
          </div>
          <div style={listItem}>
            <span>Uptime</span>
            <span style={{ color: ACCENT }}>{system.uptime}</span>
          </div>
          <div style={listItem}>
            <span>Failed admin actions (24h)</span>
            <span style={{ color: ACCENT }}>{system.failed_admin_actions_24h ?? 0}</span>
          </div>
        </div>

        <div style={card}>
          <div style={sectionTitle}>Recent Admin Actions</div>

          {actions.length > 0 ? (
            actions.map(a => (
              <div key={a.id} style={listItem}>
                <div>
                  <div style={{ fontSize: "14px", color: a.success === false ? "red" : TEXT_MAIN }}>
                    {a.summary || a.action}
                  </div>
                  <div style={{ fontSize: "12px", color: TEXT_MUTED }}>
                    {a.admin} • {formatDateTime(a.timestamp)}
                    {a.detail ? ` • ${a.detail}` : ""}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: "14px", color: TEXT_MUTED }}>
              No recent admin actions.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
