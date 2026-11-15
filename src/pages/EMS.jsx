import TacticalDrillLog from "../components/TacticalDrillLog.jsx";
import EMTParamedicPrep from "./EMTParamedicPrep.jsx";

export default function EMS() {
  return <TacticalDrillLog division="ems" title="EMS Operations" accent="#4da6ff" preparation={[{ value: "academy", label: "EMT/Paramedic Preparation", title: "EMT/Paramedic Prep", component: EMTParamedicPrep }]} sections={['Patient Assessment', 'Airway Management', 'Trauma Response', 'Extraction & Movement', 'Tactical Casualty Care']} />;
}
