import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MenuContext } from "../context/MenuContext.js";
import Profile from "./Profile.jsx";

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("Profile date of birth", () => {
  it("saves the browser's ISO date string and reloads the persisted date", async () => {
    localStorage.setItem("token", "user-token");
    let savedDob = null;
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (url, options = {}) => {
      if (String(url).endsWith("/profile/get")) {
        return { ok: true, status: 200, json: async () => ({ dob: savedDob }) };
      }
      if (String(url).endsWith("/profile/update")) {
        savedDob = JSON.parse(options.body).dob;
        return { ok: true, status: 200, json: async () => ({ success: true, dob: savedDob }) };
      }
      throw new Error(`Unexpected request: ${url}`);
    });
    const menu = { openMenu: vi.fn() };
    const view = render(<MenuContext.Provider value={menu}><MemoryRouter><Profile /></MemoryRouter></MenuContext.Provider>);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/profile/get"), expect.anything()));
    const dob = document.querySelector('input[type="date"]');
    fireEvent.change(dob, { target: { value: "1992-03-04" } });
    fireEvent.click(screen.getByText("Save Profile"));
    expect(await screen.findByRole("status")).toHaveTextContent("Profile saved.");
    expect(JSON.parse(fetchMock.mock.calls.find(([, options]) => options?.method === "POST")[1].body).dob).toBe("1992-03-04");

    view.unmount();
    render(<MenuContext.Provider value={menu}><MemoryRouter><Profile /></MemoryRouter></MenuContext.Provider>);
    await waitFor(() => expect(document.querySelector('input[type="date"]')).toHaveValue("1992-03-04"));
  });
});
