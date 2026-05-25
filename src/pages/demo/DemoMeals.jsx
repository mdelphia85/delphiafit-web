import React from "react";
import demoMeals from "../../demo/demoMeals.js";

export default function DemoMeals() {
  return (
    <div style={{ padding: 20, minHeight: "100vh", background: "#f4f6f8" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h1>Meals (Demo Mode)</h1>
        <p style={{ marginBottom: 20, color: "#555" }}>
          This is a read‑only preview. Creating, editing, and logging meals are disabled.
        </p>

        {demoMeals.map((meal, index) => (
          <div
            key={index}
            style={{
              padding: 16,
              borderRadius: 10,
              background: "#fff",
              border: "1px solid #e5e7eb",
              marginBottom: 14
            }}
          >
            <h3 style={{ margin: 0 }}>{meal.name}</h3>

            <p style={{ margin: "6px 0" }}>
              <strong>Category:</strong> {meal.category}
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Calories:</strong> {meal.calories}
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Protein:</strong> {meal.protein}g
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Carbs:</strong> {meal.carbs}g
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Fats:</strong> {meal.fat}g
            </p>

            <p style={{ marginTop: 10 }}>
              <strong>Ingredients:</strong>
            </p>
            <ul>
              {meal.ingredients.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <p style={{ marginTop: 10 }}>
              <strong>Instructions:</strong> {meal.instructions}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
