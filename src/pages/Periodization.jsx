import React, { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const initialBlocks = [
  {
    id: 1,
    name: "Base Building",
    phase: "Accumulation",
    weeks: 4,
    progress: 75,
    startDate: "2026-08-01",
    endDate: "2026-08-28",
    focus: "Aerobic capacity"
  },
  {
    id: 2,
    name: "Strength Phase",
    phase: "Intensification",
    weeks: 3,
    progress: 40,
    startDate: "2026-08-29",
    endDate: "2026-09-18",
    focus: "Max strength"
  },
  {
    id: 3,
    name: "Power Development",
    phase: "Realization",
    weeks: 2,
    progress: 0,
    startDate: "2026-09-19",
    endDate: "2026-10-02",
    focus: "Power output"
  }
];

const phases = [
  { name: "Accumulation", desc: "High volume, moderate intensity" },
  { name: "Intensification", desc: "Moderate volume, high intensity" },
  { name: "Realization", desc: "Low volume, very high intensity" },
  { name: "Recovery", desc: "Active recovery, reduced load" }
];

export default function Periodization() {
  const { setMenuOpen } = useContext(MenuContext);
  const [blocks, setBlocks] = useState(initialBlocks);
  const [view, setView] = useState("overview");
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [newBlockName, setNewBlockName] = useState("");
  const [newBlockPhase, setNewBlockPhase] = useState("Accumulation");
  const [newBlockWeeks, setNewBlockWeeks] = useState(4);

  const PERIODIZATION_COLOR = "#00d4ff";
  const BLACK = "#000";
  const WHITE = "#fff";

  const handleCreateBlock = () => {
    if (newBlockName.trim()) {
      const newBlock = {
        id: blocks.length + 1,
        name: newBlockName,
        phase: newBlockPhase,
        weeks: newBlockWeeks,
        progress: 0,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + newBlockWeeks * 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        focus: "TBD"
      };
      setBlocks([...blocks, newBlock]);
      setNewBlockName("");
      setNewBlockPhase("Accumulation");
      setNewBlockWeeks(4);
    }
  };

  const handleDeleteBlock = (id) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    setSelectedBlock(null);
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
          <div style={{ color: PERIODIZATION_COLOR, fontSize: "28px", fontWeight: "700" }}>
            📅 Periodization
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <button
            onClick={() => setView("overview")}
            style={{
              flex: 1,
              padding: "12px",
              background: view === "overview" ? PERIODIZATION_COLOR : "#222",
              color: view === "overview" ? BLACK : WHITE,
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Blocks
          </button>
          <button
            onClick={() => setView("phases")}
            style={{
              flex: 1,
              padding: "12px",
              background: view === "phases" ? PERIODIZATION_COLOR : "#222",
              color: view === "phases" ? BLACK : WHITE,
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Phases
          </button>
          <button
            onClick={() => setView("create")}
            style={{
              flex: 1,
              padding: "12px",
              background: view === "create" ? PERIODIZATION_COLOR : "#222",
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

        {/* Overview - Training Blocks */}
        {view === "overview" && !selectedBlock && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {blocks.map((block) => (
              <div
                key={block.id}
                onClick={() => setSelectedBlock(block)}
                style={{
                  background: "#111",
                  border: `1px solid #2a2a2a`,
                  borderRadius: "12px",
                  padding: "14px",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = PERIODIZATION_COLOR)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ fontSize: "16px", fontWeight: "600" }}>{block.name}</div>
                  <div style={{ fontSize: "12px", color: PERIODIZATION_COLOR, fontWeight: "600" }}>
                    {block.progress}%
                  </div>
                </div>

                <div style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}>
                  {block.phase} • {block.weeks} weeks
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "#222",
                    borderRadius: "999px",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      width: `${block.progress}%`,
                      height: "100%",
                      background: PERIODIZATION_COLOR,
                      borderRadius: "999px"
                    }}
                  />
                </div>

                <div style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
                  {block.startDate} → {block.endDate}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Block Detail */}
        {view === "overview" && selectedBlock && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <button
              onClick={() => setSelectedBlock(null)}
              style={{
                padding: "12px",
                background: "#222",
                color: WHITE,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              ← Back
            </button>

            <div style={{ background: "#111", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px", color: PERIODIZATION_COLOR }}>
                {selectedBlock.name}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>Phase</div>
                  <div style={{ fontSize: "14px", fontWeight: "600" }}>{selectedBlock.phase}</div>
                </div>

                <div>
                  <div style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>Duration</div>
                  <div style={{ fontSize: "14px", fontWeight: "600" }}>{selectedBlock.weeks} weeks</div>
                </div>

                <div>
                  <div style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>Focus</div>
                  <div style={{ fontSize: "14px", fontWeight: "600" }}>{selectedBlock.focus}</div>
                </div>

                <div>
                  <div style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>Progress</div>
                  <div
                    style={{
                      width: "100%",
                      height: "10px",
                      background: "#222",
                      borderRadius: "999px",
                      overflow: "hidden"
                    }}
                  >
                    <div
                      style={{
                        width: `${selectedBlock.progress}%`,
                        height: "100%",
                        background: PERIODIZATION_COLOR
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDeleteBlock(selectedBlock.id)}
              style={{
                padding: "12px",
                background: "#333",
                color: "#ff6b6b",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600"
              }}
            >
              Delete Block
            </button>
          </div>
        )}

        {/* Phases Reference */}
        {view === "phases" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {phases.map((phase, idx) => (
              <div
                key={idx}
                style={{
                  background: "#111",
                  border: `1px solid #2a2a2a`,
                  borderRadius: "12px",
                  padding: "14px"
                }}
              >
                <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px", color: PERIODIZATION_COLOR }}>
                  {phase.name}
                </div>
                <div style={{ fontSize: "12px", color: "#999" }}>{phase.desc}</div>
              </div>
            ))}
          </div>
        )}

        {/* Create Block */}
        {view === "create" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Create Training Block</div>

            <div>
              <label style={{ fontSize: "12px", color: "#999", marginBottom: "6px", display: "block" }}>
                Block Name
              </label>
              <input
                type="text"
                value={newBlockName}
                onChange={(e) => setNewBlockName(e.target.value)}
                placeholder="e.g., Winter Strength"
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
                Phase Type
              </label>
              <select
                value={newBlockPhase}
                onChange={(e) => setNewBlockPhase(e.target.value)}
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
                {phases.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "#999", marginBottom: "6px", display: "block" }}>
                Duration (weeks)
              </label>
              <input
                type="number"
                value={newBlockWeeks}
                onChange={(e) => setNewBlockWeeks(parseInt(e.target.value))}
                min="1"
                max="16"
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
              onClick={handleCreateBlock}
              style={{
                padding: "14px",
                background: PERIODIZATION_COLOR,
                color: BLACK,
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "12px"
              }}
            >
              Create Block
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
            color: PERIODIZATION_COLOR,
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
