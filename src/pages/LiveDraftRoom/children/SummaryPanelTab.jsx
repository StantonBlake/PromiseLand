import React, { useState } from 'react';
import MaxBidBarChart from '../charts/MaxBidBarChart';
import './SummaryPanelTab.css';

const SummaryPanelTab = ({ draftTeams }) => {
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);
  const selectedTeam = draftTeams[selectedTeamIndex];

  const sortedByFPTS = [...draftTeams].sort((a, b) => {
    const getTotalFPTS = team =>
      team.players.reduce((sum, p) => sum + (parseFloat(p.FPTS) || 0), 0);
    return getTotalFPTS(b) - getTotalFPTS(a);
  });

  return (
    <div className="summary-panel-container">
      {/* Rankings + Selector */}
      
        <h3 className="section-title">Team Rankings (Total FPTS)</h3>
        <ol className="team-ranking-list">
          {sortedByFPTS.map((team, i) => {
            const total = team.players.reduce(
              (sum, p) => sum + (parseFloat(p.FPTS) || 0),
              0
            );
            return (
              <li key={team.manager} className="ranking-item">
                <strong>{i + 1}. {team.manager}</strong> – {total.toFixed(1)} pts
              </li>
            );
          })}
        </ol>

       
    

      {/* Max Bid Chart */}
      <div className="summary-section">
        <h4 className="section-subtitle">Max Bids Left</h4>
        <div className="chart-wrapper">
          <MaxBidBarChart draftTeams={draftTeams} />
        </div>
      </div>
    </div>
  );
};

export default SummaryPanelTab;
