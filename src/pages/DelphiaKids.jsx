import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";

const COLOR = "#ec4899";
const ACTIVITIES = ["movement", "balance", "stretching", "hydration"];

export default function DelphiaKids() {
  const { setMenuOpen } = useContext(MenuContext);
  const [children, setChildren] = useState([]);
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { let active = true; apiRequest("/kids/children").then((rows) => { if (active) setChildren(Array.isArray(rows) ? rows : []); }).catch((e) => { if (active) setError(e.message || "Unable to load child profiles."); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);

  async function createChild(event) {
    event.preventDefault();
    try { const child = await apiRequest("/kids/children", { method: "POST", body: { nickname: nickname.trim(), parent_controls_enabled: true } }); setChildren((rows) => [...rows, child]); setNickname(""); setError(""); }
    catch (e) { setError(e.message || "Unable to create child profile."); }
  }
  async function toggleActivity(child, activity) {
    const existing = (child.progress || []).find((row) => row.activity_key === activity);
    const completed = !existing?.completed;
    try {
      await apiRequest(`/kids/children/${child.id}/progress`, { method: "PUT", body: { activity_key: activity, completed } });
      setChildren((rows) => rows.map((row) => row.id === child.id ? { ...row, progress: [...(row.progress || []).filter((item) => item.activity_key !== activity), { activity_key: activity, completed }] } : row));
      setError("");
    } catch (e) { setError(e.message || "Unable to save progress."); }
  }
  async function toggleControls(child) {
    const updated = { nickname: child.nickname, parent_controls_enabled: !child.parent_controls_enabled };
    try { await apiRequest(`/kids/children/${child.id}`, { method: "PATCH", body: updated }); setChildren((rows) => rows.map((row) => row.id === child.id ? { ...row, ...updated } : row)); setError(""); }
    catch (e) { setError(e.message || "Unable to update parent controls."); }
  }

  return <main style={pageStyle}><section style={{ width: 640, maxWidth: "100%" }}>
    <h1 style={{ color: COLOR, textAlign: "center" }}>DelphiaFit Kids</h1>
    <p style={{ color: "#aaa" }}>Child profiles use a nickname only. No birth date, contact details, or public child profile is collected.</p>
    <form onSubmit={createChild} style={formStyle}><label>Child nickname<input required maxLength={40} value={nickname} onChange={(e) => setNickname(e.target.value)} style={inputStyle} /></label><button style={buttonStyle}>Add child profile</button></form>
    {error && <p role="alert" style={{ color: "#ff8b8b" }}>{error}</p>}{loading ? <p>Loading saved progress...</p> : children.length === 0 ? <p>No child profiles yet. Add a nickname to begin.</p> : children.map((child) => <article key={child.id} style={cardStyle}><header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><strong>{child.nickname}</strong><button type="button" onClick={() => toggleControls(child)} style={buttonStyle}>Parent controls: {child.parent_controls_enabled ? "On" : "Off"}</button></header><p style={{ color: "#aaa" }}>Activities</p>{ACTIVITIES.map((activity) => { const done = child.progress?.some((row) => row.activity_key === activity && row.completed); return <button type="button" key={activity} onClick={() => toggleActivity(child, activity)} style={{ ...activityStyle, borderColor: done ? COLOR : "#333", color: done ? COLOR : "white" }}>{activity} | {done ? "Complete" : "Mark complete"}</button>; })}</article>)}
  </section><button type="button" onClick={() => setMenuOpen(true)} style={menuStyle}>Return to Menu</button></main>;
}
const pageStyle = { width: "100vw", minHeight: "100vh", background: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", color: "#fff" };
const formStyle = { display: "flex", gap: "10px", alignItems: "end", flexWrap: "wrap", background: "#111", borderRadius: "12px", padding: "14px", marginBottom: "16px" };
const cardStyle = { background: "#111", border: "1px solid #333", borderRadius: "12px", padding: "14px", marginTop: "10px" };
const inputStyle = { display: "block", minWidth: "180px", padding: "9px", marginTop: "5px", background: "#000", color: "white", border: "1px solid #333", borderRadius: "7px" };
const buttonStyle = { padding: "9px 12px", background: COLOR, color: "#000", border: 0, borderRadius: "8px", cursor: "pointer", fontWeight: 700 };
const activityStyle = { background: "#080808", border: "1px solid", borderRadius: "7px", margin: "4px", padding: "8px", cursor: "pointer", textTransform: "capitalize" };
const menuStyle = { position: "fixed", bottom: "20px", right: "20px", color: COLOR, fontSize: "18px", textDecoration: "underline", background: "#000", border: 0, cursor: "pointer" };
