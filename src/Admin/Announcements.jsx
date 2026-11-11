import { useEffect, useState } from "react";
import AdminLayout from "./Admin.jsx";
import { adminFetch, formatDate } from "./adminApi.js";
import {
  TEXT_MAIN, TEXT_MUTED, card, container, errorBox, input, muted, primaryButton, subtitle, toggleBtn, dangerBtn,
} from "./adminTheme.js";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [editingId, setEditingId] = useState(null);
  const [titleInput, setTitleInput] = useState("");
  const [bodyInput, setBodyInput] = useState("");
  const [publishNow, setPublishNow] = useState(true);

  useEffect(() => {
    adminFetch("/admin/announcements")
      .then((json) => setAnnouncements(json || []))
      .catch((err) => setError(err.message || "Failed to load announcements."))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  function resetForm() {
    setEditingId(null);
    setTitleInput("");
    setBodyInput("");
    setPublishNow(true);
  }

  async function run(action) {
    setError("");
    try {
      await action();
    } catch (err) {
      setError(err.message || "Request failed.");
    }
  }

  function save() {
    if (!titleInput.trim() || !bodyInput.trim()) return;
    return run(async () => {
      if (editingId) {
        const updated = await adminFetch(`/admin/announcements/${editingId}`, {
          method: "PUT",
          body: { title: titleInput, body: bodyInput },
        });
        setAnnouncements(prev => prev.map(a => (a.id === editingId ? updated : a)));
      } else {
        const created = await adminFetch("/admin/announcements", {
          method: "POST",
          body: { title: titleInput, body: bodyInput, published: publishNow },
        });
        setAnnouncements(prev => [created, ...prev]);
      }
      resetForm();
    });
  }

  function startEdit(a) {
    setEditingId(a.id);
    setTitleInput(a.title);
    setBodyInput(a.body || "");
  }

  function togglePublished(a) {
    return run(async () => {
      const updated = await adminFetch(`/admin/announcements/${a.id}/publish`, {
        method: "PATCH",
        body: { published: !a.published },
      });
      setAnnouncements(prev => prev.map(x => (x.id === a.id ? updated : x)));
    });
  }

  function remove(id) {
    if (!window.confirm("Delete this announcement?")) return;
    return run(async () => {
      await adminFetch(`/admin/announcements/${id}`, { method: "DELETE" });
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      if (editingId === id) resetForm();
    });
  }

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: "20px", color: TEXT_MAIN }}>Loading announcements...</div>
      </AdminLayout>
    );
  }

  const textarea = { ...input, height: "100px", resize: "none" };

  return (
    <AdminLayout>
      <div style={container}>
        <div>
          <div style={{ fontSize: "24px", fontWeight: "600", marginBottom: "6px" }}>Admin Announcements</div>
          <div style={subtitle}>Create, edit, publish, and remove announcements shown to all users.</div>
          <button type="button" style={{ ...primaryButton, marginTop: "10px" }} onClick={() => { setLoading(true); setRefreshKey(key => key + 1); }}>
            Refresh Announcements
          </button>
        </div>

        {error && <div style={errorBox}>{error}</div>}

        <div style={card}>
          <div style={{ fontSize: "18px", fontWeight: "500", marginBottom: "10px" }}>
            {editingId ? "Edit Announcement" : "Create Announcement"}
          </div>

          <input
            style={input}
            placeholder="Announcement Title"
            aria-label="Announcement Title"
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
          />

          <textarea
            style={textarea}
            placeholder="Announcement Body"
            aria-label="Announcement Body"
            value={bodyInput}
            onChange={e => setBodyInput(e.target.value)}
          />

          {!editingId && (
            <label style={{ ...muted, display: "block", marginBottom: "10px" }}>
              <input type="checkbox" checked={publishNow} onChange={e => setPublishNow(e.target.checked)} />{" "}
              Publish immediately
            </label>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button style={primaryButton} onClick={save}>
              {editingId ? "Save Changes" : publishNow ? "Publish Announcement" : "Save Draft"}
            </button>
            {editingId && (
              <button style={{ ...primaryButton, backgroundColor: "transparent", border: "1px solid rgb(60,60,60)" }} onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>

        <div>
          <div style={{ fontSize: "18px", fontWeight: "500", marginBottom: "10px" }}>
            Existing Announcements
          </div>

          {announcements.map(a => (
            <div key={a.id} style={{ ...card, marginBottom: "12px" }}>
              <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px" }}>
                {a.title}{" "}
                <span style={{ fontSize: "12px", color: a.published ? "rgb(128,0,128)" : TEXT_MUTED }}>
                  {a.published ? "Published" : "Draft"}
                </span>
              </div>
              <div style={{ fontSize: "14px", color: TEXT_MAIN, marginBottom: "6px" }}>{a.body}</div>
              <div style={{ fontSize: "12px", color: TEXT_MUTED }}>
                Created {formatDate(a.created_at)}
                {a.updated_at ? ` • Edited ${formatDate(a.updated_at)}` : ""}
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <div style={toggleBtn(false)} onClick={() => startEdit(a)}>Edit</div>
                <div style={toggleBtn(a.published)} onClick={() => togglePublished(a)}>
                  {a.published ? "Unpublish" : "Publish"}
                </div>
                <div style={dangerBtn} onClick={() => remove(a.id)}>Delete</div>
              </div>
            </div>
          ))}

          {announcements.length === 0 && (
            <div style={muted}>No announcements yet.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
