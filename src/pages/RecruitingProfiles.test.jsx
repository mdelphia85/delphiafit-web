import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import RecruitingProfiles from "./RecruitingProfiles.jsx";
import { MenuContext } from "../context/MenuContext.js";
const response = (data) => ({ ok: true, status: 200, json: async () => data });
describe("Recruiting profiles", () => {
  beforeEach(() => { localStorage.setItem("token", "x"); globalThis.fetch = vi.fn(); });
  it("publishes an owner profile and loads published profiles", async () => {
    globalThis.fetch.mockResolvedValueOnce(response(null)).mockResolvedValueOnce(response([])).mockResolvedValueOnce(response({ sport: "Soccer", position: "Forward", public: true })).mockResolvedValueOnce(response([{ user_id: 7, name: "Athlete", sport: "Soccer", position: "Forward" }]));
    render(<MenuContext.Provider value={{ setMenuOpen: vi.fn() }}><RecruitingProfiles /></MenuContext.Provider>);
    fireEvent.change(await screen.findByLabelText("Sport"), { target: { value: "Soccer" } });
    fireEvent.change(screen.getByLabelText("Position"), { target: { value: "Forward" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Save Profile" }));
    expect(await screen.findByText("Athlete")).toBeInTheDocument();
    expect(globalThis.fetch.mock.calls.some(([url, opts]) => url.includes("/recruiting/profile") && opts.method === "PUT")).toBe(true);
  });
});
