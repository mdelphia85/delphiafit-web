import { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import useInsights from "../hooks/useInsights.js";

export default function Streaks() {
  const { setMenuOpen } = useContext(MenuContext);
  const { data, loading, error } = useInsights("/insights/streaks", "Unable to load streak data.");
  const sources = data ? Object.entries(data.sources) : [];
  return <main style={{ minHeight: "100vh", background: "black", color: "#4464FF", padding: 20, boxSizing: "border-box" }}>
    <h1>Streaks</h1>
    <p>Consecutive days based on everything you have logged. No activity is shown as zero.</p>
    {loading && <p role="status">Loading your activity...</p>}
    {error && <p role="alert">{error}</p>}
    {data && <>
      <article style={{ background: "#111", border: "1px solid #4464FF", borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <strong>Overall activity streak</strong>
        <p>{data.overall.current} days (best: {data.overall.longest}, active days: {data.overall.total_days})</p>
      </article>
      {sources.map(([key, item]) => <article key={key} style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <strong>{item.label} Streak</strong>
        <p>{item.current} days (best: {item.longest})</p>
        <small>{item.last_active ? `Last logged ${item.last_active}` : "Nothing logged yet"}</small>
      </article>)}
    </>}
    <button type="button" onClick={() => setMenuOpen(true)} style={{ color: "#4464FF", background: "none", border: 0, textDecoration: "underline" }}>Return to Menu</button>
  </main>;
}
