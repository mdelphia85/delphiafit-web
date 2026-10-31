import { API } from "../config/api.js";

// Which localStorage key holds the bearer token for each session type.
export const TOKEN_KEYS = { user: "token", coach: "coachToken", admin: "adminToken" };

export class ApiError extends Error {
  constructor(message, status, detail) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

// Authenticated JSON request. `as` selects the session: "user" (default), "coach" or "admin".
// Throws ApiError on non-2xx; never redirects (callers decide what to do on 401/403).
export async function apiRequest(path, { as = "user", method = "GET", body, headers = {} } = {}) {
  const token = localStorage.getItem(TOKEN_KEYS[as]);
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...headers
    },
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const detail = data && data.detail;
    const message =
      (detail && (detail.message || (typeof detail === "string" ? detail : null))) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status, detail);
  }
  return data;
}

export const hasSession = (as = "user") => Boolean(localStorage.getItem(TOKEN_KEYS[as]));


export function clearUserSession() {
  ["token", "loggedIn", "userEmail", "userSettings", "username"].forEach((key) => localStorage.removeItem(key));
}
