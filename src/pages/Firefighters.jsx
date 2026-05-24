import React, { useEffect, useState } from "react";
import {
  getFirefighterDrills,
  createFirefighterDrill,
  updateFirefighterDrill,
  deleteFirefighterDrill
} from "../api/tactical.js";

import { generateFirefighterDrill } from "../generators/Firefighter";

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

  // -----------------------------
  // PAYLOAD BUILDERS
  // -----------------------------
  const buildManualPayload = (categoryOverride = null) => {
    const category = categoryOverride || activeCategory;

    return {
      division: "fire",
      category,
      name: formData.name,
      level: formData.level,
      duration: formData.duration,
      notes: formData.notes,

      // shared metadata
      intensity: null,
      focus: null,
      environment: null,
      objective: null,
      equipment: null,
      hazards: null,
      obstacles: null,
      weather: null,

      // EMS-specific
      gearLoad: null,
      crewSize: null,
      scenarioType: null,
      patientProfile: null,
      extractionType: null,
      medicalLoad: null,
      timePressure: null,

      // Fire-specific
      fireType: null,
      buildingType: null,
      smokeConditions: null,
      rescueProfile: null,

      // Military
      terrain: null,
      loadout: null,
      movementType: null,
      contactType: null,

      // Police
      suspectProfile: null,
      threatLevel: null
    };
  };

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

      // shared metadata
      intensity: drill.intensity || null,
      focus: drill.focus || null,
      environment: drill.environment || null,
      objective: drill.objective || null,
      equipment: drill.equipment || null,
      hazards: drill.hazards || null,
      obstacles: drill.obstacles || null,
      weather: drill.weather || null,

      // EMS-specific
      gearLoad: drill.gearLoad || null,
      crewSize: drill.crewSize || null,
      scenarioType: drill.scenarioType || null,
      patientProfile: null,
      extractionType: null,
      medicalLoad: null,
      timePressure: drill.timePressure || null,

      // Fire-specific
      fireType: drill.fireType || null,
      buildingType: drill.buildingType || null,
      smokeConditions: drill.smokeConditions || null,
      rescueProfile: drill.victimProfile || null,

      // Military
      terrain: null,
      loadout: null,
      movementType: null,
      contactType: null,

      // Police
      suspectProfile: null,
      threatLevel: null
    };
  };

  // -----------------------------
  // MANUAL HANDLERS
  // -----------------------------
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

  // -----------------------------
  // DELETE
  // -----------------------------
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

  // -----------------------------
  // GENERATOR
  // -----------------------------
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

  // -----------------------------
  // RENDER
  // -----------------------------
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
      </div>   // closes the maxWidth wrapper (line 303)
    </div>     // closes the page wrapper (line 302)
  );
}

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

                <div>
                  {drillLists[category].length === 0 ? (
                    <p style={{ color: "#6b7280" }}>No drills yet.</p>
                  ) : (
                    drillLists[category].map((drill) => (
                      <div
                        key={drill.id}
                        style={{
                          padding: 12,
                          marginBottom: 12,
                          borderRadius: 10,
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10
                        }}
                      >
                        <div>
                          <strong>{drill.name}</strong>
                          <div style={{ marginTop: 6, color: "#475569" }}>
                            {drill.level} · {drill.duration} min
                          </div>
                          {drill.notes && (
                            <p style={{ marginTop: 8, color: "#334155" }}>
                              {drill.notes}
                            </p>
                          )}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6
                          }}
                        >
                          <button
                            onClick={() => openEditForm(category, drill)}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 6,
                              border: "1px solid #cbd5e1",
                              background: "#e0f2fe",
                              cursor: "pointer",
                              fontSize: 12
                            }}
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(category, drill)}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 6,
                              border: "1px solid #fecaca",
                              background: "#fee2e2",
                              cursor: "pointer",
                              fontSize: 12,
                              color: "#b91c1c"
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={() => openCreateForm(category)}
                  style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: "#2563eb",
                    color: "#ffffff",
                    cursor: "pointer"
                  }}
                >
                  Add Drill to {category}
                </button>
              </section>
            ))}
          </div>
        )}

        {/* GENERATOR MODE */}
{mode === "generator" && (
  <div
    style={{
      marginTop: 10,
      padding: 20,
      background: "#ffffff",
      borderRadius: 12,
      border: "1px solid #e2e8f0"
    }}
  >
    <h2>Generate Firefighter Drill</h2>

    <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
      <input
        placeholder="Duration (minutes)"
        value={genData.duration}
        onChange={(e) =>
          setGenData({ ...genData, duration: e.target.value })
        }
        style={inputStyle}
      />

      <input
        placeholder="Intensity (Low / Medium / High)"
        value={genData.intensity}
        onChange={(e) =>
          setGenData({ ...genData, intensity: e.target.value })
        }
        style={inputStyle}
      />

      <input
        placeholder="Focus (SCBA, Hose, Ladders, etc.)"
        value={genData.focus}
        onChange={(e) =>
          setGenData({ ...genData, focus: e.target.value })
        }
        style={inputStyle}
      />

      <input
        placeholder="Environment (Interior, Exterior, Confined Space)"
        value={genData.environment}
        onChange={(e) =>
          setGenData({ ...genData, environment: e.target.value })
        }
        style={inputStyle}
      />

      <input
        placeholder="Gear Load (Light, Full Turnout Gear, SCBA)"
        value={genData.gearLoad}
        onChange={(e) =>
          setGenData({ ...genData, gearLoad: e.target.value })
        }
        style={inputStyle}
      />

      <input
        placeholder="Objective (Search, Rescue, Fire Attack, etc.)"
        value={genData.objective}
        onChange={(e) =>
          setGenData({ ...genData, objective: e.target.value })
        }
        style={inputStyle}
      />

      <input
        placeholder="Crew Size"
        value={genData.crewSize}
        onChange={(e) =>
          setGenData({ ...genData, crewSize: e.target.value })
        }
        style={inputStyle}
      />

      <input
        placeholder="Required Equipment (comma-separated)"
        value={genData.equipment}
        onChange={(e) =>
          setGenData({ ...genData, equipment: e.target.value })
        }
        style={inputStyle}
      />

      <input
        placeholder="Weather Conditions"
        value={genData.weather}
        onChange={(e) =>
          setGenData({ ...genData, weather: e.target.value })
        }
        style={inputStyle}
      />

      <input
        placeholder="Scenario Type (Structure Fire, Rescue, etc.)"
        value={genData.scenarioType}
        onChange={(e) =>
          setGenData({ ...genData, scenarioType: e.target.value })
        }
        style={inputStyle}
      />

      <input
        placeholder="Victim Profile (Adult, Child, Unconscious, etc.)"
        value={genData.victimProfile}
        onChange={(e) =>
          setGenData({ ...genData, victimProfile: e.target.value })
        }
        style={inputStyle}
      />

      <input
        placeholder="Time Pressure (Low, Moderate, High)"
        value={genData.timePressure}
        onChange={(e) =>
          setGenData({ ...genData, timePressure: e.target.value })
        }
        style={inputStyle}
      />

      <input
        placeholder="Obstacles (comma-separated)"
        value={genData.obstacles}
        onChange={(e) =>
          setGenData({ ...genData, obstacles: e.target.value })
        }
        style={inputStyle}
      />

      <input
        placeholder="Hazards (comma-separated)"
        value={genData.hazards}
        onChange={(e) =>
          setGenData({ ...genData, hazards: e.target.value })
        }
        style={inputStyle}
      />

      <button
        onClick={generateDrill}
        style={saveButton}
        type="button"
      >
        {genLoading ? "Generating..." : "Generate Drill"}
      </button>
    </div>

    {generated && (
      <div
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 12,
          background: "#f8fafc",
          border: "1px solid #e2e8f0"
        }}
      >
        <h3>{generated.name}</h3>
        <p>{generated.description}</p>

        <p><strong>Duration:</strong> {generated.duration} min</p>
        <p><strong>Intensity:</strong> {generated.intensity}</p>
        <p><strong>Focus:</strong> {generated.focus}</p>
        <p><strong>Environment:</strong> {generated.environment}</p>
        <p><strong>Gear Load:</strong> {generated.gearLoad}</p>
        <p><strong>Objective:</strong> {generated.objective}</p>
        <p><strong>Crew Size:</strong> {generated.crewSize}</p>
        <p><strong>Required Equipment:</strong> {generated.equipment}</p>
        <p><strong>Weather:</strong> {generated.weather}</p>
        <p><strong>Scenario Type:</strong> {generated.scenarioType}</p>
        <p><strong>Victim Profile:</strong> {generated.victimProfile}</p>
        <p><strong>Time Pressure:</strong> {generated.timePressure}</p>
        <p><strong>Obstacles:</strong> {generated.obstacles}</p>
        <p><strong>Hazards:</strong> {generated.hazards}</p>

        <button
          onClick={() => saveGenerated(generated)}
          style={{ ...saveButton, marginTop: 12 }}
          type="button"
        >
          Save to Drills
        </button>
      </div>
    )}
  </div>
)}
