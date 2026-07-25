import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import AdminLayout from "./admin"; // your layout file
import Dashboard from "./dashboard";
import Analytics from "./analytics";
import Announcements from "./announcements";
import Logs from "./logs";
import Messages from "./messages";
import Users from "./users";
import Settings from "./settings";

export default function AdminIndex() {
  // ⭐ Global admin config state
  const [config, setConfig] = useState({
    appearance: {
      pageLayout: "classic",
      theme: "dark",
      density: "balanced",
      navigation: "sidebar",
      widgetLayout: "grid"
    }
  });

  // ⭐ Update config from settings.jsx
  const updateConfig = (category, key, value) => {
    setConfig(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  return (
    <AdminLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/users" element={<Users />} />

        {/* ⭐ SETTINGS PAGE */}
        <Route
          path="/settings"
          element={<Settings config={config} updateConfig={updateConfig} />}
        />
      </Routes>
    </AdminLayout>
  );
}
