import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.js";
import { apiRequest } from "../utils/api.js";
import { userDataApi } from "../utils/userDataApi.js";

export default function History() {
  const { setMenuOpen } = useContext(MenuContext);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([apiRequest("/daily-log/"), apiRequest("/workouts/"), apiRequest("/hydration/"), userDataApi.list("journal")])
      .then(([logs, workouts, hydration, journal]) => {
        if (!active) return;
        const combined = [
          ...logs.map((item) => ({ id: `log-${item.id}`, date: item.date, title: "Daily log", summary: `${item.workouts || 0} workouts ? ${item.calories || 0} calories ? ${item.water || 0} oz water` })),
          ...workouts.map((item) => ({ id: `workout-${item.id}`, date: item.date, title: item.manual_name || item.workout_type || "Workout", summary: `${item.duration_minutes} minutes${item.manual_notes ? ` ? ${item.manual_notes}` : ""}` })),
          ...hydration.map((item) => ({ id: `water-${item.id}`, date: item.date, title: "Hydration", summary: `${item.amount_ml} ml logged` })),
          ...journal.map((item) => ({ id: `journal-${item.id}`, date: item.data.timestamp || item.created_at, title: "Journal entry", summary: item.data.text || "Saved journal note" }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
        setEntries(combined);
      })
      .catch((err) => active && setError(err.message || "Unable to load history."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return <main style={{ minHeight: "100vh", background: "black", color: "yellow", padding: "20px 20px 80px", boxSizing: "border-box" }}>
    <h1>History</h1><p>Your saved daily logs, workouts, hydration entries, and journal notes.</p>
    {loading && <p role="status">Loading history…</p>}{error && <p role="alert">{error}</p>}
    {!loading && !error && entries.length === 0 && <p>No logs or workouts recorded yet.</p>}
    <div style={{ display: "grid", gap: 12 }}>{entries.map((item) => <article key={item.id} style={{ border: "1px solid #444", borderRadius: 8, padding: 14 }}><strong>{item.title}</strong><div>{new Date(item.date).toLocaleString()}</div><p>{item.summary}</p></article>)}</div>
    <button type="button" onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: 20, right: 20, zIndex: 20, color: "yellow", background: "black", border: 0, textDecoration: "underline", fontSize: 18, cursor: "pointer" }}>Return to Menu</button>
  </main>;
}
