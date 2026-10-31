import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { apiRequest } from "../utils/api.js";

const COLOR = "#ff6b6b";

export default function Groups() {
  const { setMenuOpen } = useContext(MenuContext);
  const [view, setView] = useState("my-groups");
  const [groups, setGroups] = useState([]);
  const [discoverable, setDiscoverable] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadGroups() {
    setLoading(true);
    setError("");
    try {
      const [mine, browse] = await Promise.all([
        apiRequest("/social/groups"),
        apiRequest("/social/groups/discover")
      ]);
      setGroups(Array.isArray(mine) ? mine : []);
      setDiscoverable(Array.isArray(browse) ? browse : []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load groups.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    Promise.all([apiRequest("/social/groups"), apiRequest("/social/groups/discover")])
      .then(([mine, browse]) => {
        if (active) {
          setGroups(Array.isArray(mine) ? mine : []);
          setDiscoverable(Array.isArray(browse) ? browse : []);
        }
      })
      .catch((requestError) => { if (active) setError(requestError.message || "Unable to load groups."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function createGroup(event) {
    event.preventDefault();
    if (!name.trim()) return;
    setError("");
    try {
      await apiRequest(`/social/groups?name=${encodeURIComponent(name.trim())}&description=${encodeURIComponent(description.trim())}`, { method: "POST" });
      setName("");
      setDescription("");
      setView("my-groups");
      await loadGroups();
    } catch (requestError) {
      setError(requestError.message || "Unable to create group.");
    }
  }

  async function joinGroup(group) {
    setError("");
    try {
      await apiRequest(`/social/groups/${group.id}/join`, { method: "POST" });
      await loadGroups();
    } catch (requestError) {
      setError(requestError.message || "Unable to join group.");
    }
  }

  async function leaveGroup(group) {
    setError("");
    try {
      await apiRequest(`/social/groups/${group.id}/leave`, { method: "DELETE" });
      setSelectedGroup(null);
      await loadGroups();
    } catch (requestError) {
      setError(requestError.message || "Unable to leave group.");
    }
  }

  return (
    <main style={{ width: "100vw", minHeight: "100vh", background: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", color: "#fff" }}>
      <section style={{ width: "560px", maxWidth: "100%" }}>
        <h1 style={{ color: COLOR, textAlign: "center" }}>?? Groups</h1>
        <nav style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
          {[ ["my-groups", "My Groups"], ["discover", "Discover"], ["create", "Create"] ].map(([id, label]) => <button key={id} type="button" onClick={() => { setView(id); setSelectedGroup(null); }} style={{ flex:  1, padding: "10px", background: view === id ? COLOR : "#222", color: "white", border: 0, borderRadius: "8px", cursor: "pointer" }}>{label}</button>)}
        </nav>
        {error && <p role="alert" style={{ color: "#ff8b8b" }}>{error}</p>}
        {loading ? <p>Loading groups?</p> : view === "create" ? (
          <form onSubmit={createGroup} style={{ display: "grid", gap: "12px", background: "#111", padding: "14px", borderRadius: "12px" }}>
            <label>Group name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={120} required style={inputStyle} /></label>
            <label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={1000} rows={3} style={inputStyle} /></label>
            <button type="submit" disabled={!name.trim()} style={buttonStyle}>Create Group</button>
          </form>
        ) : view === "discover" ? (
          discoverable.length ? discoverable.map((group) => <GroupCard key={group.id} group={group} action="Join" onAction={() => joinGroup(group)} />) : <p>No groups to discover right now.</p>
        ) : selectedGroup ? (
          <div>
            <button type="button" onClick={() => setSelectedGroup(null)} style={buttonStyle}>? Back</button>
            <GroupCard group={selectedGroup} action="Leave" onAction={() => leaveGroup(selectedGroup)} />
            <p style={{ color: "#aaa" }}>Group membership and details are saved to your account.</p>
          </div>
        ) : groups.length ? groups.map((group) => <GroupCard key={group.id} group={group} action="Open" onAction={() => setSelectedGroup(group)} />) : <p>No groups yet. Create one or discover a group to join.</p>}
      </section>
      <button type="button" onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", color: COLOR, background: "#000", border: 0, textDecoration: "underline", fontSize: "18px", cursor: "pointer" }}>Return to Menu</button>
    </main>
  );
}

function GroupCard({ group, action, onAction }) {
  return <article style={{ background: "#111", border: "1px solid #333", borderRadius: "12px", padding: "14px", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
    <button type="button" onClick={action === "Open" ? onAction : undefined} style={{ flex: 1, textAlign: "left", color: "white", background: "transparent", border: 0, cursor: action === "Open" ? "pointer" : "default" }}>
      <strong style={{ display: "block", marginBottom: "5px" }}>{group.name}</strong>
      <span style={{ display: "block", color: "#aaa", fontSize: "13px" }}>{group.description || group.category || "Community group"}</span>
      <span style={{ display: "block", color: "#888", fontSize: "12px", marginTop: "5px" }}>{group.member_count || 0} members{group.role ? ` ? ${group.role}` : ""}</span>
    </button>
    {action !== "Open" && <button type="button" onClick={onAction} style={buttonStyle}>{action}</button>}
  </article>;
}

const inputStyle = { display: "block", width: "100%", boxSizing: "border-box", marginTop: "6px", padding: "10px", background: "#000", color: "white", border: "1px solid #333", borderRadius: "8px" };
const buttonStyle = { padding: "10px 14px", background: COLOR, color: "#000", border: 0, borderRadius: "8px", fontWeight: 700, cursor: "pointer" };
