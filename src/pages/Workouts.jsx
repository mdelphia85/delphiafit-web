import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../context/MenuContext.jsx";

// ⭐ Phase 4 AI imports
import { updatePersonalizationEngine } from "../ai/personalizationEngine";
import { updateBehavior } from "../ai/behaviorEngine";

export default function Sports() {
  const navigate = useNavigate();
  const { openMenu } = useContext(MenuContext);

  const [mode, setMode] = useState("generator");

  const [sportsList, setSportsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [drill, setDrill] = useState(null);

  const [sport, setSport] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  const [manualSport, setManualSport] = useState("");
  const [manualDuration, setManualDuration] = useState("");
  const [manualNotes, setManualNotes] = useState("");

  const token = localStorage.getItem("token");

  // -----------------------------
  // TOKEN CHECK
  // -----------------------------
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // -----------------------------
  // LOAD SPORTS
  // -----------------------------
  useEffect(() => {
    async function loadSports() {
      if (!token) return;

      try {
        const res = await fetch(
          "https://delphiafit-backend-production.up.railway.app/sports",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        setSportsList(data.sports || []);
      } catch (err) {
        console.error("Error loading sports:", err);
        setSportsList([]);
      }
    }

    loadSports();
  }, [token]);

  // -----------------------------
  // LOAD CATEGORIES
  // -----------------------------
  useEffect(() => {
    async function loadCategories() {
      if (!sport || !token) return;

      try {
        const res = await fetch(
          `https://delphiafit-backend-production.up.railway.app/sports/${sport}/skills`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        setCategories(data.skills || []);
        setCategory("");
        setLevel("");
        setDrill(null);
      } catch (err) {
        console.error("Error loading categories:", err);
        setCategories([]);
      }
    }

    loadCategories();
  }, [sport, token]);

  // -----------------------------
  // LOAD LEVELS
  // -----------------------------
  useEffect(() => {
    async function loadLevels() {
      if (!sport || !category || !token) return;

      try {
        const res = await fetch(
          `https://delphiafit-backend-production.up.railway.app/sports/${sport}/${category}/levels`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        setLevels(data.levels || []);
        setLevel("");
        setDrill(null);
      } catch (err) {
        console.error("Error loading levels:", err);
        setLevels([]);
      }
    }

    loadLevels();
  }, [category, sport, token]);

  // -----------------------------
  // GENERATE DRILL
  // -----------------------------
  async function handleGenerate() {
    if (!sport || !category || !level || !token) return;

    try {
      const res = await fetch(
        `https://delphiafit-backend-production.up.railway.app/sports/${sport}/${category}/${level}/drills`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setDrill(data.drill || null);
    } catch (err) {
      console.error("Error loading drill:", err);
      setDrill(null);
    }
  }

  // -----------------------------
  // SAVE WORKOUT (FULL PHASE 4 IMPLEMENTATION)
  // -----------------------------
  async function handleSaveWorkout() {
    if (!token) return;

    const basePayload =
      mode === "manual"
        ? {
            mode: "manual",
            sport: manualSport,
            duration: manualDuration,
            notes: manualNotes,
          }
        : {
            mode: "generator",
            sport,
            category,
            level,
            drill,
            duration,
            notes,
          };

    const payload = {
      ...basePayload,
      timestamp: new Date().toISOString(),
      completed: true,
    };

    try {
      const res = await fetch(
        "https://delphiafit-backend-production.up.railway.app/workouts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        console.error("Failed to save workout");
        return;
      }

      const data = await res.json();
      console.log("Workout saved:", data);

      // ⭐ Phase 4 AI learning payload
      const workoutForAI = {
        ...payload,
        intensityScore: 0.5,
        durationAccuracy: 0.9,
        blockCompletion: {
          warmup: 1,
          main: 1,
          finisher: 0,
          cooldown: 1,
        },
      };

      updatePersonalizationEngine(workoutForAI);
      updateBehavior(workoutForAI);
    } catch (err) {
      console.error("Error saving workout:", err);
    }
  }

  // -----------------------------
  // UI COLORS
  // -----------------------------
  const BACKGROUND = "#000000";
  const TEXT = "#FFFFFF";
  const ACCENT = "#B3FF00";

  // -----------------------------
  // RETURN UI
  // -----------------------------
  return (
    <div
      style={{
        backgroundColor: BACKGROUND,
        minHeight: "100vh",
        padding: "20px",
        color: TEXT,
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* MODE TOGGLE */}
      <div style={{ display: "flex", marginBottom: "20px" }}>
        <div
          onClick={() => setMode("manual")}
          style={{
            flex: 1,
            padding: "10px",
            backgroundColor: mode === "manual" ? ACCENT : "#111",
            color: mode === "manual" ? BACKGROUND : ACCENT,
            border: `1px solid ${ACCENT}`,
            borderRadius: "6px 0 0 6px",
            fontWeight: "bold",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          Manual
        </div>

        <div
          onClick={() => setMode("generator")}
          style={{
            flex: 1,
            padding: "10px",
            backgroundColor: mode === "generator" ? ACCENT : "#111",
            color: mode === "generator" ? BACKGROUND : ACCENT,
            border: `1px solid ${ACCENT}`,
            borderRadius: "0 6px 6px 0",
            fontWeight: "bold",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          Generator
        </div>
      </div>

      {/* ----------------------------- */}
      {/* MANUAL MODE (A) */}
      {/* ----------------------------- */}
      {mode === "manual" && (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#111",
            borderRadius: "6px",
            border: `1px solid ${ACCENT}`,
          }}
        >
          <label style={{ color: ACCENT }}>Sport Performed</label>
          <input
            type="text"
            value={manualSport}
            onChange={(e) => setManualSport(e.target.value)}
            placeholder="e.g., Basketball Shooting Drills"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "8px",
              backgroundColor: "#000",
              color: ACCENT,
              border: `1px solid ${ACCENT}`,
              borderRadius: "6px",
            }}
          />

          <label style={{ color: ACCENT, marginTop: "15px", display: "block" }}>
            Duration (minutes)
          </label>
          <input
            type="number"
            value={manualDuration}
            onChange={(e) => setManualDuration(e.target.value)}
            placeholder="e.g., 45"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "8px",
              backgroundColor: "#000",
              color: ACCENT,
              border: `1px solid ${ACCENT}`,
              borderRadius: "6px",
            }}
          />

          <label style={{ color: ACCENT, marginTop: "15px", display: "block" }}>
            Notes
          </label>
          <textarea
            value={manualNotes}
            onChange={(e) => setManualNotes(e.target.value)}
            placeholder="Optional notes about the workout"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "8px",
              backgroundColor: "#000",
              color: ACCENT,
              border: `1px solid ${ACCENT}`,
              borderRadius: "6px",
              minHeight: "80px",
            }}
          />
        </div>
      )}

      {/* ----------------------------- */}
      {/* GENERATOR MODE (C) */}
      {/* ----------------------------- */}
      {mode === "generator" && (
        <>
          {/* SPORT SELECTOR */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ color: ACCENT }}>Sport</label>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "8px",
                backgroundColor: "#111",
                color: ACCENT,
                border: `1px solid ${ACCENT}`,
                borderRadius: "6px",
              }}
            >
              <option value="">Select Sport</option>
              {sportsList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* CATEGORY SELECTOR */}
          {sport && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ color: ACCENT }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "8px",
                  backgroundColor: "#111",
                  color: ACCENT,
                  border: `1px solid ${ACCENT}`,
                  borderRadius: "6px",
                }}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* LEVEL SELECTOR */}
          {category && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ color: ACCENT }}>Skill Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "8px",
                  backgroundColor: "#111",
                  color: ACCENT,
                  border: `1px solid ${ACCENT}`,
                  borderRadius: "6px",
                }}
              >
                <option value="">Select Level</option>
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* GENERATE DRILL */}
          {level && (
            <div
              onClick={handleGenerate}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: ACCENT,
                color: BACKGROUND,
                borderRadius: "6px",
                fontWeight: "bold",
                marginTop: "10px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Generate Drill
            </div>
          )}

          {/* DRILL RESULT */}
          {drill && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: "#111",
                borderRadius: "6px",
                border: `1px solid ${ACCENT}`,
              }}
            >
              <p style={{ color: ACCENT, marginBottom: "8px" }}>Drill</p>
              <p>{drill}</p>
            </div>
          )}

          {/* DURATION */}
          {drill && (
            <div style={{ marginTop: "20px" }}>
              <label style={{ color: ACCENT }}>Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 30"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "8px",
                  backgroundColor: "#000",
                  color: ACCENT,
                  border: `1px solid ${ACCENT}`,
                  borderRadius: "6px",
                }}
              />
            </div>
          )}

          {/* NOTES */}
          {drill && (
            <div style={{ marginTop: "20px" }}>
              <label style={{ color: ACCENT }}>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes about the workout"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "8px",
                  backgroundColor: "#000",
                  color: ACCENT,
                  border: `1px solid ${ACCENT}`,
                  borderRadius: "6px",
                  minHeight: "80px",
                }}
              />
            </div>
          )}
        </>
      )}

      {/* SAVE WORKOUT (BOTTOM LEFT) */}
      <div
        onClick={handleSaveWorkout}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          color: ACCENT,
          cursor: "pointer",
          textDecoration: "underline",
          fontSize: "18px",
        }}
      >
        Save Workout
      </div>

      {/* RETURN TO MENU (BOTTOM RIGHT) */}
      <div
        onClick={openMenu}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          color: ACCENT,
          cursor: "pointer",
          textDecoration: "underline",
          fontSize: "18px",
        }}
      >
        Return to Menu
      </div>
    </div>
  );
}
