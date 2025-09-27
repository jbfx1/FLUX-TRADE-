import { Route, Routes } from 'react-router-dom';
import LandingPage from '../routes/LandingPage';
import DashboardPage from '../routes/DashboardPage';
import CallbackPage from '../routes/CallbackPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<DashboardPage />} />
      <Route path="/callback" element={<CallbackPage />} />
    </Routes>
  );
}
