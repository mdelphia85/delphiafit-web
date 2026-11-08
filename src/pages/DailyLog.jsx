import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.js";
import { apiRequest } from "../utils/api.js";

const COLOR = "yellow";
const fields = ["protein", "water", "calories", "meals", "workouts", "supplements"];
const today = () => new Date().toISOString().slice(0, 10);

function Field({ label, value, onChange }) {
  return <label style={{ display: "block", marginBottom: 22, color: COLOR, fontSize: 22 }}>{label}<input type="number" min="0" step="any" value={value} onChange={onChange} style={{ display: "block", width: "100%", padding: 14, fontSize: 20, borderRadius: 6, border: `2px solid ${COLOR}`, background: "black", color: COLOR, boxSizing: "border-box" }} /></label>;
}

export default function DailyLog() {
  const { setMenuOpen } = useContext(MenuContext);
  const [form, setForm] = useState(Object.fromEntries(fields.map((field) => [field, ""])));
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/daily-log/").then((records) => {
      const record = records.find((item) => String(item.date).slice(0, 10) === today());
      if (active && record) {
        setRecordId(record.id);
        setForm(Object.fromEntries(fields.map((key) => [key, record[key] == null ? "" : String(record[key])])));
      }
    }).catch((err) => active && setError(err.message || "Unable to load daily log."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  async function saveLog() {
    setSaving(true); setError(""); setMessage("");
    try {
      const body = Object.fromEntries(fields.map((key) => [key, Number(form[key]) || 0]));
      const payload = { ...body, date: `${today()}T12:00:00` };
      const saved = recordId
        ? await apiRequest(`/daily-log/${recordId}`, { method: "PUT", body: payload })
        : await apiRequest("/daily-log/", { method: "POST", body: payload });
      setRecordId(saved.id);
      setMessage("Daily log saved.");
    } catch (err) {
      setError(err.message || "Unable to save daily log.");
    } finally { setSaving(false); }
  }

  return <div style={{ minHeight: "100vh", width: "100%", background: "black", padding: 20, overflowY: "auto", boxSizing: "border-box", color: COLOR, position: "relative" }}>
    <h1>Daily Log</h1>{loading && <p role="status">Loading daily log…</p>}{error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    {fields.map((key) => <Field key={key} label={`${key[0].toUpperCase()}${key.slice(1)}${key === "protein" ? " (g)" : key === "water" ? " (oz)" : ""}`} value={form[key]} onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))} />)}
    <button type="button" disabled={saving || loading} onClick={saveLog} style={{ color: COLOR, background: "none", border: 0, fontSize: 26, fontWeight: "bold", textDecoration: "underline", cursor: "pointer" }}>{saving ? "Saving…" : "Save Log"}</button>
    <button type="button" onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: 20, right: 20, color: COLOR, fontSize: 22, textDecoration: "underline", background: "none", border: 0, cursor: "pointer" }}>Return to Menu</button>
  </div>;
}
