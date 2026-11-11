import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./Admin.jsx";
import { adminFetch, formatDate, formatDateTime } from "./adminApi.js";
import {
  BORDER, TEXT_MAIN, card, container, dangerBtn, errorBox, input, subtitle, title, toggleBtn,
} from "./adminTheme.js";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      const qs = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
      adminFetch(`/admin/users${qs}`)
        .then((json) => {
          if (cancelled) return;
          setUsers(json || []);
          setError("");
        })
        .catch((err) => !cancelled && setError(err.message || "Failed to load users."))
        .finally(() => !cancelled && setLoading(false));
    }, query ? 250 : 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, refreshKey]);

  function replaceUser(updated) {
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
  }

  async function act(fn) {
    setError("");
    try {
      await fn();
    } catch (err) {
      setError(err.message);
    }
  }

  const toggleAdmin = (u) => act(async () => {
    const res = await adminFetch(`/admin/users/${u.id}/role`, { method: "PUT", body: { is_admin: !u.is_admin } });
    replaceUser(res.user);
  });

  const toggleSuspend = (u) => act(async () => {
    const res = await adminFetch(`/admin/users/${u.id}/suspend`, { method: "PATCH", body: { suspended: !u.is_suspended } });
    replaceUser(res.user);
  });

  const deleteUser = (u) => {
    if (!window.confirm(`Permanently delete ${u.email} and all of their data?`)) return;
    return act(async () => {
      await adminFetch(`/admin/users/${u.id}`, { method: "DELETE" });
      setUsers(prev => prev.filter(x => x.id !== u.id));
    });
  };

  const cols = "1.4fr 1.6fr 0.9fr 1.2fr auto auto auto";
  const tableHeader = {
    display: "grid",
    gridTemplateColumns: cols,
    gap: "8px",
    padding: "10px 0",
    borderBottom: `1px solid ${BORDER}`,
    fontWeight: "600",
    fontSize: "14px"
  };
  const tableRow = { ...tableHeader, fontWeight: "400", alignItems: "center" };

  return (
    <AdminLayout>
      <div style={container}>
        <div>
          <div style={title}>Admin Users</div>
          <div style={subtitle}>Manage all user accounts, roles, and access.</div>
          <button type="button" style={toggleBtn(false)} onClick={() => { setLoading(true); setRefreshKey(key => key + 1); }}>
            Refresh Users
          </button>
        </div>

        <input
          style={{ ...input, marginBottom: 0 }}
          placeholder="Search by name or email"
          aria-label="Search users"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        {error && <div style={errorBox}>{error}</div>}

        <div style={card}>
          {loading ? (
            <div style={{ color: TEXT_MAIN }}>Loading users...</div>
          ) : (
            <>
              <div style={tableHeader}>
                <div>Name</div>
                <div>Email</div>
                <div>Created</div>
                <div>Last Login</div>
                <div>Admin</div>
                <div>Access</div>
                <div>Delete</div>
              </div>

              {users.map(user => (
                <div key={user.id} style={tableRow}>
                  <div style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => navigate(`/admin/users/${user.id}`)}>
                    {user.name || "N/A"}
                  </div>
                  <div style={{ wordBreak: "break-all" }}>{user.email}</div>
                  <div>{formatDate(user.created_at)}</div>
                  <div>{formatDateTime(user.last_login)}</div>

                  <div style={toggleBtn(user.is_admin)} onClick={() => toggleAdmin(user)}>
                    {user.is_admin ? "Revoke" : "Promote"}
                  </div>
                  <div style={toggleBtn(user.is_suspended)} onClick={() => toggleSuspend(user)}>
                    {user.is_suspended ? "Unsuspend" : "Suspend"}
                  </div>
                  <div style={dangerBtn} onClick={() => deleteUser(user)}>Delete</div>
                </div>
              ))}

              {users.length === 0 && (
                <div style={{ padding: "20px 0", color: "rgb(160,160,160)", textAlign: "center" }}>
                  No users found.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
