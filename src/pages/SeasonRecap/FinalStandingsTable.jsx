import React from "react";
import "./FinalStandingsTable.css";

const FinalStandingsTable = ({ data = [], championName }) => {
  if (!data.length) return <div>No standings data available.</div>;

  return (
    <div className="final-standings-wrapper">
      <h2 className="standings-title">🏆 Final Standings</h2>
      <table className="final-standings-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Manager</th>
            <th>Record</th>
            <th className="legacy-header">Legacy Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ manager, record, legacyScore, legacyDelta }, index) => {
            let rowClass = "";
            if (index === 0) rowClass = "champion-row";
            else if (index === 1) rowClass = "silver-row";
            else if (index === 2) rowClass = "bronze-row";

            const deltaClass =
              legacyDelta > 0
                ? "delta-positive"
                : legacyDelta < 0
                ? "delta-negative"
                : "";

            return (
              <tr
                key={manager}
                className={rowClass}
                title={index === 0 ? "League Champion 2024" : ""}
              >
                <td>{index + 1}.</td>
                <td>{manager}</td>
                <td>{record}</td>
                <td className="legacy-cell">
                  <span className="legacy-score">{legacyScore}</span>
                  {legacyDelta !== 0 && (
                    <span className={`legacy-delta ${deltaClass}`}>
                      {legacyDelta > 0 ? `+${legacyDelta}` : legacyDelta}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FinalStandingsTable;
