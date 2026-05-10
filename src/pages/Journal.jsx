import React, { useState, useContext, useEffect } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function Journal() {
  const MAGENTA = "#FF2ECC"; // your exact magenta accent
  const { openMenu } = useContext(MenuContext);

  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);

  const [showRecallModal, setShowRecallModal] = useState(false);
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [dateQuery, setDateQuery] = useState("");

  // Load entries from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("journal_entries") || "[]");
    setEntries(saved);
  }, []);

  // Save entries to localStorage
  const saveEntries = (updated) => {
    localStorage.setItem("journal_entries", JSON.stringify(updated));
    setEntries(updated);
  };

  // Save new entry
  const saveEntry = () => {
    if (!entry.trim()) return;

    const newEntry = {
      text: entry.trim(),
      timestamp: new Date().toISOString(),
    };

    const updated = [newEntry, ...entries];
    saveEntries(updated);
    setEntry("");
  };

  // Open entry viewer
  const openEntry = (e) => {
    setSelectedEntry(e);
    setShowEntryModal(true);
  };

  // Filtered lists
  const keywordResults = entries.filter((e) =>
    e.text.toLowerCase().includes(keyword.toLowerCase())
  );

  const dateResults = entries.filter((e) =>
    e.timestamp.startsWith(dateQuery)
  );

  return (
    <div
      style={{
        backgroundColor: "black",
        minHeight: "100vh",
        padding: "20px",
        color: MAGENTA,
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >

      {/* MULTILINE INPUT — NO HEADER */}
      <textarea
        className="journal-input"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write your thoughts…"
        style={{
          width: "100%",
          height: "200px",
          backgroundColor: "black",
          fontSize: "18px",
          padding: "10px",
          resize: "none",
          outline: "none",
          border: "none",
        }}
      />

      {/* FOOTER BUTTONS */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          color: MAGENTA,
          textDecoration: "underline",
          fontSize: "20px",
          cursor: "pointer",
        }}
        onClick={saveEntry}
      >
        Save Entry
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          color: MAGENTA,
          textDecoration: "underline",
          fontSize: "20px",
          cursor: "pointer",
        }}
        onClick={() => setShowRecallModal(true)}
      >
        Recall Entry
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          color: MAGENTA,
          textDecoration: "underline",
          fontSize: "20px",
          cursor: "pointer",
        }}
        onClick={openMenu}
      >
        Return to Menu
      </div>

      {/* ========================= */}
      {/* RECALL MODAL (3 options) */}
      {/* ========================= */}
      {showRecallModal && (
        <Modal onClose={() => setShowRecallModal(false)} color={MAGENTA}>
          <ModalButton label="Search by Keyword" onClick={() => {
            setShowRecallModal(false);
            setShowKeywordModal(true);
          }} color={MAGENTA} />

          <ModalButton label="Search by Date" onClick={() => {
            setShowRecallModal(false);
            setShowDateModal(true);
          }} color={MAGENTA} />

          <ModalButton label="Browse Timeline" onClick={() => {
            setShowRecallModal(false);
            setShowTimelineModal(true);
          }} color={MAGENTA} />

          <ModalButton label="Close" onClick={() => setShowRecallModal(false)} color={MAGENTA} />
        </Modal>
      )}

      {/* ========================= */}
      {/* KEYWORD SEARCH MODAL */}
      {/* ========================= */}
      {showKeywordModal && (
        <Modal onClose={() => setShowKeywordModal(false)} color={MAGENTA}>
          <h2 style={{ color: MAGENTA }}>Search by Keyword</h2>

          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Type keyword..."
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "black",
              color: MAGENTA,
              border: "none",
              outline: "none",
              marginBottom: "15px",
            }}
          />

          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {keywordResults.map((e, i) => (
              <p
                key={i}
                onClick={() => openEntry(e)}
                style={{
                  cursor: "pointer",
                  color: MAGENTA,
                  marginBottom: "10px",
                }}
              >
                {e.text.slice(0, 40)}…
              </p>
            ))}
          </div>

          <ModalButton label="Close" onClick={() => setShowKeywordModal(false)} color={MAGENTA} />
        </Modal>
      )}

      {/* ========================= */}
      {/* DATE SEARCH MODAL */}
      {/* ========================= */}
      {showDateModal && (
        <Modal onClose={() => setShowDateModal(false)} color={MAGENTA}>
          <h2 style={{ color: MAGENTA }}>Search by Date</h2>

          <input
            value={dateQuery}
            onChange={(e) => setDateQuery(e.target.value)}
            placeholder="YYYY-MM-DD or YYYY-MM"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "black",
              color: MAGENTA,
              border: "none",
              outline: "none",
              marginBottom: "15px",
            }}
          />

          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {dateResults.map((e, i) => (
              <p
                key={i}
                onClick={() => openEntry(e)}
                style={{
                  cursor: "pointer",
                  color: MAGENTA,
                  marginBottom: "10px",
                }}
              >
                {e.timestamp.slice(0, 10)} — {e.text.slice(0, 40)}…
              </p>
            ))}
          </div>

          <ModalButton label="Close" onClick={() => setShowDateModal(false)} color={MAGENTA} />
        </Modal>
      )}

      {/* ========================= */}
      {/* TIMELINE MODAL */}
      {/* ========================= */}
      {showTimelineModal && (
        <Modal onClose={() => setShowTimelineModal(false)} color={MAGENTA}>
          <h2 style={{ color: MAGENTA }}>Timeline</h2>

          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {entries.map((e, i) => (
              <p
                key={i}
                onClick={() => openEntry(e)}
                style={{
                  cursor: "pointer",
                  color: MAGENTA,
                  marginBottom: "10px",
                }}
              >
                {e.timestamp.slice(0, 10)} — {e.text.slice(0, 40)}…
              </p>
            ))}
          </div>

          <ModalButton label="Close" onClick={() => setShowTimelineModal(false)} color={MAGENTA} />
        </Modal>
      )}

      {/* ========================= */}
      {/* ENTRY VIEWER MODAL */}
      {/* ========================= */}
      {showEntryModal && selectedEntry && (
        <Modal onClose={() => setShowEntryModal(false)} color={MAGENTA}>
          <h2 style={{ color: MAGENTA }}>
            {selectedEntry.timestamp.slice(0, 10)}
          </h2>

          <p style={{ whiteSpace: "pre-wrap", color: MAGENTA }}>
            {selectedEntry.text}
          </p>

          <ModalButton label="Close" onClick={() => setShowEntryModal(false)} color={MAGENTA} />
        </Modal>
      )}

    </div>
  );
}

/* ========================= */
/* REUSABLE MODAL COMPONENT  */
/* ========================= */
function Modal({ children, onClose, color }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "black",
          padding: "20px",
          borderRadius: "8px",
          color,
          width: "80%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ========================= */
/* REUSABLE MODAL BUTTON     */
/* ========================= */
function ModalButton({ label, onClick, color }) {
  return (
    <div
      onClick={onClick}
      style={{
        color,
        textDecoration: "underline",
        fontSize: "20px",
        marginTop: "15px",
        cursor: "pointer",
      }}
    >
      {label}
    </div>
  );
}
