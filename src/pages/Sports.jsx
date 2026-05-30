import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../context/MenuContext.jsx";

export default function Sports() {
  const navigate = useNavigate();
  const { openMenu } = useContext(MenuContext);

  const [mode, setMode] = useState("generator"); // manual or generator

  const [sportsList, setSportsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [drill, setDrill] = useState(null);

  const [sport, setSport] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");

  const [manualSport, setManualSport] = useState("");
  const [manualDuration, setManualDuration] = useState("");

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
      className="sports-screen"
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
        <button
          onClick={() => setMode("manual")}
          style={{
            flex: 1,
            padding: "10px",
            backgroundColor: mode === "manual" ? ACCENT : "#111",
            color: mode === "manual" ? BACKGROUND : ACCENT,
            border: `1px solid ${ACCENT}`,
            borderRadius: "6px 0 0 6px",
            fontWeight: "bold",
          }}
        >
          Manual
        </button>

        <button
          onClick={() => setMode("generator")}
          style={{
            flex: 1,
            padding: "10px",
            backgroundColor: mode === "generator" ? ACCENT : "#111",
            color: mode === "generator" ? BACKGROUND : ACCENT,
            border: `1px solid ${ACCENT}`,
            borderRadius: "0 6px 6px 0",
            fontWeight: "bold",
          }}
        >
          Generator
        </button>
      </div>

      {/* ----------------------------- */}
      {/* MANUAL MODE */}
      {/* ----------------------------- */}
      {mode === "manual" && (
        <div
          style={{
            marginTop: "10px",
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

          <button
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: ACCENT,
              color: BACKGROUND,
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              marginTop: "15px",
            }}
          >
            Log Activity
          </button>
        </div>
      )}

      {/* ----------------------------- */}
      {/* GENERATOR MODE */}
      {/* ----------------------------- */}
      {mode === "generator" && (
        <>
          {/* SPORT SELECTOR */}
          <div className="section" style={{ marginBottom: "20px" }}>
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
            <div className="section" style={{ marginBottom: "20px" }}>
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
            <div className="section" style={{ marginBottom: "20px" }}>
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

          {/* GENERATE BUTTON */}
          {level && (
            <button
              className="generate-btn"
              onClick={handleGenerate}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: ACCENT,
                color: BACKGROUND,
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              Generate Drill
            </button>
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
        </>
      )}

      {/* RETURN TO MENU */}
      <div
        onClick={openMenu}
        style={{
          marginTop: "40px",
          textDecoration: "underline",
          color: ACCENT,
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        Return to Menu
      </div>
    </div>
  );
}
