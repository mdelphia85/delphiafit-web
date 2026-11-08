import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.js";
import { apiRequest } from "../utils/api.js";

const COLOR = "#c2185b";

export default function CompetitionEvents() {
  const { setMenuOpen } = useContext(MenuContext);
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [level, setLevel] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/competition/list")
      .then((rows) => { if (active) setEvents(Array.isArray(rows) ? rows : []); })
      .catch((requestError) => { if (active) setError(requestError.message || "Unable to load competitions."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function createEvent(event) {
    event.preventDefault();
    if (!name.trim()) return;
    try {
      await apiRequest("/competition/create", { method: "POST", body: { name: name.trim(), description: description.trim() || null, sport: sport.trim() || null, level: level.trim() || null } });
      setName(""); setSport(""); setLevel(""); setDescription(""); setShowForm(false); setError("");
      const rows = await apiRequest("/competition/list");
      setEvents(Array.isArray(rows) ? rows : []);
    } catch (requestError) { setError(requestError.message || "Unable to create competition. Active creators and administrators may create events."); }
  }

  return (
    <main style={pageStyle}>
      <section style={{ width: 560, maxWidth: "100%" }}>
        <h1 style={{ color: COLOR, textAlign: "center" }}>Competition Events</h1>
        <p style={{ color: "#aaa", textAlign: "center" }}>Events listed here come from active competitions.</p>
        {error && <p role="alert" style={{ color: "#ff8b8b" }}>{error}</p>}
        <button type="button" onClick={() => setShowForm((open) => !open)} style={buttonStyle}>{showForm ? "Cancel" : "+ Create Event"}</button>
        {showForm && <form onSubmit={createEvent} style={formStyle}>
          <label>Name<input required maxLength={160} value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} /></label>
          <label>Sport<input maxLength={80} value={sport} onChange={(e) => setSport(e.target.value)} style={inputStyle} /></label>
          <label>Level<input maxLength={80} value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Local, regional, open..." style={inputStyle} /></label>
          <label>Description<textarea maxLength={2000} value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} /></label>
          <button type="submit" style={buttonStyle}>Save Event</button>
        </form>}
        {loading ? <p>Loading competitions...</p> : events.length === 0 ? <p>No events are scheduled yet.</p> : events.map((item) => <article key={item.id} style={cardStyle}>
          <strong>{item.name}</strong><p style={{ color: "#aaa" }}>{[item.sport, item.level].filter(Boolean).join(" | ") || "Competition"}</p>
          {item.description && <p>{item.description}</p>}
          {item.season_id && <small>Season {item.season_id}</small>}
        </article>)}
      </section>
      <button type="button" onClick={() => setMenuOpen(true)} style={menuStyle}>Return to Menu</button>
    </main>
  );
}

const pageStyle = { width: "100vw", minHeight: "100vh", background: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", color: "#fff" };
const cardStyle = { background: "#111", border: "1px solid #333", borderRadius: "12px", padding: "14px", marginTop: "10px" };
const formStyle = { display: "grid", gap: "12px", background: "#111", padding: "14px", borderRadius: "12px", marginTop: "12px" };
const inputStyle = { display: "block", width: "100%", boxSizing: "border-box", padding: "9px", marginTop: "5px", background: "#000", color: "white", border: "1px solid #333", borderRadius: "7px" };
const buttonStyle = { width: "100%", marginTop: "10px", padding: "12px", background: COLOR, color: "white", border: 0, borderRadius: "8px", cursor: "pointer", fontWeight: 700 };
const menuStyle = { position: "fixed", bottom: "20px", right: "20px", color: COLOR, fontSize: "18px", textDecoration: "underline", background: "#000", border: 0, cursor: "pointer" };
