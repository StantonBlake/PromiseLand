import React from 'react';
import './PlayerCard.css';

const positionColors = {
  QB: '#c23434',
  RB: '#32CD32',
  WR: '#1E90FF',
  TE: '#fdb418',
  DEFAULT: '#ccc',
};

const PlayerCard = ({ player, isKept = true, onToggle }) => {
  const { name, position, cost, projectedFPTS } = player;

  const borderColor = positionColors[position] || positionColors.DEFAULT;

  return (
    <div className="player-card" style={{ borderLeft: `6px solid ${borderColor}` }}>
      <div className="player-info">
        <div className="player-name">{name}</div>
        <div className="player-meta">
          <span className="meta-item">{position}</span>
          <span className="meta-item">${cost}</span>
          <span className="meta-item">
            {projectedFPTS != null ? `${projectedFPTS.toFixed(1)} FPTS` : '—'}
          </span>
        </div>
      </div>

      <label className="toggle-switch">
        <input type="checkbox" checked={isKept} onChange={onToggle} />
        <span className="slider" />
      </label>
    </div>
  );
};

export default PlayerCard;
