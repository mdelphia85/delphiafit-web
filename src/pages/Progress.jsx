import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";
import useInsights from "../hooks/useInsights.js";

const sourceKeys = ["workouts", "free_training", "sports", "daily_log", "water", "nutrition", "journal", "weight"];

export default function Progress() {
  const { setMenuOpen } = useContext(MenuContext);
  const { data, loading, error } = useInsights("/insights/summary", "Unable to load progress.");
  const [weights, setWeights] = useState([]);
  useEffect(() => {
    let active = true;
    apiRequest("/weight/").then((rows) => active && setWeights(rows)).catch(() => {});
    return () => { active = false; };
  }, []);
  const empty = data && sourceKeys.every((key) => data.counts[key].total === 0);
  return <main style={{ minHeight: "100vh", background: "black", color: "yellow", padding: 20, boxSizing: "border-box" }}>
    <h1>Progress</h1>
    <p>Totals computed from everything you have logged: workouts, free training, sports, daily logs, water, nutrition, journal and body weight.</p>
    {loading && <p role="status">Loading progress...</p>}
    {error && <p role="alert">{error}</p>}
    {empty && <p>No progress data recorded yet.</p>}
    {data && <>
      <div style={{ display: "grid", gap: 12 }}>
        {sourceKeys.map((key) => <article key={key} style={{ border: "1px solid #444", borderRadius: 8, padding: 14 }}>
          <strong>{key.replace("_", " ").replace(/^./, (c) => c.toUpperCase())}</strong>
          <p>{data.counts[key].total} total</p>
          <small>{data.counts[key].last_7_days} in the last 7 days / {data.counts[key].last_30_days} in the last 30</small>
        </article>)}
      </div>
      <article style={{ marginTop: 16, border: "1px solid #444", padding: 14 }}>
        <strong>Training consistency</strong>
        <p>{data.training.active_days_last_30} active days in the last 30 / {data.training.total_minutes} minutes total</p>
      </article>
      <article style={{ marginTop: 16, border: "1px solid #444", padding: 14 }}>
        <strong>Body weight entries</strong>
        {weights.length ? [...weights].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10).map((entry) => <p key={entry.id}>{new Date(entry.date).toLocaleDateString()} - {entry.weight}{entry.body_fat != null ? ` - ${entry.body_fat}% body fat` : ""}</p>) : <p>No body weight entries recorded yet.</p>}
      </article>
    </>}
    <button type="button" onClick={() => setMenuOpen(true)} style={{ color: "yellow", background: "none", border: 0, textDecoration: "underline", marginTop: 20 }}>Return to Menu</button>
  </main>;
}
