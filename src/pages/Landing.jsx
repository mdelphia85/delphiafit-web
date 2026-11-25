import { Link } from "react-router-dom";
import Footer from "./footer.jsx";

export default function Landing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        textAlign: "center"
      }}
    >
      <h1 style={{ color: "inherit", fontSize: "42px", fontWeight: "700", marginBottom: "20px" }}>
        Welcome to DelphiaFit
      </h1>

      <p style={{ fontSize: "20px", marginBottom: "40px", maxWidth: "500px" }}>
        Explore DelphiaFit in read‑only demo mode — no account needed.
      </p>

      <Link
        to="/demo"
        style={{
          padding: "14px 28px",
          backgroundColor: "#4da6ff",
          textDecoration: "none",
          color: "black",
          borderRadius: "8px",
          fontSize: "20px",
          fontWeight: "600",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        Start Demo
      </Link>

      <Link
        to="/register"
        style={{
          color: "#4da6ff",
          fontSize: "20px",
          textDecoration: "underline",
          cursor: "pointer",
          marginBottom: "12px"
        }}
      >
        Create Account
      </Link>

      <Link
        to="/login"
        style={{
          color: "#4da6ff",
          fontSize: "20px",
          textDecoration: "underline",
          cursor: "pointer"
        }}
      >
        Login
      </Link>
      <Footer />
    </div>
  );
}
