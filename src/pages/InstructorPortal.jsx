import { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { useTacticalProgress } from "../hooks/useTacticalProgress.js";

const initialDrills = [];
const color = "#2d5f3a";

export default function InstructorPortal() {
  const { setMenuOpen } = useContext(MenuContext);
  const [drills, setDrills, progress] = useTacticalProgress("instructor-portal", "instructor-drills", initialDrills);
  const [building, setBuilding] = useState(false);
  const [name, setName] = useState("");
  const [trainees, setTrainees] = useState("");
  const [duration, setDuration] = useState("");

  function createDrill(event) {
    event.preventDefault();
    const drill = { id: Date.now(), name: name.trim(), trainees: Number(trainees), duration: `${duration} hours`, status: "Active", created: new Date().toISOString().slice(0, 10) };
    setDrills((current) => [drill, ...current]);
    setName("");
    setTrainees("");
    setDuration("");
    setBuilding(false);
  }

  function updateStatus(drill) {
    setDrills((current) => current.map((item) => item.id === drill.id ? { ...item, status: item.status === "Active" ? "Paused" : "Active" } : item));
  }

  function deleteDrill(id) {
    setDrills((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      {(progress.loading || progress.error) && <div role="status" aria-live="polite" style={{ position: "fixed", top: 8, left: 8, zIndex: 50, background: "#111", border: "1px solid #555", borderRadius: 6, padding: 8 }}>{progress.loading ? "Syncing saved progress..." : `Progress unavailable: ${progress.error}`}</div>}
      <main style={{ width: 360, maxWidth: "100%" }}>
        <header style={{ textAlign: "center", marginBottom: 20 }}><h1 style={{ color, fontSize: 28 }}>Instructor Portal</h1><p style={{ color: "#999", fontSize: 12 }}>Manage your training drills</p></header>
        <button type="button" onClick={() => setBuilding((value) => !value)} style={buttonStyle}>{building ? "Cancel" : "+ Create Drill"}</button>
        {building && <form onSubmit={createDrill} style={{ display: "grid", gap: 12, padding: 14, margin: "16px 0", background: "#111", border: `1px solid ${color}`, borderRadius: 10 }}>
          <label>Drill name<input required value={name} onChange={(event) => setName(event.target.value)} style={fieldStyle} /></label>
          <label>Number of trainees<input required type="number" min="1" value={trainees} onChange={(event) => setTrainees(event.target.value)} style={fieldStyle} /></label>
          <label>Duration (hours)<input required type="number" min="0.25" step="0.25" value={duration} onChange={(event) => setDuration(event.target.value)} style={fieldStyle} /></label>
          <button type="submit" style={buttonStyle}>Save drill</button>
        </form>}
        <section aria-busy={progress.loading}>
          <h2 style={{ color }}>Saved drills</h2>
          {!progress.loading && drills.length === 0 && <p role="status">No instructor drills yet.</p>}
          {drills.map((drill) => <article key={drill.id} style={{ background: "#111", border: `1px solid ${drill.status === "Active" ? color : "#444"}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><strong>{drill.name}</strong><span>{drill.status}</span></div>
            <p>{drill.trainees} trainees ? {drill.duration} ? Created {drill.created}</p>
            <button type="button" onClick={() => updateStatus(drill)}>{drill.status === "Active" ? "Pause" : "Activate"}</button>
            <button type="button" onClick={() => deleteDrill(drill.id)} aria-label={`Delete ${drill.name}`}>Delete</button>
          </article>)}
        </section>
      </main>
      <button type="button" onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: 20, right: 20, color, background: "#111", border: `1px solid ${color}`, padding: 10 }}>Return to Menu</button>
    </div>
  );
}

const fieldStyle = { display: "block", width: "100%", boxSizing: "border-box", padding: 8, marginTop: 4, color: "#fff", background: "#000", border: "1px solid #444", borderRadius: 6 };
const buttonStyle = { width: "100%", padding: 10, marginBottom: 8, color: "#fff", background: "#111", border: `1px solid ${color}`, borderRadius: 6, cursor: "pointer" };
