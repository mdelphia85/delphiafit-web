import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.js";
import { apiRequest } from "../utils/api.js";

const COLOR = "#14b8a6";
const inputStyle = { width: "100%", boxSizing: "border-box", background: "#111", color: "#fff", border: "1px solid #444", borderRadius: 6, padding: 10 };

export default function OrganizationLayer() {
  const { setMenuOpen } = useContext(MenuContext);
  const [organizations, setOrganizations] = useState([]);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [selected, setSelected] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [tenantName, setTenantName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try { const rows = await apiRequest("/org/mine"); setOrganizations(rows); }
    catch (e) { setError(e.status === 401 ? "Log in to view your organizations." : e.message); }
  }
  useEffect(() => { const timer = setTimeout(() => { load(); }, 0); return () => clearTimeout(timer); }, []);
  async function createOrg(event) {
    event.preventDefault(); if (!name.trim()) return;
    setBusy(true); setError("");
    try { await apiRequest("/org/create", { method: "POST", body: { name: name.trim(), industry: industry.trim() || null } }); setName(""); setIndustry(""); await load(); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function selectOrg(org) {
    setSelected(org); setError("");
    try { setTenants(await apiRequest(`/org/${org.id}/tenant/list`)); }
    catch (e) { setError(e.message); }
  }
  async function createTenant(event) {
    event.preventDefault(); if (!selected || !tenantName.trim()) return;
    setBusy(true); setError("");
    try { await apiRequest(`/org/${selected.id}/tenant/create`, { method: "POST", body: { name: tenantName.trim() } }); setTenantName(""); setTenants(await apiRequest(`/org/${selected.id}/tenant/list`)); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  return <main style={{ width: "100%", minHeight: "100vh", background: "#000", padding: "20px 16px 90px", color: "#fff", boxSizing: "border-box" }}>
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", color: COLOR }}>🏛️ Organization</h1>
      {error && <p role="alert" style={{ color: "#f87171" }}>{error}</p>}
      {organizations.length === 0 && !error && <p>No organizations are linked to your account yet.</p>}
      <div style={{ display: "grid", gap: 10 }}>{organizations.map((org) => <button key={org.id} onClick={() => selectOrg(org)} style={{ textAlign: "left", background: selected?.id === org.id ? "#163b38" : "#111", color: "#fff", border: `1px solid ${COLOR}`, borderRadius: 10, padding: 14 }}><strong>{org.name}</strong><div style={{ color: "#aaa", fontSize: 12 }}>{org.industry || "Organization"} · ID {org.id}</div></button>)}</div>
      {selected && <section style={{ background: "#111", borderRadius: 10, marginTop: 16, padding: 16 }}><h2>{selected.name} · Units</h2>{tenants.length ? tenants.map((t) => <div key={t.id} style={{ padding: 8, borderBottom: "1px solid #333" }}>{t.name}{t.description ? ` — ${t.description}` : ""}</div>) : <p>No units configured.</p>}<form onSubmit={createTenant} style={{ display: "flex", gap: 8, marginTop: 12 }}><input aria-label="Unit name" value={tenantName} onChange={(e) => setTenantName(e.target.value)} placeholder="New unit name" style={inputStyle} /><button disabled={busy || !tenantName.trim()} style={{ background: COLOR, border: 0, borderRadius: 6, padding: 10 }}>Add unit</button></form></section>}
      <form onSubmit={createOrg} style={{ background: "#111", borderRadius: 10, marginTop: 20, padding: 16, display: "grid", gap: 10 }}><h2 style={{ margin: 0 }}>Create organization</h2><input aria-label="Organization name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Organization name" style={inputStyle} /><input aria-label="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Industry (optional)" style={inputStyle} /><button disabled={busy || !name.trim()} style={{ background: COLOR, border: 0, borderRadius: 8, padding: 12, fontWeight: 700 }}>Create organization</button></form>
    </div>
    <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: 40, background: "#000", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 16px", boxSizing: "border-box" }}><button onClick={() => setMenuOpen(true)} style={{ color: COLOR, background: "transparent", border: 0, textDecoration: "underline" }}>Return to Menu</button></div>
  </main>;
}
