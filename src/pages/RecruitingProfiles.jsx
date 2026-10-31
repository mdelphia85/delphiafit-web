import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";

const COLOR = "#f97316";
const emptyProfile = { sport: "", position: "", bio: "", public: false };

export default function RecruitingProfiles() {
  const { setMenuOpen } = useContext(MenuContext);
  const [profile, setProfile] = useState(emptyProfile);
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([apiRequest("/recruiting/profile"), apiRequest("/recruiting/profiles")])
      .then(([own, browse]) => { if (active) { if (own) setProfile(own); setAthletes(Array.isArray(browse) ? browse : []); } })
      .catch((e) => { if (active) setError(e.message || "Unable to load recruiting profiles."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function save(event) {
    event.preventDefault();
    try { const result = await apiRequest("/recruiting/profile", { method: "PUT", body: profile }); setProfile(result); setSaved(true); setError(""); const rows = await apiRequest("/recruiting/profiles"); setAthletes(Array.isArray(rows) ? rows : []); }
    catch (e) { setError(e.message || "Unable to save profile."); setSaved(false); }
  }
  function update(field, value) { setProfile((current) => ({ ...current, [field]: value })); setSaved(false); }

  return <main style={pageStyle}><section style={{ width: 620, maxWidth: "100%" }}>
    <h1 style={{ color: COLOR, textAlign: "center" }}>Recruiting Profiles</h1>
    <form onSubmit={save} style={formStyle}><h2>Your athlete profile</h2><label>Sport<input required maxLength={80} value={profile.sport} onChange={(e) => update("sport", e.target.value)} style={inputStyle} /></label><label>Position<input maxLength={80} value={profile.position || ""} onChange={(e) => update("position", e.target.value)} style={inputStyle} /></label><label>Bio<textarea maxLength={2000} rows={3} value={profile.bio || ""} onChange={(e) => update("bio", e.target.value)} style={inputStyle} /></label><label style={{ display: "flex", gap: "8px", alignItems: "center" }}><input type="checkbox" checked={!!profile.public} onChange={(e) => update("public", e.target.checked)} /> Publish this profile for authenticated members</label><button style={buttonStyle}>Save Profile</button>{saved && <p role="status">Profile saved.</p>}</form>
    {error && <p role="alert" style={{ color: "#ff8b8b" }}>{error}</p>}
    <h2>Published athletes</h2>{loading ? <p>Loading profiles...</p> : athletes.length === 0 ? <p>No athletes have published a recruiting profile yet.</p> : athletes.map((athlete) => <article key={athlete.user_id} style={cardStyle}><strong>{athlete.name}</strong><p style={{ color: "#aaa" }}>{[athlete.sport, athlete.position].filter(Boolean).join(" | ")}</p>{athlete.bio && <p>{athlete.bio}</p>}</article>)}
  </section><button type="button" onClick={() => setMenuOpen(true)} style={menuStyle}>Return to Menu</button></main>;
}
const pageStyle = { width: "100vw", minHeight: "100vh", background: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", color: "#fff" };
const formStyle = { display: "grid", gap: "10px", background: "#111", borderRadius: "12px", padding: "14px" };
const cardStyle = { background: "#111", border: "1px solid #333", borderRadius: "12px", padding: "14px", marginTop: "10px" };
const inputStyle = { display: "block", width: "100%", boxSizing: "border-box", padding: "9px", marginTop: "5px", background: "#000", color: "white", border: "1px solid #333", borderRadius: "7px" };
const buttonStyle = { padding: "10px", background: COLOR, color: "#000", border: 0, borderRadius: "8px", cursor: "pointer", fontWeight: 700 };
const menuStyle = { position: "fixed", bottom: "20px", right: "20px", color: COLOR, fontSize: "18px", textDecoration: "underline", background: "#000", border: 0, cursor: "pointer" };
