// EMS generator (deterministic, structured)

export function generateEMSDrill(input) {
  const {
    duration,
    intensity,
    focus,
    environment,
    gearLoad,
    objective,
    teamSize,
    equipment,
    weather,
    scenarioType,
    threatLevel,
    obstacles,
    hazards
  } = normalizeInput(input);

  const name = buildEMSName(focus, scenarioType, environment);
  const description = buildEMSDescription({
    focus,
    environment,
    gearLoad,
    objective,
    teamSize,
    scenarioType,
    threatLevel
  });

  return {
    name,
    description,
    duration,
    intensity,
    focus,
    environment,
    gearLoad,
    objective,
    teamSize,
    equipment,
    weather,
    scenarioType,
    threatLevel,
    obstacles,
    hazards
  };
}

function normalizeInput(input) {
  return {
    duration: input.duration || "30",
    intensity: input.intensity || "Medium",
    focus: input.focus || "EMS Conditioning",
    environment: input.environment || "Urban",
    gearLoad: input.gearLoad || "Medical Bag, Stretcher",
    objective: input.objective || "Coordination",
    teamSize: input.teamSize || "2",
    equipment: input.equipment || "Stretcher, Backboard, Bags",
    weather: input.weather || "Clear",
    scenarioType: input.scenarioType || "Extraction",
    threatLevel: input.threatLevel || "Moderate",
    obstacles: input.obstacles || "Stairs, Narrow Hallways",
    hazards: input.hazards || "Patient Weight, Limited Access"
  };
}

function buildEMSName(focus, scenarioType, environment) {
  const baseFocus = focus || "EMS Conditioning";
  const baseScenario = scenarioType || "Extraction";
  const baseEnv = environment || "Urban";

  return `${baseEnv} ${baseFocus} — ${baseScenario} Drill`;
}

function buildEMSDescription({
  focus,
  environment,
  gearLoad,
  objective,
  teamSize,
  scenarioType,
  threatLevel
}) {
  const f = focus || "EMS Conditioning";
  const env = environment || "Urban";
  const gear = gearLoad || "Medical Bag, Stretcher";
  const obj = objective || "Coordination";
  const team = teamSize || "2";
  const scen = scenarioType || "Extraction";
  const threat = threatLevel || "Moderate";

  return (
    `Structured EMS training drill focused on ${f.toLowerCase()} in a ` +
    `${env.toLowerCase()} environment. Crews operate with ${gear.toLowerCase()}, ` +
    `with a primary objective of ${obj.toLowerCase()}. The drill is executed as a ` +
    `team of ${team}, working through a ${scen.toLowerCase()} scenario at a ` +
    `${threat.toLowerCase()} threat level. The sequence emphasizes safe patient ` +
    `handling, communication, movement coordination, and scene management under ` +
    `controlled but realistic operational conditions.`
  );
}
