import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import BudgetPanel from './children/BudgetPanel';
import DraftTicker from './children/DraftTicker';
import AuctionBlock from './children/AuctionBlock';
import AuctionModal from './children/AuctionModal';
import BestAvailable from './children/BestAvailable';
import OverlayPanel from './children/OverlayPanel';
import TeamViewer from './children/TeamViewer';
import StatsPanel from './children/StatsPanel';

import './LiveDraftRoom.css';

const BASE_URL =
  'https://script.google.com/macros/s/AKfycbysTz4YxInFTnqpcBMz84MfLpZq7oWnnlAzn6Eu584O5xC1pRAGMGKEtRf3LMu_1ix-/exec';

const LiveDraftRoom = () => {
  const navigate = useNavigate();

  const [allPlayers, setAllPlayers] = useState([]);
  const [draftTeams, setDraftTeams] = useState([]);
  const [recentDraftPicks, setRecentDraftPicks] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [lastBackendTimestamp, setLastBackendTimestamp] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // Initial fetch when authenticated
  useEffect(() => {
    if (authenticated) {
      fetchAllDraftData();
    }
  }, [authenticated]);

  // Polling — ONLY for users
  useEffect(() => {
    if (!authenticated || isAdmin) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${BASE_URL}?action=timestamp`);
        const json = await res.json();
        if (!json?.timestamp) return;

        if (json.timestamp !== lastBackendTimestamp) {
          setLastBackendTimestamp(json.timestamp);
          fetchAllDraftData();
        }
      } catch (err) {
        console.error('Polling failed:', err);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [authenticated, isAdmin, lastBackendTimestamp]);

  const fetchAllDraftData = async () => {
    try {
      setLoading(true);

      const [playersRes, teamsRes, tickerRes] = await Promise.all([
        fetch(`${BASE_URL}?action=compiledlist`),
        fetch(`${BASE_URL}?action=managerinfo`),
        fetch(`${BASE_URL}?action=draftticker`),
      ]);

      const players = await playersRes.json();
      const teams = await teamsRes.json();
      const ticker = await tickerRes.json();

      const playerMap = new Map();
      (players || []).forEach((p) => {
        if (p?.Name) {
          playerMap.set(p.Name.toLowerCase(), p);
        }
      });

      const enrichedTeams = (teams || []).map((team) => {
        const enrichedPlayers = (team.players || []).map((player) => {
          const key = (player.name || '').toLowerCase();
          const fullPlayer = playerMap.get(key) || {};

          return {
            ...player,
            FPTS: fullPlayer.FPTS ?? 0,
            Position: player.position || fullPlayer.Position || '',
            Team: player.team || fullPlayer.Team || '',
            Tier: fullPlayer.Tier || '',
            Availability: fullPlayer.Availability || 'Available',
          };
        });
        return { ...team, players: enrichedPlayers };
      });

      const enrichedTicker = (ticker || []).map((pick) => {
        const key = (pick.name || '').toLowerCase();
        const fullPlayer = playerMap.get(key) || {};

        return {
          ...pick,
          Team: fullPlayer.Team || '',
          Position: fullPlayer.Position || '',
          FPTS: fullPlayer.FPTS ?? 0,
          Tier: fullPlayer.Tier || '',
        };
      });

      setAllPlayers(Array.isArray(players) ? players : []);
      setDraftTeams(enrichedTeams);
      setRecentDraftPicks(enrichedTicker);
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPlayer = async ({ player, team, cost }) => {
    if (!player || !team || cost == null) {
      alert(
        `Missing info\nPlayer: ${player?.name}\nTeam: ${team}\nCost: ${cost}`
      );
      return;
    }

    const params = new URLSearchParams({
      action: 'draftPlayer',
      Name: player.name || player.Name || '',
      Position: player.position || player.Position || '',
      FPTS: ((player.FPTS ?? player.fpts) || 0).toString(),
      Manager: team.trim().toUpperCase(),
      Cost: cost.toString(),
      Tier: player.tier || '',
    });

    try {
      const res = await fetch(`${BASE_URL}?${params.toString()}`);
      const result = await res.json();

      if (res.ok && result.success) {
        await fetch(`${BASE_URL}?action=pushTimestamp`);

        // Local state update (admin sees instant change)
        setAllPlayers(prev =>
          prev.map(p =>
            p.Name.toLowerCase() === (player.name || '').toLowerCase()
              ? { ...p, Availability: 'Drafted' }
              : p
          )
        );

        setDraftTeams(prev =>
          prev.map(teamData =>
            teamData.manager.toUpperCase() === team.trim().toUpperCase()
              ? {
                  ...teamData,
                  players: [
                    ...teamData.players,
                    { ...player, Cost: cost, Availability: 'Drafted' }
                  ]
                }
              : teamData
          )
        );

        setRecentDraftPicks(prev => [
          { ...player, Cost: cost, Manager: team },
          ...prev
        ]);

        setShowAuctionModal(false);
        setSelectedPlayer(null);
      } else {
        console.error('Assign failed:', result);
        alert(`Assign failed: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Assign error:', err);
      alert('Assignment error occurred.');
    }
  };

  const exitDraftRoom = () => {
    navigate('/draft');
  };

  const handleLogin = () => {
    const input = passwordInput.trim().toLowerCase();
    if (input === 'user') {
      setIsAdmin(false);
      setAuthenticated(true);
    } else if (input === 'B66A50') {
      setIsAdmin(true);
      setAuthenticated(true);
    } else {
      alert('Incorrect password. Please enter either "user".');
    }
  };

  if (!authenticated) {
    return (
      <div className="login-screen">
        <div className="login-box">
          <h2>Enter Password to Join Draft Room</h2>
          <p>Use "User" for regular view or "Admin" for admin access</p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Enter password"
          />
          <button onClick={handleLogin}>Enter</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <h2>Loading Draft Room...</h2>
      </div>
    );
  }

  return (
    <div className="draft-room">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <BudgetPanel draftTeams={draftTeams} />
        <button
          onClick={exitDraftRoom}
          className="exit-draft-arrow"
          title="Exit Draft Room"
        >
          ←
        </button>
      </div>

      <DraftTicker recentDraftPicks={recentDraftPicks} />

      <div className="main-panel-row">
        <TeamViewer draftTeams={draftTeams} />
        <AuctionBlock
          selectedPlayer={selectedPlayer}
          clearPlayer={() => setSelectedPlayer(null)}
          openDraftModal={() => setShowAuctionModal(true)}
          isAdmin={isAdmin}
        />
        <StatsPanel selectedPlayer={selectedPlayer} allPlayers={allPlayers} />
      </div>

      <BestAvailable
        players={allPlayers}
        onPlayerClick={(player) => {
          if ((player.Availability || '').toLowerCase() !== 'drafted') {
            setSelectedPlayer(player);
          }
        }}
      />

      <OverlayPanel
        fullPlayerList={allPlayers}
        draftTeams={draftTeams}
        setSelectedPlayer={setSelectedPlayer}
      />

      {showAuctionModal && selectedPlayer && (
        <AuctionModal
          player={selectedPlayer}
          draftTeams={draftTeams}
          onClose={() => setShowAuctionModal(false)}
          onAssign={handleAssignPlayer}
        />
      )}
    </div>
  );
};

export default LiveDraftRoom;
