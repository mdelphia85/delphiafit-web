import { describe, expect, it } from "vitest";
import { getCoachMenuItems } from "./coachMenuItems.js";

describe("coach menu role navigation", () => {
  it("keeps the coach menu separate from trainer-specific My Clients", () => {
    expect(getCoachMenuItems(false)).toEqual([
      { label: "Coach Hub Login", path: "/coach-login" },
      { label: "My Coach", path: "/my-coach" }
    ]);
  });

  it("shows coach-only management tools with coach sessions", () => {
    expect(getCoachMenuItems(true)).toEqual([
      { label: "Coach Hub", path: "/coach-dashboard" },
      { label: "My Coach", path: "/my-coach" },
      { label: "Plan Builder", path: "/plan-builder" },
      { label: "Drill Library", path: "/drill-library" },
      { label: "Coach Messages", path: "/coach-messaging" }
    ]);
  });

  it("does not treat a missing coach session as coach authorization", () => {
    for (const status of [false, null, undefined, ""]) {
      const destinations = getCoachMenuItems(Boolean(status)).map(({ path }) => path);
      expect(destinations).not.toContain("/client-management");
      expect(destinations).not.toContain("/coach-messaging");
      expect(destinations).not.toContain("/plan-builder");
      expect(destinations).not.toContain("/drill-library");
    }
  });
});
