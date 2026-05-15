import AdminLayout from "./Admin.jsx";

export default function AdminDashboard() {
  const BG = "rgb(0,0,0)";
  const CARD_BG = "rgb(15,15,15)";
  const BORDER = "rgb(60,60,60)";
  const TEXT_MAIN = "rgb(240,240,240)";
  const TEXT_MUTED = "rgb(160,160,160)";
  const ACCENT = "rgb(128,0,128)";

  // ⭐ Static UI-only data (NOT backend)
  const stats = {
    totalUsers: 1284,
    newUsers24h: 12,
    logs24h: 421,
    messagesUnread: 7
  };

  const systemStatus = {
    api: "Operational",
    database: "Healthy",
    uptime: "99.98%",
    errors24h: 1
  };

  const recentAdminActions = [
    { id: 1, action: "Deleted user account", admin: "admin1", time: "10 min ago" },
    { id: 2, action: "Published announcement", admin: "admin2", time: "1 hr ago" },
    { id: 3, action: "Reviewed login logs", admin: "admin1", time: "3 hrs ago" }
  ];

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
          <div style={subtitle}>Overview of system activity, health, and admin actions.</div>
        </div>

        {/* QUICK STATS */}
        <div style={grid}>
          <div style={card}>
            <div style={cardLabel}>Total Users</div>
            <div style={cardValue}>{stats.totalUsers}</div>
          </div>

          <div style={card}>
            <div style={cardLabel}>New Users (24h)</div>
            <div style={cardValue}>{stats.newUsers24h}</div>
          </div>

          <div style={card}>
            <div style={cardLabel}>Logs Created (24h)</div>
            <div style={cardValue}>{stats.logs24h}</div>
          </div>

          <div style={card}>
            <div style={cardLabel}>Unread Messages</div>
            <div style={cardValue}>{stats.messagesUnread}</div>
          </div>
        </div>

        {/* SYSTEM STATUS */}
        <div style={card}>
          <div style={sectionTitle}>System Status</div>

          <div style={listItem}>
            <span>API</span>
            <span style={{ color: ACCENT }}>{systemStatus.api}</span>
          </div>

          <div style={listItem}>
            <span>Database</span>
            <span style={{ color: ACCENT }}>{systemStatus.database}</span>
          </div>

          <div style={listItem}>
            <span>Uptime</span>
            <span style={{ color: ACCENT }}>{systemStatus.uptime}</span>
          </div>

          <div style={listItem}>
            <span>Errors (24h)</span>
            <span style={{ color: ACCENT }}>{systemStatus.errors24h}</span>
          </div>
        </div>

        {/* RECENT ADMIN ACTIONS */}
        <div style={card}>
          <div style={sectionTitle}>Recent Admin Actions</div>

          {recentAdminActions.map(a => (
            <div key={a.id} style={listItem}>
              <div>
                <div style={{ fontSize: "14px" }}>{a.action}</div>
                <div style={{ fontSize: "12px", color: TEXT_MUTED }}>
                  {a.admin} • {a.time}
                </div>
              </div>
            </div>
          ))}

          {recentAdminActions.length === 0 && (
            <div style={{ fontSize: "14px", color: TEXT_MUTED }}>No recent actions.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
