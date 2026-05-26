import { useContext } from "react";
import carbon from "../assets/carbon.png";
import { MenuContext } from "../context/MenuContext.jsx";

export default function Police() {
  const { setMenuOpen } = useContext(MenuContext);

  const blue = "#1e90ff";
  const red = "#ff2b2b";

  const panel = {
    backgroundColor: "rgba(0,0,0,0.55)",
    border: `3px solid ${blue}`,
    borderRadius: "10px",
    padding: "18px",
    marginBottom: "22px",
  };

  const text = {
    color: blue,
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "8px",
  };

  const sub = {
    color: blue,
    fontSize: "16px",
    marginBottom: "10px",
    opacity: 0.8,
  };

  const linkBlue = {
    color: blue,
    fontSize: "20px",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: "800",
    textShadow: "0 0 8px black",
  };

  const linkRed = {
    color: red,
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
    color: blue,
    fontSize: "20px",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: "800",
    textShadow: "0 0 8px black",
  };

  const sections = [
    { name: "Patrol Skills", btn: "Add Drill to Patrol Skills" },
    { name: "Traffic Stops", btn: "Add Drill to Traffic Stops" },
    { name: "Use of Force", btn: "Add Drill to Use of Force" },
    { name: "Building Search", btn: "Add Drill to Building Search" },
    { name: "Tactical Movement", btn: "Add Drill to Tactical Movement" },
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
          <div style={linkBlue}>Manual Entry</div>
          <div style={linkBlue}>Generator</div>
        </div>

        {sections.map((s) => (
          <div key={s.name} style={panel}>
            <div style={text}>{s.name}</div>
            <div style={sub}>No drills yet.</div>
            <div style={linkRed}>{s.btn}</div>
          </div>
        ))}
      </div>

      <div style={returnBtn} onClick={() => setMenuOpen(true)}>
        Return to Menu
      </div>
    </div>
  );
}
