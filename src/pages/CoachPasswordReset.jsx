import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CoachPasswordReset() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function requestReset() {
    if (!email.includes("@")) {
      setStatus("error");
      setMessage("Enter a valid coach email.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/coach/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!res.ok) throw new Error();
      setStatus("success");
      setMessage("If that coach account exists, reset instructions have been sent.");
    } catch (error) {
      setStatus("error");
      setMessage("Unable to request a reset link right now.");
    }
  }

  async function resetPassword() {
    if (!token || password.length < 10 || password !== confirmPassword) {
      setStatus("error");
      setMessage(!token ? "Enter the reset token from your email." : password !== confirmPassword ? "Passwords do not match." : "Password must be at least 10 characters.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/coach/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, new_password: password })
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.detail || "Reset failed.");
      setStatus("success");
      setMessage("Password updated. Redirecting to Coach Login...");
      setTimeout(() => navigate("/coach-login"), 900);
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Unable to reset the password.");
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={titleStyle}>Coach Password Reset</div>
        <div style={subtitleStyle}>Recover access to your assigned team</div>

        <input type="email" placeholder="Coach email" value={email} onChange={(event) => setEmail(event.target.value)} style={inputStyle} />
        <button onClick={requestReset} disabled={status === "loading"} style={buttonStyle}>Send Reset Link</button>

        <div style={dividerStyle}>Already have a reset token?</div>
        <input placeholder="Reset token" value={token} onChange={(event) => setToken(event.target.value)} style={inputStyle} />
        <input type="password" placeholder="New password (min 10 chars)" value={password} onChange={(event) => setPassword(event.target.value)} style={inputStyle} />
        <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} style={inputStyle} />
        <button onClick={resetPassword} disabled={status === "loading"} style={buttonStyle}>Update Password</button>

        {message && <div style={{ ...messageStyle, color: status === "error" ? "#f87171" : "#86efac" }}>{message}</div>}
        <div onClick={() => navigate("/coach-login")} style={linkStyle}>Return to Coach Login</div>
      </div>
    </div>
  );
}

const pageStyle = { minHeight: "100vh", width: "100%", background: "#000", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", boxSizing: "border-box" };
const cardStyle = { width: "360px", maxWidth: "100%", background: "#111", border: "1px solid #ec4899", borderRadius: "10px", padding: "24px", boxSizing: "border-box" };
const titleStyle = { color: "#ec4899", fontSize: "25px", fontWeight: "700", textAlign: "center", marginBottom: "8px" };
const subtitleStyle = { color: "#999", fontSize: "13px", textAlign: "center", marginBottom: "22px" };
const dividerStyle = { color: "#999", fontSize: "12px", textAlign: "center", margin: "20px 0 12px" };
const inputStyle = { width: "100%", padding: "12px", marginBottom: "12px", boxSizing: "border-box", background: "#000", color: "#fff", border: "1px solid #444", borderRadius: "6px" };
const buttonStyle = { width: "100%", padding: "12px", background: "#ec4899", color: "#000", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer" };
const messageStyle = { fontSize: "13px", marginTop: "12px", textAlign: "center" };
const linkStyle = { color: "#ec4899", textDecoration: "underline", textAlign: "center", marginTop: "20px", cursor: "pointer", fontSize: "13px" };
