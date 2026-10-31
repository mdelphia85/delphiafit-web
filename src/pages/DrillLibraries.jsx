import { useCallback, useEffect, useState } from "react";
import CoachShell from "../components/CoachShell.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { COACH_COLOR, cardStyle, dangerButton, inputStyle, primaryButton, secondaryButton } from "../components/coachStyles.js";
import { errorText, useCoachRequest } from "../utils/coachSession.js";

const EMPTY = { name: "", category: "", difficulty: "medium", equipment: "", instructions: "", video_url: "" };

export default function DrillLibraries() {
  const request = useCoachRequest();
  const [drills, setDrills] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await request("/staff/drills");
      setDrills(data.drills || []);
      setStatus("ready");
    } catch (e) {
      setError(errorText(e, "Unable to load drills."));
      setStatus("error");
    }
  }, [request]);

  useEffect(() => {
    const timer = setTimeout(() => load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

  async function save() {
    if (form.name.trim().length < 2) {
      setError("Give the drill a name.");
      return;
    }
    setBusy(true);
    setError("");
    const body = Object.fromEntries(Object.entries(form).filter(([key]) => key !== "id").map(([k, v]) => [k, v === "" ? null : v]));
    body.name = form.name.trim();
    try {
      if (form.id) await request(`/staff/drills/${form.id}`, { method: "PUT", body });
      else await request("/staff/drills", { method: "POST", body });
      setForm(null);
      await load();
    } catch (e) {
      setError(errorText(e, "Could not save the drill."));
    } finally {
      setBusy(false);
    }
  }

  async function remove(drill) {
    if (!window.confirm(`Delete "${drill.name}"?`)) return;
    try {
      await request(`/staff/drills/${drill.id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError(errorText(e, "Could not delete the drill."));
    }
  }

  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  if (form) {
    return (
      <CoachShell title="🎯 Drill Library">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input aria-label="Drill name" placeholder="Drill name" style={inputStyle} value={form.name} onChange={set("name")} />
          <input aria-label="Category" placeholder="Category (e.g. Strength)" style={inputStyle} value={form.category || ""} onChange={set("category")} />
          <select aria-label="Difficulty" style={inputStyle} value={form.difficulty} onChange={set("difficulty")}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <input aria-label="Equipment" placeholder="Equipment" style={inputStyle} value={form.equipment || ""} onChange={set("equipment")} />
          <textarea aria-label="Instructions" placeholder="Instructions" style={{ ...inputStyle, minHeight: "100px" }} value={form.instructions || ""} onChange={set("instructions")} />
          <input aria-label="Video URL" placeholder="Video URL (optional)" style={inputStyle} value={form.video_url || ""} onChange={set("video_url")} />
          {error && <StatusMessage error>{error}</StatusMessage>}
          <button style={primaryButton(busy)} disabled={busy} onClick={save}>{form.id ? "Save Changes" : "Add Drill"}</button>
          <button style={secondaryButton} onClick={() => { setForm(null); setError(""); }}>Cancel</button>
        </div>
      </CoachShell>
    );
  }

  return (
    <CoachShell title="🎯 Drill Library">
      <button style={{ ...primaryButton(), width: "100%", marginBottom: "14px" }} onClick={() => { setError(""); setForm({ ...EMPTY }); }}>+ Add Drill</button>
      {status === "loading" && <StatusMessage>Loading drills...</StatusMessage>}
      {error && status !== "loading" && <StatusMessage error>{error}</StatusMessage>}
      {status === "ready" && drills.length === 0 && <StatusMessage>Your drill library is empty. Add your first drill.</StatusMessage>}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {drills.map((drill) => (
          <div key={drill.id} style={cardStyle}>
            <div style={{ color: COACH_COLOR, fontWeight: "700" }}>{drill.name}</div>
            <div style={{ color: "#999", fontSize: "12px" }}>{[drill.category, drill.difficulty, drill.equipment].filter(Boolean).join(" · ")}</div>
            {drill.instructions && <div style={{ color: "#ccc", fontSize: "12px", marginTop: "6px", whiteSpace: "pre-wrap" }}>{drill.instructions}</div>}
            {drill.video_url && <a href={drill.video_url} target="_blank" rel="noreferrer noopener" style={{ color: COACH_COLOR, fontSize: "12px" }}>Watch video</a>}
            <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
              <button style={{ ...secondaryButton, padding: "8px 10px", fontSize: "12px" }} onClick={() => { setError(""); setForm({ ...EMPTY, ...drill }); }}>Edit</button>
              <button style={{ ...dangerButton, padding: "8px 10px", fontSize: "12px" }} onClick={() => remove(drill)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </CoachShell>
  );
}
