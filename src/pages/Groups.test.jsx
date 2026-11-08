import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Groups from "./Groups.jsx";
import { MenuContext } from "../context/MenuContext.js";

function response(data) { return { ok: true, status: 200, json: async () => data }; }

describe("Groups", () => {
  beforeEach(() => {
    localStorage.setItem("token", "test-token");
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(response([]))
      .mockResolvedValueOnce(response([]));
  });

  it("creates a group through the authenticated API", async () => {
    globalThis.fetch
      .mockResolvedValueOnce(response({ id: 2 }))
      .mockResolvedValueOnce(response([{ id: 2, name: "Run Club", member_count: 1 }]))
      .mockResolvedValueOnce(response([]));
    render(<MenuContext.Provider value={{ setMenuOpen: vi.fn() }}><Groups /></MenuContext.Provider>);
    fireEvent.click(await screen.findByRole("button", { name: "Create" }));
    fireEvent.change(screen.getByLabelText("Group name"), { target: { value: "Run Club" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Group" }));
    expect(await screen.findByText("Run Club")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining("/social/groups?name=Run%20Club"), expect.objectContaining({ method: "POST" }));
  });
});
