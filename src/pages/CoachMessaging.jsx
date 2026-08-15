import React, { useContext, useEffect, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";
import { readJson, writeJson } from "../utils/dataPersistence.js";

const defaultConversations = [
  { id: 1, name: "Alex Johnson", lastMessage: "How was my workout?", time: "2 min ago", unread: true },
  { id: 2, name: "Sarah Chen", lastMessage: "Thanks for the feedback!", time: "1 hour ago", unread: false },
  { id: 3, name: "Mike Davis", lastMessage: "Can we adjust the plan?", time: "3 hours ago", unread: false }
];

const defaultMessages = {
  1: [
    { id: 1, sender: "Alex", text: "How was my workout?", time: "2 min ago" },
    { id: 2, sender: "Coach", text: "Great effort! Focus on form next time.", time: "1 min ago" }
  ],
  2: [
    { id: 1, sender: "Sarah", text: "Thanks for the feedback!", time: "1 hour ago" },
    { id: 2, sender: "Coach", text: "Glad to help. Keep the consistency up.", time: "58 min ago" }
  ],
  3: [
    { id: 1, sender: "Mike", text: "Can we adjust the plan?", time: "3 hours ago" },
    { id: 2, sender: "Coach", text: "Yes — I’ll revise your volume this week.", time: "2 hours ago" }
  ]
};

export default function CoachMessaging() {
  const { setMenuOpen } = useContext(MenuContext);
  const [conversations, setConversations] = useState(() => readJson("delphia-conversations", defaultConversations));
  const [selectedChat, setSelectedChat] = useState(() => readJson("delphia-selected-chat", null));
  const [messagesByChat, setMessagesByChat] = useState(() => readJson("delphia-chat-messages", defaultMessages));
  const [newMessage, setNewMessage] = useState("");

  const COACH_COLOR = "#ec4899";
  const BLACK = "#000";
  const WHITE = "#fff";

  useEffect(() => writeJson("delphia-conversations", conversations), [conversations]);
  useEffect(() => writeJson("delphia-selected-chat", selectedChat), [selectedChat]);
  useEffect(() => writeJson("delphia-chat-messages", messagesByChat), [messagesByChat]);

  const activeMessages = selectedChat ? messagesByChat[selectedChat.id] || [] : [];

  function selectChat(conv) {
    setSelectedChat(conv);
    setConversations((prev) =>
      prev.map((item) =>
        item.id === conv.id ? { ...item, unread: false } : item
      )
    );
  }

  const handleSendMessage = () => {
    if (!selectedChat || !newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      sender: "Coach",
      text: newMessage.trim(),
      time: "now"
    };

    setMessagesByChat((prev) => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), msg]
    }));

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedChat.id
          ? { ...conv, lastMessage: msg.text, time: "now", unread: false }
          : conv
      )
    );

    setNewMessage("");
  };

  return (
    <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: BLACK, padding: "16px 16px 90px", boxSizing: "border-box", display: "flex", justifyContent: "center", overflowY: "auto", color: WHITE }}>
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: COACH_COLOR, fontSize: "28px", fontWeight: "700" }}>💬 Messages</div>
        </div>

        {!selectedChat ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {conversations.map((conv) => (
              <div key={conv.id} onClick={() => selectChat(conv)} style={{ background: "#111", border: `1px solid ${conv.unread ? COACH_COLOR : "#2a2a2a"}`, borderRadius: "12px", padding: "14px", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = COACH_COLOR)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = conv.unread ? COACH_COLOR : "#2a2a2a")}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <div style={{ fontWeight: "600" }}>{conv.name}</div>
                  <div style={{ fontSize: "11px", color: "#999" }}>{conv.time}</div>
                </div>
                <div style={{ fontSize: "13px", color: "#bbb" }}>{conv.lastMessage}</div>
                {conv.unread && <div style={{ marginTop: "8px", width: "8px", height: "8px", background: COACH_COLOR, borderRadius: "50%" }} />}
              </div>
            ))}
          </div>
        ) : (
          <>
            <button onClick={() => setSelectedChat(null)} style={{ padding: "12px", background: "#222", color: WHITE, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", marginBottom: "20px", width: "100%" }}>
              ← Back
            </button>

            <div style={{ background: "#111", borderRadius: "12px", padding: "14px", marginBottom: "16px", minHeight: "300px", display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" }}>
              {activeMessages.map((msg) => (
                <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender === "Coach" ? "flex-end" : "flex-start" }}>
                  <div style={{ background: msg.sender === "Coach" ? COACH_COLOR : "#222", color: msg.sender === "Coach" ? BLACK : WHITE, borderRadius: "12px", padding: "10px 12px", maxWidth: "80%", fontSize: "13px" }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: "10px", background: "#111", border: `1px solid #2a2a2a`, borderRadius: "8px", color: WHITE, fontSize: "12px", boxSizing: "border-box" }} onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} />
              <button onClick={handleSendMessage} style={{ padding: "10px 16px", background: COACH_COLOR, color: BLACK, border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                Send
              </button>
            </div>
          </>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: "40px", background: BLACK, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 16px", boxSizing: "border-box", zIndex: 20 }}>
        <div style={{ color: COACH_COLOR, fontSize: "18px", textDecoration: "underline", cursor: "pointer" }} onClick={() => setMenuOpen(true)}>
          Return to Menu
        </div>
      </div>
    </div>
  );
}
