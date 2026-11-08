import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import DemoDashboard from "./DemoDashboard.jsx";

function CurrentPath() {
  const location = useLocation();
  return <div data-testid="current-path">{location.pathname}</div>;
}

describe("DemoDashboard", () => {
  it("navigates to demo workouts through the router", () => {
    render(
      <MemoryRouter initialEntries={["/demo"]}>
        <Routes>
          <Route path="/demo" element={<DemoDashboard />} />
          <Route path="/demo/workouts" element={<div>Workout demo</div>} />
        </Routes>
        <CurrentPath />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Try Demo Mode" }));
    fireEvent.click(screen.getByText("View sample training sessions"));

    expect(screen.getByText("Workout demo")).toBeInTheDocument();
    expect(screen.getByTestId("current-path")).toHaveTextContent("/demo/workouts");
  });
});
