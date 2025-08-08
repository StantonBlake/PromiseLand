// TeamsBreakdownTab.jsx
import React from 'react';
import './TeamsBreakdownTab.css';

const TeamsBreakdownTab = ({ draftTeams }) => {
  return (
    <div className="teams-breakdown-container">
      {draftTeams.map((team) => (
        <div key={team.manager} className="team-card">
          <div className="team-header">{team.manager}</div>

          <div className="team-meta">
            <div className="budget">💰 Budget: ${team.budget}</div>
            <div className="max-bid">Max Bid: ${team.maxBid}</div>
          </div>

          <div className="team-players">
            {team.players.map((p, i) => (
              <div key={i} className="player-row">
                <span className="player-name">{p.name}</span>
                <span className="player-info">
                  {p.position} - {p.team} - ${p.value}
                </span>
              </div>
            ))}

            {[...Array(team.openSpots)].map((_, idx) => (
              <div key={`empty-${idx}`} className="player-row empty-spot">
                <span className="empty">[ Open Roster Spot ]</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamsBreakdownTab;