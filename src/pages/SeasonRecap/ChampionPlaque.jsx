import React from "react";
import "./ChampionPlaque.css";

const TrophyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="trophy-icon"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3h8v4m-4 8v5m-4-5h8a2 2 0 002-2v-5H6v5a2 2 0 002 2z"
    />
  </svg>
);

const ChampionPlaque = ({ manager, record, year }) => {
  return (
    <div className="champion-plaque">
      <div className="plaque-content">
        <TrophyIcon />
        <div className="plaque-text">
          <div className="plaque-title">{year || "2024"} Champion</div>
          <div className="plaque-manager">{manager}</div>
          <div className="plaque-record">Record: {record}</div>
        </div>
      </div>
    </div>
  );
};

export default ChampionPlaque;
