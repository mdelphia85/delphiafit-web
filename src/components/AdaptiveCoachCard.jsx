import { useEffect, useState } from "react";
import { PersonalizationModel } from "../ai/personalizationModel";
import { syncAdaptiveProfile } from "../ai/adaptiveSync";
import { getRecommendation } from "../ai/recommendations";

// Shows what the on-device adaptive model has learned. Renders nothing until real workout history exists.
export default function AdaptiveCoachCard({ style }) {
  const [, refresh] = useState(0);
  useEffect(() => {
    syncAdaptiveProfile().then(() => refresh((n) => n + 1));
  }, []);
  const learned = PersonalizationModel.completionRate > 0 || Object.keys(PersonalizationModel.preferredCategories || {}).length > 0;
  if (!learned) return null;
  const rec = getRecommendation();
  return (
    <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "12px", margin: "0 0 14px", color: "#fff", ...style }}>
      <div style={{ color: "#FF2ECC", fontWeight: "700", marginBottom: "4px" }}>Adaptive Coach</div>
      <div style={{ fontSize: "13px" }}>Suggested next: <b>{rec.nextWorkout}</b> · Difficulty: <b>{rec.difficulty}</b></div>
      <div style={{ color: "#999", fontSize: "11px", marginTop: "2px" }}>{rec.reason}</div>
    </div>
  );
}
