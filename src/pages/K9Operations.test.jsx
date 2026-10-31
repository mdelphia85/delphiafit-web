import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MenuProvider } from "../context/MenuContext.jsx";
import K9Operations from "./K9Operations.jsx";

function json(data) { return { ok: true, status: 200, json: async () => data }; }

describe("K9Operations", () => {
  beforeEach(() => localStorage.setItem("token", "user-token"));
  it("creates a unit and records its deployment", async () => {
    const unit = { id: 4, name: "Rex", breed: "Shepherd", specialty: "SAR" };
    const calls = [];
    const fetchMock = vi.fn(async (url, options = {}) => {
      calls.push({ url, options });
      if (url.endsWith("/k9/list")) return json([]);
      if (url.endsWith("/k9/create")) return json(unit);
      if (url.endsWith("/k9/deploy")) return json({ id: 5 });
      if (url.endsWith("/k9/history/4")) return json([{ id: 5, mission_type: "Search", location: "Trail", timestamp: "today" }]);
      if (url.includes("/tactical/progress/k9-operations")) return json({ data: [] });
      return json({ module: "k9-operations", data: [] });
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<MenuProvider><K9Operations /></MenuProvider>);
    await screen.findByText("No K9 units registered for your account.");
    fireEvent.change(screen.getByLabelText("Unit name"), { target: { value: "Rex" } });
    fireEvent.click(screen.getByRole("button", { name: "Save K9 unit" }));
    await screen.findByText("Rex", { selector: "strong" });
    fireEvent.change(screen.getByLabelText("Mission type"), { target: { value: "Search" } });
    fireEvent.click(screen.getByRole("button", { name: "Log deployment" }));
    await screen.findByText(/Search/);
    expect(calls.some(({ url }) => url.endsWith("/k9/deploy"))).toBe(true);
    expect(calls.every((call) => call.options.headers.Authorization === "Bearer user-token")).toBe(true);
  });
});
