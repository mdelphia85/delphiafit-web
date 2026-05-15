import { useState } from "react";
import AdminLayout from "./Admin.jsx";

export default function AdminUsers() {
  const BG = "rgb(0,0,0)";
  const CARD_BG = "rgb(15,15,15)";
  const BORDER = "rgb(60,60,60)";
  const TEXT_MAIN = "rgb(240,240,240)";
  const TEXT_MUTED = "rgb(160,160,160)";
  const ACCENT = "rgb(128,0,128)";

  // ⭐ Static UI-only users (NOT backend)
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      created: "2026-04-01",
      lastLogin: "2026-05-12 14:22",
      isAdmin: false
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@example.com",
      created: "2026-03-18",
      lastLogin: "2026-05-12 11:10",
      isAdmin: true
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      created: "2026-02-10",
      lastLogin: "2026-05-11 19:45",
      isAdmin: false
    }
  ]);

  function toggleAdmin(id) {
    setUsers(prev =>
      prev.map(u =>
        u.id === id ? { ...u, isAdmin: !u.isAdmin } : u
      )
    );
  }

  function deleteUser(id) {
    setUsers(prev => prev.filter(u => u.id !== id));
  }

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
              <div>{user.name}</div>
              <div>{user.email}</div>
              <div>{user.created}</div>
              <div>{user.lastLogin}</div>

              <div
                style={adminBtn(user.isAdmin)}
                onClick={() => toggleAdmin(user.id)}
              >
                {user.isAdmin ? "Revoke" : "Promote"}
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
