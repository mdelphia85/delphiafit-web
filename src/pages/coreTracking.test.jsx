import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Water from "./Water.jsx";
import DailyLog from "./DailyLog.jsx";
import Challenges from "./Challenges.jsx";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";

vi.mock("../utils/api.js", () => ({ apiRequest: vi.fn() }));

const withMenu = (component) => render(<MenuContext.Provider value={{ openMenu: vi.fn(), setMenuOpen: vi.fn() }}>{component}</MenuContext.Provider>);

describe("core tracking pages", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("loads today's hydration and persists a new intake through the API", async () => {
    apiRequest.mockImplementation((path, options) => {
      if (path === "/hydration/" && !options) return Promise.resolve([]);
      if (path === "/hydration/" && options?.method === "POST") return Promise.resolve({ id: 3 });
      return Promise.resolve([]);
    });
    withMenu(<Water />);
    await screen.findByText("Today: 0 oz");
    fireEvent.click(screen.getByText("+8 oz"));
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(apiRequest).toHaveBeenCalledWith("/hydration/", expect.objectContaining({ method: "POST", body: expect.objectContaining({ amount_ml: 237 }) })));
    expect(await screen.findByText("Water intake saved.")).toBeInTheDocument();
  });

  it("creates a daily log using the authenticated API contract", async () => {
    apiRequest.mockResolvedValueOnce([]).mockResolvedValueOnce({ id: 9 });
    withMenu(<DailyLog />);
    await screen.findByText("Daily Log");
    fireEvent.change(screen.getByLabelText("Protein (g)"), { target: { value: "120" } });
    fireEvent.click(screen.getByText("Save Log"));
    await waitFor(() => expect(apiRequest).toHaveBeenLastCalledWith("/daily-log/", expect.objectContaining({ method: "POST", body: expect.objectContaining({ protein: 120 }) })));
    expect(await screen.findByText("Daily log saved.")).toBeInTheDocument();
  });
  it("creates a challenge and derives its progress from saved activity", async () => {
    apiRequest.mockImplementation((path, options) => {
      if (path === "/user-data/challenges" && options?.method === "POST") {
        return Promise.resolve({ id: 5, data: { title: "Water week", category: "hydration", target_value: 2 } });
      }
      if (path === "/user-data/challenges" || path === "/user-data/journal" || path === "/workouts/" || path === "/hydration/" || path === "/daily-log/") return Promise.resolve([]);
      return Promise.resolve([]);
    });
    withMenu(<Challenges />);
    await screen.findByText("No challenges yet. Create one to get started.");
    fireEvent.change(screen.getByLabelText("Challenge title"), { target: { value: "Water week" } });
    fireEvent.change(screen.getByLabelText("Activity type"), { target: { value: "hydration" } });
    fireEvent.change(screen.getByLabelText("Target"), { target: { value: "2" } });
    fireEvent.click(screen.getByText("Create Challenge"));
    await waitFor(() => expect(apiRequest).toHaveBeenCalledWith("/user-data/challenges", expect.objectContaining({ method: "POST", body: { data: { title: "Water week", category: "hydration", target_value: 2 } } })));
    expect(await screen.findByText("Water week")).toBeInTheDocument();
  });

});
