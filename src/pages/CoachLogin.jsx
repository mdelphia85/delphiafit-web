import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CoachLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setStatus("error");
      setErrorMessage("Enter your coach email and password.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/coach/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok || !data.access_token) {
        setStatus("error");
        setErrorMessage(data.detail || "Invalid coach credentials.");
        return;
      }

      localStorage.setItem("coachToken", data.access_token);
      localStorage.setItem("coachEmail", email);
      if (data.coach_id) localStorage.setItem("coachId", String(data.coach_id));
      if (data.team_id) localStorage.setItem("coachTeamId", String(data.team_id));

      navigate("/coach-dashboard");
    } catch (error) {
      setStatus("error");
      setErrorMessage("Coach login is unavailable. Please try again.");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#000",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      <div style={{ width: "360px", maxWidth: "100%", background: "#111", border: "1px solid #ec4899", borderRadius: "10px", padding: "24px", boxSizing: "border-box" }}>
        <div style={{ color: "#ec4899", fontSize: "26px", fontWeight: "700", textAlign: "center", marginBottom: "8px" }}>
          Coach Hub Login
        </div>
        <div style={{ color: "#999", fontSize: "13px", textAlign: "center", marginBottom: "24px" }}>
          Access only to your assigned team
        </div>

        <input
          type="email"
          placeholder="Coach email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setStatus("idle");
          }}
          style={{ width: "100%", padding: "12px", marginBottom: "12px", boxSizing: "border-box", background: "#000", color: "#fff", border: "1px solid #444", borderRadius: "6px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setStatus("idle");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleLogin();
          }}
          style={{ width: "100%", padding: "12px", marginBottom: "16px", boxSizing: "border-box", background: "#000", color: "#fff", border: "1px solid #444", borderRadius: "6px" }}
        />

        <button
          onClick={handleLogin}
          disabled={status === "loading"}
          style={{ width: "100%", padding: "12px", background: "#ec4899", color: "#000", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}
        >
          {status === "loading" ? "Signing in..." : "Sign In"}
        </button>

        <div onClick={() => navigate("/coach/password-reset")} style={{ color: "#ec4899", textDecoration: "underline", textAlign: "center", marginTop: "16px", cursor: "pointer", fontSize: "13px" }}>
          Forgot password?
        </div>

        {status === "error" && <div style={{ color: "#f87171", fontSize: "13px", marginTop: "12px", textAlign: "center" }}>{errorMessage}</div>}

        <div style={{ color: "#777", fontSize: "12px", textAlign: "center", marginTop: "18px" }}>
          Coach access is created by invitation.
        </div>

        <div onClick={() => navigate("/")} style={{ color: "#ec4899", textDecoration: "underline", textAlign: "center", marginTop: "20px", cursor: "pointer", fontSize: "13px" }}>
          Return Home
        </div>
      </div>
    </div>
  );
}
