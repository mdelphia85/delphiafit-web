import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";
const COLOR = "#06b6d4";
export default function DelphiaProAnalytics() {
  const { setMenuOpen } = useContext(MenuContext);
  const [metrics, setMetrics] = useState({ strength: [], prs: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => { Promise.all([apiRequest("/progress/strength"), apiRequest("/progress/prs")]).then(([strength, prs]) => setMetrics({ strength, prs })).catch((e) => setError(e.status === 401 ? "Log in to view your performance history." : e.message)).finally(() => setLoading(false)); }, []);
  const section = (title, rows, key) => <section style={{ background: "#111", borderRadius: 10, padding: 14, marginBottom: 12 }}><h2>{title}</h2>{rows.length ? rows.map((row, i) => <div key={row.id || i} style={{ padding: 10, borderTop: "1px solid #333" }}>{key(row)}</div>) : <p>No saved records yet.</p>}</section>;
  return <main style={{ width: "100%", minHeight: "100vh", background: "#000", padding: "20px 16px 90px", color: "#fff", boxSizing: "border-box" }}><div style={{ maxWidth: 620, margin: "0 auto" }}><h1 style={{ color: COLOR, textAlign: "center" }}>⚡ DelphiaFit Pro</h1><p style={{ color: "#aaa" }}>Personal performance history based on records you have saved. No generated or estimated performance metrics.</p>{loading && <p role="status">Loading performance records…</p>}{error && <p role="alert" style={{ color: "#f87171" }}>{error}</p>}{!loading && !error && <>{section("Strength metrics", metrics.strength, (r) => `${r.metric_name || "Metric"}: ${r.value ?? "—"} ${r.pr_type || ""} · ${r.recorded_at || r.created_at || ""}`)}{section("Personal records", metrics.prs, (r) => `${r.exercise_name || "Record"}: ${r.value ?? "—"} ${r.pr_type || ""} · ${r.date || r.created_at || ""}`)}</>}</div><div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: 40, background: "#000", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 16px", boxSizing: "border-box" }}><button onClick={() => setMenuOpen(true)} style={{ color: COLOR, background: "transparent", border: 0, textDecoration: "underline" }}>Return to Menu</button></div></main>;
}
