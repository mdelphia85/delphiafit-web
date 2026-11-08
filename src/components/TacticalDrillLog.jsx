import { useContext, useEffect, useMemo, useState } from "react";
import carbon from "../assets/carbon.png";
import { MenuContext } from "../context/MenuContext.js";
import {
  createEMSDrill, createFirefighterDrill, createMilitaryDrill, createPoliceDrill,
  deleteEMSDrill, deleteFirefighterDrill, deleteMilitaryDrill, deletePoliceDrill,
  getEMSDrills, getFirefighterDrills, getMilitaryDrills, getPoliceDrills,
  updateEMSDrill, updateFirefighterDrill, updateMilitaryDrill, updatePoliceDrill
} from "../api/tactical.js";
import { generateEMSDrill } from "../generators/ems.js";
import { generateFirefighterDrill } from "../generators/firefighter.js";
import { generateMilitaryDrill } from "../generators/military.js";
import { generatePoliceDrill } from "../generators/police.js";

const divisions = {
  firefighters: { load: getFirefighterDrills, create: createFirefighterDrill, update: updateFirefighterDrill, remove: deleteFirefighterDrill, generate: generateFirefighterDrill },
  ems: { load: getEMSDrills, create: createEMSDrill, update: updateEMSDrill, remove: deleteEMSDrill, generate: generateEMSDrill },
  police: { load: getPoliceDrills, create: createPoliceDrill, update: updatePoliceDrill, remove: deletePoliceDrill, generate: generatePoliceDrill },
  military: { load: getMilitaryDrills, create: createMilitaryDrill, update: updateMilitaryDrill, remove: deleteMilitaryDrill, generate: generateMilitaryDrill }
};

