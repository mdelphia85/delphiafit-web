import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import GlobalCompetition from "./GlobalCompetition.jsx";
import { MenuContext } from "../context/MenuContext.js";
const response = (data) => ({ ok: true, status: 200, json: async () => data });
describe("Global competitions", () => {
  beforeEach(() => { localStorage.setItem("token", "x"); globalThis.fetch = vi.fn(); });
  it("registers the current user for a persisted competition", async () => {
    globalThis.fetch.mockResolvedValueOnce(response([{ id: 4, name: "Open Meet", registered: false, registered_count: 2 }]))
      .mockResolvedValueOnce(response({ id: 2 }))
      .mockResolvedValueOnce(response([])).mockResolvedValueOnce(response([])).mockResolvedValueOnce(response([]))
      .mockResolvedValueOnce(response({ registered: true }))
      .mockResolvedValueOnce(response([{ id: 4, name: "Open Meet", registered: true, registered_count: 3 }]))
      .mockResolvedValueOnce(response([])).mockResolvedValueOnce(response([])).mockResolvedValueOnce(response([]));
    render(<MenuContext.Provider value={{ setMenuOpen: vi.fn() }}><GlobalCompetition /></MenuContext.Provider>);
    fireEvent.click(await screen.findByRole("button", { name: "Register" }));
    expect(await screen.findByRole("button", { name: "Withdraw" })).toBeInTheDocument();
    expect(globalThis.fetch.mock.calls.some(([url, opts]) => url.includes("/competition/4/register") && opts.method === "POST")).toBe(true);
  });
});


describe("Tournament registration", () => {
  it("persists and refreshes tournament enrollment", async () => {
    localStorage.setItem("token", "x");
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(response([{ id: 4, name: "Meet" }]))
      .mockResolvedValueOnce(response({ id: 6 }))
      .mockResolvedValueOnce(response([]))
      .mockResolvedValueOnce(response([{ id: 9, name: "Finals", registered: false, registered_count: 0 }]))
      .mockResolvedValueOnce(response([]))
      .mockResolvedValueOnce(response({ registered: true }))
      .mockResolvedValueOnce(response([{ id: 4, name: "Meet" }]))
      .mockResolvedValueOnce(response([]))
      .mockResolvedValueOnce(response([{ id: 9, name: "Finals", registered: true, registered_count: 1 }]))
      .mockResolvedValueOnce(response([]));
    render(<MenuContext.Provider value={{ setMenuOpen: vi.fn() }}><GlobalCompetition /></MenuContext.Provider>);
    fireEvent.click(await screen.findByRole("button", { name: "Register for Finals" }));
    expect(await screen.findByRole("button", { name: "Withdraw for Finals" })).toBeInTheDocument();
    expect(globalThis.fetch.mock.calls.some(([url, opts]) => url.includes("/tournament/9/register") && opts.method === "POST")).toBe(true);
  });
});
