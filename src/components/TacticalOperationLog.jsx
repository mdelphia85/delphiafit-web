import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api.js";

const configurations = {
  sar: { title: "Search & Rescue Operations", list: "/sar/operation/list", create: "/sar/operation", activities: "/sar/team", history: (id) => `/sar/team/${id}`, name: "operation_name", type: "operation_type", typeLabel: "Operation type", types: ["wilderness", "urban", "water", "rope", "collapsed"], activity: (id, value) => ({ operation_id: id, team_name: value, members: "Self-reported readiness update" }), activityLabel: "Team / activity record", historyTitle: "Teams recorded", close: null },
  disaster: { title: "Disaster Response Operations", list: "/disaster/operation/list", create: "/disaster/operation", activities: "/disaster/resource", history: (id) => `/disaster/resource/${id}`, name: "name", type: "type", typeLabel: "Incident type", types: ["flood", "earthquake", "hurricane", "wildfire", "tornado", "other"], activity: (id, value) => ({ operation_id: id, resource_type: "Readiness update", quantity: 1, notes: value }), activityLabel: "Response update", historyTitle: "Response updates", close: (id) => `/disaster/operation/${id}/close` },
  maritime: { title: "Maritime Operations", list: "/maritime/operation/list", create: "/maritime/operation", activities: "/maritime/incident", history: (id) => `/maritime/incident/${id}`, name: "name", type: "operation_type", typeLabel: "Operation type", types: ["rescue", "interdiction", "boarding", "dive", "patrol"], activity: (id, value) => ({ operation_id: id, incident_type: "Readiness update", description: value }), activityLabel: "Operation log", historyTitle: "Incident log", close: (id) => `/maritime/operation/${id}/close` },
  aviation: { title: "Aviation Crew Readiness", list: "/aviation/operation/list", create: "/aviation/operation", activities: "/aviation/event", history: (id) => `/aviation/event/${id}`, name: "name", type: "operation_type", typeLabel: "Mission type", types: ["medevac", "SAR", "patrol", "insertion", "extraction"], activity: (id, value) => ({ operation_id: id, event_type: "Readiness update", description: value }), activityLabel: "Crew readiness log", historyTitle: "Recorded events", close: (id) => `/aviation/operation/${id}/close` },
  hazmat: { title: "Hazmat / CBRN Operations", list: "/hazmat/operation/list", create: "/hazmat/operation", activities: "/hazmat/exposure", history: (id) => `/hazmat/exposure/${id}`, name: "name", type: "incident_type", typeLabel: "Incident type", types: ["chemical", "biological", "radiological", "nuclear", "hazmat"], activity: (id, value) => ({ operation_id: id, exposure_type: "Readiness update", notes: value }), activityLabel: "Safety / exposure log", historyTitle: "Exposure and safety log", close: (id) => `/hazmat/operation/${id}/close` },
  wildland: { title: "Wildland Fire Operations", list: "/wildland/operation/list", create: "/wildland/operation", activities: "/wildland/event", history: (id) => `/wildland/event/${id}`, name: "name", type: "fire_type", typeLabel: "Fire type", types: ["brush", "forest", "grass", "interface"], activity: (id, value) => ({ operation_id: id, event_type: "Readiness update", description: value }), activityLabel: "Field update", historyTitle: "Recorded events", close: (id) => `/wildland/operation/${id}/close` }
};

