// Police generator (deterministic, structured)

export function generatePoliceDrill(input) {
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

  const name = buildPoliceName(focus, scenarioType, environment);
  const description = buildPoliceDescription({
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
    focus: input.focus || "Police Conditioning",
    environment: input.environment || "Urban",
    gearLoad: input.gearLoad || "Duty Belt",
    objective: input.objective || "Control",
    teamSize: input.teamSize || "2",
    equipment: input.equipment || "Training Weapon, Pads, Cones",
    weather: input.weather || "Clear",
    scenarioType: input.scenarioType || "Traffic Stop",
    threatLevel: input.threatLevel || "Moderate",
    obstacles: input.obstacles || "Vehicles, Corners",
    hazards: input.hazards || "Low Visibility, Stress"
  };
}

function buildPoliceName(focus, scenarioType, environment) {
  const baseFocus = focus || "Police Conditioning";
  const baseScenario = scenarioType || "Traffic Stop";
  const baseEnv = environment || "Urban";

  return `${baseEnv} ${baseFocus} — ${baseScenario} Scenario`;
}

function buildPoliceDescription({
  focus,
  environment,
  gearLoad,
  objective,
  teamSize,
  scenarioType,
  threatLevel
}) {
  const f = focus || "Police Conditioning";
  const env = environment || "Urban";
  const gear = gearLoad || "Duty Belt";
  const obj = objective || "Control";
  const team = teamSize || "2";
  const scen = scenarioType || "Traffic Stop";
  const threat = threatLevel || "Moderate";

  return (
    `Structured law enforcement training drill focused on ${f.toLowerCase()} ` +
    `in a ${env.toLowerCase()} environment. Officers operate in ${gear.toLowerCase()}, ` +
    `with a primary objective of ${obj.toLowerCase()}. The drill is executed as a ` +
    `team of ${team}, working through a ${scen.toLowerCase()} scenario at a ` +
    `${threat.toLowerCase()} threat level. The sequence emphasizes communication, ` +
    `positioning, use of cover, and controlled decision-making under realistic but ` +
    `managed conditions.`
  );
}
