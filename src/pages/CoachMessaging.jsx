import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CoachShell from "../components/CoachShell.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { COACH_COLOR, cardStyle, inputStyle, primaryButton, secondaryButton } from "../components/coachStyles.js";
import { errorText, useCoachRequest } from "../utils/coachSession.js";

export default function CoachMessaging() {
  const request = useCoachRequest();
  const [params, setParams] = useSearchParams();
  const [threads, setThreads] = useState([]);
  const [teams, setTeams] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [thread, setThread] = useState(null);
  const [draft, setDraft] = useState("");
  const [broadcast, setBroadcast] = useState({ open: false, teamId: "", body: "" });
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);
  const clientId = params.get("client");

  const loadThreads = useCallback(async () => {
    try {
      const [threadData, teamData] = await Promise.all([request("/staff/messages/threads"), request("/staff/teams")]);
      setThreads(threadData.threads || []);
      setTeams(teamData.teams || []);
      setStatus("ready");
    } catch (e) {
      setError(errorText(e, "Unable to load messages."));
      setStatus("error");
    }
  }, [request]);

  useEffect(() => {
    const timer = setTimeout(() => loadThreads(), 0);
    return () => clearTimeout(timer);
  }, [loadThreads]);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (!clientId) {
        setThread(null);
        return;
      }
      setThread(null);
      try {
        const data = await request(`/staff/messages/${clientId}`);
        if (cancelled) return;
        setThread(data);
        setError("");
        await request(`/staff/messages/${clientId}/read`, { method: "POST" });
        if (!cancelled) loadThreads();
      } catch (e) {
        if (!cancelled) setError(errorText(e, "Unable to open that conversation."));
      }
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [clientId, request, loadThreads]);

  async function send() {
    const body = draft.trim();
    if (!body) return;
    setSending(true);
    try {
      const message = await request(`/staff/messages/${clientId}`, { method: "POST", body: { body } });
      setThread((current) => ({ ...current, messages: [...current.messages, message] }));
      setDraft("");
      setError("");
      loadThreads();
    } catch (e) {
      setError(errorText(e, "Message failed to send."));
    } finally {
      setSending(false);
    }
  }

  async function sendBroadcast() {
    if (!broadcast.teamId || !broadcast.body.trim()) {
      setNotice("Choose a team and write a message.");
      return;
    }
    try {
      const result = await request("/staff/messages/broadcast", { method: "POST", body: { team_id: Number(broadcast.teamId), body: broadcast.body.trim() } });
      setNotice(`Sent to ${result.sent_to} client(s).`);
      setBroadcast({ open: false, teamId: "", body: "" });
      loadThreads();
    } catch (e) {
      setNotice(errorText(e, "Broadcast failed."));
    }
  }

  if (clientId) {
    return (
      <CoachShell title="💬 Messages">
        <button style={{ ...secondaryButton, marginBottom: "12px" }} onClick={() => setParams({})}>← All conversations</button>
        {error && <StatusMessage error>{error}</StatusMessage>}
        {!thread && !error && <StatusMessage>Loading conversation...</StatusMessage>}
        {thread && (
          <>
            <div style={{ color: COACH_COLOR, fontWeight: "700", marginBottom: "10px" }}>{thread.client.name}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
              {thread.messages.length === 0 && <StatusMessage>No messages yet. Say hello below.</StatusMessage>}
              {thread.messages.map((m) => (
                <div key={m.id} style={{ alignSelf: m.sender === "coach" ? "flex-end" : "flex-start", maxWidth: "80%", background: m.sender === "coach" ? COACH_COLOR : "#222", color: m.sender === "coach" ? "#000" : "#fff", padding: "8px 12px", borderRadius: "12px", fontSize: "13px", wordBreak: "break-word" }}>
                  {m.body}
                </div>
              ))}
            </div>
            <textarea aria-label="Message" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message" style={{ ...inputStyle, minHeight: "60px", marginBottom: "8px" }} />
            <button style={{ ...primaryButton(sending), width: "100%" }} disabled={sending} onClick={send}>Send</button>
          </>
        )}
      </CoachShell>
    );
  }

  return (
    <CoachShell title="💬 Coach Messages">
      {teams.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          {!broadcast.open ? (
            <button style={{ ...secondaryButton, width: "100%" }} onClick={() => setBroadcast({ ...broadcast, open: true })}>📣 Message a whole team</button>
          ) : (
            <div style={cardStyle}>
              <select aria-label="Team" style={{ ...inputStyle, marginBottom: "8px" }} value={broadcast.teamId} onChange={(e) => setBroadcast({ ...broadcast, teamId: e.target.value })}>
                <option value="">Choose team...</option>
                {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <textarea aria-label="Broadcast message" style={{ ...inputStyle, minHeight: "60px", marginBottom: "8px" }} value={broadcast.body} onChange={(e) => setBroadcast({ ...broadcast, body: e.target.value })} />
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={{ ...primaryButton(), flex: 1 }} onClick={sendBroadcast}>Send to Team</button>
                <button style={{ ...secondaryButton, flex: 1 }} onClick={() => setBroadcast({ open: false, teamId: "", body: "" })}>Cancel</button>
              </div>
            </div>
          )}
          {notice && <div style={{ color: "#ccc", fontSize: "12px", marginTop: "8px", textAlign: "center" }}>{notice}</div>}
        </div>
      )}
      {status === "loading" && <StatusMessage>Loading conversations...</StatusMessage>}
      {status === "error" && (
        <div>
          <StatusMessage error>{error}</StatusMessage>
          <button style={{ ...secondaryButton, width: "100%" }} onClick={loadThreads}>Retry</button>
        </div>
      )}
      {status === "ready" && threads.length === 0 && <StatusMessage>No clients to message yet. Invite a client from My Clients.</StatusMessage>}
      {status === "ready" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {threads.map((t) => (
            <div key={t.client_id} role="button" style={{ ...cardStyle, cursor: "pointer" }} onClick={() => setParams({ client: String(t.client_id) })}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "600" }}>{t.name}</span>
                {t.unread > 0 && <span style={{ background: COACH_COLOR, color: "#000", borderRadius: "10px", padding: "0 8px", fontSize: "12px" }}>{t.unread}</span>}
              </div>
              <div style={{ color: "#999", fontSize: "12px", marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.last_message || "No messages yet"}</div>
            </div>
          ))}
        </div>
      )}
    </CoachShell>
  );
}
