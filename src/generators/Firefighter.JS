// Firefighter generator (deterministic, structured)

export function generateFirefighterDrill(input) {
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

  const name = buildFirefighterName(focus, scenarioType, environment);
  const description = buildFirefighterDescription({
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
    focus: input.focus || "Fireground Conditioning",
    environment: input.environment || "Urban",
    gearLoad: input.gearLoad || "Full Turnout Gear",
    objective: input.objective || "Endurance",
    teamSize: input.teamSize || "2",
    equipment: input.equipment || "Hose, Ladder, Dummy",
    weather: input.weather || "Clear",
    scenarioType: input.scenarioType || "Fireground Operations",
    threatLevel: input.threatLevel || "Moderate",
    obstacles: input.obstacles || "Stairs, Doors",
    hazards: input.hazards || "Heat, Smoke"
  };
}

function buildFirefighterName(focus, scenarioType, environment) {
  const baseFocus = focus || "Fireground Conditioning";
  const baseScenario = scenarioType || "Fireground Operations";
  const baseEnv = environment || "Urban";

  return `${baseEnv} ${baseFocus} — ${baseScenario}`;
}

function buildFirefighterDescription({
  focus,
  environment,
  gearLoad,
  objective,
  teamSize,
  scenarioType,
  threatLevel
}) {
  const f = focus || "Fireground Conditioning";
  const env = environment || "Urban";
  const gear = gearLoad || "Full Turnout Gear";
  const obj = objective || "Endurance";
  const team = teamSize || "2";
  const scen = scenarioType || "Fireground Operations";
  const threat = threatLevel || "Moderate";

  return (
    `Structured firefighter training drill focused on ${f.toLowerCase()} in a ` +
    `${env.toLowerCase()} environment. Firefighters operate in ${gear.toLowerCase()}, ` +
    `with a primary objective of ${obj.toLowerCase()}. The drill is executed as a ` +
    `team of ${team} working through a ${scen.toLowerCase()} scenario under a ` +
    `${threat.toLowerCase()} threat level. Movements, tasks, and work cycles are ` +
    `organized to simulate realistic fireground demands while maintaining strict ` +
    `control, communication, and safety protocols.`
  );
}
