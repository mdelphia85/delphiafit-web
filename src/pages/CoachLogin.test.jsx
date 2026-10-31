import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MenuContext } from "../context/MenuContext.jsx";
import CoachLogin from "./CoachLogin.jsx";

function renderLogin() {
  const setMenuOpen = vi.fn();
  render(
    <MenuContext.Provider value={{ setMenuOpen }}>
      <MemoryRouter initialEntries={["/coach-login"]}>
        <CoachLogin />
      </MemoryRouter>
    </MenuContext.Provider>
  );
  return setMenuOpen;
}

describe("CoachLogin", () => {
  it("has no Return Home link and opens the main menu from Return to Menu", () => {
    const setMenuOpen = renderLogin();
    expect(screen.queryByText("Return Home")).toBeNull();
    const link = screen.getByText("Return to Menu");
    expect(link).toHaveStyle({ position: "fixed", bottom: "20px", right: "20px" });
    fireEvent.click(link);
    expect(setMenuOpen).toHaveBeenCalledWith(true);
  });
});
