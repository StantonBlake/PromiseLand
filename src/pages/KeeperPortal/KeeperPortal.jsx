import React, { useState } from 'react';

export default function KeeperPortal({ teamsData, onClose, onSave }) {
  const [keeperSelections, setKeeperSelections] = useState(() => {
    const initial = {};
    teamsData.forEach(team => {
      initial[team.manager] = {};
      team.players.forEach(player => {
        initial[team.manager][player.name] = true; // default to kept
      });
    });
    return initial;
  });

  const togglePlayer = (manager, playerName) => {
    setKeeperSelections(prev => ({
      ...prev,
      [manager]: {
        ...prev[manager],
        [playerName]: !prev[manager][playerName],
      }
    }));
  };

  const handleSave = async () => {
    const updatedTeams = teamsData.map(team => {
      const keptPlayers = team.players
        .filter(player => keeperSelections[team.manager][player.name])
        .map(player => ({
          ...player,
          cost: player.cost + 10 // Increase by $10 for kept players
        }));

      return {
        ...team,
        players: keptPlayers
      };
    });

    try {
      // Replace with your Apps Script endpoint
      await fetch('https://your-app-script-url.com/saveKeepers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teams: updatedTeams })
      });

      onSave(); // callback to refresh app state
    } catch (error) {
      console.error('Failed to save keepers:', error);
      alert('There was a problem saving keepers.');
    }

    onClose();
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={{ ...modalBoxStyle, width: '90%', maxWidth: 900, maxHeight: '90vh', overflowY: 'auto' }}>
        <h2>Keeper Selection</h2>
        {teamsData.map(team => (
          <div key={team.manager} style={{ marginBottom: 20 }}>
            <h3>{team.manager}</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {team.players.map(player => (
                <li key={player.name} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                  <input
                    type="checkbox"
                    checked={keeperSelections[team.manager][player.name]}
                    onChange={() => togglePlayer(team.manager, player.name)}
                    style={{ marginRight: 8 }}
                  />
                  <span>{player.name} — ${player.cost} → ${player.cost + 10}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div style={{ marginTop: 20 }}>
          <button onClick={handleSave} style={{ marginRight: 10 }}>Save Keepers</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// Reuse modal styles
const modalBackdropStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 1000,
};

const modalBoxStyle = {
  background: '#fff',
  padding: 24,
  borderRadius: 8,
  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
};
