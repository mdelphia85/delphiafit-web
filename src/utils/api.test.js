import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiRequest, ApiError, hasSession, clearUserSession } from "./api.js";

const realLocation = window.location;

describe("apiRequest", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(window, "location", { configurable: true, value: realLocation });
    vi.useRealTimers();
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

  it("clears a rejected user token and routes to sign-in once", async () => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { pathname: "/ai-coach", assign: vi.fn() },
    });
    localStorage.setItem("token", "expired-token");
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ detail: "Invalid or expired token" }),
    });

    await expect(apiRequest("/ai/records")).rejects.toMatchObject({ status: 401 });

    expect(localStorage.getItem("token")).toBeNull();
    expect(window.location.assign).toHaveBeenCalledTimes(1);
    expect(window.location.assign).toHaveBeenCalledWith("/login");
  });

  it("does not redirect repeatedly when an expired session is already on sign-in", async () => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { pathname: "/login", assign: vi.fn() },
    });
    localStorage.setItem("token", "expired-token");
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ detail: "Invalid or expired token" }),
    });

    await expect(apiRequest("/ai/records")).rejects.toMatchObject({ status: 401 });

    expect(localStorage.getItem("token")).toBeNull();
    expect(window.location.assign).not.toHaveBeenCalled();
  });

  it("preserves a valid session on temporary network errors", async () => {
    localStorage.setItem("token", "still-valid");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(apiRequest("/ai/records")).rejects.toThrow("Failed to fetch");

    expect(localStorage.getItem("token")).toBe("still-valid");
  });

  it("aborts timed out requests and reports a stable timeout error", async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, "fetch").mockImplementation((_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    }));

    const request = apiRequest("/ai/coach", { method: "POST", timeoutMs: 1000 });
    const rejection = expect(request).rejects.toMatchObject({ status: 0, message: "Request timed out." });
    await vi.advanceTimersByTimeAsync(1000);

    await rejection;
  });

  it("keeps the timeout active while reading the response body", async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, "fetch").mockImplementation(async (_url, options) => ({
      ok: true,
      json: () => new Promise((_resolve, reject) => {
        const abort = () => reject(new DOMException("Aborted", "AbortError"));
        if (options.signal.aborted) abort();
        else options.signal.addEventListener("abort", abort);
      }),
    }));

    const request = apiRequest("/ai/records", { timeoutMs: 1000 });
    const rejection = expect(request).rejects.toMatchObject({ status: 0, message: "Request timed out." });
    await vi.advanceTimersByTimeAsync(1000);

    await rejection;
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
