import { useEffect, useState } from "react";
import AdminLayout from "./Admin.jsx";

export default function AdminUsers() {
  const BG = "rgb(0,0,0)";
  const CARD_BG = "rgb(15,15,15)";
  const BORDER = "rgb(60,60,60)";
  const TEXT_MAIN = "rgb(240,240,240)";
  const TEXT_MUTED = "rgb(160,160,160)";
  const ACCENT = "rgb(128,0,128)";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ Fetch REAL users from backend
  useEffect(() => {
    async function loadUsers() {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const json = await res.json();
        setUsers(json.users || json);
      } catch (err) {
        console.error("Failed to load users:", err);
      }

      setLoading(false);
    }

    loadUsers();
  }, []);

  // ⭐ Promote / demote admin (REAL backend)
  async function toggleAdmin(id, current) {
    const token = localStorage.getItem("adminToken");

    await fetch(
      `${import.meta.env.VITE_API_URL}/admin/users/${id}/admin`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setUsers(prev =>
      prev.map(u =>
        u.id === id ? { ...u, is_admin: !current } : u
      )
    );
  }

  // ⭐ Delete user (REAL backend)
  async function deleteUser(id) {
    const token = localStorage.getItem("adminToken");

    await fetch(
      `${import.meta.env.VITE_API_URL}/admin/users/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setUsers(prev => prev.filter(u => u.id !== id));
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

  const tableHeader = {
    display: "grid",
    gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr auto auto",
    padding: "10px 0",
    borderBottom: `1px solid ${BORDER}`,
    fontWeight: "600",
    fontSize: "14px"
  };

  const tableRow = {
    display: "grid",
    gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr auto auto",
    padding: "10px 0",
    borderBottom: `1px solid ${BORDER}`,
    fontSize: "14px"
  };

  const adminBtn = isAdmin => ({
    padding: "6px 12px",
    borderRadius: "6px",
    border: `1px solid ${isAdmin ? ACCENT : BORDER}`,
    backgroundColor: isAdmin ? ACCENT : CARD_BG,
    color: isAdmin ? "white" : TEXT_MAIN,
    cursor: "pointer",
    fontSize: "13px",
    textAlign: "center"
  });

  const deleteBtn = {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid red",
    backgroundColor: "transparent",
    color: "red",
    cursor: "pointer",
    fontSize: "13px",
    textAlign: "center"
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: "20px", color: TEXT_MAIN }}>Loading users...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={container}>
        {/* HEADER */}
        <div>
          <div style={title}>Admin Users</div>
          <div style={subtitle}>Manage all user accounts, roles, and access.</div>
        </div>

        {/* USERS TABLE */}
        <div style={card}>
          <div style={tableHeader}>
            <div>Name</div>
            <div>Email</div>
            <div>Created</div>
            <div>Last Login</div>
            <div>Admin</div>
            <div>Delete</div>
          </div>

          {users.map(user => (
            <div key={user.id} style={tableRow}>
              <div>{user.name || "N/A"}</div>
              <div>{user.email}</div>
              <div>{user.created_at?.split("T")[0] || "—"}</div>
              <div>{user.last_login || "—"}</div>

              <div
                style={adminBtn(user.is_admin)}
                onClick={() => toggleAdmin(user.id, user.is_admin)}
              >
                {user.is_admin ? "Revoke" : "Promote"}
              </div>

              <div
                style={deleteBtn}
                onClick={() => deleteUser(user.id)}
              >
                Delete
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div style={{ padding: "20px 0", color: TEXT_MUTED, textAlign: "center" }}>
              No users found.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
