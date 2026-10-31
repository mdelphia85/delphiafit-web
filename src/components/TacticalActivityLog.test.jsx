import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TacticalActivityLog from "./TacticalActivityLog.jsx";

function json(data) { return { ok: true, status: 200, json: async () => data }; }

describe("TacticalActivityLog", () => {
  beforeEach(() => localStorage.setItem("token", "user-token"));
  it("stores named, timed prep sessions separately from curriculum completion", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(json({ data: null }))
      .mockResolvedValueOnce(json({ data: [{ id: "1", activity: "Ruck session", duration_minutes: 42, notes: "Steady pace", occurred_at: "2026-10-31T04:00:00Z" }] }));
    vi.stubGlobal("fetch", fetchMock);
    render(<TacticalActivityLog module="sof-selection-prep" title="SOF prep" />);
    await screen.findByText("No training sessions recorded yet.");
    fireEvent.change(screen.getByLabelText("Activity"), { target: { value: "Ruck session" } });
    fireEvent.change(screen.getByLabelText("Duration (minutes)"), { target: { value: "42" } });
    fireEvent.change(screen.getByLabelText("Notes"), { target: { value: "Steady pace" } });
    fireEvent.click(screen.getByRole("button", { name: "Log training session" }));
    await screen.findByText("Ruck session");
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).data[0]).toMatchObject({ activity: "Ruck session", duration_minutes: 42, notes: "Steady pace" });
  });
});
