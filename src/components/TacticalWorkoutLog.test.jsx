import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TacticalWorkoutLog from "./TacticalWorkoutLog.jsx";

function json(data) { return { ok: true, status: 200, json: async () => data }; }

describe("TacticalWorkoutLog", () => {
  beforeEach(() => localStorage.setItem("token", "user-token"));
  it("writes completed sessions into authenticated workout history", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(json([]))
      .mockResolvedValueOnce(json({ id: 10, manual_name: "Ruck", duration_minutes: 35, workout_type: "tactical_fitness", date: "2026-10-31T04:00:00Z" }));
    vi.stubGlobal("fetch", fetchMock);
    render(<TacticalWorkoutLog />);
    await screen.findByText("No tactical workouts recorded yet.");
    fireEvent.change(screen.getByLabelText("Workout"), { target: { value: "Ruck" } });
    fireEvent.change(screen.getByLabelText("Duration (minutes)"), { target: { value: "35" } });
    fireEvent.click(screen.getByRole("button", { name: "Log workout" }));
    await screen.findByText("Ruck");
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toMatchObject({ mode: "manual", duration_minutes: 35, manual_name: "Ruck", workout_type: "tactical_fitness" });
  });
});
