import React, { useState, useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import {
  SPORTS,
  SKILL_LEVELS,
  getSportsList,
  getCategoriesForSport,
  generateDrill
} from "../generators/sportsGenerator";

export default function Sports() {
  const [sport, setSport] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [result, setResult] = useState(null);

  const { openMenu } = useContext(MenuContext);

  const sportsList = getSportsList();
  const categories = sport ? getCategoriesForSport(sport) : [];

  const handleGenerate = () => {
    if (!sport || !category || !level) return;
    const drill = generateDrill(sport, category, level);
    setResult(drill);
  };

  // Native app colors
  const BACKGROUND = "#000000";      // black
  const TEXT = "#FFFFFF";            // white
  const ACCENT = "#B3FF00";          // neon yellow-green

  return (
    <div
      className="sports-screen"
      style={{
        backgroundColor: BACKGROUND,
        minHeight: "100vh",
        padding: "20px",
        color: TEXT,
        fontFamily: "sans-serif",
        position: "relative"
      }}
    >

      <h1 style={{ color: ACCENT, marginBottom: "20px" }}>
        Sports Generator
      </h1>

      {/* SPORT SELECTOR */}
      <div className="section" style={{ marginBottom: "20px" }}>
        <label style={{ color: ACCENT }}>Sport</label>
        <select
          value={sport}
          onChange={(e) => {
            setSport(e.target.value);
            setCategory("");
            setResult(null);
          }}
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
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* CATEGORY SELECTOR */}
      {sport && (
        <div className="section" style={{ marginBottom: "20px" }}>
          <label style={{ color: ACCENT }}>Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setResult(null);
            }}
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
              <option key={c} value={c}>{c}</option>
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
            {SKILL_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
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

      {/* OUTPUT */}
      {result && (
        <div
          className="output-box"
          style={{
            marginTop: "30px",
            padding: "15px",
            backgroundColor: "#111",
            borderRadius: "6px",
            border: `1px solid ${ACCENT}`,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <h3
            style={{
              color: ACCENT,
              margin: 0,
              padding: 0,
            }}
          >
            Generated Drill
          </h3>

          <p
            style={{
              color: ACCENT,
              marginTop: "8px",
              marginBottom: 0,
            }}
          >
            {result.output}
          </p>
        </div>
      )}

      {/* RETURN TO MENU */}
      <div
        onClick={openMenu}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          color: ACCENT,
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
