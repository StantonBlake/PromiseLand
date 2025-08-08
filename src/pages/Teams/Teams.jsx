import React, { useState, useEffect } from 'react';
import AccordionTeamCard from './AccordionTeamCard';

const APPSCRIPT_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbysTz4YxInFTnqpcBMz84MfLpZq7oWnnlAzn6Eu584O5xC1pRAGMGKEtRf3LMu_1ix-/exec';

const Teams = () => {
  const [teamsData, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openManagerIndex, setOpenManagerIndex] = useState(null);

  // Fetch teams from the Apps Script endpoint on mount.
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${APPSCRIPT_WEBAPP_URL}?view=teams`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setTeamsData(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Display loading/error states
  if (loading) {
    return <div>Loading Teams...</div>;
  }

  if (error) {
    return <div>Error loading teams: {error}</div>;
  }

  // Render team accordion cards
  return (
    <div className="teams-container">
      {teamsData.map((team, idx) => (
        <AccordionTeamCard
          key={team.managerName || `manager-${idx}`}
          teamData={team}
          isOpen={openManagerIndex === idx}
          onToggle={() =>
            setOpenManagerIndex(openManagerIndex === idx ? null : idx)
          }
        />
      ))}
    </div>
  );
};

export default Teams;
