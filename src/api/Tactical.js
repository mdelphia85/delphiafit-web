const BASE_URL = "https://api.delphiafit.com"; // ← update if needed

// -----------------------------
// FIREFIGHTERS
// -----------------------------
export async function getFirefighterDrills() {
  const res = await fetch(`${BASE_URL}/tactical/firefighters/logs`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to load firefighter drills");
  return res.json();
}

export async function createFirefighterDrill(payload) {
  const res = await fetch(`${BASE_URL}/tactical/firefighters/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to create firefighter drill");
  return res.json();
}

export async function updateFirefighterDrill(id, payload) {
  const res = await fetch(`${BASE_URL}/tactical/firefighters/log/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to update firefighter drill");
  return res.json();
}

export async function deleteFirefighterDrill(id) {
  const res = await fetch(`${BASE_URL}/tactical/firefighters/log/${id}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to delete firefighter drill");
  return res.json();
}

// -----------------------------
// EMS
// -----------------------------
export async function getEMSDrills() {
  const res = await fetch(`${BASE_URL}/tactical/ems/logs`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to load EMS drills");
  return res.json();
}

export async function createEMSDrill(payload) {
  const res = await fetch(`${BASE_URL}/tactical/ems/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to create EMS drill");
  return res.json();
}

export async function updateEMSDrill(id, payload) {
  const res = await fetch(`${BASE_URL}/tactical/ems/log/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to update EMS drill");
  return res.json();
}

export async function deleteEMSDrill(id) {
  const res = await fetch(`${BASE_URL}/tactical/ems/log/${id}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to delete EMS drill");
  return res.json();
}

// -----------------------------
// POLICE
// -----------------------------
export async function getPoliceDrills() {
  const res = await fetch(`${BASE_URL}/tactical/police/logs`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to load police drills");
  return res.json();
}

export async function createPoliceDrill(payload) {
  const res = await fetch(`${BASE_URL}/tactical/police/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to create police drill");
  return res.json();
}

export async function updatePoliceDrill(id, payload) {
  const res = await fetch(`${BASE_URL}/tactical/police/log/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to update police drill");
  return res.json();
}

export async function deletePoliceDrill(id) {
  const res = await fetch(`${BASE_URL}/tactical/police/log/${id}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to delete police drill");
  return res.json();
}

// -----------------------------
// MILITARY
// -----------------------------
export async function getMilitaryDrills() {
  const res = await fetch(`${BASE_URL}/tactical/military/logs`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to load military drills");
  return res.json();
}

export async function createMilitaryDrill(payload) {
  const res = await fetch(`${BASE_URL}/tactical/military/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to create military drill");
  return res.json();
}

export async function updateMilitaryDrill(id, payload) {
  const res = await fetch(`${BASE_URL}/tactical/military/log/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to update military drill");
  return res.json();
}

export async function deleteMilitaryDrill(id) {
  const res = await fetch(`${BASE_URL}/tactical/military/log/${id}`, {
    method: "DELETE",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to delete military drill");
  return res.json();
}
