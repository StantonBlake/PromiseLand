import React from "react";
import "./DraftVsFinishChart.css";

const DraftVsFinishChart = ({ data = [] }) => {
  if (!data.length) return <div>No draft vs finish data available.</div>;

  // Sort by finish ascending (1 best)
  const sorted = [...data].sort((a, b) => a.finish - b.finish);

  // Calculate movements = draft rank - finish rank
  const movements = sorted.map(({ draft, finish }) => draft - finish);

  // Cap max bar length to 40% of container width
  const MAX_BAR_PERCENT = 40;

  // Raw max absolute movement
  const maxAbsMovementRaw = Math.max(...movements.map(Math.abs));

  // Capped max absolute movement (to limit bar length)
  const maxAbsMovement = Math.min(maxAbsMovementRaw, MAX_BAR_PERCENT);

  return (
    <div className="draft-vs-finish-chart">
      <h2 className="chart-title">Draft vs Finish Movement</h2>
      <div className="chart-rows">
        {sorted.map(({ manager, draft, finish }, idx) => {
          const movement = draft - finish;
          const isPositive = movement > 0;
          // Scale bar length relative to capped max movement
          const barLengthPercent =
            maxAbsMovement === 0
              ? 0
              : (Math.abs(movement) / maxAbsMovement) * MAX_BAR_PERCENT;

          return (
            <div key={manager} className="chart-row">
              <div className="manager-name">{manager}</div>

              <div className="bar-container" aria-label={`Movement: ${movement}`}>
                <div className="zero-line" />

                {movement !== 0 && (
                  <div
                    className={`bar ${isPositive ? "positive" : "negative"}`}
                    style={{
                      width: `${barLengthPercent}%`,
                      [isPositive ? "left" : "right"]: "50%",
                    }}
                  />
                )}

                <div
                  className={`movement-label ${isPositive ? "positive" : "negative"}`}
                  style={{
                    left: isPositive ? `calc(50% + ${barLengthPercent}%)` : undefined,
                    right: isPositive ? undefined : `calc(50% + ${barLengthPercent}%)`,
                  }}
                >
                  {movement > 0 ? `+${movement}` : movement}
                </div>
              </div>

              <div className="rank-info">
                <span className="label">Draft:</span> {draft}
                <span className="label">Finish:</span> {finish}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DraftVsFinishChart;
