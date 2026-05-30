import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../context/MenuContext.jsx";

export default function Sports() {
  const navigate = useNavigate();
  const { openMenu } = useContext(MenuContext);

  const [sportsList, setSportsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [drill, setDrill] = useState(null);

  const [sport, setSport] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");

  const token = localStorage.getItem("token");

  // -----------------------------
  // LOCAL TOKEN CHECK ONLY
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
        "https://api.delphiafit.com/sports",
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
        `https://api.delphiafit.com/sports/${sport}/skills`,
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
        `https://api.delphiafit.com/sports/${sport}/${category}/levels`,
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
      `https://api.delphiafit.com/sports/${sport}/${category}/${level}/drills`,
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
}
