import { useContext } from "react";
import carbon from "../assets/carbon.png";
import { MenuContext } from "../context/MenuContext.jsx";

export default function Firefighters() {
  const { setMenuOpen } = useContext(MenuContext);

  const accent = "#ff4d00";

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
    "SCBA Endurance",
    "Hose Drills",
    "Ladder Operations",
    "Search & Rescue",
    "Forcible Entry",
    "Fireground Conditioning",
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

        {/* Manual + Generator */}
        <div style={{ display: "flex", gap: "30px", marginBottom: "35px" }}>
          <div style={link}>Manual Entry</div>
          <div style={link}>Generator</div>
        </div>

        {/* Drill Sections */}
        {sections.map((s) => (
          <div key={s} style={panel}>
            <div style={text}>{s}</div>
            <div style={sub}>No drills yet.</div>
            <div style={link}>Add Drill</div>
          </div>
        ))}
      </div>

      <div style={returnBtn} onClick={() => setMenuOpen(true)}>
        Return to Menu
      </div>
    </div>
  );
}