export default function TacticalOperationLog({ module }) {
  const config = configurations[module];
  const [operations, setOperations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activityRows, setActivityRows] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState(config.types[0]);
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest(config.list).then((records) => {
      if (active) setOperations(records);
    }).catch((requestError) => {
      if (active) setError(requestError.message || "Unable to load operations.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [module, config.list]);

  async function createOperation(event) {
    event.preventDefault();
    const payload = { [config.name]: name.trim(), [config.type]: type, location: location.trim() || null };
    if (module === "maritime") payload.vessel = "";
    if (module === "aviation") payload.aircraft = "";
    if (module === "disaster") payload.severity = "unspecified";
    if (module === "hazmat") payload.threat_level = "unspecified";
    if (module === "wildland") payload.containment = 0;
    try {
      const created = await apiRequest(config.create, { method: "POST", body: payload });
      setOperations((current) => [created, ...current]);
      setSelectedId(created.id);
      setActivityRows([]);
      setName("");
      setLocation("");
      setError("");
    } catch (requestError) { setError(requestError.message || "Unable to create operation."); }
  }

  async function selectOperation(operation) {
    setSelectedId(operation.id);
    try {
      setActivityRows(await apiRequest(config.history(operation.id)));
      setError("");
    } catch (requestError) { setError(requestError.message || "Unable to load activity for this operation."); }
  }

  async function recordActivity(event) {
    event.preventDefault();
    if (!selectedId) return;
    try {
      await apiRequest(config.activities, { method: "POST", body: config.activity(selectedId, details.trim()) });
      await selectOperation(operations.find((item) => item.id === selectedId));
      setDetails("");
      setError("");
    } catch (requestError) { setError(requestError.message || "Unable to record this operation activity."); }
  }

  async function closeOperation() {
    try {
      const updated = await apiRequest(config.close(selectedId), { method: "POST", body: { status: "completed" } });
      setOperations((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (requestError) { setError(requestError.message || "Unable to close this operation."); }
  }

  const selected = operations.find((operation) => operation.id === selectedId);
  return <main style={{ width: "min(760px, 100%)", margin: "0 auto", color: "#fff" }}>
    <h1 style={{ color: "#2d5f3a" }}>{config.title}</h1>
    <p style={{ color: "#aaa" }}>Operational records are private to your account.</p>
    {error && <p role="alert" style={{ color: "#fecaca", background: "#441b1b", padding: 10 }}>{error}</p>}
    <form onSubmit={createOperation} style={panel}>
      <h2>Create operation</h2>
      <label>Operation name<input required value={name} onChange={(event) => setName(event.target.value)} style={field} /></label>
      <label>{config.typeLabel}<select value={type} onChange={(event) => setType(event.target.value)} style={field}>{config.types.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Location<input value={location} onChange={(event) => setLocation(event.target.value)} style={field} /></label>
      <button style={button}>Create operation record</button>
    </form>
    <section aria-busy={loading}><h2>Your operations</h2>
      {loading ? <p role="status">Loading operations?</p> : operations.length === 0 ? <p role="status">No operations recorded yet.</p> : operations.map((operation) => <button type="button" key={operation.id} onClick={() => selectOperation(operation)} style={{ ...panel, display: "block", width: "100%", textAlign: "left", cursor: "pointer" }}>
        <strong>{operation[config.name]}</strong><div>{operation[config.type]} ? {operation.location || "Location not recorded"} ? {operation.status || "active"}</div>
      </button>)}
    </section>
    {selected && <section style={panel}><h2>Activity for {selected[config.name]}</h2>
      {activityRows.length ? activityRows.map((row) => <article key={row.id} style={{ borderTop: "1px solid #444", padding: 8 }}><strong>{row.name || row.resource_type || row.incident_type || row.event_type || row.exposure_type || row.team_name}</strong><p>{row.notes || row.description || row.members}</p></article>) : <p>No activity logged yet.</p>}
      <form onSubmit={recordActivity} style={{ display: "grid", gap: 8 }}><label>{config.activityLabel}<textarea required value={details} onChange={(event) => setDetails(event.target.value)} rows="3" style={field} /></label><button style={button}>Save activity record</button></form>
      {config.close && selected.status !== "completed" && <button type="button" onClick={closeOperation} style={{ ...button, marginTop: 10 }}>Close operation</button>}
    </section>}
  </main>;
}

const panel = { background: "#111", border: "1px solid #444", borderRadius: 10, padding: 12, marginBottom: 10, color: "#fff" };
const field = { display: "block", width: "100%", boxSizing: "border-box", padding: 8, marginTop: 4, color: "#fff", background: "#000", border: "1px solid #444", borderRadius: 6 };
const button = { padding: 10, color: "#fff", background: "#151515", border: "1px solid #2d5f3a", borderRadius: 6, cursor: "pointer" };
