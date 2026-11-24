import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FoodScanner from "./FoodScanner.jsx";
import NutritionPro from "../pages/NutritionPro.jsx";
import { MenuProvider } from "../context/MenuContext.jsx";

const sample = {
  barcode: "0012345678905",
  product_name: "Plain Test Yogurt",
  brands: "Example",
  serving_size: "125 g",
  quantity: "500 g",
  nutrition_unit: "g",
  nutrition_per_100g_or_100ml: {
    calories_kcal: 80, protein_g: 8, carbs_g: 7, fat_g: 2,
    saturated_fat_g: 1, sugars_g: 5, fiber_g: 1, sodium_mg: 50
  },
  delphiafit_score_0_100: 90,
  nutri_score_grade: "a",
  score_status: "standard-derived",
  score_note: "Nutri-Score-derived index with five levels.",
  score_factors: [],
  score_methodology: {
    version: "1.0", formula: "A=90, B=70, C=50, D=30, E=10.",
    limits: "This is not a medical health rating.",
    standard_url: "https://www.santepubliquefrance.fr/en/nutrition-and-physical-activity/nutri-score"
  },
  data_completeness_percent: 100,
  allergens: ["milk"], traces: [], additives: [],
  ingredients_text: "Milk, live cultures",
  source: { name: "Open Food Facts", url: "https://world.openfoodfacts.org/product/0012345678905" },
};

const response = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.removeItem("token");
});

