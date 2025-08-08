import React from 'react';
import './BudgetPanel.css';

function BudgetPanel({ draftTeams }) {
  return (
    <div className="budget-panel">
      {draftTeams.map((team, idx) => (
        <div key={idx} className="budget-card">
          <h4>{team.manager}</h4>
          <div className="budget-info">
            <div>💰 Budget: {team.budget}</div>
            <div>📈 Max Bid: {team.maxBid}</div>
            <div>📦 Open Spots: {team.openSpots}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BudgetPanel;
