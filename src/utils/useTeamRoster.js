import { useCallback, useEffect, useState } from "react";
import { errorText } from "./coachSession.js";

// Loads the coach's teams and the roster of the selected team (real data from /staff/teams*).
export default function useTeamRoster(request) {
  const [teams, setTeams] = useState([]);
  const [teamId, setTeamIdState] = useState(localStorage.getItem("coachTeamId") || "");
  const [roster, setRoster] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const loadTeams = useCallback(async () => {
    try {
      const data = await request("/staff/teams");
      const list = data.teams || [];
      setTeams(list);
      setTeamIdState((current) => (list.some((t) => String(t.id) === String(current)) ? String(current) : list[0] ? String(list[0].id) : ""));
      if (list.length === 0) setStatus("ready");
    } catch (e) {
      setError(errorText(e, "Unable to load your teams."));
      setStatus("error");
    }
  }, [request]);

  const loadRoster = useCallback(async () => {
    if (!teamId) {
      setRoster(null);
      return;
    }
    setStatus("loading");
    try {
      setRoster(await request(`/staff/teams/${teamId}/roster`));
      setError("");
      setStatus("ready");
    } catch (e) {
      setError(errorText(e, "Unable to load the team roster."));
      setStatus("error");
    }
  }, [request, teamId]);

  useEffect(() => {
    const timer = setTimeout(() => loadTeams(), 0);
    return () => clearTimeout(timer);
  }, [loadTeams]);

  useEffect(() => {
    const timer = setTimeout(() => loadRoster(), 0);
    return () => clearTimeout(timer);
  }, [loadRoster]);

  const setTeamId = (id) => {
    localStorage.setItem("coachTeamId", String(id));
    setTeamIdState(String(id));
  };

  return { teams, teamId, setTeamId, roster, status, error, reloadTeams: loadTeams, reloadRoster: loadRoster };
}
