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
// Throws ApiError on non-2xx; rejected user sessions are cleared and sent to sign-in.
export async function apiRequest(path, { as = "user", method = "GET", body, headers = {}, timeoutMs } = {}) {
  const token = localStorage.getItem(TOKEN_KEYS[as]);
  const request = {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...headers
    },
    body: body !== undefined ? JSON.stringify(body) : undefined
  };
  let timeoutId;
  let controller;
  if (timeoutMs > 0) {
    controller = new AbortController();
    request.signal = controller.signal;
    timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  }

  try {
    const res = await fetch(`${API}${path}`, request);

    let data;
    try {
      data = await res.json();
    } catch (error) {
      if (controller?.signal.aborted) throw error;
      data = null;
    }

    if (!res.ok) {
      if (res.status === 401 && as === "user" && token && !path.startsWith("/auth/login")) {
        // The stored token was rejected (expired): drop it and send the user to sign in again.
        clearUserSession();
        if (typeof window !== "undefined" && window.location.pathname !== "/login") window.location.assign("/login");
      }
      const detail = data && data.detail;
      const message =
        (detail && (detail.message || (typeof detail === "string" ? detail : null))) ||
        `Request failed (${res.status})`;
      throw new ApiError(message, res.status, detail);
    }
    return data;
  } catch (error) {
    if (controller?.signal.aborted) throw new ApiError("Request timed out.", 0);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const hasSession = (as = "user") => Boolean(localStorage.getItem(TOKEN_KEYS[as]));


export function clearUserSession() {
  ["token", "loggedIn", "userEmail", "userSettings", "username"].forEach((key) => localStorage.removeItem(key));
}
