import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WeeklyPlanView from "./WeeklyPlanView.jsx";

const regularPlan = {
  sessions_per_week: 3,
  split: "upper_lower_full",
  focus: "low-rep strength blocks with progressive overload",
  recovery_status: "Reported sleep and fatigue suggest typical recovery; not medical clearance.",
  plan: [
    {
      day: 1, type: "upper", primary_focus: "upper body strength / hypertrophy",
      intensity: "low_to_moderate", volume: "low",
      exercises: [
        { name: "Bench Press", sets: 3, reps: "5–8" },
        { name: "Seated Cable Row", sets: 3, reps: "8–10" }
      ],
      conditioning: { type: "optional", duration_minutes: 10 },
      notes: "Adjust based on your training experience."
    },
    { day: 2, type: "lower", intensity: "moderate", volume: "moderate", exercises: [
      { name: "Goblet Squat", sets: 3, reps: "8–10" }
    ] }
  ]
};

describe("WeeklyPlanView", () => {
  it("renders a mobile-friendly training plan without exposing raw JSON", () => {
    const { container } = render(<WeeklyPlanView plan={regularPlan} />);
    expect(screen.getByText("Your weekly overview")).toBeInTheDocument();
    expect(screen.getByText("Upper body / Lower body / Full body")).toBeInTheDocument();
    expect(screen.getByText(/Day 1 · Upper body/)).toBeInTheDocument();
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("Seated Cable Row")).toBeInTheDocument();
    expect(screen.getAllByText(/3 sets/).length).toBeGreaterThan(0);
    expect(screen.getByText(/optional · 10 minutes/i)).toBeInTheDocument();
    expect(container.querySelector("pre")).not.toBeInTheDocument();
    expect(container.textContent).not.toContain('"sessions_per_week"');
    expect(container.textContent).not.toContain('"exercises"');
  });

  it("warns about legacy injury-friendly plans without repeating unsupported claims", () => {
    const historicalPlan = {
      ...regularPlan,
      focus: "rehab-friendly training emphasizing safe ranges and controlled tempo",
      recovery_status: "recovered — normal training load is appropriate",
      plan: [{
        day: 1, type: "upper", primary_focus: "rehab-friendly training",
        exercises: [{ name: "Bench Press (injury‑friendly)", sets: 3, reps: "5–8" }],
        conditioning: { type: "optional", duration_minutes: 10 }
      }]
    };
    const { container } = render(<WeeklyPlanView plan={historicalPlan} />);
    expect(screen.getByText("Reported injury or restriction")).toBeInTheDocument();
    expect(container.textContent).toContain("Bench Press");
    expect(container.textContent.toLowerCase()).not.toContain("injury-friendly");
    expect(container.textContent.toLowerCase()).not.toContain("rehab-friendly");
    expect(container.textContent).not.toContain("normal training load is appropriate");
    expect(container.textContent).toContain("not injury clearance");
  });

  it("explains why specific exercises were withheld for reported restrictions", () => {
    render(<WeeklyPlanView plan={{
      sessions_per_week: 3,
      split: "upper_lower_full",
      requires_injury_review: true,
      safety_note: "No exercise prescriptions without individual review.",
      plan: [{ day: 1, type: "upper", exercises: [], conditioning: null }]
    }} />);
    expect(screen.getByText("Reported injury or restriction")).toBeInTheDocument();
    expect(screen.getByText("No exercise prescriptions without individual review.")).toBeInTheDocument();
    expect(screen.getByText("Exercises require review for your reported restrictions.")).toBeInTheDocument();
  });
});
