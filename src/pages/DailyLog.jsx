import React, { useState, useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const PROGRESS_COLOR = "yellow";

function Field({ label, keyName, value, onChange }) {
  return (
    <div style={{ marginBottom: "22px" }}>
      <p style={{ color: PROGRESS_COLOR, margin: 0, fontSize: "22px" }}>
        {label}
      </p>

      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(keyName, e.target.value)}
        style={{
          width: "100%",
          padding: "14px",
          fontSize: "20px",
          borderRadius: "6px",
          border: `2px solid ${PROGRESS_COLOR}`,
          backgroundColor: "black",
          color: PROGRESS_COLOR,
          outline: "none",
        }}
        placeholder={label}
      />
    </div>
  );
}

export default function DailyLog() {
  const { setMenuOpen } = useContext(MenuContext);

  const [form, setForm] = useState({
    protein: "",
    water: "",
    calories: "",
    meals: "",
    workouts: "",
    supplements: ""
  });

  function normalize(value) {
    return value === "" ? "0" : String(value);
  }

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function saveLog() {
    try {
      const email = localStorage.getItem("userEmail");
      const today = new Date().toISOString().split("T")[0];

      const payload = {
        email,
        date: today,
        protein: normalize(form.protein),
        water: normalize(form.water),
        calories: normalize(form.calories),
        meals: normalize(form.meals),
        workouts: normalize(form.workouts),
        supplements: normalize(form.supplements)
      };

      const url = "https://delphiafit-backend-production.up.railway.app/api/progress/log";

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Daily log saved");
      } else {
        alert(data.detail || "Error saving log");
      }
    } catch (e) {
      console.log("Error saving log:", e);
      alert("Error saving log");
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        padding: "20px",
        overflowY: "auto",
        boxSizing: "border-box",
        position: "relative"
      }}
    >
      <h1 style={{ color: PROGRESS_COLOR, marginBottom: "30px" }}>
        Daily Log
      </h1>

      <Field label="Protein (g)" keyName="protein" value={form.protein} onChange={updateField} />
      <Field label="Water (oz)" keyName="water" value={form.water} onChange={updateField} />
      <Field label="Calories" keyName="calories" value={form.calories} onChange={updateField} />
      <Field label="Meals" keyName="meals" value={form.meals} onChange={updateField} />
      <Field label="Workouts" keyName="workouts" value={form.workouts} onChange={updateField} />
      <Field label="Supplements" keyName="supplements" value={form.supplements} onChange={updateField} />

      <p
        onClick={saveLog}
        style={{
          color: PROGRESS_COLOR,
          fontSize: "26px",
          fontWeight: "bold",
          textDecoration: "underline",
          cursor: "pointer",
          marginTop: "40px",
          background: "none",
          border: "none",
          padding: 0,
          display: "inline"
        }}
      >
        Save Log
      </p>

      <p
        onClick={() => setMenuOpen(true)}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          color: PROGRESS_COLOR,
          fontSize: "22px",
          textDecoration: "underline",
          cursor: "pointer"
        }}
      >
        Return to Menu
      </p>
    </div>
  );
}
