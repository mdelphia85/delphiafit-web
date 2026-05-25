import React, { useState, useRef, useEffect } from "react";

import DemoBanner from "../../components/DemoBanner";
import DemoGuide from "../../components/DemoGuide";

import homescreen from "../../assets/homescreen.png";

const DemoDashboard = () => {
  const [demoPage, setDemoPage] = useState(null);

  const [guideStep, setGuideStep] = useState(1);
  const [showGuide, setShowGuide] = useState(false);

  const workoutRef = useRef(null);
  const mealRef = useRef(null);
  const tacticalRef = useRef(null);
  const progressRef = useRef(null);

  // ------------------------------------------------------------
  // GUIDE ACTIVATION
  // ------------------------------------------------------------
  useEffect(() => {
    if (demoPage === "dashboard") {
      setShowGuide(true);
    }
  }, [demoPage]);

  useEffect(() => {
    if (!showGuide) return;

    const scrollOptions = { behavior: "smooth", block: "center" };

    if (guideStep === 2 && workoutRef.current)
      workoutRef.current.scrollIntoView(scrollOptions);

    if (guideStep === 3 && mealRef.current)
      mealRef.current.scrollIntoView(scrollOptions);

    if (guideStep === 4 && tacticalRef.current)
      tacticalRef.current.scrollIntoView(scrollOptions);

    if (guideStep === 5 && progressRef.current)
      progressRef.current.scrollIntoView(scrollOptions);
  }, [guideStep, showGuide]);

  const getHighlightClass = (card) => {
    if (!showGuide) return "";
    if (guideStep === 2 && card === "workout") return "highlight-card";
    if (guideStep === 3 && card === "meal") return "highlight-card";
    if (guideStep === 4 && card === "tactical") return "highlight-card";
    if (guideStep === 5 && card === "progress") return "highlight-card";
    return "";
  };

  // ------------------------------------------------------------
  // GATEWAY SCREEN
  // ------------------------------------------------------------
  if (!demoPage) {
    return (
      <div className="demo-container">
        <DemoBanner />

        <div className="demo-choice">
          <h1 className="demo-title">Welcome to DelphiaFit</h1>

          <img
            src={homescreen}
            alt="DelphiaFit Home"
            className="demo-home-image"
          />

          <p className="demo-subtitle">Choose how you want to get started</p>

          <div className="demo-choice-buttons-row">
            <button
              className="demo-btn demo-btn-demo"
              onClick={() => setDemoPage("dashboard")}
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
      </div>
    );
  }

  // ------------------------------------------------------------
  // DEMO PAGES (FULLY ISOLATED FROM REAL APP)
  // ------------------------------------------------------------
  if (demoPage === "workouts") {
    return (window.location.href = "/demo/workouts");
  }

  if (demoPage === "meals") {
    return (window.location.href = "/demo/meals");
  }

  if (demoPage === "tactical") {
    return (window.location.href = "/demo/tactical");
  }

  if (demoPage === "progress") {
    return (window.location.href = "/demo/progress");
  }

  // ------------------------------------------------------------
  // DEMO DASHBOARD (AFTER CHOOSING DEMO MODE)
  // ------------------------------------------------------------
  return (
    <div className="demo-container">
      <DemoBanner />

      {showGuide && (
        <DemoGuide
          step={guideStep}
          onNext={() => setGuideStep((prev) => prev + 1)}
          onClose={() => setShowGuide(false)}
        />
      )}

      <div className="demo-hero">
        <h1>Explore DelphiaFit</h1>
        <p>Try the platform in read‑only demo mode.</p>

        <button
          className="demo-start-btn"
          onClick={() =>
            window.scrollTo({ top: 600, behavior: "smooth" })
          }
        >
          Start Demo
        </button>
      </div>

      <div className="demo-dashboard">
        <h2>Dashboard Preview</h2>

        <div className="demo-grid">
          <div
            ref={workoutRef}
            className={`demo-card ${getHighlightClass("workout")}`}
            onClick={() => setDemoPage("workouts")}
          >
            <h3>Workouts</h3>
            <p>View sample training sessions</p>
          </div>

          <div
            ref={mealRef}
            className={`demo-card ${getHighlightClass("meal")}`}
            onClick={() => setDemoPage("meals")}
          >
            <h3>Meals</h3>
            <p>Explore nutrition planning</p>
          </div>

          <div
            ref={tacticalRef}
            className={`demo-card ${getHighlightClass("tactical")}`}
            onClick={() => setDemoPage("tactical")}
          >
            <h3>Tactical Drills</h3>
            <p>Firefighter, EMS, Military, Police</p>
          </div>

          <div
            ref={progressRef}
            className={`demo-card ${getHighlightClass("progress")}`}
            onClick={() => setDemoPage("progress")}
          >
            <h3>Progress</h3>
            <p>See performance analytics</p>
          </div>
        </div>
      </div>

      <div className="demo-features">
        <h2>What You Get</h2>
        <ul>
          <li>Personalized training programs</li>
          <li>Tactical drills for Firefighter, EMS, Military, Police</li>
          <li>Nutrition planning and meal tracking</li>
          <li>Progress analytics and performance insights</li>
          <li>Admin dashboard for coaches and departments</li>
        </ul>
      </div>

      <div className="demo-cta">
        <h2>Ready to start your training</h2>
        <button
          className="demo-create-btn"
          onClick={() => (window.location.href = "/register")}
        >
          Create Your Account
        </button>
      </div>
    </div>
  );
};

export default DemoDashboard;
