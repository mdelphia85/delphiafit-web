import { useContext, useEffect, useRef, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

import {
  UI_MAIN_CATEGORIES,
  UI_SUBCATEGORY_MAP,
  STRENGTH_TYPES,
  CATEGORY_MAP
} from "../generators/workoutTaxonomy.js";

import { generateWorkout } from "../generators/workoutGenerator.js";

// ⭐ PHASE 4 — AI ENGINE IMPORTS
import { smartAdjust } from "../ai/smartMode";
import { updatePersonalizationEngine } from "../ai/personalizationEngine";
import { updateBehavior } from "../ai/behaviorEngine";

export default function Workouts() {
  const { openMenu } = useContext(MenuContext);

  const BLACK = "rgb(0,0,0)";
  const SILVER = "rgb(220,220,220)";
  const WHITE = "rgb(255,255,255)";
  const DISABLED_GRAY = "rgb(90,90,90)";

  const token = localStorage.getItem("token");

  // MODE
  const [mode, setMode] = useState("generator");

  // MANUAL MODE
  const [manualName, setManualName] = useState("");
  const [manualDuration, setManualDuration] = useState("");
  const [manualNotes, setManualNotes] = useState("");

  // GENERATOR MODE
  const [workoutType, setWorkoutType] = useState("");
  const [duration, setDuration] = useState("30 min");

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

  const timerRef = useRef(null);

  const blockDefaultMinutes = {
    warmup: 3,
    main: 20,
    finisher: 5,
    cooldown: 3
  };

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
      duration_label: duration,
      equipment_available: null
    });

    setPlan({
      warmup: generated.warmup || [],
      main: generated.main || [],
      finisher: generated.finisher || [],
      cooldown: generated.cooldown || [],
      equipment: generated.equipment || []
    });

    setBlockDurations({
      warmup: String(blockDefaultMinutes.warmup),
      main: String(blockDefaultMinutes.main),
      finisher: String(blockDefaultMinutes.finisher),
      cooldown: String(blockDefaultMinutes.cooldown)
    });
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
        [key]: String(plannedMinutes - 2)
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
    if (!manualName || !manualDuration) return;

    const payload = {
      mode: "manual",
      sport: manualName,
      duration: manualDuration,
      notes: manualNotes,
      timestamp: new Date().toISOString(),
      completed: true,
      intensityScore: 0.5,
      durationAccuracy: 0.9,
      blockCompletion: {
        warmup: 1,
        main: 1,
        finisher: 0,
        cooldown: 1
      }
    };

    try {
      const res = await fetch(
        "https://delphiafit-backend-production.up.railway.app/workouts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        console.error("Failed to save workout");
        return;
      }

      const data = await res.json();
      console.log("Workout saved:", data);

      updatePersonalizationEngine(payload);
      updateBehavior(payload);

    } catch (err) {
      console.error("Error saving workout:", err);
    }

    setManualName("");
    setManualDuration("");
    setManualNotes("");
  }

  // ⭐ GENERATOR MODE SAVE — PHASE 4 COMPLETE
  async function handleSave() {
    if (!saveEnabled || !cooldownStarted) return;

    const payload = {
      mode: "generator",
      sport: workoutType,
      category: CATEGORY_MAP[workoutType] || "",
      level: "N/A",
      drill: plan,
      duration: duration,
      notes: "",
      timestamp: new Date().toISOString(),
      completed: true
    };

    try {
      const res = await fetch(
        "https://delphiafit-backend-production.up.railway.app/workouts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        console.error("Failed to save workout");
        return;
      }

      const data = await res.json();
      console.log("Workout saved:", data);

      // ⭐ AI LEARNING PAYLOAD
      const workoutForAI = {
        ...payload,
        blockCompletion: {
          warmup: blockElapsed.warmup > 0 ? 1 : 0,
          main: blockElapsed.main > 0 ? 1 : 0,
          finisher: blockElapsed.finisher > 0 ? 1 : 0,
          cooldown: blockElapsed.cooldown > 0 ? 1 : 0
        },
        intensityScore: weightValue ? 0.7 : 0.4,
        durationAccuracy: 0.8
      };

      updatePersonalizationEngine(workoutForAI);
      updateBehavior(workoutForAI);

    } catch (err) {
      console.error("Error saving workout:", err);
    }

    setSaveEnabled(false);
    setCurrentBlock(null);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  // ⭐ FULL UI BELOW — COMPLETE
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

  const footer = {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "40px",
    background: BLACK,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    boxSizing: "border-box"
  };

  const saveStyle = {
    color: saveEnabled ? SILVER : DISABLED_GRAY,
    fontSize: "18px",
    cursor: saveEnabled ? "pointer" : "default"
  };

  const returnStyle = {
    color: SILVER,
    fontSize: "18px",
    textDecoration: "underline",
    cursor: "pointer"
  };

  return (
    <div style={container}>
      <div style={inner}>
        <div style={clickable} onClick={openMenu}>
          Menu
        </div>

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

      {/* FOOTER */}
      <div style={footer}>
        <div style={returnStyle} onClick={openMenu}>
          Return
        </div>
        <div
          style={saveStyle}
          onClick={saveEnabled ? handleSave : undefined}
        >
          Save
        </div>
      </div>
    </div>
  );
}
