import { useContext, useState, useEffect } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

import {
  generateDailyMeals,
  generateGoToMeals,
  useGoToMealsToday,
  saveGoToMeals,
  loadGoToMeals
} from "../generators/mealGenerator.js";

export default function Meals() {
  const { openMenu } = useContext(MenuContext);
  const orange = "rgb(255, 140, 0)";

  const [meals, setMeals] = useState({
    breakfast: { protein: "", carbs: "", veggies: "" },
    snack1: { protein: "", carbs: "", veggies: "" },
    lunch: { protein: "", carbs: "", veggies: "" },
    snack2: { protein: "", carbs: "", veggies: "" },
    dinner: { protein: "", fats: "", veggies: "" },

    goToBreakfast: { protein: "", carbs: "", veggies: "" },
    goToLunch: { protein: "", carbs: "", veggies: "" },
    goToDinner: { protein: "", fats: "", veggies: "" }
  });

  useEffect(() => {
    const saved = loadGoToMeals();
    if (saved) {
      setMeals(prev => ({ ...prev, ...saved }));
    }
  }, []);

  const sectionHeader = {
    fontSize: "20px",
    color: orange,
    marginTop: "12px",
    marginBottom: "4px",
    textAlign: "left"
  };

  const row = {
    display: "flex",
    gap: "8px",
    marginBottom: "10px"
  };

  const col = {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  };

  const label = {
    color: orange,
    fontSize: "16px",
    marginBottom: "2px",
    textAlign: "center"
  };

  const input = {
    border: `2px solid ${orange}`,
    background: "black",
    color: orange,
    padding: "6px",
    fontSize: "16px",
    borderRadius: "0px",
    textAlign: "center"
  };

  const generatorItem = {
    fontSize: "18px",
    color: orange,
    textDecoration: "underline",
    cursor: "pointer",
    marginBottom: "6px",
    textAlign: "left"
  };

  function getPortionLabel(field) {
    if (field === "protein") return "Protein (palm)";
    if (field === "carbs") return "Carb (fist)";
    if (field === "veggies") return "Veggie (fist)";
    if (field === "fats") return "Fats (thumb)";
    return field;
  }

  function updateMeal(section, field, value) {
    setMeals(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
        overflowY: "auto",
        padding: "12px",
        paddingBottom: "140px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <h1
          style={{
            textAlign: "center",
            color: orange,
            marginBottom: "10px",
            fontSize: "24px"
          }}
        >
          Meals
        </h1>

        {[
          ["Breakfast", "breakfast", ["protein", "carbs", "veggies"]],
          ["Snack 1", "snack1", ["protein", "carbs", "veggies"]],
          ["Lunch", "lunch", ["protein", "carbs", "veggies"]],
          ["Snack 2", "snack2", ["protein", "carbs", "veggies"]],
          ["Dinner", "dinner", ["protein", "fats", "veggies"]],
          ["Go To Breakfast", "goToBreakfast", ["protein", "carbs", "veggies"]],
          ["Go To Lunch", "goToLunch", ["protein", "carbs", "veggies"]],
          ["Go To Dinner", "goToDinner", ["protein", "fats", "veggies"]]
        ].map(([title, key, fields]) => (
          <div key={key}>
            <div style={sectionHeader}>{title}</div>
            <div style={row}>
              {fields.map(field => (
                <div style={col} key={field}>
                  <div style={label}>{getPortionLabel(field)}</div>
                  <input
                    style={input}
                    value={meals[key][field]}
                    onChange={e => updateMeal(key, field, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginTop: "12px" }}>
          <div
            style={generatorItem}
            onClick={() => {
              const generated = generateDailyMeals();
              setMeals(prev => ({ ...prev, ...generated }));
            }}
          >
            Generate Daily Meals
          </div>

          <div
            style={generatorItem}
            onClick={() => {
              const goTo = generateGoToMeals();
              setMeals(prev => ({ ...prev, ...goTo }));
            }}
          >
            Generate Go-To Meals
          </div>

          <div
            style={generatorItem}
            onClick={() => {
              const applied = useGoToMealsToday({
                goToBreakfast: meals.goToBreakfast,
                goToLunch: meals.goToLunch,
                goToDinner: meals.goToDinner
              });
              setMeals(prev => ({ ...prev, ...applied }));
            }}
          >
            Use Go-To Meals Today
          </div>

          <div
            style={generatorItem}
            onClick={() => {
              saveGoToMeals({
                goToBreakfast: meals.goToBreakfast,
                goToLunch: meals.goToLunch,
                goToDinner: meals.goToDinner
              });
            }}
          >
            Save Go-To Meals
          </div>
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "56px",
          background: "black",
          // borderTop removed – this was the orange bar
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          boxSizing: "border-box",
          zIndex: 99999
        }}
      >
        <div style={{ color: orange, fontSize: "18px", cursor: "pointer" }}>
          Save Meals
        </div>

        <div style={{ flex: 1 }} />

        <div
          onClick={openMenu}
          style={{
            color: orange,
            fontSize: "18px",
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          Return to Menu
        </div>
      </div>
    </div>
  );
}
