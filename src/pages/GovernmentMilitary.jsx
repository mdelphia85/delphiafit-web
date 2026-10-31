import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";
export default function GovernmentMilitary() {
  const { setMenuOpen } = useContext(MenuContext);
  const [orgs, setOrgs] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { apiRequest("/org/mine").then(setOrgs).catch((e) => setError(e.status === 401 ? "Log in to view your organization workspaces." : e.message)); }, []);
  return <main style={{ width: "100%", minHeight: "100vh", background: "#000", color: "#fff", padding: "20px 16px 90px", boxSizing: "border-box" }}><div style={{ maxWidth: 620, margin: "0 auto" }}><h1 style={{ color: "#10b981", textAlign: "center" }}>🏛️ Government + Military</h1><p style={{ color: "#aaa" }}>Organization workspaces are available for authorized members. Government-specific deployments, procurement, compliance certification, and agency integrations are not configured here; no agency enrollment or readiness metrics are represented.</p>{error && <p role="alert" style={{ color: "#f87171" }}>{error}</p>}{orgs.map((o) => <section key={o.id} style={{ background: "#111", border: "1px solid #333", borderRadius: 10, padding: 14, marginBottom: 10 }}><strong>{o.name}</strong><p style={{ color: "#aaa" }}>{o.industry || "Organization"} · Workspace ID {o.id}</p></section>)}{!orgs.length && !error && <p>No organization workspaces are associated with your account.</p>}</div><div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: 40, background: "#000", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 16px", boxSizing: "border-box" }}><button onClick={() => setMenuOpen(true)} style={{ color: "#10b981", background: "transparent", border: 0, textDecoration: "underline" }}>Return to Menu</button></div></main>;
}
