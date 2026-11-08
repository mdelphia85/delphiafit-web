import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.js";
import { apiRequest } from "../utils/api.js";

const color = "#2d5f3a";

export default function MissionReplay() {
  const { setMenuOpen } = useContext(MenuContext);
  const [replays, setReplays] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [steps, setSteps] = useState([]);
  const [missionType, setMissionType] = useState("training");
  const [missionId, setMissionId] = useState("1");
  const [action, setAction] = useState("");
  const [description, setDescription] = useState("");
  const [score, setScore] = useState("100");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/mission_replay/list").then((records) => {
      if (active) setReplays(records);
    }).catch((requestError) => {
      if (active) setError(requestError.message || "Unable to load your mission replays.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  async function startReplay(event) {
    event.preventDefault();
    try {
      const replay = await apiRequest("/mission_replay/start", {
        method: "POST",
        body: { mission_type: missionType.trim(), mission_id: Number(missionId) }
      });
      setReplays((current) => [replay, ...current]);
      setSelectedId(replay.id);
      setSteps([]);
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Unable to start a replay.");
    }
  }

  async function selectReplay(replay) {
    setSelectedId(replay.id);
    try {
      const [detail, recordedSteps] = await Promise.all([
        apiRequest(`/mission_replay/${replay.id}`),
        apiRequest(`/mission_replay/step/${replay.id}`)
      ]);
      setReplays((current) => current.map((item) => item.id === detail.id ? detail : item));
      setSteps(recordedSteps);
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Unable to load this replay.");
    }
  }

  async function addStep(event) {
    event.preventDefault();
    if (!selectedId) return;
    try {
      const step = await apiRequest("/mission_replay/step", {
        method: "POST",
        body: { replay_id: selectedId, action_type: action.trim(), description: description.trim() || null }
      });
      setSteps((current) => [...current, step]);
      setAction("");
      setDescription("");
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Unable to record this replay step.");
    }
  }

  async function completeReplay(event) {
    event.preventDefault();
    if (!selectedId) return;
    try {
      const replay = await apiRequest(`/mission_replay/${selectedId}/complete`, {
        method: "POST", body: { score: Number(score) }
      });
      setReplays((current) => current.map((item) => item.id === replay.id ? replay : item));
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Unable to complete this replay.");
    }
  }

  const selected = replays.find((replay) => replay.id === selectedId);

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      <main style={{ width: 440, maxWidth: "100%" }}>
        <header style={{ textAlign: "center", marginBottom: 20 }}><h1 style={{ color }}>Mission Replay</h1><p style={{ color: "#999" }}>Record and review your mission sessions</p></header>
        {error && <p role="alert" style={{ color: "#fecaca", background: "#441b1b", padding: 10 }}>{error}</p>}
        <form onSubmit={startReplay} style={panelStyle}>
          <h2 style={{ color }}>Start a replay</h2>
          <label>Mission type<input required value={missionType} onChange={(event) => setMissionType(event.target.value)} style={fieldStyle} /></label>
          <label>Mission ID<input required type="number" min="1" value={missionId} onChange={(event) => setMissionId(event.target.value)} style={fieldStyle} /></label>
          <button type="submit" style={buttonStyle}>Start session</button>
        </form>
        <section aria-busy={loading}>
          <h2 style={{ color }}>Your replays</h2>
          {loading ? <p role="status">Loading replays?</p> : replays.length === 0 ? <p role="status">No mission replays recorded yet.</p> : replays.map((replay) => (
            <button type="button" key={replay.id} onClick={() => selectReplay(replay)} style={{ ...panelStyle, display: "block", width: "100%", textAlign: "left", cursor: "pointer" }}>
              <strong>Replay #{replay.id}: {replay.mission_type} / {replay.mission_id}</strong>
              <div>{replay.completed ? `Completed ? Score ${replay.score}` : "In progress"}</div>
              <small>{replay.started_at}</small>
            </button>
          ))}
        </section>
        {selected && <section style={{ ...panelStyle, marginTop: 16 }}>
          <h2 style={{ color }}>Replay #{selected.id} steps</h2>
          {steps.length === 0 ? <p>No steps recorded yet.</p> : steps.map((step) => <article key={step.id} style={{ borderTop: "1px solid #444", padding: "8px 0" }}><strong>{step.action_type}</strong>{step.description && <p>{step.description}</p>}</article>)}
          {!selected.completed && <>
            <form onSubmit={addStep} style={{ display: "grid", gap: 8 }}>
              <label>Action<input required value={action} onChange={(event) => setAction(event.target.value)} style={fieldStyle} /></label>
              <label>Notes<input value={description} onChange={(event) => setDescription(event.target.value)} style={fieldStyle} /></label>
              <button type="submit" style={buttonStyle}>Record step</button>
            </form>
            <form onSubmit={completeReplay} style={{ display: "flex", alignItems: "end", gap: 8, marginTop: 12 }}>
              <label>Final score (0-100)<input type="number" min="0" max="100" value={score} onChange={(event) => setScore(event.target.value)} style={fieldStyle} /></label>
              <button type="submit" style={buttonStyle}>Complete replay</button>
            </form>
          </>}
        </section>}
      </main>
      <button type="button" onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: 20, right: 20, color, background: "#111", border: `1px solid ${color}`, padding: 10 }}>Return to Menu</button>
    </div>
  );
}

const panelStyle = { background: "#111", border: "1px solid #444", borderRadius: 10, padding: 12, marginBottom: 10, color: "#fff" };
const fieldStyle = { display: "block", width: "100%", boxSizing: "border-box", padding: 8, marginTop: 4, color: "#fff", background: "#000", border: "1px solid #444", borderRadius: 6 };
const buttonStyle = { padding: 10, color: "#fff", background: "#111", border: `1px solid ${color}`, borderRadius: 6, cursor: "pointer" };
