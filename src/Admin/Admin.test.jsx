import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { adminFetch, AdminApiError, parseUtc } from "./adminApi.js";
import AdminDashboard from "./Dashboard.jsx";
import AdminUsers from "./Users.jsx";
import AdminLogin from "./Login.jsx";
import AdminAnnouncements from "./Announcements.jsx";

const realLocation = window.location;

function json(data, status = 200) {
  return { ok: status < 400, status, json: async () => data };
}

// Routes fetch calls by "METHOD path" and returns canned JSON.
function mockApi(routes) {
  globalThis.fetch = vi.fn(async (url, opts = {}) => {
    const path = String(url).replace(/^https?:\/\/[^/]+/, "").replace(/^undefined/, "");
    const key = `${opts.method || "GET"} ${path}`;
    if (key.startsWith("GET /admin/me")) return json({ id: 1, is_admin: true });
    const handler = routes[key];
    if (!handler) throw new Error(`Unmocked ${key}`);
    return typeof handler === "function" ? handler(opts) : json(handler);
  });
}

const wrap = (ui) => <MemoryRouter>{ui}</MemoryRouter>;

beforeEach(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { pathname: "/admin/dashboard", assign: vi.fn() },
  });
});

afterEach(() => {
  Object.defineProperty(window, "location", { configurable: true, value: realLocation });
});

describe("adminFetch", () => {
  it("sends the admin bearer token and parses JSON", async () => {
    localStorage.setItem("adminToken", "abc");
    mockApi({ "GET /admin/dashboard": { total_users: 3 } });
    expect(await adminFetch("/admin/dashboard")).toEqual({ total_users: 3 });
    expect(globalThis.fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer abc");
  });

  it("clears the session and redirects on 401/403", async () => {
    localStorage.setItem("adminToken", "abc");
    mockApi({ "GET /admin/dashboard": () => json({ detail: "Admin access required" }, 403) });
    await expect(adminFetch("/admin/dashboard")).rejects.toBeInstanceOf(AdminApiError);
    expect(localStorage.getItem("adminToken")).toBeNull();
    expect(window.location.assign).toHaveBeenCalledWith("/admin/login");
  });

  it("redirects without calling the API when there is no token", async () => {
    globalThis.fetch = vi.fn();
    await expect(adminFetch("/admin/users")).rejects.toMatchObject({ status: 401 });
    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(window.location.assign).toHaveBeenCalledWith("/admin/login");
  });

  it("surfaces backend error detail", async () => {
    localStorage.setItem("adminToken", "abc");
    mockApi({ "PATCH /admin/users/1/suspend": () => json({ detail: "You cannot suspend your own account" }, 400) });
    await expect(adminFetch("/admin/users/1/suspend", { method: "PATCH" })).rejects.toThrow("You cannot suspend your own account");
  });

  it("treats naive API timestamps as UTC", () => {
    expect(parseUtc("2026-01-01T00:00:00").toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(parseUtc(null)).toBeNull();
  });
});

describe("Admin pages", () => {
  beforeEach(() => localStorage.setItem("adminToken", "abc"));

  it("dashboard shows real counts, including honest zeros and an empty action list", async () => {
    mockApi({
      "GET /admin/dashboard": { total_users: 0, new_users_last_7_days: 0, unread_messages: 0, total_logs: 0, active_announcements: 0, suspended_users: 0, logins_last_7_days: 0 },
      "GET /admin/system/health": { api_status: "ok", database_status: "ok", uptime: "0h 1m", failed_admin_actions_24h: 0 },
      "GET /admin/actions/recent": { actions: [] },
    });
    render(wrap(<AdminDashboard />));
    expect(await screen.findByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("No recent admin actions.")).toBeInTheDocument();
    expect(screen.queryByText(/errors \(24h\)/i)).toBeNull();
  });

  it("users page lists, searches, and suspends via the API", async () => {
    const alice = { id: 2, name: "Alice", email: "alice@example.com", is_admin: false, is_suspended: false, created_at: "2026-01-01T00:00:00", last_login: null };
    mockApi({
      "GET /admin/users": [alice],
      "GET /admin/users?q=ali": [alice],
      "PATCH /admin/users/2/suspend": () => json({ status: "success", user: { ...alice, is_suspended: true } }),
    });
    render(wrap(<AdminUsers />));
    expect(await screen.findByText("alice@example.com")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Search users"), { target: { value: "ali" } });
    await waitFor(() => expect(globalThis.fetch.mock.calls.some(([u]) => String(u).endsWith("/admin/users?q=ali"))).toBe(true));

    fireEvent.click(await screen.findByText("Suspend"));
    expect(await screen.findByText("Unsuspend")).toBeInTheDocument();
    const call = globalThis.fetch.mock.calls.find(([, o]) => o?.method === "PATCH");
    expect(JSON.parse(call[1].body)).toEqual({ suspended: true });
  });

  it("announcements page creates a draft through the API", async () => {
    mockApi({
      "GET /admin/announcements": [],
      "POST /admin/announcements": (opts) => json({ id: 9, ...JSON.parse(opts.body), published: false, body: "Hello", created_at: "2026-01-01T00:00:00" }),
    });
    render(wrap(<AdminAnnouncements />));
    expect(await screen.findByText("No announcements yet.")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Announcement Title"), { target: { value: "Hi" } });
    fireEvent.change(screen.getByLabelText("Announcement Body"), { target: { value: "Hello" } });
    fireEvent.click(screen.getByLabelText(/Publish immediately/));
    fireEvent.click(screen.getByRole("button", { name: "Save Draft" }));
    expect(await screen.findByText("Draft")).toBeInTheDocument();
    const post = globalThis.fetch.mock.calls.find(([, o]) => o?.method === "POST");
    expect(JSON.parse(post[1].body)).toEqual({ title: "Hi", body: "Hello", published: false });
  });

  it("login stores the admin token and shows an error for bad credentials", async () => {
    localStorage.clear();
    globalThis.fetch = vi.fn().mockResolvedValueOnce(json({ detail: "Invalid credentials" }, 401));
    render(wrap(<AdminLogin />));
    fireEvent.change(screen.getByLabelText("Admin Email"), { target: { value: "a@example.com" } });
    fireEvent.change(screen.getByLabelText("Admin Password"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid admin credentials");
    expect(localStorage.getItem("adminToken")).toBeNull();

    globalThis.fetch.mockResolvedValueOnce(json({ access_token: "tok", token_type: "bearer" }));
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    await waitFor(() => expect(localStorage.getItem("adminToken")).toBe("tok"));
  });
});
