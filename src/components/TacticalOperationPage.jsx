import { useContext } from "react";
import { MenuContext } from "../context/MenuContext.js";
import TacticalOperationLog from "./TacticalOperationLog.jsx";
import TextAction from "./TextAction.jsx";
import { TACTICAL_COLORS } from "../config/tacticalColors.js";

/** Shared wrapper for specialist operations; preserves the original black background. */
export default function TacticalOperationPage({ module }) {
  const { setMenuOpen } = useContext(MenuContext);
  const accent = TACTICAL_COLORS[module] || "#aab4c0";

  return (
    <div style={{ minHeight: "100vh", background: "#000", padding: "32px 16px 90px", boxSizing: "border-box", color: "#fff" }}>
      <TacticalOperationLog module={module} accent={accent} />
      <TextAction
        onClick={() => setMenuOpen(true)}
        style={{ position: "fixed", bottom: 20, right: 20, zIndex: 20, color: accent, fontSize: 18 }}
      >
        Return to Menu
      </TextAction>
    </div>
  );
}
