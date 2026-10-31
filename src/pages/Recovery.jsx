import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";

export default function Recovery() {
  const { setMenuOpen } = useContext(MenuContext);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ sleep_hours: "", soreness_level: "", readiness_score: "", notes: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => { let active = true; apiRequest("/recovery/").then((data) => { if (active) setRecords(data); }).catch((err) => active && setError(err.message || "Unable to load recovery logs.")).finally(() => active && setLoading(false)); return () => { active = false; }; }, []);
  async function save(event) { event.preventDefault(); setSaving(true); setError(""); setMessage(""); try { const row = await apiRequest("/recovery/", { method: "POST", body: { sleep_hours: Number(form.sleep_hours), soreness_level: Number(form.soreness_level), readiness_score: Number(form.readiness_score), notes: form.notes || null } }); setRecords((old) => [row, ...old]); setMessage("Recovery check-in saved."); setForm({ sleep_hours: "", soreness_level: "", readiness_score: "", notes: "" }); } catch (err) { setError(err.message || "Unable to save recovery check-in."); } finally { setSaving(false); } }
  const latest = records[0];
  return <main style={{ minHeight: "100vh", background: "black", color: "#6ee7b7", padding: 20, boxSizing: "border-box" }}>
    <h1>Recovery</h1><p>Recovery information comes from your check-ins, not estimates.</p>{loading && <p role="status">Loading recovery?</p>}{error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    {latest && <section><h2>Latest check-in</h2><p>{new Date(latest.recorded_at).toLocaleString()}</p><p>Sleep: {latest.sleep_hours} hours ? Soreness: {latest.soreness_level}/10 ? Readiness: {latest.readiness_score}/100</p>{latest.notes && <p>{latest.notes}</p>}</section>}
    {!latest && !loading && <p>No recovery check-ins yet.</p>}
    <form onSubmit={save} style={{ display: "grid", gap: 10, maxWidth: 420 }}><label>Sleep (hours)<input required type="number" min="0" max="24" step="0.25" value={form.sleep_hours} onChange={(e) => setForm({ ...form, sleep_hours: e.target.value })} /></label><label>Soreness (1?10)<input required type="number" min="1" max="10" value={form.soreness_level} onChange={(e) => setForm({ ...form, soreness_level: e.target.value })} /></label><label>Readiness (1?100)<input required type="number" min="1" max="100" value={form.readiness_score} onChange={(e) => setForm({ ...form, readiness_score: e.target.value })} /></label><label>Notes<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label><button type="submit" disabled={saving}>{saving ? "Saving?" : "Save check-in"}</button></form>
    <button type="button" onClick={() => setMenuOpen(true)} style={{ color: "#6ee7b7", background: "none", border: 0, textDecoration: "underline", marginTop: 20 }}>Return to Menu</button>
  </main>;
}
