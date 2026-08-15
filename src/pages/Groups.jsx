import React, { useContext, useState } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const initialGroups = [
  { id: 1, name: "Fitness Warriors", members: 24, icon: "⚔️", role: "admin" },
  { id: 2, name: "Morning Runners", members: 18, icon: "🏃", role: "member" },
  { id: 3, name: "Gym Crew", members: 42, icon: "💪", role: "member" },
  { id: 4, name: "Nutrition Nerds", members: 12, icon: "🥗", role: "member" }
];

const suggestedGroups = [
  { id: 5, name: "CrossFit Champions", members: 67, icon: "🏋️" },
  { id: 6, name: "Yoga Vibes", members: 31, icon: "🧘" },
  { id: 7, name: "Marathon Training", members: 9, icon: "🏅" }
];

export default function Groups() {
  const { setMenuOpen } = useContext(MenuContext);
  const [groups, setGroups] = useState(initialGroups);
  const [view, setView] = useState("my-groups");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupIcon, setNewGroupIcon] = useState("👥");
  const [selectedGroup, setSelectedGroup] = useState(null);

  const GROUPS_COLOR = "#ff6b6b";
  const BLACK = "#000";
  const WHITE = "#fff";

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: groups.length + 10,
        name: newGroupName,
        members: 1,
        icon: newGroupIcon,
        role: "admin"
      };
      setGroups([...groups, newGroup]);
      setNewGroupName("");
      setNewGroupIcon("👥");
    }
  };

  const handleJoinGroup = (group) => {
    const updatedGroups = [...groups, { ...group, role: "member" }];
    setGroups(updatedGroups);
  };

  const handleLeaveGroup = (groupId) => {
    setGroups(groups.filter((g) => g.id !== groupId));
    setSelectedGroup(null);
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: BLACK,
        padding: "16px 16px 90px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        overflowY: "auto",
        color: WHITE
      }}
    >
      <div style={{ width: "360px", maxWidth: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: GROUPS_COLOR, fontSize: "28px", fontWeight: "700" }}>👥 Groups</div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <button
            onClick={() => setView("my-groups")}
            style={{
              flex: 1,
              padding: "12px",
              background: view === "my-groups" ? GROUPS_COLOR : "#222",
              color: view === "my-groups" ? BLACK : WHITE,
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            My Groups
          </button>
          <button
            onClick={() => setView("create")}
            style={{
              flex: 1,
              padding: "12px",
              background: view === "create" ? GROUPS_COLOR : "#222",
              color: view === "create" ? BLACK : WHITE,
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Create
          </button>
          <button
            onClick={() => setView("discover")}
            style={{
              flex: 1,
              padding: "12px",
              background: view === "discover" ? GROUPS_COLOR : "#222",
              color: view === "discover" ? BLACK : WHITE,
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Discover
          </button>
        </div>

        {/* My Groups View */}
        {view === "my-groups" && !selectedGroup && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {groups.length === 0 ? (
              <div style={{ color: "#999", textAlign: "center", padding: "20px" }}>
                No groups yet. Create one or discover groups to join!
              </div>
            ) : (
              groups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  style={{
                    background: "#111",
                    border: `1px solid #2a2a2a`,
                    borderRadius: "12px",
                    padding: "14px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "border-color 0.2s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = GROUPS_COLOR)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
                >
                  <div>
                    <div style={{ fontSize: "20px", marginBottom: "4px" }}>{group.icon}</div>
                    <div style={{ fontSize: "16px", fontWeight: "600" }}>{group.name}</div>
                    <div style={{ fontSize: "12px", color: "#999" }}>
                      {group.members} members • {group.role}
                    </div>
                  </div>
                  <div style={{ fontSize: "24px", color: GROUPS_COLOR }}>→</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Selected Group Detail View */}
        {view === "my-groups" && selectedGroup && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <button
              onClick={() => setSelectedGroup(null)}
              style={{
                padding: "12px",
                background: "#222",
                color: WHITE,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              ← Back
            </button>

            <div
              style={{
                background: "#111",
                border: `2px solid ${GROUPS_COLOR}`,
                borderRadius: "12px",
                padding: "16px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>{selectedGroup.icon}</div>
              <div style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>
                {selectedGroup.name}
              </div>
              <div style={{ fontSize: "14px", color: "#999" }}>
                {selectedGroup.members} members • Role: {selectedGroup.role}
              </div>
            </div>

            <div style={{ background: "#111", borderRadius: "12px", padding: "14px" }}>
              <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: GROUPS_COLOR }}>
                Group Challenges
              </div>
              {["Weekly Workout", "Meal Prep Competition", "Streak Challenge"].map((challenge, idx) => (
                <div key={idx} style={{ padding: "8px 0", borderBottom: idx < 2 ? "1px solid #222" : "none" }}>
                  <div style={{ fontSize: "14px", fontWeight: "500" }}>{challenge}</div>
                  <div style={{ fontSize: "12px", color: "#999" }}>Active • 5/12 members</div>
                </div>
              ))}
            </div>

            {selectedGroup.role !== "admin" && (
              <button
                onClick={() => handleLeaveGroup(selectedGroup.id)}
                style={{
                  padding: "12px",
                  background: "#333",
                  color: "#ff6b6b",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600"
                }}
              >
                Leave Group
              </button>
            )}
          </div>
        )}

        {/* Create Group View */}
        {view === "create" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Create New Group</div>

            <div>
              <label style={{ fontSize: "12px", color: "#999", marginBottom: "6px", display: "block" }}>
                Group Icon
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["👥", "⚔️", "🏃", "💪", "🧘", "🏋️", "🏅", "🥗"].map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewGroupIcon(icon)}
                    style={{
                      width: "40px",
                      height: "40px",
                      fontSize: "20px",
                      background: newGroupIcon === icon ? GROUPS_COLOR : "#222",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "#999", marginBottom: "6px", display: "block" }}>
                Group Name
              </label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="e.g., My Fitness Squad"
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#111",
                  border: `1px solid #2a2a2a`,
                  borderRadius: "8px",
                  color: WHITE,
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <button
              onClick={handleCreateGroup}
              style={{
                padding: "14px",
                background: GROUPS_COLOR,
                color: BLACK,
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "12px"
              }}
            >
              Create Group
            </button>
          </div>
        )}

        {/* Discover Groups View */}
        {view === "discover" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {suggestedGroups.map((group) => (
              <div
                key={group.id}
                style={{
                  background: "#111",
                  border: `1px solid #2a2a2a`,
                  borderRadius: "12px",
                  padding: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ fontSize: "20px", marginBottom: "4px" }}>{group.icon}</div>
                  <div style={{ fontSize: "16px", fontWeight: "600" }}>{group.name}</div>
                  <div style={{ fontSize: "12px", color: "#999" }}>{group.members} members</div>
                </div>
                <button
                  onClick={() => handleJoinGroup(group)}
                  style={{
                    padding: "8px 16px",
                    background: GROUPS_COLOR,
                    color: BLACK,
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "40px",
          background: BLACK,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 16px",
          boxSizing: "border-box",
          zIndex: 20
        }}
      >
        <div
          style={{
            color: GROUPS_COLOR,
            fontSize: "18px",
            textDecoration: "underline",
            cursor: "pointer"
          }}
          onClick={() => setMenuOpen(true)}
        >
          Return to Menu
        </div>
      </div>
    </div>
  );
}
