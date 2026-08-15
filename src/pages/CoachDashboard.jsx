import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../context/MenuContext.jsx";

export default function CoachDashboard() {
  const navigate = useNavigate();
  const { setMenuOpen } = useContext(MenuContext);
  const [teamData, setTeamData] = useState(null);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [activeTeamId, setActiveTeamId] = useState(localStorage.getItem("coachTeamId") || "");
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("coachToken");

  const COACH_COLOR = "#ec4899";
  const BLACK = "#000";
  const WHITE = "#fff";

  useEffect(() => {
    if (!token) {
      navigate("/coach-login");
      return;
    }

    async function loadTeam() {
      try {
        const teamQuery = activeTeamId ? `?team_id=${encodeURIComponent(activeTeamId)}` : "";
        const res = await fetch(`${import.meta.env.VITE_API_URL}/coach/team${teamQuery}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("coachToken");
          localStorage.removeItem("coachEmail");
          localStorage.removeItem("coachId");
          localStorage.removeItem("coachTeamId");
          navigate("/coach-login");
          return;
        }

        if (!res.ok) throw new Error("Unable to load team data.");

        const data = await res.json();
        const teams = data.available_teams || data.availableTeams || data.teams || [];
        setAvailableTeams(teams);
        if (!activeTeamId && (data.team_id || data.teamId)) {
          const initialTeamId = String(data.team_id || data.teamId);
          setActiveTeamId(initialTeamId);
          localStorage.setItem("coachTeamId", initialTeamId);
        }
        setTeamData(data);
      } catch (error) {
        setErrorMessage("Unable to load your team data.");
      }
    }

    loadTeam();
  }, [activeTeamId, navigate, token]);

  if (!token) return null;

  if (!teamData && !errorMessage) {
    return <StatusScreen message="Loading your team..." />;
  }

  if (errorMessage) {
    return <StatusScreen message={errorMessage} />;
  }

  const coachStats = teamData.stats || {};
  const recentClients = teamData.clients || [];

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: BLACK,
        padding: "16px 16px 90px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        overflowY: "auto",
        color: WHITE
      }}
    >
      <div style={{ width: "360px", maxWidth: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: COACH_COLOR, fontSize: "28px", fontWeight: "700" }}>🏆 Coach Hub</div>
        </div>

        {availableTeams.length > 1 && (
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="coach-team" style={{ display: "block", color: "#999", fontSize: "12px", marginBottom: "6px" }}>
              Active Team
            </label>
            <select
              id="coach-team"
              value={activeTeamId}
              onChange={(event) => {
                setTeamData(null);
                setErrorMessage("");
                setActiveTeamId(event.target.value);
                localStorage.setItem("coachTeamId", event.target.value);
              }}
              style={{ width: "100%", padding: "10px", background: "#111", color: WHITE, border: `1px solid ${COACH_COLOR}`, borderRadius: "6px" }}
            >
              {availableTeams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Coach Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          {[
            { label: "Clients", value: coachStats.totalClients, icon: "👥" },
            { label: "Programs", value: coachStats.activePrograms, icon: "📋" },
            { label: "Messages", value: coachStats.messagesUnread, icon: "💬" },
            { label: "Weekly Hrs", value: coachStats.weeklyHours, icon: "⏱️" }
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: "#111",
                border: `1px solid #2a2a2a`,
                borderRadius: "12px",
                padding: "14px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "18px", marginBottom: "6px" }}>{stat.icon}</div>
              <div style={{ fontSize: "20px", fontWeight: "700", color: COACH_COLOR, marginBottom: "4px" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "11px", color: "#999" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Clients */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: COACH_COLOR }}>
            Recent Clients
          </div>

          {recentClients.map((client) => (
            <div
              key={client.id}
              style={{
                background: "#111",
                borderRadius: "12px",
                padding: "12px 14px",
                marginBottom: "10px",
                border: `1px solid #2a2a2a`
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <div style={{ fontWeight: "600" }}>{client.name}</div>
                <div
                  style={{
                    fontSize: "11px",
                    color: client.status === "Active" ? "#6ee7b7" : "#fbbf24",
                    fontWeight: "600"
                  }}
                >
                  {client.status}
                </div>
              </div>

              <div style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}>{client.program}</div>

              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: "#222",
                  borderRadius: "999px",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    width: `${client.progress}%`,
                    height: "100%",
                    background: COACH_COLOR,
                    borderRadius: "999px"
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            style={{
              padding: "12px",
              background: COACH_COLOR,
              color: BLACK,
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            + Add Client
          </button>
          <button
            style={{
              padding: "12px",
              background: "#222",
              color: WHITE,
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Create Training Plan
          </button>
          <button
            style={{
              padding: "12px",
              background: "#222",
              color: WHITE,
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Message Clients
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "40px",
          background: BLACK,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 16px",
          boxSizing: "border-box",
          zIndex: 20
        }}
      >
        <div
          style={{
            color: COACH_COLOR,
            fontSize: "18px",
            textDecoration: "underline",
            cursor: "pointer"
          }}
          onClick={() => setMenuOpen(true)}
        >
          Return to Menu
        </div>
      </div>
    </div>
  );
}

function StatusScreen({ message }) {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#ec4899", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center" }}>
      {message}
    </div>
  );
}
