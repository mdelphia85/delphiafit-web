import { apiRequest } from "../utils/api.js";

const divisions = ["firefighters", "ems", "police", "military"];

function getDivision(value) {
  if (!divisions.includes(value)) throw new Error("Unknown tactical division");
  return value;
}

export const getFirefighterDrills = () => apiRequest("/tactical/firefighters/logs");
export const createFirefighterDrill = (payload) => apiRequest("/tactical/firefighters/log", { method: "POST", body: payload });
export const updateFirefighterDrill = (id, payload) => apiRequest(`/tactical/firefighters/log/${id}`, { method: "PUT", body: payload });
export const deleteFirefighterDrill = (id) => apiRequest(`/tactical/firefighters/log/${id}`, { method: "DELETE" });

export const getEMSDrills = () => apiRequest("/tactical/ems/logs");
export const createEMSDrill = (payload) => apiRequest("/tactical/ems/log", { method: "POST", body: payload });
export const updateEMSDrill = (id, payload) => apiRequest(`/tactical/ems/log/${id}`, { method: "PUT", body: payload });
export const deleteEMSDrill = (id) => apiRequest(`/tactical/ems/log/${id}`, { method: "DELETE" });

export const getPoliceDrills = () => apiRequest("/tactical/police/logs");
export const createPoliceDrill = (payload) => apiRequest("/tactical/police/log", { method: "POST", body: payload });
export const updatePoliceDrill = (id, payload) => apiRequest(`/tactical/police/log/${id}`, { method: "PUT", body: payload });
export const deletePoliceDrill = (id) => apiRequest(`/tactical/police/log/${id}`, { method: "DELETE" });

export const getMilitaryDrills = () => apiRequest("/tactical/military/logs");
export const createMilitaryDrill = (payload) => apiRequest("/tactical/military/log", { method: "POST", body: payload });
export const updateMilitaryDrill = (id, payload) => apiRequest(`/tactical/military/log/${id}`, { method: "PUT", body: payload });
export const deleteMilitaryDrill = (id) => apiRequest(`/tactical/military/log/${id}`, { method: "DELETE" });

export const tacticalDivisions = divisions.map(getDivision);
