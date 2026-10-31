export const BG = "rgb(0,0,0)";
export const CARD_BG = "rgb(15,15,15)";
export const BORDER = "rgb(60,60,60)";
export const TEXT_MAIN = "rgb(240,240,240)";
export const TEXT_MUTED = "rgb(160,160,160)";
export const ACCENT = "rgb(128,0,128)";

export const container = {
  width: "100%",
  height: "100%",
  backgroundColor: BG,
  color: TEXT_MAIN,
  padding: "20px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  overflow: "auto",
};

export const card = {
  backgroundColor: CARD_BG,
  border: `1px solid ${BORDER}`,
  borderRadius: "10px",
  padding: "16px",
  boxSizing: "border-box",
};

export const title = { fontSize: "26px", fontWeight: "600" };
export const subtitle = { fontSize: "14px", color: TEXT_MUTED };
export const muted = { color: TEXT_MUTED, fontSize: "14px" };

export const errorBox = {
  ...card,
  border: "1px solid red",
  color: "red",
  fontSize: "14px",
};

export const input = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  borderRadius: "6px",
  border: `1px solid ${BORDER}`,
  backgroundColor: "rgb(20,20,20)",
  color: TEXT_MAIN,
  marginBottom: "10px",
  boxSizing: "border-box",
};

export const primaryButton = {
  padding: "10px 16px",
  backgroundColor: ACCENT,
  border: "none",
  borderRadius: "6px",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
  width: "fit-content",
};

export const toggleBtn = (active) => ({
  padding: "6px 12px",
  borderRadius: "6px",
  border: `1px solid ${active ? ACCENT : BORDER}`,
  backgroundColor: active ? ACCENT : CARD_BG,
  color: active ? "white" : TEXT_MAIN,
  cursor: "pointer",
  fontSize: "13px",
  textAlign: "center",
});

export const dangerBtn = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "1px solid red",
  backgroundColor: "transparent",
  color: "red",
  cursor: "pointer",
  fontSize: "13px",
  textAlign: "center",
};
