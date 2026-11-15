import TacticalDrillLog from "../components/TacticalDrillLog.jsx";
import MilitaryBootcampPrep from "./MilitaryBootcampPrep.jsx";
import SOFSelectionPrep from "./SOFSelectionPrep.jsx";

export default function Military() {
  return <TacticalDrillLog division="military" title="Military Operations" accent="#6b8e23" preparation={[{ value: "academy", label: "Bootcamp Preparation", title: "Military Bootcamp Prep", component: MilitaryBootcampPrep }, { value: "sof", label: "SOF Selection Preparation", title: "SOF Selection Prep", component: SOFSelectionPrep }]} sections={['Physical Conditioning', 'Weapons Handling', 'Tactical Movement', 'Rucking & Loadout', 'Small Unit Tactics', 'Combat Conditioning']} />;
}
