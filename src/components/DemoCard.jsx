import React from "react";

const DemoCard = ({ title, subtitle, onClick }) => {
  return (
    <div className="demo-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  );
};

export default DemoCard;
