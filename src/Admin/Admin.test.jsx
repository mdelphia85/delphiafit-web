import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { adminFetch, AdminApiError, parseUtc } from "./adminApi.js";
import AdminDashboard from "./Dashboard.jsx";
import AdminUsers from "./Users.jsx";
import AdminUserDetail from "./AdminUserDetail.jsx";
import AdminLogin from "./Login.jsx";
import AdminAnnouncements from "./Announcements.jsx";
import AdminLayout from "./Admin.jsx";
import { API } from "../config/api.js";

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

function CurrentPath() {
  const location = useLocation();
  return <div data-testid="current-path">{location.pathname}</div>;
}

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

  it("logs in through the configured API and reaches a verified dashboard", async () => {
    localStorage.removeItem("adminToken");
    mockApi({
      "POST /admin/login": () => json({ access_token: "new-admin-token" }),
      "GET /admin/dashboard": { total_users: 0, new_users_last_7_days: 0, unread_messages: 0, total_logs: 0, active_announcements: 0, suspended_users: 0, logins_last_7_days: 0 },
      "GET /admin/system/health": { api_status: "ok", database_status: "ok", uptime: "0h 1m", failed_admin_actions_24h: 0 },
      "GET /admin/actions/recent": { actions: [] },
    });

    render(
      <MemoryRouter initialEntries={["/admin/login"]}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
        <CurrentPath />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Admin Email"), { target: { value: "admin@example.com" } });
    fireEvent.change(screen.getByLabelText("Admin Password"), { target: { value: "AdminPass123!" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Total Users")).toBeInTheDocument();
    expect(screen.getByTestId("current-path")).toHaveTextContent("/admin/dashboard");
    expect(localStorage.getItem("adminToken")).toBe("new-admin-token");

    const loginRequest = globalThis.fetch.mock.calls.find(([url, opts]) =>
      String(url).endsWith("/admin/login") && opts.method === "POST"
    );
    expect(loginRequest[0]).toBe(`${API}/admin/login`);
    expect(JSON.parse(loginRequest[1].body)).toEqual({
      email: "admin@example.com",
      password: "AdminPass123!",
    });
    await waitFor(() => {
      const sessionCheck = globalThis.fetch.mock.calls.find(([url]) => String(url).endsWith("/admin/me"));
      const authorization = sessionCheck[1].headers.Authorization;
      expect(authorization.startsWith("Bearer ")).toBe(true);
      expect(authorization.slice("Bearer ".length)).toBe(localStorage.getItem("adminToken"));
    });
  });

  it("shows authorization denial without storing a token or navigating", async () => {
    localStorage.removeItem("adminToken");
    mockApi({
      "POST /admin/login": () => json({ detail: "Not an admin" }, 403),
    });
    render(
      <MemoryRouter initialEntries={["/admin/login"]}>
        <Routes><Route path="/admin/login" element={<AdminLogin />} /></Routes>
        <CurrentPath />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Admin Email"), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByLabelText("Admin Password"), { target: { value: "UserPass123!" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("This account does not have admin access.");
    expect(screen.getByTestId("current-path")).toHaveTextContent("/admin/login");
    expect(localStorage.getItem("adminToken")).toBeNull();
  });

  it("keeps the admin page and session when session verification has a network failure", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    globalThis.fetch = vi.fn()
      .mockRejectedValueOnce(new Error("Network unavailable"))
      .mockResolvedValueOnce(json({ id: 1, is_admin: true }));
    render(<MemoryRouter initialEntries={["/admin/dashboard"]}><AdminLayout><div>Dashboard content</div><CurrentPath /></AdminLayout></MemoryRouter>);

    expect(await screen.findByRole("alert")).toHaveTextContent("Unable to verify admin access");
    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
    expect(screen.getByTestId("current-path")).toHaveTextContent("/admin/dashboard");
    expect(localStorage.getItem("adminToken")).toBe("abc");
    expect(window.location.assign).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Retry admin check" }));
    await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
    expect(screen.getByTestId("current-path")).toHaveTextContent("/admin/dashboard");
    expect(localStorage.getItem("adminToken")).toBe("abc");
  });

  it("keeps analytics and dashboard navigation available after a successful session check", async () => {
    mockApi({});
    render(wrap(<AdminLayout><div>Dashboard content</div><CurrentPath /></AdminLayout>));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining("/admin/me"), expect.anything()));
    fireEvent.click(screen.getByText("Analytics"));
    expect(screen.getByTestId("current-path")).toHaveTextContent("/admin/analytics");
    fireEvent.click(screen.getByText("Dashboard"));
    expect(screen.getByTestId("current-path")).toHaveTextContent("/admin/dashboard");
    expect(localStorage.getItem("adminToken")).toBe("abc");
  });

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

  it("lets an authorized admin enable personal-trainer access through user detail", async () => {
    const member = {
      id: 2, name: "Taylor", email: "taylor@example.com",
      is_admin: false, is_trainer: false, is_suspended: false,
      created_at: "2026-01-01T00:00:00", last_login: null
    };
    const confirmMock = vi.spyOn(window, "confirm").mockReturnValue(true);
    mockApi({
      "GET /admin/users/2": member,
      "GET /admin/users/2/workouts": [],
      "GET /admin/users/2/daily": [],
      "GET /admin/users/2/messages": [],
      "GET /admin/users/2/logs": [],
      "PUT /admin/users/2/trainer": (options) => json({
        user_id: 2, is_trainer: JSON.parse(options.body).enabled
      })
    });
    render(
      <MemoryRouter initialEntries={["/admin/users/2"]}>
        <Routes><Route path="/admin/users/:id" element={<AdminUserDetail />} /></Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText("Personal Trainer: Disabled")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Enable Personal Trainer" }));
    expect(await screen.findByText("Personal Trainer: Enabled")).toBeInTheDocument();
    expect(confirmMock).toHaveBeenCalled();
    const action = globalThis.fetch.mock.calls.find(([url, options]) =>
      String(url).endsWith("/admin/users/2/trainer") && options.method === "PUT"
    );
    expect(action).toBeTruthy();
    expect(action[1].headers.Authorization).toBe("Bearer abc");
    expect(JSON.parse(action[1].body)).toEqual({ enabled: true });
    confirmMock.mockRestore();
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
