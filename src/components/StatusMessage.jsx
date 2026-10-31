
export default function StatusMessage({ children, error = false }) {
  return (
    <div
      role={error ? "alert" : "status"}
      style={{ color: error ? "#f87171" : "#999", textAlign: "center", padding: "20px", fontSize: "13px" }}
    >
      {children}
    </div>
  );
}
