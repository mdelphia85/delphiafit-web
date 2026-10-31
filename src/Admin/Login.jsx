import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config/api";
import { ADMIN_TOKEN_KEY } from "./adminApi.js";

export default function AdminLogin() {
  const navigate = useNavigate();

  const BG = "rgb(0,0,0)";
  const CARD_BG = "rgb(15,15,15)";
  const BORDER = "rgb(60,60,60)";
  const TEXT_MAIN = "rgb(240,240,240)";
  const TEXT_MUTED = "rgb(160,160,160)";
  const ACCENT = "rgb(128,0,128)";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event?.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password })
      });

      if (!res.ok) {
        setError(res.status === 403 ? "This account does not have admin access." : "Invalid admin credentials.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem(ADMIN_TOKEN_KEY, data.access_token);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Server error — unable to log in.");
    }

    setLoading(false);
  }

  const container = {
    width: "100vw",
    height: "100vh",
    backgroundColor: BG,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: TEXT_MAIN
  };

  const card = {
    backgroundColor: CARD_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: "10px",
    padding: "30px",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxSizing: "border-box"
  };

  const title = {
    fontSize: "24px",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "10px"
  };

  const input = {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: `1px solid ${BORDER}`,
    backgroundColor: "rgb(20,20,20)",
    color: TEXT_MAIN,
    boxSizing: "border-box"
  };

  const button = {
    width: "100%",
    padding: "12px",
    backgroundColor: ACCENT,
    border: "none",
    borderRadius: "6px",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
    opacity: loading ? 0.6 : 1
  };

  const subtitle = {
    fontSize: "14px",
    color: TEXT_MUTED,
    textAlign: "center"
  };

  return (
    <div style={container}>
      <form style={card} onSubmit={handleLogin}>
        <div style={title}>Admin Login</div>
        <div style={subtitle}>Access to the DelphiaFit admin panel</div>

        <input
          style={input}
          type="email"
          placeholder="Admin Email"
          aria-label="Admin Email"
          autoComplete="username"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          style={input}
          type="password"
          placeholder="Admin Password"
          aria-label="Admin Password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && <div role="alert" style={{ color: "red", fontSize: "14px" }}>{error}</div>}

        <button style={button} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
