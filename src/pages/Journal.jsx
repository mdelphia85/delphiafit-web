import { useState, useContext, useEffect } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { userDataApi } from "../utils/userDataApi.js";
import { apiRequest } from "../utils/api.js";

export default function Journal() {
  const MAGENTA = "#FF2ECC"; // your exact magenta accent
  const { openMenu } = useContext(MenuContext);

  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showRecallModal, setShowRecallModal] = useState(false);
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [dateQuery, setDateQuery] = useState("");

  // Load server records and import existing device-only notes once without discarding them.
  useEffect(() => {
    let active = true;
    userDataApi.list("journal").then(async (records) => {
      const legacy = JSON.parse(localStorage.getItem("journal_entries") || "[]");
      let rows = records.map((record) => ({ ...record.data, id: record.id, timestamp: record.data.timestamp || record.created_at }));
      if (!rows.length && legacy.length && localStorage.getItem("journal_entries_imported") !== "1") {
        const legacyEmail = localStorage.getItem("userEmail");
        const account = await apiRequest("/auth/me");
        if (legacyEmail && legacyEmail.toLowerCase() === String(account.email).toLowerCase()) {
          const imported = await Promise.all(legacy.map((record) => userDataApi.create("journal", record)));
          rows = imported.map((record) => ({ ...record.data, id: record.id, timestamp: record.data.timestamp || record.created_at }));
          localStorage.setItem("journal_entries_imported", "1");
        } else if (active) {
          setError("Existing device-only entries were preserved and not imported because their owner could not be verified.");
        }
      }
      if (active) setEntries(rows);
    }).catch((err) => active && setError(err.message || "Unable to load journal entries."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const saveEntry = async () => {
    if (!entry.trim()) return;
    setSaving(true);
    setError("");
    const record = { text: entry.trim(), timestamp: new Date().toISOString() };
    try {
      const saved = await userDataApi.create("journal", record);
      setEntries((current) => [{ ...record, id: saved.id }, ...current]);
      setEntry("");
    } catch (err) {
      setError(err.message || "Unable to save journal entry.");
    } finally { setSaving(false); }
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
      {loading && <p role="status">Loading journal...</p>}
      {saving && <p role="status">Saving entry...</p>}
      {error && <p role="alert">{error}</p>}
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
