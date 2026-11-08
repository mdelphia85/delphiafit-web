import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MenuContext } from "../context/MenuContext.js";
import CoachDashboard from "./CoachDashboard.jsx";
import CoachLogin from "./CoachLogin.jsx";
import ClientManagement from "./ClientManagement.jsx";
import PlanBuilder from "./PlanBuilder.jsx";
import CoachMessaging from "./CoachMessaging.jsx";
import ClientMessages from "./ClientMessages.jsx";

const json = (status, body) => Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(body) });

const userEvent = {
  click: async (element) => fireEvent.click(element),
  type: async (element, text) => fireEvent.change(element, { target: { value: text } }),
  selectOptions: async (element, value) => fireEvent.change(element, { target: { value } })
};

// routes: { "GET /staff/clients": body | (init) => body | {status, body} }
function mockApi(routes) {
  const calls = [];
  vi.stubGlobal(
    "fetch",
    vi.fn((url, init = {}) => {
      const method = (init.method || "GET").toUpperCase();
      const path = String(url).replace(/^undefined/, "").replace(/^https?:\/\/[^/]+/, "");
      calls.push({ method, path, body: init.body ? JSON.parse(init.body) : undefined, headers: init.headers });
      const handler = routes[`${method} ${path}`];
      if (handler === undefined) return json(404, { detail: `unmocked ${method} ${path}` });
      const result = typeof handler === "function" ? handler(init) : handler;
      return result && result.status ? json(result.status, result.body) : json(200, result);
    })
  );
  return calls;
}

function Where() {
  const location = useLocation();
  return <div data-testid="where">{location.pathname + location.search}</div>;
}

function renderAt(path, element, route = path.split("?")[0], setMenuOpen = vi.fn()) {
  render(
    <MenuContext.Provider value={{ setMenuOpen }}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={route} element={element} />
          <Route path="*" element={<Where />} />
        </Routes>
      </MemoryRouter>
    </MenuContext.Provider>
  );
  return setMenuOpen;
}

const signIn = () => {
  localStorage.setItem("coachToken", "coach-jwt");
  localStorage.setItem("coachEmail", "c@x.com");
};

const clientsFixture = {
  clients: [{ id: 7, name: "Ada Lovelace", email: "ada@x.com", status: "Active", joinDate: "2025-01-01", team_id: null }]
};

beforeEach(() => vi.stubGlobal("confirm", vi.fn(() => true)));
afterEach(() => vi.unstubAllGlobals());

describe("coach session", () => {
  it("redirects to coach login without a coach session, and never calls the API", () => {
    const calls = mockApi({});
    renderAt("/client-management", <ClientManagement />);
    expect(screen.getByTestId("where")).toHaveTextContent("/coach-login");
    expect(calls).toHaveLength(0);
  });

  it("a regular user token alone does not count as a coach session", () => {
    localStorage.setItem("token", "user-jwt");
    mockApi({});
    renderAt("/coach-dashboard", <CoachDashboard />);
    expect(screen.getByTestId("where")).toHaveTextContent("/coach-login");
  });

  it("login page skips straight to the dashboard when already signed in", () => {
    signIn();
    renderAt("/coach-login", <CoachLogin />);
    expect(screen.getByTestId("where")).toHaveTextContent("/coach-dashboard");
  });

  it("Return to Menu opens the menu and does not navigate to login", async () => {
    signIn();
    mockApi({ "GET /staff/clients": clientsFixture, "GET /staff/plans": { plans: [] }, "GET /staff/teams": { teams: [] }, "GET /staff/invitations": { invitations: [] } });
    const setMenuOpen = renderAt("/client-management", <ClientManagement />);
    await screen.findByText("Ada Lovelace");
    await userEvent.click(screen.getByText("Return to Menu"));
    expect(setMenuOpen).toHaveBeenCalledWith(true);
    expect(screen.queryByTestId("where")).toBeNull();
  });
});

