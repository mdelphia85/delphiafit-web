import { useState } from "react";
import { useNavigate } from "react-router-dom";
import homescreen from "../assets/delphiafit-home-approved.webp";
import { apiRequest } from "../utils/api.js";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState("");

  async function handleSend() {
    if (!email.includes("@")) { setStatus("error"); setErrorMessage("Please enter a valid email."); return; }
    setStatus("loading");
    try { const result = await apiRequest("/auth/forgot-password", { method: "POST", body: { email } }); setStatus("success"); setDeliveryInfo(result.delivery_configured ? "If the account exists, reset instructions have been sent." : "Password-reset email delivery is not configured. Contact support to regain access."); }
    catch (err) { setStatus("error"); setErrorMessage(err.message || "Unable to request password reset."); }
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
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus("idle");
          }}
          style={inputStyle}
        />

        {/* SEND RESET LINK */}
        <button type="button" disabled={status === "loading"}
          onClick={handleSend}
          style={{
            color:
              status === "success"
                ? "lightgreen"
                : status === "error"
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
            ? "Sending..."
            : status === "success"
            ? "Email Sent!"
            : "Send Reset Link"}
        </button>

        {status === "success" && <p role="status" style={{ color: "#b7f7cf" }}>{deliveryInfo}</p>}

        {/* ALWAYS VISIBLE RESET PASSWORD LINK */}
        <button type="button"
          onClick={() => navigate("/reset-password")}
          style={{
            color: "#4da6ff",
            fontSize: "18px",
            textDecoration: "underline",
            cursor: "pointer",
            marginTop: "25px",
            textShadow: "0px 0px 10px rgba(0,0,0,1)",
          }}
        >
          Reset Password
        </button>

        {/* ERROR MESSAGE */}
        {status === "error" && (
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
