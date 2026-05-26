import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../context/MenuContext.jsx";

import {
  UI_MAIN_CATEGORIES,
  UI_SUBCATEGORY_MAP,
  STRENGTH_TYPES,
  CATEGORY_MAP
} from "../generators/workoutTaxonomy.js";

import { generateWorkout } from "../generators/workoutGenerator.js";

export default function Workouts() {
  const { openMenu } = useContext(MenuContext);
  const navigate = useNavigate();

  const BLACK = "rgb(0,0,0)";
  const SILVER = "rgb(220,220,220)";
  const WHITE = "rgb(255,255,255)";
  const DISABLED_GRAY = "rgb(90,90,90)";

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

  const token = localStorage.getItem("token");

  // ⭐ Token verification
 useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) navigate("/login");
}, []);


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (!currentBlock) return;

    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setBlockElapsed(prev => ({
          ...prev,
          [currentBlock]: prev[currentBlock] + 1
        }));
      }, 1000);
    }

    return () => {
      if (!currentBlock && timerRef.current) {
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

  function handleStartBlock(key) {
    setCurrentBlock(key);
    setBlockElapsed(prev => ({ ...prev, [key]: 0 }));

    if (key === "cooldown") {
      setCooldownStarted(true);
      setSaveEnabled(true);
    }
  }

  function handleSave() {
    if (!saveEnabled || !cooldownStarted) return;

    console.log("Workout saved:", {
      workoutType,
      duration,
      weightUnit,
      weightValue,
      plan,
      blockElapsed
    });

    setSaveEnabled(false);
    setCurrentBlock(null);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  // Styles
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
        {/* Workout Type */}
        <div>
          <div style={label}>Workout Type</div>
          <select
            value={workoutType}
            onChange={e => handleWorkoutTypeSelect(e.target.value)}
            style={{ ...field, width: "100%" }}
          >
            <option value="">Select Workout Type</option>
            {UI_MAIN_CATEGORIES.map(main => (
              <optgroup key={main} label={main}>
                {UI_SUBCATEGORY_MAP[main].map(sub => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <div style={label}>Duration</div>
          <select
            value={duration}
            onChange={e => setDuration(e.target.value)}
            style={{ ...field, width: "100%" }}
          >
            <option value="20 min">20 min</option>
            <option value="30 min">30 min</option>
            <option value="45 min">45 min</option>
            <option value="60 min">60 min</option>
          </select>
        </div>

        {/* Weight Section */}
        {weightSectionEnabled && (
          <div>
            <div style={label}>Weight Unit</div>
            <select
              value={weightUnit}
              onChange={e => setWeightUnit(e.target.value)}
              style={{ ...field, width: "100%" }}
            >
              <option value="lbs">lbs</option>
              <option value="kg">kg</option>
            </select>

            <div style={{ ...label, marginTop: "8px" }}>Weight</div>
            <input
              style={{ ...field, width: "100%" }}
              placeholder="Enter weight"
              value={weightValue}
              onChange={e => setWeightValue(e.target.value)}
            />
          </div>
        )}

        {/* Generate */}
        <div style={clickable} onClick={handleGenerate}>
          Generate Workout
        </div>

        {/* Scroll Area */}
        <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
          <div style={{ paddingRight: "16px", paddingBottom: "12px" }}>
            {workoutType && (
              <div
                style={{ color: WHITE, fontSize: "16px", marginBottom: "6px" }}
              >
                {`${CATEGORY_MAP[workoutType] || workoutType} → ${workoutType} | ${duration}${
                  weightSectionEnabled && weightValue
                    ? ` | ${weightValue}${weightUnit}`
                    : ""
                }`}
              </div>
            )}

            {/* Warm-up */}
            {plan.warmup.length > 0 && (
              <>
                <div style={sectionHeader}>Warm-up</div>
                <div style={timerRow}>
                  <div style={timerLabel}>
                    {formatTimer(blockElapsed.warmup)}
                  </div>
                  <input
                    style={durationInput}
                    value={blockDurations.warmup}
                    onChange={e =>
                      setBlockDurations(prev => ({
                        ...prev,
                        warmup: e.target.value
                      }))
                    }
                  />
                  <div
                    style={{ ...clickable, fontSize: "14px" }}
                    onClick={() => handleStartBlock("warmup")}
                  >
                    Start
                  </div>
                </div>
                {plan.warmup.map((ex, i) => (
                  <div key={i} style={exerciseText}>
                    • {ex}
                  </div>
                ))}
              </>
            )}

            {/* Main */}
            {plan.main.length > 0 && (
              <>
                <div style={sectionHeader}>Main</div>
                <div style={timerRow}>
                  <div style={timerLabel}>
                    {formatTimer(blockElapsed.main)}
                  </div>
                  <input
                    style={durationInput}
                    value={blockDurations.main}
                    onChange={e =>
                      setBlockDurations(prev => ({
                        ...prev,
                        main: e.target.value
                      }))
                    }
                  />
                  <div
                    style={{ ...clickable, fontSize: "14px" }}
                    onClick={() => handleStartBlock("main")}
                  >
                    Start
                  </div>
                </div>
                {plan.main.map((ex, i) => (
                  <div key={i} style={exerciseText}>
                    • {ex}
                  </div>
                ))}
              </>
            )}

            {/* Finisher */}
            {plan.finisher.length > 0 && (
              <>
                <div style={sectionHeader}>Finisher</div>
                <div style={timerRow}>
                  <div style={timerLabel}>
                    {formatTimer(blockElapsed.finisher)}
                  </div>
                  <input
                    style={durationInput}
                    value={blockDurations.finisher}
                    onChange={e =>
                      setBlockDurations(prev => ({
                        ...prev,
                        finisher: e.target.value
                      }))
                    }
                  />
                  <div
                    style={{ ...clickable, fontSize: "14px" }}
                    onClick={() => handleStartBlock("finisher")}
                  >
                    Start
                  </div>
                </div>
                {plan.finisher.map((ex, i) => (
                  <div key={i} style={exerciseText}>
                    • {ex}
                  </div>
                ))}
              </>
            )}

            {/* Cool-down */}
            {plan.cooldown.length > 0 && (
              <>
                <div style={sectionHeader}>Cool-down</div>
                <div style={timerRow}>
                  <div style={timerLabel}>
                    {formatTimer(blockElapsed.cooldown)}
                  </div>
                  <input
                    style={durationInput}
                    value={blockDurations.cooldown}
                    onChange={e =>
                      setBlockDurations(prev => ({
                        ...prev,
                        cooldown: e.target.value
                      }))
                    }
                  />
                  <div
                    style={{ ...clickable, fontSize: "14px" }}
                    onClick={() => handleStartBlock("cooldown")}
                  >
                    Start
                  </div>
                </div>
                {plan.cooldown.map((ex, i) => (
                  <div key={i} style={exerciseText}>
                    • {ex}
                  </div>
                ))}
              </>
            )}

            {/* Equipment */}
            {plan.equipment.length > 0 && (
              <div style={{ color: SILVER, fontSize: "14px", marginTop: "8px" }}>
                Equipment: {plan.equipment.join(", ")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={footer}>
        <div style={saveStyle} onClick={handleSave}>
          Save Workout
        </div>
        <div style={{ flex: 1 }} />
        <div style={returnStyle} onClick={openMenu}>
          Return to Menu
        </div>
      </div>
    </div>
  );
}
