import React, { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const clientList = [
  { id: 1, name: "Alex Johnson", status: "Active", joinDate: "2026-06-15", email: "alex@example.com" },
  { id: 2, name: "Sarah Chen", status: "Active", joinDate: "2026-05-20", email: "sarah@example.com" },
  { id: 3, name: "Mike Davis", status: "Paused", joinDate: "2026-04-10", email: "mike@example.com" }
];

export default function ClientManagement() {
  const { setMenuOpen } = useContext(MenuContext);
  const [clients, setClients] = useState(clientList);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newClientEmail, setNewClientEmail] = useState("");

  const COACH_COLOR = "#ec4899";
  const BLACK = "#000";
  const WHITE = "#fff";

  const handleInviteClient = () => {
    if (newClientEmail.trim()) {
      alert(`Invitation sent to ${newClientEmail}`);
      setNewClientEmail("");
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: BLACK,
        padding: "16px 16px 90px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        overflowY: "auto",
        color: WHITE
      }}
    >
      <div style={{ width: "360px", maxWidth: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: COACH_COLOR, fontSize: "28px", fontWeight: "700" }}>👥 Clients</div>
        </div>

        {!selectedClient ? (
          <>
            {/* Add Client Form */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "12px", color: "#999", marginBottom: "6px", display: "block" }}>
                Invite New Client
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="client@example.com"
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "#111",
                    border: `1px solid #2a2a2a`,
                    borderRadius: "8px",
                    color: WHITE,
                    fontSize: "12px",
                    boxSizing: "border-box"
                  }}
                />
                <button
                  onClick={handleInviteClient}
                  style={{
                    padding: "10px 16px",
                    background: COACH_COLOR,
                    color: BLACK,
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Invite
                </button>
              </div>
            </div>

            {/* Client List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {clients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  style={{
                    background: "#111",
                    border: `1px solid #2a2a2a`,
                    borderRadius: "12px",
                    padding: "14px",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = COACH_COLOR)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <div style={{ fontWeight: "600" }}>{client.name}</div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: client.status === "Active" ? "#6ee7b7" : "#fbbf24",
                        fontWeight: "600"
                      }}
                    >
                      {client.status}
                    </div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#999" }}>{client.email}</div>
                  <div style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>
                    Joined {client.joinDate}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Client Detail */}
            <button
              onClick={() => setSelectedClient(null)}
              style={{
                padding: "12px",
                background: "#222",
                color: WHITE,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                marginBottom: "20px",
                width: "100%"
              }}
            >
              ← Back
            </button>

            <div
              style={{
                background: "#111",
                border: `1px solid ${COACH_COLOR}`,
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "20px"
              }}
            >
              <div style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px", color: COACH_COLOR }}>
                {selectedClient.name}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                <div>
                  <div style={{ color: "#999", fontSize: "12px" }}>Email</div>
                  <div>{selectedClient.email}</div>
                </div>
                <div>
                  <div style={{ color: "#999", fontSize: "12px" }}>Status</div>
                  <div>{selectedClient.status}</div>
                </div>
                <div>
                  <div style={{ color: "#999", fontSize: "12px" }}>Joined</div>
                  <div>{selectedClient.joinDate}</div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                style={{
                  padding: "12px",
                  background: COACH_COLOR,
                  color: BLACK,
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                View Progress
              </button>
              <button
                style={{
                  padding: "12px",
                  background: "#222",
                  color: WHITE,
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Assign Program
              </button>
              <button
                style={{
                  padding: "12px",
                  background: "#333",
                  color: "#f87171",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Remove Client
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "40px",
          background: BLACK,
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
            color: COACH_COLOR,
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
