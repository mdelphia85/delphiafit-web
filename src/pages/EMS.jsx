import { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function EMS() {
  const { setMenuOpen } = useContext(MenuContext);

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "30px 20px",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#111",
  };

  const headerStyle = {
    maxWidth: "900px",
    margin: "0 auto 24px auto",
  };

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "12px",
  };

  const controlsRow = {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
    marginBottom: "24px",
  };

  const primaryButton = {
    padding: "10px 18px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  };

  const sectionsWrapper = {
    maxWidth: "900px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  };

  const sectionCard = {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "16px 18px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  };

  const sectionTitle = {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "4px",
  };

  const sectionSub = {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "10px",
  };

  const addButton = {
    ...primaryButton,
    padding: "8px 14px",
    fontSize: "13px",
  };

  const returnToMenuStyle = {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    fontSize: "14px",
    color: "#2563eb",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: "600",
  };

  const sections = [
    { name: "Patient Assessment", button: "Add Drill to Patient Assessment" },
    { name: "Airway Management", button: "Add Drill to Airway Management" },
    { name: "Trauma Response", button: "Add Drill to Trauma Response" },
    { name: "Extraction & Movement", button: "Add Drill to Extraction & Movement" },
    { name: "Tactical Casualty Care", button: "Add Drill to Tactical Casualty Care" },
  ];

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>EMS Tactical Drills</h1>

        <div style={controlsRow}>
          <button style={primaryButton}>Manual Entry</button>
          <button style={primaryButton}>Generator</button>
        </div>
      </div>

      <div style={sectionsWrapper}>
        {sections.map((s) => (
          <div key={s.name} style={sectionCard}>
            <div style={sectionTitle}>{s.name}</div>
            <div style={sectionSub}>No drills yet.</div>
            <button style={addButton}>{s.button}</button>
          </div>
        ))}
      </div>

      <div
        style={returnToMenuStyle}
        onClick={() => setMenuOpen(true)}
      >
        Return to Menu
      </div>
    </div>
  );
}
