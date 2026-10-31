import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";
const COLOR = "#8b5cf6";
export default function EnterpriseDashboard() {
  const { setMenuOpen } = useContext(MenuContext);
  const [orgs, setOrgs] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { apiRequest("/org/mine").then(setOrgs).catch((e) => setError(e.status === 401 ? "Log in to view your organizations." : e.message)); }, []);
  return <main style={{ width: "100%", minHeight: "100vh", background: "#000", padding: "20px 16px 90px", color: "#fff", boxSizing: "border-box" }}><div style={{ maxWidth: 620, margin: "0 auto" }}>
    <h1 style={{ textAlign: "center", color: COLOR }}>🏢 Enterprise</h1>
    {error && <p role="alert" style={{ color: "#f87171" }}>{error}</p>}
    {!error && !orgs.length && <section style={{ background: "#111", padding: 16, borderRadius: 10 }}><h2>No organization data</h2><p>Create or join an organization to see enterprise settings. Usage metrics and uptime are not available in this deployment.</p></section>}
    {orgs.map((org) => <section key={org.id} style={{ background: "#111", border: "1px solid #333", borderRadius: 12, padding: 16, marginBottom: 12 }}><h2>{org.name}</h2><p>{org.industry || "Organization"}{org.country ? ` · ${org.country}` : ""}</p><p style={{ color: "#aaa" }}>Organization ID: {org.id}</p><p style={{ color: "#aaa" }}>No usage or uptime telemetry is configured.</p></section>)}
    <p>Organization membership and roles are managed in Organization and Permissions.</p>
  </div><div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: 40, background: "#000", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 16px", boxSizing: "border-box" }}><button onClick={() => setMenuOpen(true)} style={{ color: COLOR, background: "transparent", border: 0, textDecoration: "underline" }}>Return to Menu</button></div></main>;
}
