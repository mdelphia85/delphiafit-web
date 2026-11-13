import { useContext } from "react";
import { MenuContext } from "../context/MenuContext.js";
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
      {/* Keep the original home-screen artwork unchanged; label its split 20 / 25 founding year. */}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1024 1024"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none"
        }}
      >
        <defs>
          <clipPath id="delphiafit-year-only">
            <rect x="164" y="546" width="88" height="66" />
            <rect x="766" y="546" width="92" height="66" />
          </clipPath>
          <filter id="delphiafit-pearl-blue" colorInterpolationFilters="sRGB">
            <feColorMatrix type="hueRotate" values="218" />
            <feColorMatrix type="saturate" values="0.85" />
          </filter>
        </defs>
        {/* Color only the original 20 and 25 numerals; preserve the rest of the logo. */}
        <image
          href={homescreen}
          width="1024"
          height="1024"
          clipPath="url(#delphiafit-year-only)"
          filter="url(#delphiafit-pearl-blue)"
        />
        <text
          x="210"
          y="542"
          textAnchor="middle"
          fill="#000"
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fontSize="22"
        >
          Est.
        </text>
      </svg>
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
