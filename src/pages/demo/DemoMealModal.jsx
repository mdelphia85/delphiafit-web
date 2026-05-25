import React from "react";

const DemoMealModal = ({ meal, onClose }) => {
  if (!meal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal demo-modal">
        <h2>Meal Preview</h2>

        <div className="modal-section">
          <h3>{meal.name}</h3>
          <p><strong>Category:</strong> {meal.category}</p>
          <p><strong>Calories:</strong> {meal.calories}</p>
          <p><strong>Protein:</strong> {meal.protein}g</p>
          <p><strong>Carbs:</strong> {meal.carbs}g</p>
          <p><strong>Fat:</strong> {meal.fat}g</p>
        </div>

        {/* INGREDIENTS */}
        <div className="modal-section">
          <h3>Ingredients</h3>
          <ul>
            {meal.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* INSTRUCTIONS */}
        {meal.instructions && (
          <div className="modal-section">
            <h3>Instructions</h3>
            <p>{meal.instructions}</p>
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

export default DemoMealModal;
