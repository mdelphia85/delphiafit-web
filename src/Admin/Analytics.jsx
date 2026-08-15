import AdminLayout from "./Admin.jsx";
import { useEffect, useState } from "react";

export default function AdminAnalytics() {
  const BG = "rgb(0,0,0)";
  const CARD_BG = "rgb(15,15,15)";
  const BORDER = "rgb(60,60,60)";
  const TEXT_MAIN = "rgb(240,240,240)";
  const TEXT_MUTED = "rgb(160,160,160)";
  const ACCENT = "rgb(128,0,128)";

  const [analytics, setAnalytics] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Unable to load analytics.");
        setAnalytics(await res.json());
      } catch {
        setErrorMessage("Unable to load analytics data.");
      }
    }

    loadAnalytics();
  }, []);

  const container = {
    width: "100%",
    height: "100%",
    backgroundColor: BG,
    color: TEXT_MAIN,
    padding: "20px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    overflow: "auto"
  };

  const headerRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  };

  const title = {
    fontSize: "24px",
    fontWeight: "600"
  };

  const subtitle = {
    fontSize: "14px",
    color: TEXT_MUTED
  };

  const kpiRow = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px"
  };

  const card = {
    backgroundColor: CARD_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: "10px",
    padding: "12px 14px"
  };

  const cardLabel = {
    fontSize: "13px",
    color: TEXT_MUTED,
    marginBottom: "4px"
  };

  const cardValue = {
    fontSize: "22px",
    fontWeight: "600"
  };

  const layoutRow = {
    display: "flex",
    flexDirection: "row",
    gap: "16px",
    flexWrap: "wrap"
  };

  const column = {
    flex: 1,
    minWidth: "260px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  };

  const sectionTitle = {
    fontSize: "16px",
    fontWeight: "500",
    marginBottom: "6px"
  };

  const listItem = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    padding: "6px 0",
    borderBottom: `1px solid ${BORDER}`
  };

  const badge = () => ({
    fontSize: "11px",
    padding: "2px 6px",
    borderRadius: "999px",
    border: `1px solid ${BORDER}`,
    color: TEXT_MUTED,
    marginRight: "6px"
  });

  if (errorMessage) {
    return <AdminLayout><div style={container}>{errorMessage}</div></AdminLayout>;
  }

  if (!analytics) {
    return <AdminLayout><div style={container}>Loading analytics...</div></AdminLayout>;
  }

  const overview = analytics.overview || {};
  const topWorkouts = analytics.topWorkouts || analytics.top_workouts || [];
  const recentActivity = analytics.recentActivity || analytics.recent_activity || [];

  return (
    <AdminLayout>
      <div style={container}>
        {/* HEADER */}
        <div style={headerRow}>
          <div>
            <div style={title}>Admin Analytics</div>
            <div style={subtitle}>High‑level metrics across users, workouts, and logs.</div>
          </div>
        </div>

        {/* KPI CARDS */}
        <div style={kpiRow}>
          <div style={card}>
            <div style={cardLabel}>Total Users</div>
            <div style={cardValue}>{overview.totalUsers}</div>
          </div>
          <div style={card}>
            <div style={cardLabel}>Active Users (7 days)</div>
            <div style={cardValue}>{overview.activeUsers7d}</div>
          </div>
          <div style={card}>
            <div style={cardLabel}>Workouts Logged (7 days)</div>
            <div style={cardValue}>{overview.workoutsLogged7d}</div>
          </div>
          <div style={card}>
            <div style={cardLabel}>Daily Logs (7 days)</div>
            <div style={cardValue}>{overview.dailyLogs7d}</div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div style={layoutRow}>
          {/* LEFT COLUMN – TOP WORKOUTS */}
          <div style={column}>
            <div style={card}>
              <div style={sectionTitle}>Top Workouts (7 days)</div>
              {topWorkouts.map((w, i) => (
                <div key={i} style={listItem}>
                  <span>{w.label}</span>
                  <span style={{ color: ACCENT, fontWeight: "600" }}>{w.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN – RECENT ACTIVITY */}
          <div style={column}>
            <div style={card}>
              <div style={sectionTitle}>Recent Activity</div>
              {recentActivity.map(item => (
                <div key={item.id} style={listItem}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "13px" }}>
                      <span style={badge(item.type)}>{item.type}</span>
                      {item.detail}
                    </span>
                    <span style={{ fontSize: "12px", color: TEXT_MUTED }}>{item.user}</span>
                  </div>
                  <span style={{ fontSize: "12px", color: TEXT_MUTED }}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
