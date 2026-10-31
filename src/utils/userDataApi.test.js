import { describe, expect, it, vi, beforeEach } from "vitest";
import { userDataApi } from "./userDataApi.js";

describe("userDataApi", () => {
  beforeEach(() => {
    localStorage.setItem("token", "user-token");
    vi.restoreAllMocks();
  });

  it("loads and persists per-user collection records through the shared authenticated API", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, status: 201, json: async () => ({ id: 1, data: { text: "note" } }) });
    await userDataApi.create("journal", { text: "note" });
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain("/user-data/journal");
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe("Bearer user-token");
    expect(JSON.parse(options.body)).toEqual({ data: { text: "note" } });
  });
});
