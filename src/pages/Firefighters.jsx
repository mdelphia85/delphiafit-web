import TacticalDrillLog from "../components/TacticalDrillLog.jsx";
import FireAcademyPrep from "./FireAcademyPrep.jsx";

export default function Firefighters() {
  return <TacticalDrillLog division="firefighters" title="Firefighter Operations" accent="#ff4d00" preparation={[{ value: "academy", label: "Academy Preparation", title: "Fire Academy Prep", component: FireAcademyPrep }]} sections={['SCBA Endurance', 'Hose Drills', 'Ladder Operations', 'Search & Rescue', 'Forcible Entry', 'Fireground Conditioning']} />;
}
