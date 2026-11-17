import { describe, expect, it } from "vitest";
import {
  METERS_PER_MILE,
  assessFix, calculateSplits, cleanFix, distanceInUnit, formatDuration,
  formatPace, haversineMeters, reduceRoute, routeToSvg, secondsPerUnit, toMeters
} from "./runningMetrics.js";

describe("Running and Endurance metrics", () => {
  it("calculates geodesic distance and converts units", () => {
    expect(haversineMeters({ lat: 0, lon: 0 }, { lat: 0, lon: 1 })).toBeCloseTo(111195, -1);
    expect(toMeters(1, "mi")).toBeCloseTo(METERS_PER_MILE, 3);
    expect(distanceInUnit(5000, "km")).toBe(5);
  });

  it("rejects poor accuracy and implausible GPS changes", () => {
    expect(cleanFix({ coords: { latitude: 41, longitude: -80, accuracy: 200 }, timestamp: 1 })).toBeNull();
    const a = { lat: 41, lon: -80, time: 1000, accuracy: 10 };
    expect(assessFix(a, { ...a, time: 2000 }, "running").reason).toBe("jitter");
    expect(assessFix(a, { ...a, lon: -79.9, time: 2000 }, "running").reason).toBe("speed");
    expect(assessFix(a, { ...a, lon: -79.999, time: 1000000 }, "running").reason).toBe("gap");
    expect(assessFix(a, { ...a, lon: -79.999, time: 20000 }, "running").accepted).toBe(true);
  });

  it("formats elapsed time and pace, avoiding division by zero", () => {
    expect(formatDuration(65)).toBe("01:05");
    expect(formatDuration(3661)).toBe("1:01:01");
    expect(formatPace(secondsPerUnit(METERS_PER_MILE, 600, "mi"))).toBe("10:00");
    expect(formatPace(secondsPerUnit(0, 600, "mi"))).toBe("--:--");
  });

  it("uses GPS elapsed times for kilometer splits, without counting paused segments", () => {
    const a = { lat: 0, lon: 0, time: 0, elapsedSeconds: 0, segment: 0 };
    const b = { lat: 0, lon: 0.009, time: 360000, elapsedSeconds: 360, segment: 0 };
    const c = { lat: 0, lon: 0.009, time: 960000, elapsedSeconds: 360, segment: 1 };
    const d = { lat: 0, lon: 0.018, time: 1320000, elapsedSeconds: 720, segment: 1 };
    const splits = calculateSplits([a, b, c, d], "km");
    expect(splits).toHaveLength(2);
    expect(splits[0].elapsedSeconds).toBeGreaterThan(350);
    expect(splits[1].elapsedSeconds).toBeGreaterThan(700);
  });

  it("bounds the display route and creates finite SVG coordinates", () => {
    const points = Array.from({ length: 1000 }, (_, i) => ({ lat: 41 + i / 100000, lon: -80 + i / 100000, segment: 0 }));
    const reduced = reduceRoute(points, 100);
    expect(reduced).toHaveLength(100);
    expect(reduced.at(-1)).toBe(points.at(-1));
    expect(routeToSvg(reduced)).toHaveLength(100);
    expect(routeToSvg(reduced).every((p) => Number.isFinite(p.x) && Number.isFinite(p.y))).toBe(true);
  });
});
