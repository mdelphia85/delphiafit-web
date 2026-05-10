import { NavLink } from "react-router-dom";
import "./BottomNav.css";

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard">🏠</NavLink>
      <NavLink to="/protein">🥩</NavLink>
      <NavLink to="/water">💧</NavLink>
      <NavLink to="/meals">🍽️</NavLink>
      <NavLink to="/calories">🔥</NavLink>
      <NavLink to="/profile">👤</NavLink>
      <NavLink to="/history">📅</NavLink>
    </nav>
  );
}
