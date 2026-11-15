import { useTacticalProgress } from "../hooks/useTacticalProgress.js";
import TacticalActivityLog from "../components/TacticalActivityLog.jsx";
import { TACTICAL_COLORS } from "../config/tacticalColors.js";
import { useContext } from "react";
import { MenuContext } from "../context/MenuContext.js";

const initialModules = [
  { id: 1, name: "Physical Conditioning Phase 1", duration: "8 weeks", focus: "Strength", completed: false },
  { id: 2, name: "Police Academy Core", duration: "16 weeks", focus: "Theory & Law", completed: false },
  { id: 3, name: "Defensive Tactics", duration: "6 weeks", focus: "Combat", completed: false },
  { id: 4, name: "Firearms Proficiency", duration: "8 weeks", focus: "Marksmanship", completed: false },
  { id: 5, name: "Physical Conditioning Phase 2", duration: "8 weeks", focus: "Endurance", completed: false },
  { id: 6, name: "Final Academy Certification", duration: "2 weeks", focus: "Evaluation", completed: false }
];

export default function PoliceAcademyPrep({ embedded = false, accent = TACTICAL_COLORS.police }) {
  const { setMenuOpen } = useContext(MenuContext);
  const [modules, setModules, progress] = useTacticalProgress("police-academy-prep", "police-academy-prep", initialModules);
  const TACTICAL_COLOR = accent;


  function toggleModule(id) {
    setModules((prev) =>
      prev.map((module) =>
        module.id === id ? { ...module, completed: !module.completed } : module
      )
    );
  }

  return (
    <div style={{ width: embedded ? "100%" : "100vw", minHeight: embedded ? "auto" : "100vh", backgroundColor: embedded ? "transparent" : "#000", padding: embedded ? "12px 0 24px" : "16px 16px 90px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, overflowY: embedded ? "visible" : "auto", color: "#fff" }}>
      {(progress.loading || progress.error) && <div role="status" aria-live="polite" style={{ position: "fixed", top: "8px", left: "8px", zIndex: 50, background: "#111", color: "#fff", border: "1px solid #555", borderRadius: "6px", padding: "8px", fontSize: "12px" }}>{progress.loading ? "Syncing saved progress..." : `Progress unavailable: ${progress.error}`}</div>}
      <div style={{ width: "360px", maxWidth: "100%" }}>
        {!embedded && <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: TACTICAL_COLOR, fontSize: "28px", fontWeight: "700" }}>👮 Police Academy Prep</div>
          <div style={{ color: "#999", fontSize: "12px", marginTop: "4px" }}>Preparation Program</div>
        </div>}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {modules.map((module) => (
            <div key={module.id} role="button" tabIndex={0} aria-pressed={module.completed} onClick={() => toggleModule(module.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggleModule(module.id); } }} style={{ background: module.completed ? "#171717" : "#111", border: `1px solid ${module.completed ? TACTICAL_COLOR : "#333"}`, borderRadius: "10px", padding: "12px", cursor: "pointer", opacity: module.completed ? 0.7 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ color: "white", fontSize: "16px", fontWeight: "600", textDecoration: module.completed ? "line-through" : "none" }}>{module.name}</div>
                <div style={{ color: TACTICAL_COLOR, fontWeight: "700" }}>{module.completed ? "✓" : "○"}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#999" }}>
                <div>{module.duration}</div>
                <div style={{ color: TACTICAL_COLOR }}>{module.focus}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", padding: "12px", background: "#111", border: `1px solid ${TACTICAL_COLOR}`, borderRadius: "10px", fontSize: "13px", color: "#ccc" }}>
          <div style={{ color: TACTICAL_COLOR, fontWeight: "700", marginBottom: "8px" }}>Completion</div>
          <div>{modules.filter((m) => m.completed).length} of {modules.length} modules completed</div>
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 2, width: "min(500px, 100%)", marginTop: "24px" }}><TacticalActivityLog module="police-academy-prep" title="Police Academy" accent={TACTICAL_COLOR} /></div>

      {!embedded && <div onClick={() => setMenuOpen(true)} style={{ position: "fixed", bottom: "20px", right: "20px", color: TACTICAL_COLOR, fontSize: "22px", textDecoration: "underline", cursor: "pointer", zIndex: 20 }}>
        Return to Menu
      </div>}
    </div>
  );
}
