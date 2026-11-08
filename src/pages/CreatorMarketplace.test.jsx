import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import CreatorMarketplace from "./CreatorMarketplace.jsx";
import { MenuContext } from "../context/MenuContext.js";
const response = (data) => ({ ok: true, status: 200, json: async () => data });
describe("Creator marketplace", () => {
  beforeEach(() => { localStorage.setItem("token", "x"); globalThis.fetch = vi.fn().mockResolvedValue(response([])); });
  it("creates a listing and submits interest without a payment", async () => {
    globalThis.fetch.mockResolvedValueOnce(response([])).mockResolvedValueOnce(response({ id: 2 }))
      .mockResolvedValueOnce(response({ id: 8 }))
      .mockResolvedValueOnce(response([{ id: 8, title: "Soccer plan", creator_user_id: 3, creator_name: "Coach" }]))
      .mockResolvedValueOnce(response({ requested: true }));
    render(<MenuContext.Provider value={{ setMenuOpen: vi.fn() }}><CreatorMarketplace /></MenuContext.Provider>);
    fireEvent.change(await screen.findByLabelText("Title"), { target: { value: "Soccer plan" } });
    fireEvent.click(screen.getByRole("button", { name: "Become a Creator / Publish" }));
    fireEvent.click(await screen.findByRole("button", { name: "Request access / express interest" }));
    expect(await screen.findByRole("status")).toHaveTextContent("No payment was made");
    expect(globalThis.fetch.mock.calls.some(([url]) => url.includes("/creator/marketplace/listings/8/interest"))).toBe(true);
  });
});


describe("Marketplace listing edits", () => {
  it("lets the listing owner edit their persisted listing", async () => {
    localStorage.setItem("token", "x");
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(response([{ id: 3, title: "Old title", creator_user_id: 1, creator_name: "Me", price: 0 }]))
      .mockResolvedValueOnce(response({ id: 1 }))
      .mockResolvedValueOnce(response({ id: 3, title: "New title" }))
      .mockResolvedValueOnce(response([{ id: 3, title: "New title", creator_user_id: 1, creator_name: "Me", price: 0 }]));
    render(<MenuContext.Provider value={{ setMenuOpen: vi.fn() }}><CreatorMarketplace /></MenuContext.Provider>);
    fireEvent.click(await screen.findByRole("button", { name: "Edit listing" }));
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "New title" } });
    fireEvent.click(screen.getByRole("button", { name: "Save listing changes" }));
    expect(await screen.findByText("New title")).toBeInTheDocument();
    expect(globalThis.fetch.mock.calls.some(([url, opts]) => url.includes("/marketplace/listings/3") && opts.method === "PUT")).toBe(true);
  });
});
