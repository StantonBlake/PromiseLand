import React, { useState, useEffect } from 'react';
import './LegacyScoreboard.css';

const LegacyScoreboard = ({ managers = [] }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const getLegacyScore = (m) => m.legacy?.legacyScore ?? -Infinity;

  const sortedManagers = [...managers].sort(
    (a, b) => getLegacyScore(b) - getLegacyScore(a)
  );

  useEffect(() => {
    if (sortedManagers.length > 0) {
      setExpandedIndex(0); // Auto-expand top ranked
    }
  }, [managers]);

  const getScale = (index) => {
    const total = sortedManagers.length;
    const maxScale = .95;
    const minScale = 0.8;
    return minScale + ((total - 1 - index) / (total - 1)) * (maxScale - minScale);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getChampionshipYears = (manager) => {
    const finishes = manager.historyData?.finishes ?? {};
    return Object.entries(finishes)
      .filter(([_, place]) => place === '1st')
      .map(([year]) => year);
  };

  return (
    <div className="legacy-scoreboard">
      <div className="scoreboard-header desktop-only">
        <div className="header-rank">#</div>
        <div className="header-name">Manager</div>
        <div className="header-score">Legacy Score</div>
      </div>

      {sortedManagers.map((m, index) => {
        const isExpanded = index === expandedIndex;
        const legacyScore = getLegacyScore(m);
        const championshipYears = getChampionshipYears(m);
        const champCount = championshipYears.length;

        const career = m.career ?? {};
        const record = career.recordalltime || 'N/A';
        const winPct = career.winPct != null ? `${(career.winPct * 100).toFixed(1)}%` : 'N/A';
        const years = career.yearsInLeague ?? 'N/A';

        let rankClass = '';
        if (index === 0) rankClass = 'gold';
        else if (index === 1) rankClass = 'silver';
        else if (index === 2) rankClass = 'bronze';

        return (
          <div
            key={m.manager}
            className={`score-card ${rankClass} ${isExpanded ? 'expanded' : ''}`}
            style={{
              '--scale': getScale(index),
              '--text-color': rankClass ? 'var(--ranked-text-color)' : '#e0e0e0',
            }}
            onClick={() => toggleExpand(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') toggleExpand(index);
            }}
            tabIndex={0}
            role="button"
            aria-expanded={isExpanded}
            title={`${m.manager} — Legacy Score: ${legacyScore}`}
          >
            <div className="rank">{index + 1}</div>

            <div className="name">
              {m.manager}
              {champCount > 0 && (
                <span className="inline-trophies" title={`${champCount}× Champ`}>
                  {' ' + '🏆'.repeat(champCount)}
                </span>
              )}
            </div>

            <div className="score">{legacyScore}</div>

            <div className="expanded-content">
              <div className="manager-stats">
                <div><strong>All-Time Record:</strong> {record}</div>
                <div><strong>Win %:</strong> {winPct}</div>
                <div><strong>Years in League:</strong> {years}</div>
              </div>

              {championshipYears.length > 0 && (
                <div className="champ-year-badges">
                  {championshipYears.map((year) => (
                    <span key={year} className="champ-year-badge">
                      🏆 {year} Champ
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LegacyScoreboard;
