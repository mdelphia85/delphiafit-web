import { describe, expect, it } from "vitest";
import { getCoachMenuItems } from "./coachMenuItems.js";

describe("coach menu role navigation", () => {
  it("keeps My Clients visible to members while hiding coach-only management tools", () => {
    expect(getCoachMenuItems(false)).toEqual([
      { label: "Coach Hub Login", path: "/coach-login" },
      { label: "My Coach", path: "/my-coach" },
      { label: "My Clients", path: "/client-management" }
    ]);
  });

  it("shows the full client-management menu for coach sessions", () => {
    expect(getCoachMenuItems(true)).toEqual([
      { label: "Coach Hub", path: "/coach-dashboard" },
      { label: "My Coach", path: "/my-coach" },
      { label: "My Clients", path: "/client-management" },
      { label: "Plan Builder", path: "/plan-builder" },
      { label: "Drill Library", path: "/drill-library" },
      { label: "Coach Messages", path: "/coach-messaging" }
    ]);
  });

  it("does not treat a missing coach session as coach authorization", () => {
    for (const status of [false, null, undefined, ""]) {
      const destinations = getCoachMenuItems(Boolean(status)).map(({ path }) => path);
      expect(destinations).toContain("/client-management");
      expect(destinations).not.toContain("/coach-messaging");
      expect(destinations).not.toContain("/plan-builder");
      expect(destinations).not.toContain("/drill-library");
    }
  });
});