describe("CoachDashboard", () => {
  const dashboard = {
    team_id: 1,
    available_teams: [{ id: 1, name: "Alpha" }],
    stats: { totalClients: 1, activePrograms: 2, messagesUnread: 3, weeklyHours: 0 },
    clients: [{ id: 7, name: "Ada Lovelace", program: "Strength", progress: 43, workouts_7d: 3, active_days_7d: 3 }]
  };

  it("shows real stats from the API", async () => {
    signIn();
    mockApi({ "GET /coach/team": dashboard });
    renderAt("/coach-dashboard", <CoachDashboard />);
    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText(/3 active day\(s\) this week/)).toBeInTheDocument();
  });

  it.each([
    ["Add Client", "/client-management"],
    ["Create Training Plan", "/plan-builder"],
    ["Message Clients", "/coach-messaging"]
  ])("%s button goes to %s", async (label, to) => {
    signIn();
    mockApi({ "GET /coach/team": dashboard });
    renderAt("/coach-dashboard", <CoachDashboard />);
    await screen.findByText("Ada Lovelace");
    await userEvent.click(screen.getByRole("button", { name: new RegExp(label) }));
    expect(screen.getByTestId("where")).toHaveTextContent(to);
  });

  it("shows an empty state when the coach has no clients", async () => {
    signIn();
    mockApi({ "GET /coach/team": { ...dashboard, clients: [] } });
    renderAt("/coach-dashboard", <CoachDashboard />);
    expect(await screen.findByText(/No clients yet/)).toBeInTheDocument();
  });

  it("a 403 for a stale remembered team falls back instead of logging out", async () => {
    signIn();
    localStorage.setItem("coachTeamId", "99");
    mockApi({
      "GET /coach/team?team_id=99": { status: 403, body: { detail: "You do not have access to that team" } },
      "GET /coach/team": dashboard
    });
    renderAt("/coach-dashboard", <CoachDashboard />);
    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    expect(localStorage.getItem("coachToken")).toBe("coach-jwt");
  });

  it("a 401 clears the coach session and goes to login", async () => {
    signIn();
    mockApi({ "GET /coach/team": { status: 401, body: { detail: "expired" } } });
    renderAt("/coach-dashboard", <CoachDashboard />);
    await waitFor(() => expect(screen.getByTestId("where")).toHaveTextContent("/coach-login"));
    expect(localStorage.getItem("coachToken")).toBeNull();
  });

  it("shows an error with retry when the server fails", async () => {
    signIn();
    mockApi({ "GET /coach/team": { status: 500, body: { detail: "boom" } } });
    renderAt("/coach-dashboard", <CoachDashboard />);
    expect(await screen.findByRole("alert")).toHaveTextContent("boom");
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});

describe("ClientManagement", () => {
  const base = () => ({
    "GET /staff/clients": clientsFixture,
    "GET /staff/plans": { plans: [{ id: 3, name: "Strength 101" }] },
    "GET /staff/teams": { teams: [] },
    "GET /staff/invitations": { invitations: [] }
  });

  it("shows an empty state", async () => {
    signIn();
    mockApi({ ...base(), "GET /staff/clients": { clients: [] } });
    renderAt("/client-management", <ClientManagement />);
    expect(await screen.findByText(/No clients yet/)).toBeInTheDocument();
  });

  it("shows an error with retry instead of redirecting on a 403", async () => {
    signIn();
    mockApi({ ...base(), "GET /staff/clients": { status: 403, body: { detail: "Coach access required" } } });
    renderAt("/client-management", <ClientManagement />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Coach access required");
    expect(screen.queryByTestId("where")).toBeNull();
    expect(localStorage.getItem("coachToken")).toBe("coach-jwt");
  });

  it("View Progress loads real progress and never calls DELETE", async () => {
    signIn();
    const calls = mockApi({
      ...base(),
      "GET /staff/clients/7/progress": {
        client: { id: 7 },
        has_account: true,
        weights: [{ date: "2025-02-01T00:00:00", weight_kg: 80.5 }],
        workouts: [{ id: 1, date: "2025-02-02T00:00:00", name: "Deadlifts", duration_minutes: 45 }],
        daily_logs: [],
        body_metrics: [],
        plans: [],
        summary: { latest_weight_kg: 80.5, weight_change_kg: -2, workouts_7d: 1, workouts_30d: 4, minutes_30d: 180, last_activity: "2025-02-02T00:00:00" }
      }
    });
    renderAt("/client-management", <ClientManagement />);
    await userEvent.click(await screen.findByRole("button", { name: "View Progress" }));
    expect(await screen.findByText(/Deadlifts/)).toBeInTheDocument();
    expect(screen.getAllByText("80.5 kg").length).toBeGreaterThan(0);
    expect(calls.some((c) => c.method === "DELETE")).toBe(false);
    expect(screen.queryByRole("button", { name: "Confirm Remove" })).toBeNull();
  });

  it("Remove Client needs explicit confirmation, then calls DELETE", async () => {
    signIn();
    const calls = mockApi({ ...base(), "DELETE /staff/clients/7": { status: "removed", id: 7 } });
    renderAt("/client-management", <ClientManagement />);
    await userEvent.click(await screen.findByRole("button", { name: "Remove Client" }));
    expect(calls.some((c) => c.method === "DELETE")).toBe(false);
    await userEvent.click(screen.getByRole("button", { name: "Confirm Remove" }));
    await waitFor(() => expect(calls.some((c) => c.method === "DELETE" && c.path === "/staff/clients/7")).toBe(true));
  });

  it("Assign Program posts the chosen plan for that client", async () => {
    signIn();
    const calls = mockApi({ ...base(), "POST /staff/plans/3/assignments": { plan_id: 3, assigned_client_ids: [7] } });
    renderAt("/client-management", <ClientManagement />);
    await userEvent.click(await screen.findByRole("button", { name: "Assign Program" }));
    await userEvent.selectOptions(screen.getByLabelText("Plan"), "3");
    await userEvent.click(screen.getByRole("button", { name: "Assign" }));
    await waitFor(() => expect(calls.find((c) => c.method === "POST" && c.path === "/staff/plans/3/assignments")?.body).toEqual({ client_id: 7 }));
  });

  it("does not expose an invitation token when email delivery is unavailable", async () => {
    signIn();
    const calls = mockApi({ ...base(), "POST /staff/clients/invite": { invite_id: 1, delivery_configured: false } });
    renderAt("/client-management", <ClientManagement />);
    await userEvent.type(await screen.findByLabelText("Client email"), "new@x.com");
    await userEvent.click(screen.getByRole("button", { name: "Send Invitation" }));
    expect(await screen.findByText(/Configure email delivery and resend/)).toBeInTheDocument();
    expect(screen.queryByLabelText("Invitation link")).not.toBeInTheDocument();
    expect(calls.find((c) => c.path === "/staff/clients/invite").body).toEqual({ email: "new@x.com" });
    expect(calls.find((c) => c.path === "/staff/clients/invite").headers.Authorization).toBe("Bearer coach-jwt");
  });
});

describe("Client invitation resend", () => {
  it("resends a pending invitation through the token-free email flow", async () => {
    signIn();
    const calls = mockApi({
      "GET /staff/clients": clientsFixture,
      "GET /staff/plans": { plans: [] },
      "GET /staff/teams": { teams: [] },
      "GET /staff/invitations": { invitations: [{ id: 12, email: "pending@example.com", role: "client", accepted: false }] },
      "POST /invite/resend": { message: "Invite resent successfully.", delivery_configured: true },
    });
    renderAt("/client-management", <ClientManagement />);
    await userEvent.click(await screen.findByRole("button", { name: "Resend" }));
    await waitFor(() => expect(calls.some((call) => call.method === "POST" && call.path === "/invite/resend" && call.body.invite_id === 12)).toBe(true));
    expect(await screen.findByText("Invitation resent.")).toBeInTheDocument();
  });
});

describe("PlanBuilder", () => {
  it("creates a plan via POST and lists real plans", async () => {
    signIn();
    let plans = [];
    const calls = mockApi({
      "GET /staff/plans": () => ({ plans }),
      "GET /staff/clients": { clients: [] },
      "GET /staff/teams": { teams: [] },
      "POST /staff/plans": (init) => {
        const body = JSON.parse(init.body);
        plans = [{ id: 1, owned: true, items: body.items, assigned_clients: 0, duration_weeks: body.duration_weeks, ...body }];
        return plans[0];
      }
    });
    renderAt("/plan-builder", <PlanBuilder />);
    expect(await screen.findByText(/No plans yet/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "+ New Plan" }));
    await userEvent.type(screen.getByLabelText("Plan name"), "Hypertrophy");
    await userEvent.type(screen.getByLabelText(/Plan items/), "Day 1 squat");
    await userEvent.click(screen.getByRole("button", { name: "Create Plan" }));
    expect(await screen.findByText("Hypertrophy")).toBeInTheDocument();
    const post = calls.find((c) => c.method === "POST" && c.path === "/staff/plans");
    expect(post.body).toMatchObject({ name: "Hypertrophy", items: ["Day 1 squat"] });
  });

  it("rejects an empty plan name without calling the API", async () => {
    signIn();
    const calls = mockApi({ "GET /staff/plans": { plans: [] }, "GET /staff/clients": { clients: [] }, "GET /staff/teams": { teams: [] } });
    renderAt("/plan-builder", <PlanBuilder />);
    await userEvent.click(await screen.findByRole("button", { name: "+ New Plan" }));
    await userEvent.click(screen.getByRole("button", { name: "Create Plan" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Give the plan a name");
    expect(calls.some((c) => c.method === "POST")).toBe(false);
  });
});

describe("Messaging", () => {
  it("lists threads, opens one, marks it read and sends a message", async () => {
    signIn();
    const calls = mockApi({
      "GET /staff/messages/threads": { threads: [{ client_id: 7, name: "Ada Lovelace", last_message: "hi coach", unread: 1 }] },
      "GET /staff/teams": { teams: [] },
      "GET /staff/messages/7": { client: { id: 7, name: "Ada Lovelace" }, messages: [{ id: 1, sender: "client", body: "hi coach" }] },
      "POST /staff/messages/7/read": { marked_read: 1 },
      "POST /staff/messages/7": { id: 2, sender: "coach", body: "Great work" }
    });
    renderAt("/coach-messaging", <CoachMessaging />);
    await userEvent.click(await screen.findByRole("button", { name: /Ada Lovelace/ }));
    expect(await screen.findAllByText("hi coach")).not.toHaveLength(0);
    await waitFor(() => expect(calls.some((c) => c.path === "/staff/messages/7/read")).toBe(true));
    await userEvent.type(screen.getByLabelText("Message"), "Great work");
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByText("Great work")).toBeInTheDocument();
    expect(calls.find((c) => c.method === "POST" && c.path === "/staff/messages/7").body).toEqual({ body: "Great work" });
  });

  it("shows an empty state with no clients", async () => {
    signIn();
    mockApi({ "GET /staff/messages/threads": { threads: [] }, "GET /staff/teams": { teams: [] } });
    renderAt("/coach-messaging", <CoachMessaging />);
    expect(await screen.findByText(/No clients to message yet/)).toBeInTheDocument();
  });
});

describe("ClientMessages (client side)", () => {
  it("uses the user token, shows coach plans and messages, and sends", async () => {
    localStorage.setItem("token", "user-jwt");
    const calls = mockApi({
      "GET /staff/my/messages": { coach: { id: 1, name: "Coach Kim" }, unread: 1, messages: [{ id: 1, sender: "coach", body: "Welcome!" }] },
      "GET /staff/my/plans": { plans: [{ assignment_id: 1, name: "Starter Plan", items: ["Walk 30 min"] }] },
      "POST /staff/my/messages/read": { marked_read: 1 },
      "POST /staff/my/messages": { id: 2, sender: "client", body: "Thanks" }
    });
    renderAt("/my-coach", <ClientMessages />);
    expect(await screen.findByText("Welcome!")).toBeInTheDocument();
    expect(screen.getByText("Starter Plan")).toBeInTheDocument();
    expect(calls[0].headers.Authorization).toBe("Bearer user-jwt");
    await userEvent.type(screen.getByLabelText("Message"), "Thanks");
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByText("Thanks")).toBeInTheDocument();
  });

  it("explains when the user has no coach", async () => {
    localStorage.setItem("token", "user-jwt");
    mockApi({ "GET /staff/my/messages": { status: 404, body: { detail: "x" } }, "GET /staff/my/plans": { status: 404, body: { detail: "x" } } });
    renderAt("/my-coach", <ClientMessages />);
    expect(await screen.findByText(/not connected to a coach/)).toBeInTheDocument();
  });
});
