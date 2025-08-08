import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DraftPage() {
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [teamsData, setTeamsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const correctPasscode = 'test'; // TEMP
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamsData = async () => {
      try {
        const res = await fetch('https://script.google.com/macros/s/AKfycbysTz4YxInFTnqpcBMz84MfLpZq7oWnnlAzn6Eu584O5xC1pRAGMGKEtRf3LMu_1ix-/exec');
        const data = await res.json();
        setTeamsData(data);
      } catch (err) {
        console.error('Error fetching teams:', err);
        alert('Failed to load teams.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamsData();
  }, []);

  const goToLiveDraft = () => {
    navigate('/draft-room');
  };

  const handleSetKeepersClick = () => {
    setShowPasscodeModal(true);
  };

  const handlePasscodeSubmit = () => {
    if (passcodeInput === correctPasscode) {
      navigate('/draft/keepers', { state: { teamsData } });
    } else {
      alert('Incorrect passcode.');
    }
    setPasscodeInput('');
    setShowPasscodeModal(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>DraftRoom Portal</h1>

      <button
        onClick={goToLiveDraft}
        style={{ marginBottom: 12, padding: '10px 20px', fontSize: 16 }}
      >
        Live Draft Room
      </button>

      <br />

      <button
        onClick={handleSetKeepersClick}
        style={{ padding: '10px 20px', fontSize: 16 }}
        disabled={isLoading}
      >
        {isLoading ? 'Loading Teams...' : 'Set Keepers'}
      </button>

      {/* PASSCODE MODAL */}
      {showPasscodeModal && (
        <div style={modalBackdropStyle}>
          <div style={modalBoxStyle}>
            <h3>Enter Passcode</h3>
            <input
              type="password"
              value={passcodeInput}
              onChange={e => setPasscodeInput(e.target.value)}
              style={inputStyle}
              placeholder="Passcode"
            />
            <div>
              <button onClick={handlePasscodeSubmit} style={{ marginRight: 10 }}>
                Submit
              </button>
              <button onClick={() => setShowPasscodeModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <hr style={{ margin: '20px 0' }} />

      <p><strong>Note:</strong> The Live Draft Room is where the draft action happens in real-time.</p>
      <p><em>Set Keepers</em> allows you to lock in your returning players before the draft starts. Requires special access.</p>
      <p>Check your roster and settings carefully before locking keepers.</p>
      <p>For questions or issues, contact your league commissioner.</p>
    </div>
  );
}

const modalBackdropStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 1000,
};

const modalBoxStyle = {
  background: '#fff',
  padding: 24,
  borderRadius: 8,
  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
};

const inputStyle = {
  width: '100%',
  padding: 10,
  marginBottom: 12,
  fontSize: 16,
};
