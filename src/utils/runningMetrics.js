export const METERS_PER_MILE = 1609.344;
export const METERS_PER_KM = 1000;

export const ENDURANCE_MODES = Object.freeze([
  { value: "running", label: "Running", maximumSpeed: 9 },
  { value: "walking", label: "Walking", maximumSpeed: 4.5 },
  { value: "hiking", label: "Hiking", maximumSpeed: 5 },
  { value: "rucking", label: "Rucking", maximumSpeed: 5 },
  { value: "cycling", label: "Cycling", maximumSpeed: 25 },
]);

export const ENDURANCE_GOALS = Object.freeze([
  { value: "general", label: "General conditioning", distanceMeters: 0 },
  { value: "1.5mi", label: "Police academy · 1.5-mile run", distanceMeters: METERS_PER_MILE * 1.5 },
  { value: "2mi", label: "Military preparation · 2-mile run", distanceMeters: METERS_PER_MILE * 2 },
  { value: "5k", label: "5K", distanceMeters: 5000 },
  { value: "10k", label: "10K", distanceMeters: 10000 },
  { value: "half", label: "Half marathon", distanceMeters: 21097.5 },
  { value: "marathon", label: "Marathon", distanceMeters: 42195 },
]);

export function toMeters(value, unit = "mi") {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return number * (unit === "km" ? METERS_PER_KM : METERS_PER_MILE);
}

export function distanceInUnit(meters, unit = "mi") {
  const m = Number(meters);
  return Number.isFinite(m) && m >= 0 ? m / (unit === "km" ? METERS_PER_KM : METERS_PER_MILE) : 0;
}

export function haversineMeters(a, b) {
  if (!a || !b) return 0;
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const lat1 = a.lat * rad;
  const lat2 = b.lat * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 6371008.8 * 2 * Math.asin(Math.min(1, Math.sqrt(Math.max(0, h))));
}

export function cleanFix(position) {
  const { coords, timestamp } = position || {};
  if (!coords) return null;
  const lat = Number(coords.latitude), lon = Number(coords.longitude);
  const accuracy = Number(coords.accuracy);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  if (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 70) return null;
  return {
    lat, lon, accuracy: Math.round(accuracy),
    time: Number.isFinite(timestamp) ? timestamp : Date.now(),
  };
}

// Reject stale, inaccurate, jittery, and implausibly fast fixes. Time gaps
// and post-pause fixes begin a new segment to avoid false distance additions.
export function assessFix(previous, next, mode = "running", forceBreak = false) {
  if (!next) return { accepted: false, meters: 0, reason: "accuracy" };
  if (!previous || forceBreak) return { accepted: true, meters: 0, reason: "segment-start" };
  const dt = (next.time - previous.time) / 1000;
  if (!(dt > 0)) return { accepted: false, meters: 0, reason: "stale" };
  if (dt > 120) return { accepted: true, meters: 0, reason: "gap" };
  const meters = haversineMeters(previous, next);
  if (meters < 5) return { accepted: false, meters: 0, reason: "jitter" };
  const modeData = ENDURANCE_MODES.find((item) => item.value === mode);
  if (meters / dt > (modeData?.maximumSpeed ?? 9)) {
    return { accepted: false, meters: 0, reason: "speed" };
  }
  return { accepted: true, meters, reason: "movement" };
}

export function formatDuration(seconds) {
  const s = Math.max(0, Math.floor(Number(seconds) || 0));
  const hours = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return hours > 0 ? hours + ":" + mm + ":" + ss : mm + ":" + ss;
}

export function secondsPerUnit(meters, elapsedSeconds, unit = "mi") {
  const distance = distanceInUnit(meters, unit);
  return distance > 0 && elapsedSeconds > 0 ? elapsedSeconds / distance : null;
}

export function formatPace(seconds) {
  if (seconds === null || !Number.isFinite(seconds) || seconds <= 0) return "--:--";
  return formatDuration(Math.round(seconds));
}

// Produce 1mi/1km GPS splits from cumulative real movement, interpolated
// between consecutive accepted GPS points. Segments without movement add none.
export function calculateSplits(points, unit = "mi") {
  const step = unit === "km" ? METERS_PER_KM : METERS_PER_MILE;
  const result = [];
  let traveled = 0;
  let next = step;
  let lastTime = null;
  const start = points.find((p) => Number.isFinite(p.time));
  if (!start) return result;
  for (const point of points) {
    if (lastTime !== null && point.segment !== points[points.indexOf(point) - 1]?.segment) {
      lastTime = point.time;
      continue;
    }
    if (lastTime !== null) {
      const preceding = points[points.indexOf(point) - 1];
      const meters = haversineMeters(preceding, point);
      while (meters > 0 && traveled + meters >= next && result.length < 100) {
        const fraction = (next - traveled) / meters;
        const crossing = preceding.time + (point.time - preceding.time) * fraction;
        result.push({ distance: result.length + 1, elapsedSeconds: Math.round((crossing - start.time) / 1000) });
        next += step;
      }
      traveled += meters;
    }
    lastTime = point.time;
  }
  return result.map((s, i) => ({
    ...s,
    splitSeconds: s.elapsedSeconds - (i === 0 ? 0 : result[i - 1].elapsedSeconds),
  }));
}

export function reduceRoute(points, limit = 250) {
  if (!Array.isArray(points) || points.length <= limit) return points || [];
  const result = [points[0]];
  const step = (points.length - 1) / (limit - 1);
  for (let i = 1; i < limit - 1; i++) result.push(points[Math.round(i * step)]);
  result.push(points[points.length - 1]);
  return result;
}

export function routeToSvg(points, width = 360, height = 210) {
  if (!Array.isArray(points) || points.length === 0) return [];
  const latRad = points.reduce((total, p) => total + p.lat, 0) / points.length * Math.PI / 180;
  const scale = Math.max(0.001, Math.cos(latRad));
  const raw = points.map((p) => ({ x: p.lon * scale, y: p.lat, segment: p.segment }));
  const xs = raw.map((p) => p.x), ys = raw.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const rangeX = Math.max(maxX - minX, 0.00004);
  const rangeY = Math.max(maxY - minY, 0.00004);
  const padding = 22;
  const multiplier = Math.min((width - padding * 2) / rangeX, (height - padding * 2) / rangeY);
  const usedW = rangeX * multiplier, usedH = rangeY * multiplier;
  return raw.map((p) => ({
    x: Math.round((width - usedW) / 2 + (p.x - minX) * multiplier),
    y: Math.round((height + usedH) / 2 - (p.y - minY) * multiplier),
    segment: p.segment,
  }));
}
