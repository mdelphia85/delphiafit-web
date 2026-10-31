import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";

const COLOR = "#06b6d4";

export default function GlobalCompetition() {
  const { setMenuOpen } = useContext(MenuContext);
  const [competitions, setCompetitions] = useState([]);
  const [tournaments, setTournaments] = useState({});
  const [seasons, setSeasons] = useState([]);
  const [ladders, setLadders] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCompetitions() {
    const rows = await apiRequest("/competition/list");
    const list = Array.isArray(rows) ? rows : [];
    setCompetitions(list);
    const [seasonRows, tournamentEntries, ladderEntries] = await Promise.all([
      apiRequest("/season/list").catch(() => []),
      Promise.all(list.map(async (competition) => {
        try { const results = await apiRequest(`/tournament/competition/${competition.id}`); return [competition.id, Array.isArray(results) ? results : []]; }
        catch { return [competition.id, []]; }
      })),
      Promise.all(list.map(async (competition) => {
        try { const results = await apiRequest(`/ladder/competition/${competition.id}`); return [competition.id, Array.isArray(results) ? results : []]; }
        catch { return [competition.id, []]; }
      }))
    ]);
    setSeasons(Array.isArray(seasonRows) ? seasonRows : []);
    setTournaments(Object.fromEntries(tournamentEntries));
    setLadders(Object.fromEntries(ladderEntries));
  }

  useEffect(() => {
    let active = true;
    apiRequest("/competition/list")
      .then(async (rows) => {
        if (!active) return;
        const list = Array.isArray(rows) ? rows : [];
        setCompetitions(list);
        const [seasonRows, tournamentItems, ladderItems] = await Promise.all([
          apiRequest("/season/list").catch(() => []),
          Promise.all(list.map(async (competition) => {
            try { const result = await apiRequest(`/tournament/competition/${competition.id}`); return [competition.id, Array.isArray(result) ? result : []]; }
            catch { return [competition.id, []]; }
          })),
          Promise.all(list.map(async (competition) => {
            try { const result = await apiRequest(`/ladder/competition/${competition.id}`); return [competition.id, Array.isArray(result) ? result : []]; }
            catch { return [competition.id, []]; }
          }))
        ]);
        if (active) { setSeasons(Array.isArray(seasonRows) ? seasonRows : []); setTournaments(Object.fromEntries(tournamentItems)); setLadders(Object.fromEntries(ladderItems)); }
      })
      .catch((requestError) => { if (active) setError(requestError.message || "Unable to load tournaments."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function toggleRegistration(competition) {
    try {
      await apiRequest(`/competition/${competition.id}/register`, { method: competition.registered ? "DELETE" : "POST" });
      setError("");
      await loadCompetitions();
    } catch (requestError) { setError(requestError.message || "Unable to update registration."); }
  }

  return (
    <main style={pageStyle}>
      <section style={{ width: 600, maxWidth: "100%" }}>
        <h1 style={{ color: COLOR, textAlign: "center" }}>Competitions & Tournaments</h1>
        <p style={{ color: "#aaa", textAlign: "center" }}>Authenticated events and registration from DelphiaFit.</p>
        {error && <p role="alert" style={{ color: "#ff8b8b" }}>{error}</p>}
        {loading ? <p>Loading competitions...</p> : competitions.length === 0 ? <p>No competitions are available yet.</p> : competitions.map((competition) => <article key={competition.id} style={cardStyle}>
          <header style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}><strong>{competition.name}</strong><span style={{ color: COLOR }}>{competition.level || "Open"}</span></header>
          <p style={{ color: "#aaa" }}>{[competition.sport, competition.is_virtual ? "Virtual" : "In person"].filter(Boolean).join(" | ")}</p>
          {competition.description && <p>{competition.description}</p>}
          {competition.season_id && <p style={{ color: "#aaa" }}>Season: {seasons.find((season) => season.id === competition.season_id)?.name || `Season ${competition.season_id}`}</p>}
          <p style={{ color: "#888" }}>{competition.registered_count || 0} registered</p>
          <button type="button" onClick={() => toggleRegistration(competition)} style={buttonStyle}>{competition.registered ? "Withdraw" : "Register"}</button>
          {(ladders[competition.id] || []).map((ladder) => <p key={`ladder-${ladder.id}`} style={{ color: "#aaa" }}>Ladder: {ladder.name} | {ladder.ranking_method || "points"}</p>)}
          {(tournaments[competition.id] || []).map((tournament) => <div key={tournament.id} style={{ borderTop: "1px solid #333", marginTop: "12px", paddingTop: "10px" }}>
            <strong>{tournament.name}</strong>{tournament.format && <span style={{ color: "#aaa" }}> | {tournament.format}</span>}
            {tournament.start_date && <small style={{ display: "block", color: "#888" }}>{new Date(tournament.start_date).toLocaleDateString()}</small>}
          </div>)}
        </article>)}
      </section>
      <button type="button" onClick={() => setMenuOpen(true)} style={menuStyle}>Return to Menu</button>
    </main>
  );
}

const pageStyle = { width: "100vw", minHeight: "100vh", background: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", color: "#fff" };
const cardStyle = { background: "#111", border: "1px solid #333", borderRadius: "12px", padding: "14px", marginTop: "12px" };
const buttonStyle = { padding: "10px 14px", background: COLOR, color: "#000", border: 0, borderRadius: "8px", cursor: "pointer", fontWeight: 700 };
const menuStyle = { position: "fixed", bottom: "20px", right: "20px", color: COLOR, fontSize: "18px", textDecoration: "underline", background: "#000", border: 0, cursor: "pointer" };
