import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MenuContext } from "../context/MenuContext.js";
import { apiRequest } from "../utils/api.js";
import TrainerClients, { TRAINER_COLOR } from "./TrainerClients.jsx";

vi.mock("../utils/api.js", () => ({
  ApiError: class ApiError extends Error { constructor(message, status) { super(message); this.status = status; } },
  apiRequest: vi.fn()
}));

function mount() {
  const setMenuOpen = vi.fn();
  render(
    <MenuContext.Provider value={{ setMenuOpen }}>
      <MemoryRouter>
        <TrainerClients />
      </MemoryRouter>
    </MenuContext.Provider>
  );
  return setMenuOpen;
}

beforeEach(() => vi.resetAllMocks());

describe("personal trainer My Clients", () => {
  it("does not require Coach Hub credentials for a regular member's access screen", async () => {
    apiRequest.mockResolvedValueOnce({ is_trainer: false });
    const menu = mount();
    expect(await screen.findByText(/personal trainer access hasn't been enabled/i)).toBeInTheDocument();
    expect(screen.queryByText("Sign in to Coach Hub")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "My Clients" })).toHaveStyle({ fontSize: "40px", lineHeight: "1.2", marginBottom: "12px" });
    expect(apiRequest).toHaveBeenCalledWith("/trainer/me");
    expect(apiRequest).not.toHaveBeenCalledWith("/staff/clients");
    const link = screen.getByRole("button", { name: "Return to Menu" });
    expect(link).toHaveStyle({ position: "fixed", right: "20px", bottom: "20px", color: TRAINER_COLOR, textDecoration: "none" });
    fireEvent.click(link);
    expect(menu).toHaveBeenCalledWith(true);
  });

  it("shows only the signed-in personal trainer's clients and pending consent status", async () => {
    apiRequest.mockImplementation((url) => {
      if (url === "/trainer/me") return Promise.resolve({ is_trainer: true });
      if (url === "/trainer/clients") return Promise.resolve({
        clients: [
          { id: 1, name: "Ada", email: "ada@example.com", status: "active" },
          { id: 2, name: "Grace", email: "grace@example.com", status: "pending" }
        ]
      });
      if (url === "/trainer/clients/1/progress") return Promise.resolve({
        workouts: [{ id: 8, name: "Strength", duration_minutes: 35, date: "2026-11-10T09:00:00" }]
      });
      throw new Error("Unexpected request " + url);
    });
    mount();
    expect(await screen.findByText("Ada")).toBeInTheDocument();
    expect(screen.getByText("Grace")).toBeInTheDocument();
    expect(screen.getByText("Awaiting client acceptance")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "View Progress" })).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "View Progress" }));
    expect(await screen.findByText("Strength")).toBeInTheDocument();
    await waitFor(() => expect(apiRequest).toHaveBeenCalledWith("/trainer/clients/1/progress"));
    expect(apiRequest).not.toHaveBeenCalledWith("/staff/clients");
  });
});
