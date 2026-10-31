import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, apiRequest } from "./api.js";

export const COACH_SESSION_KEYS = ["coachToken", "coachEmail", "coachId", "coachTeamId"];

export function clearCoachSession() {
  COACH_SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
}

// Authenticated coach request. Only an expired/invalid coach token (401) ends the session;
// a 403 means "not allowed to do that" and is surfaced to the caller instead of logging out.
export function useCoachRequest() {
  const navigate = useNavigate();
  return useCallback(
    async (path, options = {}) => {
      if (!localStorage.getItem("coachToken")) {
        navigate("/coach-login", { replace: true });
        throw new ApiError("Please sign in to Coach Hub.", 401);
      }
      try {
        return await apiRequest(path, { ...options, as: "coach" });
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          clearCoachSession();
          navigate("/coach-login", { replace: true });
        }
        throw error;
      }
    },
    [navigate]
  );
}

export function errorText(error, fallback) {
  return (error && error.message) || fallback;
}
