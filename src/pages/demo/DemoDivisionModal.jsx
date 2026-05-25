import React from "react";
import demoTactical from "../../demo/demoTactical";

const DemoDivisionModal = ({ division, drill, onClose, onReplace }) => {
  if (!drill) return null;

  const divisionNameMap = {
    fire: "Firefighters",
    ems: "EMS",
    military: "Military",
    police: "Police",
  };

  const title = divisionNameMap[division] || "Division";

  const handleTryAnother = () => {
    const drills = demoTactical[division];
    const random = drills[Math.floor(Math.random() * drills.length)];
    onReplace(random);
  };

  return (
    <div className="modal-overlay">
      <div className="modal demo-modal">
        <h2>{title} Drill Preview</h2>

        <div className="modal-section">
          <h3>{drill.title}</h3>
          <p><strong>Duration:</strong> {drill.duration}</p>
          <p><strong>Level:</strong> {drill.level}</p>
        </div>

        {/* DIVISION‑SPECIFIC FIELDS */}
        <div className="modal-section">
          {division === "fire" && (
            <>
              <p><strong>Fire Type:</strong> {drill.fireType}</p>
              <p><strong>Environment:</strong> {drill.environment}</p>
            </>
          )}

          {division === "ems" && (
            <>
              <p><strong>Medical Load:</strong> {drill.medicalLoad}</p>
              <p><strong>Patient Type:</strong> {drill.patientType}</p>
            </>
          )}

          {division === "military" && (
            <>
              <p><strong>Terrain:</strong> {drill.terrain}</p>
              <p><strong>Loadout:</strong> {drill.loadout}</p>
            </>
          )}

          {division === "police" && (
            <>
              <p><strong>Threat Level:</strong> {drill.threatLevel}</p>
              <p><strong>Scenario Type:</strong> {drill.scenarioType}</p>
            </>
          )}
        </div>

        {/* UNIVERSAL FIELDS */}
        <div className="modal-section">
          <p><strong>Equipment:</strong> {drill.equipment}</p>
          <p><strong>Description:</strong></p>
          <p>{drill.description}</p>
        </div>

        {/* TRY ANOTHER DRILL BUTTON */}
        <button className="demo-alt-btn" onClick={handleTryAnother}>
          Try Another {title} Drill
        </button>

        {/* SWITCH TO REAL APP BUTTON */}
        <button
          className="demo-real-btn"
          onClick={() => (window.location.href = "/register")}
        >
          Switch to Real App
        </button>

        {/* DEMO MODE NOTICE */}
        <div className="demo-warning">
          <p>This is a read‑only preview. Demo mode does not allow saving or editing.</p>
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default DemoDivisionModal;

