import { useState, useEffect } from "react";
import { apiRequest, clearUserSession } from "../utils/api.js";
import { userDataApi } from "../utils/userDataApi.js";

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

  const [settingsRecordId, setSettingsRecordId] = useState(null);
  const [settingsReady, setSettingsReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newUsername, setNewUsername] = useState(settings.username);
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteForm, setDeleteForm] = useState({ confirm: "", password: "" });
  const [notifications, setNotifications] = useState({ preferences: { workout_summaries: false, weekly_reports: false, product_updates: false }, delivery_configured: false });

  useEffect(() => {
    let active = true;
    apiRequest("/account/notifications").then((result) => active && setNotifications(result)).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    userDataApi.list("settings").then((records) => {
      if (!active) return;
      if (records.length) {
        setSettings(records[0].data.settings || records[0].data);
        setSettingsRecordId(records[0].id);
      }
      setSettingsReady(true);
    }).catch((err) => {
      if (active) { setNotice(err.message || "Unable to load saved settings."); setSettingsReady(true); }
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!settingsReady) return;
    localStorage.setItem("userSettings", JSON.stringify(settings));
    localStorage.setItem("username", settings.username);
    const save = async () => {
      try {
        const result = settingsRecordId
          ? await userDataApi.update("settings", settingsRecordId, { settings })
          : await userDataApi.create("settings", { settings });
        if (!settingsRecordId) setSettingsRecordId(result.id);
        setNotice("Settings saved.");
      } catch (err) { setNotice(err.message || "Unable to save settings."); }
    };
    save();
  }, [settings, settingsReady, settingsRecordId]);

  function updateSetting(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  async function saveUsername() {
    const name = newUsername.trim();
    if (!name) { setNotice("Username cannot be empty."); return; }
    setNotice("");
    try {
      const account = await apiRequest("/auth/me");
      await apiRequest(`/users/${account.id}`, { method: "PUT", body: { name } });
      updateSetting("username", name);
      setShowUsernameModal(false);
    } catch (err) { setNotice(err.message || "Unable to update username."); }
  }

  async function changePassword() {
    setNotice("");
    if (passwordForm.next !== passwordForm.confirm) { setNotice("New passwords do not match."); return; }
    try {
      await apiRequest("/account/change-password", { method: "POST", body: { current_password: passwordForm.current, new_password: passwordForm.next } });
      setPasswordForm({ current: "", next: "", confirm: "" });
      setShowPasswordModal(false);
      setNotice("Password updated.");
    } catch (err) { setNotice(err.message || "Unable to change password."); }
  }

  async function updateNotification(key, value) {
    const previous = notifications;
    setNotifications(prev => ({ ...prev, preferences: { ...prev.preferences, [key]: value } }));
    try {
      setNotifications(await apiRequest("/account/notifications", { method: "PUT", body: { [key]: value } }));
    } catch (err) { setNotifications(previous); setNotice(err.message || "Unable to save notification preference."); }
  }

  async function sendTestEmail() {
    try {
      const result = await apiRequest("/account/notifications/test", { method: "POST" });
      setNotice(result.sent ? "Test email sent." : result.delivery_configured ? "Test email failed to send." : "Email delivery is not configured on this server.");
    } catch (err) { setNotice(err.message || "Unable to send test email."); }
  }

  async function exportData() {
    setNotice("Preparing your export...");
    try {
      const data = await apiRequest("/account/export");
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "delphiafit-data.json"; link.click(); URL.revokeObjectURL(link.href);
      setNotice("Your data export has been downloaded.");
    } catch (err) { setNotice(err.message || "Unable to export account data."); }
  }

  async function deleteAccount() {
    try {
      await apiRequest("/account", { method: "DELETE", body: { confirm: deleteForm.confirm, password: deleteForm.password } });
      clearUserSession(); window.location.assign("/login");
    } catch (err) { setNotice(err.message || "Unable to delete account."); }
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
      {notice && <p role="status">{notice}</p>}

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
          Change Password
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

      <section style={{ marginTop: "30px" }}>
        <h2>Account Data</h2>
        <button style={btn} onClick={exportData}>Export My Data</button>
        <button style={{ ...btn, marginLeft: 10, backgroundColor: "#8b0000" }} onClick={() => setShowDeleteModal(true)}>Delete Account</button>
      </section>

      {/* EMAIL AUTOMATION */}
      <section style={{ marginTop: "40px" }}>
        <h2>Email Preferences</h2>
        <p>
          {notifications.delivery_configured
            ? "Preferences are saved to your account and emails are sent by this server."
            : "Email delivery is not configured on this server, so these preferences are saved to your account but no emails are sent yet."}
        </p>
        {notifications.delivery_configured && <button style={btn} onClick={sendTestEmail}>Send Test Email</button>}

        <label style={{ display: "block", marginTop: "10px" }}>
          <input
            type="checkbox"
            checked={!!notifications.preferences.workout_summaries}
            onChange={e => updateNotification("workout_summaries", e.target.checked)}
          />
          Send Workout Summaries
        </label>

        <label style={{ display: "block", marginTop: "10px" }}>
          <input
            type="checkbox"
            checked={!!notifications.preferences.weekly_reports}
            onChange={e => updateNotification("weekly_reports", e.target.checked)}
          />
          Send Weekly Progress Reports
        </label>

        <label style={{ display: "block", marginTop: "10px" }}>
          <input
            type="checkbox"
            checked={!!notifications.preferences.product_updates}
            onChange={e => updateNotification("product_updates", e.target.checked)}
          />
          Product Updates
        </label>
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
          <h3>Change Password</h3>
          <input type="password" placeholder="Current password" autoComplete="current-password" value={passwordForm.current} onChange={e => setPasswordForm(f => ({ ...f, current: e.target.value }))} style={input} />
          <input type="password" placeholder="New password (min 10 characters)" autoComplete="new-password" value={passwordForm.next} onChange={e => setPasswordForm(f => ({ ...f, next: e.target.value }))} style={input} />
          <input type="password" placeholder="Confirm new password" autoComplete="new-password" value={passwordForm.confirm} onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))} style={input} />

          <button style={btn} onClick={changePassword}>
            Update Password
          </button>

          <button
            style={{ ...btn, marginTop: "10px" }}
            onClick={() => setShowPasswordModal(false)}
          >
            Cancel
          </button>
        </Modal>
      )}

      {showDeleteModal && (
        <Modal>
          <h3>Delete Account</h3>
          <p style={{ marginTop: "10px" }}>This permanently deletes your account and all of your data. Type DELETE and enter your password to confirm.</p>
          <input placeholder="Type DELETE" aria-label="Type DELETE to confirm" value={deleteForm.confirm} onChange={e => setDeleteForm(f => ({ ...f, confirm: e.target.value }))} style={input} />
          <input type="password" placeholder="Password" aria-label="Password" autoComplete="current-password" value={deleteForm.password} onChange={e => setDeleteForm(f => ({ ...f, password: e.target.value }))} style={input} />
          <button style={{ ...btn, backgroundColor: "#8b0000" }} disabled={deleteForm.confirm !== "DELETE" || !deleteForm.password} onClick={deleteAccount}>
            Permanently Delete
          </button>
          <button style={btn} onClick={() => setShowDeleteModal(false)}>
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
