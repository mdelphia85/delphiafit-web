import { useContext } from "react";
import carbon from "../assets/carbon.png";
import { MenuContext } from "../context/MenuContext.js";
import TacticalOperationLog from "./TacticalOperationLog.jsx";
import { TACTICAL_COLORS } from "../config/tacticalColors.js";

/** Shared DelphiaFit visual layout for non-division tactical operations. */
export default function TacticalOperationPage({ module }) {
  const { setMenuOpen } = useContext(MenuContext);
  const accent = TACTICAL_COLORS[module] || "#aab4c0";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${carbon})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#000",
        padding: "40px 20px 90px",
        position: "relative",
        boxSizing: "border-box",
        color: "#fff",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto" }}>
        <TacticalOperationLog module={module} accent={accent} />
      </div>
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 10,
          color: accent,
          background: "#111",
          border: `1px solid ${accent}`,
          padding: "10px 14px",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        Return to Menu
      </button>
    </div>
  );
}
