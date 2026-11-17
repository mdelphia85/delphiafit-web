import { expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App.jsx";

it("exposes the landing actions as links and opens login", async () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  expect(screen.getByRole("link", { name: "Start Demo" })).toHaveAttribute("href", "/demo");
  expect(screen.getByRole("link", { name: "Create Account" })).toHaveAttribute("href", "/register");
  fireEvent.click(screen.getByRole("link", { name: "Login" }));
  expect(await screen.findByRole("heading", { name: "Login" })).toBeInTheDocument();
});

it("renders a way back from an unknown URL", () => {
  render(<MemoryRouter initialEntries={["/unknown-page"]}><App /></MemoryRouter>);
  expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Return to DelphiaFit" })).toHaveAttribute("href", "/");
});
