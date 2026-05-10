import { useState, useContext } from "react";
import caloriesImage from "../assets/cals.png";
import { MenuContext } from "../context/MenuContext.jsx";

export default function Calories() {
  const caloriesColor = "rgb(0, 255, 0)"; // Correct green for Calories screen

  const [calories, setCalories] = useState(0);
  const [gender, setGender] = useState("male"); // male or female
  const [showCelebration, setShowCelebration] = useState(false);

  const { openMenu } = useContext(MenuContext);

  // Auto target based on gender
  const target = gender === "male" ? 2500 : 2000;
  const remaining = Math.max(target - calories, 0);

  function addCalories(amount) {
    setCalories(prev => {
      const updated = prev + amount;
      checkCelebration(updated);
      return updated;
    });
  }

  function updateCalories(e) {
    const value = parseFloat(e.target.value) || 0;
    setCalories(value);
    checkCelebration(value);
  }

  // ⭐ Correct celebration logic based on gender-specific ranges
  function checkCelebration(value) {
    let min, max;

    if (gender === "male") {
      min = 2200;
      max = 3000;
    } else {
      min = 1600;
      max = 2400;
    }

    if (value >= min && value <= max) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  }

  function saveCalories() {
    checkCelebration(calories);
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        color: caloriesColor,
        display: "flex",
        flexDirection: "row",
        padding: "20px",
        overflow: "hidden",
        position: "relative",
        gap: "20px"
      }}
    >

      {/* LEFT SIDE */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* TOP IMAGE */}
        <img
          src={caloriesImage}
          alt="Calories"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "contain",
            margin: "0 auto",
            marginBottom: "10px"
          }}
        />

        {/* GENDER SELECTOR */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "20px"
          }}
        >
          <GenderButton
            label="Male"
            selected={gender === "male"}
            onClick={() => setGender("male")}
            color={caloriesColor}
          />
          <GenderButton
            label="Female"
            selected={gender === "female"}
            onClick={() => setGender("female")}
            color={caloriesColor}
          />
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
          <p style={{ fontSize: "22px" }}>Target: {target} kcal</p>
          <p style={{ fontSize: "22px" }}>Current: {calories} kcal</p>
          <p style={{ fontSize: "22px" }}>Remaining: {remaining} kcal</p>
        </div>

        {/* INPUT FIELD */}
        <input
          type="number"
          placeholder="Enter calories"
          onChange={updateCalories}
          style={{
            padding: "12px",
            fontSize: "18px",
            borderRadius: "6px",
            border: `2px solid ${caloriesColor}`,
            marginBottom: "20px",
            backgroundColor: "black",
            color: caloriesColor,
            outline: "none"
          }}
        />

        {/* QUICK ADD */}
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <p style={{ fontSize: "20px" }}>Quick Add:</p>

          <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
            <TextButton label="+100" amount={100} onClick={addCalories} color={caloriesColor} />
            <TextButton label="+250" amount={250} onClick={addCalories} color={caloriesColor} />
            <TextButton label="+500" amount={500} onClick={addCalories} color={caloriesColor} />
          </div>
        </div>

        {/* SAVE */}
        <div
          onClick={saveCalories}
          style={{
            textAlign: "center",
            fontSize: "22px",
            textDecoration: "underline",
            color: caloriesColor,
            cursor: "pointer",
            marginTop: "auto"
          }}
        >
          Save
        </div>

        {/* RETURN TO MENU */}
        <div
          onClick={openMenu}
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            color: caloriesColor,
            textDecoration: "underline",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          Return to Menu
        </div>

      </div>

      {/* RIGHT SIDE — CLEAN CHART (NO BOX) */}
      <div
        style={{
          width: "40%",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          color: caloriesColor
        }}
      >
        <h3 style={{ margin: 0, textAlign: "center" }}>Recommended Intake</h3>

        <div>
          <p style={{ margin: 0, fontSize: "18px" }}>Male:</p>
          <p style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>2200 – 3000 kcal</p>
        </div>

        <div>
          <p style={{ margin: 0, fontSize: "18px" }}>Female:</p>
          <p style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>1600 – 2400 kcal</p>
        </div>
      </div>

      {/* CELEBRATION */}
      {showCelebration && (
        <div
          style={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "28px",
            fontWeight: "700",
            color: caloriesColor
          }}
        >
          🔥 Goal Reached 🔥
        </div>
      )}

    </div>
  );
}

function GenderButton({ label, selected, onClick, color }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "10px 20px",
        borderRadius: "8px",
        border: `2px solid ${color}`,
        backgroundColor: selected ? color : "transparent",
        color: selected ? "black" : color,
        fontSize: "18px",
        cursor: "pointer",
        fontWeight: "600"
      }}
    >
      {label}
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
