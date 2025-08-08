import React, { useState, useEffect } from 'react';
import './MaxBidBarChart.css';

const MaxBidBarChart = ({ draftTeams }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [animatedMaxBids, setAnimatedMaxBids] = useState([]);

  // Sort teams descending by maxBid (default 0)
  const sortedTeams = React.useMemo(() => {
    if (!draftTeams) return [];
    return [...draftTeams].sort((a, b) => (b.maxBid ?? 0) - (a.maxBid ?? 0));
  }, [draftTeams]);

  useEffect(() => {
    if (!sortedTeams || sortedTeams.length === 0) {
      setAnimatedMaxBids([]);
      return;
    }

    const maxBids = sortedTeams.map(t => Math.max(0, t.maxBid ?? 0));
    const steps = 30;
    let currentStep = 0;

    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easedProgress = easeOutCubic(progress);

      const newHeights = maxBids.map(val => val * easedProgress);
      setAnimatedMaxBids(newHeights);

      if (currentStep >= steps) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [sortedTeams]);

  const MAX_BAR_HEIGHT = 250;
  const maxBidCap = Math.max(...(sortedTeams?.map(t => t.maxBid ?? 0) || [1]), 1);

  const averageBid =
    sortedTeams.reduce((sum, team) => sum + (team.maxBid ?? 0), 0) /
    (sortedTeams.length || 1);

  const averageHeight = (averageBid / maxBidCap) * MAX_BAR_HEIGHT;

  return (
    <section className="maxbid-bar-chart" aria-label="Max Bid Remaining by Team">
      <h3>Max Bid Remaining by Team</h3>
      <div className="bars-container">
        {sortedTeams.map((team, idx) => {
          const value = animatedMaxBids[idx] ?? 0;
          const heightPercent = (value / maxBidCap) || 0;
          const barHeight = heightPercent * MAX_BAR_HEIGHT;

          return (
            <div
              key={team.manager}
              className="bar-item"
              onClick={() => setSelectedIndex(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedIndex(idx);
                }
              }}
              aria-label={`Max bid for ${team.manager} is $${Math.round(value)}`}
            >
              <div className="bar-value">${Math.round(value)}</div>
              <div
                className="maxbid-bar"
                style={{ height: `${barHeight}px` }}
              />
              <div className="label" title={team.manager}>
                {team.manager}
              </div>
            </div>
          );
        })}

        {/* 🔶 Average Line + Label */}
        <div
          className="average-line"
          style={{ bottom: `${averageHeight + 58}px` }}
        />
        <div
          className="average-label"
          style={{ bottom: `${averageHeight + 58}px` }}
        >
          Avg: ${averageBid.toFixed(0)}
        </div>
      </div>
    </section>
  );
};

export default MaxBidBarChart;
