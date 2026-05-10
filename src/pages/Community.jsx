import React, { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

export default function Community() {
  const { setMenuOpen } = useContext(MenuContext);

  const COMMUNITY_COLOR = "purple";

  const [text, setText] = useState("");
  const [posts, setPosts] = useState([]);

  function handlePost() {
    if (!text.trim()) return;

    const newPost = {
      text,
      timestamp: new Date().toLocaleString()
    };

    setPosts([newPost, ...posts]);
    setText("");
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        padding: "20px",
        overflowY: "auto",
        boxSizing: "border-box",
        position: "relative"
      }}
    >
      {/* SHARE PROMPT */}
      <p
        style={{
          color: COMMUNITY_COLOR,
          fontSize: "26px",
          marginBottom: "10px"
        }}
      >
        Share something...
      </p>

      {/* INVISIBLE INPUT (native behavior) */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          backgroundColor: "black",
          border: "none",
          outline: "none",
          color: COMMUNITY_COLOR,
          caretColor: COMMUNITY_COLOR,
          fontSize: "22px",
          marginBottom: "20px"
        }}
      />

      {/* POST BUTTON */}
      <p
        onClick={handlePost}
        style={{
          color: COMMUNITY_COLOR,
          fontSize: "26px",
          textAlign: "center",
          textDecoration: "underline",
          cursor: "pointer",
          marginBottom: "30px"
        }}
      >
        Post
      </p>

      {/* FEED (native: no header, no placeholder) */}
      {posts.map((p, index) => (
        <p
          key={index}
          style={{
            color: "white",
            fontSize: "20px",
            marginBottom: "20px"
          }}
        >
          {p.text}
        </p>
      ))}

      {/* RETURN TO MENU */}
      <p
        onClick={() => setMenuOpen(true)}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          color: COMMUNITY_COLOR,
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
