import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../context/MenuContext.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { COACH_COLOR, cardStyle, inputStyle, primaryButton } from "../components/coachStyles.js";
import { ApiError, apiRequest, hasSession } from "../utils/api.js";

export default function ClientMessages() {
  const navigate = useNavigate();
  const { setMenuOpen } = useContext(MenuContext);
  const [data, setData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const signedIn = hasSession("user");

  const load = useCallback(async () => {
    try {
      const [messages, planData] = await Promise.all([apiRequest("/staff/my/messages"), apiRequest("/staff/my/plans")]);
      setData(messages);
      setPlans(planData.plans || []);
      setStatus("ready");
      if (messages.unread > 0) apiRequest("/staff/my/messages/read", { method: "POST" }).catch(() => {});
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) setStatus("no-coach");
      else if (e instanceof ApiError && e.status === 401) navigate("/login", { replace: true });
      else {
        setError(e.message || "Unable to load your messages.");
        setStatus("error");
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (!signedIn) {
      navigate("/login", { replace: true });
      return;
    }
    const timer = setTimeout(() => load(), 0);
    return () => clearTimeout(timer);
  }, [signedIn, navigate, load]);

  async function send() {
    const body = draft.trim();
    if (!body) return;
    setSending(true);
    try {
      const message = await apiRequest("/staff/my/messages", { method: "POST", body: { body } });
      setData((current) => ({ ...current, messages: [...current.messages, message] }));
      setDraft("");
      setError("");
    } catch (e) {
      setError(e.message || "Message failed to send.");
    } finally {
      setSending(false);
    }
  }

  if (!signedIn) return null;

  return (
    <div style={{ width: "100vw", minHeight: "100vh", background: "#000", color: "#fff", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto" }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", color: COACH_COLOR, fontSize: "28px", fontWeight: "700", marginBottom: "20px" }}>🏆 My Coach</div>
        {status === "loading" && <StatusMessage>Loading...</StatusMessage>}
        {status === "no-coach" && <StatusMessage>You are not connected to a coach yet. Accept an invitation from your coach to get started.</StatusMessage>}
        {status === "error" && <StatusMessage error>{error}</StatusMessage>}
        {status === "ready" && (
          <>
            {data.coach && <div style={{ color: "#999", fontSize: "13px", marginBottom: "12px" }}>Coach: {data.coach.name}</div>}
            <div style={{ color: COACH_COLOR, fontWeight: "700", marginBottom: "8px" }}>My Training Plans</div>
            {plans.length === 0 ? (
              <StatusMessage>No plans assigned yet.</StatusMessage>
            ) : (
              plans.map((plan) => (
                <div key={plan.assignment_id} style={{ ...cardStyle, marginBottom: "8px" }}>
                  <div style={{ fontWeight: "600" }}>{plan.name}</div>
                  {plan.description && <div style={{ color: "#ccc", fontSize: "12px" }}>{plan.description}</div>}
                  {plan.items && plan.items.length > 0 && (
                    <ul style={{ color: "#ccc", fontSize: "12px", paddingLeft: "18px", margin: "6px 0 0" }}>
                      {plan.items.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  )}
                </div>
              ))
            )}

            <div style={{ color: COACH_COLOR, fontWeight: "700", margin: "16px 0 8px" }}>Messages</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
              {data.messages.length === 0 && <StatusMessage>No messages yet.</StatusMessage>}
              {data.messages.map((m) => (
                <div key={m.id} style={{ alignSelf: m.sender === "client" ? "flex-end" : "flex-start", maxWidth: "80%", background: m.sender === "client" ? COACH_COLOR : "#222", color: m.sender === "client" ? "#000" : "#fff", padding: "8px 12px", borderRadius: "12px", fontSize: "13px", wordBreak: "break-word" }}>
                  {m.body}
                </div>
              ))}
            </div>
            {error && <StatusMessage error>{error}</StatusMessage>}
            <textarea aria-label="Message" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Message your coach" style={{ ...inputStyle, minHeight: "60px", marginBottom: "8px" }} />
            <button style={{ ...primaryButton(sending), width: "100%" }} disabled={sending} onClick={send}>Send</button>
          </>
        )}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: "40px", background: "#000", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 16px", boxSizing: "border-box", zIndex: 20 }}>
        <div style={{ color: COACH_COLOR, fontSize: "18px", textDecoration: "underline", cursor: "pointer" }} onClick={() => setMenuOpen(true)}>Return to Menu</div>
      </div>
    </div>
  );
}
