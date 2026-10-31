import { useState } from "react";
import CoachShell from "../components/CoachShell.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import TeamPicker from "../components/TeamPicker.jsx";
import { COACH_COLOR, cardStyle, inputStyle, primaryButton } from "../components/coachStyles.js";
import { errorText, useCoachRequest } from "../utils/coachSession.js";
import useTeamRoster from "../utils/useTeamRoster.js";

export default function TeamCommunications() {
  const request = useCoachRequest();
  const { teams, teamId, setTeamId, roster, status, error } = useTeamRoster(request);
  const [body, setBody] = useState("");
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    if (!body.trim()) {
      setNotice("Write a message first.");
      return;
    }
    setSending(true);
    try {
      const result = await request("/staff/messages/broadcast", { method: "POST", body: { team_id: Number(teamId), body: body.trim() } });
      setNotice(`Sent to ${result.sent_to} athlete(s). Replies arrive in Coach Messages.`);
      setBody("");
    } catch (e) {
      setNotice(errorText(e, "Broadcast failed."));
    } finally {
      setSending(false);
    }
  }

  return (
    <CoachShell title="💬 Team Comms">
      <TeamPicker teams={teams} value={teamId} onChange={setTeamId} />
      {status === "error" && <StatusMessage error>{error}</StatusMessage>}
      {status === "loading" && <StatusMessage>Loading team...</StatusMessage>}
      {status === "ready" && teams.length === 0 && <StatusMessage>You have no teams yet. Create one in Team Operations.</StatusMessage>}
      {roster && status === "ready" && (
        <div style={cardStyle}>
          <div style={{ color: COACH_COLOR, fontWeight: "700", marginBottom: "4px" }}>Announcement to {roster.team.name}</div>
          <div style={{ color: "#999", fontSize: "12px", marginBottom: "8px" }}>{roster.clients.length} athlete(s) will receive this in their inbox.</div>
          <textarea aria-label="Announcement" style={{ ...inputStyle, minHeight: "100px", marginBottom: "8px" }} value={body} onChange={(e) => setBody(e.target.value)} />
          <button style={{ ...primaryButton(sending || roster.clients.length === 0), width: "100%" }} disabled={sending || roster.clients.length === 0} onClick={send}>
            Send Announcement
          </button>
          {notice && <div style={{ color: "#ccc", fontSize: "12px", marginTop: "8px", textAlign: "center" }}>{notice}</div>}
        </div>
      )}
    </CoachShell>
  );
}
