import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import App from "../App.jsx";

vi.mock("../components/AdaptiveCoachCard.jsx", () => ({ default: () => null }));
afterEach(() => vi.restoreAllMocks());

function CurrentLocation() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

describe("AI Coach navigation", () => {
  it("opens the menu without leaving the coach or losing the draft", () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, status: 200, json: async () => [] });
    render(<MemoryRouter initialEntries={["/home", "/ai-coach"]} initialIndex={1}><App /><CurrentLocation /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText("Ask AI Coach"), { target: { value: "My training question" } });
    expect(screen.queryByText("Protein")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Return to Menu" }));

    expect(screen.getByText("Protein")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/ai-coach");
    expect(screen.getByRole("heading", { name: "AI Coach" })).toBeInTheDocument();
    expect(screen.getByLabelText("Ask AI Coach")).toHaveValue("My training question");
  });

  it("omits an invalid category and restores the correct metadata for saved answers", async () => {
    const saved = [{ id: 1, feature: "coach", created_at: "2026-11-06T12:00:00Z", input: { message: "Earlier question" }, result: { coach_response: "Earlier advice", adaptive_inputs: { workouts_logged: 2, preferred_category: "Strength" } } }];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url, options = {}) => ({
      ok: true, status: 200,
      json: async () => options.method === "POST"
        ? { coach_response: "New advice", adaptive_inputs: { workouts_logged: 1, preferred_category: "undefined" } }
        : saved
    }));
    render(<MemoryRouter initialEntries={["/ai-coach"]}><App /></MemoryRouter>);
    const savedButton = await screen.findByRole("button", { name: /Earlier question/ });
    fireEvent.change(screen.getByLabelText("Ask AI Coach"), { target: { value: "Training question" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByText("New advice")).toBeInTheDocument();
    expect(screen.queryByText(/favours undefined/)).not.toBeInTheDocument();
    fireEvent.click(savedButton);
    expect(screen.getByText("Earlier advice")).toBeInTheDocument();
    expect(screen.getByText(/2 workouts logged, favours Strength/)).toBeInTheDocument();
  });
});
