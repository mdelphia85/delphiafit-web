import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api.js";
import AdaptiveCoachCard from "../components/AdaptiveCoachCard.jsx";
const COLOR = "#14b8a6";
export default function AutonomousCoaching() {
  const navigate = useNavigate();
  const [fatigue, setFatigue] = useState(3);
  const [sleep, setSleep] = useState(7);
  const [sessions, setSessions] = useState(3);
  const [goals, setGoals] = useState("strength");
  const [injuries, setInjuries] = useState("");
  const [plan, setPlan] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function loadHistory() { try { setHistory(await apiRequest("/ai/records")); } catch (e) { setError(e.message); } }
  async function generate(event) {
    event.preventDefault(); setBusy(true); setError("");
    const user_data = { fatigue: Number(fatigue), sleep_hours: Number(sleep), sessions_per_week: Number(sessions), goals: goals.split(",").map((x) => x.trim()).filter(Boolean), injuries: injuries.split(",").map((x) => x.trim()).filter(Boolean) };
    try { const result = await apiRequest("/ai/weekly-plan", { method: "POST", body: user_data }); setPlan(result.result); await loadHistory(); }
    catch (e) { setError(e.status === 401 ? "Log in to generate a saved plan." : e.message); } finally { setBusy(false); }
  }
  const field = { display: "block", width: "100%", boxSizing: "border-box", padding: 9, background: "#111", color: "#fff", border: "1px solid #444", borderRadius: 6 };
  return <main style={{ width: "100%", minHeight: "100vh", background: "#000", color: "#fff", boxSizing: "border-box", padding: "20px 16px 90px" }}><div style={{ maxWidth: 680, margin: "0 auto" }}>
    <h1 style={{ color: COLOR, textAlign: "center" }}>🤖 Rule-based Coaching</h1><p style={{ color: "#aaa" }}>Generates a saved training plan using the existing rule-based weekly planner. It is not an LLM or medical advice. Confirm injury accommodations with a qualified professional.</p>{error && <p role="alert" style={{ color: "#f87171" }}>{error}</p>}
    <AdaptiveCoachCard />
    <form onSubmit={generate} style={{ background: "#111", borderRadius: 10, padding: 16, display: "grid", gap: 12 }}><label>Fatigue (0–10)<input type="number" min="0" max="10" value={fatigue} onChange={(e) => setFatigue(e.target.value)} style={field} /></label><label>Sleep (hours)<input type="number" min="0" max="24" step="0.5" value={sleep} onChange={(e) => setSleep(e.target.value)} style={field} /></label><label>Sessions per week<select value={sessions} onChange={(e) => setSessions(e.target.value)} style={field}>{[2,3,4,5,6].map((n) => <option key={n}>{n}</option>)}</select></label><label>Goals (comma-separated)<input value={goals} onChange={(e) => setGoals(e.target.value)} style={field} /></label><label>Injuries to accommodate (comma-separated, optional)<input value={injuries} onChange={(e) => setInjuries(e.target.value)} style={field} /></label><button disabled={busy} style={{ padding: 12, background: COLOR, border: 0, borderRadius: 8, fontWeight: 700 }}>{busy ? "Generating…" : "Generate and save plan"}</button></form>
    {plan && <section style={{ background: "#111", borderRadius: 10, padding: 16, marginTop: 16 }}><h2>Saved plan</h2><pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{JSON.stringify(plan, null, 2)}</pre></section>}
    <section style={{ marginTop: 16 }}><h2>Previous saved recommendations</h2><button onClick={loadHistory} style={{ padding: 8 }}>Refresh history</button>{history.filter((r) => r.feature === "weekly-plan").map((r) => <div key={r.id} style={{ background: "#111", marginTop: 8, padding: 10, borderRadius: 8 }}>Saved {new Date(r.created_at).toLocaleString()} · Record {r.id}</div>)}</section>
  </div><div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: 40, background: "#000", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 16px", boxSizing: "border-box" }}><button onClick={() => navigate(-1)} style={{ color: COLOR, background: "transparent", border: 0, textDecoration: "underline" }}>Return</button></div></main>;
}
