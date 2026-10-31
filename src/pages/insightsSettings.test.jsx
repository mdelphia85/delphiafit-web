import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Streaks from "./Streaks.jsx";
import Achievements from "./Achievements.jsx";
import AthleteAnalytics from "./AthleteAnalytics.jsx";
import Settings from "./Settings.jsx";
import Calories from "./Calories.jsx";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";

vi.mock("../utils/api.js", () => ({ apiRequest: vi.fn(), clearUserSession: vi.fn() }));

const withMenu = (component) => render(<MenuContext.Provider value={{ openMenu: vi.fn(), setMenuOpen: vi.fn() }}>{component}</MenuContext.Provider>);
const zeroStreak = { current: 0, longest: 0, total_days: 0, last_active: null };

describe("server-computed insights and account settings", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("renders streaks from the insights endpoint with honest zeros", async () => {
    apiRequest.mockResolvedValue({ overall: { label: "Any activity", ...zeroStreak }, sources: { workouts: { label: "Workout", ...zeroStreak, current: 4, longest: 6, last_active: "2026-01-02" } } });
    withMenu(<Streaks />);
    expect(await screen.findByText("Workout Streak")).toBeInTheDocument();
    expect(screen.getByText("4 days (best: 6)")).toBeInTheDocument();
    expect(screen.getByText("0 days (best: 0, active days: 0)")).toBeInTheDocument();
    expect(apiRequest).toHaveBeenCalledWith("/insights/streaks");
  });

  it("shows achievements and unlocked count from the server", async () => {
    apiRequest.mockResolvedValue({ unlocked: 1, total: 2, items: [
      { id: "a", title: "First Workout", description: "Log one", progress: 1, target: 1, unlocked: true },
      { id: "b", title: "Dedicated", description: "Log 50", progress: 3, target: 50, unlocked: false },
    ] });
    withMenu(<Achievements />);
    expect(await screen.findByText("1 of 2 unlocked")).toBeInTheDocument();
    expect(screen.getByText("6%")).toBeInTheDocument();
  });

  it("shows an error when analytics cannot load", async () => {
    apiRequest.mockRejectedValue(new Error("Not authenticated"));
    withMenu(<AthleteAnalytics />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Not authenticated");
  });

  it("changes the password through the authenticated endpoint", async () => {
    apiRequest.mockImplementation((path) => Promise.resolve(path === "/account/notifications" ? { preferences: {}, delivery_configured: false } : []));
    withMenu(<Settings />);
    fireEvent.click(await screen.findByText("Change Password"));
    fireEvent.change(screen.getByPlaceholderText("Current password"), { target: { value: "oldpassword1" } });
    fireEvent.change(screen.getByPlaceholderText("New password (min 10 characters)"), { target: { value: "newpassword12" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm new password"), { target: { value: "newpassword12" } });
    fireEvent.click(screen.getByText("Update Password"));
    await waitFor(() => expect(apiRequest).toHaveBeenCalledWith("/account/change-password", { method: "POST", body: { current_password: "oldpassword1", new_password: "newpassword12" } }));
  });

  it("requires the typed DELETE confirmation before deleting the account", async () => {
    apiRequest.mockImplementation((path) => Promise.resolve(path === "/account/notifications" ? { preferences: {}, delivery_configured: false } : []));
    withMenu(<Settings />);
    fireEvent.click(await screen.findByText("Delete Account"));
    const button = screen.getByText("Permanently Delete");
    expect(button).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Type DELETE to confirm"), { target: { value: "DELETE" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret-pass" } });
    expect(button).not.toBeDisabled();
  });

  it("labels email delivery as not configured", async () => {
    apiRequest.mockImplementation((path) => Promise.resolve(path === "/account/notifications" ? { preferences: {}, delivery_configured: false } : []));
    withMenu(<Settings />);
    expect(await screen.findByText(/Email delivery is not configured on this server/)).toBeInTheDocument();
  });

  it("saves calorie consumption to the server as the difference from the stored total", async () => {
    apiRequest.mockImplementation((path, options) => {
      if (path === "/nutrition/" && options?.method === "POST") return Promise.resolve({ id: 1 });
      if (path === "/nutrition/") return Promise.resolve([{ calories: 300, protein: 0, recorded_at: new Date().toISOString() }]);
      return Promise.reject(new Error("no targets"));
    });
    withMenu(<MemoryRouter><Calories /></MemoryRouter>);
    await waitFor(() => expect(apiRequest).toHaveBeenCalledWith("/nutrition/"));
    await screen.findByText("+250");
    fireEvent.click(screen.getByText("+250"));
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(apiRequest).toHaveBeenCalledWith("/nutrition/", { method: "POST", body: { calories: 250 } }));
  });
});