describe("FoodScanner", () => {
  it("looks up a product without logging consumption, then logs one explicit portion", async () => {
    localStorage.setItem("token", "example-token");
    const calls = [];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url, options = {}) => {
      calls.push({ url: String(url), options });
      if (String(url).endsWith("/nutrition-scanner/history")) return response([]);
      if (String(url).endsWith("/nutrition-scanner/product/0012345678905")) return response(sample);
      if (String(url).endsWith("/nutrition/") && options.method === "POST") {
        return response({ id: 42, recorded_at: new Date().toISOString(), ...JSON.parse(options.body) });
      }
      return response({ detail: "Not found" }, 404);
    });
    render(<MemoryRouter><FoodScanner /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText("EAN / UPC barcode"), { target: { value: "0012345678905" } });
    fireEvent.click(screen.getByRole("button", { name: "Look up product" }));
    expect(await screen.findByText("Plain Test Yogurt")).toBeInTheDocument();
    expect(screen.getByText("90 / 100")).toBeInTheDocument();
    expect(screen.getByText("Provider Nutri-Score")).toBeInTheDocument();
    expect(screen.getByText(/five grade levels/)).toBeInTheDocument();
    expect(calls.filter((c) => c.url.endsWith("/nutrition/") && c.options.method === "POST")).toHaveLength(0);
    fireEvent.change(screen.getByLabelText("Amount consumed"), { target: { value: "150" } });
    fireEvent.click(screen.getByRole("button", { name: "Log consumed amount" }));
    expect(await screen.findByText(/Food logged once to today's nutrition totals/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Logged to today's totals" })).toHaveAttribute("aria-disabled", "true");
    const writes = calls.filter((c) => c.url.endsWith("/nutrition/") && c.options.method === "POST");
    expect(writes).toHaveLength(1);
    expect(JSON.parse(writes[0].options.body)).toMatchObject({ calories: 120, protein: 12, carbs: 11, fats: 3 });
    expect(writes[0].options.headers.Authorization).toBe("Bearer example-token");
  });

  it("retries a timed-out or uncertain log with the same server idempotency key", async () => {
    vi.stubGlobal("crypto", { getRandomValues: globalThis.crypto.getRandomValues.bind(globalThis.crypto) });
    localStorage.setItem("token", "example-token");
    const writes = [];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url, options = {}) => {
      const path = String(url);
      if (path.endsWith("/nutrition-scanner/history")) return response([]);
      if (path.endsWith("/nutrition-scanner/product/0012345678905")) return response(sample);
      if (path.endsWith("/nutrition/") && options.method === "POST") {
        writes.push(options);
        if (writes.length === 1) throw new Error("Connection dropped after server accepted request");
        return response({ id: 501, recorded_at: new Date().toISOString(), ...JSON.parse(options.body) });
      }
      return response({ detail: "Not found" }, 404);
    });
    render(<MemoryRouter><FoodScanner /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText("EAN / UPC barcode"), { target: { value: "0012345678905" } });
    fireEvent.click(screen.getByRole("button", { name: "Look up product" }));
    expect(await screen.findByText("Plain Test Yogurt")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Amount consumed"), { target: { value: "150" } });
    fireEvent.click(screen.getByRole("button", { name: "Log consumed amount" }));
    expect(await screen.findByText(/food log could not be confirmed/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Log consumed amount" }));
    expect(await screen.findByText(/Food logged once to today's nutrition totals/)).toBeInTheDocument();
    expect(writes).toHaveLength(2);
    expect(writes[0].headers["Idempotency-Key"]).toMatch(/^[a-f0-9]{32}$/i);
    expect(writes[1].headers["Idempotency-Key"]).toBe(writes[0].headers["Idempotency-Key"]);
    expect(writes[1].body).toBe(writes[0].body);
  });

  it("does not invent ratings or allow logging when required macro data is missing", async () => {
    localStorage.setItem("token", "example-token");
    const incomplete = {
      ...sample,
      delphiafit_score_0_100: null,
      score_status: "unrated",
      score_factors: [],
      nutrition_unit: null,
      nutrition_per_100g_or_100ml: { ...sample.nutrition_per_100g_or_100ml, protein_g: null }
    };
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
      if (String(url).endsWith("/nutrition-scanner/history")) return response([]);
      return response(incomplete);
    });
    render(<MemoryRouter><FoodScanner /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText("EAN / UPC barcode"), { target: { value: "0012345678905" } });
    fireEvent.click(screen.getByRole("button", { name: "Look up product" }));
    expect(await screen.findByText("Unrated")).toBeInTheDocument();
    expect(screen.getByText(/automatic logging is unavailable/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log consumed amount" })).toHaveAttribute("aria-disabled", "true");
    expect(fetchMock.mock.calls.filter(([url, opts]) => String(url).endsWith("/nutrition/") && opts?.method === "POST")).toHaveLength(0);
  });

  it("never displays a legacy experimental numeric score as production-rated", async () => {
    localStorage.setItem("token", "example-token");
    const oldResponse = {
      ...sample,
      delphiafit_score_0_100: 86,
      score_status: "experimental",
    };
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url) =>
      String(url).endsWith("/nutrition-scanner/history") ? response([]) : response(oldResponse)
    );
    render(<MemoryRouter><FoodScanner /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText("EAN / UPC barcode"), {
      target: { value: "0012345678905" }
    });
    fireEvent.click(screen.getByRole("button", { name: "Look up product" }));
    expect(await screen.findByText("Unrated")).toBeInTheDocument();
    expect(screen.queryByText("86 / 100")).not.toBeInTheDocument();
  });

  it("navigates from Nutrition Pro planner into the scanner without adding a separate menu page", async () => {
    localStorage.setItem("token", "example-token");
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
      const path = String(url);
      if (path.endsWith("/nutrition-coach/settings")) return response({ goal_type: "maintain", avoid: [], diet: "none", meals_per_day: 3 });
      if (path.endsWith("/nutrition-coach/targets")) return response({ status: "incomplete", missing: ["weight"] });
      if (path.endsWith("/nutrition-coach/meal-plans")) return response([]);
      if (path.endsWith("/nutrition-scanner/history")) return response([]);
      return response({});
    });
    render(<MemoryRouter initialEntries={["/nutrition-pro"]}><MenuProvider><NutritionPro /></MenuProvider></MemoryRouter>);
    fireEvent.change(screen.getByLabelText("Nutrition section"), { target: { value: "scanner" } });
    expect(await screen.findByRole("heading", { name: "Scan & analyze food" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Plan preferences" })).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText("Nutrition section")).toHaveValue("scanner"));
  });
});
