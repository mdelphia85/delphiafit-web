import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MenuContext } from "../context/MenuContext.js";
import TextAction from "../components/TextAction.jsx";
import { apiRequest, hasSession } from "../utils/api.js";
import {
  ENDURANCE_GOALS, ENDURANCE_MODES,
  assessFix, calculateSplits, cleanFix, distanceInUnit,
  formatDuration, formatPace, reduceRoute, routeToSvg,
  secondsPerUnit, toMeters
} from "../utils/runningMetrics.js";

const ACCENT = "#89efd1";
const field = {
  width: "100%", display: "block", boxSizing: "border-box", padding: 11,
  marginTop: 6, border: "1px solid #555", borderRadius: 7,
  background: "#141414", color: "#fff"
};
const panel = {
  background: "#101010", border: "1px solid #374c48",
  borderRadius: 12, padding: 16, marginBottom: 20
};
const action = { color: ACCENT, fontSize: 16, display: "inline-block", margin: "6px 14px 6px 0" };

function readRun(item) {
  return item?.plan_json?.running_endurance || null;
}

function safeRunRows(rows) {
  return Array.isArray(rows)
    ? rows.filter((item) => item.workout_type === "running_endurance" && readRun(item)).slice(0, 100)
    : [];
}

function RouteTrace({ points = [] }) {
  const safe = reduceRoute(points, 250);
  const drawn = routeToSvg(safe);
  if (!drawn.length) {
    return <p style={{ color: "#aaa", textAlign: "center" }}>Waiting for accurate GPS positions to draw a route.</p>;
  }
  const segments = [];
  drawn.forEach((point) => {
    if (!segments.length || segments[segments.length - 1].segment !== point.segment) {
      segments.push({ segment: point.segment, points: [] });
    }
    segments[segments.length - 1].points.push(point);
  });
  return (
    <div>
      <svg role="img" aria-label="GPS route trace, without street map or public sharing" viewBox="0 0 360 210"
        style={{ display: "block", width: "100%", height: "auto", background: "#141d1b", borderRadius: 8, border: "1px solid #38534b" }}>
        <text x="18" y="24" fill="#aaa" fontSize="11">N ↑</text>
        {segments.map((segment, i) =>
          segment.points.length > 1
            ? <polyline key={i} fill="none" stroke={ACCENT} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"
                points={segment.points.map((p) => p.x + "," + p.y).join(" ")} />
            : <circle key={i} cx={segment.points[0].x} cy={segment.points[0].y} r="2.5" fill={ACCENT} />
        )}
        <circle cx={drawn[0].x} cy={drawn[0].y} r="5" fill="#f2c879" />
        <circle cx={drawn[drawn.length - 1].x} cy={drawn[drawn.length - 1].y} r="5" fill="#fff" />
      </svg>
      <p style={{ fontSize: 12, color: "#aaa", textAlign: "center" }}>
        GPS route trace, not a street map. Yellow = start; white = latest point.
      </p>
    </div>
  );
}

