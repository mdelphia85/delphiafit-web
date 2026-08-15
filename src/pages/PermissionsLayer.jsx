import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function PermissionsLayer() {
  const { setMenuOpen } = useContext(MenuContext);
  const PERM_COLOR = "#7c3aed";

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#000",
        padding: "16px 16px 90px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        overflowY: "auto",
        color: "#fff"
      }}
    >
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: PERM_COLOR, fontSize: "28px", fontWeight: "700" }}>🔐 Permissions</div>
        </div>

        {[
          { role: "Admin", canEdit: true, canDelete: true, canInvite: true },
          { role: "Coach", canEdit: true, canDelete: false, canInvite: true },
          { role: "Athlete", canEdit: false, canDelete: false, canInvite: false }
        ].map((role, idx) => (
          <div
            key={idx}
            style={{
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "10px"
            }}
          >
            <div style={{ fontWeight: "600", marginBottom: "8px" }}>{role.role}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px" }}>
              <div style={{ color: role.canEdit ? "#6ee7b7" : "#999" }}>
                ✓ Edit Content
              </div>
              <div style={{ color: role.canDelete ? "#6ee7b7" : "#999" }}>
                ✓ Delete Content
              </div>
              <div style={{ color: role.canInvite ? "#6ee7b7" : "#999" }}>
                ✓ Invite Users
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "40px",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 16px",
          boxSizing: "border-box",
          zIndex: 20
        }}
      >
        <div
          style={{
            color: PERM_COLOR,
            fontSize: "18px",
            textDecoration: "underline",
            cursor: "pointer"
          }}
          onClick={() => setMenuOpen(true)}
        >
          Return to Menu
        </div>
      </div>
    </div>
  );
}
