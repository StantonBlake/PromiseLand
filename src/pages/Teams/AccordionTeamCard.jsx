import React, { useState, useEffect } from 'react';
import PlayerCard from './PlayerCard';
import './AccordionTeamCard.css';

const STARTING_BUDGET = 300;

const AccordionTeamCard = ({ teamData }) => {
  const { manager, players } = teamData;
  const [isOpen, setIsOpen] = useState(false);

  // Toggle state: object with player index as key and boolean as value
  // Default all ON at mount
  const [keptPlayers, setKeptPlayers] = useState({});

  useEffect(() => {
    const initialToggleState = {};
    players.forEach((_, idx) => {
      initialToggleState[idx] = true;
    });
    setKeptPlayers(initialToggleState);
  }, [players]);

  // Handler for toggling player keeper status
  const togglePlayerKeeper = (idx) => {
    setKeptPlayers((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Calculate total cost with +10 for each kept player
  const totalSpent = players.reduce((sum, player, idx) => {
    if (keptPlayers[idx]) {
      return sum + (player.cost || 0) + 10;
    }
    return sum;
  }, 0);

  const availableBudget = STARTING_BUDGET - totalSpent;
  const playerCount = players.length;

  // Determine budget color class
  const budgetClass = availableBudget < 0 ? 'budget-negative' : 'budget-positive';

  return (
    <div className={`accordion-team-card ${isOpen ? 'open' : ''}`}>
      <div className="team-card-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="manager-name">{manager}</div>
        <div className={`available-budget ${budgetClass}`}>
          ${availableBudget} Available
        </div>
        <div className="player-count">{playerCount} Keepers</div>
      </div>

      {isOpen && (
        <div className="accordion-content">
          {players.map((player, idx) => (
            <PlayerCard
              key={player.name}
              player={player}
              isKept={keptPlayers[idx]}
              onToggle={() => togglePlayerKeeper(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AccordionTeamCard;
