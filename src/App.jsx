import { Routes, Route } from 'react-router-dom';
import MainLayout from './MainLayout';
import LiveDraftRoom from './pages/LiveDraftRoom/LiveDraftRoom';
import KeeperPortalWrapper from './pages/KeeperPortal/KeeperPortalWrapper';
import DraftPage from './pages/DraftPage'; // ✅ <-- this line was missing

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="draft" element={<DraftPage />} />
        {/* Add more tabs here like <Route path="home" element={<HomeTab />} /> */}
      </Route>
      <Route path="/draft-room" element={<LiveDraftRoom />} />
      <Route path="/draft/keepers" element={<KeeperPortalWrapper />} />


    </Routes>
  );
};

export default App;
