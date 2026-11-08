import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../context/MenuContext.js";
import { apiRequest } from "../utils/api.js";

export default function FreeTraining() {
  const navigate = useNavigate();
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

  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  // ⭐ Local token check only — NO backend verification
  useEffect(() => {
    if (!token) navigate("/login");
  }, [navigate, token]);

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

  async function saveSession() {
    setStatus("loading");

    try {
      if (time < 1) {
        setStatus("error");
        setErrorMessage("Start the timer and record at least one second before saving.");
        return;
      }
      await apiRequest("/workouts/save", { method: "POST", body: {
        mode: "manual",
        manual_name: fields.name.trim() || "Free Training",
        duration_minutes: Math.max(1, Math.round(time / 60)),
        manual_notes: [fields.skill && `Skill: ${fields.skill}`, fields.notes, fields.extra].filter(Boolean).join("\n"),
        workout_type: fields.skill || "free_training",
        timestamp: new Date().toISOString()
      } });

      setStatus("success");
      resetTimer();
      setFields({ name: "", skill: "", notes: "", extra: "" });

    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "Server error. Please try again.");
    }
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
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
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

      {/* STATUS MESSAGE */}
      {status === "error" && (
        <p style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>
          {errorMessage}
        </p>
      )}

      {status === "success" && (
        <p style={{ color: "lightgreen", textAlign: "center", marginBottom: "20px" }}>
          Session Saved!
        </p>
      )}

      {/* BUTTONS */}
      <p
        onClick={saveSession}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          color: FREE_TRAINING_COLOR,
          fontSize: "26px",
          textDecoration: "underline",
          cursor: "pointer",
          margin: 0
        }}
      >
        {status === "loading" ? "Saving..." : "Save Session"}
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
          position: "fixed",
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
