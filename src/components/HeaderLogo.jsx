import React from 'react';
import './HeaderLogo.css';

const HeaderLogo = () => {
  return (
    <header className="modern-header">
      <div className="logo-text">
        <span className="primary">The</span>
        <span className="highlight">Promise</span>
        <span className="primary">Land</span>
      </div>
      <p className="tagline">Fantasy Football League</p>
    </header>
  );
};

export default HeaderLogo;
