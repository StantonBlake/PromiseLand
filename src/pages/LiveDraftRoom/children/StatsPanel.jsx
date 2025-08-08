import React from 'react';
import './StatsPanel.css';

const readableStatNames = {
  FPTS: 'FPTS',
  TIER: 'Tier',
  PASSING_YDS: 'Passing Yards',
  PASSING_TDS: 'Passing TDs',
  RUSHING_YDS: 'Rushing Yards',
  RUSHING_TDS: 'Rushing TDs',
  RECEIVING_YDS: 'Receiving Yards',
  RECEIVING_TDS: 'Receiving TDs',
  FUMBLES: 'Fumbles',
  INTERCEPTIONS: 'Interceptions',
  TOTAL_TDS: 'Total TDs',
};

function getBarColor(position, rank) {
  switch (position) {
    case 'RB':
      if (rank >= 0 && rank <= 4) return { color: '#064e3b' };       // dark green
      if (rank <= 14) return { color: '#10b981' };                   // green
      if (rank <= 29) return { color: '#facc15' };                   // yellow
      if (rank <= 39) return { color: '#fb923c' };                   // orange-red
      return { color: '#dc2626' };                                   // dark red

    case 'WR':
      if (rank >= 0 && rank <= 9) return { color: '#064e3b' };
      if (rank <= 24) return { color: '#10b981' };
      if (rank <= 39) return { color: '#facc15' };
      if (rank <= 49) return { color: '#fb923c' };
      return { color: '#dc2626' };

    case 'QB':
    case 'TE':
      if (rank >= 0 && rank <= 4) return { color: '#064e3b' };
      if (rank <= 8) return { color: '#10b981' };
      if (rank <= 13) return { color: '#facc15' };
      if (rank <= 18) return { color: '#fb923c' };
      return { color: '#dc2626' };

    default:
      if (rank === 0) return { color: '#FFD700' };
      if (rank <= 4) return { color: '#064e3b' };
      if (rank <= 14) return { color: '#10b981' };
      if (rank <= 29) return { color: '#facc15' };
      if (rank <= 39) return { color: '#fb923c' };
      return { color: '#dc2626' };
  }
}

const StatRow = ({ label, rank, value, maxValue, position, tooltip }) => {
  const { color } = getBarColor(position, rank);
  const widthPercent = maxValue ? (value / maxValue) * 100 : 0;

  const ordinalSuffix = (n) => {
    if (n == null) return '-';
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const rankDisplay = rank !== -1 && rank !== null ? ordinalSuffix(rank + 1) : '-';
  const isTopRank = rank === 0;

  return (
    <div className="stat-row" title={tooltip}>
      <div className="stat-label">{label}</div>
      <div className={`stat-rank${isTopRank ? ' top-rank' : ''}`}>
        {rankDisplay}
      </div>
      <div className="stat-bar-wrapper">
        <div
          className="stat-bar"
          style={{
            '--target-width': `${widthPercent}%`,
            backgroundColor: color
          }}
        >
          <span className="stat-value">{value}</span>
        </div>
      </div>
    </div>
  );
};

const StatGroup = ({ title, children }) => {
  if (!children || React.Children.count(children) === 0) return null;
  return (
    <div className="stat-group">
      <div className="stat-group-title">{title}</div>
      {children}
    </div>
  );
};

const StatsPanel = ({ selectedPlayer, allPlayers }) => {
  if (!selectedPlayer) {
    return (
      <div className="stats-panel empty">
        <p>Select a player to view their stats</p>
      </div>
    );
  }

  const playerName = selectedPlayer.Name || selectedPlayer.name || 'Unknown';
  const position = selectedPlayer.Position || selectedPlayer.position || 'Unknown';
  const team = selectedPlayer.Team || selectedPlayer.team || 'Unknown';
  const tier = selectedPlayer.Tier || '-';
  const fpts = selectedPlayer.FPTS || 0;

  const peers = allPlayers.filter(p => (p.Position || p.position) === position);
  const everyone = allPlayers;

  const getRankAndMax = (players, statKey) => {
    const filtered = players.filter(p => p[statKey] != null);
    const sorted = filtered.sort((a, b) => (b[statKey] || 0) - (a[statKey] || 0));
    const rank = sorted.findIndex(p => {
      const pName = p.Name || p.name;
      return pName === playerName;
    });
    const max = sorted.length > 0 ? (sorted[0][statKey] || 1) : 1;
    return [rank, max];
  };

  const generalStats = [
    { key: 'FPTS', label: 'FPTS (Pos)', group: peers, tooltip: 'Fantasy Points (Ranked by Position)' },
    { key: 'FPTS', label: 'FPTS (Total)', group: everyone, tooltip: 'Fantasy Points (Ranked against all)' },
  ];

  const generalStatRows = generalStats.map(({ key, label, group, tooltip }) => {
    const [rank, max] = getRankAndMax(group, key);
    const value = selectedPlayer[key] || 0;
    return (
      <StatRow
        key={label}
        label={label}
        rank={rank}
        value={value}
        maxValue={max}
        position={position}
        tooltip={tooltip}
      />
    );
  });

  const tierRow = (
    <div className="stat-row" key="tier-row" title="Player Tier">
      <div className="stat-label">Tier</div>
      <div className="stat-rank">—</div>
      <div className="stat-bar-wrapper">
        <div className="stat-bar static-bar">
          <span className="stat-value">{tier}</span>
        </div>
      </div>
    </div>
  );

  const statKeysByPosition = {
    QB: ['PASSING_YDS', 'PASSING_TDS', 'RUSHING_YDS', 'RUSHING_TDS'],
    RB: ['RUSHING_YDS', 'RUSHING_TDS', 'RECEIVING_YDS', 'RECEIVING_TDS'],
    WR: ['RECEIVING_YDS', 'RECEIVING_TDS'],
    TE: ['RECEIVING_YDS', 'RECEIVING_TDS'],
  };

  const positionStatKeys = statKeysByPosition[position] || [];

  const positionStatRows = positionStatKeys.map(key => {
    const [rank, max] = getRankAndMax(peers, key);
    const value = selectedPlayer[key] || 0;
    return (
      <StatRow
        key={key}
        label={readableStatNames[key] || key}
        rank={rank}
        value={value}
        maxValue={max}
        position={position}
        tooltip={`${readableStatNames[key] || key} (vs ${position}s)`}
      />
    );
  });

  return (
    <div className="stats-panel">
      <h2 className="player-name">{playerName}</h2>
      <p className="player-subheader">{position} — {team}</p>

      <div className="stats-scrollable">
        <StatGroup title="General">
          {generalStatRows}
          {tierRow}
        </StatGroup>

        <StatGroup title="Position Stats">
          {positionStatRows}
        </StatGroup>
      </div>
    </div>
  );
};

export default StatsPanel;
