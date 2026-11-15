import { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.js";
import TextAction from "../components/TextAction.jsx";
import { useTacticalProgress } from "../hooks/useTacticalProgress.js";
import { TACTICAL_COLORS } from "../config/tacticalColors.js";

const color = TACTICAL_COLORS.team;
const TYPES = ["Training Exercise", "Physical Readiness", "Field Exercise", "Team Conditioning", "Preparedness Review", "Other"];
const STATUSES = ["Planned", "In Progress", "Completed", "Canceled"];
const field = { display: "block", width: "100%", boxSizing: "border-box", marginTop: 6, padding: 10, background: "#141414", color: "#fff", border: "1px solid #555", borderRadius: 6 };
const panel = { background: "#111", padding: 16, border: `1px solid ${color}`, borderRadius: 10, marginBottom: 18 };
const action = { color, display: "inline-block", padding: "6px 0" };

/**
 * Tactical team-operation planning is separate from the social Team Roster.
 * Records here are account-private until a team-sharing backend is introduced.
 */
export default function TacticalTeamOperations() {
  const { setMenuOpen } = useContext(MenuContext);
  const [operations, setOperations, progress] = useTacticalProgress(
    "tactical-team-operations",
    "tactical-team-operations",
    []
  );
  const [team, setTeam] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState(TYPES[0]);
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("60");
  const [notes, setNotes] = useState("");
  const [notice, setNotice] = useState("");

  function createOperation(event) {
    event.preventDefault();
    if (progress.loading || progress.error) return;
    if (!team.trim() || !name.trim() || Number(duration) < 1 || Number(duration) > 1440) {
      setNotice("Enter a team or unit, an operation name, and a valid duration.");
      return;
    }
    const record = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      team: team.trim().slice(0, 120),
      name: name.trim().slice(0, 160),
      type,
      date: date || null,
      duration_minutes: Number(duration),
      notes: notes.trim().slice(0, 3000),
      status: "Planned",
      created_at: new Date().toISOString()
    };
    setOperations((current) => [record, ...(Array.isArray(current) ? current : [])]);
    setName("");
    setNotes("");
    setNotice("");
  }

  function setStatus(id, status) {
    if (progress.loading || progress.error) return;
    setOperations((current) => current.map((record) => (
      record.id === id ? { ...record, status } : record
    )));
  }

  function deleteRecord(id) {
    if (progress.loading || progress.error) return;
    setOperations((current) => current.filter((record) => record.id !== id));
  }

  const entries = Array.isArray(operations) ? operations : [];
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "35px 20px 90px", boxSizing: "border-box" }}>
      <main style={{ width: "min(850px, 100%)", margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ color, lineHeight: 1.15, margin: 0 }}>Team Operations</h1>
          <p style={{ color: "#aaa", marginTop: 14 }}>Plan and record team training operations.</p>
          <p style={{ color: "#aaa", fontSize: 13 }}>These records are private to your account; they are not automatically shared with a team.</p>
        </header>

        {progress.loading && <p role="status">Loading saved operations…</p>}
        {progress.error && <p role="alert" style={{ color: "#fecaca" }}>Unable to sync operations: {progress.error}</p>}
        {notice && <p role="alert" style={{ color: "#fecaca" }}>{notice}</p>}

        <form onSubmit={createOperation} style={{ ...panel, display: "grid", gap: 12 }}>
          <h2 style={{ color, textAlign: "center", margin: 0 }}>Create operation</h2>
          <label>Team / unit name<input required maxLength={120} value={team} onChange={(event) => setTeam(event.target.value)} style={field} /></label>
          <label>Operation name<input required maxLength={160} value={name} onChange={(event) => setName(event.target.value)} style={field} /></label>
          <label>Operation type
            <select value={type} onChange={(event) => setType(event.target.value)} style={field}>
              {TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <label style={{ flex: "1 1 170px" }}>Scheduled date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} style={field} /></label>
            <label style={{ flex: "1 1 170px" }}>Duration (minutes)<input type="number" required min="1" max="1440" value={duration} onChange={(event) => setDuration(event.target.value)} style={field} /></label>
          </div>
          <label>Training notes<textarea rows={3} maxLength={3000} value={notes} onChange={(event) => setNotes(event.target.value)} style={field} /></label>
          <div style={{ textAlign: "center" }}>
            <TextAction submit disabled={progress.loading || !!progress.error} style={action}>Save operation</TextAction>
          </div>
        </form>

        <section aria-busy={progress.loading}>
          <h2 style={{ color, textAlign: "center" }}>Recorded operations</h2>
          {entries.length === 0
            ? <p style={{ textAlign: "center", color: "#bbb" }}>No team operations recorded yet.</p>
            : entries.map((entry) => (
                <article key={entry.id} style={panel}>
                  <h3 style={{ color, marginTop: 0 }}>{entry.name}</h3>
                  <p><strong>{entry.team}</strong> · {entry.type}</p>
                  <p>{entry.date || "Date not scheduled"} · {entry.duration_minutes} minutes</p>
                  {entry.notes && <p>{entry.notes}</p>}
                  <label>Status
                    <select value={entry.status || "Planned"} disabled={progress.loading || !!progress.error} onChange={(event) => setStatus(entry.id, event.target.value)} style={field}>
                      {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </label>
                  <div style={{ marginTop: 12, textAlign: "right" }}>
                    <TextAction disabled={progress.loading || !!progress.error} style={action} onClick={() => deleteRecord(entry.id)}>Delete record</TextAction>
                  </div>
                </article>
              ))}
        </section>
      </main>
      <TextAction onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: 20, right: 20, zIndex: 20, color, fontSize: 18 }}>Return to Menu</TextAction>
    </div>
  );
}
