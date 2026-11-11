import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../context/MenuContext.js";
import { apiRequest } from "../utils/api.js";

export const CLIENT_TRAINER_COLOR = "#FFB43B";

const buttonStyle = { border: 0, background: CLIENT_TRAINER_COLOR, color: "#000",
  borderRadius: 6, padding: "9px 12px", cursor: "pointer", fontWeight: 700 };

export default function MyTrainer() {
  const { setMenuOpen } = useContext(MenuContext);
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function reload() {
    const [pending, active] = await Promise.all([
      apiRequest("/trainer/invitations"),
      apiRequest("/trainer/my-trainers")
    ]);
    setInvitations(pending.invitations || []);
    setTrainers(active.trainers || []);
  }

  useEffect(() => {
    let active = true;
    Promise.all([apiRequest("/trainer/invitations"), apiRequest("/trainer/my-trainers")])
      .then(([pending, connected]) => {
        if (!active) return;
        setInvitations(pending.invitations || []);
        setTrainers(connected.trainers || []);
        setStatus("ready");
      })
      .catch((error) => {
        if (active) {
          setMessage(error.message || "Unable to load your trainer invitations.");
          setStatus("error");
        }
      });
    return () => { active = false; };
  }, []);

  async function change(method, path, success) {
    setBusy(true);
    setMessage("");
    try {
      await apiRequest(path, { method });
      await reload();
      setMessage(success);
    } catch (error) {
      setMessage(error.message || "Unable to update your trainer connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "24px 16px 90px", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <h1 style={{ color: CLIENT_TRAINER_COLOR, textAlign: "center" }}>My Trainer</h1>
        <p style={{ textAlign: "center", color: "#aaa" }}>
          Manage personal training invitations and who can see your logged workouts.
        </p>
        {status === "loading" && <p role="status">Loading...</p>}
        {status === "error" && <button type="button" onClick={() => navigate("/login")} style={buttonStyle}>Sign In</button>}
        {status === "ready" && (
          <>
            <h2 style={{ color: CLIENT_TRAINER_COLOR, fontSize: 18 }}>Pending Invitations</h2>
            {invitations.length === 0 && <p>No pending trainer invitations.</p>}
            {invitations.map((invitation) => (
              <div key={invitation.id} style={{ background: "#171717", border: "1px solid #333", borderRadius: 8, padding: 16, marginBottom: 12 }}>
                <strong>{invitation.trainer_name}</strong>
                <p style={{ fontSize: 13, color: "#bbb" }}>Accepting lets this trainer view your saved workout history.</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button type="button" disabled={busy} style={buttonStyle}
                    onClick={() => change("POST", `/trainer/invitations/${invitation.id}/accept`, "Trainer invitation accepted.")}>Accept</button>
                  <button type="button" disabled={busy} style={{ ...buttonStyle, color: "#fff", background: "#333" }}
                    onClick={() => change("POST", `/trainer/invitations/${invitation.id}/decline`, "Trainer invitation declined.")}>Decline</button>
                </div>
              </div>
            ))}
            <h2 style={{ color: CLIENT_TRAINER_COLOR, fontSize: 18 }}>Connected Trainers</h2>
            {trainers.length === 0 && <p>You are not connected to a personal trainer.</p>}
            {trainers.map((trainer) => (
              <div key={trainer.id} style={{ background: "#171717", border: "1px solid #333", borderRadius: 8, padding: 16, marginBottom: 12 }}>
                <strong>{trainer.name}</strong>
                <button type="button" disabled={busy} style={{ ...buttonStyle, background: "#333", color: "#fff", marginLeft: 12 }}
                  onClick={() => {
                    if (window.confirm(`Disconnect ${trainer.name} from your workout history?`)) {
                      change("DELETE", `/trainer/my-trainers/${trainer.id}`, "Trainer access revoked.");
                    }
                  }}>Disconnect</button>
              </div>
            ))}
          </>
        )}
        {message && <p role="status">{message}</p>}
      </div>
      <button type="button" onClick={() => setMenuOpen(true)}
        style={{ position: "fixed", right: "20px", bottom: "20px", color: CLIENT_TRAINER_COLOR,
          fontSize: "18px", textDecoration: "none", cursor: "pointer",
          background: "transparent", border: 0, padding: 0, zIndex: 20 }}>
        Return to Menu
      </button>
    </main>
  );
}
