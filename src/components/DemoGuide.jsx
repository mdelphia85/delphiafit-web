import React from "react";

const DemoGuide = ({ step, onNext, onClose }) => {
  const steps = [
    {
      id: 1,
      title: "Dashboard Preview",
      text: "This is your read‑only dashboard. Tap any card to preview workouts, meals, drills, or progress."
    },
    {
      id: 2,
      title: "Workout Preview",
      text: "Tap the workout card to see how training sessions are structured."
    },
    {
      id: 3,
      title: "Meal Preview",
      text: "Tap the meal card to explore nutrition planning and meal structure."
    },
    {
      id: 4,
      title: "Tactical Drills",
      text: "Tap the tactical card to preview drills for Fire, EMS, Military, and Police."
    },
    {
      id: 5,
      title: "Progress Tracking",
      text: "Tap the progress card to see how performance analytics look."
    }
  ];

  const current = steps.find(s => s.id === step);
  if (!current) return null;

  return (
    <div className="guide-overlay">
      <div className="guide-box">
        <h3>{current.title}</h3>
        <p>{current.text}</p>

        {/* ⭐ Progress Dots */}
        <div className="guide-dots">
          {steps.map((s) => (
            <span
              key={s.id}
              className={`guide-dot ${s.id === step ? "active" : ""}`}
            ></span>
          ))}
        </div>

        <div className="guide-actions">
          {step < steps.length && (
            <button className="guide-next" onClick={onNext}>
              Next
            </button>
          )}

          {step === steps.length && (
            <button className="guide-next" onClick={onClose}>
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoGuide;

