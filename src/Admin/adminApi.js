import { API } from "../config/api";

export const ADMIN_TOKEN_KEY = "adminToken";

export class AdminApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function redirectToLogin() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  if (window.location.pathname !== "/admin/login") {
    window.location.assign("/admin/login");
  }
}

// Authenticated JSON request against the admin API. 401/403 clear the admin
// session and send the user back to the admin login screen.
export async function adminFetch(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) {
    redirectToLogin();
    throw new AdminApiError(401, "Not signed in");
  }

  const headers = { Authorization: `Bearer ${token}` };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 || res.status === 403) {
    redirectToLogin();
    throw new AdminApiError(res.status, "Admin session expired or not authorized");
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const detail = data && typeof data.detail === "string" ? data.detail : `Request failed (${res.status})`;
    throw new AdminApiError(res.status, detail);
  }
  return data;
}

// The API returns naive UTC timestamps; treat them as UTC when displaying.
export function parseUtc(value) {
  if (!value) return null;
  const text = String(value);
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(text);
  const date = new Date(hasZone ? text : `${text}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTime(value) {
  const date = parseUtc(value);
  return date ? date.toLocaleString() : "—";
}

export function formatDate(value) {
  const date = parseUtc(value);
  return date ? date.toLocaleDateString() : "—";
}
