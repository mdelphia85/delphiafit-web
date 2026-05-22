import { useState } from "react";
import { useNavigate } from "react-router-dom";
import homescreen from "../assets/homescreen.png";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleRegister() {
    if (!email.includes("@") || password.length < 10 || name.length < 2) {
      setStatus("error");
      setErrorMessage("Please enter a valid name, email, and password (10+ chars).");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setTimeout(() => navigate("/login"), 800);
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Registration failed.");
      }
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
    caretColor: "#4da6ff"
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
        position: "relative"
      }}
    >

      {/* DARK OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.72)",
          zIndex: 1
        }}
      ></div>

      {/* CONTENT */}
      <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "35px" }}>
          Create Account
        </h1>

        {/* NAME */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setStatus("idle");
          }}
          style={inputStyle}
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus("idle");
          }}
          style={inputStyle}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password (min 10 chars)"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setStatus("idle");
          }}
          style={inputStyle}
        />

        {/* REGISTER ACTION */}
        <div
          onClick={handleRegister}
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
            textShadow: "0px 0px 10px rgba(0,0,0,1)"
          }}
        >
          {status === "loading"
            ? "Creating account..."
            : status === "success"
            ? "Success!"
            : "Register"}
        </div>

        {/* ERROR MESSAGE */}
        {status === "error" && (
          <p style={{ color: "red", marginTop: "12px" }}>
            {errorMessage}
          </p>
        )}

        {/* LOGIN LINK */}
        <div style={{ marginTop: "35px" }}>
          <div
            onClick={() => navigate("/login")}
            style={{
              color: "#4da6ff",
              fontSize: "18px",
              textDecoration: "underline",
              cursor: "pointer",
              textShadow: "0px 0px 10px rgba(0,0,0,1)"
            }}
          >
            Already have an account? Login
          </div>
        </div>
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
