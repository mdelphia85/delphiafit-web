import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import App from "../App.jsx";

vi.mock("../components/AdaptiveCoachCard.jsx", () => ({ default: () => null }));
afterEach(() => {
  vi.restoreAllMocks();
  localStorage.removeItem("token");
});

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

  it("offers a sign-in route when the coaching history request has no authenticated session", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ detail: "Not authenticated" }),
    });

    render(<MemoryRouter initialEntries={["/ai-coach"]}><App /></MemoryRouter>);

    const signIn = await screen.findByRole("link", { name: "Sign in" });
    expect(signIn).toHaveAttribute("href", "/login");
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("reports a useful network error without clearing the signed-in session", async () => {
    localStorage.setItem("token", "valid-session");
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => [] })
      .mockRejectedValueOnce(new TypeError("Failed to fetch"));
    render(<MemoryRouter initialEntries={["/ai-coach"]}><App /></MemoryRouter>);
    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));
    fireEvent.change(screen.getByLabelText("Ask AI Coach"), { target: { value: "Workout?" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Unable to reach AI Coach");
    expect(localStorage.getItem("token")).toBe("valid-session");
  });

  it("reuses the same idempotency key when a network-failed submission is retried", async () => {
    localStorage.setItem("token", "valid-session");
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => [] })
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockRejectedValueOnce(new TypeError("Failed to fetch"));
    render(<MemoryRouter initialEntries={["/ai-coach"]}><App /></MemoryRouter>);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    fireEvent.change(screen.getByLabelText("Ask AI Coach"), { target: { value: "Workout?" } });

    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await screen.findByRole("alert");
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));

    expect(fetchMock.mock.calls[1][1].headers["Idempotency-Key"]).toBeTruthy();
    expect(fetchMock.mock.calls[2][1].headers["Idempotency-Key"])
      .toBe(fetchMock.mock.calls[1][1].headers["Idempotency-Key"]);
  });

  it("explains an idempotency conflict and retries with a fresh key", async () => {
    localStorage.setItem("token", "valid-session");
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => [] })
      .mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ detail: "Idempotency key was already used for a different request." }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ coach_response: "Fresh guidance", record_id: 8 }),
      })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => [] });
    render(<MemoryRouter initialEntries={["/ai-coach"]}><App /></MemoryRouter>);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    fireEvent.change(screen.getByLabelText("Ask AI Coach"), { target: { value: "Workout?" } });

    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("already used for different coaching details");
    const firstKey = fetchMock.mock.calls[1][1].headers["Idempotency-Key"];

    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByText("Fresh guidance")).toBeInTheDocument();
    const retryKey = fetchMock.mock.calls[2][1].headers["Idempotency-Key"];
    expect(retryKey).not.toBe(firstKey);
  });

  it("sends a coaching request once, saves the response, and refreshes the account history", async () => {
    localStorage.setItem("token", "valid-session");
    let resolveCoach;
    let savedHistory = [];
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation((url, options = {}) => {
      if (options.method === "POST") {
        return new Promise((resolve) => {
          resolveCoach = () => resolve({
            ok: true,
            status: 200,
            json: async () => ({ coach_response: "A practical session", record_id: 7 }),
          });
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => savedHistory,
      });
    });
    render(<MemoryRouter initialEntries={["/ai-coach"]}><App /></MemoryRouter>);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    fireEvent.change(screen.getByLabelText("Ask AI Coach"), { target: { value: "Bodyweight workout" } });

    const form = screen.getByLabelText("Ask AI Coach").closest("form");
    fireEvent.submit(form);
    fireEvent.submit(form);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const [url, options] = fetchMock.mock.calls[1];
    expect(String(url)).toMatch(/\/ai\/coach$/);
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe("Bearer valid-session");
    expect(JSON.parse(options.body).message).toBe("Bodyweight workout");

    savedHistory = [{ id: 7, feature: "coach", created_at: "2026-11-07T10:00:00Z", input: { message: "Bodyweight workout" }, result: { coach_response: "A practical session" } }];
    resolveCoach();
    expect(await screen.findByText("A practical session")).toBeInTheDocument();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
    expect(await screen.findByRole("button", { name: /Bodyweight workout/ })).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBe("valid-session");
  });
});
