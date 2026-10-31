import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MenuProvider } from "../context/MenuContext.jsx";
import LoadoutsManager from "./LoadoutsManager.jsx";

function json(data) { return { ok: true, status: 200, json: async () => data }; }

describe("LoadoutsManager", () => {
  beforeEach(() => localStorage.setItem("token", "user-token"));
  it("creates a user loadout and saves equipment server-side", async () => {
    const calls = [];
    let loadoutCreated = false;
    const fetchMock = vi.fn(async (url, options = {}) => {
      calls.push({ url, options });
      if (url.endsWith("/loadout/list")) return json(loadoutCreated ? [{ id: 7, name: "Field kit", category: "general", total_weight: 2, mobility_score: 98, endurance_score: 98 }] : []);
      if (url.endsWith("/loadout/create")) { loadoutCreated = true; return json({ id: 7, name: "Field kit", category: "general", total_weight: 0 }); }
      if (url.endsWith("/loadout/item/7")) return json([{ id: 8, name: "Boots", weight: 2, quantity: 1 }]);
      if (url.endsWith("/loadout/item")) return json({ id: 8, name: "Boots", weight: 2, quantity: 1 });
      return json({});
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<MenuProvider><LoadoutsManager /></MenuProvider>);
    await screen.findByText("No loadouts saved yet.");
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Field kit" } });
    fireEvent.click(screen.getByRole("button", { name: "Save loadout" }));
    await screen.findByText("Field kit equipment");
    fireEvent.change(screen.getByLabelText("Equipment name"), { target: { value: "Boots" } });
    fireEvent.change(screen.getByLabelText("Weight per item"), { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: "Add equipment" }));
    await screen.findByText(/Boots/);
    const payload = JSON.parse(calls.find((call) => call.url.endsWith("/loadout/item")).options.body);
    expect(payload).toMatchObject({ loadout_id: 7, name: "Boots", weight: 2, quantity: 1 });
  });
});
