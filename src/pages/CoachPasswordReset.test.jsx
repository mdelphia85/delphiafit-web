import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import CoachPasswordReset from "./CoachPasswordReset.jsx";

afterEach(() => {
  vi.restoreAllMocks();
  window.history.replaceState({}, "", "/");
});

describe("CoachPasswordReset", () => {
  it("shows the API error when a reset token is rejected", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ detail: "Reset token expired" }),
    });
    window.history.replaceState({}, "", "/coach/password-reset#email=coach%40example.com&token=expired");

    render(
      <MemoryRouter initialEntries={["/coach/password-reset"]}>
        <CoachPasswordReset />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("New password (min 10 chars)"), {
      target: { value: "strong-password" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm new password"), {
      target: { value: "strong-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update Password" }));

    expect(await screen.findByText("Reset token expired")).toBeInTheDocument();
    expect(window.location.hash).toBe("");
  });
});
