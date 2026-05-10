import { useNavigate } from "react-router-dom";
import { useState } from "react";
import homescreen from "../assets/homescreen.png";

export default function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleNotify() {
    if (!email.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
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
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "700",
            marginBottom: "20px",
            textShadow: "0px 0px 12px rgba(0,0,0,1)"
          }}
        >
          Delphia Fit
        </h1>

        <p
          style={{
            fontSize: "20px",
            marginBottom: "40px",
            textShadow: "0px 0px 10px rgba(0,0,0,1)"
          }}
        >
          Your fitness. Your data. Your transformation.
        </p>

        {/* EMAIL INPUT */}
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

        {/* NOTIFY ME ACTION */}
        <div
          onClick={handleNotify}
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
            marginBottom: "20px",
            textShadow: "0px 0px 10px rgba(0,0,0,1)"
          }}
        >
          {status === "loading"
            ? "Sending..."
            : status === "success"
            ? "You're on the list!"
            : "Notify Me"}
        </div>

        {status === "error" && (
          <p style={{ color: "red", marginTop: "-10px" }}>
            Please enter a valid email.
          </p>
        )}

        {/* AUTH LINKS */}
        <div style={{ marginTop: "40px" }}>
          <div
            onClick={() => navigate("/register")}
            style={{
              color: "#4da6ff",
              fontSize: "20px",
              textDecoration: "underline",
              cursor: "pointer",
              marginBottom: "18px",
              textShadow: "0px 0px 10px rgba(0,0,0,1)"
            }}
          >
            Create Account
          </div>

          <div
            onClick={() => navigate("/login")}
            style={{
              color: "#4da6ff",
              fontSize: "20px",
              textDecoration: "underline",
              cursor: "pointer",
              textShadow: "0px 0px 10px rgba(0,0,0,1)"
            }}
          >
            Login
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
