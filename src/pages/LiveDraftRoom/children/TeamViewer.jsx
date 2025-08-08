import React, { useState } from 'react';
import './TeamViewer.css';

function TeamViewer({ draftTeams }) {
  const [selectedManager, setSelectedManager] = useState('');
  const [sortMethod, setSortMethod] = useState('position');

  const selectedTeam = draftTeams.find(team => team.manager === selectedManager);
  const TOTAL_SLOTS = 13;

  const positionOrder = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'DEF'];

  const fullRoster = selectedTeam ? [...selectedTeam.players] : [];

  while (selectedTeam && fullRoster.length < TOTAL_SLOTS) {
    fullRoster.push(null);
  }

  const sortedRoster = fullRoster.slice().sort((a, b) => {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;

    switch (sortMethod) {
      case 'fpts':
        return (b.FPTS || 0) - (a.FPTS || 0);
      case 'price':
        return (b.value || 0) - (a.value || 0);
      case 'position':
      default:
        const aPos = positionOrder.indexOf(a.position?.toUpperCase()) ?? 99;
        const bPos = positionOrder.indexOf(b.position?.toUpperCase()) ?? 99;
        return aPos - bPos;
    }
  });

  return (
    <div className="team-viewer">
      <h2 className="viewer-title">Team Viewer</h2>

      <select
        className="team-select"
        value={selectedManager}
        onChange={(e) => setSelectedManager(e.target.value)}
      >
        <option value="">Select A Team</option>
        {draftTeams.map((team, idx) => (
          <option key={idx} value={team.manager}>
            {team.manager}
          </option>
        ))}
      </select>

      {selectedTeam && (
        <div className="team-card">
          <div className="team-header">
            <h3>{selectedTeam.manager}</h3>
            <div className="team-meta">
              <span>💰 Budget: ${selectedTeam.budget}</span>
              <span>🧮 Max Bid: ${selectedTeam.maxBid}</span>
              <span>📦 Spots Left: {selectedTeam.openSpots}</span>
            </div>

            <div className="sort-controls">
              <label htmlFor="sortMethod">Sort by:</label>
              <select
                id="sortMethod"
                value={sortMethod}
                onChange={(e) => setSortMethod(e.target.value)}
              >
                <option value="position">Position</option>
                <option value="fpts">FPTS</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>

          <div className="roster">
            {sortedRoster.map((player, i) => {
              const position = player?.position?.toLowerCase() || 'flex';
              return (
                <div key={i} className={`player-row ${position}`}>
                  {player ? (
  <>
    <div className="tv-player-name">{player.name}</div>
    <div className="tv-player-fpts">{player.FPTS ?? 'N/A'} pts</div>
    <div className="tv-player-price">${player.value}</div>
  </>
) : (
  <div className="empty-slot">-- Empty Slot ({position.toUpperCase()}) --</div>
)}


                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamViewer;
