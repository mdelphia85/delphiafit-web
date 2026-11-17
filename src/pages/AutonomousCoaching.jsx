import { useRef, useState } from "react";
import { apiRequest } from "../utils/api.js";
import TextAction from "../components/TextAction.jsx";
import { validCategory } from "../ai/categories.js";

const COLOR = "#a78bfa";
const field = { display: "block", width: "100%", boxSizing: "border-box", padding: 10, marginTop: 6, background: "#111", color: "#fff", border: "1px solid #444", borderRadius: 6 };
const action = { display: "inline-block", color: COLOR, padding: "6px 0" };

export default function TrainingPlanGenerator({ onPlanSaved }) {
  const [fatigue, setFatigue] = useState("3");
  const [sleep, setSleep] = useState("7");
  const [sessions, setSessions] = useState("3");
  const [goal, setGoal] = useState("strength");
  const [injuries, setInjuries] = useState("");
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);

  async function generate(event) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true); setError("");
    const userData = {
      fatigue: Number(fatigue),
      sleep_hours: Number(sleep),
      sessions_per_week: Number(sessions),
      goals: [goal],
      injuries: injuries.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 12)
    };
    try {
      const response = await apiRequest("/ai/weekly-plan", {
        method: "POST", timeoutMs: 30000, body: userData
      });
      setPlan(response.result);
      if (onPlanSaved) await onPlanSaved();
    } catch (requestError) {
      setError(requestError.status === 401 ? "Sign in to generate and save a plan."
        : requestError.status === 0 ? "Plan request timed out. Check coaching history before retrying."
        : requestError.message || "Unable to generate a training plan.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }

  return (
    <section aria-label="Generate Training Plan" style={{ padding: 16, background: "#111", borderRadius: 12 }}>
      <h2 style={{ color: COLOR, marginTop: 0 }}>Generate Training Plan</h2>
      <p style={{ fontSize: 13, color: "#bbb", lineHeight: 1.5 }}>
        Build a weekly workout plan using DelphiaFit's rule-based training planner.
        This is not a fully autonomous training service or medical advice.
      </p>
      {error && <p role="alert" style={{ color: "#f87171" }}>{error}</p>}
      <form onSubmit={generate} style={{ display: "grid", gap: 12 }}>
        <label>Training goal
          <select value={goal} onChange={(event) => setGoal(event.target.value)} style={field}>
            <option value="strength">Strength</option>
            <option value="endurance">Endurance</option>
            <option value="weight_loss">Weight loss</option>
            <option value="general_fitness">General fitness</option>
          </select>
        </label>
        <label>Sessions per week
          <select value={sessions} onChange={(event) => setSessions(event.target.value)} style={field}>
            {[2, 3, 4, 5, 6].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label>Fatigue (0–10)
          <input required type="number" min="0" max="10" value={fatigue} onChange={(event) => setFatigue(event.target.value)} style={field} />
        </label>
        <label>Sleep (hours)
          <input required type="number" min="0" max="24" step="0.5" value={sleep} onChange={(event) => setSleep(event.target.value)} style={field} />
        </label>
        <label>Injuries or restrictions (optional; comma-separated)
          <input maxLength={300} value={injuries} onChange={(event) => setInjuries(event.target.value)} style={field} />
        </label>
        <p style={{ color: "#aaa", fontSize: 12, margin: 0 }}>
          The planner cannot determine whether exercises are medically safe for an injury.
          Ask a qualified professional about activity restrictions.
        </p>
        <div><TextAction submit disabled={busy} style={action}>{busy ? "Generating…" : "Generate and save plan"}</TextAction></div>
      </form>
      {plan && (
        <section aria-live="polite" style={{ marginTop: 20 }}>
          <h3 style={{ color: COLOR }}>Saved weekly plan</h3>
          {plan.adaptive_inputs && Object.keys(plan.adaptive_inputs).length > 0 && (
            <p style={{ color: "#aaa", fontSize: 12 }}>
              Adapted using your history: {plan.adaptive_inputs.workouts_logged ?? 0} workouts logged
              {validCategory(plan.adaptive_inputs.preferred_category) ? `, preferred category: ${plan.adaptive_inputs.preferred_category}` : ""}.
            </p>
          )}
          <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontFamily: "inherit", fontSize: 14 }}>{JSON.stringify(plan, null, 2)}</pre>
        </section>
      )}
    </section>
  );
}
