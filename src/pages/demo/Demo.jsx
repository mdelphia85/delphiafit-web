import React, { useState, useRef, useEffect } from "react";
import DemoWorkoutModal from "./DemoWorkoutModal";
import DemoMealModal from "./DemoMealModal";
import DemoDivisionModal from "./DemoDivisionModal";
import DemoProgressModal from "./DemoProgressModal";

import demoWorkouts from "../../demo/demoWorkouts";
import demoMeals from "../../demo/demoMeals";
import demoTactical from "../../demo/demoTactical";
import demoProgress from "../../demo/demoProgress";

import DemoBanner from "../../components/DemoBanner";
import DemoGuide from "../../components/DemoGuide";

const Demo = () => {
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  // ⭐ Gateway choice state
  const [hasChosenPath, setHasChosenPath] = useState(false);

  // ⭐ Guided walkthrough state
  const [guideStep, setGuideStep] = useState(1);
  const [showGuide, setShowGuide] = useState(false);

  // ⭐ Enable walkthrough ONLY after demo starts
  useEffect(() => {
    if (hasChosenPath) {
      setShowGuide(true);
    }
  }, [hasChosenPath]);

  // ⭐ Refs for auto-scroll
  const workoutRef = useRef(null);
  const mealRef = useRef(null);
  const tacticalRef = useRef(null);
  const progressRef = useRef(null);

  // ⭐ Auto-scroll logic
  useEffect(() => {
    if (!showGuide) return;

    const scrollOptions = { behavior: "smooth", block: "center" };

    if (guideStep === 2 && workoutRef.current) workoutRef.current.scrollIntoView(scrollOptions);
    if (guideStep === 3 && mealRef.current) mealRef.current.scrollIntoView(scrollOptions);
    if (guideStep === 4 && tacticalRef.current) tacticalRef.current.scrollIntoView(scrollOptions);
    if (guideStep === 5 && progressRef.current) progressRef.current.scrollIntoView(scrollOptions);
  }, [guideStep, showGuide]);

  // ⭐ Highlight logic
  const getHighlightClass = (card) => {
    if (!showGuide) return "";
    if (guideStep === 2 && card === "workout") return "highlight-card";
    if (guideStep === 3 && card === "meal") return "highlight-card";
    if (guideStep === 4 && card === "tactical") return "highlight-card";
    if (guideStep === 5 && card === "progress") return "highlight-card";
    return "";
  };

  return (
    <div className="demo-container">
      <DemoBanner />

      {/* ⭐ Gateway Screen */}
      {!hasChosenPath && (
        <div className="demo-choice">
          <h1 className="demo-title">Welcome to DelphiaFit</h1>

          <img
            src="/homescreen.png"
            alt="DelphiaFit Home"
            className="demo-home-image"
          />

          <p className="demo-subtitle">Choose how you want to get started</p>

          <div className="demo-choice-buttons-row">
            <button
              className="demo-btn demo-btn-demo"
              onClick={() => setHasChosenPath(true)}
            >
              Try Demo Mode
            </button>

            <button
              className="demo-btn demo-btn-create"
              onClick={() => (window.location.href = "/register")}
            >
              Create Account
            </button>

            <button
              className="demo-btn demo-btn-login"
              onClick={() => (window.location.href = "/login")}
            >
              Log In
            </button>
          </div>
        </div>
      )}

      {/* ⭐ Demo content AFTER choosing demo mode */}
      {hasChosenPath && (
        <>
          {showGuide && (
            <DemoGuide
              step={guideStep}
              onNext={() => setGuideStep((prev) => prev + 1)}
              onClose={() => setShowGuide(false)}
            />
          )}

          {/* HERO SECTION */}
          <div className="demo-hero">
            <h1>Explore DelphiaFit</h1>
            <p>Try the platform in read‑only demo mode.</p>

            <button
              className="demo-start-btn"
              onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
            >
              Start Demo
            </button>
          </div>

          {/* DASHBOARD PREVIEW */}
          <div className="demo-dashboard">
            <h2>Dashboard Preview</h2>

            <div className="demo-grid">
              <div
                ref={workoutRef}
                className={`demo-card ${getHighlightClass("workout")}`}
                onClick={() => setSelectedWorkout(demoWorkouts[0])}
              >
                <h3>Sample Workout</h3>
                <p>{demoWorkouts[0].name}</p>
              </div>

              <div
                ref={mealRef}
                className={`demo-card ${getHighlightClass("meal")}`}
                onClick={() => setSelectedMeal(demoMeals[0])}
              >
                <h3>Sample Meal</h3>
                <p>{demoMeals[0].name}</p>
              </div>

              <div
                ref={tacticalRef}
                className={`demo-card ${getHighlightClass("tactical")}`}
                onClick={() => {
                  setSelectedDivision("fire");
                  setSelectedDrill(demoTactical.fire[0]);
                }}
              >
                <h3>Sample Tactical Drill</h3>
                <p>{demoTactical.fire[0].title}</p>
              </div>

              <div
                ref={progressRef}
                className={`demo-card ${getHighlightClass("progress")}`}
                onClick={() => setShowProgress(true)}
              >
                <h3>Progress Preview</h3>
                <p>Weekly Progress Chart</p>
              </div>
            </div>
          </div>

          {/* FEATURES */}
          <div className="demo-features">
            <h2>What You Get</h2>
            <ul>
              <li>Personalized training programs</li>
              <li>Tactical drills for Fire, EMS, Military, and Police</li>
              <li>Nutrition planning and meal tracking</li>
              <li>Progress analytics and performance insights</li>
              <li>Admin dashboard for coaches and departments</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="demo-cta">
            <h2>Ready to start your training</h2>
            <button
              className="demo-create-btn"
              onClick={() => (window.location.href = "/register")}
            >
              Create Your Account
            </button>
          </div>

          {/* MODALS */}
          {selectedWorkout && (
            <DemoWorkoutModal
              workout={selectedWorkout}
              onClose={() => setSelectedWorkout(null)}
            />
          )}

          {selectedMeal && (
            <DemoMealModal
              meal={selectedMeal}
              onClose={() => setSelectedMeal(null)}
            />
          )}

          {selectedDrill && (
            <DemoDivisionModal
              division={selectedDivision}
              drill={selectedDrill}
              onClose={() => {
                setSelectedDrill(null);
                setSelectedDivision(null);
              }}
              onReplace={(newDrill) => setSelectedDrill(newDrill)}
            />
          )}

          {showProgress && (
            <DemoProgressModal
              data={demoProgress}
              onClose={() => setShowProgress(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Demo;

