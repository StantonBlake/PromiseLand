import React, { useState, useEffect } from 'react';
// At top of MainLayout.jsx
import { useLocation } from 'react-router-dom';

import HeaderLogo from './components/HeaderLogo';
import Dashboard from './pages/Dashboard/Dashboard';
import News from './pages/News';
import SeasonRecap from './pages/SeasonRecap/SeasonRecap';
import ManagerPortfolio from './pages/ManagerPortfolio';
import KeeperCore from './pages/KeeperCore';
import SeasonPreview from './pages/SeasonPreview';
import DraftPage from './pages/DraftPage';
import DraftRecap from './pages/DraftRecap';
import Teams from './pages/Teams/Teams';
import DraftArchive from './pages/DraftArchive';
import HistoryResults from './pages/HistoryResults';
import LegacyScore from './pages/LegacyScore';
import AllTimeStats from './pages/AllTimeStats';
import DraftRecords from './pages/DraftRecords';

import './styles/MainLayout.css';

const tabConfig = {
  home: ['Dashboard', 'News', 'Season Recap'],
  league: ['Manager Portfolio', 'Keeper Core', 'Season Preview'],
  draft: ['Draft Room', 'Recap', 'Teams', 'Archive'],
  history: ['Results', 'Legacy Score', 'All Time', 'Draft Records'],
};






const APPSCRIPT_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzdJZPv6kBcLu6lx-aSnEaqIGwTIQ7fWyR3B0HbV8gZeFyCrIQYUmTgd22p4sUS2Ane5w/exec';

const MainLayout = () => {
  const [activeVerticalTab, setActiveVerticalTab] = useState('home');
  const [activeHorizontalTab, setActiveHorizontalTab] = useState(tabConfig['home'][0]);


  const location = useLocation();
  
  useEffect(() => {
    if (location.state?.fromLiveDraft) {
      setActiveVerticalTab('draft');
      setActiveHorizontalTab('Draft Room');
    }
  }, [location.state]);


  const [seasonRecapData, setSeasonRecapData] = useState({
    champion: null,
    standings: [],
    seasonText: [],
    draftFinishData: [],
  });
  
  const [managerArray, setManagerArray] = useState([]); // ✅ much cleaner
  ;

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  

  useEffect(() => {
    setLoading(true);
    setLoadError(null);

    fetch(APPSCRIPT_WEBAPP_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Network error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSeasonRecapData({
          champion: data.champion || null,
          standings: data.standings || [],
          seasonText: data.seasonText || [],
          draftFinishData: data.draftFinishData || [],
        });
        console.log('Fetched managers:', data.managers);
        setManagerArray(data.managers || []);
        
      })
      .catch((err) => {
        setLoadError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const renderContentPanel = () => {
    switch (activeHorizontalTab) {
      
      case 'Dashboard':
  return <Dashboard managers={managerArray} />;
      case 'News':
        return <News />;
      case 'Season Recap':
        return loading ? <div>Loading Season Recap...</div> : loadError ? <div>Error loading data: {loadError}</div> : <SeasonRecap champion={seasonRecapData.champion} standings={seasonRecapData.standings} seasonText={seasonRecapData.seasonText} draftFinishData={seasonRecapData.draftFinishData} />;
        case 'Manager Portfolio':
          return <ManagerPortfolio managers={managerArray} />;;
      case 'Keeper Core':
        return <KeeperCore />;
      case 'Season Preview':
        return <SeasonPreview />;
      case 'Draft Room':
        return <DraftPage />;
      case 'Recap':
        return <DraftRecap />;
      case 'Teams':
        return <Teams managers={managerArray} />;

      case 'Archive':
        return <DraftArchive />;
        case 'Results':
          return <HistoryResults managers={managerArray} />;
        
      case 'Legacy Score':
        return <LegacyScore />;
      case 'All Time':
        return <AllTimeStats />;
      case 'Draft Records':
        return <DraftRecords />;
      default:
        return <div>Please select a tab</div>;
    }
  };

  return (
    <>
      {/* Header always at top of the page */}
      <HeaderLogo />

  
      <div className="main-layout">
        {/* Vertical Tabs */}
        <aside className="vertical-tabs">
          {Object.keys(tabConfig).map((section) => (
            <button
              key={section}
              className={`vertical-tab-button ${activeVerticalTab === section ? 'active' : ''}`}
              onClick={() => {
                setActiveVerticalTab(section);
                setActiveHorizontalTab(tabConfig[section][0]);
              }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </aside>
  
        {/* Right Side */}
        <div className="layout-right-panel">
          <nav className="horizontal-tabs">
            {tabConfig[activeVerticalTab].map((tabName) => (
              <button
                key={tabName}
                className={`horizontal-tab-button ${activeHorizontalTab === tabName ? 'active' : ''}`}
                onClick={() => setActiveHorizontalTab(tabName)}
              >
                {tabName}
              </button>
            ))}
          </nav>
  
          <div className="tab-content-wrapper">
            <div className="tab-content">{renderContentPanel()}</div>
          </div>
        </div>
      </div>
    </>
  );
  
  
};

export default MainLayout;