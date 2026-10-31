import { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";
const COLOR = "#8b5cf6";
export default function AIPerformanceLab() {
  const { setMenuOpen } = useContext(MenuContext);
  const [exercise, setExercise] = useState("squat");
  const [keypoints, setKeypoints] = useState("[]");
  const [reps, setReps] = useState("[]");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function analyze(event) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const body = { exercise, keypoints: JSON.parse(keypoints), reps: JSON.parse(reps) };
      if (!Array.isArray(body.keypoints) || !Array.isArray(body.reps) || !body.keypoints.length || !body.reps.length) throw new Error("Enter real keypoint frames and at least one rep range before analysis.");
      const response = await apiRequest("/ai/form-score", { method: "POST", body }); setResult(response.result);
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  const field = { display: "block", width: "100%", boxSizing: "border-box", padding: 9, background: "#111", color: "#fff", border: "1px solid #444", borderRadius: 6, marginTop: 6 };
  return <main style={{ width: "100%", minHeight: "100vh", background: "#000", color: "#fff", boxSizing: "border-box", padding: "20px 16px 90px" }}><div style={{ maxWidth: 680, margin: "0 auto" }}><h1 style={{ color: COLOR, textAlign: "center" }}>🔬 Performance Lab</h1><p style={{ color: "#aaa" }}>Rule-based form scoring for user-supplied keypoint JSON. No camera tracking, medical-risk prediction, or fabricated metrics are provided.</p>{error && <p role="alert" style={{ color: "#f87171" }}>{error}</p>}<form onSubmit={analyze} style={{ background: "#111", borderRadius: 10, padding: 16, display: "grid", gap: 12 }}><label>Exercise<select aria-label="Exercise" value={exercise} onChange={(e) => setExercise(e.target.value)} style={field}>{["squat", "bench", "deadlift"].map((x) => <option key={x}>{x}</option>)}</select></label><label>Keypoints JSON<textarea aria-label="Keypoints JSON" rows={6} value={keypoints} onChange={(e) => setKeypoints(e.target.value)} style={field} /></label><label>Rep ranges JSON<textarea aria-label="Rep ranges JSON" rows={3} value={reps} onChange={(e) => setReps(e.target.value)} style={field} /></label><button disabled={busy} style={{ padding: 12, background: COLOR, border: 0, borderRadius: 8, fontWeight: 700 }}>{busy ? "Analyzing…" : "Analyze and save"}</button></form>{result && <section style={{ background: "#111", padding: 16, marginTop: 14, borderRadius: 10 }}><h2>Saved form score</h2><pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{JSON.stringify(result, null, 2)}</pre></section>}</div><div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: 40, background: "#000", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 16px", boxSizing: "border-box" }}><button onClick={() => setMenuOpen(true)} style={{ color: COLOR, background: "transparent", border: 0, textDecoration: "underline" }}>Return to Menu</button></div></main>;
}
