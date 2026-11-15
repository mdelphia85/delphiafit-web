import { useContext, useEffect, useRef, useState } from "react";
import { MenuContext } from "../context/MenuContext.js";
import { apiRequest } from "../utils/api.js";

import {
  UI_MAIN_CATEGORIES,
  UI_SUBCATEGORY_MAP,
  STRENGTH_TYPES,
  CATEGORY_MAP,
  EQUIPMENT_GROUPS
} from "../generators/workoutTaxonomy.js";

import { generateWorkout } from "../generators/workoutGenerator.js";

// ⭐ PHASE 4 — AI ENGINE IMPORTS
import { smartAdjust } from "../ai/smartMode";
import { updatePersonalizationEngine } from "../ai/personalizationEngine";
import { updateBehavior } from "../ai/behaviorEngine";
import AdaptiveCoachCard from "../components/AdaptiveCoachCard.jsx";
import { getAdaptiveDifficulty } from "../ai/adaptiveDifficulty";
import { syncAdaptiveProfile } from "../ai/adaptiveSync";

const DIFFICULTY_SCALE = { easy: 0.8, medium: 1, hard: 1.2 };

const HOME_EQUIPMENT = [
  "Chair", "Yoga Mat", "Dumbbells", "Resistance Bands",
  "Loop Bands", "Jump Rope", "Bench", "Foam Roller"
];

