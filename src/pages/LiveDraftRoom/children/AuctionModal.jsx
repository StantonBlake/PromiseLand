import React, { useState, useEffect } from 'react';
import './AuctionModal.css';

function AuctionModal({ player, draftTeams, onClose, onAssign }) {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [bidCost, setBidCost] = useState('');
  const [error, setError] = useState('');

  // Reset form when player or draftTeams change
  useEffect(() => {
    setSelectedTeam('');
    setBidCost('');
    setError('');
  }, [player, draftTeams]);

  if (!player) return null;

  // Filter teams with open spots
  const teamsWithOpenSpots = draftTeams.filter(team => team.openSpots > 0);

  // Validation before assign
  const validateAndAssign = () => {
    const costNum = Number(bidCost);
    if (!selectedTeam) {
      setError('Please select a team');
      return;
    }
    if (!costNum || isNaN(costNum) || costNum <= 0) {
      setError('Please enter a valid positive bid cost');
      return;
    }
  
    const team = draftTeams.find(t => t.manager === selectedTeam);
    if (!team) {
      setError('Selected team not found');
      return;
    }
  
    if (costNum > team.budget) {
      setError(`Bid exceeds ${team.manager}'s budget (${team.budget})`);
      return;
    }
    if (costNum > team.maxBid) {
      setError(`Bid exceeds ${team.manager}'s max bid (${team.maxBid})`);
      return;
    }
  
    setError('');
    onAssign({ player, team: selectedTeam, cost: costNum });

  };
  

  return (
    <div className="auction-modal-backdrop" onClick={onClose}>
      <div className="auction-modal" onClick={e => e.stopPropagation()}>
        <header className="auction-modal-header">
          <h2>Draft Player</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </header>

        <section className="player-info">
          <h3>{player.name || player.Name}</h3>
          <p>{player.position || player.Position} - {player.team || player.Team}</p>
          <p>Projection: {player.FPTS ?? player.fpts ?? 'N/A'}</p>
        </section>

        <section className="bid-section">
          <label htmlFor="team-select">Select Team:</label>
          <select
            id="team-select"
            value={selectedTeam}
            onChange={e => setSelectedTeam(e.target.value)}
          >
            <option value="">-- Select a Team --</option>
            {teamsWithOpenSpots.map(team => (
              <option key={team.manager} value={team.manager}>
                {team.manager} (Budget: ${team.budget}, Max Bid: ${team.maxBid}, Open Spots: {team.openSpots})
              </option>
            ))}
          </select>

          <label htmlFor="bid-cost">Bid Cost ($):</label>
          <input
            type="number"
            id="bid-cost"
            min="1"
            step="1"
            value={bidCost}
            onChange={e => setBidCost(e.target.value)}
            placeholder="Enter bid amount"
          />
        </section>

        {error && <p className="error-message">{error}</p>}

        <footer className="auction-modal-footer">
          <button className="assign-btn" onClick={validateAndAssign}>Assign Player</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </footer>
      </div>
    </div>
  );
}

export default AuctionModal;
