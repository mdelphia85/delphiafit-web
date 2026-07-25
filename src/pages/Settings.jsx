import React, { useState, useEffect } from "react";

export default function Settings() {
  // Load saved settings or use defaults
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("userSettings");
    return saved
      ? JSON.parse(saved)
      : {
          username: localStorage.getItem("username") || "User",
          theme: "light",
          notifications: true,
          notificationFrequency: "daily",
          privacyMode: false
        };
  });

  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newUsername, setNewUsername] = useState(settings.username);

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    localStorage.setItem("username", settings.username);
  }, [settings]);

  function updateSetting(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  function saveUsername() {
    updateSetting("username", newUsername);
    setShowUsernameModal(false);
  }

  function sendPasswordResetLink() {
    // Backend integration later
    alert("A password reset link has been sent to your email.");
    setShowPasswordModal(false);
  }

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>User Settings</h1>

      {/* ACCOUNT */}
      <section style={{ marginTop: "20px" }}>
        <h2>Account</h2>

        <div style={{ marginTop: "10px" }}>
          <strong>Username:</strong> {settings.username}
        </div>

        <button style={btn} onClick={() => setShowUsernameModal(true)}>
          Change Username
        </button>

        <button style={{ ...btn, marginTop: "10px" }} onClick={() => setShowPasswordModal(true)}>
          Reset Password
        </button>
      </section>

      {/* THEME */}
      <section style={{ marginTop: "30px" }}>
        <h2>Theme</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          {["light", "dark", "highContrast", "blue", "red"].map(option => (
            <button
              key={option}
              onClick={() => updateSetting("theme", option)}
              style={{
                ...btn,
                backgroundColor: settings.theme === option ? "white" : "#333",
                color: settings.theme === option ? "black" : "white"
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      {/* NOTIFICATIONS */}
      <section style={{ marginTop: "30px" }}>
        <h2>Notifications</h2>

        <label style={{ display: "block", marginTop: "10px" }}>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={e => updateSetting("notifications", e.target.checked)}
          />
          Enable Notifications
        </label>

        {settings.notifications && (
          <div style={{ marginTop: "10px" }}>
            <strong>Frequency:</strong>
            <select
              value={settings.notificationFrequency}
              onChange={e => updateSetting("notificationFrequency", e.target.value)}
              style={{
                marginLeft: "10px",
                padding: "6px",
                borderRadius: "6px"
              }}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        )}
      </section>

      {/* PRIVACY */}
      <section style={{ marginTop: "30px" }}>
        <h2>Privacy</h2>
        <label style={{ display: "block", marginTop: "10px" }}>
          <input
            type="checkbox"
            checked={settings.privacyMode}
            onChange={e => updateSetting("privacyMode", e.target.checked)}
          />
          Enable Privacy Mode (hide sensitive data)
        </label>
      </section>

      {/* FUTURE FEATURES */}
      <section style={{ marginTop: "40px" }}>
        <h2>Coming Soon</h2>

        <div style={{ marginTop: "10px" }}>
          <strong>Connected Devices:</strong> Smart watches, heart rate monitors, hydration sensors
        </div>

        <div style={{ marginTop: "10px" }}>
          <strong>Workout Preferences:</strong> Customize workout tracking defaults
        </div>

        <div style={{ marginTop: "10px" }}>
          <strong>Meal Tracking Preferences:</strong> Auto‑log macros, preferred meal types
        </div>
      </section>

      {/* USERNAME MODAL */}
      {showUsernameModal && (
        <Modal>
          <h3>Change Username</h3>
          <input
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
            style={input}
          />
          <button style={btn} onClick={saveUsername}>Save</button>
          <button style={btn} onClick={() => setShowUsernameModal(false)}>Cancel</button>
        </Modal>
      )}

      {/* PASSWORD RESET MODAL */}
      {showPasswordModal && (
        <Modal>
          <h3>Reset Password</h3>
          <p style={{ marginTop: "10px" }}>
            We will send a secure password reset link to your email.
          </p>

          <button style={btn} onClick={sendPasswordResetLink}>
            Send Reset Link
          </button>

          <button style={{ ...btn, marginTop: "10px" }} onClick={() => setShowPasswordModal(false)}>
            Cancel
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const btn = {
  padding: "10px",
  backgroundColor: "#444",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer",
  border: "none"
};

const input = {
  padding: "10px",
  marginTop: "10px",
  width: "100%",
  borderRadius: "6px"
};

function Modal({ children }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#222",
        padding: "20px",
        borderRadius: "10px",
        zIndex: 999999,
        color: "white",
        minWidth: "300px"
      }}
    >
      {children}
    </div>
  );
}
