import React from "react";
import { useNavigate } from "react-router-dom";
import DemoBanner from "../../components/DemoBanner";
import DemoNav from "../../components/DemoNav";
import demoMeals from "../../demo/demoMeals.js";

export default function DemoMeals() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20, minHeight: "100vh", background: "#f4f6f8" }}>
      <DemoBanner />

      <div style={{ maxWidth: 980, margin: "0 auto" }}>

        {/* REUSABLE NAVIGATION */}
        <DemoNav current="meals" />

        <h1>Meals (Demo Mode)</h1>
        <p style={{ marginBottom: 20, color: "#555" }}>
          This is a read‑only preview. Meal creation and editing are disabled.
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
            <p><strong>Calories:</strong> {meal.calories}</p>
            <p><strong>Protein:</strong> {meal.protein}g</p>
            <p><strong>Carbs:</strong> {meal.carbs}g</p>
            <p><strong>Fat:</strong> {meal.fat}g</p>
          </div>
        ))}
      </div>
    </div>
  );
}
