import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";

const COLOR = "#06b6d4";
const initialForm = { title: "", description: "", category: "", price: "0" };

export default function CreatorMarketplace() {
  const { setMenuOpen } = useContext(MenuContext);
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [userId, setUserId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  async function load() {
    try { const rows = await apiRequest("/creator/marketplace/listings"); setListings(Array.isArray(rows) ? rows : []); }
    catch (e) { setError(e.message || "Unable to load marketplace listings."); }
    finally { setLoading(false); }
  }
  useEffect(() => { let active = true; Promise.all([apiRequest("/creator/marketplace/listings"), apiRequest("/auth/me")]).then(([rows, user]) => { if (active) { setListings(Array.isArray(rows) ? rows : []); setUserId(user.id); } }).catch((e) => { if (active) setError(e.message || "Unable to load marketplace."); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);

  async function createListing(event) {
    event.preventDefault();
    setSaving(true); setError(""); setNotice("");
    try {
      const payload = { ...form, price: Number(form.price) || 0 };
      if (editingId) await apiRequest(`/creator/marketplace/listings/${editingId}`, { method: "PUT", body: payload });
      else await apiRequest("/creator/marketplace/listings", { method: "POST", body: payload });
      setForm(initialForm); setEditingId(null); setNotice(editingId ? "Listing updated." : "Listing published."); await load();
    }
    catch (e) { setError(e.message || "Unable to publish listing."); }
    finally { setSaving(false); }
  }
  function startEditing(listing) {
    setEditingId(listing.id);
    setForm({ title: listing.title, description: listing.description || "", category: listing.category || "", price: String(listing.price || 0) });
    setNotice("");
  }
  async function requestAccess(listing) {
    setError(""); setNotice("");
    try { await apiRequest(`/creator/marketplace/listings/${listing.id}/interest`, { method: "POST", body: { message: "I am interested in learning more." } }); setNotice(`Interest sent to ${listing.creator_name}. No payment was made.`); }
    catch (e) { setError(e.message || "Unable to send interest request."); }
  }

  return <main style={pageStyle}><section style={{ width: 680, maxWidth: "100%" }}>
    <h1 style={{ color: COLOR, textAlign: "center" }}>Creator Marketplace</h1>
    <p style={{ color: "#aaa" }}>Browse real creator listings and request access. Checkout/payment is not available; requests do not charge you.</p>
    <form onSubmit={createListing} style={formStyle}><h2>{editingId ? "Edit your listing" : "Publish a listing"}</h2><label>Title<input required maxLength={160} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} /></label><label>Category<input maxLength={80} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle} /></label><label>Description<textarea maxLength={3000} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={inputStyle} /></label><label>Reference price (no checkout)<input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={inputStyle} /></label><button disabled={saving} style={buttonStyle}>{saving ? "Saving..." : editingId ? "Save listing changes" : "Become a Creator / Publish"}</button></form>
    {error && <p role="alert" style={{ color: "#ff8b8b" }}>{error}</p>}{notice && <p role="status" style={{ color: COLOR }}>{notice}</p>}
    <h2>Available listings</h2>{loading ? <p>Loading listings...</p> : listings.length === 0 ? <p>No creator listings are available yet.</p> : listings.map((item) => <article key={item.id} style={cardStyle}><header style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}><strong>{item.title}</strong><span style={{ color: COLOR }}>{Number(item.price) > 0 ? `$${Number(item.price).toFixed(2)} reference price` : "Contact creator"}</span></header><p style={{ color: "#aaa" }}>{[item.category, `by ${item.creator_name}`].filter(Boolean).join(" | ")}</p>{item.description && <p>{item.description}</p>}{item.creator_user_id === userId ? <button type="button" onClick={() => startEditing(item)} style={buttonStyle}>Edit listing</button> : <button type="button" onClick={() => requestAccess(item)} style={buttonStyle}>Request access / express interest</button>}</article>)}
  </section><button type="button" onClick={() => setMenuOpen(true)} style={menuStyle}>Return to Menu</button></main>;
}
const pageStyle = { width: "100vw", minHeight: "100vh", background: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", color: "#fff" };
const formStyle = { display: "grid", gap: "10px", background: "#111", borderRadius: "12px", padding: "14px", marginBottom: "18px" };
const cardStyle = { background: "#111", border: "1px solid #333", borderRadius: "12px", padding: "14px", marginTop: "10px" };
const inputStyle = { display: "block", width: "100%", boxSizing: "border-box", padding: "9px", marginTop: "5px", background: "#000", color: "white", border: "1px solid #333", borderRadius: "7px" };
const buttonStyle = { padding: "10px", background: COLOR, color: "#000", border: 0, borderRadius: "8px", cursor: "pointer", fontWeight: 700 };
const menuStyle = { position: "fixed", bottom: "20px", right: "20px", color: COLOR, fontSize: "18px", textDecoration: "underline", background: "#000", border: 0, cursor: "pointer" };
