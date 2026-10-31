import { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { useTacticalProgress } from "../hooks/useTacticalProgress.js";

const initialCertifications = [];
const color = "#2d5f3a";

export default function CertificationsTracker() {
  const { setMenuOpen } = useContext(MenuContext);
  const [certifications, setCertifications, progress] = useTacticalProgress("certifications", "certifications", initialCertifications);
  const [filter, setFilter] = useState("all");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [completion, setCompletion] = useState(0);
  const filtered = certifications.filter((item) => filter === "all" || item.status === filter);
  const completed = certifications.filter((item) => item.status === "Completed").length;
  const inProgress = certifications.filter((item) => item.status === "In Progress").length;

  function addCertification(event) {
    event.preventDefault();
    const item = {
      id: Date.now(),
      name: name.trim(),
      organization: organization.trim(),
      status,
      progress: status === "Completed" ? 100 : status === "Not Started" ? 0 : Number(completion),
      date: status === "Completed" ? new Date().toISOString().slice(0, 10) : null,
      verified: false
    };
    setCertifications((current) => [item, ...current]);
    setName("");
    setOrganization("");
    setCompletion(0);
  }

  function updateCertification(id, nextStatus, nextProgress) {
    setCertifications((current) => current.map((item) => {
      if (item.id !== id) return item;
      const completedStatus = nextStatus === "Completed";
      return {
        ...item,
        status: nextStatus,
        progress: completedStatus ? 100 : nextStatus === "Not Started" ? 0 : nextProgress ?? item.progress ?? 0,
        date: completedStatus ? item.date || new Date().toISOString().slice(0, 10) : null
      };
    }));
  }

  function removeCertification(id) {
    setCertifications((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      {(progress.loading || progress.error) && <div role="status" aria-live="polite" style={{ position: "fixed", top: 8, left: 8, zIndex: 50, background: "#111", border: "1px solid #555", borderRadius: 6, padding: 8 }}>{progress.loading ? "Syncing saved progress..." : `Progress unavailable: ${progress.error}`}</div>}
      <div style={{ width: 360, maxWidth: "100%" }}>
        <header style={{ textAlign: "center", marginBottom: 20 }}>
          <h1 style={{ color, fontSize: 28 }}>Certifications</h1>
          <p style={{ color: "#999", fontSize: 12 }}>Track your own credentials and progress</p>
        </header>
        <form onSubmit={addCertification} style={{ display: "grid", gap: 10, padding: 12, marginBottom: 16, background: "#111", border: `1px solid ${color}`, borderRadius: 10 }}>
          <label>Certification name<input required value={name} onChange={(event) => setName(event.target.value)} style={fieldStyle} /></label>
          <label>Issuing organization<input required value={organization} onChange={(event) => setOrganization(event.target.value)} style={fieldStyle} /></label>
          <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)} style={fieldStyle}><option>Not Started</option><option>In Progress</option><option>Completed</option></select></label>
          {status === "In Progress" && <label>Progress ({completion}%)<input type="range" min="0" max="100" value={completion} onChange={(event) => setCompletion(event.target.value)} /></label>}
          <button type="submit" style={buttonStyle}>Add certification</button>
        </form>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["all", "Completed", "In Progress", "Not Started"].map((value) => <button key={value} onClick={() => setFilter(value)} style={{ ...buttonStyle, flex: 1, background: filter === value ? color : "#222" }}>{value === "all" ? `All (${certifications.length})` : value}</button>)}
        </div>
        {filtered.length === 0 ? <p role="status" style={{ color: "#999" }}>{certifications.length ? "No certifications match this filter." : "No certifications added yet."}</p> : filtered.map((item) => (
          <article key={item.id} style={{ background: "#111", border: "1px solid #444", borderRadius: 10, padding: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><strong>{item.name}</strong><button type="button" onClick={() => removeCertification(item.id)} aria-label={`Delete ${item.name}`}>Delete</button></div>
            <p style={{ color: "#999" }}>{item.organization}</p>
            <label>Status<select value={item.status} onChange={(event) => updateCertification(item.id, event.target.value)} style={fieldStyle}><option>Not Started</option><option>In Progress</option><option>Completed</option></select></label>
            {item.status === "In Progress" && <label>Progress ({item.progress || 0}%)<input type="range" min="0" max="100" value={item.progress || 0} onChange={(event) => updateCertification(item.id, "In Progress", Number(event.target.value))} /></label>}
            {item.date && <p>Awarded: {item.date}</p>}
            {item.verified && <p>Verified</p>}
          </article>
        ))}
        <section style={{ marginTop: 20, padding: 12, background: "#111", border: `1px solid ${color}`, borderRadius: 10 }}>
          <strong>Summary</strong><div>Total Certifications: {certifications.length}</div><div>Completed: {completed}</div><div>In Progress: {inProgress}</div>
        </section>
      </div>
      <button type="button" onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: 20, right: 20, color, background: "#111", border: `1px solid ${color}`, padding: 10 }}>Return to Menu</button>
    </div>
  );
}

const fieldStyle = { display: "block", width: "100%", boxSizing: "border-box", padding: 8, marginTop: 4, color: "#fff", background: "#000", border: "1px solid #444", borderRadius: 6 };
const buttonStyle = { padding: 8, color: "#fff", background: "#222", border: "1px solid #555", borderRadius: 6, cursor: "pointer" };
