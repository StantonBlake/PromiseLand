import React, { useState, useEffect, useRef } from 'react';
import FullPlayerListTab from './FullPlayerListTab';
import TeamsBreakdownTab from './TeamsBreakdownTab';
import SummaryPanelTab from './SummaryPanelTab';
import './OverlayPanel.css';

const OverlayPanel = ({ fullPlayerList, draftTeams, setSelectedPlayer }) => {
  const [activeTab, setActiveTab] = useState('players');
  const [isExpanded, setIsExpanded] = useState(false);

  // Refs to measure the visible header pieces
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const tabsRef = useRef(null);

  // Visible height (px) to keep shown when collapsed
  const [visibleHeight, setVisibleHeight] = useState(80); // fallback

  useEffect(() => {
    // calculate how many px should remain visible when collapsed
    const calcVisible = () => {
      const topH = toggleRef.current?.getBoundingClientRect().height || 0;
      const tabsH = tabsRef.current?.getBoundingClientRect().height || 0;
      const extraGap = 2; // small comfortable gap so it doesn't sit flush
      const v = Math.round(topH + tabsH + extraGap);
      // minimum/maximum guards
      const minV = 40;
      const maxV = window.innerHeight ? Math.round(window.innerHeight * 0.5) : 400;
      setVisibleHeight(Math.max(minV, Math.min(v, maxV)));
    };

    // run once and on resize/orientation change
    if (typeof window !== 'undefined') {
      calcVisible();
      window.addEventListener('resize', calcVisible);
      window.addEventListener('orientationchange', calcVisible);
    }

    // also recalc if activeTab changes (tabs height can vary by content)
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', calcVisible);
        window.removeEventListener('orientationchange', calcVisible);
      }
    };
  }, [activeTab]);

  const collapsedTransform = `translateY(calc(100% - ${visibleHeight}px))`;
  const transformStyle = isExpanded ? 'translateY(0)' : collapsedTransform;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'players':
        return (
          <FullPlayerListTab
            fullPlayerList={fullPlayerList}
            setSelectedPlayer={setSelectedPlayer}
          />
        );
      case 'teams':
        return <TeamsBreakdownTab draftTeams={draftTeams} />;
      case 'summary':
        return <SummaryPanelTab draftTeams={draftTeams} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={panelRef}
      className="overlay-panel"
      style={{
        transform: transformStyle,
        transition: 'transform 0.28s cubic-bezier(.2,.9,.2,1)',
        willChange: 'transform',
      }}
      aria-expanded={isExpanded}
    >
      {/* Toggle Button ABOVE tabs */}
      <div ref={toggleRef} className="overlay-panel-toggle-above">
        <button
          className="toggle-btn-top"
          onClick={() => setIsExpanded((s) => !s)}
          title={isExpanded ? 'Collapse Panel' : 'Expand Panel'}
          aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
        >
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>

      {/* Tab Buttons */}
      <div ref={tabsRef} className="overlay-tabs">
        {[
          { id: 'players', label: 'Full Player List' },
          { id: 'teams', label: 'Teams Breakdown' },
          { id: 'summary', label: 'Summary Panel' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => {
              setActiveTab(tab.id);
              setIsExpanded(true);
            }}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div
        className="overlay-content"
        style={{
          opacity: isExpanded ? 1 : 0,
          pointerEvents: isExpanded ? 'auto' : 'none',
          transition: 'opacity 0.18s ease',
        }}
      >
        {renderTabContent()}
      </div>
    </div>
  );
};

export default OverlayPanel;
