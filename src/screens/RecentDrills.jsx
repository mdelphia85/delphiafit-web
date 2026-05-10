import React, { useEffect, useState } from "react";

export default function RecentDrills() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: replace this with your real backend call
    // Example: fetch("/api/drills").then(...)
    async function loadDrills() {
      try {
        // Placeholder: empty list for now
        const data = []; // replace with real data from backend
        setLogs(data.reverse()); // newest first
      } catch (e) {
        console.error("Failed to load drills", e);
      } finally {
        setLoading(false);
      }
    }

    loadDrills();
  }, []);

  if (loading) {
    return (
      <div className="recent-drills-screen">
        <h2>Recent Drills</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="recent-drills-screen">
      <h2>Recent Drills</h2>

      {logs.length === 0 && <p>No drills logged yet.</p>}

      {logs.map((log, idx) => (
        <div key={idx} className="log-entry">
          <div className="log-header">
            <strong>{log.sport}</strong> — {log.category}
          </div>
          <div className="log-body">
            {log.output}
          </div>
          <div className="log-time">
            {new Date(log.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
