import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import CompetitionEvents from "./CompetitionEvents.jsx";
import { MenuContext } from "../context/MenuContext.js";
const response = (data) => ({ ok: true, status: 200, json: async () => data });
describe("Competition events", () => {
  beforeEach(() => { localStorage.setItem("token", "x"); globalThis.fetch = vi.fn().mockResolvedValue(response([])); });
  it("creates events through authenticated competition API", async () => {
    globalThis.fetch.mockResolvedValueOnce(response([])).mockResolvedValueOnce(response({ id: 3 })).mockResolvedValueOnce(response([{ id: 3, name: "Spring Meet", sport: "Track" }]));
    render(<MenuContext.Provider value={{ setMenuOpen: vi.fn() }}><CompetitionEvents /></MenuContext.Provider>);
    fireEvent.click(await screen.findByRole("button", { name: "+ Create Event" }));
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Spring Meet" } });
    fireEvent.change(screen.getByLabelText("Sport"), { target: { value: "Track" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Event" }));
    expect(await screen.findByText("Spring Meet")).toBeInTheDocument();
    expect(globalThis.fetch.mock.calls.some(([url]) => url.includes("/competition/create"))).toBe(true);
  });
});
