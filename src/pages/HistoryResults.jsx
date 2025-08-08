import React, { useState, useMemo } from 'react';
import YearDropdown from '../components/CustomDropdown'; // adjust path if needed
import './HistoryResults.css';

const YEARS = [2021, 2022, 2023, 2024];

// Helper: parse "1st", "2nd", "Last" etc. to number rank
const parseFinishPosition = (finishStr) => {
  if (!finishStr) return 999;
  if (finishStr.toLowerCase() === 'last') return 10;
  const num = parseInt(finishStr, 10);
  return isNaN(num) ? 999 : num;
};

// Helper: add ordinal suffix for rank display
const ordinalSuffix = (i) => {
  const j = i % 10,
        k = i % 100;
  if (j === 1 && k !== 11) return i + "st";
  if (j === 2 && k !== 12) return i + "nd";
  if (j === 3 && k !== 13) return i + "rd";
  return i + "th";
};

const HistoryResults = ({ managers }) => {
  const [selectedYear, setSelectedYear] = useState(2024);

  const resultsForYear = useMemo(() => {
    if (!managers || managers.length === 0) return [];

    const mapped = managers.map((m) => {
      const finishStr = m.historyData?.finishes?.[selectedYear] || null;
      const wins = m.historyData?.wins?.[selectedYear];
      const losses = m.historyData?.losses?.[selectedYear];

      const rank = parseFinishPosition(finishStr);
      const record = wins !== undefined && losses !== undefined ? `${wins}-${losses}` : "N/A";

      return {
        rank,
        manager: m.manager,
        record,
      };
    });

    return mapped.sort((a, b) => a.rank - b.rank);
  }, [managers, selectedYear]);

  return (
    <div className="history-results-container">
      <h2>Season Results</h2>

      <label htmlFor="year-select" className="year-select-label">
        Select Year:
      </label>
      <YearDropdown
        selectedYear={selectedYear}
        onChange={setSelectedYear}
        years={YEARS}
      />

      <table className="results-table" aria-label="Season Results Table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Manager Name</th>
            <th>Record</th>
          </tr>
        </thead>
        <tbody>
          {resultsForYear.length === 0 ? (
            <tr>
              <td colSpan={3} className="no-data-cell">
                No data available for {selectedYear}.
              </td>
            </tr>
          ) : (
            resultsForYear.map(({ rank, manager, record }) => (
              <tr key={`${manager}-${rank}`}>
                <td>{rank === 999 ? 'N/A' : ordinalSuffix(rank)}</td>
                <td>{manager}</td>
                <td>{record}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryResults;
