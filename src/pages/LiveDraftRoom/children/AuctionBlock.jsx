import React from "react";
import "./AuctionBlock.css";

const AuctionBlock = ({ selectedPlayer, clearPlayer, openDraftModal, isAdmin }) => {
  if (!selectedPlayer) {
    return (
      <div className="auction-block empty">
        <p>No player selected</p>
      </div>
    );
  }

  const {
    Name,
    FPTS,
    Position,
    Team,
    PosRank,
    Tier
  } = selectedPlayer;

  const tierLabel = `Tier ${Tier}`;
  const fpts = FPTS ?? 'N/A';

  return (
    <div className={`auction-block tier-${Tier}`}>
      <div className="ab-player-info">
        <div className="ab-player-header">
          <h2 className="ab-player-name">{Name}</h2>
          <div className={`tier-badge tier-${Tier}`}>{tierLabel}</div>
        </div>
        <div className="player-stats">
          <div className="stat"><span className="label">FPTS:</span> {fpts}</div>
          <div className="stat"><span className="label">Position:</span> {Position}</div>
          <div className="stat"><span className="label">Team:</span> {Team}</div>
          <div className="stat"><span className="label">Pos Rank:</span> {PosRank}</div>
        </div>
      </div>

      <div className="auction-actions">
        {isAdmin && (
          <button className="draft-btn" onClick={openDraftModal}>
            Draft Player
          </button>
        )}
        <button className="clear-btn" onClick={clearPlayer}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default AuctionBlock;
