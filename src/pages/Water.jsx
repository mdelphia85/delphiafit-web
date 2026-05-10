import { useState, useContext } from "react";
import waterImage from "../assets/water.png";
import { MenuContext } from "../context/MenuContext.jsx";

export default function Water() {
  const waterColor = "rgb(0, 150, 255)";

  // Base values stored internally in ounces
  const [waterOz, setWaterOz] = useState(0);
  const [targetOz, setTargetOz] = useState(120);

  const [unit, setUnit] = useState("oz"); // "oz" or "ml"
  const [showCelebration, setShowCelebration] = useState(false);

  const { openMenu } = useContext(MenuContext);

  const ML_PER_OZ = 29.5735;

  // Convert displayed values based on unit
  const displayWater = unit === "oz" ? waterOz : waterOz * ML_PER_OZ;
  const displayTarget = unit === "oz" ? targetOz : targetOz * ML_PER_OZ;
  const displayRemaining =
    unit === "oz"
      ? Math.max(targetOz - waterOz, 0)
      : Math.max(targetOz - waterOz, 0) * ML_PER_OZ;

  function toggleUnit() {
    setUnit(prev => (prev === "oz" ? "ml" : "oz"));
  }

  function addWater(amount) {
    // amount is always in oz internally
    setWaterOz(prev => {
      const updated = prev + amount;
      checkCelebration(updated);
      return updated;
    });
  }

  function updateWater(e) {
    const value = parseFloat(e.target.value) || 0;

    if (unit === "oz") {
      setWaterOz(value);
      checkCelebration(value);
    } else {
      const converted = value / ML_PER_OZ;
      setWaterOz(converted);
      checkCelebration(converted);
    }
  }

  function checkCelebration(valueOz) {
    if (valueOz >= targetOz) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  }

  function saveWater() {
    checkCelebration(waterOz);
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        color: waterColor,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        overflow: "hidden",
        position: "relative"
      }}
    >

      {/* TOP IMAGE */}
      <img
        src={waterImage}
        alt="Water"
        style={{
          width: "120px",
          height: "120px",
          objectFit: "contain",
          margin: "0 auto",
          marginBottom: "10px"
        }}
      />

      {/* UNIT TOGGLE */}
      <div
        onClick={toggleUnit}
        style={{
          textAlign: "center",
          fontSize: "18px",
          textDecoration: "underline",
          cursor: "pointer",
          marginBottom: "15px",
          color: waterColor
        }}
      >
        Switch to {unit === "oz" ? "mL" : "oz"}
      </div>

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
        <p style={{ fontSize: "22px" }}>
          Target: {displayTarget.toFixed(unit === "oz" ? 0 : 0)} {unit}
        </p>
        <p style={{ fontSize: "22px" }}>
          Current: {displayWater.toFixed(unit === "oz" ? 0 : 0)} {unit}
        </p>
        <p style={{ fontSize: "22px" }}>
          Remaining: {displayRemaining.toFixed(unit === "oz" ? 0 : 0)} {unit}
        </p>
      </div>

      {/* INPUT FIELD */}
      <input
        type="number"
        placeholder={`Enter water amount (${unit})`}
        onChange={updateWater}
        style={{
          padding: "12px",
          fontSize: "18px",
          borderRadius: "6px",
          border: `2px solid ${waterColor}`,
          marginBottom: "20px",
          backgroundColor: "black",
          color: waterColor,
          outline: "none"
        }}
      />

      {/* QUICK ADD (always in oz internally) */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <p style={{ fontSize: "20px" }}>Quick Add:</p>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <TextButton label="+8 oz" amount={8} onClick={addWater} color={waterColor} />
          <TextButton label="+12 oz" amount={12} onClick={addWater} color={waterColor} />
          <TextButton label="+16 oz" amount={16} onClick={addWater} color={waterColor} />
        </div>
      </div>

      {/* SAVE */}
      <div
        onClick={saveWater}
        style={{
          textAlign: "center",
          fontSize: "22px",
          textDecoration: "underline",
          color: waterColor,
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
            top: "60%", // shifted down
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "28px",
            fontWeight: "700",
            color: waterColor
          }}
        >
          💧 Goal Reached 💧
        </div>
      )}

      {/* RETURN TO MENU */}
      <div
        onClick={openMenu}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          color: waterColor,
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
