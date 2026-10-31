import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MenuContext } from "../context/MenuContext.jsx";
import NutritionPro from "./NutritionPro.jsx";

const json = (body, status = 200) => ({ ok: status < 400, status, json: async () => body });

beforeEach(() => { localStorage.setItem("token", "test-token"); vi.restoreAllMocks(); });

describe("NutritionPro", () => {
  it("loads user settings and targets, saves preferences, and persists generated plans", async () => {
    const savedSettings = { goal_type: "maintain", target_weight: null, weekly_rate: 0, goal_unit: "lbs", diet: "none", avoid: [], meals_per_day: 5, allergens: ["dairy", "nuts"] };
    const targets = { status: "ready", effective: { calories: 2100, protein_g: 150, carbs_g: 220, fat_g: 70, source: "estimate" }, missing: [] };
    const plan = { meals: [{ name: "Meal 1" }], totals: { calories: 2100 } };
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (url, options = {}) => {
      if (String(url).endsWith("/nutrition-coach/settings") && options.method === "PUT") return json(savedSettings);
      if (String(url).endsWith("/nutrition-coach/settings")) return json(savedSettings);
      if (String(url).endsWith("/nutrition-coach/targets")) return json(targets);
      if (String(url).endsWith("/nutrition-coach/meal-plans/generate")) return json({ id: 8, created_at: "2026-01-01T00:00:00Z", plan });
      if (String(url).endsWith("/nutrition-coach/meal-plans")) return json([]);
      throw new Error(`Unexpected request: ${url}`);
    });
    render(<MenuContext.Provider value={{ setMenuOpen: vi.fn() }}><MemoryRouter><NutritionPro /></MemoryRouter></MenuContext.Provider>);
    expect(await screen.findByText(/2100 kcal/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Save preferences" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/nutrition-coach/settings"), expect.objectContaining({ method: "PUT" })));
    fireEvent.click(screen.getByRole("button", { name: "Generate and save plan" }));
    expect(await screen.findByText(/Meal 1/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/nutrition-coach/meal-plans/generate"), expect.objectContaining({ method: "POST" }));
  });

  it("shows authentication failures rather than inventing nutrition values", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(json({ detail: "Invalid or expired token" }, 401));
    render(<MenuContext.Provider value={{ setMenuOpen: vi.fn() }}><MemoryRouter><NutritionPro /></MemoryRouter></MenuContext.Provider>);
    expect(await screen.findByRole("alert")).toHaveTextContent(/log in/i);
    expect(screen.queryByText(/kcal ·/)).not.toBeInTheDocument();
  });
});

