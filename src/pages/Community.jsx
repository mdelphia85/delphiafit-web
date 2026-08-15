import React, { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const initialFriends = [
  { name: "Ava Thompson", streak: 12, status: "Training today", following: true },
  { name: "Marcus Lee", streak: 9, status: "Meal logged", following: true },
  { name: "Jasmine Cruz", streak: 18, status: "New PR", following: false },
  { name: "Daniel Ortiz", streak: 6, status: "Rest day", following: false }
];

const profileCards = [
  { name: "Ava Thompson", focus: "Strength", wins: "3 PRs this month" },
  { name: "Marcus Lee", focus: "Endurance", wins: "12-mile weekend run" },
  { name: "Jasmine Cruz", focus: "Hybrid", wins: "21 day streak" },
  { name: "Daniel Ortiz", focus: "Recovery", wins: "Best sleep score" }
];

const initialPosts = [
  {
    text: "Finished a 30 minute strength block and felt great.",
    timestamp: "2h ago",
    reactions: { like: 9, fire: 3, support: 4 },
    comments: [
      { user: "Marcus", text: "Nice work!" },
      { user: "Jasmine", text: "That consistency is paying off." }
    ]
  },
  {
    text: "Logged my protein goal for the day. Keep it moving.",
    timestamp: "5h ago",
    reactions: { like: 12, fire: 2, support: 8 },
    comments: [{ user: "Ava", text: "Solid effort." }]
  },
  {
    text: "Weekend challenge is on — who is in?",
    timestamp: "Yesterday",
    reactions: { like: 16, fire: 5, support: 7 },
    comments: [{ user: "Daniel", text: "I’m in." }]
  }
];

export default function Community() {
  const { setMenuOpen } = useContext(MenuContext);

  const COMMUNITY_COLOR = "purple";

  const [text, setText] = useState("");
  const [posts, setPosts] = useState(initialPosts);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedProfile, setSelectedProfile] = useState(profileCards[0]);
  const [commentDrafts, setCommentDrafts] = useState({});

  function handlePost() {
    if (!text.trim()) return;

    const newPost = {
      text,
      timestamp: "Just now",
      reactions: { like: 0, fire: 0, support: 0 },
      comments: []
    };

    setPosts([newPost, ...posts]);
    setText("");
  }

  function handleReaction(index, key) {
    setPosts(prev =>
      prev.map((post, i) => {
        if (i !== index) return post;

        return {
          ...post,
          reactions: {
            ...post.reactions,
            [key]: (post.reactions[key] || 0) + 1
          }
        };
      })
    );
  }

  function handleCommentSubmit(index) {
    const draft = (commentDrafts[index] || "").trim();
    if (!draft) return;

    setPosts(prev =>
      prev.map((post, i) => {
        if (i !== index) return post;

        return {
          ...post,
          comments: [...post.comments, { user: "You", text: draft }]
        };
      })
    );

    setCommentDrafts(prev => ({ ...prev, [index]: "" }));
  }

  function toggleFollow(name) {
    setFriends(prev =>
      prev.map(friend =>
        friend.name === name
          ? { ...friend, following: !friend.following }
          : friend
      )
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "black",
        padding: "20px 20px 90px",
        overflowY: "auto",
        boxSizing: "border-box",
        position: "relative",
        color: "white"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div>
          <p style={{ color: COMMUNITY_COLOR, fontSize: "28px", margin: "0 0 12px" }}>
            Community
          </p>

          <div
            style={{
              background: "#111",
              border: `1px solid ${COMMUNITY_COLOR}`,
              borderRadius: "12px",
              padding: "12px 14px"
            }}
          >
            <div style={{ color: "#ddd", fontSize: "15px", marginBottom: "8px" }}>
              Featured profile
            </div>
            <div style={{ color: COMMUNITY_COLOR, fontSize: "22px", fontWeight: "700" }}>
              {selectedProfile.name}
            </div>
            <div style={{ color: "#ddd", fontSize: "16px", marginTop: "6px" }}>
              {selectedProfile.focus}
            </div>
            <div style={{ color: "#ddd", fontSize: "15px", marginTop: "10px" }}>
              {selectedProfile.wins}
            </div>
          </div>
        </div>

        <div>
          <p style={{ color: COMMUNITY_COLOR, fontSize: "24px", margin: "0 0 12px" }}>
            Friends
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {friends.map(friend => (
              <div
                key={friend.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#111",
                  borderRadius: "10px",
                  padding: "10px 12px",
                  border: "1px solid #333"
                }}
              >
                <div>
                  <div style={{ color: "white", fontSize: "18px", fontWeight: "600" }}>
                    {friend.name}
                  </div>
                  <div style={{ color: "#ddd", fontSize: "14px" }}>
                    {friend.status}
                  </div>
                  <div style={{ color: COMMUNITY_COLOR, fontSize: "13px", marginTop: "2px" }}>
                    {friend.streak} day streak
                  </div>
                </div>

                <button
                  onClick={() => toggleFollow(friend.name)}
                  style={{
                    background: friend.following ? "transparent" : COMMUNITY_COLOR,
                    color: friend.following ? COMMUNITY_COLOR : "black",
                    border: `1px solid ${COMMUNITY_COLOR}`,
                    borderRadius: "999px",
                    padding: "7px 12px",
                    cursor: "pointer",
                    fontWeight: "700"
                  }}
                >
                  {friend.following ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p style={{ color: COMMUNITY_COLOR, fontSize: "24px", margin: "0 0 12px" }}>
            Profiles
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {profileCards.map(profile => (
              <div
                key={profile.name}
                onClick={() => setSelectedProfile(profile)}
                style={{
                  background: selectedProfile.name === profile.name ? "#1b1b1b" : "#111",
                  border: `1px solid ${selectedProfile.name === profile.name ? COMMUNITY_COLOR : "#333"}`,
                  borderRadius: "10px",
                  padding: "12px",
                  cursor: "pointer"
                }}
              >
                <div style={{ color: "white", fontSize: "18px", fontWeight: "600" }}>
                  {profile.name}
                </div>
                <div style={{ color: "#ddd", fontSize: "14px", marginTop: "4px" }}>
                  {profile.focus}
                </div>
                <div style={{ color: COMMUNITY_COLOR, fontSize: "13px", marginTop: "6px" }}>
                  {profile.wins}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p style={{ color: COMMUNITY_COLOR, fontSize: "26px", marginBottom: "10px" }}>
            Share something...
          </p>

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

          {posts.map((p, index) => (
            <div
              key={index}
              style={{
                background: "#111",
                border: "1px solid #333",
                borderRadius: "10px",
                padding: "12px 14px",
                marginBottom: "14px"
              }}
            >
              <div style={{ color: "white", fontSize: "18px", marginBottom: "6px" }}>
                {p.text}
              </div>
              <div style={{ color: "#aaa", fontSize: "12px", marginBottom: "10px" }}>
                {p.timestamp}
              </div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                {Object.entries(p.reactions || {}).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handleReaction(index, key)}
                    style={{
                      background: "transparent",
                      border: `1px solid ${COMMUNITY_COLOR}`,
                      color: COMMUNITY_COLOR,
                      borderRadius: "999px",
                      padding: "4px 8px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    {key} {value}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: "10px" }}>
                <input
                  type="text"
                  value={commentDrafts[index] || ""}
                  onChange={e =>
                    setCommentDrafts(prev => ({
                      ...prev,
                      [index]: e.target.value
                    }))
                  }
                  placeholder="Write a comment..."
                  style={{
                    width: "100%",
                    background: "#000",
                    color: "white",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    padding: "8px 10px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />

                <div
                  onClick={() => handleCommentSubmit(index)}
                  style={{
                    color: COMMUNITY_COLOR,
                    fontSize: "14px",
                    textDecoration: "underline",
                    cursor: "pointer",
                    marginTop: "8px"
                  }}
                >
                  Comment
                </div>
              </div>

              {(p.comments || []).length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {(p.comments || []).map((comment, commentIndex) => (
                    <div
                      key={commentIndex}
                      style={{
                        background: "#000",
                        borderRadius: "8px",
                        padding: "8px 10px",
                        border: "1px solid #222"
                      }}
                    >
                      <span style={{ color: COMMUNITY_COLOR, fontWeight: "700" }}>{comment.user}: </span>
                      <span style={{ color: "#ddd" }}>{comment.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <p
        onClick={() => setMenuOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          color: COMMUNITY_COLOR,
          fontSize: "22px",
          textDecoration: "underline",
          cursor: "pointer",
          zIndex: 20
        }}
      >
        Return to Menu
      </p>
    </div>
  );
}
