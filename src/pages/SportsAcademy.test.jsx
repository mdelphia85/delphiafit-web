import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SportsAcademy from "./SportsAcademy.jsx";
import { MenuContext } from "../context/MenuContext.js";

const response = (data) => ({ ok: true, status: 200, json: async () => data });

describe("Sports Academy", () => {
  beforeEach(() => { localStorage.setItem("token", "x"); globalThis.fetch = vi.fn().mockResolvedValue(response([])); });
  it("loads and persists drill completion", async () => {
    globalThis.fetch.mockResolvedValueOnce(response([])).mockResolvedValueOnce(response({ sport: "basketball", drill: "Form shooting", completed: true }));
    render(<MenuContext.Provider value={{ setMenuOpen: vi.fn() }}><SportsAcademy /></MenuContext.Provider>);
    fireEvent.click((await screen.findAllByText("Open"))[0]);
    expect(await screen.findByText("Done")).toBeInTheDocument();
    const request = globalThis.fetch.mock.calls.find(([url, options]) => url.includes("/sports-academy/progress") && options.method === "PUT");
    expect(request[1].method).toBe("PUT");
    expect(JSON.parse(request[1].body)).toMatchObject({ sport: "basketball", drill: "Form shooting", completed: true });
  });
});
