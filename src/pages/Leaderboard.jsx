import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";

const COLOR = "dodgerblue";

export default function Leaderboard() {
  const { setMenuOpen } = useContext(MenuContext);
  const [period, setPeriod] = useState("weekly");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest(`/sports/logs/leaderboard?period=${period}`)
      .then((data) => { if (active) setEntries(Array.isArray(data) ? data : []); })
      .catch((requestError) => { if (active) setError(requestError.message || "Unable to load rankings."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [period]);

  return (
    <main style={{ minHeight: "100vh", width: "100vw", background: "black", padding: "20px 20px 90px", boxSizing: "border-box", color: "white" }}>
      <section style={{ maxWidth: "760px", margin: "0 auto" }}>
        <h1 style={{ color: COLOR, textAlign: "center" }}>Leaderboard</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
          {[["weekly", "Weekly"], ["monthly", "Monthly"], ["alltime", "All Time"]].map(([value, label]) => <button key={value} type="button" onClick={() => { setLoading(true); setError(""); setPeriod(value); }} aria-pressed={period === value} style={{ background: period === value ? COLOR : "transparent", color: period === value ? "black" : COLOR, border: `1px solid ${COLOR}`, borderRadius: "999px", padding: "8px 12px", cursor: "pointer", fontWeight: 700 }}>{label}</button>)}
        </div>
        {error && <p role="alert" style={{ color: "#ff8b8b" }}>{error}</p>}
        {loading ? <p>Loading rankings?</p> : entries.length === 0 ? <p>No sports logs in this period yet. Log a session to start the leaderboard.</p> : <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {entries.map((entry) => <article key={entry.user_id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", background: "#111", border: "1px solid #333", borderRadius: "12px", padding: "12px 14px" }}>
            <div><strong style={{ color: COLOR, fontSize: "20px" }}>#{entry.rank}</strong><span style={{ marginLeft: "12px" }}>{entry.name}</span></div>
            <div style={{ color: COLOR, textAlign: "right" }}>{entry.minutes} min<br /><small style={{ color: "#aaa" }}>{entry.sessions} sessions</small></div>
          </article>)}
        </div>}
      </section>
      <button type="button" onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", color: COLOR, background: "black", border: 0, textDecoration: "underline", fontSize: "18px", cursor: "pointer" }}>Return to Menu</button>
    </main>
  );
}
