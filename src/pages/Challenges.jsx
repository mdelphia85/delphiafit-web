import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";
import { userDataApi } from "../utils/userDataApi.js";

const CATEGORIES = [
  { id: "workouts", label: "Completed workouts" },
  { id: "hydration", label: "Hydration entries" },
  { id: "daily_logs", label: "Daily logs" },
  { id: "journal", label: "Journal entries" }
];

export default function Challenges() {
  const { setMenuOpen } = useContext(MenuContext);
  const [challenges, setChallenges] = useState([]);
  const [counts, setCounts] = useState({ workouts: 0, hydration: 0, daily_logs: 0, journal: 0 });
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("workouts");
  const [target, setTarget] = useState("7");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTarget, setEditTarget] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      userDataApi.list("challenges"), apiRequest("/workouts/"), apiRequest("/hydration/"),
      apiRequest("/daily-log/"), userDataApi.list("journal")
    ]).then(([rows, workouts, hydration, daily, journal]) => {
      if (!active) return;
      setChallenges(rows.map((row) => ({ id: row.id, ...row.data })));
      setCounts({ workouts: workouts.length, hydration: hydration.length, daily_logs: daily.length, journal: journal.length });
    }).catch((err) => active && setError(err.message || "Unable to load challenges."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  async function createChallenge(event) {
    event.preventDefault();
    if (!title.trim() || Number(target) < 1) return;
    setSaving(true); setError("");
    try {
      const data = { title: title.trim(), category, target_value: Number(target) };
      const row = await userDataApi.create("challenges", data);
      setChallenges((old) => [{ id: row.id, ...row.data }, ...old]);
      setTitle("");
    } catch (err) { setError(err.message || "Unable to create challenge."); }
    finally { setSaving(false); }
  }

  async function updateChallenge(item) {
    if (!editTitle.trim() || Number(editTarget) < 1) return;
    setSaving(true); setError("");
    const data = { title: editTitle.trim(), category: item.category, target_value: Number(editTarget) };
    try {
      await userDataApi.update("challenges", item.id, data);
      setChallenges((old) => old.map((entry) => entry.id === item.id ? { id: item.id, ...data } : entry));
      setEditId(null);
    } catch (err) { setError(err.message || "Unable to update challenge."); }
    finally { setSaving(false); }
  }

  async function deleteChallenge(item) {
    setError("");
    try { await userDataApi.remove("challenges", item.id); setChallenges((old) => old.filter((entry) => entry.id !== item.id)); }
    catch (err) { setError(err.message || "Unable to delete challenge."); }
  }

  return <main style={{ minHeight: "100vh", background: "black", color: "white", padding: "20px 20px 80px", boxSizing: "border-box" }}>
    <h1 style={{ color: "dodgerblue", textAlign: "center" }}>Challenges</h1><p>Private goals whose progress is calculated from your recorded activity.</p>
    <form onSubmit={createChallenge} style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
      <input aria-label="Challenge title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Challenge title" required />
      <select aria-label="Activity type" value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
      <input aria-label="Target" type="number" min="1" value={target} onChange={(e) => setTarget(e.target.value)} />
      <button type="submit" disabled={saving}>{saving ? "Saving..." : "Create Challenge"}</button>
    </form>
    {loading && <p role="status">Loading challenges...</p>}{error && <p role="alert">{error}</p>}{!loading && !error && challenges.length === 0 && <p>No challenges yet. Create one to get started.</p>}
    {challenges.map((item) => {
      const count = counts[item.category] || 0;
      const progress = Math.min(100, Math.round(count / item.target_value * 100));
      const categoryLabel = CATEGORIES.find((entry) => entry.id === item.category)?.label || "Activity";
      return <article key={item.id} style={{ background: "#111", border: "1px solid #333", borderRadius: 12, padding: 14, marginBottom: 12 }}>
        {editId === item.id ? <><input aria-label="Edit challenge title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} /><input aria-label="Edit challenge target" type="number" min="1" value={editTarget} onChange={(e) => setEditTarget(e.target.value)} /><button type="button" disabled={saving} onClick={() => updateChallenge(item)}>Save changes</button><button type="button" onClick={() => setEditId(null)}>Cancel</button></> : <><strong style={{ color: "dodgerblue" }}>{item.title}</strong><p>{categoryLabel}: {count}/{item.target_value} recorded</p><progress value={progress} max="100" aria-label={`${item.title} progress`} /><span>{progress}%</span><div><button type="button" onClick={() => { setEditId(item.id); setEditTitle(item.title); setEditTarget(String(item.target_value)); }}>Edit</button> <button type="button" onClick={() => deleteChallenge(item)}>Delete</button></div></>}
      </article>;
    })}
    <button type="button" onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: 20, right: 20, zIndex: 20, color: "dodgerblue", background: "black", border: 0, textDecoration: "underline", fontSize: 18, cursor: "pointer" }}>Return to Menu</button>
  </main>;
}
