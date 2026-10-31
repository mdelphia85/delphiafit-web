import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MenuProvider } from "../context/MenuContext.jsx";
import MissionReplay from "./MissionReplay.jsx";

function response(data, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => data };
}

describe("MissionReplay", () => {
  beforeEach(() => localStorage.setItem("token", "user-token"));

  it("creates a replay, records steps, and completes it through the API", async () => {
    const replay = { id: 8, user_id: 1, mission_type: "training", mission_id: 2, completed: false, score: 0, started_at: "2026-10-31T01:00:00" };
    const calls = [];
    const fetchMock = vi.fn(async (url, options = {}) => {
      calls.push({ url, options });
      if (url.endsWith("/mission_replay/list")) return response([]);
      if (url.endsWith("/mission_replay/start")) return response(replay);
      if (url.endsWith("/mission_replay/step/8")) return response([]);
      if (url.endsWith("/mission_replay/8")) return response(replay);
      if (url.endsWith("/mission_replay/step")) return response({ id: 17, action_type: "check-in", description: "On scene" });
      if (url.endsWith("/mission_replay/8/complete")) return response({ ...replay, completed: true, score: 94 });
      return response({ detail: "not found" }, 404);
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<MenuProvider><MissionReplay /></MenuProvider>);

    await screen.findByText("No mission replays recorded yet.");
    fireEvent.click(screen.getByRole("button", { name: "Start session" }));
    await screen.findByText("Replay #8 steps");
    fireEvent.change(screen.getByLabelText("Action"), { target: { value: "check-in" } });
    fireEvent.change(screen.getByLabelText("Notes"), { target: { value: "On scene" } });
    fireEvent.click(screen.getByRole("button", { name: "Record step" }));
    await screen.findByText("check-in");
    fireEvent.change(screen.getByLabelText("Final score (0-100)"), { target: { value: "94" } });
    fireEvent.click(screen.getByRole("button", { name: "Complete replay" }));
    await waitFor(() => expect(screen.getByText("Completed ? Score 94")).toBeInTheDocument());
    expect(calls.some(({ url }) => url.endsWith("/mission_replay/start"))).toBe(true);
    expect(fetchMock.mock.calls.every(([, options]) => options.headers.Authorization === "Bearer user-token")).toBe(true);
  });
});
