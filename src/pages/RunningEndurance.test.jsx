import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MenuProvider } from "../context/MenuContext.jsx";
import RunningEndurance from "./RunningEndurance.jsx";

const response = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data
});

describe("Running & Endurance", () => {
  beforeEach(() => {
    localStorage.setItem("token", "user-token");
    vi.restoreAllMocks();
  });

  it("saves an indoor session as a private user workout without GPS coordinates", async () => {
    let savedPayload = null;
    vi.stubGlobal("fetch", vi.fn(async (url, options = {}) => {
      if (url.endsWith("/workouts/")) return response([]);
      if (url.endsWith("/workouts/save") && options.method === "POST") {
        savedPayload = JSON.parse(options.body);
        return response({ id: 17, user_id: 1, date: new Date().toISOString(), ...savedPayload });
      }
      return response({ detail: "Not found" }, 404);
    }));

    render(
      <MemoryRouter>
        <MenuProvider><RunningEndurance /></MenuProvider>
      </MemoryRouter>
    );
    await screen.findByText("No endurance activities saved yet.");

    fireEvent.change(screen.getByLabelText("Distance (mi)"), { target: { value: "3.1" } });
    fireEvent.change(screen.getByLabelText("Duration (minutes)"), { target: { value: "31" } });
    fireEvent.click(screen.getByRole("button", { name: "Save manual activity" }));

    await screen.findByText("Activity saved privately to your DelphiaFit account and workout history.");
    expect(savedPayload).toMatchObject({
      workout_type: "running_endurance",
      duration_minutes: 31,
      mode: "manual"
    });
    expect(savedPayload.plan_json.running_endurance.source).toBe("manual");
    expect(savedPayload.plan_json.running_endurance.distance_m).toBeGreaterThan(4900);
    expect(savedPayload.plan_json.running_endurance.route_points).toEqual([]);
    expect(fetch.mock.calls.every(([, request]) =>
      request.headers.Authorization === "Bearer user-token")).toBe(true);
  });

  it("starts and pauses GPS only after a user action, and does not automatically upload coordinates", async () => {
    const successCallbacks = [];
    const watchPosition = vi.fn((success) => {
      successCallbacks.push(success);
      return 42;
    });
    const clearWatch = vi.fn();
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { watchPosition, clearWatch }
    });
    vi.stubGlobal("fetch", vi.fn(async () => response([])));
    render(<MemoryRouter><MenuProvider><RunningEndurance /></MenuProvider></MemoryRouter>);
    await screen.findByText("No endurance activities saved yet.");

    fireEvent.click(screen.getByRole("button", { name: "Start GPS activity" }));
    expect(watchPosition).toHaveBeenCalledTimes(1);
    expect(successCallbacks).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(clearWatch).toHaveBeenCalledWith(42);
    expect(screen.getByRole("button", { name: "Resume" })).toBeInTheDocument();
    expect(fetch.mock.calls.filter(([url]) => url.endsWith("/workouts/save"))).toHaveLength(0);
  });
});
