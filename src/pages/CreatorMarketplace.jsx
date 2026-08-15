import React, { useContext } from "react";
import { MenuContext } from "../context/MenuContext.jsx";

const marketplaceItems = [
  { id: 1, type: "Program", title: "12-Week Strength", creator: "Coach Alex", price: "$49", rating: 4.8 },
  { id: 2, type: "Meal Plan", title: "Macro Balanced", creator: "Nutritionist Jane", price: "$29", rating: 4.6 },
  { id: 3, type: "Drill Set", title: "Soccer Skills", creator: "Coach Mike", price: "$19", rating: 4.9 },
  { id: 4, type: "Template", title: "Race Training", creator: "Coach Sarah", price: "$39", rating: 4.7 }
];

export default function CreatorMarketplace() {
  const { setMenuOpen } = useContext(MenuContext);

  const MARKET_COLOR = "#06b6d4";

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#000",
        padding: "16px 16px 90px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        overflowY: "auto",
        color: "#fff"
      }}
    >
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ color: MARKET_COLOR, fontSize: "28px", fontWeight: "700" }}>🛍️ Marketplace</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {marketplaceItems.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#111",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                padding: "14px",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = MARKET_COLOR)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ fontWeight: "600" }}>{item.title}</div>
                <div style={{ color: MARKET_COLOR, fontWeight: "600" }}>{item.price}</div>
              </div>
              <div style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}>
                {item.type} • by {item.creator}
              </div>
              <div style={{ fontSize: "12px", color: "#fbbf24" }}>⭐ {item.rating}</div>
            </div>
          ))}
        </div>

        <button
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "14px",
            background: MARKET_COLOR,
            color: "#000",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Become a Creator
        </button>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "40px",
          background: "#000",
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
            color: MARKET_COLOR,
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
