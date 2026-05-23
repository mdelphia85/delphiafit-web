import React, { useEffect, useState, useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function Progress() {
  const { setMenuOpen, refreshProgress, setRefreshProgress } = useContext(MenuContext);

  const PROGRESS_COLOR = "yellow";

  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState([]);

  const [metrics, setMetrics] = useState({
    protein: { today: 0, short: 0, long: 0 },
    water: { today: 0, short: 0, long: 0 },
    calories: { today: 0, short: 0, long: 0 },
    meals: { today: 0, short: 0, long: 0 },
    workouts: { today: 0, short: 0, long: 0 },
    supplements: { today: 0, short: 0, long: 0 },
    consistency: { days: 0, consistency: 0 }
  });

  // ---------------------------------------------------------
  // LOAD DATA ON MOUNT + WHEN DAILY LOG SAVES
  // ---------------------------------------------------------
  useEffect(() => {
    loadHistory();
    loadSummary(7);

    if (refreshProgress) {
      loadHistory();
      loadSummary(7);
      setRefreshProgress(false);
    }
  }, [refreshProgress]);

  async function loadHistory() {
    try {
      const email = localStorage.getItem("userEmail");
      const res = await fetch(
        https://delphiafit-backend-production.up.railway.app/api/progress/history?email=${email}
      );
      const data = await res.json();

      if (data.success) {
        setHistory(data.history);
        computeAllMetrics(data.history);
      }
    } catch (e) {
      console.log("Error loading history:", e);
    }
  }

  async function loadSummary(days) {
    try {
      const email = localStorage.getItem("userEmail");
      const res = await fetch(
        `http://127.0.0.1:8000/api/progress/summary?email=${email}&days=${days}`
      );
      const data = await res.json();

      if (data.success) {
        setSummary(data.entries);
      }
    } catch (e) {
      console.log("Error loading summary:", e);
    }
  }

  // ---------------------------------------------------------
  // METRIC CALCULATIONS
  // ---------------------------------------------------------
  function computeAllMetrics(data) {
    const subsystems = [
      "protein",
      "water",
      "calories",
      "meals",
      "workouts",
      "supplements"
    ];

    const results = {};

    subsystems.forEach((key) => {
      results[key] = computeTrend(data, key);
    });

    results["consistency"] = computeConsistency(data);

    setMetrics(results);
  }

  function computeTrend(data, key) {
    if (!data || data.length === 0) {
      return { today: 0, short: 0, long: 0 };
    }

    const sorted = [...data].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const todayEntry = sorted[sorted.length - 1];
    const yesterdayEntry =
      sorted.length > 1 ? sorted[sorted.length - 2] : null;

    const today = Number(todayEntry?.[key] || 0);
    const yesterday = Number(yesterdayEntry?.[key] || 0);

    let total = 0;
    sorted.forEach((d) => {
      total += Number(d[key] || 0);
    });

    const lifetimeAvg = total / sorted.length;

    let shortTerm = 0;
    let longTerm = 0;

    if (yesterday > 0) {
      shortTerm = ((today - yesterday) / yesterday) * 100;
    }

    if (lifetimeAvg > 0) {
      longTerm = ((today - lifetimeAvg) / lifetimeAvg) * 100;
    }

    return {
      today,
      short: Number(shortTerm.toFixed(1)),
      long: Number(longTerm.toFixed(1))
    };
  }

  function computeConsistency(data) {
    if (!data || data.length === 0) {
      return { days: 0, consistency: 0 };
    }

    const daysTrained = data.filter((d) => Number(d.workouts) > 0).length;
    const consistency = (daysTrained / data.length) * 100;

    return {
      days: daysTrained,
      consistency: Number(consistency.toFixed(1))
    };
  }

  function getTrendArrow(value) {
    if (value > 0) return { arrow: "▲", color: "lime" };
    if (value < 0) return { arrow: "▼", color: "red" };
    return { arrow: "■", color: "yellow" };
  }

  function Row({ label, today, short, long }) {
    const shortTrend = getTrendArrow(short);
    const longTrend = getTrendArrow(long);

    return (
      <div style={{ marginBottom: "25px" }}>
        <p style={{ color: PROGRESS_COLOR, fontSize: "26px", margin: 0 }}>
          {label}
        </p>

        <p style={{ color: "white", margin: 0 }}>Today: {today}</p>

        <p style={{ color: shortTrend.color, margin: 0 }}>
          Short-Term: {shortTrend.arrow} {short}%
        </p>

        <p style={{ color: longTrend.color, margin: 0 }}>
          Long-Term: {longTrend.arrow} {long}%
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        padding: "20px",
        overflowY: "auto",
        boxSizing: "border-box",
        position: "relative"
      }}
    >
      <Row label="Protein" {...metrics.protein} />
      <Row label="Water" {...metrics.water} />
      <Row label="Calories" {...metrics.calories} />
      <Row label="Meals" {...metrics.meals} />
      <Row label="Workouts" {...metrics.workouts} />
      <Row label="Supplements" {...metrics.supplements} />

      <div style={{ marginTop: "40px" }}>
        <p style={{ color: PROGRESS_COLOR, fontSize: "26px", margin: 0 }}>
          Training Consistency
        </p>
        <p style={{ color: "white", margin: 0 }}>
          Days Trained: {metrics.consistency.days}
        </p>
        <p style={{ color: "white", margin: 0 }}>
          Consistency: {metrics.consistency.consistency}%
        </p>
      </div>

      <div style={{ marginTop: "40px" }}>
        <p style={{ color: PROGRESS_COLOR, fontSize: "26px", margin: 0 }}>
          Weekly Summary
        </p>
        <p style={{ color: "white", margin: 0 }}>
          Entries: {summary.length}
        </p>
      </div>

      <p
        onClick={() => setMenuOpen(true)}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          color: PROGRESS_COLOR,
          fontSize: "22px",
          textDecoration: "underline",
          cursor: "pointer"
        }}
      >
        Return to Menu
      </p>
    </div>
  );
}
