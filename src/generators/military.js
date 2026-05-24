// Military generator (deterministic, structured)

export function generateMilitaryDrill(input) {
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

  const name = buildMilitaryName(focus, scenarioType, environment);
  const description = buildMilitaryDescription({
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
    duration: input.duration || "45",
    intensity: input.intensity || "High",
    focus: input.focus || "Combat Conditioning",
    environment: input.environment || "Field",
    gearLoad: input.gearLoad || "Full Combat Load",
    objective: input.objective || "Endurance",
    teamSize: input.teamSize || "4",
    equipment: input.equipment || "Ruck, Rifle (Training), Sandbags",
    weather: input.weather || "Clear",
    scenarioType: input.scenarioType || "Patrol",
    threatLevel: input.threatLevel || "Moderate",
    obstacles: input.obstacles || "Hills, Barriers",
    hazards: input.hazards || "Heat, Fatigue"
  };
}

function buildMilitaryName(focus, scenarioType, environment) {
  const baseFocus = focus || "Combat Conditioning";
  const baseScenario = scenarioType || "Patrol";
  const baseEnv = environment || "Field";

  return `${baseEnv} ${baseFocus} — ${baseScenario} Drill`;
}

function buildMilitaryDescription({
  focus,
  environment,
  gearLoad,
  objective,
  teamSize,
  scenarioType,
  threatLevel
}) {
  const f = focus || "Combat Conditioning";
  const env = environment || "Field";
  const gear = gearLoad || "Full Combat Load";
  const obj = objective || "Endurance";
  const team = teamSize || "4";
  const scen = scenarioType || "Patrol";
  const threat = threatLevel || "Moderate";

  return (
    `Structured military training evolution focused on ${f.toLowerCase()} in a ` +
    `${env.toLowerCase()} setting. Personnel operate under ${gear.toLowerCase()}, ` +
    `with the primary objective of ${obj.toLowerCase()}. The drill is executed as a ` +
    `team of ${team}, moving through a ${scen.toLowerCase()} scenario at a ` +
    `${threat.toLowerCase()} threat level. Movements, formations, and task loads ` +
    `are organized to reinforce discipline, communication, and mission execution ` +
    `under controlled but realistic conditions.`
  );
}
