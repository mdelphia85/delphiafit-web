import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import DelphiaKids from "./DelphiaKids.jsx";
import { MenuContext } from "../context/MenuContext.jsx";
const response = (data) => ({ ok: true, status: 200, json: async () => data });
describe("DelphiaFit Kids", () => {
  beforeEach(() => { localStorage.setItem("token", "x"); globalThis.fetch = vi.fn().mockResolvedValue(response([])); });
  it("creates a nickname-only child and persists activity and parent control state", async () => {
    globalThis.fetch.mockResolvedValueOnce(response([])).mockResolvedValueOnce(response({ id: 2, nickname: "Runner", parent_controls_enabled: true, progress: [] })).mockResolvedValueOnce(response({ completed: true })).mockResolvedValueOnce(response({ parent_controls_enabled: false }));
    render(<MenuContext.Provider value={{ setMenuOpen: vi.fn() }}><DelphiaKids /></MenuContext.Provider>);
    fireEvent.change(await screen.findByLabelText("Child nickname"), { target: { value: "Runner" } });
    fireEvent.click(screen.getByRole("button", { name: "Add child profile" }));
    fireEvent.click(await screen.findByRole("button", { name: "movement ? Mark complete" }));
    fireEvent.click(screen.getByRole("button", { name: "Parent controls: On" }));
    expect(await screen.findByRole("button", { name: "Parent controls: Off" })).toBeInTheDocument();
    expect(globalThis.fetch.mock.calls.some(([url]) => url.includes("/kids/children/2/progress"))).toBe(true);
  });
});
