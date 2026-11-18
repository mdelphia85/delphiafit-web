import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import App from "../App.jsx";

vi.mock("../components/AdaptiveCoachCard.jsx", () => ({ default: () => null }));

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.removeItem("token");
});

function LocationView() {
  const location = useLocation();
  return <span data-testid="current-url">{location.pathname + location.search}</span>;
}

const response = (data) => ({ ok: true, status: 200, json: async () => data });

describe("Unified AI Coach", () => {
  it("redirects previous Autonomous Coaching URL to the single AI Coach plan view", async () => {
    localStorage.setItem("token", "test-token");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(response([]));
    render(<MemoryRouter initialEntries={["/autonomous-coaching"]}><App /><LocationView /></MemoryRouter>);
    expect(await screen.findByTestId("current-url")).toHaveTextContent("/ai-coach?view=plan");
    expect(screen.getByRole("heading", { name: "AI Coach" })).toBeInTheDocument();
    expect(screen.getByLabelText("Coaching section")).toHaveValue("plan");
    expect(screen.getByRole("heading", { name: "Generate Training Plan" })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalled();
  });

  it("generates a weekly plan without creating a separate coaching screen", async () => {
    localStorage.setItem("token", "test-token");
    const calls = [];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url, options = {}) => {
      calls.push({ url, options });
      if (url.endsWith("/ai/weekly-plan")) return response({ result: { sessions_per_week: 4, split: "upper_lower_repeat", plan: [{ day: 1, type: "upper", exercises: [{ name: "Seated Cable Row", sets: 3, reps: "8–10" }] }] }, record_id: 16 });
      return response([]);
    });
    render(<MemoryRouter initialEntries={["/ai-coach"]}><App /></MemoryRouter>);
    await screen.findByLabelText("Coaching section");
    fireEvent.change(screen.getByLabelText("Coaching section"), { target: { value: "plan" } });
    fireEvent.change(screen.getByLabelText("Training goal"), { target: { value: "endurance" } });
    fireEvent.change(screen.getByLabelText("Sessions per week"), { target: { value: "4" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate and save plan" }));

    expect(await screen.findByText("Saved weekly plan")).toBeInTheDocument();
    expect(screen.getByText("Seated Cable Row")).toBeInTheDocument();
    const request = calls.find(({ url }) => url.endsWith("/ai/weekly-plan"));
    expect(request).toBeDefined();
    expect(request.options.method).toBe("POST");
    expect(request.options.headers.Authorization).toBe("Bearer test-token");
    expect(JSON.parse(request.options.body)).toMatchObject({
      fatigue: 3,
      sleep_hours: 7,
      sessions_per_week: 4,
      goals: ["endurance"]
    });
  });

  it("lists both saved conversations and weekly plans in the same history view", async () => {
    localStorage.setItem("token", "test-token");
    const rows = [
      { id: 4, feature: "coach", created_at: "2026-11-16T09:00:00Z", input: { message: "Running question" }, result: { coach_response: "Run gradually." } },
      { id: 5, feature: "weekly-plan", created_at: "2026-11-16T11:00:00Z", input: { goals: ["strength"] }, result: { sessions_per_week: 3, split: "full_body", plan: [{ day: 1, type: "full_body", primary_focus: "Training day", exercises: [{ name: "Goblet Squat", sets: 3, reps: "8–10" }] }] } }
    ];
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response(rows));
    render(<MemoryRouter initialEntries={["/ai-coach?view=history"]}><App /></MemoryRouter>);
    const history = screen.getByRole("region", { name: "Coaching History" });
    expect(within(history).getByRole("status")).toHaveTextContent("Loading coaching history");
    expect(await within(history).findByRole("button", { name: /Running question/ })).toBeInTheDocument();
    expect(within(history).getByRole("button", { name: /Training plan/ })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Show records"), { target: { value: "weekly-plan" } });
    expect(history).not.toHaveTextContent("Running question");
    fireEvent.click(screen.getByRole("button", { name: /Training plan/ }));
    expect(history).toHaveTextContent("Training day");
  });
});
