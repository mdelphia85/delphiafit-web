import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TacticalOperationLog from "./TacticalOperationLog.jsx";

describe("TacticalOperationLog", () => {
  beforeEach(() => localStorage.setItem("token", "user-token"));
  it("creates a private SAR operation and logs team activity", async () => {
    const calls = [];
    const fetchMock = vi.fn(async (url, options = {}) => {
      calls.push({ url, options });
      if (url.endsWith("/sar/operation/list")) return json([]);
      if (url.endsWith("/sar/operation")) return json({ id: 21, operation_name: "River search", operation_type: "water", status: "active" });
      if (url.endsWith("/sar/team")) return json({ id: 4, team_name: "North bank" });
      if (url.endsWith("/sar/team/21")) return json([{ id: 4, team_name: "North bank" }]);
      return json({}, 404);
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<TacticalOperationLog module="sar" />);
    await screen.findByText("No operations recorded yet.");
    fireEvent.change(screen.getByLabelText("Operation name"), { target: { value: "River search" } });
    fireEvent.click(screen.getByRole("button", { name: "Create operation record" }));
    await screen.findByText("Activity for River search");
    fireEvent.change(screen.getByLabelText("Team / activity record"), { target: { value: "North bank" } });
    fireEvent.click(screen.getByRole("button", { name: "Save activity record" }));
    await screen.findByText("North bank");
    expect(JSON.parse(calls.find((call) => call.url.endsWith("/sar/operation")).options.body)).not.toHaveProperty("commander_id");
    expect(calls.every((call) => call.options.headers.Authorization === "Bearer user-token")).toBe(true);
  });
});

function json(data, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => data };
}
