import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";
const HARDWARE_COLOR = "#f59e0b";
const providers = ["Apple Health", "Google Fit", "Garmin", "Fitbit", "WHOOP", "Oura"];
export default function HardwareIntegrations() {
  const { setMenuOpen } = useContext(MenuContext);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true); setError("");
    try { setDevices(await apiRequest("/hardware/me/devices")); }
    catch (e) { setError(e.status === 401 ? "Log in to manage integrations." : e.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { const timer = setTimeout(() => { load(); }, 0); return () => clearTimeout(timer); }, []);
  async function unlink(provider) {
    setBusy(true); setError("");
    try { await apiRequest("/hardware/unlink", { method: "POST", body: { provider } }); await load(); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <main style={{ width: "100%", minHeight: "100vh", background: "#000", padding: "20px 16px 90px", color: "#fff", boxSizing: "border-box" }}><div style={{ maxWidth: 620, margin: "0 auto" }}>
    <h1 style={{ color: HARDWARE_COLOR, textAlign: "center" }}>⚙️ Integrations</h1><p style={{ color: "#aaa" }}>Vendor OAuth and data-sync clients are not configured. This page never invents device data; existing connection records can still be reviewed and removed.</p>{error && <p role="alert" style={{ color: "#f87171" }}>{error}</p>}{loading && <p role="status">Loading connection records…</p>}
    {!loading && !error && !devices.length && <section style={{ background: "#111", borderRadius: 10, padding: 14 }}><p>No devices are connected to your account.</p></section>}
    {devices.map((device) => <article key={device.provider} style={{ background: "#111", border: "1px solid #333", borderRadius: 10, padding: 14, marginBottom: 10, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}><div><strong>{device.provider}</strong><div style={{ color: "#aaa", fontSize: 12 }}>Status: {device.status} · Linked: {device.linked_at ? new Date(device.linked_at).toLocaleDateString() : "unknown"}</div><div style={{ color: "#aaa", fontSize: 12 }}>Last sync: {device.last_sync ? new Date(device.last_sync).toLocaleString() : "Not synced"}</div></div><button disabled={busy} onClick={() => unlink(device.provider)} style={{ padding: 8 }}>Unlink</button></article>)}
    <section style={{ background: "#111", borderRadius: 10, padding: 14, marginTop: 16 }}><h2>Supported provider integrations</h2><p>{providers.join(", ")}</p><p style={{ color: "#aaa", fontSize: 12 }}>Connection and synchronization are unavailable until provider OAuth/API credentials and consent flows are configured.</p></section>
  </div><div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: 40, background: "#000", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 16px", boxSizing: "border-box" }}><button onClick={() => setMenuOpen(true)} style={{ color: HARDWARE_COLOR, background: "transparent", border: 0, textDecoration: "underline" }}>Return to Menu</button></div></main>;
}
