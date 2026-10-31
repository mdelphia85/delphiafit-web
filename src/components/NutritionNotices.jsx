import { Link } from "react-router-dom";

const WHERE = { profile: "/profile", goals: "/goals" };

export function EstimateNote({ color, children }) {
  return (
    <p style={{ margin: 0, fontSize: "13px", opacity: 0.8, color }}>
      {children || "Estimated from your profile and goals. Not medical advice."}
    </p>
  );
}

// Asks the user to complete missing fields instead of guessing values.
export function MissingDataNotice({ targets, color, error }) {
  if (error === "unauthenticated") {
    return (
      <div style={boxStyle(color)}>
        <Link to="/login" style={{ color }}>Log in</Link> to get personalized targets from your profile and goals.
      </div>
    );
  }
  if (!targets) return null;

  if (targets.status === "invalid") {
    return (
      <div style={boxStyle(color)}>
        {(targets.problems || []).map(p => (
          <div key={p}>{p}</div>
        ))}
        <div>
          Update your <Link to="/profile" style={{ color }}>profile</Link>.
        </div>
      </div>
    );
  }

  if (targets.status !== "incomplete") return null;

  return (
    <div style={boxStyle(color)}>
      <div>Complete these fields to calculate personalized targets:</div>
      <div style={{ marginTop: "4px" }}>
        {targets.missing.map((m, i) => (
          <span key={m.field}>
            {i > 0 && ", "}
            <Link to={WHERE[m.where] || "/profile"} style={{ color }}>
              {m.label}
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
}

function boxStyle(color) {
  return {
    border: `1px solid ${color}`,
    borderRadius: "6px",
    padding: "10px",
    textAlign: "center",
    fontSize: "15px",
    marginBottom: "15px",
    color
  };
}
