import { useContext } from "react";
import { MenuContext } from "../context/MenuContext.js";
import TacticalOperationLog from "../components/TacticalOperationLog.jsx";
import { TACTICAL_COLORS } from "../config/tacticalColors.js";

export default function AviationCrewReadiness() {
  const { setMenuOpen } = useContext(MenuContext);
  return <div style={{ minHeight: "100vh", background: "#000", padding: "32px 16px 90px" }}><TacticalOperationLog module="aviation" accent={TACTICAL_COLORS.aviation} /><button type="button" onClick={() => setMenuOpen(true)} style={{ position: "fixed", right: 20, bottom: 20, color: TACTICAL_COLORS.aviation, background: "#111", padding: 10 }}>Return to Menu</button></div>;
}
