import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';

import HeroSection from './sections/HeroSection';
import MainDashboard from './views/MainDashboard'; 
import FilmDetail from './views/FilmDetail';
import Sidebar from './components/layout/Sidebar';
import TimelineEngine from './views/TimelineEngine';
import Galaxy from './components/animations/Galaxy';

// Create a wrapper for the dashboard that includes the sidebar
const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const isFilmRoute = location.pathname.startsWith('/film/');

  return (
    <div className="flex w-full h-screen bg-[#030014] text-white overflow-hidden">
      {/* ── Global Film Grain Overlay ────────── */}
      <div 
        className="fixed inset-0 z-[9999] opacity-[0.08] pointer-events-none mix-blend-screen"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* ── Galaxy WebGL background — z-0, fixed ──────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Galaxy
          hueShift          = {270}
          density           = {1.6}
          speed             = {0.25}
          starSpeed         = {0.8}
          glowIntensity     = {0.9}
          saturation        = {1.6}
          twinkleIntensity  = {0.55}
          mouseInteraction  = {true}
          mouseRepulsion    = {true}
          repulsionStrength = {0.6}
          transparent       = {true}
        />
        {/* Obsidian overlay — dims the galaxy so UI is legible */}
        <div className="absolute inset-0"
          style={{ background: 'rgba(3,0,20,0.72)' }} />
      </div>

      <Sidebar />
      <main className={`flex-1 h-screen relative z-10 ${isFilmRoute ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone Front Door - NO SIDEBAR */}
        <Route path="/" element={<HeroSection />} />
        
        {/* Protected Dashboard Routes - WITH SIDEBAR */}
        <Route path="/graph" element={
          <DashboardLayout>
            <MainDashboard />
          </DashboardLayout>
        } />
        
        <Route path="/film/:id" element={
          <DashboardLayout>
            <FilmDetail />
          </DashboardLayout>
        } />

        <Route path="/timeline" element={
          <DashboardLayout>
            <TimelineEngine />
          </DashboardLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
