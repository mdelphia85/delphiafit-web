import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./Admin.jsx";
import { adminFetch, formatDate, formatDateTime } from "./adminApi.js";
import {
  BORDER, TEXT_MAIN, TEXT_MUTED, card, container, dangerBtn, errorBox, toggleBtn,
} from "./adminTheme.js";

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      adminFetch(`/admin/users/${id}`),
      adminFetch(`/admin/users/${id}/workouts`),
      adminFetch(`/admin/users/${id}/daily`),
      adminFetch(`/admin/users/${id}/messages`),
      adminFetch(`/admin/users/${id}/logs`),
    ])
      .then(([u, w, d, m, a]) => {
        if (cancelled) return;
        setUser(u);
        setWorkouts(w || []);
        setDailyLogs(d || []);
        setMessages(m || []);
        setActivity(a || []);
      })
      .catch((err) => !cancelled && setError(err.message || "Failed to load user."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function act(fn) {
    setError("");
    try {
      await fn();
    } catch (err) {
      setError(err.message);
    }
  }

  const toggleAdmin = () => act(async () => {
    const res = await adminFetch(`/admin/users/${id}/role`, { method: "PUT", body: { is_admin: !user.is_admin } });
    setUser(res.user);
  });

  const toggleSuspend = () => act(async () => {
    const res = await adminFetch(`/admin/users/${id}/suspend`, { method: "PATCH", body: { suspended: !user.is_suspended } });
    setUser(res.user);
  });

  const resetStreak = () => act(async () => {
    const res = await adminFetch(`/admin/users/${id}/reset-streak`, { method: "PATCH" });
    setUser(res.user);
  });

  const deleteUser = () => {
    if (!window.confirm(`Permanently delete ${user.email} and all of their data?`)) return;
    return act(async () => {
      await adminFetch(`/admin/users/${id}`, { method: "DELETE" });
      navigate("/admin/users");
    });
  };

  const sectionTitle = { fontSize: "18px", fontWeight: "600", marginBottom: "10px" };
  const listItem = { padding: "10px 0", borderBottom: `1px solid ${BORDER}`, fontSize: "14px" };
  const btn = { ...toggleBtn(false), padding: "8px 14px", fontSize: "14px" };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: "20px", color: TEXT_MAIN }}>Loading user...</div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div style={container}>
          <div style={errorBox}>{error || "User not found."}</div>
          <div style={btn} onClick={() => navigate("/admin/users")}>Back to Users</div>
        </div>
      </AdminLayout>
    );
  }

  const section = (label, items, empty, render) => (
    <div style={card}>
      <div style={sectionTitle}>{label}</div>
      {items.length > 0 ? items.map(render) : <div style={{ color: TEXT_MUTED }}>{empty}</div>}
    </div>
  );

  return (
    <AdminLayout>
      <div style={container}>
        <div>
          <div style={{ fontSize: "26px", fontWeight: "600" }}>User: {user.name || "Unknown"}</div>
          <div style={{ fontSize: "14px", color: TEXT_MUTED }}>{user.email}</div>
        </div>

        {error && <div style={errorBox}>{error}</div>}

        <div style={card}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ ...toggleBtn(user.is_admin), padding: "8px 14px", fontSize: "14px" }} onClick={toggleAdmin}>
              {user.is_admin ? "Revoke Admin" : "Make Admin"}
            </div>
            <div style={{ ...toggleBtn(user.is_suspended), padding: "8px 14px", fontSize: "14px" }} onClick={toggleSuspend}>
              {user.is_suspended ? "Unsuspend" : "Suspend"}
            </div>
            <div style={btn} onClick={resetStreak}>Reset Streak</div>
            <div style={{ ...dangerBtn, padding: "8px 14px", fontSize: "14px" }} onClick={deleteUser}>Delete User</div>
            <div style={btn} onClick={() => navigate("/admin/users")}>Back</div>
          </div>
        </div>

        <div style={card}>
          <div style={sectionTitle}>Profile</div>
          <div style={listItem}>Email: {user.email}</div>
          <div style={listItem}>Created: {formatDate(user.created_at)}</div>
          <div style={listItem}>Last Login: {formatDateTime(user.last_login)}</div>
          <div style={listItem}>Streak: {user.streak ?? 0}</div>
          <div style={listItem}>Admin: {user.is_admin ? "Yes" : "No"}</div>
          <div style={listItem}>Suspended: {user.is_suspended ? "Yes" : "No"}</div>
        </div>

        {section("Workouts", workouts, "No workouts logged.", w => (
          <div key={w.id} style={listItem}>{w.type} — {formatDateTime(w.date)}</div>
        ))}
        {section("Daily Logs", dailyLogs, "No daily logs.", l => (
          <div key={l.id} style={listItem}>{formatDateTime(l.date)} — {l.summary}</div>
        ))}
        {section("Messages", messages, "No messages from this user.", m => (
          <div key={m.id} style={listItem}>{formatDateTime(m.date)}: {m.message}</div>
        ))}
        {section("Activity Logs", activity, "No activity logs.", a => (
          <div key={a.id} style={listItem}>{formatDateTime(a.timestamp)} — {a.message}</div>
        ))}
      </div>
    </AdminLayout>
  );
}
