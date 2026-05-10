import React, { useContext, useState, useRef } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function FreeTraining() {
  const { setMenuOpen } = useContext(MenuContext);

  const FREE_TRAINING_COLOR = "yellow";

  const [fields, setFields] = useState({
    name: "",
    skill: "",
    notes: "",
    extra: ""
  });

  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  function updateField(key, value) {
    setFields({ ...fields, [key]: value });
  }

  function startTimer() {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }

  function resetTimer() {
    stopTimer();
    setTime(0);
  }

  function saveSession() {
    console.log("Saved session:", fields, time);
  }

  function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        padding: "20px",
        boxSizing: "border-box",
        overflowY: "auto",
        position: "relative"
      }}
    >
      {/* INPUT FIELDS */}
      {["name", "skill", "notes", "extra"].map((key, index) => (
        <input
          key={index}
          type="text"
          value={fields[key]}
          onChange={(e) => updateField(key, e.target.value)}
          style={{
            width: "100%",
            height: "40px",
            backgroundColor: "black",
            color: FREE_TRAINING_COLOR,
            border: `2px solid ${FREE_TRAINING_COLOR}`,
            borderRadius: "6px",
            marginBottom: "15px",
            paddingLeft: "10px",
            fontSize: "20px",
            outline: "none",
            caretColor: FREE_TRAINING_COLOR
          }}
        />
      ))}

      {/* TIMER */}
      <p
        style={{
          color: FREE_TRAINING_COLOR,
          fontSize: "48px",
          textAlign: "center",
          marginTop: "40px",
          marginBottom: "40px"
        }}
      >
        {formatTime(time)}
      </p>

      {/* BUTTONS */}
      <p
        onClick={saveSession}
        style={{
          color: FREE_TRAINING_COLOR,
          fontSize: "26px",
          textAlign: "center",
          textDecoration: "underline",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        Save Session
      </p>

      <p
        onClick={startTimer}
        style={{
          color: FREE_TRAINING_COLOR,
          fontSize: "26px",
          textAlign: "center",
          textDecoration: "underline",
          cursor: "pointer",
          marginBottom: "10px"
        }}
      >
        Start Timer
      </p>

      <p
        onClick={stopTimer}
        style={{
          color: FREE_TRAINING_COLOR,
          fontSize: "26px",
          textAlign: "center",
          textDecoration: "underline",
          cursor: "pointer",
          marginBottom: "10px"
        }}
      >
        Stop Timer
      </p>

      <p
        onClick={resetTimer}
        style={{
          color: FREE_TRAINING_COLOR,
          fontSize: "26px",
          textAlign: "center",
          textDecoration: "underline",
          cursor: "pointer",
          marginBottom: "40px"
        }}
      >
        Reset Timer
      </p>

      {/* RETURN TO MENU */}
      <p
        onClick={() => setMenuOpen(true)}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          color: FREE_TRAINING_COLOR,
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
