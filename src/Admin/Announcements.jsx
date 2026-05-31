import { useEffect, useState } from "react";
import AdminLayout from "./Admin.jsx";

export default function AdminAnnouncements() {
  const BG = "rgb(0,0,0)";
  const CARD_BG = "rgb(15,15,15)";
  const BORDER = "rgb(60,60,60)";
  const TEXT_MAIN = "rgb(240,240,240)";
  const TEXT_MUTED = "rgb(160,160,160)";
  const ACCENT = "rgb(128,0,128)";

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [titleInput, setTitleInput] = useState("");
  const [bodyInput, setBodyInput] = useState("");

  // ⭐ Fetch REAL announcements from backend
  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch(
          "https://delphiafit-backend-production.up.railway.app/admin/announcements",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const json = await res.json();
        setAnnouncements(json.announcements || json);
      } catch (err) {
        console.error("Failed to load announcements:", err);
      }

      setLoading(false);
    }

    loadAnnouncements();
  }, []);

  // ⭐ Create announcement (REAL backend)
  async function createAnnouncement() {
    if (!titleInput.trim() || !bodyInput.trim()) return;

    const token = localStorage.getItem("adminToken");

    const res = await fetch(
      "https://delphiafit-backend-production.up.railway.app/admin/announcements",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: titleInput,
          body: bodyInput
        })
      }
    );

    const newAnnouncement = await res.json();

    // Add new announcement to UI
    setAnnouncements(prev => [newAnnouncement, ...prev]);

    setTitleInput("");
    setBodyInput("");
  }

  // ⭐ Delete announcement (REAL backend)
  async function deleteAnnouncement(id) {
    const token = localStorage.getItem("adminToken");

    await fetch(
      `https://delphiafit-backend-production.up.railway.app/admin/announcements/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setAnnouncements(prev => prev.filter(a => a.id !== id));
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

  const card = {
    backgroundColor: CARD_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: "10px",
    padding: "16px",
    boxSizing: "border-box"
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "6px"
  };

  const subtitle = {
    fontSize: "14px",
    color: TEXT_MUTED,
    marginBottom: "12px"
  };

  const input = {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: `1px solid ${BORDER}`,
    backgroundColor: "rgb(20,20,20)",
    color: TEXT_MAIN,
    marginBottom: "10px",
    boxSizing: "border-box"
  };

  const textarea = {
    ...input,
    height: "100px",
    resize: "none"
  };

  const button = {
    padding: "10px 16px",
    backgroundColor: ACCENT,
    border: "none",
    borderRadius: "6px",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "6px",
    width: "fit-content"
  };

  const announcementCard = {
    ...card,
    marginBottom: "12px"
  };

  const announcementTitle = {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "4px"
  };

  const announcementBody = {
    fontSize: "14px",
    color: TEXT_MAIN,
    marginBottom: "6px"
  };

  const announcementDate = {
    fontSize: "12px",
    color: TEXT_MUTED
  };

  const deleteBtn = {
    color: "red",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "8px",
    textDecoration: "underline",
    width: "fit-content"
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: "20px", color: TEXT_MAIN }}>
          Loading announcements...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={container}>
        {/* HEADER */}
        <div>
          <div style={titleStyle}>Admin Announcements</div>
          <div style={subtitle}>Create and manage announcements for all users.</div>
        </div>

        {/* CREATE ANNOUNCEMENT */}
        <div style={card}>
          <div style={{ fontSize: "18px", fontWeight: "500", marginBottom: "10px" }}>
            Create Announcement
          </div>

          <input
            style={input}
            placeholder="Announcement Title"
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
          />

          <textarea
            style={textarea}
            placeholder="Announcement Body"
            value={bodyInput}
            onChange={e => setBodyInput(e.target.value)}
          />

          <button style={button} onClick={createAnnouncement}>
            Publish Announcement
          </button>
        </div>

        {/* EXISTING ANNOUNCEMENTS */}
        <div>
          <div style={{ fontSize: "18px", fontWeight: "500", marginBottom: "10px" }}>
            Existing Announcements
          </div>

          {announcements.map(a => (
            <div key={a.id} style={announcementCard}>
              <div style={announcementTitle}>{a.title}</div>
              <div style={announcementBody}>{a.body}</div>
              <div style={announcementDate}>
                Posted on {a.created_at?.split("T")[0] || a.date}
              </div>

              <div style={deleteBtn} onClick={() => deleteAnnouncement(a.id)}>
                Delete
              </div>
            </div>
          ))}

          {announcements.length === 0 && (
            <div style={{ color: TEXT_MUTED, fontSize: "14px" }}>
              No announcements yet.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
