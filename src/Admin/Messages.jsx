import { useEffect, useState } from "react";
import AdminLayout from "./Admin.jsx";

export default function AdminMessages() {
  const BG = "rgb(0,0,0)";
  const CARD_BG = "rgb(15,15,15)";
  const BORDER = "rgb(60,60,60)";
  const TEXT_MAIN = "rgb(240,240,240)";
  const TEXT_MUTED = "rgb(160,160,160)";
  const ACCENT = "rgb(128,0,128)";

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ Fetch REAL messages from backend
  useEffect(() => {
    async function loadMessages() {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const json = await res.json();
        setMessages(json.messages || json);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }

      setLoading(false);
    }

    loadMessages();
  }, []);

  // ⭐ Mark message resolved/unresolved (REAL backend)
  async function toggleResolved(id, current) {
    const token = localStorage.getItem("adminToken");

    await fetch(
      `${import.meta.env.VITE_API_URL}/admin/messages/${id}/resolve`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setMessages(prev =>
      prev.map(m =>
        m.id === id ? { ...m, resolved: !current } : m
      )
    );
  }

  // ⭐ Delete message (REAL backend)
  async function deleteMessage(id) {
    const token = localStorage.getItem("adminToken");

    await fetch(
      `${import.meta.env.VITE_API_URL}/admin/messages/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setMessages(prev => prev.filter(m => m.id !== id));
  }

  // ⭐ Styles
  const container = {
    width: "100%",
    height: "100%",
    backgroundColor: BG,
    color: TEXT_MAIN,
    padding: "20px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    overflow: "auto"
  };

  const title = {
    fontSize: "26px",
    fontWeight: "600"
  };

  const subtitle = {
    fontSize: "14px",
    color: TEXT_MUTED
  };

  const card = {
    backgroundColor: CARD_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: "10px",
    padding: "16px",
    boxSizing: "border-box"
  };

  const messageCard = {
    ...card,
    marginBottom: "12px"
  };

  const messageHeader = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px"
  };

  const nameStyle = {
    fontSize: "16px",
    fontWeight: "600"
  };

  const emailStyle = {
    fontSize: "14px",
    color: TEXT_MUTED
  };

  const messageBody = {
    fontSize: "14px",
    margin: "10px 0"
  };

  const dateStyle = {
    fontSize: "12px",
    color: TEXT_MUTED
  };

  const actionsRow = {
    display: "flex",
    gap: "14px",
    marginTop: "10px"
  };

  const resolveBtn = resolved => ({
    padding: "6px 12px",
    borderRadius: "6px",
    border: `1px solid ${resolved ? ACCENT : BORDER}`,
    backgroundColor: resolved ? ACCENT : CARD_BG,
    color: resolved ? "white" : TEXT_MAIN,
    cursor: "pointer",
    fontSize: "13px"
  });

  const deleteBtn = {
    padding: "6px 12px",
    borderRadius: "6px",
    border: `1px solid red`,
    backgroundColor: "transparent",
    color: "red",
    cursor: "pointer",
    fontSize: "13px"
  };

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
        {/* HEADER */}
        <div>
          <div style={title}>Admin Messages</div>
          <div style={subtitle}>View and manage user messages and support requests.</div>
        </div>

        {/* MESSAGES LIST */}
        <div>
          {messages.map(msg => (
            <div key={msg.id} style={messageCard}>
              <div style={messageHeader}>
                <div>
                  <div style={nameStyle}>{msg.name || "Unknown User"}</div>
                  <div style={emailStyle}>{msg.email}</div>
                </div>

                <div style={dateStyle}>
                  {msg.created_at?.split("T")[0] || "—"}
                </div>
              </div>

              <div style={messageBody}>{msg.message}</div>

              <div style={actionsRow}>
                <div
                  style={resolveBtn(msg.resolved)}
                  onClick={() => toggleResolved(msg.id, msg.resolved)}
                >
                  {msg.resolved ? "Mark as Unresolved" : "Mark as Resolved"}
                </div>

                <div
                  style={deleteBtn}
                  onClick={() => deleteMessage(msg.id)}
                >
                  Delete
                </div>
              </div>
            </div>
          ))}

          {messages.length === 0 && (
            <div style={{ color: TEXT_MUTED, fontSize: "14px" }}>
              No messages found.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
