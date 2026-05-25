import React from "react";

const DemoProgressModal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal demo-modal">
        <h2>Progress Preview</h2>

        <div className="modal-section">
          <h3>Weekly Summary</h3>
          <ul>
            {data.weekly.map((item, index) => (
              <li key={index}>
                <strong>{item.day}:</strong> {item.score}
              </li>
            ))}
          </ul>
        </div>

        <div className="modal-section">
          <h3>Notes</h3>
          <p>{data.notes}</p>
        </div>

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

export default DemoProgressModal;