export default function RunningEndurance() {
  const { setMenuOpen } = useContext(MenuContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedGoal = searchParams.get("goal");
  const [mode, setMode] = useState("running");
  const [goal, setGoal] = useState(() => ENDURANCE_GOALS.some((item) => item.value === requestedGoal) ? requestedGoal : "general");
  const [unit, setUnit] = useState("mi");
  const [phase, setPhase] = useState("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [points, setPoints] = useState([]);
  const [accuracy, setAccuracy] = useState(null);
  const [gpsMessage, setGpsMessage] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [manualDistance, setManualDistance] = useState("");
  const [manualMinutes, setManualMinutes] = useState("");
  const [manualNotes, setManualNotes] = useState("");
  const [notes, setNotes] = useState("");
  const phaseRef = useRef("idle");
  const runRef = useRef({
    watchId: null, activeAt: 0, elapsedPrior: 0, distance: 0,
    points: [], segment: 0, breakNext: false, startedAt: null,
    mode: "running", goal: "general"
  });

  useEffect(() => {
    if (!hasSession()) {
      navigate("/login", { replace: true });
      return;
    }
    let active = true;
    apiRequest("/workouts/")
      .then((rows) => { if (active) setHistory(safeRunRows(rows)); })
      .catch((requestError) => { if (active) setError(requestError.message || "Unable to load running history."); })
      .finally(() => { if (active) setHistoryLoading(false); });
    return () => { active = false; };
  }, [navigate]);

  // Always stop watching when the page unmounts. Browser recording is foreground
  // only and does not promise continuity if the OS suspends this tab.
  useEffect(() => () => {
    const id = runRef.current.watchId;
    if (id !== null && navigator.geolocation) navigator.geolocation.clearWatch(id);
    runRef.current.watchId = null;
  }, []);

  useEffect(() => {
    if (phase !== "tracking") return undefined;
    const timer = setInterval(() => {
      const r = runRef.current;
      setElapsedSeconds(Math.floor((r.elapsedPrior + Date.now() - r.activeAt) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (!["tracking", "paused", "review"].includes(phase)) return undefined;
    const guard = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [phase]);

  function elapsedNow() {
    const r = runRef.current;
    return Math.max(0, Math.floor((r.elapsedPrior +
      (phaseRef.current === "tracking" ? Date.now() - r.activeAt : 0)) / 1000));
  }

  function clearWatch() {
    const r = runRef.current;
    if (r.watchId !== null) {
      navigator.geolocation.clearWatch(r.watchId);
      r.watchId = null;
    }
  }

  function receivePosition(position) {
    if (phaseRef.current !== "tracking") return;
    const r = runRef.current;
    const next = cleanFix(position);
    if (!next) {
      setGpsMessage("Waiting for a GPS fix within 70 m accuracy.");
      return;
    }
    const previous = r.points[r.points.length - 1];
    const assessment = assessFix(previous, next, r.mode, r.breakNext);
    setAccuracy(next.accuracy);
    if (!assessment.accepted) {
      if (assessment.reason === "speed") setGpsMessage("GPS jump filtered; verifying location.");
      return;
    }
    if (assessment.reason === "gap" || r.breakNext) r.segment += 1;
    r.breakNext = false;
    r.distance += assessment.meters;
    const sample = {
      lat: next.lat, lon: next.lon, time: next.time,
      segment: r.segment, elapsedSeconds: elapsedNow()
    };
    r.points.push(sample);
    if (r.points.length > 3000) r.points = reduceRoute(r.points, 1500);
    setDistanceMeters(r.distance);
    setPoints(reduceRoute(r.points, 300));
    setGpsMessage("GPS connected · " + next.accuracy + " m estimated accuracy");
  }

  function pauseRecording(message = "") {
    const r = runRef.current;
    if (phaseRef.current !== "tracking") return;
    const current = elapsedNow();
    r.elapsedPrior += Date.now() - r.activeAt;
    phaseRef.current = "paused";
    setPhase("paused");
    setElapsedSeconds(current);
    clearWatch();
    if (message) setGpsMessage(message);
  }

  function watchLocation() {
    if (!navigator.geolocation || !window.isSecureContext) {
      setError("GPS requires a supported browser and HTTPS. Use manual logging if unavailable.");
      pauseRecording("GPS unavailable.");
      return;
    }
    try {
      runRef.current.watchId = navigator.geolocation.watchPosition(
        receivePosition,
        (gpsError) => {
          if (gpsError.code === 1) {
            pauseRecording("Location permission denied or revoked. Tracking paused.");
            setError("Allow location for this site to record a GPS route, or log an indoor activity manually.");
          } else {
            setGpsMessage("GPS signal unavailable. The run timer continues; distance only updates with valid fixes.");
          }
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 20000 }
      );
    } catch {
      pauseRecording("Unable to activate GPS.");
      setError("GPS could not be started. Check location permissions and HTTPS.");
    }
  }

  function startRecording() {
    if (busy || phaseRef.current !== "idle") return;
    setError(""); setNotice(""); setGpsMessage("Requesting location permission…");
    runRef.current = {
      watchId: null, activeAt: Date.now(), elapsedPrior: 0, distance: 0,
      points: [], segment: 0, breakNext: false, startedAt: new Date().toISOString(),
      mode, goal
    };
    phaseRef.current = "tracking";
    setPhase("tracking"); setElapsedSeconds(0); setDistanceMeters(0);
    setPoints([]); setAccuracy(null);
    watchLocation();
  }

  function resumeRecording() {
    if (phaseRef.current !== "paused") return;
    const r = runRef.current;
    r.activeAt = Date.now();
    r.breakNext = true;
    phaseRef.current = "tracking";
    setPhase("tracking"); setError("");
    watchLocation();
  }

  function finishRecording() {
    if (!["tracking", "paused"].includes(phaseRef.current)) return;
    const seconds = elapsedNow();
    const r = runRef.current;
    if (phaseRef.current === "tracking") r.elapsedPrior += Date.now() - r.activeAt;
    phaseRef.current = "review";
    setPhase("review");
    setElapsedSeconds(seconds);
    clearWatch();
    setGpsMessage("");
  }

  function discardRecording() {
    if (busy) return;
    clearWatch();
    runRef.current = {
      watchId: null, activeAt: 0, elapsedPrior: 0, distance: 0,
      points: [], segment: 0, breakNext: false, startedAt: null, mode, goal
    };
    phaseRef.current = "idle";
    setPhase("idle"); setElapsedSeconds(0); setDistanceMeters(0);
    setPoints([]); setNotes(""); setError(""); setGpsMessage("");
  }

  async function saveActivity(source, newMode, newGoal, meters, seconds, startedAt, comments, route) {
    if (!(meters > 0) || !(seconds > 0)) {
      setError("Enter a positive distance and duration before saving.");
      return false;
    }
    if (!hasSession()) {
      navigate("/login");
      return false;
    }
    const unitLabel = distanceInUnit(meters, unit).toFixed(2) + " " + unit;
    const modeLabel = ENDURANCE_MODES.find((m) => m.value === newMode)?.label || "Endurance";
    // Never persist raw GPS coordinates until per-run deletion controls exist.
    const storedRoute = [];
    const description = unitLabel + " · pace " +
      formatPace(secondsPerUnit(meters, seconds, unit)) + "/" + unit +
      (comments.trim() ? " · " + comments.trim().slice(0, 400) : "");
    const payload = {
      mode: "manual",
      manual_name: modeLabel + " · Running & Endurance",
      manual_notes: description,
      workout_type: "running_endurance",
      duration_minutes: Math.max(1, Math.ceil(seconds / 60)),
      timestamp: new Date().toISOString(),
      plan_json: {
        running_endurance: {
          version: 1, activity: newMode, goal: newGoal, source,
          distance_m: Math.round(meters), elapsed_s: Math.round(seconds),
          started_at: startedAt, route_saved: storedRoute.length > 0,
          route_points: storedRoute,
          splits_mi: source === "gps" ? calculateSplits(route, "mi") : [],
          splits_km: source === "gps" ? calculateSplits(route, "km") : []
        }
      }
    };
    setBusy(true); setError("");
    try {
      const created = await apiRequest("/workouts/save", { method: "POST", body: payload });
      setHistory((current) => [created, ...current].slice(0, 100));
      setNotice("Activity saved privately to your DelphiaFit account and workout history.");
      return true;
    } catch (saveError) {
      setError(saveError.message || "Unable to save. Keep this page open and retry.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function saveRecorded() {
    if (phaseRef.current !== "review" || busy) return;
    const r = runRef.current;
    const saved = await saveActivity(
      "gps", r.mode, r.goal, r.distance, elapsedSeconds,
      r.startedAt, notes, r.points
    );
    if (saved) discardRecording();
  }

  async function saveManual(event) {
    event.preventDefault();
    if (phaseRef.current !== "idle" || busy) return;
    const meters = toMeters(manualDistance, unit);
    const seconds = Number(manualMinutes) * 60;
    if (meters === null || !Number.isFinite(seconds) || seconds <= 0 || seconds > 86400) {
      setError("Enter a distance and a duration between 1 minute and 24 hours.");
      return;
    }
    const saved = await saveActivity(
      "manual", mode, goal, meters, seconds, new Date().toISOString(),
      manualNotes, []
    );
    if (saved) { setManualDistance(""); setManualMinutes(""); setManualNotes(""); }
  }

  const pace = formatPace(secondsPerUnit(distanceMeters, elapsedSeconds, unit));
  const goalData = ENDURANCE_GOALS.find((item) => item.value === goal) || ENDURANCE_GOALS[0];
  const splits = useMemo(() => calculateSplits(points, unit), [points, unit]);
  const thirtyDaysAgo = Date.now() - 30 * 24 * 3600 * 1000;
  const recent = history.filter((item) => new Date(item.date).getTime() >= thirtyDaysAgo);
  const thirtyDayDistance = recent.reduce((sum, item) => sum + (Number(readRun(item)?.distance_m) || 0), 0);
  const longest = Math.max(0, ...history.map((item) => Number(readRun(item)?.distance_m) || 0));
  const recordedGoal = history
    .filter((item) => readRun(item)?.goal === goal &&
      Number(readRun(item)?.distance_m) >= goalData.distanceMeters * 0.95 &&
      Number(readRun(item)?.distance_m) <= goalData.distanceMeters * 1.05)
    .sort((a, b) => (Number(readRun(a)?.elapsed_s) || Infinity) - (Number(readRun(b)?.elapsed_s) || Infinity))[0];

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "35px 18px 95px", boxSizing: "border-box" }}>
      <main style={{ maxWidth: 850, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ color: ACCENT, margin: 0, lineHeight: 1.2 }}>Running &amp; Endurance</h1>
          <p style={{ color: "#aaa" }}>Track your distance, pace, and training goals in DelphiaFit.</p>
        </header>

        {error && <p role="alert" style={{ color: "#fecaca", padding: 12, background: "#351717", borderRadius: 8 }}>{error}</p>}
        {notice && <p role="status" style={{ color: ACCENT }}>{notice}</p>}

        <section style={panel}>
          <h2 style={{ color: ACCENT, marginTop: 0 }}>Your training setup</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 }}>
            <label>Activity
              <select style={field} value={mode} disabled={phase !== "idle"} onChange={(e) => setMode(e.target.value)}>
                {ENDURANCE_MODES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </label>
            <label>Training goal
              <select style={field} value={goal} disabled={phase !== "idle"} onChange={(e) => setGoal(e.target.value)}>
                {ENDURANCE_GOALS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
            </label>
            <label>Distance units
              <select style={field} value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="mi">Miles</option>
                <option value="km">Kilometers</option>
              </select>
            </label>
          </div>
          {goalData.distanceMeters > 0 && (
            <p style={{ fontSize: 13, color: "#bbb" }}>
              Goal distance: {distanceInUnit(goalData.distanceMeters, unit).toFixed(2)} {unit}.
              Academy requirements vary by organization; this is a practice distance, not an official qualification score.
            </p>
          )}
        </section>

        <section style={panel}>
          <h2 style={{ color: ACCENT, marginTop: 0 }}>GPS activity recorder</h2>
          <p style={{ color: "#bbb", fontSize: 13 }}>
            Browser GPS requires HTTPS and location permission. Keep this page open and your screen awake;
            background tracking is not guaranteed. GPS distance and pace are estimates.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10, textAlign: "center", margin: "18px 0" }}>
            <div><strong style={{ color: ACCENT, fontSize: 23 }}>{distanceInUnit(distanceMeters, unit).toFixed(2)}</strong><div style={{ fontSize: 12, color: "#aaa" }}>{unit}</div></div>
            <div><strong style={{ color: ACCENT, fontSize: 23 }}>{formatDuration(elapsedSeconds)}</strong><div style={{ fontSize: 12, color: "#aaa" }}>Elapsed</div></div>
            <div><strong style={{ color: ACCENT, fontSize: 23 }}>{pace}</strong><div style={{ fontSize: 12, color: "#aaa" }}>Pace / {unit}</div></div>
          </div>
          <div style={{ textAlign: "center" }}>
            {phase === "idle" && <TextAction onClick={startRecording} style={action}>Start GPS activity</TextAction>}
            {phase === "tracking" && <TextAction onClick={() => pauseRecording("Activity paused.")} style={action}>Pause</TextAction>}
            {phase === "paused" && <TextAction onClick={resumeRecording} style={action}>Resume</TextAction>}
            {(phase === "tracking" || phase === "paused") && <TextAction onClick={finishRecording} style={action}>Finish</TextAction>}
            {phase === "review" && <TextAction onClick={discardRecording} disabled={busy} style={action}>Discard activity</TextAction>}
          </div>
          {gpsMessage && <p role="status" style={{ fontSize: 12, color: "#bbb", textAlign: "center" }}>{gpsMessage}</p>}
          {accuracy !== null && <p style={{ fontSize: 12, color: "#aaa", textAlign: "center" }}>Last reported accuracy: ±{accuracy} m</p>}
          <RouteTrace points={points} />
          {phase === "review" && (
            <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
              <h3 style={{ color: ACCENT, margin: 0 }}>Save completed activity</h3>
              <label>Notes (optional)
                <textarea rows={3} style={field} maxLength={400} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </label>
              <p style={{ color: "#aaa", fontSize: 12 }}>
                For privacy, this version saves distance, time, pace and splits only.
                The live GPS trace disappears when you leave or save; precise coordinates are not stored.
              </p>
              <TextAction onClick={saveRecorded} disabled={busy || !(distanceMeters > 0) || !(elapsedSeconds > 0)} style={action}>
                {busy ? "Saving…" : "Save activity"}
              </TextAction>
            </div>
          )}
          {splits.length > 0 && (
            <div>
              <h3 style={{ color: ACCENT }}>GPS splits</h3>
              <p style={{ color: "#aaa", fontSize: 12 }}>Approximate splits based on accepted GPS points.</p>
              {splits.slice(0, 20).map((split) => <p key={split.distance}>{split.distance} {unit} — {formatDuration(split.splitSeconds)}</p>)}
            </div>
          )}
        </section>

        <section style={panel}>
          <h2 style={{ color: ACCENT, marginTop: 0 }}>Log an indoor or previous activity</h2>
          <p style={{ color: "#bbb", fontSize: 13 }}>Treadmill, track, and indoor sessions can be saved without GPS.</p>
          <form onSubmit={saveManual} style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 12 }}>
              <label>Distance ({unit})<input type="number" min="0.01" step="0.01" required value={manualDistance} onChange={(e) => setManualDistance(e.target.value)} style={field} disabled={phase !== "idle"}/></label>
              <label>Duration (minutes)<input type="number" min="0.1" max="1440" step="0.1" required value={manualMinutes} onChange={(e) => setManualMinutes(e.target.value)} style={field} disabled={phase !== "idle"}/></label>
            </div>
            <label>Notes (optional)<textarea rows={2} maxLength={400} value={manualNotes} onChange={(e) => setManualNotes(e.target.value)} style={field} disabled={phase !== "idle"}/></label>
            <div><TextAction submit disabled={busy || phase !== "idle"} style={action}>Save manual activity</TextAction></div>
          </form>
        </section>

        <section style={panel}>
          <h2 style={{ color: ACCENT, marginTop: 0 }}>Progress &amp; records</h2>
          {historyLoading
            ? <p role="status">Loading your running history…</p>
            : <div>
                <p>Last 30 days: <strong style={{ color: ACCENT }}>{distanceInUnit(thirtyDayDistance, unit).toFixed(2)} {unit}</strong> across {recent.length} activities</p>
                <p>Longest recorded activity: <strong style={{ color: ACCENT }}>{distanceInUnit(longest, unit).toFixed(2)} {unit}</strong></p>
                {goalData.distanceMeters > 0 && (
                  <p>{recordedGoal
                    ? "Fastest recorded activity near your selected goal distance: " + formatDuration(readRun(recordedGoal).elapsed_s)
                    : "No recorded activity at your selected goal distance yet."}</p>
                )}
                <h3 style={{ color: ACCENT }}>Recent activities</h3>
                {history.length === 0
                  ? <p>No endurance activities saved yet.</p>
                  : history.slice(0, 20).map((item) => {
                      const data = readRun(item);
                      const savedPoints = Array.isArray(data.route_points) ? data.route_points : [];
                      return (
                        <article key={item.id} style={{ borderTop: "1px solid #333", padding: "12px 0" }}>
                          <strong>{ENDURANCE_MODES.find((m) => m.value === data.activity)?.label || "Endurance"}</strong>
                          <div style={{ color: "#bbb", fontSize: 13 }}>{new Date(item.date).toLocaleString()}</div>
                          <p>{distanceInUnit(data.distance_m, unit).toFixed(2)} {unit} · {formatDuration(data.elapsed_s)} · {formatPace(secondsPerUnit(data.distance_m, data.elapsed_s, unit))}/{unit}</p>
                          {savedPoints.length > 0 && <RouteTrace points={savedPoints} />}
                        </article>
                      );
                    })}
              </div>}
        </section>

        <p style={{ color: "#999", fontSize: 12, textAlign: "center" }}>
          All workout records are private to your account by default. GPS data is never shared with clubs or a leaderboard in this version.
          Train within your current fitness level and adjust for conditions.
        </p>
      </main>
      <TextAction plain onClick={() => { if (phase !== "idle" && !window.confirm("You have an unsaved GPS activity. If you navigate away, it will be lost. Open the menu?")) return; setMenuOpen(true); }} style={{ position: "fixed", bottom: 18, right: 20, zIndex: 20, color: ACCENT, fontSize: 18 }}>Return to Menu</TextAction>
    </div>
  );
}
