import React from 'react';
import LegacyScoreboard from './LegacyScoreboard';
import './Dashboard.css';

const HomeScreen = ({ managers = [] }) => {
  
  return (
    <div className="home-screen">
      <h1 className="home-title">Welcome to the Ultimate Fantasy Football League!</h1>
      <p className="home-intro">
        Welcome to the heart of gridiron glory — where savvy managers, epic drafts, and legendary legacies collide! 
        This league isn’t just about touchdowns; it’s a high-stakes arena where strategy, savvy spending, and years of history 
        shape the champions. Whether you’re here to chase that elusive championship, build your dynasty, or simply enjoy 
        the thrill of the draft and season-long battles, you’ve found your home. Dive into the live auctions, track your 
        team’s rise through detailed stats, and compete not just for wins, but for fantasy immortality. Ready to make your mark? Let’s get started!
      </p>

      <section className="legacy-board">
        <h2 className="board-title">Legacy Scoreboard</h2>
        <LegacyScoreboard managers={managers} />
      </section>
    </div>
  );
};

export default HomeScreen;