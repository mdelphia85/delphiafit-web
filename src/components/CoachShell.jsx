import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuContext } from "../context/MenuContext.js";
import { hasSession } from "../utils/api.js";
import { COACH_COLOR } from "./coachStyles.js";

// Shared page frame for Coach Hub screens: redirects to coach login only when there is no
// coach session, and keeps "Coach Hub" / "Return to Menu" in the footer.
export default function CoachShell({ title, children, color = COACH_COLOR, home = false, requireSession = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setMenuOpen } = useContext(MenuContext);
  const signedIn = hasSession("coach");

  useEffect(() => {
    if (requireSession && !signedIn) navigate("/coach-login", { replace: true, state: { from: location.pathname + location.search } });
  }, [requireSession, signedIn, navigate, location]);

  if (requireSession && !signedIn) return null;

  const footerLink = { color, fontSize: "18px", textDecoration: "underline", cursor: "pointer" };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#000",
        padding: "16px 16px 90px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        overflowY: "auto",
        color: "#fff"
      }}
    >
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color, fontSize: "28px", fontWeight: "700" }}>{title}</div>
        </div>
        {children}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "40px",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: home ? "flex-end" : "space-between",
          padding: "0 16px",
          boxSizing: "border-box",
          zIndex: 20
        }}
      >
        {!home && (
          <div style={footerLink} onClick={() => navigate("/coach-dashboard")}>
            Coach Hub
          </div>
        )}
        <div style={footerLink} onClick={() => setMenuOpen(true)}>
          Return to Menu
        </div>
      </div>
    </div>
  );
}
