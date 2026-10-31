export const COACH_COLOR = "#ec4899";

export const cardStyle = { background: "#111", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "14px" };

export const inputStyle = {
  width: "100%",
  padding: "10px",
  background: "#111",
  border: "1px solid #2a2a2a",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "13px",
  boxSizing: "border-box"
};

export function primaryButton(disabled = false) {
  return {
    padding: "12px",
    background: COACH_COLOR,
    color: "#000",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1
  };
}

export const secondaryButton = {
  padding: "12px",
  background: "#222",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer"
};

export const dangerButton = { ...secondaryButton, background: "#333", color: "#f87171" };

export const labelStyle = { display: "block", color: "#999", fontSize: "12px", marginBottom: "6px" };
