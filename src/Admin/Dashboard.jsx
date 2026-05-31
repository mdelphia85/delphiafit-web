import { useEffect, useState } from "react";
import AdminLayout from "./Admin.jsx";

export default function AdminDashboard() {
  const BG = "rgb(0,0,0)";
  const CARD_BG = "rgb(15,15,15)";
  const BORDER = "rgb(60,60,60)";
  const TEXT_MAIN = "rgb(240,240,240)";
  const TEXT_MUTED = "rgb(160,160,160)";
  const ACCENT = "rgb(128,0,128)";

  const [dashboard, setDashboard] = useState(null);
  const [system, setSystem] = useState(null);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ Fetch ALL real-time admin data
  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("adminToken");

        const headers = { Authorization: `Bearer ${token}` };

        // Dashboard stats
        const dashRes = await fetch(
          "https://delphiafit-backend-production.up.railway.app/admin/dashboard",
          { headers }
        );
        const dashJson = await dashRes.json();
        setDashboard(dashJson);

        // System health
        const sysRes = await fetch(
          "https://delphiafit-backend-production.up.railway.app/admin/system/health",
          { headers }
        );
        const sysJson = await sysRes.json();
        setSystem(sysJson);

        // Recent admin actions
        const actRes = await fetch(
          "https://delphiafit-backend-production.up.railway.app/admin/actions/recent",
          { headers }
        );
        const actJson = await actRes.json();
        setActions(actJson.actions || actJson);

      } catch (err) {
        console.error("Dashboard load error:", err);
      }

      setLoading(false);
    }

    load();
  }, []);

  // ⭐ Loading screen
  if (loading || !dashboard || !system) {
    return (
      <AdminLayout>
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: BG,
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

  // ⭐ Styles
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

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px"
  };

  const card = {
    backgroundColor: CARD_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: "10px",
    padding: "16px",
    boxSizing: "border-box"
  };

  const cardLabel = {
    fontSize: "14px",
    color: TEXT_MUTED,
    marginBottom: "6px"
  };

  const cardValue = {
    fontSize: "24px",
    fontWeight: "600",
    color: ACCENT
  };

  const sectionTitle = {
    fontSize: "18px",
    fontWeight: "500",
    marginBottom: "10px"
  };

  const listItem = {
    padding: "10px 0",
    borderBottom: `1px solid ${BORDER}`,
    display: "flex",
    justifyContent: "space-between"
  };

  return (
    <AdminLayout>
      <div style={container}>
        {/* HEADER */}
        <div>
          <div style={title}>Admin Dashboard</div>
          <div style={subtitle}>Live system activity, health, and admin actions.</div>
        </div>

        {/* QUICK STATS (LIVE DATA) */}
        <div style={grid}>
          <div style={card}>
            <div style={cardLabel}>Total Users</div>
            <div style={cardValue}>{dashboard.total_users}</div>
          </div>

          <div style={card}>
            <div style={cardLabel}>New Users (7 days)</div>
            <div style={cardValue}>{dashboard.new_users_last_7_days}</div>
          </div>

          <div style={card}>
            <div style={cardLabel}>Unread Messages</div>
            <div style={cardValue}>{dashboard.unread_messages}</div>
          </div>

          <div style={card}>
            <div style={cardLabel}>Total Logs</div>
            <div style={cardValue}>{dashboard.total_logs}</div>
          </div>
        </div>

        {/* SYSTEM STATUS (LIVE) */}
        <div style={card}>
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
            <span>Errors (24h)</span>
            <span style={{ color: ACCENT }}>{system.errors_24h}</span>
          </div>
        </div>

        {/* RECENT ADMIN ACTIONS (LIVE) */}
        <div style={card}>
          <div style={sectionTitle}>Recent Admin Actions</div>

          {actions.length > 0 ? (
            actions.map(a => (
              <div key={a.id} style={listItem}>
                <div>
                  <div style={{ fontSize: "14px" }}>{a.action}</div>
                  <div style={{ fontSize: "12px", color: TEXT_MUTED }}>
                    {a.admin} • {a.timestamp}
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
