import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const BG = "rgb(0,0,0)";
  const SIDEBAR_BG = "rgb(15,15,15)";
  const BORDER = "rgb(60,60,60)";
  const TEXT = "rgb(240,240,240)";
  const ACCENT = "rgb(128,0,128)";

  // ⭐ Admin token check (frontend only)
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  const layout = {
    display: "flex",
    width: "100vw",
    height: "100vh",
    backgroundColor: BG,
    color: TEXT,
    overflow: "hidden"
  };

  const sidebar = {
    width: "220px",
    backgroundColor: SIDEBAR_BG,
    borderRight: `1px solid ${BORDER}`,
    padding: "20px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  };

  const header = {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "10px",
    color: ACCENT
  };

  const link = {
    fontSize: "16px",
    cursor: "pointer",
    color: TEXT,
    padding: "6px 0"
  };

  const content = {
    flex: 1,
    padding: "20px",
    overflowY: "auto"
  };

  function go(path) {
    navigate(path);
  }

  function logout() {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

  return (
    <div style={layout}>
      {/* SIDEBAR */}
      <div style={sidebar}>
        <div style={header}>Admin Panel</div>

        <div style={link} onClick={() => go("/admin/analytics")}>Analytics</div>
        <div style={link} onClick={() => go("/admin/announcements")}>Announcements</div>
        <div style={link} onClick={() => go("/admin/dashboard")}>Dashboard</div>
        <div style={link} onClick={() => go("/admin/logs")}>Login Logs</div>
        <div style={link} onClick={() => go("/admin/logs")}>Logs</div>
        <div style={link} onClick={() => go("/admin/messages")}>Messages</div>
        <div style={link} onClick={() => go("/admin/users")}>Users</div>

        <div
          style={{ ...link, marginTop: "20px", color: ACCENT }}
          onClick={logout}
        >
          Log Out
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={content}>{children}</div>
    </div>
  );
}
