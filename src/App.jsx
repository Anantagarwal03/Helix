import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext.jsx';
import { useAuth } from './auth/useAuth';
import './index.css';

import HeroSection from './sections/HeroSection';
import OverviewTab from './views/OverviewTab';
import GraphSection from './sections/GraphSection';
import LibrarySection from './sections/LibrarySection';
import FilmDetail from './views/FilmDetail';
import Sidebar from './components/layout/Sidebar';
import TimelineEngine from './views/TimelineEngine';
import Galaxy from './components/animations/Galaxy';
import AuthView from './views/AuthView';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen bg-[#030014]" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
};

const DashboardLayout = ({ children }) => {
  const { migrationWarning } = useAuth();
  return (
    <div className="flex w-full h-screen bg-[#030014] text-white overflow-hidden">
      <div 
        className="fixed inset-0 z-[9999] opacity-[0.08] pointer-events-none mix-blend-screen"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <Galaxy
          hueShift={270}
          density={1.6}
          speed={0.25}
          starSpeed={0.8}
          glowIntensity={0.9}
          saturation={1.6}
          twinkleIntensity={0.55}
          mouseInteraction={true}
          mouseRepulsion={true}
          repulsionStrength={0.6}
          transparent={true}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(3,0,20,0.72)' }} />
      </div>

      <Sidebar />
      <main className="flex-1 h-screen relative z-10 overflow-y-auto">
        {migrationWarning && <div role="status" className="mx-6 mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">{migrationWarning}</div>}
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/login" element={<AuthView mode="login" />} />
          <Route path="/register" element={<AuthView mode="register" />} />
          <Route path="/overview" element={<ProtectedRoute><DashboardLayout><OverviewTab /></DashboardLayout></ProtectedRoute>} />
          <Route path="/graph" element={<ProtectedRoute><DashboardLayout><GraphSection /></DashboardLayout></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><DashboardLayout><LibrarySection /></DashboardLayout></ProtectedRoute>} />
          <Route path="/film/:id" element={<ProtectedRoute><DashboardLayout><FilmDetail /></DashboardLayout></ProtectedRoute>} />
          <Route path="/timeline" element={<ProtectedRoute><DashboardLayout><TimelineEngine /></DashboardLayout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
