import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ParticipantPage } from '@/pages/ParticipantPage';
import { ModeratorPage } from '@/pages/ModeratorPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ParticipantPage />} />
        <Route path="/moderator" element={<ModeratorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
