import { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import homescreen from "../assets/homescreen.png";

export default function Home() {
  const { setMenuOpen } = useContext(MenuContext);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${homescreen})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
        position: "relative"
      }}
    >
      <button
        onClick={() => setMenuOpen(true)}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          padding: "12px 22px",
          fontSize: 20,
          fontWeight: 600,
          backgroundColor: "black",
          color: "white",
          border: "2px solid white",
          borderRadius: 10,
          cursor: "pointer",
          zIndex: 20
        }}
      >
        Menu
      </button>
    </div>
  );
}
