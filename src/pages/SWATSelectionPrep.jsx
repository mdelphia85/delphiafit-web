import { useTacticalProgress } from "../hooks/useTacticalProgress.js";
import TextAction from "../components/TextAction.jsx";
import TacticalActivityLog from "../components/TacticalActivityLog.jsx";
import { TACTICAL_COLORS } from "../config/tacticalColors.js";
import { useContext } from "react";
import { MenuContext } from "../context/MenuContext.js";

const initialPhases = [
  { id: 1, name: "Physical Conditioning Phase 1", duration: "8 weeks", focus: "Strength", completed: false },
  { id: 2, name: "Tactical Breaching", duration: "6 weeks", focus: "Techniques", completed: false },
  { id: 3, name: "Firearms Mastery", duration: "10 weeks", focus: "Precision", completed: false },
  { id: 4, name: "Close Quarters Combat", duration: "8 weeks", focus: "CQB", completed: false },
  { id: 5, name: "Team Tactics & Communication", duration: "10 weeks", focus: "Coordination", completed: false },
  { id: 6, name: "SWAT Selection Simulation", duration: "3 weeks", focus: "Final Evaluation", completed: false }
];

export default function SWATSelectionPrep({ embedded = false, accent = TACTICAL_COLORS.police }) {
  const { setMenuOpen } = useContext(MenuContext);
  const [phases, setPhases, progress] = useTacticalProgress("swat-selection-prep", "swat-selection-prep", initialPhases);
  const TACTICAL_COLOR = accent;


  function togglePhase(id) {
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === id ? { ...phase, completed: !phase.completed } : phase
      )
    );
  }

  return (
    <div style={{ width: embedded ? "100%" : "100vw", minHeight: embedded ? "auto" : "100vh", backgroundColor: embedded ? "transparent" : "#000", padding: embedded ? "12px 0 24px" : "16px 16px 90px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, overflowY: embedded ? "visible" : "auto", color: "#fff" }}>
      {(progress.loading || progress.error) && <div role="status" aria-live="polite" style={{ position: "fixed", top: "8px", left: "8px", zIndex: 50, background: "#111", color: "#fff", border: "1px solid #555", borderRadius: "6px", padding: "8px", fontSize: "12px" }}>{progress.loading ? "Syncing saved progress..." : `Progress unavailable: ${progress.error}`}</div>}
      <div style={{ width: "360px", maxWidth: "100%" }}>
        {!embedded && <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>🔫 SWAT Selection Prep</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>Tactical Team Preparation</div>
        </div>}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {phases.map((phase) => (
            <div key={phase.id} role="button" tabIndex={0} aria-pressed={phase.completed} onClick={() => togglePhase(phase.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); togglePhase(phase.id); } }} style={{ background: phase.completed ? "#171717" : "#111", border: `1px solid ${phase.completed ? TACTICAL_COLOR : "#333"}`, borderRadius: "10px", padding: "12px", cursor: "pointer", opacity: phase.completed ? 0.7 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ color: "white", fontSize: "16px", fontWeight: "600", textDecoration: phase.completed ? "line-through" : "none" }}>{phase.name}</div>
                <div style={{ color: TACTICAL_COLOR, fontWeight: "700" }}>{phase.completed ? "✓" : "○"}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
                <div>{phase.duration}</div>
                <div style={{ color: TACTICAL_COLOR }}>{phase.focus}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", padding: "12px", background: "#111", border: `1px solid ${TACTICAL_COLOR}`, borderRadius: "10px", fontSize: "13px", color: "#ccc" }}>
          <div style={{ color: TACTICAL_COLOR, fontWeight: "700", marginBottom: "8px" }}>Completion</div>
          <div>{phases.filter((p) => p.completed).length} of {phases.length} phases completed</div>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2, width: "min(500px, 100%)", marginTop: "24px" }}><TacticalActivityLog module="swat-selection-prep" title="SWAT Selection" accent={TACTICAL_COLOR} /></div>

      {!embedded && <TextAction onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: 20, right: 20, color: TACTICAL_COLOR, fontSize: 22, zIndex: 20 }}>Return to Menu</TextAction>}
    </div>
  );
}
