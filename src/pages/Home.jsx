import { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import homescreen from "../assets/homescreen.png";
import menuImage from "../assets/menu.png";

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
      <img
        src={menuImage}
        alt="Menu"
        onClick={() => setMenuOpen(true)}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          width: 120,
          height: 120,
          objectFit: "contain",
          cursor: "pointer",
          zIndex: 20
        }}
      />
    </div>
  );
}
