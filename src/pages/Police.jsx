import TacticalDrillLog from "../components/TacticalDrillLog.jsx";
import PoliceAcademyPrep from "./PoliceAcademyPrep.jsx";
import SWATSelectionPrep from "./SWATSelectionPrep.jsx";

export default function Police() {
  return <TacticalDrillLog division="police" title="Police Operations" accent="#1e90ff" preparation={[{ value: "academy", label: "Academy Preparation", title: "Police Academy Prep", component: PoliceAcademyPrep }, { value: "swat", label: "SWAT Selection Preparation", title: "SWAT Selection Prep", component: SWATSelectionPrep }]} sections={['Patrol Skills', 'Traffic Stops', 'Use of Force', 'Building Search', 'Tactical Movement']} />;
}
