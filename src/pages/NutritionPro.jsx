import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";

const NUTRITION_COLOR = "#10b981";
const defaults = { goal_type: "maintain", target_weight: "", weekly_rate: 0, goal_unit: "lbs", diet: "none", avoid: [], meals_per_day: 5 };
const inputStyle = { background: "#111", color: "#fff", border: "1px solid #444", borderRadius: 6, padding: 9, width: "100%", boxSizing: "border-box" };

export default function NutritionPro() {
  const { setMenuOpen } = useContext(MenuContext);
  const [settings, setSettings] = useState(defaults);
  const [targets, setTargets] = useState(null);
  const [plans, setPlans] = useState([]);
  const [plan, setPlan] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setBusy(true); setError("");
    try {
      const [saved, goal, history] = await Promise.all([
        apiRequest("/nutrition-coach/settings"), apiRequest("/nutrition-coach/targets"), apiRequest("/nutrition-coach/meal-plans")
      ]);
      setSettings({ ...defaults, ...saved, target_weight: saved.target_weight ?? "" });
      setTargets(goal); setPlans(history); setPlan(history[0]?.plan || null);
    } catch (e) { setError(e.status === 401 ? "Please log in to manage your nutrition plan." : e.message); }
    finally { setBusy(false); }
  }
  useEffect(() => { const timer = setTimeout(() => { load(); }, 0); return () => clearTimeout(timer); }, []);

  async function saveSettings(event) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const payload = { ...settings, target_weight: settings.target_weight === "" ? null : Number(settings.target_weight), weekly_rate: Number(settings.weekly_rate), meals_per_day: Number(settings.meals_per_day) };
      const saved = await apiRequest("/nutrition-coach/settings", { method: "PUT", body: payload });
      setSettings({ ...defaults, ...saved, target_weight: saved.target_weight ?? "" });
      setTargets(await apiRequest("/nutrition-coach/targets")); setNotice("Nutrition preferences saved.");
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  async function generatePlan() {
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await apiRequest("/nutrition-coach/meal-plans/generate", { method: "POST", body: {} });
      setPlan(result.plan); setPlans((old) => [result, ...old]); setNotice("Meal plan generated and saved to your account.");
    } catch (e) {
      const detail = e.detail;
      setError(typeof detail === "object" && detail?.message ? detail.message : e.message);
    } finally { setBusy(false); }
  }
  function update(field, value) { setSettings((old) => ({ ...old, [field]: value })); setNotice(""); }

  return <main style={{ width: "100%", minHeight: "100vh", background: "#000", padding: "20px 16px 90px", boxSizing: "border-box", color: "#fff" }}>
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <h1 style={{ color: NUTRITION_COLOR, textAlign: "center" }}>🥗 Nutrition Pro</h1>
      {busy && <p role="status">Loading…</p>}{error && <p role="alert" style={{ color: "#f87171" }}>{error}</p>}{notice && <p role="status" style={{ color: "#6ee7b7" }}>{notice}</p>}
      {targets && <section style={{ background: "#111", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <h2>Personalized targets</h2>
        {targets.status === "ready" ? <p>{targets.effective.calories} kcal · {targets.effective.protein_g} g protein · {targets.effective.carbs_g} g carbs · {targets.effective.fat_g} g fat</p> : <p>Complete your profile and goal to calculate targets. Missing: {(targets.missing || []).join(", ") || "profile inputs"}.</p>}
        <p style={{ color: "#aaa", fontSize: 13 }}>Calculated from your saved profile and goals; estimates are not medical advice.</p>
      </section>}
      <form onSubmit={saveSettings} style={{ display: "grid", gap: 12, background: "#111", borderRadius: 12, padding: 16 }}>
        <h2 style={{ margin: 0 }}>Plan preferences</h2>
        <label>Goal<select aria-label="Goal" style={inputStyle} value={settings.goal_type || "maintain"} onChange={(e) => update("goal_type", e.target.value)}><option value="lose">Lose weight</option><option value="maintain">Maintain</option><option value="gain">Gain weight</option></select></label>
        <label>Target weight ({settings.goal_unit})<input aria-label="Target weight" type="number" min="1" step="0.1" style={inputStyle} value={settings.target_weight} onChange={(e) => update("target_weight", e.target.value)} placeholder="Optional" /></label>
        <label>Weight unit<select aria-label="Weight unit" style={inputStyle} value={settings.goal_unit} onChange={(e) => update("goal_unit", e.target.value)}><option value="lbs">lb</option><option value="kg">kg</option></select></label>
        <label>Diet<select aria-label="Diet" style={inputStyle} value={settings.diet} onChange={(e) => update("diet", e.target.value)}>{["none", "pescatarian", "vegetarian", "vegan"].map((x) => <option key={x} value={x}>{x}</option>)}</select></label>
        <label>Meals per day<select aria-label="Meals per day" style={inputStyle} value={settings.meals_per_day} onChange={(e) => update("meals_per_day", e.target.value)}>{[3,4,5].map((x) => <option key={x} value={x}>{x}</option>)}</select></label>
        <label>Avoid ingredients<select aria-label="Avoid ingredients" multiple style={{ ...inputStyle, minHeight: 100 }} value={settings.avoid || []} onChange={(e) => update("avoid", Array.from(e.target.selectedOptions, (option) => option.value))}>{(targets?.allergens || ["dairy", "egg", "fish", "nuts", "gluten", "soy"]).map((x) => <option key={x} value={x}>{x}</option>)}</select><small>Hold Ctrl/Command to select more than one.</small></label>
        <button disabled={busy} style={{ padding: 12, background: NUTRITION_COLOR, border: 0, borderRadius: 8, fontWeight: 700 }}>Save preferences</button>
      </form>
      <section style={{ background: "#111", borderRadius: 12, padding: 16, marginTop: 16 }}>
        <h2>Meal planner</h2><button disabled={busy || targets?.status !== "ready"} onClick={generatePlan} style={{ padding: 12, background: NUTRITION_COLOR, border: 0, borderRadius: 8, fontWeight: 700 }}>Generate and save plan</button>
        {plans.length > 1 && <label style={{ display: "block", marginTop: 12 }}>Saved plans<select aria-label="Saved plans" style={inputStyle} onChange={(e) => setPlan(plans.find((p) => String(p.id) === e.target.value)?.plan || null)}>{plans.map((p) => <option key={p.id} value={p.id}>{new Date(p.created_at).toLocaleString()}</option>)}</select></label>}
        {plan ? <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", color: "#ddd" }}>{JSON.stringify(plan, null, 2)}</pre> : <p>No saved meal plan yet.</p>}
      </section>
    </div>
    <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: 40, background: "#000", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 16px", boxSizing: "border-box", zIndex: 20 }}><button onClick={() => setMenuOpen(true)} style={{ color: NUTRITION_COLOR, background: "transparent", border: 0, textDecoration: "underline", cursor: "pointer" }}>Return to Menu</button></div>
  </main>;
}
