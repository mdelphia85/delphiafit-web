import React from "react";

const DemoWorkoutModal = ({ workout, onClose }) => {
  if (!workout) return null;

  return (
    <div className="modal-overlay">
      <div className="modal demo-modal">
        <h2>Workout Preview</h2>

        <div className="modal-section">
          <h3>{workout.name}</h3>
          <p><strong>Category:</strong> {workout.category}</p>
          <p><strong>Duration:</strong> {workout.duration}</p>
          <p><strong>Intensity:</strong> {workout.intensity}</p>
        </div>

        {/* EXERCISES */}
        <div className="modal-section">
          <h3>Exercises</h3>
          <ul>
            {workout.exercises.map((ex, index) => (
              <li key={index}>
                <strong>{ex.name}</strong> — {ex.sets} sets × {ex.reps} reps
              </li>
            ))}
          </ul>
        </div>

        {/* NOTES */}
        {workout.notes && (
          <div className="modal-section">
            <h3>Notes</h3>
            <p>{workout.notes}</p>
          </div>
        )}

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

export default DemoWorkoutModal;
