import { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import useInsights from "../hooks/useInsights.js";

export default function AthleteAnalytics() {
  const { setMenuOpen } = useContext(MenuContext);
  const { data, loading, error } = useInsights("/insights/summary", "Unable to load analytics.");
  const metrics = data ? [
    { label: "Training sessions", value: data.training.total_sessions },
    { label: "Training time", value: `${(data.training.total_minutes / 60).toFixed(1)} hours` },
    { label: "Sessions in last 7 days", value: data.counts.workouts.last_7_days + data.counts.sports.last_7_days },
    { label: "Personal records", value: data.personal_records },
    { label: "Latest body weight", value: data.weight.latest_kg == null ? "Not logged" : `${data.weight.latest_kg} kg` },
    { label: "Weight change", value: data.weight.change_kg == null ? "Not enough entries" : `${data.weight.change_kg} kg` },
    { label: "Avg calories (logged days, 30d)", value: data.nutrition.avg_calories },
    { label: "Avg protein g (logged days, 30d)", value: data.nutrition.avg_protein },
    { label: "Avg water ml (logged days, 30d)", value: data.water.avg_ml_per_logged_day },
    { label: "Journal entries", value: data.counts.journal.total },
  ] : [];
  return <main style={{ minHeight: "100vh", background: "black", color: "white", padding: "20px 20px 80px", boxSizing: "border-box" }}>
    <h1 style={{ color: "#a78bfa", textAlign: "center" }}>Athlete Analytics</h1>
    <p>Computed on the server from your own logs only; estimated training-load and stress values are not shown.</p>
    {loading && <p role="status">Loading analytics...</p>}
    {error && <p role="alert">{error}</p>}
    {data && <>
      <section style={{ display: "grid", gap: 12 }}>{metrics.map((metric) => <article key={metric.label} style={{ background: "#111", border: "1px solid #333", borderRadius: 12, padding: 14 }}><strong>{metric.label}</strong><p>{metric.value}</p></article>)}</section>
      <h2>Weekly trend</h2>
      {data.weekly_trend.map((week) => <p key={week.week_start}>Week of {week.week_start}: {week.sessions} sessions, {week.minutes} min</p>)}
    </>}
    <button type="button" onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: 20, right: 20, zIndex: 20, color: "#a78bfa", background: "none", border: 0, textDecoration: "underline", fontSize: 18, cursor: "pointer" }}>Return to Menu</button>
  </main>;
}
