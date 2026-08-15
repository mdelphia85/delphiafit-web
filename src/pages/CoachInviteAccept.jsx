import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CoachInviteAccept() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function acceptInvitation() {
    const invitationToken = searchParams.get("token");

    if (!invitationToken) {
      setStatus("error");
      setErrorMessage("This invitation link is missing its token.");
      return;
    }

    if (name.trim().length < 2 || password.length < 10) {
      setStatus("error");
      setErrorMessage("Enter your name and a password with at least 10 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setErrorMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/coach/invitations/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitation_token: invitationToken, name, password })
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.detail || "This invitation could not be accepted.");
        return;
      }

      setStatus("success");
      setTimeout(() => navigate("/coach-login"), 900);
    } catch (error) {
      setStatus("error");
      setErrorMessage("Unable to accept the invitation right now.");
    }
  }

  return (
    <CoachForm title="Accept Coach Invitation" subtitle="Create access for your assigned team">
      <input placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} style={inputStyle} />
      <input type="password" placeholder="Password (min 10 chars)" value={password} onChange={(event) => setPassword(event.target.value)} style={inputStyle} />
      <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} style={inputStyle} />
      <button onClick={acceptInvitation} disabled={status === "loading"} style={buttonStyle}>
        {status === "loading" ? "Creating access..." : status === "success" ? "Invitation Accepted" : "Accept Invitation"}
      </button>
      {status === "error" && <div style={errorStyle}>{errorMessage}</div>}
    </CoachForm>
  );
}

function CoachForm({ title, subtitle, children }) {
  const navigate = useNavigate();

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={titleStyle}>{title}</div>
        <div style={subtitleStyle}>{subtitle}</div>
        {children}
        <div onClick={() => navigate("/coach-login")} style={linkStyle}>Return to Coach Login</div>
      </div>
    </div>
  );
}

const pageStyle = { minHeight: "100vh", width: "100%", background: "#000", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", boxSizing: "border-box" };
const cardStyle = { width: "360px", maxWidth: "100%", background: "#111", border: "1px solid #ec4899", borderRadius: "10px", padding: "24px", boxSizing: "border-box" };
const titleStyle = { color: "#ec4899", fontSize: "25px", fontWeight: "700", textAlign: "center", marginBottom: "8px" };
const subtitleStyle = { color: "#999", fontSize: "13px", textAlign: "center", marginBottom: "22px" };
const inputStyle = { width: "100%", padding: "12px", marginBottom: "12px", boxSizing: "border-box", background: "#000", color: "#fff", border: "1px solid #444", borderRadius: "6px" };
const buttonStyle = { width: "100%", padding: "12px", background: "#ec4899", color: "#000", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer" };
const errorStyle = { color: "#f87171", fontSize: "13px", marginTop: "12px", textAlign: "center" };
const linkStyle = { color: "#ec4899", textDecoration: "underline", textAlign: "center", marginTop: "20px", cursor: "pointer", fontSize: "13px" };
