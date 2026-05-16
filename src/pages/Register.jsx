import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import homescreen from "../assets/homescreen.png";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  // If token exists → verify with backend → redirect to home
  useEffect(() => {
    async function verifyToken() {
      if (!token) return;

      try {
        const res = await fetch(
          "https://delphiafit-backend-production.up.railway.app/auth/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (res.ok) {
          navigate("/home");
        }
      } catch (err) {
        console.log("Token invalid or expired");
      }
    }

    verifyToken();
  }, [token, navigate]);

  async function handleRegister() {
    if (!email.includes("@") || password.length < 10 || name.length < 2) {
      setStatus("error");
      setErrorMessage("Please enter a valid name, email, and password (10+ chars).");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(
        "https://delphiafit-backend-production.up.railway.app/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setStatus("error");
        setErrorMessage(data?.detail || "Registration failed.");
        return;
      }

      await res.json();

      setStatus("success");

      setTimeout(() => navigate("/login"), 800);
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.72)",
          zIndex: 1,
        }}
      ></div>

      <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "35px" }}>
          Create Account
        </h1>

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
            textShadow: "0px 0px 10px rgba(0,0,0,1)",
          }}
        >
          {status === "loading"
            ? "Creating account..."
            : status === "success"
            ? "Success!"
            : "Register"}
        </div>

        {status === "error" && (
          <p style={{ color: "red", marginTop: "12px" }}>{errorMessage}</p>
        )}

        <div style={{ marginTop: "35px" }}>
          <div
            onClick={() => navigate("/login")}
            style={{
              color: "#4da6ff",
              fontSize: "18px",
              textDecoration: "underline",
              cursor: "pointer",
              textShadow: "0px 0px 10px rgba(0,0,0,1)",
            }}
          >
            Already have an account? Login
          </div>
        </div>
      </div>

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
