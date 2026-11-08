import { useContext } from "react";
import { MenuContext } from "../context/MenuContext.js";
import TacticalOperationLog from "../components/TacticalOperationLog.jsx";

export default function SearchRescue() {
  const { setMenuOpen } = useContext(MenuContext);
  return <div style={{ minHeight: "100vh", background: "#000", padding: "32px 16px 90px" }}><TacticalOperationLog module="sar" /><button type="button" onClick={() => setMenuOpen(true)} style={{ position: "fixed", right: 20, bottom: 20, color: "#2d5f3a", background: "#111", padding: 10 }}>Return to Menu</button></div>;
}
