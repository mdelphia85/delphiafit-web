import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MenuContext } from "../context/MenuContext.jsx";
import MedicalRehab from "./MedicalRehab.jsx";

const ok = (body, status = 200) => ({ ok: status < 400, status, json: async () => body });
beforeEach(() => { localStorage.setItem("token", "test-token"); vi.restoreAllMocks(); });

describe("MedicalRehab", () => {
  it("loads and saves per-user injury and recovery-plan records", async () => {
    const injury = { id: 1, type: "Ankle sprain", severity: "moderate", occurred_at: "2026-10-30T12:00:00", resolved: false };
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (url, options = {}) => {
      if (String(url).endsWith("/medical/injury/me")) return ok([injury]);
      if (String(url).endsWith("/medical/recovery/injury/1")) return ok([]);
      if (String(url).endsWith("/medical/pt/injury/1")) return ok([]);
      if (String(url).endsWith("/medical/injury/log")) return ok({ ...injury, id: 2 });
      if (String(url).endsWith("/medical/recovery/create")) return ok({ id: 4, name: "Home exercise plan" });
      throw new Error(`Unexpected request: ${url} ${options.method || "GET"}`);
    });
    render(<MenuContext.Provider value={{ setMenuOpen: vi.fn() }}><MemoryRouter><MedicalRehab /></MemoryRouter></MenuContext.Provider>);
    const card = await screen.findByText("Ankle sprain");
    fireEvent.change(screen.getByLabelText("Recovery protocol for Ankle sprain"), { target: { value: "Home exercise plan" } });
    fireEvent.click(within(card.closest("article")).getAllByRole("button", { name: "Save" })[0]);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/medical/recovery/create"), expect.objectContaining({ method: "POST" })));
    fireEvent.change(screen.getByLabelText("Injury type"), { target: { value: "Wrist strain" } });
    fireEvent.click(screen.getByRole("button", { name: "Save injury record" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/medical/injury/log"), expect.objectContaining({ method: "POST" })));
  });
});