export default function TacticalDrillLog({ division, title, accent, sections }) {
  const { setMenuOpen } = useContext(MenuContext);
  const api = divisions[division];
  const [drills, setDrills] = useState([]);
  const [category, setCategory] = useState(sections[0]);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [focus, setFocus] = useState(sections[0]);
  const [environment, setEnvironment] = useState("Urban");
  const [duration, setDuration] = useState("30");
  const [intensity, setIntensity] = useState("Medium");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const groupedDrills = useMemo(() => sections.map((section) => ({
    section,
    drills: drills.filter((drill) => drill.category === section)
  })), [drills, sections]);

  useEffect(() => {
    let active = true;
    api.load().then((items) => {
      if (active) setDrills(items);
    }).catch((requestError) => {
      if (active) setError(requestError.message || "Unable to load saved drills.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [api]);

  function generate() {
    const generated = api.generate({ focus, environment, duration, intensity });
    setName(generated.name);
    setNotes(generated.description);
  }

  async function saveDrill(event) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Enter a drill name or generate one before saving.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const created = await api.create({
        category,
        name: name.trim(),
        notes: notes.trim() || null,
        duration,
        level: intensity,
        intensity,
        focus,
        environment
      });
      setDrills((current) => [created, ...current]);
      setName("");
      setNotes("");
    } catch (requestError) {
      setError(requestError.message || "Unable to save this drill.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleCompletion(drill) {
    setError("");
    try {
      const updated = await api.update(drill.id, { completed: !drill.completed });
      setDrills((current) => current.map((item) => item.id === drill.id ? updated : item));
    } catch (requestError) {
      setError(requestError.message || "Unable to update drill completion.");
    }
  }

  async function removeDrill(id) {
    setError("");
    try {
      await api.remove(id);
      setDrills((current) => current.filter((item) => item.id !== id));
    } catch (requestError) {
      setError(requestError.message || "Unable to delete this drill.");
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundImage: `url(${carbon})`, backgroundSize: "cover", backgroundPosition: "center", padding: "40px 20px 90px", position: "relative", color: "#fff" }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.75)" }} />
      <main style={{ position: "relative", zIndex: 2, maxWidth: "900px", margin: "0 auto" }}>
        <header style={{ color: accent, marginBottom: "24px" }}>
          <h1 style={{ margin: 0 }}>{title}</h1>
          <p>Training drill log ? saved to your account</p>
        </header>
        {error && <div role="alert" style={{ padding: "10px", marginBottom: "14px", color: "#fecaca", background: "#441b1b", borderRadius: "8px" }}>{error}</div>}
        <form onSubmit={saveDrill} style={{ display: "grid", gap: "12px", padding: "18px", marginBottom: "24px", background: "rgba(0,0,0,0.7)", border: `1px solid ${accent}`, borderRadius: "10px" }}>
          <h2 style={{ margin: 0, color: accent }}>Create drill</h2>
          <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)} style={fieldStyle}>{sections.map((section) => <option key={section}>{section}</option>)}</select></label>
          <label>Focus<input value={focus} onChange={(event) => setFocus(event.target.value)} style={fieldStyle} /></label>
          <label>Environment<input value={environment} onChange={(event) => setEnvironment(event.target.value)} style={fieldStyle} /></label>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <label>Duration (minutes)<input type="number" min="1" value={duration} onChange={(event) => setDuration(event.target.value)} style={fieldStyle} /></label>
            <label>Intensity<select value={intensity} onChange={(event) => setIntensity(event.target.value)} style={fieldStyle}><option>Low</option><option>Medium</option><option>High</option></select></label>
          </div>
          <button type="button" onClick={generate} style={buttonStyle(accent)}>Generate drill details</button>
          <label>Drill name<input required value={name} onChange={(event) => setName(event.target.value)} style={fieldStyle} /></label>
          <label>Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows="3" style={fieldStyle} /></label>
          <button type="submit" disabled={saving} style={buttonStyle(accent)}>{saving ? "Saving?" : "Save drill"}</button>
        </form>
        <section aria-busy={loading}>
          <h2 style={{ color: accent }}>Saved drills</h2>
          {loading ? <p role="status">Loading saved drills?</p> : drills.length === 0 ? <p>No drills saved yet. Create one above to get started.</p> : groupedDrills.map(({ section, drills: sectionDrills }) => (
            <section key={section} style={{ padding: "16px", marginBottom: "14px", background: "rgba(0,0,0,0.6)", border: `1px solid ${accent}`, borderRadius: "10px" }}>
              <h3 style={{ color: accent, marginTop: 0 }}>{section}</h3>
              {sectionDrills.length === 0 ? <p>No drills in this category yet.</p> : sectionDrills.map((drill) => (
                <article key={drill.id} style={{ padding: "12px 0", borderTop: "1px solid #444" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
                    <strong style={{ textDecoration: drill.completed ? "line-through" : "none" }}>{drill.name}</strong>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button type="button" onClick={() => toggleCompletion(drill)}>{drill.completed ? "Mark incomplete" : "Mark complete"}</button>
                      <button type="button" onClick={() => removeDrill(drill.id)} aria-label={`Delete ${drill.name}`}>Delete</button>
                    </div>
                  </div>
                  <p>{drill.notes}</p>
                  <small>{drill.duration || "Duration not specified"} min ? {drill.level || "Intensity not specified"}</small>
                </article>
              ))}
            </section>
          ))}
        </section>
      </main>
      <button type="button" onClick={() => setMenuOpen(true)} style={{ position: "fixed", right: "20px", bottom: "20px", zIndex: 10, color: accent, background: "#111", border: `1px solid ${accent}`, padding: "10px 14px", borderRadius: "8px", cursor: "pointer" }}>Return to Menu</button>
    </div>
  );
}

const fieldStyle = { display: "block", width: "100%", boxSizing: "border-box", padding: "10px", marginTop: "5px", color: "#fff", background: "#151515", border: "1px solid #555", borderRadius: "6px" };
const buttonStyle = (accent) => ({ padding: "10px 14px", color: "#fff", background: "#151515", border: `1px solid ${accent}`, borderRadius: "6px", cursor: "pointer" });
