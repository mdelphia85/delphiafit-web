import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import ResetPassword from "./ResetPassword.jsx";

const ok = (body, status = 200) => ({ ok: status < 400, status, json: async () => body });
beforeEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

describe("authentication flow", () => {
  it("registers against the auth API and then logs in to a persistent user session", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(ok({ id: 4, name: "Test User" })).mockResolvedValueOnce(ok({ access_token: "signed-token", token_type: "bearer" }));
    render(<MemoryRouter initialEntries={["/register"]}><Routes><Route path="/register" element={<Register />} /><Route path="/login" element={<Login />} /><Route path="/home" element={<div>Home destination</div>} /></Routes></MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "Test User" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Password/), { target: { value: "StrongPass123!" } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/auth/register"), expect.objectContaining({ method: "POST" })));
    await waitFor(() => expect(screen.getByPlaceholderText("Password")).toBeInTheDocument(), { timeout: 5000 });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "StrongPass123!" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(await screen.findByText("Home destination")).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBe("signed-token");
    expect(localStorage.getItem("loggedIn")).toBe("true");
  });

  it("prefills and submits the reset link token using the backend contract", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(ok({ message: "Password reset successful" }));
    window.history.replaceState({}, "", "/reset-password#email=reset%40example.com&token=token12345");
    render(<MemoryRouter initialEntries={["/reset-password"]}><Routes><Route path="/reset-password" element={<ResetPassword />} /></Routes></MemoryRouter>);
    expect(screen.getByPlaceholderText("Your Email")).toHaveValue("reset@example.com");
    expect(screen.getByPlaceholderText("Reset Token")).toHaveValue("token12345");
    fireEvent.change(screen.getByPlaceholderText("New Password (min 10 chars)"), { target: { value: "NewStrongPass123!" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm New Password"), { target: { value: "NewStrongPass123!" } });
    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("/auth/reset-password"), expect.objectContaining({ method: "POST", body: expect.stringContaining("new_password") })));
    expect(await screen.findByText("Password Updated!")).toBeInTheDocument();
    expect(window.location.hash).toBe("");
  });

  it("shows an auth error and does not create a session when login fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(ok({ detail: "Invalid email or password" }, 401));
    render(<MemoryRouter><Login /></MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(await screen.findByText("Invalid email or password.")).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
