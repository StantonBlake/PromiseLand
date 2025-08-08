import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KeeperPortal from './KeeperPortal';

export default function KeeperPortalWrapper() {
  const [teamsData, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamsData = async () => {
      try {
        const res = await fetch('https://script.google.com/macros/s/AKfycbysTz4YxInFTnqpcBMz84MfLpZq7oWnnlAzn6Eu584O5xC1pRAGMGKEtRf3LMu_1ix-/exec?view=teams');
        const data = await res.json();
        setTeamsData(data);
      } catch (err) {
        console.error('Failed to fetch teams:', err);
        alert('Error loading keeper data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsData();
  }, []);

  const handleClose = () => {
    navigate('/draft');
  };

  const handleSave = () => {
    // You can call APIs or update backend if needed before redirecting
    navigate('/draft');
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading keeper portal...</div>;
  }

  return (
    <KeeperPortal
      teamsData={teamsData}
      onClose={handleClose}
      onSave={handleSave}
    />
  );
}
