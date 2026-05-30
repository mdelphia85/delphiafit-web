import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const BG = "rgb(0,0,0)";
  const CARD_BG = "rgb(15,15,15)";
  const BORDER = "rgb(60,60,60)";
  const TEXT_MAIN = "rgb(240,240,240)";
  const TEXT_MUTED = "rgb(160,160,160)";
  const ACCENT = "rgb(128,0,128)";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        "https://delphiafit-backend-production.up.railway.app/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            username: email,
            password: password
          })
        }
      );

      if (!res.ok) {
        alert("Invalid admin credentials");
        setLoading(false);
        return;
      }

      const data = await res.json();

      // ⭐ Save REAL admin token
      localStorage.setItem("adminToken", data.access_token);

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Server error — unable to log in");
    }

    setLoading(false);
  }

  const container = {
    width: "100vw",
    height: "100vh",
    backgroundColor: BG,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: TEXT_MAIN
  };

  const card = {
    backgroundColor: CARD_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: "10px",
    padding: "30px",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxSizing: "border-box"
  };

  const title = {
    fontSize: "24px",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "10px"
  };

  const input = {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: `1px solid ${BORDER}`,
    backgroundColor: "rgb(20,20,20)",
    color: TEXT_MAIN,
    boxSizing: "border-box"
  };

  const button = {
    width: "100%",
    padding: "12px",
    backgroundColor: ACCENT,
    border: "none",
    borderRadius: "6px",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
    opacity: loading ? 0.6 : 1
  };

  const subtitle = {
    fontSize: "14px",
    color: TEXT_MUTED,
    textAlign: "center"
  };

  return (
    <div style={container}>
      <div style={card}>
        <div style={title}>Admin Login</div>
        <div style={subtitle}>Access to the DelphiaFit admin panel</div>

        <input
          style={input}
          placeholder="Admin Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          style={input}
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button style={button} onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
