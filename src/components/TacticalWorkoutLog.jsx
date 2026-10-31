import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api.js";

export default function TacticalWorkoutLog() {
  const [records, setRecords] = useState([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("30");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/workouts/").then((all) => {
      if (active) setRecords(all.filter((record) => record.workout_type === "tactical_fitness"));
    }).catch((requestError) => {
      if (active) setError(requestError.message || "Unable to load training history.");
    });
    return () => { active = false; };
  }, []);

  async function saveWorkout(event) {
    event.preventDefault();
    try {
      const record = await apiRequest("/workouts/save", { method: "POST", body: {
        mode: "manual", duration_minutes: Number(duration), manual_name: name.trim(),
        manual_notes: notes.trim() || null, workout_type: "tactical_fitness"
      } });
      setRecords((current) => [record, ...current]);
      setName(""); setNotes(""); setError("");
    } catch (requestError) { setError(requestError.message || "Unable to save workout."); }
  }

  return <section style={{ marginTop: 24, padding: 14, color: "#fff", background: "#111", border: "1px solid #2d5f3a", borderRadius: 10 }}>
    <h2 style={{ color: "#2d5f3a" }}>Workout session log</h2>
    <p>Save completed conditioning sessions to your workout history.</p>
    {error && <p role="alert">{error}</p>}
    <form onSubmit={saveWorkout} style={{ display: "grid", gap: 8 }}>
      <label>Workout<input required value={name} onChange={(event) => setName(event.target.value)} style={field} /></label>
      <label>Duration (minutes)<input required type="number" min="1" value={duration} onChange={(event) => setDuration(event.target.value)} style={field} /></label>
      <label>Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows="2" style={field} /></label>
      <button type="submit" style={button}>Log workout</button>
    </form>
    <h3>Recorded workouts</h3>
    {records.length === 0 ? <p>No tactical workouts recorded yet.</p> : records.map((record) => <article key={record.id} style={{ borderTop: "1px solid #444", padding: 8 }}><strong>{record.manual_name}</strong><p>{record.duration_minutes} minutes ? {new Date(record.date).toLocaleString()}</p>{record.manual_notes && <p>{record.manual_notes}</p>}</article>)}
  </section>;
}

const field = { display: "block", width: "100%", boxSizing: "border-box", padding: 8, marginTop: 4, color: "#fff", background: "#000", border: "1px solid #444", borderRadius: 6 };
const button = { padding: 10, color: "#fff", background: "#151515", border: "1px solid #2d5f3a", borderRadius: 6, cursor: "pointer" };
