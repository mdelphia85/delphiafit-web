import CoachShell from "../components/CoachShell.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import TeamPicker from "../components/TeamPicker.jsx";
import { COACH_COLOR, cardStyle } from "../components/coachStyles.js";
import { useCoachRequest } from "../utils/coachSession.js";
import useTeamRoster from "../utils/useTeamRoster.js";

export default function TeamPerformance() {
  const request = useCoachRequest();
  const { teams, teamId, setTeamId, roster, status, error } = useTeamRoster(request);
  const clients = (roster && roster.clients) || [];
  const active = clients.filter((c) => (c.active_days_7d || 0) > 0).length;
  const workouts = clients.reduce((sum, c) => sum + (c.workouts_7d || 0), 0);

  return (
    <CoachShell title="📊 Team Performance">
      <TeamPicker teams={teams} value={teamId} onChange={setTeamId} />
      {status === "error" && <StatusMessage error>{error}</StatusMessage>}
      {status === "loading" && <StatusMessage>Loading team...</StatusMessage>}
      {status === "ready" && teams.length === 0 && <StatusMessage>You have no teams yet. Create one in Team Operations.</StatusMessage>}
      {roster && status === "ready" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
            {[
              { label: "Athletes", value: clients.length },
              { label: "Active this week", value: active },
              { label: "Workouts (7d)", value: workouts }
            ].map((s) => (
              <div key={s.label} style={{ ...cardStyle, textAlign: "center", padding: "10px" }}>
                <div style={{ color: COACH_COLOR, fontSize: "20px", fontWeight: "700" }}>{s.value}</div>
                <div style={{ color: "#999", fontSize: "11px" }}>{s.label}</div>
              </div>
            ))}
          </div>
          {clients.length === 0 ? (
            <StatusMessage>No athletes on this team yet.</StatusMessage>
          ) : (
            clients.map((c) => (
              <div key={c.id} style={{ ...cardStyle, marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span>{c.name}</span>
                  <span style={{ color: "#999" }}>{c.workouts_7d || 0} workout(s)</span>
                </div>
                <div style={{ background: "#222", height: "6px", borderRadius: "4px", marginTop: "6px", overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(100, ((c.active_days_7d || 0) / 7) * 100)}%`, height: "100%", background: COACH_COLOR }} />
                </div>
                <div style={{ color: "#777", fontSize: "11px", marginTop: "4px" }}>{c.active_days_7d || 0} of 7 days active</div>
              </div>
            ))
          )}
        </>
      )}
    </CoachShell>
  );
}
