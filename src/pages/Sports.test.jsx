import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sports from "./Sports.jsx";
import { MenuContext } from "../context/MenuContext.jsx";

function response(data) { return { ok: true, status: 200, json: async () => data }; }

describe("Sports workout logging", () => {
  beforeEach(() => {
    localStorage.setItem("token", "test-token");
    globalThis.fetch = vi.fn().mockResolvedValue(response({ sports: [] }));
  });

  it("saves manual sports sessions using the backend workout contract", async () => {
    globalThis.fetch
      .mockResolvedValueOnce(response({ sports: [] }))
      .mockResolvedValueOnce(response({ id: 12 }))
      .mockResolvedValueOnce(response({ id: 5 }));
    render(<MemoryRouter><MenuContext.Provider value={{ openMenu: vi.fn() }}><Sports /></MenuContext.Provider></MemoryRouter>);
    fireEvent.click(screen.getByText("Manual"));
    fireEvent.change(screen.getByPlaceholderText("e.g., Basketball Shooting Drills"), { target: { value: "Basketball" } });
    fireEvent.change(screen.getByPlaceholderText("e.g., 45"), { target: { value: "45" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Workout" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Workout and sports session saved to your account.");
    const saveCall = globalThis.fetch.mock.calls.find(([url]) => url.includes("/workouts/save"));
    expect(saveCall[1].method).toBe("POST");
    expect(JSON.parse(saveCall[1].body)).toMatchObject({ mode: "manual", duration_minutes: 45, manual_name: "Basketball" });
    const sportLogCall = globalThis.fetch.mock.calls.find(([url]) => url.includes("/sports/logs/"));
    expect(JSON.parse(sportLogCall[1].body)).toMatchObject({ sport: "Basketball", duration_minutes: 45 });
  });
});
