import React, { useEffect, useState } from "react";
import {
  getFirefighterDrills,
  createFirefighterDrill,
  updateFirefighterDrill,
  deleteFirefighterDrill
} from "../api/tactical.js";

import { generateFirefighterDrill } from "../generators/firefighter";

const categories = [
  "SCBA Endurance",
  "Hose Drills",
  "Ladder Operations",
  "Search & Rescue",
  "Forcible Entry",
  "Fireground Conditioning"
];

export default function Firefighters() {
  const [mode, setMode] = useState("manual");

  const [drillLists, setDrillLists] = useState(
    categories.reduce((acc, c) => ({ ...acc, [c]: [] }), {})
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [editingDrill, setEditingDrill] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    level: "",
    duration: "",
    notes: ""
  });

  const [genData, setGenData] = useState({
    duration: "",
    intensity: "",
    focus: "",
    environment: "",
    gearLoad: "",
    objective: "",
    crewSize: "",
    equipment: "",
    weather: "",
    scenarioType: "",
    victimProfile: "",
    timePressure: "",
    obstacles: "",
    hazards: ""
  });

  const [genLoading, setGenLoading] = useState(false);
  const [generated, setGenerated] = useState(null);

  // LOAD DRILLS
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getFirefighterDrills();

        const grouped = categories.reduce(
          (acc, c) => ({ ...acc, [c]: [] }),
          {}
        );

        data.forEach((d) => {
          if (grouped[d.category]) grouped[d.category].push(d);
        });

        setDrillLists(grouped);
      } catch (err) {
        console.error(err);
        setError("Failed to load drills.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // MANUAL PAYLOAD
  const buildManualPayload = (categoryOverride = null) => {
    const category = categoryOverride || activeCategory;

    return {
      division: "fire",
      category,
      name: formData.name,
      level: formData.level,
      duration: formData.duration,
      notes: formData.notes,

      intensity: null,
      focus: null,
      environment: null,
      objective: null,
      equipment: null,
      hazards: null,
      obstacles: null,
      weather: null,

      gearLoad: null,
      crewSize: null,
      scenarioType: null,
      patientProfile: null,
      extractionType: null,
      medicalLoad: null,
      timePressure: null,

      fireType: null,
      buildingType: null,
      smokeConditions: null,
      rescueProfile: null,

      terrain: null,
      loadout: null,
      movementType: null,
      contactType: null,

      suspectProfile: null,
      threatLevel: null
    };
  };

  // GENERATED PAYLOAD
  const buildGeneratedPayload = (drill) => {
    const category = categories.includes(drill.focus)
      ? drill.focus
      : "Fireground Conditioning";

    return {
      division: "fire",
      category,
      name: drill.name,
      level: drill.intensity,
      duration: drill.duration,
      notes: drill.description,

      intensity: drill.intensity || null,
      focus: drill.focus || null,
      environment: drill.environment || null,
      objective: drill.objective || null,
      equipment: drill.equipment || null,
      hazards: drill.hazards || null,
      obstacles: drill.obstacles || null,
      weather: drill.weather || null,

      gearLoad: drill.gearLoad || null,
      crewSize: drill.crewSize || null,
      scenarioType: drill.scenarioType || null,
      patientProfile: null,
      extractionType: null,
      medicalLoad: null,
      timePressure: drill.timePressure || null,

      fireType: drill.fireType || null,
      buildingType: drill.buildingType || null,
      smokeConditions: drill.smokeConditions || null,
      rescueProfile: drill.victimProfile || null,

      terrain: null,
      loadout: null,
      movementType: null,
      contactType: null,

      suspectProfile: null,
      threatLevel: null
    };
  };

  // MANUAL HANDLERS
  const openCreateForm = (category) => {
    setActiveCategory(category);
    setEditingDrill(null);
    setFormData({ name: "", level: "", duration: "", notes: "" });
  };

  const openEditForm = (category, drill) => {
    setActiveCategory(category);
    setEditingDrill(drill);
    setFormData({
      name: drill.name || "",
      level: drill.level || "",
      duration: drill.duration || "",
      notes: drill.notes || ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setError("");

      if (editingDrill) {
        const payload = buildManualPayload();
        const updated = await updateFirefighterDrill(editingDrill.id, payload);

        setDrillLists((prev) => ({
          ...prev,
          [activeCategory]: prev[activeCategory].map((d) =>
            d.id === editingDrill.id ? updated : d
          )
        }));
      } else {
        const payload = buildManualPayload();
        const created = await createFirefighterDrill(payload);

        setDrillLists((prev) => ({
          ...prev,
          [activeCategory]: [...prev[activeCategory], created]
        }));
      }

      setActiveCategory(null);
      setEditingDrill(null);
    } catch (err) {
      console.error(err);
      setError("Failed to save drill.");
    }
  };

  // DELETE
  const handleDelete = async (category, drill) => {
    if (!window.confirm("Delete this drill?")) return;

    try {
      await deleteFirefighterDrill(drill.id);

      setDrillLists((prev) => ({
        ...prev,
        [category]: prev[category].filter((d) => d.id !== drill.id)
      }));
    } catch (err) {
      console.error(err);
      setError("Failed to delete drill.");
    }
  };

  // GENERATOR
  const generateDrill = async () => {
    try {
      setError("");
      setGenLoading(true);
      setGenerated(null);

      const data = generateFirefighterDrill(genData);
      setGenerated(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate drill.");
    } finally {
      setGenLoading(false);
    }
  };

  const saveGenerated = async (drill) => {
    try {
      setError("");

      const payload = buildGeneratedPayload(drill);
      const created = await createFirefighterDrill(payload);

      setDrillLists((prev) => ({
        ...prev,
        [payload.category]: [...prev[payload.category], created]
      }));

      setMode("manual");
      setGenerated(null);
    } catch (err) {
      console.error(err);
      setError("Failed to save generated drill.");
    }
  };

  // RENDER
  return (
    <div style={{ padding: 20, minHeight: "100vh", background: "#f4f6f8" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h1>Firefighters Tactical Drills</h1>

        {loading && <p>Loading drills...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* MODE TOGGLE */}
        <div style={{ display: "flex", gap: 12, margin: "16px 0 24px" }}>
          <button
            onClick={() => setMode("manual")}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border:
                mode === "manual" ? "2px solid #2563eb" : "1px solid #cbd5e1",
              background: mode === "manual" ? "#dbeafe" : "#f8fafc",
              cursor: "pointer"
            }}
          >
            Manual Entry
          </button>

          <button
            onClick={() => setMode("generator")}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border:
                mode === "generator"
                  ? "2px solid #2563eb"
                  : "1px solid #cbd5e1",
              background: mode === "generator" ? "#dbeafe" : "#f8fafc",
              cursor: "pointer"
            }}
          >
            Generator
          </button>
        </div>

        {/* MANUAL MODE */}
        {mode === "manual" && (
          <div style={{ display: "grid", gap: 20 }}>
            {categories.map((category) => (
              <section
                key={category}
                style={{
                  border: "1px solid #dfe3e8",
                  borderRadius: 12,
                  padding: 18,
                  background: "#ffffff"
                }}
              >
                <h2>{category}</h2>

                <button
                  onClick={() => openCreateForm(category)}
                  style={{
                    marginBottom: 12,
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Add Drill
                </button>

                {drillLists[category].map((drill) => (
                  <div
                    key={drill.id}
                    style={{
                      padding: 12,
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      marginBottom: 10
                    }}
                  >
                    <strong>{drill.name}</strong> — {drill.duration} mins
                    <br />
                    Level: {drill.level}
                    <br />
                    <button
                      onClick={() => openEditForm(category, drill)}
                      style={{
                        marginRight: 10,
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #2563eb",
                        background: "#eff6ff",
                        cursor: "pointer"
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category, drill)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #dc2626",
                        background: "#fee2e2",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </section>
            ))}
          </div>
        )}

        {/* GENERATOR MODE */}
        {mode === "generator" && (
          <div style={{ marginTop: 20 }}>
            <h2>Generate Firefighter Drill</h2>

            <div style={{ display: "grid", gap: 12, maxWidth: 500 }}>
              {Object.keys(genData).map((key) => (
                <input
                  key={key}
                  placeholder={key}
                  value={genData[key]}
                  onChange={(e) =>
                    setGenData({ ...genData, [key]: e.target.value })
                  }
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #cbd5e1"
                  }}
                />
              ))}
            </div>

            <button
              onClick={generateDrill}
              disabled={genLoading}
              style={{
                marginTop: 16,
                padding: "10px 14px",
                borderRadius: 8,
                background: "#2563eb",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}
            >
              {genLoading ? "Generating..." : "Generate Drill"}
            </button>

            {generated && (
              <div
                style={{
                  marginTop: 20,
                  padding: 18,
                  borderRadius: 12,
                  background: "#ffffff",
                  border: "1px solid #dfe3e8"
                }}
              >
                <h3>{generated.name}</h3>
                <p>{generated.description}</p>

                <button
                  onClick={() => saveGenerated(generated)}
                  style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: "#16a34a",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Save Drill
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
