import TacticalDrillLog from "../components/TacticalDrillLog.jsx";

export default function Police() {
  return <TacticalDrillLog division="police" title="Police Operations" accent="#1e90ff" sections={['Patrol Skills', 'Traffic Stops', 'Use of Force', 'Building Search', 'Tactical Movement']} />;
}
