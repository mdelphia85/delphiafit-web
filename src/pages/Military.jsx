import React, { useEffect, useState } from "react";
import {
  getMilitaryDrills,
  createMilitaryDrill,
  updateMilitaryDrill,
  deleteMilitaryDrill
} from "../api/tactical.js";
import { generateMilitaryDrill } from "../generators/military.js";

const categories = [
  "Physical Conditioning",
  "Weapons Handling",
  "Tactical Movement",
  "Rucking & Loadout",
  "Small Unit Tactics",
  "Combat Conditioning"
];

export default function Military() {
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
    missionType: "",
    terrain: "",
    loadoutWeight: "",
    engagementRange: "",
    teamRole: "",
    threatLevel: "",
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
        const data = await getMilitaryDrills();

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
        setError("Failed to load military drills.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // PAYLOAD BUILDERS
  const buildManualPayload = (categoryOverride = null) => {
    const category = categoryOverride || activeCategory;

    return {
      division: "military",
      category,
      name: formData.name,
      level: formData.level,
      duration: formData.duration,
      notes: formData.notes
    };
  };

  const buildGenPayload = () => ({
    division: "military",
    ...genData
  });

  // HANDLERS
  const openNewDrillModal = (category) => {
    setActiveCategory(category);
    setEditingDrill(null);
    setFormData({
      name: "",
      level: "",
      duration: "",
      notes: ""
    });
  };

  const openEditDrillModal = (category, drill) => {
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
    try {
      const payload = buildManualPayload();
      let saved;

      if (editingDrill) {
        saved = await updateMilitaryDrill(editingDrill._id, payload);
      } else {
        saved = await createMilitaryDrill(payload);
      }

      setDrillLists((prev) => {
        const copy = { ...prev };
        const cat = payload.category;

        if (editingDrill) {
          copy[cat] = copy[cat].map((d) =>
            d._id === editingDrill._id ? saved : d
          );
        } else {
          copy[cat] = [...copy[cat], saved];
        }

        return copy;
      });

      setActiveCategory(null);
      setEditingDrill(null);
    } catch (err) {
      console.error(err);
      setError("Failed to save drill.");
    }
  };

  const handleDelete = async (category, drillId) => {
    try {
      await deleteMilitaryDrill(drillId);
      setDrillLists((prev) => {
        const copy = { ...prev };
        copy[category] = copy[category].filter((d) => d._id !== drillId);
        return copy;
      });
    } catch (err) {
      console.error(err);
      setError("Failed to delete drill.");
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setGenLoading(true);
      setGenerated(null);
      const payload = buildGenPayload();
      const result = await generateMilitaryDrill(payload);
      setGenerated(result);
    } catch (err) {
      console.error(err);
      setError("Failed to generate drill.");
    } finally {
      setGenLoading(false);
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  // RENDER
  return (
    <div style={{ padding: 20, minHeight: "100vh", background: "#f4f6f8" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 16 }}>Military Drills</h1>

        {error && (
          <div
            style={{
              marginBottom: 12,
              padding: 10,
              borderRadius: 8,
              background: "#fee2e2",
              color: "#991b1b"
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading drills...</p>
        ) : (
          <>
            {/* MODE TOGGLE */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 16
              }}
            >
              <button
                type="button"
                onClick={() => handleModeChange("manual")}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border:
                    mode === "manual"
                      ? "2px solid #2563eb"
                      : "1px solid #cbd5e1",
                  background: mode === "manual" ? "#dbeafe" : "#ffffff",
                  cursor: "pointer"
                }}
              >
                Manual
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("generator")}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border:
                    mode === "generator"
                      ? "2px solid #2563eb"
                      : "1px solid #cbd5e1",
                  background: mode === "generator" ? "#dbeafe" : "#ffffff",
                  cursor: "pointer"
                }}
              >
                Generator
              </button>
            </div>

            {/* MANUAL MODE */}
            {mode === "manual" && (
              <div style={{ display: "grid", gap: 16 }}>
                {categories.map((cat) => (
                  <div
                    key={cat}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      background: "#ffffff",
                      border: "1px solid #e2e8f0"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8
                      }}
                    >
                      <h2 style={{ margin: 0, fontSize: 18 }}>{cat}</h2>
                      <button
                        type="button"
                        onClick={() => openNewDrillModal(cat)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 8,
                          border: "none",
                          background: "#2563eb",
                          color: "#ffffff",
                          cursor: "pointer",
                          fontSize: 13
                        }}
                      >
                        + Add Drill
                      </button>
                    </div>

                    {drillLists[cat].length === 0 ? (
                      <p style={{ fontSize: 13, color: "#64748b" }}>
                        No drills yet.
                      </p>
                    ) : (
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {drillLists[cat].map((drill) => (
                          <li
                            key={drill._id}
                            style={{
                              padding: 10,
                              borderRadius: 8,
                              border: "1px solid #e2e8f0",
                              marginBottom: 8,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center"
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 500 }}>
                                {drill.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "#64748b",
                                  marginTop: 2
                                }}
                              >
                                {drill.level && `Level: ${drill.level} · `}
                                {drill.duration &&
                                  `Duration: ${drill.duration} min`}
                              </div>
                              {drill.notes && (
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: "#475569",
                                    marginTop: 4
                                  }}
                                >
                                  {drill.notes}
                                </div>
                              )}
                            </div>

                            <div
                              style={{
                                display: "flex",
                                gap: 6
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => openEditDrillModal(cat, drill)}
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: 6,
                                  border: "1px solid #cbd5e1",
                                  background: "#f8fafc",
                                  cursor: "pointer",
                                  fontSize: 12
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(cat, drill._id)}
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: 6,
                                  border: "1px solid #fecaca",
                                  background: "#fee2e2",
                                  color: "#b91c1c",
                                  cursor: "pointer",
                                  fontSize: 12
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* GENERATOR MODE */}
            {mode === "generator" && (
              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  borderRadius: 12,
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  display: "grid",
                  gap: 12
                }}
              >
                <h2 style={{ margin: 0, fontSize: 18 }}>Generate Drill</h2>

                <form
                  onSubmit={handleGenerate}
                  style={{ display: "grid", gap: 10 }}
                >
                  <input
                    value={genData.duration}
                    onChange={(e) =>
                      setGenData({ ...genData, duration: e.target.value })
                    }
                    placeholder="Duration (minutes)"
                    style={inputStyle}
                  />
                  <input
                    value={genData.intensity}
                    onChange={(e) =>
                      setGenData({ ...genData, intensity: e.target.value })
                    }
                    placeholder="Intensity (Low/Moderate/High)"
                    style={inputStyle}
                  />
                  <input
                    value={genData.focus}
                    onChange={(e) =>
                      setGenData({ ...genData, focus: e.target.value })
                    }
                    placeholder="Focus (e.g., CQB, endurance, marksmanship)"
                    style={inputStyle}
                  />
                  <input
                    value={genData.environment}
                    onChange={(e) =>
                      setGenData({ ...genData, environment: e.target.value })
                    }
                    placeholder="Environment (indoor/outdoor/range/urban)"
                    style={inputStyle}
                  />
                  <input
                    value={genData.gearLoad}
                    onChange={(e) =>
                      setGenData({ ...genData, gearLoad: e.target.value })
                    }
                    placeholder="Gear Load (light/standard/full kit)"
                    style={inputStyle}
                  />
                  <input
                    value={genData.objective}
                    onChange={(e) =>
                      setGenData({ ...genData, objective: e.target.value })
                    }
                    placeholder="Objective (e.g., speed, accuracy, teamwork)"
                    style={inputStyle}
                  />

                  <button
                    type="submit"
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: "none",
                      background: "#2563eb",
                      color: "#ffffff",
                      cursor: "pointer"
                    }}
                    disabled={genLoading}
                  >
                    {genLoading ? "Generating..." : "Generate Drill"}
                  </button>
                </form>

                {generated && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: 12,
                      borderRadius: 10,
                      background: "#0f172a",
                      color: "#e5e7eb"
                    }}
                  >
                    <h3 style={{ marginTop: 0, marginBottom: 8 }}>
                      Generated Drill
                    </h3>
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        fontFamily: "monospace",
                        fontSize: 13,
                        margin: 0
                      }}
                    >
                      {JSON.stringify(generated, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* MANUAL MODAL */}
            {activeCategory && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(15, 23, 42, 0.45)",
                  padding: 20,
                  zIndex: 1000
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: 520,
                    background: "#ffffff",
                    borderRadius: 16,
                    padding: 24,
                    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.15)"
                  }}
                >
                  <h2>
                    {editingDrill ? "Edit Drill" : "Add Drill"} —{" "}
                    {activeCategory}
                  </h2>

                  <form
                    onSubmit={handleSubmit}
                    style={{ display: "grid", gap: 12 }}
                  >
                    <input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Drill Name"
                      required
                      style={inputStyle}
                    />

                    <input
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value })
                      }
                      placeholder="Level (Beginner/Intermediate/Advanced)"
                      style={inputStyle}
                    />

                    <input
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      placeholder="Duration (minutes)"
                      style={inputStyle}
                    />

                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Notes"
                      rows={4}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 10
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCategory(null);
                          setEditingDrill(null);
                        }}
                        style={cancelButton}
                      >
                        Cancel
                      </button>

                      <button type="submit" style={saveButton}>
                        {editingDrill ? "Save Changes" : "Save Drill"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #cbd5e1"
};

const cancelButton = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  cursor: "pointer"
};

const saveButton = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
  cursor: "pointer"
};
