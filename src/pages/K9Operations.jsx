import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { useTacticalProgress } from "../hooks/useTacticalProgress.js";
import { apiRequest } from "../utils/api.js";

const initialDrills = [
  { id: "scent", name: "Scent Detection Fundamentals", duration: "45 min", difficulty: "Beginner", completed: false },
  { id: "track", name: "Tracking Through Urban Terrain", duration: "90 min", difficulty: "Advanced", completed: false },
  { id: "handler", name: "Handler Communication Protocol", duration: "40 min", difficulty: "Beginner", completed: false }
];
const color = "#2d5f3a";

export default function K9Operations() {
  const { setMenuOpen } = useContext(MenuContext);
  const [drills, setDrills, progress] = useTacticalProgress("k9-operations", "k9-drills", initialDrills);
  const [units, setUnits] = useState([]);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState("");
  const [unitName, setUnitName] = useState("");
  const [breed, setBreed] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [mission, setMission] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/k9/list").then((result) => {
      if (active) setUnits(result);
    }).catch((requestError) => {
      if (active) setError(requestError.message || "Unable to load K9 units.");
    });
    return () => { active = false; };
  }, []);

  async function createUnit(event) {
    event.preventDefault();
    try {
      const created = await apiRequest("/k9/create", { method: "POST", body: { name: unitName.trim(), breed: breed.trim() || null, specialty: specialty.trim() || null } });
      setUnits((current) => [created, ...current]);
      setSelected(String(created.id));
      setUnitName(""); setBreed(""); setSpecialty(""); setError("");
    } catch (requestError) { setError(requestError.message || "Unable to save K9 unit."); }
  }

  async function deploy(event) {
    event.preventDefault();
    try {
      await apiRequest("/k9/deploy", { method: "POST", body: { k9_id: Number(selected), mission_type: mission.trim(), location: location.trim() || null, notes: notes.trim() || null, success: true } });
      const log = await apiRequest(`/k9/history/${selected}`);
      setHistory(log); setMission(""); setLocation(""); setNotes(""); setError("");
    } catch (requestError) { setError(requestError.message || "Unable to record deployment."); }
  }

  async function viewHistory(id) {
    setSelected(String(id));
    try { setHistory(await apiRequest(`/k9/history/${id}`)); setError(""); }
    catch (requestError) { setError(requestError.message || "Unable to load deployment history."); }
  }

  return <div style={{ minHeight: "100vh", background: "#000", padding: "20px 16px 90px", color: "#fff" }}>
    {(progress.loading || progress.error) && <div role="status">{progress.loading ? "Syncing saved progress..." : `Progress unavailable: ${progress.error}`}</div>}
    {error && <p role="alert" style={{ color: "#fecaca" }}>{error}</p>}
    <main style={{ width: "min(760px, 100%)", margin: "0 auto" }}>
      <h1 style={{ color }}>K9 Operations</h1><p>Manage your K9 units and record deployments.</p>
      <form onSubmit={createUnit} style={panel}><h2>Add K9 unit</h2>
        <label>Unit name<input required value={unitName} onChange={(event) => setUnitName(event.target.value)} style={field} /></label>
        <label>Breed<input value={breed} onChange={(event) => setBreed(event.target.value)} style={field} /></label>
        <label>Specialty<input value={specialty} onChange={(event) => setSpecialty(event.target.value)} style={field} /></label>
        <button style={button}>Save K9 unit</button>
      </form>
      <section><h2 style={{ color }}>Your K9 units</h2>{units.length === 0 ? <p>No K9 units registered for your account.</p> : units.map((unit) => <article key={unit.id} style={panel}>
        <button type="button" onClick={() => viewHistory(unit.id)} style={{ ...button, width: "100%", textAlign: "left" }}><strong>{unit.name}</strong> ? {unit.breed || "Breed not specified"} ? {unit.specialty || "Specialty not specified"}</button>
      </article>)}</section>
      {units.length > 0 && <form onSubmit={deploy} style={panel}><h2>Record deployment</h2>
        <label>K9 unit<select required value={selected} onChange={(event) => setSelected(event.target.value)} style={field}><option value="">Select a unit</option>{units.map((unit) => <option key={unit.id} value={unit.id}>{unit.name}</option>)}</select></label>
        <label>Mission type<input required value={mission} onChange={(event) => setMission(event.target.value)} style={field} /></label>
        <label>Location<input value={location} onChange={(event) => setLocation(event.target.value)} style={field} /></label>
        <label>Deployment notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} style={field} /></label>
        <button style={button}>Log deployment</button>
      </form>}
      {selected && <section style={panel}><h2 style={{ color }}>Deployment history</h2>{history.length ? history.map((entry) => <article key={entry.id} style={{ borderTop: "1px solid #444", padding: 8 }}><strong>{entry.mission_type}</strong><p>{entry.location} ? {entry.timestamp}</p>{entry.notes && <p>{entry.notes}</p>}</article>) : <p>No deployments logged for this unit.</p>}</section>}
      <section style={panel}><h2>Training curriculum</h2>{drills.map((drill) => <label key={drill.id} style={{ display: "block", padding: 8 }}><input type="checkbox" checked={drill.completed} onChange={() => setDrills((current) => current.map((item) => item.id === drill.id ? { ...item, completed: !item.completed } : item))} /> {drill.name} ? {drill.duration} ? {drill.difficulty}</label>)}</section>
    </main>
    <button type="button" onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: 20, right: 20, color, background: "#111", padding: 10 }}>Return to Menu</button>
  </div>;
}

const panel = { background: "#111", border: "1px solid #444", borderRadius: 10, padding: 14, marginBottom: 14 };
const field = { display: "block", width: "100%", boxSizing: "border-box", padding: 8, marginTop: 4, color: "#fff", background: "#000", border: "1px solid #444", borderRadius: 6 };
const button = { padding: 10, color: "#fff", background: "#151515", border: `1px solid ${color}`, borderRadius: 6, cursor: "pointer" };
