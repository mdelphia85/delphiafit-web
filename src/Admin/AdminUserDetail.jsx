import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./Admin.jsx";
import { API } from "../config/api";

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const BG = "rgb(0,0,0)";
  const CARD_BG = "rgb(15,15,15)";
  const BORDER = "rgb(60,60,60)";
  const TEXT_MAIN = "rgb(240,240,240)";
  const TEXT_MUTED = "rgb(160,160,160)";
  const ACCENT = "rgb(128,0,128)";

  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ Fetch all user-related data
  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("adminToken");
        const headers = { Authorization: `Bearer ${token}` };

        // User profile
        const u = await fetch(`${API}/admin/users/${id}`, { headers });
        setUser(await u.json());

        // Workouts
        const w = await fetch(`${API}/admin/users/${id}/workouts`, { headers });
        setWorkouts(await w.json());

        // Daily logs
        const d = await fetch(`${API}/admin/users/${id}/daily`, { headers });
        setDailyLogs(await d.json());

        // Messages
        const m = await fetch(`${API}/admin/users/${id}/messages`, { headers });
        setMessages(await m.json());

        // Activity logs
        const a = await fetch(`${API}/admin/users/${id}/logs`, { headers });
        setActivity(await a.json());

      } catch (err) {
        console.error("User detail load error:", err);
      }

      setLoading(false);
    }

    load();
  }, [id]);

  // ⭐ Admin actions
  async function toggleAdmin() {
    const token = localStorage.getItem("adminToken");

    await fetch(`${API}/admin/users/${id}/admin`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    });

    setUser(prev => ({ ...prev, is_admin: !prev.is_admin }));
  }

  async function deleteUser() {
    const token = localStorage.getItem("adminToken");

    await fetch(`${API}/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    navigate("/admin/users");
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

  const sectionTitle = {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "10px"
  };

  const listItem = {
    padding: "10px 0",
    borderBottom: `1px solid ${BORDER}`,
    fontSize: "14px"
  };

  const adminBtn = isAdmin => ({
    padding: "8px 14px",
    borderRadius: "6px",
    border: `1px solid ${isAdmin ? ACCENT : BORDER}`,
    backgroundColor: isAdmin ? ACCENT : CARD_BG,
    color: isAdmin ? "white" : TEXT_MAIN,
    cursor: "pointer",
    fontSize: "14px",
    marginRight: "10px"
  });

  const deleteBtn = {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "1px solid red",
    backgroundColor: "transparent",
    color: "red",
    cursor: "pointer",
    fontSize: "14px"
  };

  if (loading || !user) {
    return (
      <AdminLayout>
        <div style={{ padding: "20px", color: TEXT_MAIN }}>Loading user...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={container}>
        {/* HEADER */}
        <div>
          <div style={{ fontSize: "26px", fontWeight: "600" }}>
            User: {user.name || "Unknown"}
          </div>
          <div style={{ fontSize: "14px", color: TEXT_MUTED }}>
            {user.email}
          </div>
        </div>

        {/* ACTIONS */}
        <div style={card}>
          <div style={{ display: "flex", gap: "10px" }}>
            <div
              style={adminBtn(user.is_admin)}
              onClick={toggleAdmin}
            >
              {user.is_admin ? "Revoke Admin" : "Make Admin"}
            </div>

            <div
              style={deleteBtn}
              onClick={deleteUser}
            >
              Delete User
            </div>
          </div>
        </div>

        {/* PROFILE */}
        <div style={card}>
          <div style={sectionTitle}>Profile</div>

          <div style={listItem}>Email: {user.email}</div>
          <div style={listItem}>Created: {user.created_at?.split("T")[0]}</div>
          <div style={listItem}>Last Login: {user.last_login || "—"}</div>
          <div style={listItem}>Admin: {user.is_admin ? "Yes" : "No"}</div>
        </div>

        {/* WORKOUTS */}
        <div style={card}>
          <div style={sectionTitle}>Workouts</div>

          {workouts.length > 0 ? (
            workouts.map(w => (
              <div key={w.id} style={listItem}>
                {w.type} — {w.date}
              </div>
            ))
          ) : (
            <div style={{ color: TEXT_MUTED }}>No workouts logged.</div>
          )}
        </div>

        {/* DAILY LOGS */}
        <div style={card}>
          <div style={sectionTitle}>Daily Logs</div>

          {dailyLogs.length > 0 ? (
            dailyLogs.map(l => (
              <div key={l.id} style={listItem}>
                {l.date} — {l.summary}
              </div>
            ))
          ) : (
            <div style={{ color: TEXT_MUTED }}>No daily logs.</div>
          )}
        </div>

        {/* MESSAGES */}
        <div style={card}>
          <div style={sectionTitle}>Messages</div>

          {messages.length > 0 ? (
            messages.map(m => (
              <div key={m.id} style={listItem}>
                {m.date}: {m.message}
              </div>
            ))
          ) : (
            <div style={{ color: TEXT_MUTED }}>No messages from this user.</div>
          )}
        </div>

        {/* ACTIVITY LOGS */}
        <div style={card}>
          <div style={sectionTitle}>Activity Logs</div>

          {activity.length > 0 ? (
            activity.map(a => (
              <div key={a.id} style={listItem}>
                {a.timestamp} — {a.message}
              </div>
            ))
          ) : (
            <div style={{ color: TEXT_MUTED }}>No activity logs.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
