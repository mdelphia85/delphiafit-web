import React from "react";

const Settings = ({ config, updateConfig }) => {
  return (
    <div className="admin-settings">

      <h1>Settings</h1>

      {/* Appearance */}
      <section className="settings-section">
        <h2>Appearance</h2>

        {/* Page Layout */}
        <div className="setting-group">
          <h3>Page Layout</h3>
          {["classic", "compact", "wide", "modular"].map(option => (
            <button
              key={option}
              className={config.appearance.pageLayout === option ? "active" : ""}
              onClick={() => updateConfig("appearance", "pageLayout", option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Theme */}
        <div className="setting-group">
          <h3>Theme</h3>
          {["light", "dark", "highContrast", "accent"].map(option => (
            <button
              key={option}
              className={config.appearance.theme === option ? "active" : ""}
              onClick={() => updateConfig("appearance", "theme", option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Density */}
        <div className="setting-group">
          <h3>Density</h3>
          {["spacious", "balanced", "dense"].map(option => (
            <button
              key={option}
              className={config.appearance.density === option ? "active" : ""}
              onClick={() => updateConfig("appearance", "density", option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Navigation Style */}
        <div className="setting-group">
          <h3>Navigation Style</h3>
          {["sidebar", "top", "minimal"].map(option => (
            <button
              key={option}
              className={config.appearance.navigation === option ? "active" : ""}
              onClick={() => updateConfig("appearance", "navigation", option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Widget Layout */}
        <div className="setting-group">
          <h3>Widget Arrangement</h3>
          {["grid", "stacked", "freeform"].map(option => (
            <button
              key={option}
              className={config.appearance.widgetLayout === option ? "active" : ""}
              onClick={() => updateConfig("appearance", "widgetLayout", option)}
            >
              {option}
            </button>
          ))}
        </div>

      </section>

    </div>
  );
};

export default Settings;
