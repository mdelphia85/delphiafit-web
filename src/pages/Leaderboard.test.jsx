import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Leaderboard from "./Leaderboard.jsx";
import { MenuContext } from "../context/MenuContext.jsx";

function response(data) { return { ok: true, status: 200, json: async () => data }; }

describe("Leaderboard", () => {
  beforeEach(() => {
    localStorage.setItem("token", "test-token");
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(response([{ rank: 1, user_id: 2, name: "Real member", minutes: 45, sessions: 2 }]))
      .mockResolvedValueOnce(response([]));
  });

  it("displays server-derived rankings and requests the chosen period", async () => {
    render(<MenuContext.Provider value={{ setMenuOpen: vi.fn() }}><Leaderboard /></MenuContext.Provider>);
    expect(await screen.findByText("Real member")).toBeInTheDocument();
    expect(screen.getByText("45 min")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Monthly" }));
    expect(await screen.findByText("No sports logs in this period yet. Log a session to start the leaderboard.")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenLastCalledWith(expect.stringContaining("/sports/logs/leaderboard?period=monthly"), expect.any(Object));
  });
});
