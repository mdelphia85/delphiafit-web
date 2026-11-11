import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MenuContext } from "../context/MenuContext.js";
import { apiRequest } from "../utils/api.js";
import MyTrainer, { CLIENT_TRAINER_COLOR } from "./MyTrainer.jsx";

vi.mock("../utils/api.js", () => ({ apiRequest: vi.fn() }));

function mount() {
  const setMenuOpen = vi.fn();
  render(
    <MenuContext.Provider value={{ setMenuOpen }}>
      <MemoryRouter>
        <MyTrainer />
      </MemoryRouter>
    </MenuContext.Provider>
  );
  return setMenuOpen;
}

beforeEach(() => vi.resetAllMocks());

describe("My Trainer client-consent screen", () => {
  it("shows pending invitations and requires the client to accept", async () => {
    apiRequest.mockImplementation((url, opts = {}) => {
      if (url === "/trainer/invitations")
        return Promise.resolve({ invitations: [{ id: 27, trainer_name: "Trainer A" }] });
      if (url === "/trainer/my-trainers") return Promise.resolve({ trainers: [] });
      if (url === "/trainer/invitations/27/accept" && opts.method === "POST")
        return Promise.resolve({ status: "active" });
      throw new Error("unexpected request " + url);
    });
    const menu = mount();
    expect(await screen.findByText("Trainer A")).toBeInTheDocument();
    expect(screen.getByText(/Accepting lets this trainer view your saved workout history/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Accept" }));
    await waitFor(() => expect(apiRequest).toHaveBeenCalledWith("/trainer/invitations/27/accept", { method: "POST" }));
    const link = screen.getByRole("button", { name: "Return to Menu" });
    expect(link).toHaveStyle({ position: "fixed", bottom: "20px", right: "20px", color: CLIENT_TRAINER_COLOR });
    fireEvent.click(link);
    expect(menu).toHaveBeenCalledWith(true);
  });
});
