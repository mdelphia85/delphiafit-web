import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import FederationLayer from "./FederationLayer.jsx";
import { MenuContext } from "../context/MenuContext.js";
const response = (data) => ({ ok: true, status: 200, json: async () => data });
describe("Federations", () => {
  beforeEach(() => { localStorage.setItem("token", "x"); globalThis.fetch = vi.fn().mockResolvedValue(response([])); });
  it("creates and joins persisted federations", async () => {
    globalThis.fetch.mockResolvedValueOnce(response([])).mockResolvedValueOnce(response({ id: 5 })).mockResolvedValueOnce(response([{ id: 5, name: "Track Federation", joined: false }])).mockResolvedValueOnce(response({ joined: true })).mockResolvedValueOnce(response([{ id: 5, name: "Track Federation", joined: true }]));
    render(<MenuContext.Provider value={{ setMenuOpen: vi.fn() }}><FederationLayer /></MenuContext.Provider>);
    fireEvent.change(await screen.findByLabelText("Federation name"), { target: { value: "Track Federation" } });
    fireEvent.click(screen.getByRole("button", { name: "Create" }));
    fireEvent.click(await screen.findByRole("button", { name: "Join" }));
    expect(await screen.findByRole("button", { name: "Leave" })).toBeInTheDocument();
  });
});
