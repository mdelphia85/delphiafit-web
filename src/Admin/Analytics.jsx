import AdminLayout from "./Admin.jsx";
import { useEffect, useState } from "react";
import { adminFetch, formatDateTime } from "./adminApi.js";
import { ACCENT, BORDER, TEXT_MUTED, card, container, errorBox, subtitle } from "./adminTheme.js";

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const result = await adminFetch("/admin/analytics");
        if (!active) return;
        setAnalytics(result);
        setErrorMessage("");
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        if (active) setErrorMessage(err.message || "Unable to load analytics data.");
      }
    }
    load();
    const timer = setInterval(load, 60000);
    return () => { active = false; clearInterval(timer); };
  }, [refreshKey]);

  const cardLabel = { fontSize: "13px", color: TEXT_MUTED, marginBottom: "4px" };
  const cardValue = { fontSize: "22px", fontWeight: "600" };
  const kpiRow = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px"
  };
  const layoutRow = { display: "flex", flexDirection: "row", gap: "16px", flexWrap: "wrap" };
  const column = { flex: 1, minWidth: "260px", display: "flex", flexDirection: "column", gap: "12px" };
  const sectionTitle = { fontSize: "16px", fontWeight: "500", marginBottom: "6px" };
  const listItem = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    padding: "6px 0",
    borderBottom: `1px solid ${BORDER}`
  };
  const badge = {
    fontSize: "11px",
    padding: "2px 6px",
    borderRadius: "999px",
    border: `1px solid ${BORDER}`,
    color: TEXT_MUTED,
    marginRight: "6px"
  };

  if (errorMessage && !analytics) {
    return <AdminLayout><div style={container}>
      <div role="alert" style={errorBox}>{errorMessage}</div>
      <button type="button" onClick={() => setRefreshKey(key => key + 1)}>Retry</button>
    </div></AdminLayout>;
  }

  if (!analytics) {
    return <AdminLayout><div style={container}>Loading analytics...</div></AdminLayout>;
  }

  const overview = analytics.overview || {};
  const topWorkouts = analytics.top_workouts || [];
  const recentActivity = analytics.recent_activity || [];
  const series = analytics.daily_series || [];
  const peak = Math.max(1, ...series.map(d => Math.max(d.logins, d.workouts, d.dailyLogs, d.signups)));

  const kpis = [
    ["Total Users", overview.totalUsers],
    ["New Users (7 days)", overview.newUsers7d],
    ["Active Users (7 days)", overview.activeUsers7d],
    ["Logins (7 days)", overview.logins7d],
    ["Workouts Logged (7 days)", overview.workoutsLogged7d],
    ["Daily Logs (7 days)", overview.dailyLogs7d],
  ];

  return (
    <AdminLayout>
      <div style={{ ...container, gap: "16px" }}>
        <div>
          <div style={{ fontSize: "24px", fontWeight: "600" }}>Admin Analytics</div>
          <div style={subtitle}>Metrics computed from live user, login, workout, and log records.</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={() => setRefreshKey(key => key + 1)}>Refresh Data</button>
            {lastUpdated && <small style={{ color: TEXT_MUTED }}>Last updated {lastUpdated} · auto-refreshes every minute</small>}
          </div>
          {errorMessage && <div role="alert" style={errorBox}>{errorMessage}</div>}
        </div>

        <div style={kpiRow}>
          {kpis.map(([label, value]) => (
            <div key={label} style={{ ...card, padding: "12px 14px" }}>
              <div style={cardLabel}>{label}</div>
              <div style={cardValue}>{value ?? "Unavailable"}</div>
            </div>
          ))}
        </div>

        <div style={card}>
          <div style={sectionTitle}>Last 7 Days</div>
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", height: "120px" }}>
            {series.map(day => (
              <div key={day.date} style={{ flex: 1, textAlign: "center" }}>
                <div
                  title={`${day.logins} logins, ${day.workouts} workouts, ${day.dailyLogs} daily logs, ${day.signups} signups`}
                  style={{
                    height: `${Math.round(((day.logins + day.workouts + day.dailyLogs) / (peak * 3)) * 100)}px`,
                    minHeight: "2px",
                    backgroundColor: ACCENT,
                    borderRadius: "4px 4px 0 0"
                  }}
                />
                <div style={{ fontSize: "11px", color: TEXT_MUTED, marginTop: "4px" }}>
                  {day.date.slice(5)}
                </div>
                <div style={{ fontSize: "11px" }}>{day.logins + day.workouts + day.dailyLogs}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "12px", color: TEXT_MUTED, marginTop: "6px" }}>
            Daily total of logins, workouts and daily logs.
          </div>
        </div>

        <div style={layoutRow}>
          <div style={column}>
            <div style={card}>
              <div style={sectionTitle}>Top Workouts (7 days)</div>
              {topWorkouts.map((w, i) => (
                <div key={i} style={listItem}>
                  <span>{w.label}</span>
                  <span style={{ color: ACCENT, fontWeight: "600" }}>{w.count}</span>
                </div>
              ))}
              {topWorkouts.length === 0 && (
                <div style={{ color: TEXT_MUTED, fontSize: "14px" }}>No workouts logged in the last 7 days.</div>
              )}
            </div>
          </div>

          <div style={column}>
            <div style={card}>
              <div style={sectionTitle}>Recent Activity</div>
              {recentActivity.map(item => (
                <div key={item.id} style={listItem}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "13px" }}>
                      <span style={badge}>{item.type}</span>
                      {item.detail}
                    </span>
                    <span style={{ fontSize: "12px", color: TEXT_MUTED }}>{item.user}</span>
                  </div>
                  <span style={{ fontSize: "12px", color: TEXT_MUTED }}>{formatDateTime(item.time)}</span>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <div style={{ color: TEXT_MUTED, fontSize: "14px" }}>No activity in the last 7 days.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
