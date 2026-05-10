import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import DelphiaLogo from "../assets/DelphiaDesigns.jpg";

export default function About() {
  const { setMenuOpen } = useContext(MenuContext);

  const ABOUT_COLOR = "dodgerblue";

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        padding: "20px",
        overflowY: "auto",
        boxSizing: "border-box",
        position: "relative",
        textAlign: "center"
      }}
    >
      {/* LOGO IMAGE */}
      <img
        src={DelphiaLogo}
        alt="Delphia Designs Logo"
        style={{
          width: "140px",
          height: "140px",
          objectFit: "contain",
          marginTop: "10px",
          marginBottom: "10px"
        }}
      />

      {/* LOGO TEXT */}
      <p
        style={{
          color: ABOUT_COLOR,
          fontSize: "20px",
          marginTop: "0px",
          marginBottom: "40px"
        }}
      >
        DELPHIA DESIGNS
      </p>

      {/* TITLE */}
      <p
        style={{
          color: ABOUT_COLOR,
          fontSize: "28px",
          marginBottom: "20px"
        }}
      >
        About Delphia Health & Fitness
      </p>

      {/* BODY TEXT */}
      <p
        style={{
          color: ABOUT_COLOR,
          fontSize: "20px",
          textAlign: "left",
          lineHeight: "28px",
          marginBottom: "40px"
        }}
      >
        Delphia Health & Fitness was created because people shouldn’t need five
        different apps just to manage one fitness journey. Most apps only track
        a single piece of your health — calories, workouts, water, supplements,
        sports, or goals — forcing you to juggle multiple tools that don’t talk
        to each other. The Delphia Health and Fitness app brings everything
        together in one clean, unified system.
        <br />
        <br />
        The mission is simple: give users a complete, unified fitness experience
        without clutter, confusion, or app-hopping.
        <br />
        <br />
        This app was created and is owned by Delphia Designs LLC.
      </p>

      {/* CONTACT */}
      <p
        style={{
          color: ABOUT_COLOR,
          fontSize: "24px",
          marginBottom: "10px"
        }}
      >
        Contact & Feature Requests
      </p>

      <p
        style={{
          color: ABOUT_COLOR,
          fontSize: "20px",
          marginBottom: "60px"
        }}
      >
        DelphiaDesigns@gmail.com
      </p>

      {/* RETURN TO MENU */}
      <p
        onClick={() => setMenuOpen(true)}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          color: ABOUT_COLOR,
          fontSize: "22px",
          textDecoration: "underline",
          cursor: "pointer"
        }}
      >
        Return to Menu
      </p>
    </div>
  );
}
