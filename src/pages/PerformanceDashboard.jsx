import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";
import useInsights from "../hooks/useInsights.js";

export default function PerformanceDashboard() {
  const { setMenuOpen } = useContext(MenuContext);
  const { data, loading, error } = useInsights("/insights/summary", "Unable to load performance records.");
  const [strength, setStrength] = useState([]);
  useEffect(() => {
    let active = true;
    apiRequest("/progress/strength").then((rows) => active && setStrength(rows)).catch(() => {});
    return () => { active = false; };
  }, []);
  const latestStrength = [...strength].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);
  const cards = data ? [
    { label: "Training sessions", value: data.training.total_sessions },
    { label: "Minutes in last 7 days", value: data.training.minutes_last_7_days },
    { label: "Active days (30 days)", value: data.training.active_days_last_30 },
    { label: "Personal records", value: data.personal_records },
    { label: "Current activity streak", value: `${data.streaks.overall.current} days` },
  ] : [];
  return <main style={{ minHeight: "100vh", background: "black", color: "white", padding: "20px 20px 80px", boxSizing: "border-box" }}>
    <h1 style={{ color: "#fbbf24" }}>Performance</h1>
    <p>Performance summary computed from your recorded training, sports and strength metrics.</p>
    {loading && <p role="status">Loading performance...</p>}
    {error && <p role="alert">{error}</p>}
    {data && <>
      <section style={{ display: "grid", gap: 12 }}>{cards.map((x) => <article key={x.label} style={{ background: "#111", border: "1px solid #333", borderRadius: 12, padding: 14 }}><strong>{x.label}</strong><p>{x.value}</p></article>)}</section>
      <h2>Weekly training</h2>
      {data.weekly_trend.map((week) => <p key={week.week_start}>Week of {week.week_start}: {week.sessions} sessions, {week.minutes} min</p>)}
      <h2>Latest strength metrics</h2>
      {latestStrength.length ? latestStrength.map((metric) => <p key={metric.id}>{metric.metric_name}: {metric.value} - {new Date(metric.created_at).toLocaleDateString()}</p>) : <p>No strength metrics recorded yet.</p>}
    </>}
    <button type="button" onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: 20, right: 20, zIndex: 20, color: "#fbbf24", background: "black", border: 0, textDecoration: "underline", fontSize: 18, cursor: "pointer" }}>Return to Menu</button>
  </main>;
}
