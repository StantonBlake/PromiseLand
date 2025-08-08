import React, { useState, useMemo } from 'react';
import './FullPlayerListTab.css';

const EXCLUDE_COLUMNS = ['Availability'];
const POSITIONS = ['All', 'QB', 'RB', 'WR', 'TE'];

const FullPlayerListTab = ({ fullPlayerList, setSelectedPlayer }) => {
  const [showDrafted, setShowDrafted] = useState(false);
  const [positionFilter, setPositionFilter] = useState('All');

  const columns = useMemo(() => {
    if (!fullPlayerList?.length) return [];
    const keys = Object.keys(fullPlayerList[0]);
    return keys.filter(key => !EXCLUDE_COLUMNS.includes(key));
  }, [fullPlayerList]);

  const filteredPlayers = useMemo(() => {
    return fullPlayerList.filter(player => {
      const availability = (player.Availability || '').toLowerCase();
      if (!showDrafted && availability === 'drafted') return false;
      if (positionFilter !== 'All' && player.Position !== positionFilter) return false;
      return true;
    });
  }, [fullPlayerList, showDrafted, positionFilter]);

  return (
    <div className="full-player-list-tab">
      <div className="controls-row">
        

        <div className="controls-row">
  <label className="checkbox-label">
    <input
      type="checkbox"
      checked={showDrafted}
      onChange={() => setShowDrafted(prev => !prev)}
    />
    Show Drafted
  </label>

  <div className="position-toggle-group">
    {POSITIONS.map((pos) => (
      <label
        key={pos}
        className={`position-toggle-option ${positionFilter === pos ? 'active' : ''}`}
        onClick={() => setPositionFilter(pos)}
      >
        <div className="circle" />
        <span className="label-text">{pos}</span>
      </label>
    ))}
  </div>
</div>

      </div>

      {filteredPlayers.length === 0 ? (
        <p className="no-results">No players found.</p>
      ) : (
        <table className="full-player-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col}>{col.replace(/_/g, ' ')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player, idx) => (
              <tr
                key={`${player.Name}-${idx}`}
                tabIndex={0}
                role="button"
                onClick={() => setSelectedPlayer(player)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedPlayer(player);
                }}
              >
                {columns.map(col => (
                  <td key={col}>
                    {player[col] !== undefined && player[col] !== null && player[col] !== ''
                      ? player[col]
                      : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FullPlayerListTab;
