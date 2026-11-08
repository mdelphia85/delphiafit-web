import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.js";
import { apiRequest } from "../utils/api.js";
const COLOR = "#ef4444";
const field = { display: "block", width: "100%", boxSizing: "border-box", background: "#111", color: "#fff", border: "1px solid #444", borderRadius: 6, padding: 10, marginTop: 6 };
export default function MedicalRehab() {
  const { setMenuOpen } = useContext(MenuContext);
  const [injuries, setInjuries] = useState([]);
  const [carePlans, setCarePlans] = useState({});
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState("mild");
  const [description, setDescription] = useState("");
  const [protocolNames, setProtocolNames] = useState({});
  const [ptNames, setPtNames] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function load() {
    try {
      const rows = await apiRequest("/medical/injury/me");
      setInjuries(rows);
      const details = await Promise.all(rows.map(async (injury) => {
        const [protocols, ptPlans] = await Promise.all([
          apiRequest(`/medical/recovery/injury/${injury.id}`), apiRequest(`/medical/pt/injury/${injury.id}`)
        ]);
        return [injury.id, { protocols, ptPlans }];
      }));
      setCarePlans(Object.fromEntries(details)); setError("");
    } catch (e) { setError(e.status === 401 ? "Log in to view your recovery records." : e.message); }
  }
  useEffect(() => { const timer = setTimeout(() => { load(); }, 0); return () => clearTimeout(timer); }, []);
  async function submit(event) {
    event.preventDefault(); if (!type.trim()) return;
    setBusy(true); setError(""); setNotice("");
    try { await apiRequest("/medical/injury/log", { method: "POST", body: { type: type.trim(), severity, description: description.trim() || null, occurred_at: new Date().toISOString() } }); setType(""); setDescription(""); setNotice("Injury record saved."); await load(); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function resolve(id) {
    setBusy(true); setError("");
    try { await apiRequest(`/medical/injury/${id}/resolve`, { method: "POST", body: {} }); await load(); setNotice("Record marked resolved."); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function addCarePlan(event, injuryId, typeName) {
    event.preventDefault();
    const name = (typeName === "protocol" ? protocolNames[injuryId] : ptNames[injuryId])?.trim();
    if (!name) return;
    setBusy(true); setError(""); setNotice("");
    try {
      if (typeName === "protocol") await apiRequest("/medical/recovery/create", { method: "POST", body: { injury_id: injuryId, name } });
      else await apiRequest("/medical/pt/create", { method: "POST", body: { injury_id: injuryId, name, frequency_per_week: 3, duration_weeks: 4 } });
      if (typeName === "protocol") setProtocolNames((old) => ({ ...old, [injuryId]: "" }));
      else setPtNames((old) => ({ ...old, [injuryId]: "" }));
      await load(); setNotice("Recovery plan saved. Follow clinician-provided guidance.");
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <main style={{ width: "100%", minHeight: "100vh", background: "#000", padding: "20px 16px 90px", color: "#fff", boxSizing: "border-box" }}><div style={{ maxWidth: 620, margin: "0 auto" }}>
    <h1 style={{ color: COLOR, textAlign: "center" }}>🏥 Medical + Rehab</h1><p style={{ color: "#aaa" }}>Record injuries and clinician-provided recovery plans. This is not a diagnosis or substitute for care from a licensed clinician.</p>
    {error && <p role="alert" style={{ color: "#f87171" }}>{error}</p>}{notice && <p role="status" style={{ color: "#6ee7b7" }}>{notice}</p>}
    <form onSubmit={submit} style={{ background: "#111", borderRadius: 10, padding: 16, display: "grid", gap: 12 }}><h2 style={{ margin: 0 }}>Log an injury</h2><label>Injury type<input aria-label="Injury type" value={type} onChange={(e) => setType(e.target.value)} style={field} required /></label><label>Severity<select aria-label="Severity" value={severity} onChange={(e) => setSeverity(e.target.value)} style={field}>{["mild", "moderate", "severe"].map((x) => <option key={x}>{x}</option>)}</select></label><label>Description<textarea aria-label="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={field} rows={3} /></label><button disabled={busy || !type.trim()} style={{ padding: 12, background: COLOR, border: 0, borderRadius: 8, fontWeight: 700 }}>Save injury record</button></form>
    <section style={{ marginTop: 18 }}><h2>My records</h2>{injuries.length ? injuries.map((injury) => { const care = carePlans[injury.id] || { protocols: [], ptPlans: [] }; return <article key={injury.id} style={{ background: "#111", border: "1px solid #333", borderRadius: 10, padding: 14, marginBottom: 10 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}><strong>{injury.type}</strong><span style={{ color: injury.resolved ? "#6ee7b7" : "#fbbf24" }}>{injury.resolved ? "Resolved" : injury.severity}</span></div>{injury.description && <p>{injury.description}</p>}<small style={{ color: "#999" }}>Occurred: {new Date(injury.occurred_at).toLocaleDateString()}</small>
      <h3>Recovery protocols</h3>{care.protocols.map((row) => <div key={row.id} style={{ borderTop: "1px solid #333", padding: 8 }}>{row.name}</div>)}{!care.protocols.length && <p>No protocols recorded.</p>}<form onSubmit={(event) => addCarePlan(event, injury.id, "protocol")} style={{ display: "flex", gap: 8 }}><input aria-label={`Recovery protocol for ${injury.type}`} value={protocolNames[injury.id] || ""} onChange={(e) => setProtocolNames((old) => ({ ...old, [injury.id]: e.target.value }))} placeholder="Clinician-provided protocol" style={field} /><button disabled={busy || !(protocolNames[injury.id] || "").trim()}>Save</button></form>
      <h3>PT plans</h3>{care.ptPlans.map((row) => <div key={row.id} style={{ borderTop: "1px solid #333", padding: 8 }}>{row.name} · {row.frequency_per_week} times/week for {row.duration_weeks} weeks</div>)}{!care.ptPlans.length && <p>No PT plans recorded.</p>}<form onSubmit={(event) => addCarePlan(event, injury.id, "pt")} style={{ display: "flex", gap: 8 }}><input aria-label={`PT plan for ${injury.type}`} value={ptNames[injury.id] || ""} onChange={(e) => setPtNames((old) => ({ ...old, [injury.id]: e.target.value }))} placeholder="Clinician-provided PT plan" style={field} /><button disabled={busy || !(ptNames[injury.id] || "").trim()}>Save</button></form>
      {!injury.resolved && <button disabled={busy} onClick={() => resolve(injury.id)} style={{ display: "block", marginTop: 12, padding: 8 }}>Mark resolved</button>}</article>; }) : <p>No injury records yet.</p>}</section>
  </div><div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: 40, background: "#000", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 16px", boxSizing: "border-box" }}><button onClick={() => setMenuOpen(true)} style={{ color: COLOR, background: "transparent", border: 0, textDecoration: "underline" }}>Return to Menu</button></div></main>;
}
