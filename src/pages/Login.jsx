import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import homescreen from "../assets/homescreen.png";
import menuIcon from "../assets/menu.png";
import { MenuContext } from "../context/MenuContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { menuOpen, setMenuOpen } = useContext(MenuContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin() {
    if (!email.includes("@") || password.length < 1) {
      setStatus("error");
      setErrorMessage("Invalid email or password.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setStatus("error");
        setErrorMessage("Invalid email or password.");
        return;
      }

      const data = await res.json();

      // ⭐ Save JWT + email + login state
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("loggedIn", "true");

      setStatus("success");

      // ⭐ FIXED: Redirect to Sports screen after login
      setTimeout(() => {
        navigate("/sports");
      }, 600);

    } catch (err) {
      setStatus("error");
      setErrorMessage("Server error. Please try again.");
    }
  }

  // ⭐ BEFORE LOGIN → LOGIN FORM
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.72)",
          zIndex: 1
        }}
      ></div>

      <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "35px" }}>
          Login
        </h1>

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
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setStatus("idle");
          }}
          style={inputStyle}
        />

        <div
          onClick={() => navigate("/forgot-password")}
          style={{
            color: "#4da6ff",
            fontSize: "16px",
            textDecoration: "underline",
            cursor: "pointer",
            marginTop: "-10px",
            marginBottom: "20px",
            textShadow: "0px 0px 10px rgba(0,0,0,1)"
          }}
        >
          Forgot Password?
        </div>

        <div
          onClick={handleLogin}
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
            ? "Logging in..."
            : status === "success"
            ? "Success!"
            : "Login"}
        </div>

        {status === "error" && (
          <p style={{ color: "red", marginTop: "12px" }}>
            {errorMessage}
          </p>
        )}

        <div style={{ marginTop: "35px" }}>
          <div
            onClick={() => navigate("/register")}
            style={{
              color: "#4da6ff",
              fontSize: "18px",
              textDecoration: "underline",
              cursor: "pointer",
              textShadow: "0px 0px 10px rgba(0,0,0,1)"
            }}
          >
            Create Account
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
