import { useState } from "react";
import { useNavigate } from "react-router-dom";
import homescreen from "../assets/homescreen.png";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleReset() {
    if (!email.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid email.");
      return;
    }

    if (password.length < 10 || confirm.length < 10) {
      setStatus("error");
      setErrorMessage("Password must be at least 10 characters.");
      return;
    }

    if (password !== confirm) {
      setStatus("mismatch");
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (token.length < 5) {
      setStatus("error");
      setErrorMessage("Invalid or missing reset token.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(
        "https://delphiafit-backend-production.up.railway.app/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            token,
            new_password: password,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMessage(data.message || "Reset failed.");
        return;
      }

      setStatus("success");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setStatus("error");
      setErrorMessage("Server error. Please try again.");
    }
  }

  const inputStyle = {
    padding: "12px 4px",
    border: "none",
    borderBottom: "3px solid #4da6ff",
    backgroundColor: "transparent",
    color: "#4da6ff",
    fontSize: "20px",
    outline: "none",
    marginBottom: "28px",
    width: "100%",
    maxWidth: "400px",
    textShadow: "0px 0px 10px rgba(0,0,0,1)",
    caretColor: "#4da6ff",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${homescreen})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* DARK OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.72)",
          zIndex: 1,
        }}
      ></div>

      {/* CONTENT */}
      <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "35px" }}>
          Reset Password
        </h1>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus("idle");
          }}
          style={inputStyle}
        />

        {/* TOKEN */}
        <input
          type="text"
          placeholder="Reset Token"
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            setStatus("idle");
          }}
          style={inputStyle}
        />

        {/* NEW PASSWORD */}
        <input
          type="password"
          placeholder="New Password (min 10 chars)"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setStatus("idle");
          }}
          style={inputStyle}
        />

        {/* CONFIRM PASSWORD */}
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setStatus("idle");
          }}
          style={inputStyle}
        />

        {/* CLICKABLE RESET ACTION */}
        <div
          onClick={handleReset}
          style={{
            color:
              status === "success"
                ? "lightgreen"
                : status === "error" || status === "mismatch"
                ? "red"
                : "#4da6ff",
            fontSize: "22px",
            fontWeight: "600",
            textDecoration: "underline",
            cursor: "pointer",
            marginTop: "10px",
            textShadow: "0px 0px 10px rgba(0,0,0,1)",
          }}
        >
          {status === "loading"
            ? "Updating..."
            : status === "success"
            ? "Password Updated!"
            : "Reset Password"}
        </div>

        {/* ERROR MESSAGES */}
        {(status === "error" || status === "mismatch") && (
          <p style={{ color: "red", marginTop: "12px" }}>{errorMessage}</p>
        )}
      </div>

      {/* BLUE PLACEHOLDER */}
      <style>
        {`
          ::placeholder {
            color: #4da6ff !important;
            opacity: 1;
            text-shadow: 0px 0px 10px rgba(0,0,0,1);
          }
        `}
      </style>
    </div>
  );
}
