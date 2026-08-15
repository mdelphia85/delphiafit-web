import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const initialCertifications = [
  { id: 1, name: "Fire Academy Level I", status: "Completed", date: "2026-06-15", organization: "State Fire Marshal", verified: true },
  { id: 2, name: "Police Academy Level I", status: "In Progress", progress: 65, date: null, organization: "State Police", verified: false },
  { id: 3, name: "EMS Paramedic", status: "Completed", date: "2026-03-20", organization: "National Registry", verified: true },
  { id: 4, name: "Military Combatives Certified", status: "Completed", date: "2026-05-10", organization: "Armed Forces", verified: true },
  { id: 5, name: "SOF Selection Qualified", status: "In Progress", progress: 42, date: null, organization: "SOCOM", verified: false },
  { id: 6, name: "SWAT Operator Certification", status: "Not Started", progress: 0, date: null, organization: "State Police", verified: false }
];

export default function CertificationsTracker() {
  const { setMenuOpen } = useContext(MenuContext);
  const [certs, setCerts] = useState(() => readJson("certifications", initialCertifications));
  const [filter, setFilter] = useState("all");
  const TACTICAL_COLOR = "#2d5f3a";

  useEffect(() => writeJson("certifications", certs), [certs]);

  const filteredCerts = certs.filter((cert) => {
    if (filter === "all") return true;
    return cert.status === filter;
  });

  const completed = certs.filter((c) => c.status === "Completed").length;
  const inProgress = certs.filter((c) => c.status === "In Progress").length;

  const getStatusColor = (status) => {
    if (status === "Completed") return "#10b981";
    if (status === "In Progress") return "#f59e0b";
    return "#6b7280";
  };

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: "#000", padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: "#fff" }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>🏆 Certifications</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>Achievement Tracking</div>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <button onClick={() => setFilter("all")} style={{ flex: 1, padding: "8px", background: filter === "all" ? TACTICAL_COLOR : "#222", color: filter === "all" ? "black" : "white", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer", fontSize: "12px" }}>
            All ({certs.length})
          </button>
          <button onClick={() => setFilter("Completed")} style={{ flex: 1, padding: "8px", background: filter === "Completed" ? TACTICAL_COLOR : "#222", color: filter === "Completed" ? "black" : "white", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer", fontSize: "12px" }}>
            Complete ({completed})
          </button>
          <button onClick={() => setFilter("In Progress")} style={{ flex: 1, padding: "8px", background: filter === "In Progress" ? TACTICAL_COLOR : "#222", color: filter === "In Progress" ? "black" : "white", border: "none", borderRadius: "6px", fontWeight: "700", cursor: "pointer", fontSize: "12px" }}>
            Progress ({inProgress})
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredCerts.map((cert) => (
            <div key={cert.id} style={{ background: "#111", border: `1px solid ${getStatusColor(cert.status)}`, borderRadius: "10px", padding: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>{cert.name}</div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <div style={{ color: getStatusColor(cert.status), fontSize: "11px", fontWeight: "700" }}>{cert.status}</div>
                  {cert.verified && <div style={{ color: "#10b981", fontSize: "14px" }}>✓</div>}
                </div>
              </div>

              <div style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}>
                <div>{cert.organization}</div>
              </div>

              {cert.status === "In Progress" && (
                <div style={{ background: "#000", borderRadius: "6px", padding: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <div style={{ fontSize: "11px", color: "#999" }}>Progress</div>
                    <div style={{ fontSize: "11px", color: TACTICAL_COLOR, fontWeight: "700" }}>{cert.progress}%</div>
                  </div>
                  <div style={{ width: "100%", height: "4px", background: "#333", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: `${cert.progress}%`, height: "100%", background: TACTICAL_COLOR }}></div>
                  </div>
                </div>
              )}

              {cert.status === "Completed" && (
                <div style={{ fontSize: "12px", color: "#999" }}>Awarded: {cert.date}</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", padding: "12px", background: "#111", border: `1px solid ${TACTICAL_COLOR}`, borderRadius: "10px", fontSize: "13px", color: "#ccc" }}>
          <div style={{ color: TACTICAL_COLOR, fontWeight: "700", marginBottom: "8px" }}>Summary</div>
          <div>Total Certifications: {certs.length}</div>
          <div style={{ color: "#10b981", marginTop: "4px" }}>Completed: {completed}</div>
          <div style={{ color: "#f59e0b", marginTop: "4px" }}>In Progress: {inProgress}</div>
        </div>
      </div>

      <div onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", color: TACTICAL_COLOR, fontSize: "22px", textDecoration: "underline", cursor: "pointer", zIndex: 20 }}>
        Return to Menu
      </div>
    </div>
  );
}
