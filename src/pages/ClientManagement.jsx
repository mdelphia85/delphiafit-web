import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoachShell from "../components/CoachShell.jsx";
import StatusMessage from "../components/StatusMessage.jsx";
import { COACH_COLOR, cardStyle, dangerButton, inputStyle, primaryButton, secondaryButton } from "../components/coachStyles.js";
import { errorText, useCoachRequest } from "../utils/coachSession.js";

const small = { ...secondaryButton, padding: "8px 10px", fontSize: "12px" };

export default function ClientManagement() {
  const navigate = useNavigate();
  const request = useCoachRequest();
  const [clients, setClients] = useState([]);
  const [plans, setPlans] = useState([]);
  const [teams, setTeams] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [panel, setPanel] = useState(null); // { type: "progress" | "assign" | "team" | "remove", client }
  const [progress, setProgress] = useState(null);
  const [panelError, setPanelError] = useState("");
  const [planId, setPlanId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [clientData, planData, teamData, inviteData] = await Promise.all([
        request("/staff/clients"),
        request("/staff/plans"),
        request("/staff/teams"),
        request("/staff/invitations")
      ]);
      setClients(clientData.clients || []);
      setPlans(planData.plans || []);
      setTeams(teamData.teams || []);
      setInvitations((inviteData.invitations || []).filter((i) => i.role === "client" && !i.accepted));
      setStatus("ready");
    } catch (error) {
      setErrorMessage(errorText(error, "Unable to load clients."));
      setStatus("error");
    }
  }, [request]);

  useEffect(() => {
    const timer = setTimeout(() => load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

  async function invite() {
    setNotice("");
    setInviteLink("");
    if (!email.includes("@")) {
      setNotice("Enter a valid client email.");
      return;
    }
    setBusy(true);
    try {
      const data = await request("/staff/clients/invite", { method: "POST", body: { email: email.trim() } });
      setEmail("");
      setNotice(data.delivery_configured ? "Invitation emailed." : "Invitation created. Email delivery is not configured, so share this link with your client:");
      if (!data.delivery_configured) setInviteLink(`${window.location.origin}/invite?token=${data.invite_token}`);
      await load();
    } catch (error) {
      setNotice(errorText(error, "Invitation failed."));
    } finally {
      setBusy(false);
    }
  }

  async function revoke(id) {
    try {
      await request(`/staff/invitations/${id}`, { method: "DELETE" });
      setInvitations((list) => list.filter((i) => i.id !== id));
    } catch (error) {
      setNotice(errorText(error, "Could not revoke invitation."));
    }
  }

  function openPanel(type, client) {
    setPanel({ type, client });
    setPanelError("");
    setProgress(null);
    setPlanId("");
    setTeamId(client.team_id ? String(client.team_id) : "");
    if (type === "progress") {
      request(`/staff/clients/${client.id}/progress`)
        .then(setProgress)
        .catch((error) => setPanelError(errorText(error, "Unable to load progress.")));
    }
  }

  async function submitPanel() {
    const { type, client } = panel;
    setBusy(true);
    setPanelError("");
    try {
      if (type === "assign") {
        if (!planId) throw new Error("Choose a plan first.");
        await request(`/staff/plans/${planId}/assignments`, { method: "POST", body: { client_id: client.id } });
        setNotice(`Plan assigned to ${client.name}.`);
      } else if (type === "team") {
        await request(`/staff/clients/${client.id}/team`, { method: "POST", body: { team_id: teamId ? Number(teamId) : null } });
        setNotice(`Team updated for ${client.name}.`);
      } else if (type === "remove") {
        await request(`/staff/clients/${client.id}`, { method: "DELETE" });
        setNotice(`${client.name} was removed.`);
      }
      setPanel(null);
      await load();
    } catch (error) {
      setPanelError(errorText(error, "Action failed."));
    } finally {
      setBusy(false);
    }
  }

  const clientButtons = (client) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
      <button style={small} onClick={() => openPanel("progress", client)}>View Progress</button>
      <button style={small} onClick={() => openPanel("assign", client)}>Assign Program</button>
      <button style={small} onClick={() => navigate(`/coach-messaging?client=${client.id}`)}>Message</button>
      {teams.length > 0 && <button style={small} onClick={() => openPanel("team", client)}>Team</button>}
      <button style={{ ...small, ...dangerButton, padding: "8px 10px", fontSize: "12px" }} onClick={() => openPanel("remove", client)}>
        Remove Client
      </button>
    </div>
  );

  return (
    <CoachShell title="👥 My Clients">
      <div style={{ ...cardStyle, marginBottom: "16px" }}>
        <div style={{ color: COACH_COLOR, fontWeight: "700", marginBottom: "8px" }}>Invite a client</div>
        <input
          type="email"
          aria-label="Client email"
          placeholder="client@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={{ ...inputStyle, marginBottom: "8px" }}
        />
        <button style={{ ...primaryButton(busy), width: "100%" }} disabled={busy} onClick={invite}>
          Send Invitation
        </button>
        {notice && <div style={{ color: "#ccc", fontSize: "12px", marginTop: "8px" }}>{notice}</div>}
        {inviteLink && <input readOnly aria-label="Invitation link" value={inviteLink} onFocus={(e) => e.target.select()} style={{ ...inputStyle, marginTop: "6px" }} />}
      </div>

      {status === "loading" && <StatusMessage>Loading clients...</StatusMessage>}
      {status === "error" && (
        <div>
          <StatusMessage error>{errorMessage}</StatusMessage>
      <button style={{ ...secondaryButton, width: "100%" }} onClick={() => { setStatus("loading"); load(); }}>Retry</button>
        </div>
      )}

      {status === "ready" && (
        <>
          {clients.length === 0 ? (
            <StatusMessage>No clients yet. Invite your first client above.</StatusMessage>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {clients.map((client) => (
                <div key={client.id} style={cardStyle}>
                  <div style={{ fontWeight: "600" }}>{client.name}</div>
                  <div style={{ color: "#999", fontSize: "12px" }}>{client.email}</div>
                  <div style={{ color: "#777", fontSize: "11px" }}>
                    {client.status}
                    {client.joinDate ? ` · joined ${client.joinDate}` : ""}
                    {client.team_id ? ` · ${(teams.find((t) => t.id === client.team_id) || {}).name || "team"}` : ""}
                  </div>
                  {clientButtons(client)}
                  {panel && panel.client.id === client.id && (
                    <div style={{ marginTop: "12px", borderTop: "1px solid #2a2a2a", paddingTop: "12px" }}>
                      {panelError && <StatusMessage error>{panelError}</StatusMessage>}
                      {panel.type === "progress" && <ProgressView progress={progress} error={panelError} />}
                      {panel.type === "assign" && (
                        plans.length === 0 ? (
                          <StatusMessage>No plans yet. <span style={{ color: COACH_COLOR, cursor: "pointer", textDecoration: "underline" }} onClick={() => navigate("/plan-builder")}>Create one in Plan Builder.</span></StatusMessage>
                        ) : (
                          <select aria-label="Plan" value={planId} onChange={(e) => setPlanId(e.target.value)} style={inputStyle}>
                            <option value="">Choose a plan...</option>
                            {plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
                          </select>
                        )
                      )}
                      {panel.type === "team" && (
                        <select aria-label="Team" value={teamId} onChange={(e) => setTeamId(e.target.value)} style={inputStyle}>
                          <option value="">No team</option>
                          {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
                        </select>
                      )}
                      {panel.type === "remove" && (
                        <div style={{ color: "#f87171", fontSize: "13px", marginBottom: "8px" }}>
                          Remove {client.name} from your clients? They will lose access to your plans and messages.
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                        {panel.type !== "progress" && (
                          <button style={panel.type === "remove" ? { ...dangerButton, flex: 1 } : { ...primaryButton(busy), flex: 1 }} disabled={busy} onClick={submitPanel}>
                            {panel.type === "remove" ? "Confirm Remove" : panel.type === "assign" ? "Assign" : "Save"}
                          </button>
                        )}
                        <button style={{ ...secondaryButton, flex: 1 }} onClick={() => setPanel(null)}>
                          {panel.type === "progress" ? "Close" : "Cancel"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {invitations.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <div style={{ color: COACH_COLOR, fontWeight: "700", marginBottom: "8px" }}>Pending invitations</div>
              {invitations.map((invite) => (
                <div key={invite.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ fontSize: "12px" }}>
                    {invite.email}
                    {invite.expired && <span style={{ color: "#f87171" }}> (expired)</span>}
                  </div>
                  <button style={small} onClick={() => revoke(invite.id)}>Revoke</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </CoachShell>
  );
}

function ProgressView({ progress, error }) {
  if (error) return null;
  if (!progress) return <StatusMessage>Loading progress...</StatusMessage>;
  const { summary, weights, workouts, daily_logs: logs, plans, has_account: hasAccount } = progress;
  const row = { display: "flex", justifyContent: "space-between", fontSize: "12px", padding: "3px 0", color: "#ccc" };
  const day = (value) => (value ? String(value).slice(0, 10) : "—");
  return (
    <div>
      {!hasAccount && <StatusMessage>This client has not created an account yet, so there is no activity to show.</StatusMessage>}
      <div style={row}><span>Latest weight</span><span>{summary.latest_weight_kg != null ? `${summary.latest_weight_kg} kg` : "—"}</span></div>
      <div style={row}><span>Weight change</span><span>{summary.weight_change_kg != null ? `${summary.weight_change_kg} kg` : "—"}</span></div>
      <div style={row}><span>Workouts (7d / 30d)</span><span>{summary.workouts_7d} / {summary.workouts_30d}</span></div>
      <div style={row}><span>Minutes (30d)</span><span>{summary.minutes_30d}</span></div>
      <div style={row}><span>Last activity</span><span>{day(summary.last_activity)}</span></div>

      <div style={{ color: COACH_COLOR, fontSize: "12px", margin: "10px 0 4px" }}>Assigned plans</div>
      {plans.length === 0 ? <div style={{ color: "#777", fontSize: "12px" }}>None</div> : plans.map((p) => <div key={p.assignment_id} style={row}><span>{p.name}</span></div>)}

      <div style={{ color: COACH_COLOR, fontSize: "12px", margin: "10px 0 4px" }}>Recent workouts</div>
      {workouts.length === 0 ? <div style={{ color: "#777", fontSize: "12px" }}>No workouts logged</div> : workouts.slice(0, 5).map((w) => <div key={w.id} style={row}><span>{day(w.date)} · {w.name}</span><span>{w.duration_minutes ?? "—"} min</span></div>)}

      <div style={{ color: COACH_COLOR, fontSize: "12px", margin: "10px 0 4px" }}>Weight log</div>
      {weights.length === 0 ? <div style={{ color: "#777", fontSize: "12px" }}>No weigh-ins</div> : weights.slice(-5).map((w) => <div key={w.date} style={row}><span>{day(w.date)}</span><span>{w.weight_kg} kg</span></div>)}

      <div style={{ color: COACH_COLOR, fontSize: "12px", margin: "10px 0 4px" }}>Daily logs</div>
      {logs.length === 0 ? <div style={{ color: "#777", fontSize: "12px" }}>No daily logs</div> : logs.slice(0, 5).map((d) => <div key={d.date} style={row}><span>{day(d.date)}</span><span>{d.calories ?? 0} kcal · {d.protein ?? 0} g protein</span></div>)}
    </div>
  );
}
