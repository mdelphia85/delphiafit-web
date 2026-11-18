import { useContext, useEffect, useRef, useState } from "react";
import TextAction from "../components/TextAction.jsx";
import { Link, useSearchParams } from "react-router-dom";
import TrainingPlanGenerator from "./AutonomousCoaching.jsx";
import WeeklyPlanView from "../components/WeeklyPlanView.jsx";
import { apiRequest } from "../utils/api.js";
import AdaptiveCoachCard from "../components/AdaptiveCoachCard.jsx";
import { MenuContext } from "../context/MenuContext.js";
import { validCategory } from "../ai/categories.js";

export default function AICoach() {
  const { setMenuOpen } = useContext(MenuContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.get("view");
  const section = selected === "plan" || selected === "history" ? selected : "ask";
  const [historyFilter, setHistoryFilter] = useState("all");
  const [openedRecord, setOpenedRecord] = useState(null);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [replyMode, setReplyMode] = useState(null);
  const [lastAdaptive, setLastAdaptive] = useState(null);
  const [fatigue, setFatigue] = useState("3");
  const [sleepHours, setSleepHours] = useState("7");
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState(null);
  const [error, setError] = useState("");
  const [requiresSignIn, setRequiresSignIn] = useState(false);
  const submissionInFlight = useRef(false);
  const pendingSubmission = useRef(null);
  const AI_COLOR = "#a78bfa";

  async function loadHistory() {
    try {
      const records = await apiRequest("/ai/records", { timeoutMs: 10000 });
      setHistory(Array.isArray(records) ? records.filter((record) => ["coach", "weekly-plan"].includes(record.feature)) : []);
    } catch (e) {
      if (e.status === 401) {
        setRequiresSignIn(true);
        setError("Sign in to use personalized coaching.");
      } else {
        setError(e.status === 0
          ? "Loading coaching history timed out."
          : e.status ? e.message || "Unable to load coaching history."
            : "Unable to load coaching history. Check your connection and try again.");
      }
    }
  }
  useEffect(() => { const timer = setTimeout(() => { loadHistory(); }, 0); return () => clearTimeout(timer); }, []);
  const coachingRecords = history ?? [];
  const adaptiveUsed = reply && lastAdaptive && Object.keys(lastAdaptive).length > 0 ? lastAdaptive : null;

  async function sendMessage(event) {
    event.preventDefault();
    const prompt = message.trim();
    if (!prompt || submissionInFlight.current) return;
    submissionInFlight.current = true;
    setBusy(true); setError(""); setRequiresSignIn(false); setReply("");
    const userData = { fatigue: Number(fatigue), sleep_hours: Number(sleepHours) };
    const fingerprint = JSON.stringify({ user_data: userData, message: prompt });
    if (pendingSubmission.current?.fingerprint !== fingerprint) {
      pendingSubmission.current = { fingerprint, key: crypto.randomUUID() };
    }
    const submissionKey = pendingSubmission.current.key;
    try {
      const result = await apiRequest("/ai/coach", {
        method: "POST",
        timeoutMs: 30000,
        headers: { "Idempotency-Key": submissionKey },
        body: { user_data: userData, message: prompt }
      });
      if (pendingSubmission.current?.key === submissionKey) pendingSubmission.current = null;
      setLastAdaptive(result && result.adaptive_inputs ? result.adaptive_inputs : null);
      setReplyMode(typeof result === "object" ? (result.mode || null) : null);
      setReply(typeof result === "string" ? result : result.coach_response || result.response || result.message || JSON.stringify(result));
      setMessage(""); await loadHistory();
    } catch (e) {
      if (e.status === 401) {
        setRequiresSignIn(true);
        setError("Sign in to use personalized coaching.");
      } else if (e.status === 409) {
        if (pendingSubmission.current?.key === submissionKey) pendingSubmission.current = null;
        setError("This request key was already used for different coaching details. Please send your question again.");
      } else if (e.status === 0) {
        setError("AI Coach request timed out. Check saved coaching history before trying again.");
      } else if (e.status >= 500) {
        setError("AI Coach is temporarily unavailable. Please try again.");
      } else if (!e.status) {
        setError("Unable to reach AI Coach. Check your connection and try again.");
      } else {
        setError(e.message || "Unable to prepare coaching guidance.");
      }
    } finally {
      submissionInFlight.current = false;
      setBusy(false);
    }
  }

  return <main style={{ width: "100%", minHeight: "100vh", background: "#000", padding: "16px 16px 90px", boxSizing: "border-box", color: "#fff" }}>
    <div style={{ width: 560, maxWidth: "100%", margin: "0 auto" }}>
      <h1 style={{ color: AI_COLOR, textAlign: "center" }}>AI Coach</h1>
      <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>Ask AI Coach any question — fitness, recovery, nutrition, or everyday topics. Conversational responses require the hosted model; otherwise limited workout guidance is available. When enabled, your question and relevant fitness context are processed by an external AI service. AI can make mistakes and cannot assess medical readiness.</p>
      <label style={{ display: "block", marginBottom: 18, color: AI_COLOR }}>Coaching section
        <select aria-label="Coaching section" value={section}
          onChange={(event) => {
            const next = new URLSearchParams(searchParams);
            if (event.target.value === "ask") next.delete("view");
            else next.set("view", event.target.value);
            setSearchParams(next);
            setOpenedRecord(null);
          }}
          style={{ display: "block", marginTop: 7, padding: 10, width: "100%", boxSizing: "border-box", color: "#fff", background: "#111", border: "1px solid #555", borderRadius: 6 }}>
          <option value="ask">Ask AI Coach</option>
          <option value="plan">Generate Training Plan</option>
          <option value="history">Coaching History</option>
        </select>
      </label>
      <AdaptiveCoachCard />
      {section === "ask" && <>
      <section aria-live="polite" style={{ background: "#111", borderRadius: 12, padding: 16, minHeight: 180, marginBottom: 14 }}>
        {busy && <p role="status">Preparing guidance…</p>}
        {reply && <div><strong>Coach guidance</strong>{replyMode === "limited" && <p style={{ fontSize: "12px", color: "#aaa" }}>Limited mode: general conversational AI is not configured yet.</p>}<p style={{ whiteSpace: "pre-wrap" }}>{reply}</p>{adaptiveUsed && <small style={{ color: "#aaa" }}>Adapted using your history: {adaptiveUsed.workouts_logged ?? 0} workout{(adaptiveUsed.workouts_logged ?? 0) === 1 ? "" : "s"} logged{adaptiveUsed.difficulty ? `, ${adaptiveUsed.difficulty} difficulty` : ""}{validCategory(adaptiveUsed.preferred_category) ? `, favours ${adaptiveUsed.preferred_category}` : ""}.</small>}</div>}
        {!reply && !busy && <p>Ask a question to start a conversation with DelphiaFit AI Coach.</p>}
        {error && <p role="alert" style={{ color: "#f87171" }}>{error}{requiresSignIn && <> <Link to="/login" style={{ color: "#c4b5fd" }}>Sign in</Link></>}</p>}
      </section>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}><label style={{ flex: 1 }}>Fatigue (0-10)<input aria-label="Fatigue" type="number" min="0" max="10" value={fatigue} onChange={(e) => setFatigue(e.target.value)} style={{ display: "block", width: "100%", background: "#111", color: "#fff", border: "1px solid #444", borderRadius: 6, padding: 8 }} /></label><label style={{ flex: 1 }}>Sleep (hours)<input aria-label="Sleep hours" type="number" min="0" max="24" step="0.5" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} style={{ display: "block", width: "100%", background: "#111", color: "#fff", border: "1px solid #444", borderRadius: 6, padding: 8 }} /></label></div>
      <form onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
        <input aria-label="Ask AI Coach" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask anything…" maxLength={4000} style={{ flex: 1, minWidth: 0, padding: 10, background: "#111", border: "1px solid #444", borderRadius: 8, color: "#fff" }} />
        <button disabled={busy || !message.trim()} style={{ padding: "10px 16px", background: AI_COLOR, border: 0, borderRadius: 8, fontWeight: 600 }}>{busy ? "Working…" : "Send"}</button>
      </form>
      <section style={{ marginTop: 16 }}><h2 style={{ fontSize: 16 }}>Saved coaching history</h2>{coachingRecords.filter((record) => record.feature === "coach").slice(0, 5).map((record) => <button key={record.id} onClick={() => { setReply(record.result.coach_response || "Saved recommendation"); setLastAdaptive(record.result.adaptive_inputs || null); setReplyMode(record.result.mode || "limited"); }} style={{ display: "block", width: "100%", textAlign: "left", padding: 10, marginBottom: 8, background: "#111", color: "#ddd", border: "1px solid #333", borderRadius: 8 }}>Saved {new Date(record.created_at).toLocaleString()} - {record.input.message}</button>)}</section>
      </>}
      {section === "plan" && <TrainingPlanGenerator onPlanSaved={loadHistory} />}
      {section === "history" && (
        <section aria-label="Coaching History" style={{ background: "#111", padding: 16, borderRadius: 12 }}>
          <h2 style={{ color: AI_COLOR, marginTop: 0 }}>Coaching History</h2>
          <label>Show records
            <select value={historyFilter} onChange={(event) => { setHistoryFilter(event.target.value); setOpenedRecord(null); }}
              style={{ width: "100%", boxSizing: "border-box", marginTop: 6, padding: 10, borderRadius: 6, background: "#161616", color: "#fff", border: "1px solid #555" }}>
              <option value="all">All coaching records</option>
              <option value="coach">AI conversations</option>
              <option value="weekly-plan">Training plans</option>
            </select>
          </label>
          <p style={{ color: "#aaa", fontSize: 12 }}>Saved questions and weekly training plans remain in your account.</p>
          {error && <p role="alert" style={{ color: "#f87171" }}>{error}</p>}
          {history === null && !error && <p role="status">Loading coaching history…</p>}
          {history !== null && coachingRecords.filter((record) => historyFilter === "all" || record.feature === historyFilter).length === 0 && !error && (
            <p>No saved coaching records in this category yet.</p>
          )}
          {coachingRecords.filter((record) => historyFilter === "all" || record.feature === historyFilter).map((record) => (
            <div key={record.id} style={{ padding: "12px 0", borderBottom: "1px solid #333" }}>
              <TextAction plain onClick={() => setOpenedRecord((current) => current === record.id ? null : record.id)}
                style={{ display: "block", color: AI_COLOR, textAlign: "left" }}>
                {record.feature === "weekly-plan" ? "Training plan" : "AI conversation"} · {new Date(record.created_at).toLocaleString()}
                {record.feature === "coach" && record.input?.message ? " · " + record.input.message : ""}
              </TextAction>
              {openedRecord === record.id && (
                <div style={{ fontSize: 14, marginTop: 10 }}>
                  {record.feature === "coach" && <p><strong>Question:</strong> {record.input?.message || "Saved question"}</p>}
                  {record.feature === "coach"
                    ? <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{record.result?.coach_response || "Saved answer unavailable."}</p>
                    : <WeeklyPlanView plan={record.result} />}
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
    <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: 40, background: "#000", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 16px", boxSizing: "border-box", zIndex: 20 }}><TextAction plain onClick={() => setMenuOpen(true)} style={{ color: AI_COLOR, background: "transparent", border: 0, textDecoration: "none", cursor: "pointer" }}>Return to Menu</TextAction></div>
  </main>;
}
