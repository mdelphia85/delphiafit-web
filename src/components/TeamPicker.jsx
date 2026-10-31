import { inputStyle } from "./coachStyles.js";

export default function TeamPicker({ teams, value, onChange }) {
  if (teams.length < 2) return null;
  return (
    <select aria-label="Team" value={value} onChange={(event) => onChange(event.target.value)} style={{ ...inputStyle, marginBottom: "14px" }}>
      {teams.map((team) => (
        <option key={team.id} value={team.id}>
          {team.name}
        </option>
      ))}
    </select>
  );
}
