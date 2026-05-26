import { useContext } from "react";
import carbon from "../assets/carbon.png";
import { MenuContext } from "../context/MenuContext.jsx";

export default function EMS() {
  const { setMenuOpen } = useContext(MenuContext);

  const accent = "#4da6ff";

  const panel = {
    backgroundColor: "rgba(0,0,0,0.55)",
    border: `3px solid ${accent}`,
    borderRadius: "10px",
    padding: "18px",
    marginBottom: "22px",
  };

  const text = {
    color: accent,
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "8px",
  };

  const sub = {
    color: accent,
    fontSize: "16px",
    marginBottom: "10px",
    opacity: 0.8,
  };

  const link = {
    color: accent,
    fontSize: "20px",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: "800",
    textShadow: "0 0 8px black",
  };

  const returnBtn = {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    color: accent,
    fontSize: "20px",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: "800",
    textShadow: "0 0 8px black",
  };

  const sections = [
    { name: "Patient Assessment", btn: "Add Drill to Patient Assessment" },
    { name: "Airway Management", btn: "Add Drill to Airway Management" },
    { name: "Trauma Response", btn: "Add Drill to Trauma Response" },
    { name: "Extraction & Movement", btn: "Add Drill to Extraction & Movement" },
    { name: "Tactical Casualty Care", btn: "Add Drill to Tactical Casualty Care" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${carbon})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "40px 20px",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.75)" }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "900px", margin: "0 auto" }}>

        <div style={{ display: "flex", gap: "30px", marginBottom: "35px" }}>
          <div style={link}>Manual Entry</div>
          <div style={link}>Generator</div>
        </div>

        {sections.map((s) => (
          <div key={s.name} style={panel}>
            <div style={text}>{s.name}</div>
            <div style={sub}>No drills yet.</div>
            <div style={link}>{s.btn}</div>
          </div>
        ))}
      </div>

      <div style={returnBtn} onClick={() => setMenuOpen(true)}>
        Return to Menu
      </div>
    </div>
  );
}
