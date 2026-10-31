import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";

const COLOR = "#7c3aed";
export default function PermissionsLayer() {
  const { setMenuOpen } = useContext(MenuContext);
  const [organizations, setOrganizations] = useState([]);
  const [orgId, setOrgId] = useState("");
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { apiRequest("/org/mine").then((rows) => { setOrganizations(rows); if (rows[0]) setOrgId(String(rows[0].id)); }).catch((e) => setError(e.message)); }, []);
  useEffect(() => {
    if (!orgId) return;
    apiRequest(`/org/${orgId}/members`).then(setMembers).catch((e) => { setMembers([]); setError(e.status === 403 ? "Only organization admins can manage roles." : e.message); });
  }, [orgId]);
  async function addMember(event) {
    event.preventDefault(); if (!email.trim() || !orgId) return;
    setBusy(true); setError(""); setNotice("");
    try { const member = await apiRequest(`/org/${orgId}/members`, { method: "POST", body: { email: email.trim(), role: "member" } }); setMembers((rows) => [...rows, member]); setEmail(""); setNotice("Organization member added."); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function setRole(memberId, role) {
    setBusy(true); setError(""); setNotice("");
    try { const updated = await apiRequest(`/org/${orgId}/members/${memberId}/role`, { method: "PATCH", body: { role } }); setMembers((rows) => rows.map((r) => r.id === updated.id ? { ...r, role: updated.role } : r)); setNotice("Role updated."); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <main style={{ width: "100%", minHeight: "100vh", background: "#000", padding: "20px 16px 90px", color: "#fff", boxSizing: "border-box" }}><div style={{ maxWidth: 620, margin: "0 auto" }}>
    <h1 style={{ textAlign: "center", color: COLOR }}>🔐 Organization permissions</h1>
    <p style={{ color: "#aaa" }}>Roles are stored on organization memberships and enforced by organization APIs. Owners and admins can update member roles.</p>
    {error && <p role="alert" style={{ color: "#f87171" }}>{error}</p>}{notice && <p role="status" style={{ color: "#6ee7b7" }}>{notice}</p>}
    <label>Organization<select aria-label="Organization" value={orgId} onChange={(e) => setOrgId(e.target.value)} style={{ display: "block", width: "100%", background: "#111", color: "#fff", padding: 10, marginTop: 8 }}>{organizations.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}</select></label>
    {members.some((m) => m.role === "owner" || m.role === "admin") && <form onSubmit={addMember} style={{ display: "flex", gap: 8, marginTop: 16 }}><input aria-label="Member email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Existing account email" style={{ flex: 1, minWidth: 0, background: "#111", color: "#fff", border: "1px solid #444", borderRadius: 6, padding: 9 }} /><button disabled={busy || !email.trim()} style={{ padding: 9, background: COLOR, border: 0, borderRadius: 6 }}>Add member</button></form>}
    {members.map((m) => <div key={m.id} style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", background: "#111", border: "1px solid #333", borderRadius: 10, padding: 14, marginTop: 10 }}><span>User {m.user_id}</span><select aria-label={`Role for user ${m.user_id}`} disabled={busy || m.role === "owner"} value={m.role} onChange={(e) => setRole(m.id, e.target.value)} style={{ background: "#222", color: "#fff", padding: 8 }}>{["admin", "manager", "member"].map((r) => <option key={r}>{r}</option>)}</select></div>)}
    {!members.length && !error && <p>No members to manage.</p>}
  </div><div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: 40, background: "#000", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 16px", boxSizing: "border-box" }}><button onClick={() => setMenuOpen(true)} style={{ color: COLOR, background: "transparent", border: 0, textDecoration: "underline" }}>Return to Menu</button></div></main>;
}
