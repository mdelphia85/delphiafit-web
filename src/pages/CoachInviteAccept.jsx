import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, hasSession } from "../utils/api.js";

export default function CoachInviteAccept() {
  const navigate = useNavigate();
  const [invitationToken] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get("token"));
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [invite, setInvite] = useState(null);

  useLayoutEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    }
  }, []);

  useEffect(() => {
    if (!invitationToken) return;
    apiRequest("/staff/invitations/lookup", { method: "POST", body: { token: invitationToken } })
      .then(setInvite)
      .catch(() => {
        setStatus("error");
        setErrorMessage("This invitation is invalid, expired or already used.");
      });
  }, [invitationToken]);

  async function acceptInvitation() {
    if (!invitationToken) {
      setStatus("error");
      setErrorMessage("This invitation link is missing its token.");
      return;
    }

    const isClient = invite && invite.role === "client";
    const existingCoach = invite && invite.existing_coach;
    if (!existingCoach && (name.trim().length < 2 || password.length < 10)) {
      setStatus("error");
      setErrorMessage("Enter your name and a password with at least 10 characters.");
      return;
    }

    if (!existingCoach && password !== confirmPassword) {
      setStatus("error");
      setErrorMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");

    try {
      await apiRequest(isClient ? "/staff/invitations/accept" : "/coach/invitations/accept", {
        method: "POST",
        as: isClient ? "user" : "coach",
        body: existingCoach
          ? { invitation_token: invitationToken }
          : { invitation_token: invitationToken, name, password }
      });
      setStatus("success");
      setTimeout(() => navigate(isClient ? "/login" : existingCoach ? "/coach-dashboard" : "/coach-login"), 900);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        existingCoach && !hasSession("coach")
          ? "Sign into your coach account in another tab, then accept this invitation."
          : error.message || "Unable to accept the invitation right now."
      );
    }
  }

  const isClient = invite && invite.role === "client";
  const existingCoach = invite && invite.existing_coach;

  return (
    <CoachForm
      title={isClient ? "Accept Coaching Invitation" : "Accept Coach Invitation"}
      subtitle={isClient ? "Create your account to connect with your coach" : existingCoach ? "Sign in to add this team to your coach account" : "Create access for your assigned team"}
    >
      {invite && <div style={{ color: "#ccc", fontSize: "12px", textAlign: "center", marginBottom: "12px" }}>Invitation for {invite.email}</div>}
      {existingCoach ? (
        <div style={{ color: "#ccc", fontSize: "13px", textAlign: "center", marginBottom: "12px" }}>
          This invitation will not change your password or coach profile.
          <div><a href="/coach-login" target="_blank" rel="noopener noreferrer" style={linkStyle}>Open Coach Login in a new tab</a></div>
        </div>
      ) : (
        <>
          <input placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} style={inputStyle} />
          <input type="password" placeholder="Password (min 10 chars)" value={password} onChange={(event) => setPassword(event.target.value)} style={inputStyle} />
          <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} style={inputStyle} />
        </>
      )}
      <button onClick={acceptInvitation} disabled={status === "loading"} style={buttonStyle}>
        {status === "loading" ? "Accepting..." : status === "success" ? "Invitation Accepted" : "Accept Invitation"}
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
