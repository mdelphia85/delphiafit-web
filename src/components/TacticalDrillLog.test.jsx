import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MenuProvider } from "../context/MenuContext.jsx";
import Firefighters from "../pages/Firefighters.jsx";

function jsonResponse(data, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => data };
}

describe("Firefighters drill workspace", () => {
  beforeEach(() => localStorage.setItem("token", "user-token"));

  it("generates, saves, completes, and deletes a server-backed drill", async () => {
    const saved = { id: 12, category: "SCBA Endurance", name: "Urban SCBA Endurance ? Fireground Operations", notes: "Generated drill", duration: "30", level: "Medium", completed: false };
    const fetchMock = vi.fn(async (_url, options = {}) => {
      if (!options.method || options.method === "GET") return jsonResponse([]);
      if (options.method === "POST") return jsonResponse(saved);
      if (options.method === "PUT") return jsonResponse({ ...saved, completed: JSON.parse(options.body).completed });
      if (options.method === "DELETE") return jsonResponse({ success: true });
      return jsonResponse({}, 404);
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<MenuProvider><Firefighters /></MenuProvider>);

    await screen.findByText("No drills saved yet. Create one above to get started.");
    fireEvent.click(screen.getByRole("button", { name: "Generate drill details" }));
    expect(screen.getByLabelText("Drill name").value).toContain("Fireground Operations");
    fireEvent.click(screen.getByRole("button", { name: "Save drill" }));

    await screen.findByText(saved.name);
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toMatchObject({ category: "SCBA Endurance", duration: "30" });
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).name).toContain("Urban SCBA Endurance");
    fireEvent.click(screen.getByRole("button", { name: "Mark complete" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Mark incomplete" })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: `Delete ${saved.name}` }));
    await waitFor(() => expect(screen.queryByText(saved.name)).not.toBeInTheDocument());
  });
});
