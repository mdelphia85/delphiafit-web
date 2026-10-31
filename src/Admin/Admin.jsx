import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { adminFetch, ADMIN_TOKEN_KEY } from "./adminApi.js";
import { BG, BORDER, TEXT_MAIN, ACCENT } from "./adminTheme.js";

const SIDEBAR_BG = "rgb(15,15,15)";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Validate the admin session (token + current is_admin flag) on mount.
  useEffect(() => {
    adminFetch("/admin/me").catch((err) => {
      console.error("Admin auth check failed:", err);
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      navigate("/admin/login");
    });
  }, [navigate]);

  function isActive(path) {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
      ? { color: ACCENT, fontWeight: "600" }
      : {};
  }

  const layout = {
    display: "flex",
    width: "100vw",
    height: "100vh",
    backgroundColor: BG,
    color: TEXT_MAIN,
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
    color: TEXT_MAIN,
    padding: "6px 0",
    transition: "0.2s"
  };

  const content = {
    flex: 1,
    padding: "20px",
    overflowY: "auto"
  };

  function logout() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    navigate("/admin/login");
  }

  const items = [
    ["/admin/analytics", "Analytics"],
    ["/admin/announcements", "Announcements"],
    ["/admin/dashboard", "Dashboard"],
    ["/admin/logs", "Logs"],
    ["/admin/messages", "Messages"],
    ["/admin/users", "Users"],
  ];

  return (
    <div style={layout}>
      <div style={sidebar}>
        <div style={header}>Admin Panel</div>

        {items.map(([path, label]) => (
          <div key={path} style={{ ...link, ...isActive(path) }} onClick={() => navigate(path)}>
            {label}
          </div>
        ))}

        <div
          style={{ ...link, marginTop: "20px", color: ACCENT, fontWeight: "600" }}
          onClick={logout}
        >
          Log Out
        </div>
      </div>

      <div style={content}>{children}</div>
    </div>
  );
}
