import { useState } from "react";

// Shows the personalized estimate, macro split and manual override controls.
// `field` is the override key to edit: "calories" or "protein".
export default function TargetPanel({ targets, color, field, onSaveOverride }) {
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState("");

  if (!targets || targets.status !== "ready") return null;

  const { effective, estimate, notes = [], inputs } = targets;
  const estKey = field === "calories" ? "calories" : "protein_g";
  const manual = targets.overrides && targets.overrides[field] != null;

  async function save(next) {
    setMsg("");
    try {
      await onSaveOverride({ [`${field === "calories" ? "calorie" : "protein"}_override`]: next });
      setValue("");
    } catch (e) {
      setMsg(e.message);
    }
  }

  const small = { margin: 0, fontSize: "14px" };
  const link = { textDecoration: "underline", cursor: "pointer" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", color }}>
      <p style={{ ...small, fontWeight: 600 }}>
        {manual ? "Manual target" : "Estimated target"} ({targets.formula})
      </p>
      <p style={small}>
        Macros: {effective.protein_g}g protein · {effective.carbs_g}g carbs · {effective.fat_g}g fat
      </p>
      <p style={small}>
        Estimate: {estimate[estKey]} {field === "calories" ? "kcal" : "g"}
        {field === "calories" && (
          <>
            {" "}(maintenance {estimate.maintenance_calories}, adjustment {estimate.goal_adjustment > 0 ? "+" : ""}
            {estimate.goal_adjustment})
          </>
        )}
      </p>
      <p style={small}>
        Goal: {inputs.goal_type} · Activity: {inputs.activity_level}
      </p>
      {notes.map(n => (
        <p key={n} style={{ ...small, opacity: 0.8 }}>{n}</p>
      ))}

      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "6px" }}>
        <input
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Set your own target"
          style={{
            padding: "6px",
            borderRadius: "6px",
            border: `1px solid ${color}`,
            backgroundColor: "black",
            color,
            width: "150px"
          }}
        />
        <span style={link} onClick={() => value && save(Number(value))}>Save</span>
        {manual && <span style={link} onClick={() => save(null)}>Reset to estimate</span>}
      </div>
      {msg && <p style={small}>{msg}</p>}
      <p style={{ ...small, opacity: 0.7 }}>{targets.disclaimer}</p>
    </div>
  );
}
