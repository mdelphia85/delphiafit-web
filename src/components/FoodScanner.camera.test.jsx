import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FoodScanner from "./FoodScanner.jsx";

const goodProduct = {
  barcode: "3017620422003",
  product_name: "Camera Test Product",
  nutrition_unit: "g",
  nutrition_per_100g_or_100ml: {
    calories_kcal: 90, protein_g: 4, carbs_g: 12, fat_g: 3,
    saturated_fat_g: 1, sugars_g: 5, fiber_g: 2, sodium_mg: 30,
  },
  nutri_score_grade: "c",
  score_status: "standard-derived",
  delphiafit_score_0_100: 50,
  data_completeness_percent: 100,
  source: { url: "https://world.openfoodfacts.org/product/3017620422003" },
};
const response = (value) => ({ ok: true, status: 200, json: async () => value });
const descriptor = (object, key) => Object.getOwnPropertyDescriptor(object, key);
const secureDescriptor = descriptor(window, "isSecureContext");
const mediaDescriptor = descriptor(navigator, "mediaDevices");

function configureCamera(mediaDevices) {
  Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: mediaDevices,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (secureDescriptor) Object.defineProperty(window, "isSecureContext", secureDescriptor);
  else delete window.isSecureContext;
  if (mediaDescriptor) Object.defineProperty(navigator, "mediaDevices", mediaDescriptor);
  else delete navigator.mediaDevices;
  localStorage.removeItem("token");
});

describe("Food scanner camera", () => {
  it("explains unsupported iPhone-style barcode detection and retains manual entry", async () => {
    localStorage.setItem("token", "test-session");
    const getUserMedia = vi.fn();
    configureCamera({ getUserMedia });
    // Safari on iOS has no built-in BarcodeDetector API.
    delete window.BarcodeDetector;
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response([]));
    render(<MemoryRouter><FoodScanner /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Scan with camera" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "This browser does not support live barcode detection"
    );
    expect(screen.getByLabelText("EAN / UPC barcode")).toBeInTheDocument();
    expect(getUserMedia).not.toHaveBeenCalled();
  });

  it("reports a denied camera permission and leaves manual entry available", async () => {
    localStorage.setItem("token", "test-session");
    const denied = Object.assign(new Error("Denied"), { name: "NotAllowedError" });
    const getUserMedia = vi.fn().mockRejectedValue(denied);
    configureCamera({ getUserMedia });
    vi.stubGlobal("BarcodeDetector", class {
      static async getSupportedFormats() { return ["ean_13"]; }
      async detect() { return []; }
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response([]));
    render(<MemoryRouter><FoodScanner /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Scan with camera" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Camera permission was denied");
    expect(screen.getByRole("button", { name: "Scan with camera" })).toBeInTheDocument();
    expect(screen.getByLabelText("EAN / UPC barcode")).toBeInTheDocument();
    expect(getUserMedia).toHaveBeenCalledTimes(1);
  });

  it("decodes a barcode, closes the camera and looks up the product without logging food", async () => {
    localStorage.setItem("token", "test-session");
    const stop = vi.fn();
    const getUserMedia = vi.fn().mockResolvedValue({ getTracks: () => [{ stop }] });
    configureCamera({ getUserMedia });
    vi.stubGlobal("BarcodeDetector", class {
      static async getSupportedFormats() { return ["ean_13"]; }
      async detect() { return [{ rawValue: "3017620422003" }]; }
    });
    vi.stubGlobal("requestAnimationFrame", (callback) => {
      queueMicrotask(() => callback());
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const calls = [];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url, options = {}) => {
      calls.push({ url: String(url), options });
      if (String(url).endsWith("/nutrition-scanner/history")) return response([]);
      if (String(url).endsWith("/nutrition-scanner/product/3017620422003")) return response(goodProduct);
      throw new Error("Unexpected scanner request");
    });
    render(<MemoryRouter><FoodScanner /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: "Scan with camera" }));
    expect(await screen.findByText("Camera Test Product")).toBeInTheDocument();
    expect(screen.getByLabelText("EAN / UPC barcode")).toHaveValue("3017620422003");
    expect(await screen.findByRole("button", { name: "Scan with camera" })).toBeInTheDocument();
    await waitFor(() => expect(stop).toHaveBeenCalledTimes(1));
    expect(calls.filter((c) => c.url.endsWith("/nutrition/") && c.options.method === "POST")).toHaveLength(0);
  });
});
