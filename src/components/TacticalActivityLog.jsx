import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api.js";
import TextAction from "./TextAction.jsx";

export default function TacticalActivityLog({ module, title, accent = "#2d5f3a" }) {
  const [records, setRecords] = useState([]);
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("30");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function save(next) {
    await apiRequest(`/tactical/progress/${module}`, { method: "PUT", body: { item_key: "activity-log", data: next } });
    setRecords(next);
  }

  useEffect(() => {
    let active = true;
    apiRequest(`/tactical/progress/${module}?item_key=activity-log`).then((result) => {
      if (active) setRecords(Array.isArray(result.data) ? result.data : []);
    }).catch((requestError) => {
      if (active) setError(requestError.message || "Unable to load training activity.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [module]);

  async function logTraining(event) {
    event.preventDefault();
    const record = { id: `${Date.now()}`, activity: activity.trim(), duration_minutes: Number(duration), notes: notes.trim(), occurred_at: new Date().toISOString() };
    try {
      await save([record, ...records]);
      setActivity(""); setNotes(""); setError("");
    } catch (requestError) { setError(requestError.message || "Unable to save training activity."); }
  }

  async function removeRecord(id) {
    try { await save(records.filter((record) => record.id !== id)); setError(""); }
    catch (requestError) { setError(requestError.message || "Unable to remove this activity record."); }
  }

  return <section aria-busy={loading} style={{ marginTop: 24, padding: 14, color: "#fff", background: "#111", border: `1px solid ${accent}`, borderRadius: 10 }}>
    <h2 style={{ color: accent }}>{title} training log</h2>
    <p>Record completed training sessions with duration and notes.</p>
    {error && <p role="alert" style={{ color: "#fecaca" }}>{error}</p>}
    <form onSubmit={logTraining} style={{ display: "grid", gap: 8 }}>
      <label>Activity<input required value={activity} onChange={(event) => setActivity(event.target.value)} style={field} /></label>
      <label>Duration (minutes)<input required type="number" min="1" value={duration} onChange={(event) => setDuration(event.target.value)} style={field} /></label>
      <label>Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows="2" style={field} /></label>
      <TextAction submit style={{ color: accent, display: "inline-block", padding: "8px 0" }}>Log training session</TextAction>
    </form>
    <h3>Recorded sessions</h3>
    {loading ? <p role="status">Loading training activity?</p> : records.length === 0 ? <p role="status">No training sessions recorded yet.</p> : records.map((record) => <article key={record.id} style={{ borderTop: "1px solid #444", padding: 8 }}><strong>{record.activity}</strong><p>{record.duration_minutes} minutes · {new Date(record.occurred_at).toLocaleString()}</p>{record.notes && <p>{record.notes}</p>}<TextAction onClick={() => removeRecord(record.id)} style={{ color: accent }}>Delete session</TextAction></article>)}
  </section>;
}

const field = { display: "block", width: "100%", boxSizing: "border-box", padding: 8, marginTop: 4, color: "#fff", background: "#000", border: "1px solid #444", borderRadius: 6 };

