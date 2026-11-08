import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import CoachInviteAccept from "./CoachInviteAccept.jsx";

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  window.history.replaceState({}, "", "/");
});

function mockApi(lookupResponse) {
  const calls = [];
  globalThis.fetch = vi.fn(async (url, init = {}) => {
    calls.push({
      url: String(url),
      method: init.method,
      body: init.body ? JSON.parse(init.body) : undefined,
      headers: init.headers,
    });
    const isLookup = String(url).includes("/staff/invitations/lookup");
    return {
      ok: true,
      status: 200,
      json: async () => isLookup ? lookupResponse : { message: "Invitation accepted" },
    };
  });
  return calls;
}

describe("CoachInviteAccept", () => {
  it("looks up a fragment token through POST and removes it from the browser URL", async () => {
    const token = "synthetic-invitation-marker";
    const calls = mockApi({ email: "new-coach@example.com", role: "coach", existing_coach: false });
    window.history.replaceState({}, "", `/invite#token=${token}`);

    render(
      <MemoryRouter initialEntries={["/invite"]}>
        <CoachInviteAccept />
      </MemoryRouter>,
    );

    await screen.findByText("Invitation for new-coach@example.com");
    expect(window.location.hash).toBe("");
    expect(calls[0].method).toBe("POST");
    expect(calls[0].url).not.toContain(token);
    expect(calls[0].body).toEqual({ token });

    fireEvent.change(screen.getByPlaceholderText("Full name"), { target: { value: "New Coach" } });
    fireEvent.change(screen.getByPlaceholderText("Password (min 10 chars)"), { target: { value: "strong-password" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "strong-password" } });
    fireEvent.click(screen.getByRole("button", { name: "Accept Invitation" }));

    await waitFor(() => expect(calls).toHaveLength(2));
    expect(calls[1].url).not.toContain(token);
    expect(calls[1].body).toEqual({ invitation_token: token, name: "New Coach", password: "strong-password" });
  });

  it("accepts an existing-coach invitation without sending profile or password fields", async () => {
    const token = "existing-coach-marker";
    localStorage.setItem("coachToken", "existing-coach-session");
    const calls = mockApi({ email: "coach@example.com", role: "coach", existing_coach: true });
    window.history.replaceState({}, "", `/invite#token=${token}`);

    render(
      <MemoryRouter initialEntries={["/invite"]}>
        <CoachInviteAccept />
      </MemoryRouter>,
    );

    await screen.findByText("This invitation will not change your password or coach profile.");
    fireEvent.click(screen.getByRole("button", { name: "Accept Invitation" }));

    await waitFor(() => expect(calls).toHaveLength(2));
    expect(calls[1].method).toBe("POST");
    expect(calls[1].url).not.toContain(token);
    expect(calls[1].body).toEqual({ invitation_token: token });
    expect(calls[1].headers.Authorization).toBe("Bearer existing-coach-session");
  });
});