export default function Workouts() {
  const { openMenu } = useContext(MenuContext);

  const BLACK = "rgb(0,0,0)";
  const SILVER = "rgb(220,220,220)";
  const WHITE = "rgb(255,255,255)";
  const DISABLED_GRAY = "rgb(90,90,90)";


  // MODE
  const [mode, setMode] = useState("generator");

  // MANUAL MODE
  const [manualName, setManualName] = useState("");
  const [manualDuration, setManualDuration] = useState("");
  const [manualNotes, setManualNotes] = useState("");

  // GENERATOR MODE
  const [workoutType, setWorkoutType] = useState("");
  const [duration, setDuration] = useState("30 min");
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  // Keep the original dropdown selector. null = full gym, [] = bodyweight only.
  const [equipmentChoice, setEquipmentChoice] = useState("all");
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [difficulty, setDifficulty] = useState(() => getAdaptiveDifficulty());

  useEffect(() => {
    syncAdaptiveProfile().then(() => setDifficulty(getAdaptiveDifficulty()));
  }, []);

  const [weightUnit, setWeightUnit] = useState("lbs");
  const [weightValue, setWeightValue] = useState("");
  const [weightSectionEnabled, setWeightSectionEnabled] = useState(false);

  const [plan, setPlan] = useState({
    warmup: [],
    main: [],
    finisher: [],
    cooldown: [],
    equipment: []
  });

  const [blockElapsed, setBlockElapsed] = useState({
    warmup: 0,
    main: 0,
    finisher: 0,
    cooldown: 0
  });

  const [currentBlock, setCurrentBlock] = useState(null);
  const [cooldownStarted, setCooldownStarted] = useState(false);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const timerRef = useRef(null);

  const [blockDurations, setBlockDurations] = useState({
    warmup: "3",
    main: "20",
    finisher: "5",
    cooldown: "3"
  });

  // CLEANUP TIMER
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // TIMER UPDATE
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!currentBlock) return;

    timerRef.current = setInterval(() => {
      setBlockElapsed(prev => ({
        ...prev,
        [currentBlock]: prev[currentBlock] + 1
      }));
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentBlock]);

  function formatTimer(sec) {
    const mm = String(Math.floor(sec / 60)).padStart(2, "0");
    const ss = String(sec % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  function resetTimers() {
    setBlockElapsed({
      warmup: 0,
      main: 0,
      finisher: 0,
      cooldown: 0
    });
    setCurrentBlock(null);
    setCooldownStarted(false);
    setSaveEnabled(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function handleWorkoutTypeSelect(sub) {
    setWorkoutType(sub);
    if (STRENGTH_TYPES.includes(sub)) {
      setWeightSectionEnabled(true);
    } else {
      setWeightSectionEnabled(false);
      setWeightValue("");
    }
  }

  function toggleEquipment(item) {
    setEquipmentChoice("custom");
    setSelectedEquipment((current) => {
      // Picking an individual item from "All Equipment" starts a custom list.
      const next = new Set(current === null ? [] : current);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return [...next];
    });
  }

  function handleEquipmentSelect(value) {
    if (value.startsWith("item:")) {
      toggleEquipment(value.slice(5));
      return;
    }

    const presets = {
      all: null,
      bodyweight: [],
      home: [...HOME_EQUIPMENT],
      barbell: ["Barbell", "Rack", "Bench", "Plates", "PVC Pipe"],
      dumbbells: ["Dumbbells", "Bench", "Yoga Mat"]
    };

    if (Object.prototype.hasOwnProperty.call(presets, value)) {
      setEquipmentChoice(value);
      setSelectedEquipment(presets[value]);
    }
  }

  function handleGenerate() {
    resetTimers();

    if (!workoutType) {
      setPlan({
        warmup: ["Please select a workout type."],
        main: [],
        finisher: [],
        cooldown: [],
        equipment: []
      });
      return;
    }

    const mainCategory = CATEGORY_MAP[workoutType] || workoutType;

    const generated = generateWorkout({
      category_label: mainCategory,
      type_label: workoutType,
      duration_label: duration,
      experience_level: experienceLevel,
      equipment_available: selectedEquipment
    });

    setPlan({
      warmup: generated.warmup || [],
      main: generated.main || [],
      finisher: generated.finisher || [],
      cooldown: generated.cooldown || [],
      equipment: generated.equipment || []
    });

    // Allocate the selected time across workout blocks instead of using
    // the same 31-minute timer preset for every workout duration.
    const totalMinutes = Math.max(15, Number.parseInt(duration, 10) || 30);
    const warmup = Math.max(2, Math.round(totalMinutes * 0.12));
    const cooldown = Math.max(2, Math.round(totalMinutes * 0.10));
    const finisher = Math.max(1, Math.round(totalMinutes * 0.12 * (DIFFICULTY_SCALE[difficulty] || 1)));
    const main = Math.max(1, totalMinutes - warmup - cooldown - finisher);
    setBlockDurations({ warmup: String(warmup), main: String(main), finisher: String(finisher), cooldown: String(cooldown) });
  }

  // ⭐ SMART MODE INTEGRATION
  function handleStartBlock(key) {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const plannedMinutes = Number(blockDurations[key]);
    const elapsedSeconds = blockElapsed[key];

    const decision = smartAdjust(key, elapsedSeconds, plannedMinutes);

    if (decision === "shorten") {
      setBlockDurations(prev => ({
        ...prev,
        [key]: String(Math.max(plannedMinutes - 2, 1))
      }));
    } else if (decision === "extend") {
      setBlockDurations(prev => ({
        ...prev,
        [key]: String(plannedMinutes + 2)
      }));
    }

    setCurrentBlock(key);
    setBlockElapsed(prev => ({ ...prev, [key]: 0 }));

    if (key === "cooldown") {
      setCooldownStarted(true);
      setSaveEnabled(true);
    }
  }

  // ⭐ MANUAL MODE SAVE
  async function handleManualSave() {
    if (!manualName.trim() || Number(manualDuration) <= 0) {
      setSaveMessage("Enter a workout name and duration greater than zero.");
      return;
    }
    setSaveMessage("Saving workout?");
    const payload = { mode: "manual", manual_name: manualName.trim(), duration_minutes: Math.round(Number(manualDuration)), manual_notes: manualNotes, timestamp: new Date().toISOString() };
    try {
      await apiRequest("/workouts/save", { method: "POST", body: payload });
      updatePersonalizationEngine(payload); updateBehavior(payload);
      setManualName(""); setManualDuration(""); setManualNotes(""); setSaveMessage("Workout saved.");
    } catch (err) { setSaveMessage(err.message || "Unable to save workout."); }
  }

  async function handleSave() {
    if (!saveEnabled || !cooldownStarted) return;
    setSaveMessage("Saving workout?");
    const payload = {
      mode: "generator", workout_type: workoutType, duration_minutes: Math.max(1, Number.parseInt(duration, 10) || 30),
      weight_unit: weightValue ? weightUnit : null, weight_value: weightValue ? Number(weightValue) : null,
      plan_json: plan, block_durations_json: blockElapsed, equipment_json: plan.equipment || [], timestamp: new Date().toISOString()
    };
    try {
      await apiRequest("/workouts/save", { method: "POST", body: payload });
      const workoutForAI = { ...payload, blockCompletion: Object.fromEntries(Object.entries(blockElapsed).map(([key, seconds]) => [key, seconds > 0 ? 1 : 0])), intensityScore: weightValue ? 0.7 : 0.4, durationAccuracy: 0.8 };
      updatePersonalizationEngine(workoutForAI); updateBehavior(workoutForAI);
      setSaveMessage("Workout saved."); setSaveEnabled(false); setCurrentBlock(null);
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    } catch (err) { setSaveMessage(err.message || "Unable to save workout."); }
  }

  const container = {
    width: "100vw",
    height: "100vh",
    background: BLACK,
    padding: "16px",
    boxSizing: "border-box",
    overflowY: "auto",
    display: "flex",
    justifyContent: "center"
  };

  const inner = {
    width: "360px",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  };

  const label = {
    color: SILVER,
    fontSize: "16px",
    marginBottom: "4px"
  };

  const field = {
    background: BLACK,
    color: SILVER,
    border: "none",
    borderBottom: `1px solid ${SILVER}`,
    padding: "8px 4px",
    fontSize: "16px",
    outline: "none"
  };

  const clickable = {
    color: SILVER,
    fontSize: "18px",
    textDecoration: "underline",
    textAlign: "center",
    cursor: "pointer"
  };

  const sectionHeader = {
    color: SILVER,
    fontSize: "18px",
    marginTop: "8px",
    marginBottom: "4px"
  };

  const timerRow = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "8px",
    marginBottom: "4px"
  };

  const timerLabel = {
    color: WHITE,
    fontSize: "16px",
    width: "60px"
  };

  const durationInput = {
    ...field,
    width: "60px",
    textAlign: "center"
  };

  const exerciseText = {
    color: WHITE,
    fontSize: "16px",
    marginBottom: "2px"
  };

  // ⭐ FIXED FOOTER — MATCHES YOUR OTHER PAGE EXACTLY
  const saveStyle = {
    color: saveEnabled ? SILVER : DISABLED_GRAY,
    fontSize: "18px",
    textDecoration: "underline",
    cursor: saveEnabled ? "pointer" : "default",
    position: "fixed",
    left: "20px",
    bottom: "20px",
    zIndex: 20,
    whiteSpace: "nowrap"
  };

  const returnStyle = {
    color: SILVER,
    fontSize: "18px",
    textDecoration: "underline",
    cursor: "pointer",
    position: "fixed",
    right: "20px",
    bottom: "20px",
    zIndex: 20,
    whiteSpace: "nowrap"
  };

  return (
    <div style={container}>
      <div style={inner}>
        <div style={clickable} onClick={openMenu}>
          Menu
        </div>
        <AdaptiveCoachCard />

        {/* MODE SELECTOR */}
        <div style={sectionHeader}>Mode</div>
        <select
          value={mode}
          onChange={e => setMode(e.target.value)}
          style={field}
        >
          <option value="generator">Generator</option>
          <option value="manual">Manual</option>
        </select>

        {/* MANUAL MODE */}
        {mode === "manual" && (
          <>
            <div style={label}>Workout Name</div>
            <input
              style={field}
              value={manualName}
              onChange={e => setManualName(e.target.value)}
            />

            <div style={label}>Duration</div>
            <input
              style={field}
              value={manualDuration}
              onChange={e => setManualDuration(e.target.value)}
            />

            <div style={label}>Notes</div>
            <textarea
              style={field}
              value={manualNotes}
              onChange={e => setManualNotes(e.target.value)}
            />

            <div style={clickable} onClick={handleManualSave}>
              Save Manual Workout
            </div>
          </>
        )}

        {/* GENERATOR MODE */}
        {mode === "generator" && (
          <>
            <div style={sectionHeader}>Workout Type</div>
            <select
              value={workoutType}
              onChange={e => handleWorkoutTypeSelect(e.target.value)}
              style={field}
            >
              <option value="">Select</option>
              {UI_MAIN_CATEGORIES.map(cat => (
                <optgroup key={cat} label={cat}>
                  {UI_SUBCATEGORY_MAP[cat].map(sub => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <div style={sectionHeader}>Experience Level</div>
            <select
              value={experienceLevel}
              onChange={e => setExperienceLevel(e.target.value)}
              style={field}
              aria-label="Experience Level"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert / Competitive Athlete</option>
            </select>

            <div style={sectionHeader}>Available Equipment</div>
            <select
              value={equipmentChoice}
              onChange={e => handleEquipmentSelect(e.target.value)}
              style={field}
              aria-label="Available Equipment"
            >
              <option value="all">All Equipment / Gym</option>
              <option value="bodyweight">Bodyweight / No Equipment</option>
              <option value="home">Home / Basic Equipment</option>
              <option value="barbell">Barbell / Rack</option>
              <option value="dumbbells">Dumbbells / Bench</option>
              <option value="custom">Custom Equipment Selection</option>
              {Object.entries(EQUIPMENT_GROUPS).map(([group, items]) => (
                <optgroup key={group} label={group}>
                  {items.filter(item => item !== "Bodyweight").map(item => (
                    <option key={item} value={`item:${item}`}>
                      {item}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div style={{ ...label, fontSize: "14px" }} role="status">
              {selectedEquipment === null
                ? "All equipment available"
                : selectedEquipment.length === 0
                  ? "Bodyweight only"
                  : `${selectedEquipment.length} equipment items selected`}
            </div>
            {selectedEquipment !== null && selectedEquipment.length > 0 && (
              <div style={{ ...label, fontSize: "14px" }}>
                <div style={{ marginBottom: "6px" }}>Selected equipment (tap to remove):</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 12px" }}>
                  {selectedEquipment.map(item => (
                    <span
                      key={item}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleEquipment(item)}
                      onKeyDown={e => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleEquipment(item);
                        }
                      }}
                      style={{ color: SILVER, textDecoration: "underline", cursor: "pointer" }}
                      aria-label={`Remove ${item}`}
                    >
                      {item} ×
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={sectionHeader}>Duration</div>
            <select
              value={duration}
              onChange={e => setDuration(e.target.value)}
              style={field}
            >
              <option value="15 min">15 min</option>
              <option value="20 min">20 min</option>
              <option value="30 min">30 min</option>
              <option value="45 min">45 min</option>
              <option value="60 min">60 min</option>
              <option value="75 min">75 min</option>
              <option value="90 min">90 min</option>
              <option value="105 min">105 min (1 hr 45 min)</option>
              <option value="120 min">120 min (2 hours)</option>
            </select>

            <div style={sectionHeader}>Difficulty (adaptive)</div>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              style={field}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* WEIGHT SECTION */}
            {weightSectionEnabled && (
              <>
                <div style={sectionHeader}>Weight</div>
                <input
                  style={field}
                  value={weightValue}
                  onChange={e => setWeightValue(e.target.value)}
                  placeholder="Enter weight"
                />
                <select
                  value={weightUnit}
                  onChange={e => setWeightUnit(e.target.value)}
                  style={field}
                >
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                </select>
              </>
            )}

            <div style={clickable} onClick={handleGenerate}>
              Generate Workout
            </div>

            {/* WORKOUT PLAN */}
            <div style={sectionHeader}>Warmup</div>
            {plan.warmup.map((ex, i) => (
              <div key={i} style={exerciseText}>
                {ex}
              </div>
            ))}

            <div style={sectionHeader}>Main</div>
            {plan.main.map((ex, i) => (
              <div key={i} style={exerciseText}>
                {ex}
              </div>
            ))}

            <div style={sectionHeader}>Finisher</div>
            {plan.finisher.map((ex, i) => (
              <div key={i} style={exerciseText}>
                {ex}
              </div>
            ))}

            <div style={sectionHeader}>Cooldown</div>
            {plan.cooldown.map((ex, i) => (
              <div key={i} style={exerciseText}>
                {ex}
              </div>
            ))}

            {/* TIMERS */}
            <div style={sectionHeader}>Timers</div>

            {["warmup", "main", "finisher", "cooldown"].map(key => (
              <div key={key} style={timerRow}>
                <div style={timerLabel}>{key.toUpperCase()}</div>
                <input
                  style={durationInput}
                  value={blockDurations[key]}
                  onChange={e =>
                    setBlockDurations(prev => ({
                      ...prev,
                      [key]: e.target.value
                    }))
                  }
                />
                <div style={timerLabel}>{formatTimer(blockElapsed[key])}</div>
                <div
                  style={clickable}
                  onClick={() => handleStartBlock(key)}
                >
                  Start
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      
      {saveMessage && <p role="status" style={{ position: "fixed", bottom: 56, left: 20, color: SILVER }}>{saveMessage}</p>}
      <div onClick={handleSave} style={saveStyle}>
        Save Workout
      </div>

      <div onClick={openMenu} style={returnStyle}>
        Return to Menu
      </div>
    </div>
  );
}
