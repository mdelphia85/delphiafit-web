import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTacticalProgress } from "./useTacticalProgress.js";

function jsonResponse(data, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => data };
}

describe("useTacticalProgress", () => {
  beforeEach(() => {
    localStorage.setItem("token", "user-token");
  });

  it("loads and saves per-user progress through the authenticated API", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ module: "k9-operations", data: [{ id: 1, completed: true }] }))
      .mockResolvedValueOnce(jsonResponse({ module: "k9-operations", data: [{ id: 1, completed: false }] }));
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useTacticalProgress("k9-operations", "old-k9", [{ id: 1, completed: false }]));

    await waitFor(() => expect(result.current[0][0].completed).toBe(true));
    await act(async () => result.current[1]([{ id: 1, completed: false }]));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer user-token");
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toMatchObject({ item_key: "state", data: [{ id: 1, completed: false }] });
  });

  it("imports legacy local progress once when the server has no record", async () => {
    const legacy = [{ id: 7, completed: true }];
    localStorage.setItem("legacy-k9", JSON.stringify(legacy));
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ module: "k9-operations", data: null }))
      .mockResolvedValueOnce(jsonResponse({ module: "k9-operations", data: legacy }))
      .mockResolvedValueOnce(jsonResponse({ module: "k9-operations", data: legacy }));
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useTacticalProgress("k9-operations", "legacy-k9", []));

    await waitFor(() => expect(result.current[0]).toEqual(legacy));
    await waitFor(() => expect(localStorage.getItem("legacy-k9")).toBeNull());
    expect(fetchMock.mock.calls[1][1].method).toBe("PUT");
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).data).toEqual(legacy);
  });
});
