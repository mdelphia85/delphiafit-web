import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import CreatorMarketplace from "./CreatorMarketplace.jsx";
import { MenuContext } from "../context/MenuContext.jsx";
const response = (data) => ({ ok: true, status: 200, json: async () => data });
describe("Creator marketplace", () => {
  beforeEach(() => { localStorage.setItem("token", "x"); globalThis.fetch = vi.fn().mockResolvedValue(response([])); });
  it("creates a listing and submits interest without a payment", async () => {
    globalThis.fetch.mockResolvedValueOnce(response([])).mockResolvedValueOnce(response({ id: 8 })).mockResolvedValueOnce(response([{ id: 8, title: "Soccer plan", creator_name: "Coach" }])).mockResolvedValueOnce(response({ requested: true }));
    render(<MenuContext.Provider value={{ setMenuOpen: vi.fn() }}><CreatorMarketplace /></MenuContext.Provider>);
    fireEvent.change(await screen.findByLabelText("Title"), { target: { value: "Soccer plan" } });
    fireEvent.click(screen.getByRole("button", { name: "Become a Creator / Publish" }));
    fireEvent.click(await screen.findByRole("button", { name: "Request access / express interest" }));
    expect(await screen.findByRole("status")).toHaveTextContent("No payment was made");
    expect(globalThis.fetch.mock.calls.some(([url]) => url.includes("/creator/marketplace/listings/8/interest"))).toBe(true);
  });
});
