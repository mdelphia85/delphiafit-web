import { useCallback, useEffect, useState } from "react";
import CoachShell from "../components/CoachShell.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import TeamPicker from "../components/TeamPicker.jsx";
import { COACH_COLOR, cardStyle, inputStyle, primaryButton } from "../components/coachStyles.js";
import { apiRequest } from "../utils/api.js";
import useMyTeams, { apiErrorText } from "../utils/useMyTeams.js";

export default function TeamCommunications() {
  const { teams, teamId, setTeamId, roster, status, error } = useMyTeams();
  const [posts, setPosts] = useState([]);
  const [body, setBody] = useState("");
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!teamId) return undefined;
    let active = true;
    apiRequest(`/social/posts/group/${teamId}`)
      .then((loadedPosts) => {
        if (active) setPosts(loadedPosts);
      })
      .catch((e) => {
        if (active) setNotice(apiErrorText(e, "Could not load team messages."));
      });
    return () => { active = false; };
  }, [teamId]);

  const loadPosts = useCallback(async () => {
    if (!teamId) return;
    try {
      setPosts(await apiRequest(`/social/posts/group/${teamId}`));
    } catch (e) {
      setNotice(apiErrorText(e, "Could not load team messages."));
    }
  }, [teamId]);

  async function send() {
    if (!body.trim()) {
      setNotice("Write a message first.");
      return;
    }
    setSending(true);
    try {
      await apiRequest(`/social/posts?content=${encodeURIComponent(body.trim())}&group_id=${teamId}`, { method: "POST" });
      setBody("");
      setNotice("");
      await loadPosts();
    } catch (e) {
      setNotice(apiErrorText(e, "Message failed."));
    } finally {
      setSending(false);
    }
  }

  const names = Object.fromEntries((roster?.members || []).map((m) => [m.id, m.is_you ? "You" : m.name]));

  return (
    <CoachShell title="💬 Team Comms" requireSession={false} home>
      <TeamPicker teams={teams} value={teamId} onChange={setTeamId} />
      {status === "error" && <StatusMessage error>{error}</StatusMessage>}
      {status === "loading" && <StatusMessage>Loading team...</StatusMessage>}
      {status === "ready" && teams.length === 0 && <StatusMessage>You are not on a team yet. Create or join one in Team Roster.</StatusMessage>}
      {teamId && status === "ready" && (
        <>
          <div style={{ ...cardStyle, marginBottom: "14px" }}>
            <div style={{ color: COACH_COLOR, fontWeight: "700", marginBottom: "8px" }}>Message {roster?.group.name}</div>
            <textarea aria-label="Team message" style={{ ...inputStyle, minHeight: "80px", marginBottom: "8px" }} value={body} onChange={(e) => setBody(e.target.value)} />
            <button style={{ ...primaryButton(sending), width: "100%" }} disabled={sending} onClick={send}>Send</button>
            {notice && <div style={{ color: "#ccc", fontSize: "12px", marginTop: "8px", textAlign: "center" }}>{notice}</div>}
          </div>
          {posts.length === 0 ? (
            <StatusMessage>No messages yet.</StatusMessage>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {posts.map((p) => (
                <div key={p.id} style={cardStyle}>
                  <div style={{ color: "#999", fontSize: "11px" }}>{names[p.user_id] || "Member"} · {p.created_at ? new Date(p.created_at).toLocaleString() : ""}</div>
                  <div>{p.content}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </CoachShell>
  );
}
