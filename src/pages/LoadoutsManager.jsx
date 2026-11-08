import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.js";
import { apiRequest } from "../utils/api.js";

const color = "#2d5f3a";

export default function LoadoutsManager() {
  const { setMenuOpen } = useContext(MenuContext);
  const [loadouts, setLoadouts] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("general");
  const [itemName, setItemName] = useState("");
  const [weight, setWeight] = useState("0");
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/loadout/list").then((result) => {
      if (active) setLoadouts(result);
    }).catch((requestError) => {
      if (active) setError(requestError.message || "Unable to load your loadouts.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  async function createLoadout(event) {
    event.preventDefault();
    try {
      const created = await apiRequest("/loadout/create", { method: "POST", body: { name: name.trim(), category, description: "" } });
      setLoadouts((current) => [created, ...current]);
      setSelectedId(String(created.id));
      setItems([]); setName(""); setError("");
    } catch (requestError) { setError(requestError.message || "Unable to save loadout."); }
  }

  async function selectLoadout(loadout) {
    setSelectedId(String(loadout.id));
    try { setItems(await apiRequest(`/loadout/item/${loadout.id}`)); setError(""); }
    catch (requestError) { setError(requestError.message || "Unable to load loadout items."); }
  }

  async function addItem(event) {
    event.preventDefault();
    if (!selectedId) return;
    try {
      await apiRequest("/loadout/item", { method: "POST", body: { loadout_id: Number(selectedId), name: itemName.trim(), weight: Number(weight), quantity: Number(quantity) } });
      setItems(await apiRequest(`/loadout/item/${selectedId}`));
      setLoadouts(await apiRequest("/loadout/list"));
      setItemName(""); setWeight("0"); setQuantity("1"); setError("");
    } catch (requestError) { setError(requestError.message || "Unable to add this equipment."); }
  }

  const selected = loadouts.find((loadout) => String(loadout.id) === selectedId);
  return <div style={{ minHeight: "100vh", background: "#000", padding: "20px 16px 90px", color: "#fff" }}>
    <main style={{ width: "min(760px, 100%)", margin: "0 auto" }}>
      <h1 style={{ color }}>Loadouts Manager</h1><p>Build and weigh your own equipment sets. Totals are calculated from entered weights.</p>
      {error && <p role="alert" style={{ color: "#fecaca" }}>{error}</p>}
      <form onSubmit={createLoadout} style={panel}><h2>Create a loadout</h2>
        <label>Name<input required value={name} onChange={(event) => setName(event.target.value)} style={field} /></label>
        <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)} style={field}><option>general</option><option>fire</option><option>police</option><option>medical</option><option>military</option><option>tactical</option><option>maritime</option></select></label>
        <button style={button}>Save loadout</button>
      </form>
      <section aria-busy={loading}><h2 style={{ color }}>Your loadouts</h2>{loading ? <p role="status">Loading loadouts?</p> : loadouts.length === 0 ? <p role="status">No loadouts saved yet.</p> : loadouts.map((loadout) => <button type="button" key={loadout.id} onClick={() => selectLoadout(loadout)} style={{ ...panel, width: "100%", textAlign: "left", cursor: "pointer" }}><strong>{loadout.name}</strong><div>{loadout.category} ? Recorded total weight: {loadout.total_weight} ? Mobility score: {loadout.mobility_score} ? Endurance score: {loadout.endurance_score}</div></button>)}</section>
      {selected && <section style={panel}><h2>{selected.name} equipment</h2>
        {items.length === 0 ? <p>No equipment items recorded yet.</p> : items.map((item) => <div key={item.id} style={{ borderTop: "1px solid #444", padding: 8 }}>{item.name} ? {item.quantity} ? {item.weight} weight units</div>)}
        <form onSubmit={addItem} style={{ display: "grid", gap: 8, marginTop: 16 }}>
          <label>Equipment name<input required value={itemName} onChange={(event) => setItemName(event.target.value)} style={field} /></label>
          <label>Weight per item<input required type="number" min="0" step="0.01" value={weight} onChange={(event) => setWeight(event.target.value)} style={field} /></label>
          <label>Quantity<input required type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} style={field} /></label>
          <button style={button}>Add equipment</button>
        </form>
      </section>}
    </main>
    <button type="button" onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: 20, right: 20, color, background: "#111", padding: 10 }}>Return to Menu</button>
  </div>;
}

const panel = { background: "#111", border: "1px solid #444", borderRadius: 10, padding: 14, marginBottom: 12, color: "#fff" };
const field = { display: "block", width: "100%", boxSizing: "border-box", padding: 8, marginTop: 4, color: "#fff", background: "#000", border: "1px solid #444", borderRadius: 6 };
const button = { padding: 10, color: "#fff", background: "#151515", border: `1px solid ${color}`, borderRadius: 6, cursor: "pointer" };
