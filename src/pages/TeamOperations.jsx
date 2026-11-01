import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoachShell from "../components/CoachShell.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import TeamPicker from "../components/TeamPicker.jsx";
import { COACH_COLOR, cardStyle, inputStyle, primaryButton, secondaryButton } from "../components/coachStyles.js";
import { apiRequest } from "../utils/api.js";
import useMyTeams, { apiErrorText } from "../utils/useMyTeams.js";

export default function TeamOperations() {
  const navigate = useNavigate();
  const { teams, teamId, setTeamId, roster, status, error, reloadTeams } = useMyTeams();
  const [newName, setNewName] = useState(null);
  const [discover, setDiscover] = useState([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    apiRequest("/social/groups/discover").then(setDiscover).catch(() => setDiscover([]));
  }, [teams]);

  async function createTeam() {
    if (!newName || newName.trim().length < 2) {
      setNotice("Give the team a name.");
      return;
    }
    try {
      const team = await apiRequest(`/social/groups?name=${encodeURIComponent(newName.trim())}`, { method: "POST" });
      setNewName(null);
      setNotice(`Team "${team.name}" created.`);
      await reloadTeams(team.id);
    } catch (e) {
      setNotice(apiErrorText(e, "Could not create the team."));
    }
  }

  async function joinTeam(id) {
    try {
      await apiRequest(`/social/groups/${id}/join`, { method: "POST" });
      setNotice("Joined team.");
      await reloadTeams(id);
    } catch (e) {
      setNotice(apiErrorText(e, "Could not join the team."));
    }
  }

  async function leaveTeam() {
    try {
      await apiRequest(`/social/groups/${teamId}/leave`, { method: "DELETE" });
      setNotice("You left the team.");
      await reloadTeams();
    } catch (e) {
      setNotice(apiErrorText(e, "Could not leave the team."));
    }
  }

  return (
    <CoachShell title="🏟️ Team Roster" requireSession={false} home>
      <TeamPicker teams={teams} value={teamId} onChange={setTeamId} />

      {status === "error" && <StatusMessage error>{error}</StatusMessage>}
      {status === "loading" && <StatusMessage>Loading team...</StatusMessage>}
      {status === "ready" && teams.length === 0 && <StatusMessage>You are not on a team yet. Create one or join one below.</StatusMessage>}

      {roster && status === "ready" && (
        <>
          <div style={{ color: COACH_COLOR, fontWeight: "700" }}>{roster.group.name}</div>
          <div style={{ color: "#999", fontSize: "12px", marginBottom: "12px" }}>{roster.members.length} member(s)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
            {roster.members.map((m) => (
              <div key={m.id} style={cardStyle}>
                <div style={{ fontWeight: "600" }}>{m.name}{m.is_you ? " (you)" : ""}</div>
                <div style={{ color: "#777", fontSize: "11px" }}>{m.workouts_7d} workout(s) in the last 7 days</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <button style={{ ...secondaryButton, flex: 1 }} onClick={() => navigate("/team-communications")}>Team Comms</button>
            <button style={{ ...secondaryButton, flex: 1 }} onClick={() => navigate("/team-performance")}>Performance</button>
          </div>
          <button style={{ ...secondaryButton, width: "100%", marginBottom: "16px" }} onClick={leaveTeam}>Leave Team</button>
        </>
      )}

      {notice && <div style={{ color: "#ccc", fontSize: "12px", textAlign: "center", marginBottom: "10px" }}>{notice}</div>}

      {discover.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: "16px" }}>
          <div style={{ color: COACH_COLOR, fontWeight: "700", marginBottom: "8px" }}>Join a team</div>
          {discover.map((g) => (
            <div key={g.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span>{g.name}</span>
              <button style={{ ...primaryButton(), padding: "6px 12px" }} onClick={() => joinTeam(g.id)}>Join</button>
            </div>
          ))}
        </div>
      )}

      {newName === null ? (
        <button style={{ ...secondaryButton, width: "100%" }} onClick={() => setNewName("")}>+ Create Team</button>
      ) : (
        <div style={cardStyle}>
          <input aria-label="Team name" placeholder="Team name" style={{ ...inputStyle, marginBottom: "8px" }} value={newName} onChange={(e) => setNewName(e.target.value)} />
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={{ ...primaryButton(), flex: 1 }} onClick={createTeam}>Create</button>
            <button style={{ ...secondaryButton, flex: 1 }} onClick={() => setNewName(null)}>Cancel</button>
          </div>
        </div>
      )}
    </CoachShell>
  );
}
