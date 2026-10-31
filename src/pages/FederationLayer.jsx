import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";

const COLOR = "#ec4899";

export default function FederationLayer() {
  const { setMenuOpen } = useContext(MenuContext);
  const [federations, setFederations] = useState([]);
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try { const rows = await apiRequest("/federation/list"); setFederations(Array.isArray(rows) ? rows : []); }
    catch (requestError) { setError(requestError.message || "Unable to load federations."); }
    finally { setLoading(false); }
  }
  useEffect(() => { let active = true; apiRequest("/federation/list").then((rows) => { if (active) setFederations(Array.isArray(rows) ? rows : []); }).catch((e) => { if (active) setError(e.message || "Unable to load federations."); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);

  async function toggle(fed) {
    try { await apiRequest(`/federation/${fed.id}/join`, { method: fed.joined ? "DELETE" : "POST" }); setError(""); await load(); }
    catch (e) { setError(e.message || "Unable to update membership."); }
  }
  async function create(event) {
    event.preventDefault();
    try { await apiRequest("/federation/create", { method: "POST", body: { name: name.trim(), sport: sport.trim() || null, country: country.trim() || null } }); setName(""); setSport(""); setCountry(""); await load(); }
    catch (e) { setError(e.message || "Unable to create federation."); }
  }

  return <main style={pageStyle}><section style={{ width: 580, maxWidth: "100%" }}>
    <h1 style={{ color: COLOR, textAlign: "center" }}>Federations</h1>
    <form onSubmit={create} style={formStyle}><strong>Create federation</strong><input aria-label="Federation name" required maxLength={160} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} /><div style={{ display: "flex", gap: "8px" }}><input aria-label="Sport" placeholder="Sport" value={sport} onChange={(e) => setSport(e.target.value)} style={inputStyle} /><input aria-label="Country" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} style={inputStyle} /></div><button style={buttonStyle}>Create</button></form>
    {error && <p role="alert" style={{ color: "#ff8b8b" }}>{error}</p>}
    {loading ? <p>Loading federations...</p> : federations.length === 0 ? <p>No federations have been created yet.</p> : federations.map((fed) => <article key={fed.id} style={cardStyle}><strong>{fed.name}</strong><p style={{ color: "#aaa" }}>{[fed.sport, fed.country].filter(Boolean).join(" ? ") || "Federation"}</p><button type="button" onClick={() => toggle(fed)} style={buttonStyle}>{fed.joined ? "Leave" : "Join"}</button></article>)}
  </section><button onClick={() => setMenuOpen(true)} style={menuStyle}>Return to Menu</button></main>;
}
const pageStyle = { width: "100vw", minHeight: "100vh", background: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", color: "#fff" };
const formStyle = { display: "grid", gap: "9px", background: "#111", borderRadius: "12px", padding: "14px", marginBottom: "18px" };
const cardStyle = { background: "#111", border: "1px solid #333", borderRadius: "12px", padding: "14px", marginTop: "10px" };
const inputStyle = { minWidth: 0, width: "100%", boxSizing: "border-box", padding: "9px", background: "#000", color: "white", border: "1px solid #333", borderRadius: "7px" };
const buttonStyle = { padding: "9px 14px", background: COLOR, color: "#000", border: 0, borderRadius: "8px", cursor: "pointer", fontWeight: 700 };
const menuStyle = { position: "fixed", bottom: "20px", right: "20px", color: COLOR, fontSize: "18px", textDecoration: "underline", background: "#000", border: 0, cursor: "pointer" };
