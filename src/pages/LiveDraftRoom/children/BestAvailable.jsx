import React, { useState, useRef } from 'react';
import './BestAvailable.css';

const POSITION_ORDER = ['QB', 'RB', 'WR', 'TE'];

const TIER_COLORS = {
  1: '#FFD700',
  2: '#10b981',
  3: '#3b82f6',
  4: '#a855f7',
  5: '#8b8b8b',
  6: '#c23434',
  7: '#202020',
};

function BestAvailable({ players, onPlayerClick }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const playersByPosition = POSITION_ORDER.reduce((acc, pos) => {
    acc[pos] = [];
    return acc;
  }, {});

  players.forEach((player) => {
    const pos = player.position || player.Position || '';
    if (POSITION_ORDER.includes(pos)) {
      if ((player.Availability || '').toLowerCase() !== 'drafted') {
        playersByPosition[pos].push(player);
      }
    }
  });

  POSITION_ORDER.forEach((pos) => {
    playersByPosition[pos].sort(
      (a, b) => (b.FPTS || b.fpts || 0) - (a.FPTS || a.fpts || 0)
    );
    playersByPosition[pos] = playersByPosition[pos].slice(0, 5);
  });

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  };

  const scrollToIndex = (index) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      left: index * scrollRef.current.offsetWidth,
      behavior: 'smooth',
    });
  };

  return (
    <div className="best-available-wrapper">
      <div
        className="best-available-row"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {POSITION_ORDER.map((pos) => (
          <div key={pos} className="position-column" tabIndex={0}>
            <h3 className="position-header">{pos}</h3>

            {playersByPosition[pos].length === 0 ? (
              <p className="no-players">No available players</p>
            ) : (
              playersByPosition[pos].map((player) => {
                const tier = player.tier || player.Tier || 7;
                const tierColor = TIER_COLORS[tier] || TIER_COLORS[7];

                return (
                  <div
                    key={player.name || player.Name}
                    className="player-card"
                    style={{ borderColor: tierColor }}
                    onClick={() => onPlayerClick(player)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') onPlayerClick(player);
                    }}
                    aria-label={`${player.name || player.Name}, ${pos}, ${player.team || player.Team}, projected points ${player.FPTS || player.fpts}`}
                  >
                    <div
                      className="player-tier-indicator"
                      style={{ backgroundColor: tierColor }}
                    />
                    <div className="player-info">
                      <div className="ba-player-name">
                        {player.name || player.Name}
                      </div>
                      <div className="ba-player-row">
                        <span className="player-team">
                          {player.team || player.Team}
                        </span>
                        <span className="player-points">
                          {Math.round(player.FPTS || player.fpts || 0)} pts
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ))}
      </div>

      {/* Dot Indicators (mobile only) */}
      <div className="dot-indicator-row">
        {POSITION_ORDER.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => scrollToIndex(index)}
            role="button"
            tabIndex={0}
            aria-label={`Go to ${POSITION_ORDER[index]} position`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') scrollToIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default BestAvailable;
