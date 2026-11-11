import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoachShell from "../components/CoachShell.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { COACH_COLOR, cardStyle, primaryButton, secondaryButton } from "../components/coachStyles.js";
import { ApiError } from "../utils/api.js";
import { clearCoachSession, errorText, useCoachRequest } from "../utils/coachSession.js";

export default function CoachDashboard() {
  const navigate = useNavigate();
  const request = useCoachRequest();
  const [teamData, setTeamData] = useState(null);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [activeTeamId, setActiveTeamId] = useState(localStorage.getItem("coachTeamId") || "");
  const [errorMessage, setErrorMessage] = useState("");

  const loadTeam = useCallback(
    async (teamId) => {
      // The second attempt drops a remembered team the coach no longer belongs to.
      const attempts = teamId ? [teamId, ""] : [""];
      for (const id of attempts) {
        try {
          const query = id ? `?team_id=${encodeURIComponent(id)}` : "";
          const data = await request(`/coach/team${query}`);
          setAvailableTeams(data.available_teams || data.availableTeams || data.teams || []);
          const resolved = data.team_id || data.teamId;
          if (resolved) {
            localStorage.setItem("coachTeamId", String(resolved));
            setActiveTeamId(String(resolved));
          } else {
            localStorage.removeItem("coachTeamId");
            setActiveTeamId("");
          }
          setErrorMessage("");
          setTeamData(data);
          return;
        } catch (error) {
          if (error instanceof ApiError && error.status === 401) return;
          const retryable = error instanceof ApiError && error.status === 403 && id;
          if (!retryable) {
            setErrorMessage(errorText(error, "Unable to load your team data."));
            return;
          }
        }
      }
    },
    [request]
  );

  useEffect(() => {
    const timer = setTimeout(() => loadTeam(localStorage.getItem("coachTeamId") || ""), 0);
    return () => clearTimeout(timer);
  }, [loadTeam]);

  function signOut() {
    clearCoachSession();
    navigate("/coach-login", { replace: true });
  }

  const stats = (teamData && teamData.stats) || {};
  const clients = (teamData && teamData.clients) || [];

  const actions = [
    { label: "Add Client", icon: "➕", to: "/coach/client-management", primary: true },
    { label: "Create Training Plan", icon: "📋", to: "/plan-builder" },
    { label: "Message Clients", icon: "💬", to: "/coach-messaging" },
    { label: "Team Operations", icon: "🏟️", to: "/team-operations" },
    { label: "Drill Library", icon: "🎯", to: "/drill-library" }
  ];

  return (
    <CoachShell title="🏆 Coach Hub" home>
      {errorMessage && (
        <div>
          <StatusMessage error>{errorMessage}</StatusMessage>
          <button style={{ ...secondaryButton, width: "100%" }} onClick={() => { setErrorMessage(""); loadTeam(activeTeamId); }}>
            Retry
          </button>
        </div>
      )}
      {!teamData && !errorMessage && <StatusMessage>Loading your team...</StatusMessage>}

      {teamData && (
        <>
          {availableTeams.length > 1 && (
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="coach-team" style={{ display: "block", color: "#999", fontSize: "12px", marginBottom: "6px" }}>
                Active Team
              </label>
              <select
                id="coach-team"
                value={activeTeamId}
                onChange={(event) => {
                  localStorage.setItem("coachTeamId", event.target.value);
                  setTeamData(null);
                  loadTeam(event.target.value);
                }}
                style={{ width: "100%", padding: "10px", background: "#111", color: "#fff", border: `1px solid ${COACH_COLOR}`, borderRadius: "6px" }}
              >
                {availableTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
            {[
              { label: "Clients", value: stats.totalClients, icon: "👥" },
              { label: "Programs", value: stats.activePrograms, icon: "📋" },
              { label: "Unread Messages", value: stats.messagesUnread, icon: "💬" },
              { label: "Weekly Hrs", value: stats.weeklyHours, icon: "⏱️" }
            ].map((stat) => (
              <div key={stat.label} style={{ ...cardStyle, textAlign: "center" }}>
                <div style={{ fontSize: "20px" }}>{stat.icon}</div>
                <div style={{ color: COACH_COLOR, fontSize: "22px", fontWeight: "700" }}>{stat.value ?? 0}</div>
                <div style={{ color: "#999", fontSize: "11px" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
            {actions.map((action) => (
              <button
                key={action.label}
                style={{ ...(action.primary ? primaryButton() : secondaryButton), textAlign: "left" }}
                onClick={() => navigate(action.to)}
              >
                {action.icon} {action.label}
              </button>
            ))}
          </div>

          <div style={{ color: COACH_COLOR, fontWeight: "700", marginBottom: "10px" }}>Clients</div>
          {clients.length === 0 ? (
            <StatusMessage>No clients yet. Use “Add Client” to send an invitation.</StatusMessage>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {clients.map((client) => (
                <div key={client.id} style={cardStyle}>
                  <div style={{ fontWeight: "600" }}>{client.name}</div>
                  <div style={{ color: "#999", fontSize: "12px", margin: "2px 0 8px" }}>{client.program}</div>
                  <div style={{ background: "#222", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, client.progress || 0)}%`, height: "100%", background: COACH_COLOR }} />
                  </div>
                  <div style={{ color: "#777", fontSize: "11px", marginTop: "4px" }}>
                    {client.active_days_7d || 0} active day(s) this week · {client.workouts_7d || 0} workout(s)
                  </div>
                </div>
              ))}
            </div>
          )}

          <button style={{ ...secondaryButton, width: "100%", marginTop: "24px" }} onClick={signOut}>
            Sign Out of Coach Hub
          </button>
        </>
      )}
    </CoachShell>
  );
}
