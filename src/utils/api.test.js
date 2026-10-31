import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiRequest, ApiError, hasSession, clearUserSession } from "./api.js";

describe("apiRequest", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("sends the bearer token for the selected session", async () => {
    localStorage.setItem("coachToken", "abc");
    const spy = vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, json: async () => ({ ok: 1 }) });
    await apiRequest("/x", { as: "coach" });
    expect(spy.mock.calls[0][1].headers.Authorization).toBe("Bearer abc");
  });

  it("throws ApiError with status and detail message", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false, status: 403, json: async () => ({ detail: "Nope" }) });
    await expect(apiRequest("/x")).rejects.toMatchObject({ status: 403, message: "Nope" });
    await expect(apiRequest("/x")).rejects.toBeInstanceOf(ApiError);
  });

  it("reports whether a session exists", () => {
    expect(hasSession("admin")).toBe(false);
    localStorage.setItem("adminToken", "t");
    expect(hasSession("admin")).toBe(true);
  });
});


describe("clearUserSession", () => {
  it("clears all user session and local identity keys", () => {
    ["token", "loggedIn", "userEmail", "userSettings", "username"].forEach((key) => localStorage.setItem(key, "user-value"));
    clearUserSession();
    ["token", "loggedIn", "userEmail", "userSettings", "username"].forEach((key) => expect(localStorage.getItem(key)).toBeNull());
  });
});
