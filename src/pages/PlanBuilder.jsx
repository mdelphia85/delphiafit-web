import React, { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const planTemplates = [
  { id: 1, name: "8-Week Strength", type: "Training", duration: "8 weeks", difficulty: "Intermediate" },
  { id: 2, name: "Marathon Prep", type: "Training", duration: "16 weeks", difficulty: "Advanced" },
  { id: 3, name: "Balanced Nutrition", type: "Meal", duration: "4 weeks", difficulty: "Beginner" },
  { id: 4, name: "Muscle Gain", type: "Meal", duration: "12 weeks", difficulty: "Intermediate" }
];

export default function PlanBuilder() {
  const { setMenuOpen } = useContext(MenuContext);
  const [view, setView] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [planName, setPlanName] = useState("");
  const [planType, setPlanType] = useState("Training");
  const [planDuration, setPlanDuration] = useState(4);

  const COACH_COLOR = "#ec4899";
  const BLACK = "#000";
  const WHITE = "#fff";

  const handleCreatePlan = () => {
    if (planName.trim()) {
      alert(`Created: ${planName} (${planType}, ${planDuration} weeks)`);
      setPlanName("");
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: BLACK,
        padding: "16px 16px 90px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        overflowY: "auto",
        color: WHITE
      }}
    >
      <div style={{ width: "360px", maxWidth: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: COACH_COLOR, fontSize: "28px", fontWeight: "700" }}>📋 Plan Builder</div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <button
            onClick={() => setView("templates")}
            style={{
              flex: 1,
              padding: "12px",
              background: view === "templates" ? COACH_COLOR : "#222",
              color: view === "templates" ? BLACK : WHITE,
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Templates
          </button>
          <button
            onClick={() => setView("create")}
            style={{
              flex: 1,
              padding: "12px",
              background: view === "create" ? COACH_COLOR : "#222",
              color: view === "create" ? BLACK : WHITE,
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Create
          </button>
        </div>

        {/* Templates View */}
        {view === "templates" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {planTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                style={{
                  background: "#111",
                  border: `1px solid #2a2a2a`,
                  borderRadius: "12px",
                  padding: "14px",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = COACH_COLOR)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <div style={{ fontWeight: "600" }}>{template.name}</div>
                  <div style={{ fontSize: "11px", color: COACH_COLOR, fontWeight: "600" }}>
                    {template.type}
                  </div>
                </div>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  {template.duration} • {template.difficulty}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Template Detail */}
        {view === "templates" && selectedTemplate && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)" }} />
        )}

        {/* Create View */}
        {view === "create" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Create New Plan</div>

            <div>
              <label style={{ fontSize: "12px", color: "#999", marginBottom: "6px", display: "block" }}>
                Plan Name
              </label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="e.g., Client X Strength Phase"
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#111",
                  border: `1px solid #2a2a2a`,
                  borderRadius: "8px",
                  color: WHITE,
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "#999", marginBottom: "6px", display: "block" }}>
                Plan Type
              </label>
              <select
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#111",
                  border: `1px solid #2a2a2a`,
                  borderRadius: "8px",
                  color: WHITE,
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
              >
                <option>Training</option>
                <option>Meal</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "#999", marginBottom: "6px", display: "block" }}>
                Duration (weeks)
              </label>
              <input
                type="number"
                value={planDuration}
                onChange={(e) => setPlanDuration(parseInt(e.target.value))}
                min="1"
                max="52"
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#111",
                  border: `1px solid #2a2a2a`,
                  borderRadius: "8px",
                  color: WHITE,
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <button
              onClick={handleCreatePlan}
              style={{
                padding: "14px",
                background: COACH_COLOR,
                color: BLACK,
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "12px"
              }}
            >
              Create Plan
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "40px",
          background: BLACK,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 16px",
          boxSizing: "border-box",
          zIndex: 20
        }}
      >
        <div
          style={{
            color: COACH_COLOR,
            fontSize: "18px",
            textDecoration: "underline",
            cursor: "pointer"
          }}
          onClick={() => setMenuOpen(true)}
        >
          Return to Menu
        </div>
      </div>
    </div>
  );
}
