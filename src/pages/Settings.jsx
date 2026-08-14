import React, { useState, useEffect } from "react";

export default function Settings() {
  // Load saved settings or use defaults
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("userSettings");
    return saved
      ? JSON.parse(saved)
      : {
          username: localStorage.getItem("username") || "User",

          // Phase 3: Themes
          theme: "light",

          // Phase 3: Layout Density
          layoutDensity: "comfortable",

          // Phase 3: Default Modes
          defaultWorkoutMode: "generator",
          defaultSportsMode: "generator",
          defaultMealsMode: "manual",

          // Phase 3: Notifications
          notifications: true,
          notificationFrequency: "daily",

          // Phase 3: Privacy
          privacyMode: false,

          // Phase 3: Affiliate Program
          referrals: 0,
          earnings: 0,

          // Phase 3: Referral Analytics
          clicks: 0,
          signups: 0,
          conversionRate: "0%",

          // Phase 3: Email Automation
          emailSummaries: false,
          emailReports: false,
          emailFrequency: "weekly"
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
    alert("A password reset link has been sent to your email.");
    setShowPasswordModal(false);
  }

  // Apply theme + density to this screen only (Phase 3 scope)
  const themeStyles = {
    light: { backgroundColor: "#f5f5f5", color: "#000" },
    dark: { backgroundColor: "#000", color: "#fff" },
    highContrast: { backgroundColor: "#000", color: "#ff0" },
    blue: { backgroundColor: "#001f3f", color: "#fff" },
    red: { backgroundColor: "#3f0000", color: "#fff" }
  };

  const densityPadding =
    settings.layoutDensity === "compact"
      ? "6px"
      : settings.layoutDensity === "spacious"
      ? "20px"
      : "12px";

  return (
    <div
      style={{
        padding: densityPadding,
        minHeight: "100vh",
        ...themeStyles[settings.theme]
      }}
    >
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

        <button
          style={{ ...btn, marginTop: "10px" }}
          onClick={() => setShowPasswordModal(true)}
        >
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
                backgroundColor:
                  settings.theme === option ? "white" : "#333",
                color: settings.theme === option ? "black" : "white"
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      {/* LAYOUT DENSITY */}
      <section style={{ marginTop: "30px" }}>
        <h2>Layout Density</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          {["compact", "comfortable", "spacious"].map(option => (
            <button
              key={option}
              onClick={() => updateSetting("layoutDensity", option)}
              style={{
                ...btn,
                backgroundColor:
                  settings.layoutDensity === option ? "white" : "#333",
                color:
                  settings.layoutDensity === option ? "black" : "white"
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      {/* DEFAULT MODES */}
      <section style={{ marginTop: "30px" }}>
        <h2>Default Modes</h2>

        <div style={{ marginTop: "10px" }}>
          <strong>Workouts:</strong>
          <select
            value={settings.defaultWorkoutMode}
            onChange={e =>
              updateSetting("defaultWorkoutMode", e.target.value)
            }
            style={input}
          >
            <option value="generator">Generator</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        <div style={{ marginTop: "10px" }}>
          <strong>Sports:</strong>
          <select
            value={settings.defaultSportsMode}
            onChange={e =>
              updateSetting("defaultSportsMode", e.target.value)
            }
            style={input}
          >
            <option value="generator">Generator</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        <div style={{ marginTop: "10px" }}>
          <strong>Meals:</strong>
          <select
            value={settings.defaultMealsMode}
            onChange={e =>
              updateSetting("defaultMealsMode", e.target.value)
            }
            style={input}
          >
            <option value="manual">Manual</option>
            <option value="generator">Generator</option>
          </select>
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
              onChange={e =>
                updateSetting("notificationFrequency", e.target.value)
              }
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

      {/* AFFILIATE PROGRAM */}
      <section style={{ marginTop: "40px" }}>
        <h2>Affiliate Program</h2>

        <div style={{ marginTop: "10px" }}>
          <strong>Your Referral Link:</strong>
          <div
            style={{
              marginTop: "6px",
              padding: "10px",
              background: "#333",
              borderRadius: "6px"
            }}
          >
            https://delphiafit.com/ref/{settings.username}
          </div>
        </div>

        <div style={{ marginTop: "10px" }}>
          <strong>Referrals:</strong> {settings.referrals}
        </div>

        <div style={{ marginTop: "10px" }}>
          <strong>Earnings:</strong> ${settings.earnings}
        </div>
      </section>

      {/* REFERRAL ANALYTICS */}
      <section style={{ marginTop: "40px" }}>
        <h2>Referral Analytics</h2>

        <div style={{ marginTop: "10px" }}>
          <strong>Clicks:</strong> {settings.clicks}
        </div>

        <div style={{ marginTop: "10px" }}>
          <strong>Signups:</strong> {settings.signups}
        </div>

        <div style={{ marginTop: "10px" }}>
          <strong>Conversion Rate:</strong> {settings.conversionRate}
        </div>
      </section>

      {/* EMAIL AUTOMATION */}
      <section style={{ marginTop: "40px" }}>
        <h2>Email Automation</h2>

        <label style={{ display: "block", marginTop: "10px" }}>
          <input
            type="checkbox"
            checked={settings.emailSummaries}
            onChange={e => updateSetting("emailSummaries", e.target.checked)}
          />
          Send Workout Summaries
        </label>

        <label style={{ display: "block", marginTop: "10px" }}>
          <input
            type="checkbox"
            checked={settings.emailReports}
            onChange={e => updateSetting("emailReports", e.target.checked)}
          />
          Send Weekly Progress Reports
        </label>

        <div style={{ marginTop: "10px" }}>
          <strong>Frequency:</strong>
          <select
            value={settings.emailFrequency}
            onChange={e =>
              updateSetting("emailFrequency", e.target.value)
            }
            style={input}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
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
          <button style={btn} onClick={saveUsername}>
            Save
          </button>
          <button style={btn} onClick={() => setShowUsernameModal(false)}>
            Cancel
          </button>
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

          <button
            style={{ ...btn, marginTop: "10px" }}
            onClick={() => setShowPasswordModal(false)}
          >
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
