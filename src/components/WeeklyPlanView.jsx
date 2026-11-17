const PURPLE = "#a78bfa";
const panel = {
  border: "1px solid #333",
  borderRadius: 10,
  padding: 14,
  background: "#151515",
};
const small = { fontSize: 13, color: "#bbb", margin: "4px 0", lineHeight: 1.55 };

const SPLITS = {
  full_body: "Full-body training",
  upper_lower_full: "Upper body / Lower body / Full body",
  upper_lower_repeat: "Upper / Lower repeat",
  push_pull_legs: "Push / Pull / Legs",
  push_pull_legs_upper_lower: "Push / Pull / Legs / Upper / Lower",
};

const DAY_TYPES = {
  upper: "Upper body",
  lower: "Lower body",
  full_body: "Full body",
  push: "Push",
  pull: "Pull",
  legs: "Legs",
  conditioning: "Conditioning",
};

function readable(value) {
  if (typeof value !== "string") return "";
  return value.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function cleanExerciseName(name) {
  if (typeof name !== "string") return "Exercise not specified";
  // Old saved plans used this label without evaluating actual injuries.
  return name.replace(/\s*\(injury[-\u2011\u2010\u2013]friendly\)/gi, "").trim() || "Exercise not specified";
}

function isUnsupportedInjuryClaim(plan) {
  const days = Array.isArray(plan?.plan) ? plan.plan : [];
  return /rehab[-\u2011]friendly|injury[-\u2011]friendly/i.test(plan?.focus || "") ||
    days.some((day) => Array.isArray(day?.exercises) &&
      day.exercises.some((exercise) => /injury[-\u2011]friendly/i.test(exercise?.name || "")));
}

/** Displays the existing saved plan schema without exposing implementation JSON. */
export default function WeeklyPlanView({ plan }) {
  if (!plan || typeof plan !== "object") {
    return <p role="status">This saved training plan is not available.</p>;
  }

  const days = Array.isArray(plan.plan) ? plan.plan : [];
  const flagged = Boolean(plan.requires_injury_review) || isUnsupportedInjuryClaim(plan);
  const safetyNote = typeof plan.safety_note === "string" ? plan.safety_note : null;
  const focus = flagged
    ? "Training preferences recorded. Exercises need individual review for reported restrictions."
    : readable(plan.focus);
  const status = flagged && /recovered|normal training load/i.test(plan.recovery_status || "")
    ? "Sleep/fatigue indicators only — not injury clearance"
    : plan.recovery_status;

  return (
    <div aria-label="Weekly training plan" style={{ display: "grid", gap: 14, textAlign: "left", maxWidth: "100%" }}>
      <section style={panel} aria-label="Weekly overview">
        <h4 style={{ margin: "0 0 12px", color: PURPLE, fontSize: 19 }}>Your weekly overview</h4>
        <p style={small}><strong style={{ color: "#fff" }}>Sessions:</strong> {plan.sessions_per_week ?? days.length} per week</p>
        {plan.split && <p style={small}><strong style={{ color: "#fff" }}>Training split:</strong> {SPLITS[plan.split] || readable(plan.split)}</p>}
        {focus && <p style={small}><strong style={{ color: "#fff" }}>Focus:</strong> {focus}</p>}
        {status && <p style={small}><strong style={{ color: "#fff" }}>Recovery indicators:</strong> {status}</p>}
        <p style={{ fontSize: 12, color: "#aaa", lineHeight: 1.5, marginBottom: 0 }}>
          Training recommendations are estimates from the information provided, not a medical readiness assessment.
        </p>
      </section>

      {flagged && (
        <section role="note" style={{ ...panel, borderColor: "#8b6847" }}>
          <h4 style={{ margin: "0 0 8px", color: "#f6c98a" }}>Reported injury or restriction</h4>
          <p style={{ ...small, color: "#f3dbc0" }}>
            {safetyNote || "This plan may contain movements that have not been assessed for your restrictions. Do not treat exercise names or recovery estimates as clearance to train. Seek individualized guidance from a qualified professional."}
          </p>
        </section>
      )}

      <section aria-label="Training days" style={{ display: "grid", gap: 12 }}>
        <h4 style={{ color: PURPLE, margin: "4px 0 0", fontSize: 19 }}>Training days</h4>
        {days.length === 0 && (
          <p style={{ ...small, color: "#ddd" }}>
            {flagged ? "No specific exercises were assigned because your reported restrictions require individual review." : "No training days were included in this saved plan."}
          </p>
        )}
        {days.map((day, index) => {
          const exercises = Array.isArray(day.exercises) ? day.exercises : [];
          const conditioning = day.conditioning && typeof day.conditioning === "object" ? day.conditioning : null;
          return (
            <details key={index} open={index === 0} style={panel}>
              <summary style={{ color: PURPLE, cursor: "pointer", fontSize: 17, fontWeight: 650, listStylePosition: "inside" }}>
                Day {day.day ?? index + 1} · {DAY_TYPES[day.type] || readable(day.type) || "Training"}
              </summary>
              <div style={{ paddingTop: 12 }}>
                {day.primary_focus && <p style={small}><strong style={{ color: "#fff" }}>Primary focus:</strong> {readable(day.primary_focus)}</p>}
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {day.intensity && <p style={small}><strong style={{ color: "#fff" }}>Intensity:</strong> {readable(day.intensity)}</p>}
                  {day.volume && <p style={small}><strong style={{ color: "#fff" }}>Volume:</strong> {readable(day.volume)}</p>}
                </div>
                <h5 style={{ fontSize: 15, margin: "14px 0 8px", color: "#fff" }}>Exercises</h5>
                {exercises.length ? (
                  <ol style={{ paddingLeft: 24, margin: 0 }}>
                    {exercises.map((exercise, n) => (
                      <li key={n} style={{ marginBottom: 10, color: "#eee", lineHeight: 1.45 }}>
                        <strong>{cleanExerciseName(exercise.name)}</strong>
                        <div style={small}>{exercise.sets != null ? exercise.sets + " sets" : "Sets not provided"} · {exercise.reps != null ? exercise.reps + " reps" : "Reps not provided"}</div>
                        {exercise.instructions && <div style={small}>{exercise.instructions}</div>}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p style={small}>{flagged ? "Exercises require review for your reported restrictions." : "No exercises specified for this day."}</p>
                )}
                {conditioning && (
                  <p style={small}><strong style={{ color: "#fff" }}>Conditioning:</strong> {readable(conditioning.type) || "Optional"}{conditioning.duration_minutes != null ? " · " + conditioning.duration_minutes + " minutes" : ""}</p>
                )}
                {day.notes && <p style={{ ...small, borderTop: "1px solid #333", paddingTop: 10 }}><strong style={{ color: "#fff" }}>Coach's note:</strong> {day.notes}</p>}
              </div>
            </details>
          );
        })}
      </section>
    </div>
  );
}
