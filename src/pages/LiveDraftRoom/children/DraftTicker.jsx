import React from 'react';
import './DraftTicker.css';
import { getTeamGradient } from '../Data/NFLColors'; // Adjust path as needed

const DraftTicker = ({ recentDraftPicks }) => {
  const hasPicks = Array.isArray(recentDraftPicks) && recentDraftPicks.length > 0;
  const picksToShow = hasPicks ? recentDraftPicks.slice(-5) : [];

  return (
    <div className="draft-ticker-container">
      <div className="draft-ticker-content">
        {hasPicks
          ? [...picksToShow, ...picksToShow].map((pick, i) => {
              const teamCode = pick.Team || '';
              const gradientStyle = {
                background: getTeamGradient(teamCode),
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
              };

              return (
                <div key={i} className="draft-ticker-item">
                  <span className="dt-player-name" style={gradientStyle}>
                    {pick.name}
                  </span>{' '}
                  →
                  <span className="dt-team-name">{pick.team}</span> 💰
                  <span className="dt-cost">${pick.cost}</span>
                </div>
              );
            })
          : (
            <div className="draft-ticker-item">
              <span className="dt-player-name fallback-text">
                Welcome to the Promise Lands
              </span>
            </div>
          )}
      </div>
    </div>
  );
};

export default DraftTicker;
