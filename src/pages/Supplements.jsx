import React, { useState, useContext } from "react";
import { MenuContext } from "../context/MenuContext";
import { supplementsByCategory, unitOptions } from "../context/supplementsData";

export default function Supplements() {
  const GREEN = "#218c21";
  const { setMenuOpen } = useContext(MenuContext);

  const categories = Object.keys(supplementsByCategory);

  // 5 categories × 4 rows × { supplement, unit }
  const [values, setValues] = useState(
    categories.reduce((acc, cat) => {
      acc[cat] = Array(4).fill({ supplement: "", unit: "" });
      return acc;
    }, {})
  );

  const [dropdown, setDropdown] = useState({
    open: false,
    category: null,
    row: null,
    type: null, // "supplement" or "unit"
    x: 0,
    y: 0,
  });

  // ----------------------------
  // INLINE DROPDOWN COMPONENT
  // ----------------------------
  function Dropdown({ open, options, onSelect, x, y }) {
    if (!open) return null;

    return (
      <div
        style={{
          position: "absolute",
          top: y,
          left: x,
          backgroundColor: "black",
          zIndex: 999,
          width: "200px",
        }}
      >
        {options.map((opt, i) => (
          <div
            key={i}
            onClick={() => onSelect(opt)}
            style={{
              padding: "12px",
              color: GREEN,
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {opt}
          </div>
        ))}
      </div>
    );
  }

  // ----------------------------
  // OPEN DROPDOWN
  // ----------------------------
  const openDropdown = (category, row, type, event) => {
    const rect = event.target.getBoundingClientRect();

    setDropdown({
      open: true,
      category,
      row,
      type,
      x: rect.left,
      y: rect.bottom,
    });
  };

  // ----------------------------
  // SELECT VALUE
  // ----------------------------
  const selectValue = (val) => {
    const { category, row, type } = dropdown;

    const updated = { ...values };
    const rowData = [...updated[category]];
    rowData[row] = { ...rowData[row], [type]: val };
    updated[category] = rowData;

    setValues(updated);
    setDropdown({ open: false, category: null, row: null, type: null });
  };

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", padding: "20px" }}>
      {categories.map((cat) => (
        <div key={cat} style={{ marginBottom: "40px" }}>
          {[0, 1, 2, 3].map((row) => (
            <div
              key={row}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              {/* LEFT SUPPLEMENT DISPLAY */}
              <div
                style={{
                  width: "60%",
                  backgroundColor: "black",
                  color: GREEN,
                  padding: "12px",
                  fontSize: "18px",
                }}
              >
                {values[cat][row].supplement}
              </div>

              {/* RIGHT CATEGORY TRIGGER */}
              <div
                onClick={(e) => openDropdown(cat, row, "supplement", e)}
                style={{
                  color: GREEN,
                  fontSize: "18px",
                  cursor: "pointer",
                  width: "35%",
                  textAlign: "right",
                }}
              >
                {cat}
              </div>

              {/* LEFT UNIT DISPLAY */}
              <div
                style={{
                  width: "60%",
                  backgroundColor: "black",
                  color: GREEN,
                  padding: "12px",
                  fontSize: "18px",
                }}
              >
                {values[cat][row].unit}
              </div>

              {/* RIGHT UNIT TRIGGER */}
              <div
                onClick={(e) => openDropdown(cat, row, "unit", e)}
                style={{
                  color: GREEN,
                  fontSize: "18px",
                  cursor: "pointer",
                  width: "35%",
                  textAlign: "right",
                }}
              >
                Unit
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* DROPDOWN */}
      <Dropdown
        open={dropdown.open}
        options={
          dropdown.type === "unit"
            ? unitOptions
            : supplementsByCategory[dropdown.category]
        }
        onSelect={selectValue}
        x={dropdown.x}
        y={dropdown.y}
      />

      {/* FOOTER */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        {/* SAVE */}
        <div
          onClick={() => console.log("Save Supplements:", values)}
          style={{
            color: GREEN,
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Save
        </div>

        {/* RETURN TO MENU */}
        <div
          onClick={() => setMenuOpen(true)}
          style={{
            color: GREEN,
            fontSize: "18px",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Return to Menu
        </div>
      </div>
    </div>
  );
}
