import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "./api.js";

export function apiErrorText(error, fallback) {
  return (error && (error.message || error.detail)) || fallback;
}

// A "team" for a regular user is a social group they belong to; the roster endpoint adds member activity.
export default function useMyTeams() {
  const [teams, setTeams] = useState([]);
  const [teamId, setTeamId] = useState("");
  const [roster, setRoster] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const reloadTeams = useCallback(async (preferId) => {
    try {
      const list = await apiRequest("/social/groups");
      setTeams(list);
      setTeamId((current) => String(preferId || (list.some((t) => String(t.id) === String(current)) ? current : list[0]?.id || "")));
      if (!list.length) setStatus("ready");
    } catch (e) {
      setError(apiErrorText(e, "Could not load your teams."));
      setStatus("error");
    }
  }, []);

  const reloadRoster = useCallback(async () => {
    if (!teamId) {
      setRoster(null);
      return;
    }
    setStatus("loading");
    try {
      setRoster(await apiRequest(`/social/groups/${teamId}/roster`));
      setStatus("ready");
    } catch (e) {
      setError(apiErrorText(e, "Could not load the team."));
      setStatus("error");
    }
  }, [teamId]);

  useEffect(() => {
    reloadTeams();
  }, [reloadTeams]);

  useEffect(() => {
    reloadRoster();
  }, [reloadRoster]);

  return { teams, teamId, setTeamId, roster, status, error, reloadTeams, reloadRoster };
}
