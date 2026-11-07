import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import App from "../App.jsx";

vi.mock("../components/AdaptiveCoachCard.jsx", () => ({ default: () => null }));

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
    vi.restoreAllMocks();
  });
});
