import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CoachShell from "../components/CoachShell.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import TeamPicker from "../components/TeamPicker.jsx";
import { COACH_COLOR, cardStyle, inputStyle, primaryButton, secondaryButton } from "../components/coachStyles.js";
import { errorText, useCoachRequest } from "../utils/coachSession.js";
import useTeamRoster from "../utils/useTeamRoster.js";

export default function TeamOperations() {
  const navigate = useNavigate();
  const request = useCoachRequest();
  const { teams, teamId, setTeamId, roster, status, error, reloadTeams } = useTeamRoster(request);
  const [newTeam, setNewTeam] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("assistant_coach");
  const [notice, setNotice] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  async function createTeam() {
    if (!newTeam.name || newTeam.name.trim().length < 2) {
      setNotice("Give the team a name.");
      return;
    }
    try {
      const team = await request("/staff/teams", { method: "POST", body: { name: newTeam.name.trim(), sport: newTeam.sport || null } });
      setNewTeam(null);
      setNotice(`Team "${team.name}" created.`);
      setTeamId(team.id);
      await reloadTeams();
    } catch (e) {
      setNotice(errorText(e, "Could not create the team."));
    }
  }

  async function inviteCoach() {
    setInviteLink("");
    if (!inviteEmail.includes("@")) {
      setNotice("Enter a valid coach email.");
      return;
    }
    try {
      const data = await request(`/staff/teams/${teamId}/coach-invitations`, { method: "POST", body: { email: inviteEmail.trim(), role: inviteRole } });
      setInviteEmail("");
      setNotice(data.delivery_configured ? "Invitation emailed." : "Invitation created. Email delivery is not configured, so share this link:");
      if (!data.delivery_configured) setInviteLink(`${window.location.origin}/invite?token=${data.invite_token}`);
    } catch (e) {
      setNotice(errorText(e, "Could not send the invitation."));
    }
  }

  const team = roster && roster.team;
  const isOwner = team && team.role === "owner";

  return (
    <CoachShell title="🏟️ Team Operations">
      <TeamPicker teams={teams} value={teamId} onChange={setTeamId} />

      {status === "error" && <StatusMessage error>{error}</StatusMessage>}
      {status === "loading" && <StatusMessage>Loading team...</StatusMessage>}
      {status === "ready" && teams.length === 0 && <StatusMessage>You have no teams yet. Create one below.</StatusMessage>}

      {team && status === "ready" && (
        <>
          <div style={{ color: COACH_COLOR, fontWeight: "700" }}>{team.name}</div>
          <div style={{ color: "#999", fontSize: "12px", marginBottom: "12px" }}>
            {[team.sport, team.level, team.season].filter(Boolean).join(" · ") || "Team"} · {team.client_count} athlete(s)
          </div>
          {roster.clients.length === 0 ? (
            <StatusMessage>No athletes on this team. Assign clients from My Clients.</StatusMessage>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {roster.clients.map((c) => (
                <div key={c.id} style={cardStyle}>
                  <div style={{ fontWeight: "600" }}>{c.name}</div>
                  <div style={{ color: "#999", fontSize: "12px" }}>{c.email}{c.position ? ` · ${c.position}` : ""}</div>
                  <div style={{ color: "#777", fontSize: "11px" }}>{c.workouts_7d ?? 0} workout(s) in the last 7 days</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <button style={{ ...secondaryButton, flex: 1 }} onClick={() => navigate("/team-communications")}>Team Comms</button>
            <button style={{ ...secondaryButton, flex: 1 }} onClick={() => navigate("/team-performance")}>Performance</button>
          </div>

          {isOwner && (
            <div style={{ ...cardStyle, marginBottom: "16px" }}>
              <div style={{ color: COACH_COLOR, fontWeight: "700", marginBottom: "8px" }}>Invite staff</div>
              <input aria-label="Staff email" type="email" placeholder="coach@email.com" style={{ ...inputStyle, marginBottom: "8px" }} value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
              <select aria-label="Staff role" style={{ ...inputStyle, marginBottom: "8px" }} value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                <option value="assistant_coach">Assistant coach</option>
                <option value="analyst">Analyst</option>
                <option value="recruiter">Recruiter</option>
              </select>
              <button style={{ ...primaryButton(), width: "100%" }} onClick={inviteCoach}>Send Invitation</button>
              {inviteLink && <input readOnly aria-label="Invitation link" value={inviteLink} onFocus={(e) => e.target.select()} style={{ ...inputStyle, marginTop: "6px" }} />}
            </div>
          )}
        </>
      )}

      {notice && <div style={{ color: "#ccc", fontSize: "12px", textAlign: "center", marginBottom: "10px" }}>{notice}</div>}

      {!newTeam ? (
        <button style={{ ...secondaryButton, width: "100%" }} onClick={() => setNewTeam({ name: "", sport: "" })}>+ Create Team</button>
      ) : (
        <div style={cardStyle}>
          <input aria-label="Team name" placeholder="Team name" style={{ ...inputStyle, marginBottom: "8px" }} value={newTeam.name} onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })} />
          <input aria-label="Sport" placeholder="Sport (optional)" style={{ ...inputStyle, marginBottom: "8px" }} value={newTeam.sport} onChange={(e) => setNewTeam({ ...newTeam, sport: e.target.value })} />
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={{ ...primaryButton(), flex: 1 }} onClick={createTeam}>Create</button>
            <button style={{ ...secondaryButton, flex: 1 }} onClick={() => setNewTeam(null)}>Cancel</button>
          </div>
        </div>
      )}
    </CoachShell>
  );
}
