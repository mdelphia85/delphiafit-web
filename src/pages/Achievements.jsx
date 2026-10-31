import { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import useInsights from "../hooks/useInsights.js";

export default function Achievements() {
  const { setMenuOpen } = useContext(MenuContext);
  const { data, loading, error } = useInsights("/insights/achievements", "Unable to load achievements.");
  return <main style={{ minHeight: "100vh", background: "black", color: "white", padding: 20, boxSizing: "border-box" }}>
    <h1 style={{ color: "dodgerblue", textAlign: "center" }}>Achievements</h1>
    {loading && <p role="status">Loading your achievements...</p>}
    {error && <p role="alert">{error}</p>}
    {data && <p style={{ textAlign: "center" }}>{data.unlocked} of {data.total} unlocked</p>}
    {data && data.items.map((item) => {
      const progress = Math.round((item.progress / item.target) * 100);
      return <article key={item.id} style={{ background: "#111", border: `1px solid ${item.unlocked ? "dodgerblue" : "#333"}`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
        <strong style={{ color: "dodgerblue" }}>{item.title}{item.unlocked ? " (unlocked)" : ""}</strong>
        <p>{item.description} - {item.progress}/{item.target}</p>
        <progress value={progress} max="100" aria-label={`${item.title} progress`} /> <span>{progress}%</span>
      </article>;
    })}
    <button type="button" onClick={() => setMenuOpen(true)} style={{ color: "dodgerblue", background: "none", border: 0, textDecoration: "underline" }}>Return to Menu</button>
  </main>;
}
