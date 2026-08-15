import { useEffect, useState } from "react";

export default function RecentDrills() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDrills() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLogs([]);
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/drills/recent`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Unable to load recent drills.");

        const data = await res.json();
        setLogs((data.logs || data).slice().reverse());
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
