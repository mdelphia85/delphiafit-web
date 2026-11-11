import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuContext } from "../context/MenuContext.js";
import { ApiError, apiRequest } from "../utils/api.js";

// Dedicated personal-trainer accent: distinct from Coach Hub pink and AI Coach purple.
export const TRAINER_COLOR = "#1EE6C9";

const panel = {
  background: "#111",
  border: "1px solid #303030",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "12px"
};
const field = {
  width: "100%", boxSizing: "border-box", padding: "12px", borderRadius: "6px",
  background: "#181818", color: "#fff", border: "1px solid #555"
};
const btn = {
  cursor: "pointer", background: TRAINER_COLOR, color: "#000",
  border: "none", borderRadius: "6px", fontWeight: "700", padding: "10px 16px"
};

function MainMenuLink() {
  const { setMenuOpen } = useContext(MenuContext);
  return (
    <button
      type="button"
      onClick={() => setMenuOpen(true)}
      style={{ position: "fixed", right: "20px", bottom: "20px", zIndex: 20, fontSize: "18px",
        color: TRAINER_COLOR, background: "transparent", border: 0, padding: 0,
        textDecoration: "underline", cursor: "pointer" }}
    >
      Return to Menu
    </button>
  );
}

export default function TrainerClients() {
  const navigate = useNavigate();
  const [role, setRole] = useState("loading");
  const [status, setStatus] = useState("loading");
  const [clients, setClients] = useState([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(null);

  const load = useCallback(async () => {
    const response = await apiRequest("/trainer/clients");
    setClients(response.clients || []);
  }, []);

  useEffect(() => {
    let active = true;
    apiRequest("/trainer/me")
      .then(async (data) => {
        if (!active) return;
        if (!data.is_trainer) {
          setRole("member");
          setStatus("ready");
          return;
        }
        setRole("trainer");
        try {
          const list = await apiRequest("/trainer/clients");
          if (active) {
            setClients(list.clients || []);
            setStatus("ready");
          }
        } catch (error) {
          if (active) {
            setMessage(error.message || "Unable to load clients.");
            setStatus("error");
          }
        }
      })
      .catch((error) => {
        if (!active) return;
        setRole(error instanceof ApiError && error.status === 401 ? "signed-out" : "error");
        setMessage(error.message || "Unable to verify trainer access.");
        setStatus("error");
      });
    return () => { active = false; };
  }, []);

  async function invite(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const result = await apiRequest("/trainer/clients/invite", {
        method: "POST", body: { email: email.trim() }
      });
      setEmail("");
      setMessage(result.delivery_configured
        ? "Invitation emailed. The client must accept it from My Trainer."
        : "Invitation is pending. Ask your client to open My Trainer in DelphiaFit and accept it.");
      await load();
    } catch (error) {
      setMessage(error.message || "Unable to invite client.");
    } finally {
      setBusy(false);
    }
  }

  async function viewProgress(client) {
    setMessage("");
    try {
      const data = await apiRequest(`/trainer/clients/${client.id}/progress`);
      setProgress({ client, workouts: data.workouts || [] });
    } catch (error) {
      setMessage(error.message || "Unable to view client progress.");
    }
  }

  async function removeClient(client) {
    if (!window.confirm(`Remove ${client.name} from your personal training clients?`)) return;
    setBusy(true);
    setMessage("");
    try {
      await apiRequest(`/trainer/clients/${client.id}`, { method: "DELETE" });
      setProgress(null);
      await load();
      setMessage("Client relationship removed.");
    } catch (error) {
      setMessage(error.message || "Unable to remove client.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ width: "100%", minHeight: "100vh", boxSizing: "border-box",
      background: "#000", color: "#fff", padding: "22px 16px 90px" }}>
      <div style={{ maxWidth: "580px", margin: "0 auto" }}>
        <h1 style={{ color: TRAINER_COLOR, textAlign: "center", margin: "8px 0 4px" }}>My Clients</h1>
        <p style={{ color: "#aaa", textAlign: "center", marginBottom: "24px" }}>
          Personal training clients — separate from Coach Hub teams.
        </p>

        {status === "loading" && <p role="status">Loading trainer access...</p>}
        {role === "member" && (
          <section style={panel}>
            <h2 style={{ color: TRAINER_COLOR, marginTop: 0 }}>Personal Trainer Access</h2>
            <p>Your regular DelphiaFit account is signed in, but personal trainer access hasn't been enabled for this account.</p>
            <p>DelphiaFit administration assigns trainer access. Coach Hub credentials aren't used on this screen.</p>
          </section>
        )}
        {role === "signed-out" && (
          <section style={panel}>
            <p>Sign in to DelphiaFit to access your personal training clients.</p>
            <button type="button" style={btn} onClick={() => navigate("/login")}>Sign In</button>
          </section>
        )}

        {role === "trainer" && (
          <>
            <section style={panel}>
              <h2 style={{ color: TRAINER_COLOR, marginTop: 0, fontSize: "18px" }}>Invite a client</h2>
              <p style={{ color: "#bbb", fontSize: "13px" }}>
                Clients must already have a DelphiaFit account and accept the invitation before you can view their workout history.
              </p>
              <form onSubmit={invite} style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <input aria-label="Client email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Client email address" style={{ ...field, flex: "1 1 230px", minWidth: 0 }} />
                <button type="submit" disabled={busy} style={btn}>{busy ? "Sending..." : "Invite Client"}</button>
              </form>
            </section>
            {status === "ready" && (
              <section aria-label="Personal training clients">
                <h2 style={{ fontSize: "18px", color: TRAINER_COLOR }}>Clients</h2>
                {clients.length === 0 && <p>No clients yet. Invite your first client above.</p>}
                {clients.map((client) => (
                  <div key={client.id} style={panel}>
                    <strong>{client.name}</strong>
                    <div style={{ color: "#bbb", fontSize: "13px", margin: "4px 0" }}>{client.email}</div>
                    <div style={{ color: client.status === "active" ? TRAINER_COLOR : "#ddd", fontSize: "12px", marginBottom: "12px" }}>
                      {client.status === "active" ? "Connected" : "Awaiting client acceptance"}
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {client.status === "active" && (
                        <button type="button" style={btn} onClick={() => viewProgress(client)}>View Progress</button>
                      )}
                      <button type="button" style={{ ...btn, background: "#2a2a2a", color: "#fff" }}
                        disabled={busy} onClick={() => removeClient(client)}>Remove</button>
                    </div>
                  </div>
                ))}
              </section>
            )}
            {progress && (
              <section aria-label="Client progress" style={panel}>
                <h2 style={{ color: TRAINER_COLOR, marginTop: 0, fontSize: "18px" }}>
                  {progress.client.name} — recent workouts
                </h2>
                {progress.workouts.length === 0 && <p>No workouts logged yet.</p>}
                {progress.workouts.map((workout) => (
                  <div key={workout.id} style={{ padding: "8px 0", borderBottom: "1px solid #333" }}>
                    <strong>{workout.name}</strong>
                    <span style={{ color: "#bbb", marginLeft: "8px", fontSize: "12px" }}>
                      {workout.date ? new Date(workout.date).toLocaleDateString() : ""}
                      {" · "}{workout.duration_minutes} min
                    </span>
                  </div>
                ))}
                <button type="button" style={{ ...btn, marginTop: "12px" }} onClick={() => setProgress(null)}>Close Progress</button>
              </section>
            )}
          </>
        )}
        {message && <p role="status">{message}</p>}
      </div>
      <MainMenuLink />
    </main>
  );
}
