import { useCallback, useEffect, useState } from "react";
import CoachShell from "../components/CoachShell.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { COACH_COLOR, cardStyle, dangerButton, inputStyle, labelStyle, primaryButton, secondaryButton } from "../components/coachStyles.js";
import { errorText, useCoachRequest } from "../utils/coachSession.js";

const EMPTY = { name: "", description: "", plan_type: "workout", duration_weeks: 4, difficulty: "", itemsText: "" };
const small = { ...secondaryButton, padding: "8px 10px", fontSize: "12px" };

export default function PlanBuilder() {
  const request = useCoachRequest();
  const [plans, setPlans] = useState([]);
  const [clients, setClients] = useState([]);
  const [teams, setTeams] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(null); // null = list view; otherwise { id?, ...fields }
  const [assigning, setAssigning] = useState(null); // plan being assigned
  const [target, setTarget] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [planData, clientData, teamData] = await Promise.all([request("/staff/plans"), request("/staff/clients"), request("/staff/teams")]);
      setPlans(planData.plans || []);
      setClients(clientData.clients || []);
      setTeams(teamData.teams || []);
      setStatus("ready");
    } catch (e) {
      setError(errorText(e, "Unable to load plans."));
      setStatus("error");
    }
  }, [request]);

  useEffect(() => {
    const timer = setTimeout(() => load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

  function edit(plan) {
    setNotice("");
    setError("");
    setForm(
      plan
        ? { id: plan.id, name: plan.name, description: plan.description || "", plan_type: plan.plan_type || "workout", duration_weeks: plan.duration_weeks || 4, difficulty: plan.difficulty || "", itemsText: (plan.items || []).join("\n") }
        : { ...EMPTY }
    );
  }

  async function save() {
    if (form.name.trim().length < 2) {
      setError("Give the plan a name.");
      return;
    }
    setBusy(true);
    setError("");
    const body = {
      name: form.name.trim(),
      description: form.description || null,
      plan_type: form.plan_type,
      duration_weeks: Number(form.duration_weeks) || 4,
      difficulty: form.difficulty || null,
      items: form.itemsText.split("\n").map((line) => line.trim()).filter(Boolean)
    };
    try {
      if (form.id) await request(`/staff/plans/${form.id}`, { method: "PUT", body });
      else await request("/staff/plans", { method: "POST", body });
      setNotice(form.id ? "Plan updated." : "Plan created.");
      setForm(null);
      await load();
    } catch (e) {
      setError(errorText(e, "Could not save the plan."));
    } finally {
      setBusy(false);
    }
  }

  async function remove(plan) {
    if (!window.confirm(`Delete "${plan.name}"? Clients will no longer see it.`)) return;
    try {
      await request(`/staff/plans/${plan.id}`, { method: "DELETE" });
      setNotice("Plan deleted.");
      await load();
    } catch (e) {
      setError(errorText(e, "Could not delete the plan."));
    }
  }

  async function assign() {
    if (!target) {
      setError("Choose who to assign this plan to.");
      return;
    }
    const [kind, id] = target.split(":");
    setBusy(true);
    setError("");
    try {
      const body = kind === "team" ? { team_id: Number(id) } : { client_id: Number(id) };
      const result = await request(`/staff/plans/${assigning.id}/assignments`, { method: "POST", body });
      setNotice(`Assigned to ${result.assigned_client_ids.length} client(s).`);
      setAssigning(null);
      setTarget("");
      await load();
    } catch (e) {
      setError(errorText(e, "Could not assign the plan."));
    } finally {
      setBusy(false);
    }
  }

  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  if (form) {
    return (
      <CoachShell title="📋 Plan Builder">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label style={labelStyle} htmlFor="plan-name">Plan name</label>
          <input id="plan-name" style={inputStyle} value={form.name} onChange={set("name")} />
          <label style={labelStyle} htmlFor="plan-desc">Description</label>
          <textarea id="plan-desc" style={{ ...inputStyle, minHeight: "60px" }} value={form.description} onChange={set("description")} />
          <label style={labelStyle} htmlFor="plan-type">Type</label>
          <select id="plan-type" style={inputStyle} value={form.plan_type} onChange={set("plan_type")}>
            <option value="workout">Workout</option>
            <option value="nutrition">Nutrition</option>
            <option value="recovery">Recovery</option>
          </select>
          <label style={labelStyle} htmlFor="plan-weeks">Duration (weeks)</label>
          <input id="plan-weeks" type="number" min="1" max="104" style={inputStyle} value={form.duration_weeks} onChange={set("duration_weeks")} />
          <label style={labelStyle} htmlFor="plan-diff">Difficulty</label>
          <select id="plan-diff" style={inputStyle} value={form.difficulty} onChange={set("difficulty")}>
            <option value="">Not set</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <label style={labelStyle} htmlFor="plan-items">Plan items (one per line)</label>
          <textarea id="plan-items" style={{ ...inputStyle, minHeight: "120px" }} value={form.itemsText} onChange={set("itemsText")} placeholder={"Day 1 - Squats 4x8\nDay 2 - Rest"} />
          {error && <StatusMessage error>{error}</StatusMessage>}
          <button style={primaryButton(busy)} disabled={busy} onClick={save}>{form.id ? "Save Changes" : "Create Plan"}</button>
          <button style={secondaryButton} onClick={() => setForm(null)}>Cancel</button>
        </div>
      </CoachShell>
    );
  }

  return (
    <CoachShell title="📋 Plan Builder">
      <button style={{ ...primaryButton(), width: "100%", marginBottom: "14px" }} onClick={() => edit(null)}>+ New Plan</button>
      {notice && <div style={{ color: "#ccc", fontSize: "12px", marginBottom: "10px", textAlign: "center" }}>{notice}</div>}
      {status === "loading" && <StatusMessage>Loading plans...</StatusMessage>}
      {status === "error" && (
        <div>
          <StatusMessage error>{error}</StatusMessage>
          <button style={{ ...secondaryButton, width: "100%" }} onClick={() => { setStatus("loading"); load(); }}>Retry</button>
        </div>
      )}
      {status === "ready" && plans.length === 0 && <StatusMessage>No plans yet. Create your first training plan.</StatusMessage>}
      {status === "ready" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {plans.map((plan) => (
            <div key={plan.id} style={cardStyle}>
              <div style={{ color: COACH_COLOR, fontWeight: "700" }}>{plan.name}</div>
              <div style={{ color: "#999", fontSize: "12px" }}>
                {plan.plan_type} · {plan.duration_weeks} wk{plan.difficulty ? ` · ${plan.difficulty}` : ""} · {plan.assigned_clients} assigned
              </div>
              {plan.description && <div style={{ color: "#ccc", fontSize: "12px", marginTop: "6px" }}>{plan.description}</div>}
              {plan.items.length > 0 && (
                <ul style={{ color: "#ccc", fontSize: "12px", paddingLeft: "18px", margin: "6px 0" }}>
                  {plan.items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              )}
              <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                <button style={small} onClick={() => { setAssigning(plan); setTarget(""); setError(""); }}>Assign</button>
                {plan.owned && <button style={small} onClick={() => edit(plan)}>Edit</button>}
                {plan.owned && <button style={{ ...dangerButton, padding: "8px 10px", fontSize: "12px" }} onClick={() => remove(plan)}>Delete</button>}
              </div>
              {assigning && assigning.id === plan.id && (
                <div style={{ marginTop: "10px" }}>
                  <select aria-label="Assign to" style={inputStyle} value={target} onChange={(e) => setTarget(e.target.value)}>
                    <option value="">Assign to...</option>
                    {clients.map((c) => <option key={`c${c.id}`} value={`client:${c.id}`}>{c.name}</option>)}
                    {teams.map((t) => <option key={`t${t.id}`} value={`team:${t.id}`}>Whole team: {t.name}</option>)}
                  </select>
                  {error && <StatusMessage error>{error}</StatusMessage>}
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <button style={{ ...primaryButton(busy), flex: 1 }} disabled={busy} onClick={assign}>Confirm Assign</button>
                    <button style={{ ...secondaryButton, flex: 1 }} onClick={() => setAssigning(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </CoachShell>
  );
}
