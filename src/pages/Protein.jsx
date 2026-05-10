import { useState, useContext } from "react";
import proteinImage from "../assets/protein.png";
import { MenuContext } from "../context/MenuContext.jsx";

export default function Protein() {
  const proteinColor = "rgb(255, 50, 50)"; // your exact red

  const profileComplete = false;

  const [protein, setProtein] = useState(0);
  const [target, setTarget] = useState(160);
  const [showCelebration, setShowCelebration] = useState(false);

  // Access global menu controls
  const { openMenu } = useContext(MenuContext);

  function addProtein(amount) {
    setProtein(prev => {
      const updated = prev + amount;
      checkCelebration(updated);
      return updated;
    });
  }

  function updateProtein(e) {
    const value = parseFloat(e.target.value) || 0;
    setProtein(value);
    checkCelebration(value);
  }

  function checkCelebration(value) {
    if (value >= target) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  }

  function saveProtein() {
    checkCelebration(protein);
  }

  const remaining = Math.max(target - protein, 0);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        color: proteinColor,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        overflow: "hidden",
        position: "relative"
      }}
    >

      {/* TOP IMAGE */}
      <img
        src={proteinImage}
        alt="Protein"
        style={{
          width: "120px",
          height: "120px",
          objectFit: "contain",
          margin: "0 auto",
          marginBottom: "10px"
        }}
      />

      {/* PROFILE WARNING */}
      {!profileComplete && (
        <div
          style={{
            backgroundColor: "rgba(255, 50, 50, 0.2)",
            padding: "10px",
            borderRadius: "6px",
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "16px",
            color: proteinColor
          }}
        >
          Profile must be created before accurate protein intake can be properly tracked.
        </div>
      )}

      {/* TARGET / CURRENT / REMAINING */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "25px",
          textAlign: "center"
        }}
      >
        <p style={{ fontSize: "22px" }}>Target: {target}g</p>
        <p style={{ fontSize: "22px" }}>Current: {protein}g</p>
        <p style={{ fontSize: "22px" }}>Remaining: {remaining}g</p>
      </div>

      {/* INPUT FIELD */}
      <input
        type="number"
        placeholder="Enter protein amount"
        onChange={updateProtein}
        style={{
          padding: "12px",
          fontSize: "18px",
          borderRadius: "6px",
          border: `2px solid ${proteinColor}`,
          marginBottom: "20px",
          backgroundColor: "black",
          color: proteinColor,
          outline: "none"
        }}
      />

      {/* SCOOPS */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <p style={{ fontSize: "20px" }}>Add Scoops:</p>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <TextButton label="1 Scoop" amount={25} onClick={addProtein} color={proteinColor} />
          <TextButton label="1.5 Scoops" amount={37.5} onClick={addProtein} color={proteinColor} />
          <TextButton label="2 Scoops" amount={50} onClick={addProtein} color={proteinColor} />
        </div>
      </div>

      {/* SHAKES */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <p style={{ fontSize: "20px" }}>Add Shake:</p>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <TextButton label="+20g" amount={20} onClick={addProtein} color={proteinColor} />
          <TextButton label="+30g" amount={30} onClick={addProtein} color={proteinColor} />
          <TextButton label="+40g" amount={40} onClick={addProtein} color={proteinColor} />
        </div>
      </div>

      {/* SAVE */}
      <div
        onClick={saveProtein}
        style={{
          textAlign: "center",
          fontSize: "22px",
          textDecoration: "underline",
          color: proteinColor,
          cursor: "pointer",
          marginTop: "auto"
        }}
      >
        Save
      </div>

      {/* CELEBRATION */}
      {showCelebration && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "28px",
            fontWeight: "700",
            color: proteinColor
          }}
        >
          🎉 Goal Reached 🎉
        </div>
      )}

      {/* RETURN TO MENU */}
      <div
        onClick={openMenu}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          color: proteinColor,
          textDecoration: "underline",
          fontSize: "18px",
          cursor: "pointer"
        }}
      >
        Return to Menu
      </div>

    </div>
  );
}

function TextButton({ label, amount, onClick, color }) {
  return (
    <span
      onClick={() => onClick(amount)}
      style={{
        color,
        fontSize: "18px",
        textDecoration: "underline",
        cursor: "pointer"
      }}
    >
      {label}
    </span>
  );
}
