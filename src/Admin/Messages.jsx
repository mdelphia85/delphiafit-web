import { useEffect, useState } from "react";
import AdminLayout from "./Admin.jsx";
import { adminFetch, formatDate } from "./adminApi.js";
import { TEXT_MAIN, TEXT_MUTED, card, container, dangerBtn, errorBox, muted, subtitle, title, toggleBtn } from "./adminTheme.js";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/admin/messages")
      .then((json) => setMessages(json || []))
      .catch((err) => setError(err.message || "Failed to load messages."))
      .finally(() => setLoading(false));
  }, []);

  async function toggleResolved(id) {
    setError("");
    try {
      const res = await adminFetch(`/admin/messages/${id}/resolve`, { method: "PATCH" });
      setMessages(prev => prev.map(m => (m.id === id ? res.message : m)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteMessage(id) {
    if (!window.confirm("Delete this message?")) return;
    setError("");
    try {
      await adminFetch(`/admin/messages/${id}`, { method: "DELETE" });
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: "20px", color: TEXT_MAIN }}>Loading messages...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={container}>
        <div>
          <div style={title}>Admin Messages</div>
          <div style={subtitle}>View and manage user messages and support requests.</div>
        </div>

        {error && <div style={errorBox}>{error}</div>}

        <div>
          {messages.map(msg => (
            <div key={msg.id} style={{ ...card, marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "600" }}>{msg.name || "Unknown User"}</div>
                  <div style={{ fontSize: "14px", color: TEXT_MUTED }}>{msg.email}</div>
                </div>
                <div style={{ fontSize: "12px", color: TEXT_MUTED }}>{formatDate(msg.created_at)}</div>
              </div>

              {msg.subject && <div style={{ fontSize: "14px", fontWeight: "600" }}>{msg.subject}</div>}
              <div style={{ fontSize: "14px", margin: "10px 0" }}>{msg.message}</div>

              <div style={{ display: "flex", gap: "14px", marginTop: "10px" }}>
                <div style={toggleBtn(msg.resolved)} onClick={() => toggleResolved(msg.id)}>
                  {msg.resolved ? "Mark as Unresolved" : "Mark as Resolved"}
                </div>
                <div style={dangerBtn} onClick={() => deleteMessage(msg.id)}>Delete</div>
              </div>
            </div>
          ))}

          {messages.length === 0 && <div style={muted}>No messages found.</div>}
        </div>
      </div>
    </AdminLayout>
  );
}
