import { useContext, useEffect, useState } from "react";
import waterImage from "../assets/water.png";
import { MenuContext } from "../context/MenuContext.js";
import { apiRequest } from "../utils/api.js";

const ML_PER_OZ = 29.5735;
const today = () => new Date().toISOString().slice(0, 10);

export default function Water() {
  const waterColor = "rgb(0, 150, 255)";
  const { openMenu } = useContext(MenuContext);
  const [unit, setUnit] = useState("oz");
  const [intakeOz, setIntakeOz] = useState(0);
  const [draftOz, setDraftOz] = useState(0);
  const targetOz = null;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/hydration/")
      .then((logs) => {
        if (!active) return;
        const oz = logs.filter((log) => String(log.date).slice(0, 10) === today())
          .reduce((sum, log) => sum + Number(log.amount_ml || 0) / ML_PER_OZ, 0);
        setIntakeOz(oz);
      })
      .catch((err) => active && setError(err.message || "Unable to load hydration logs."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const display = (oz) => unit === "oz" ? oz : oz * ML_PER_OZ;
  const addDraft = (amountOz) => setDraftOz((current) => current + amountOz);

  async function saveWater() {
    if (!Number.isFinite(draftOz) || draftOz <= 0) {
      setError("Enter an amount greater than zero to log water.");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    const oz = draftOz;
    try {
      await apiRequest("/hydration/", { method: "POST", body: {
        amount_ml: Math.round(oz * ML_PER_OZ), date: new Date().toISOString()
      } });
      setIntakeOz((total) => total + oz);
      setDraftOz(0);
      setMessage("Water intake saved.");
    } catch (err) {
      setError(err.message || "Unable to save water intake.");
    } finally {
      setSaving(false);
    }
  }

  const remaining = targetOz == null ? null : Math.max(0, targetOz - intakeOz);
  return (
    <div style={{ minHeight: "100vh", width: "100%", backgroundColor: "black", color: waterColor, display: "flex", flexDirection: "column", padding: 20, boxSizing: "border-box", position: "relative" }}>
      <img src={waterImage} alt="Water" style={{ width: 120, height: 120, objectFit: "contain", margin: "0 auto 10px" }} />
      <button type="button" onClick={() => setUnit((value) => value === "oz" ? "ml" : "oz")} style={{ color: waterColor, background: "none", border: 0, textDecoration: "underline", cursor: "pointer", marginBottom: 15 }}>Switch to {unit === "oz" ? "mL" : "oz"}</button>
      <div style={{ textAlign: "center", marginBottom: 25 }}>
        <p>Target: {targetOz == null ? "Not set" : `${display(targetOz).toFixed(0)} ${unit}`}</p>
        <p>Today: {display(intakeOz).toFixed(0)} {unit}</p>
        <p>Remaining: {remaining == null ? "Not available" : `${display(remaining).toFixed(0)} ${unit}`}</p>
      </div>
      {loading ? <p role="status">Loading hydration…</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {message ? <p role="status">{message}</p> : null}
      <label htmlFor="water-amount">Amount to log ({unit})</label>
      <input id="water-amount" type="number" min="0" step="any" value={unit === "oz" ? draftOz : Math.round(draftOz * ML_PER_OZ)} onChange={(e) => { const entered = Number(e.target.value) || 0; setDraftOz(unit === "oz" ? entered : entered / ML_PER_OZ); }} placeholder={`Enter water amount (${unit})`} style={{ padding: 12, fontSize: 18, borderRadius: 6, border: `2px solid ${waterColor}`, marginBottom: 20, backgroundColor: "black", color: waterColor }} />
      <div style={{ marginBottom: 20, textAlign: "center" }}><p>Quick Add:</p><div style={{ display: "flex", gap: 15, justifyContent: "center" }}>{[8, 12, 16].map((amount) => <button key={amount} type="button" onClick={() => addDraft(amount)} style={{ color: waterColor, background: "none", border: 0, textDecoration: "underline", cursor: "pointer" }}>+{amount} oz</button>)}</div></div>
      <button type="button" disabled={saving || loading} onClick={saveWater} style={{ color: waterColor, background: "none", border: 0, textDecoration: "underline", fontSize: 22, cursor: "pointer", marginTop: "auto" }}>{saving ? "Saving…" : "Save"}</button>
      {intakeOz >= targetOz && <p style={{ textAlign: "center" }}>💧 Goal Reached 💧</p>}
      <button type="button" onClick={openMenu} style={{ position: "fixed", bottom: 20, right: 20, color: waterColor, background: "none", border: 0, textDecoration: "underline", fontSize: 18, cursor: "pointer" }}>Return to Menu</button>
    </div>
  );
}
