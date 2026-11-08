import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Community from "./Community.jsx";
import { MenuContext } from "../context/MenuContext.js";

function response(data, ok = true) {
  return { ok, status: ok ? 200 : 400, json: async () => data };
}

function renderCommunity() {
  return render(<MenuContext.Provider value={{ setMenuOpen: vi.fn() }}><Community /></MenuContext.Provider>);
}

describe("Community", () => {
  beforeEach(() => {
    localStorage.setItem("token", "test-token");
    globalThis.fetch = vi.fn().mockResolvedValue(response([]));
  });

  it("loads persisted posts and publishes a new post", async () => {
    globalThis.fetch
      .mockResolvedValueOnce(response([{ id: 8, user_id: 3, content: "Saved post", comments: [], reactions: [] }]))
      .mockResolvedValueOnce(response([]))
      .mockResolvedValueOnce(response({ id: 9 }))
      .mockResolvedValueOnce(response([{ id: 9, user_id: 3, content: "New post", comments: [], reactions: [] }]))
      .mockResolvedValueOnce(response([]));

    renderCommunity();
    expect(await screen.findByText("Saved post")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Share something"), { target: { value: "New post" } });
    fireEvent.click(screen.getByRole("button", { name: "Post" }));
    expect(await screen.findByText("New post")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining("/social/posts?content=New%20post"), expect.objectContaining({ method: "POST" }));
  });

  it("shows API errors instead of a fake empty feed", async () => {
    globalThis.fetch.mockResolvedValueOnce(response({ detail: "Session expired" }, false)).mockResolvedValueOnce(response([]));
    renderCommunity();
    expect(await screen.findByRole("alert")).toHaveTextContent("Session expired");
  });
});


describe("Community follows", () => {
  it("loads profiles and saves follow state", async () => {
    localStorage.setItem("token", "test-token");
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(response([]))
      .mockResolvedValueOnce(response([{ id: 4, name: "Member", following: false }]))
      .mockResolvedValueOnce(response({ following: true }));
    renderCommunity();
    fireEvent.click(await screen.findByRole("button", { name: "Follow" }));
    expect(await screen.findByRole("button", { name: "Following" })).toBeInTheDocument();
    expect(globalThis.fetch.mock.calls.some(([url, opts]) => url.includes("/community/follows/4") && opts.method === "POST")).toBe(true);
  });
});
