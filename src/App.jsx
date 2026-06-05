import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'

import Galaxy from './components/animations/Galaxy'
import Home from './views/Home'
import FilmDetail from './views/FilmDetail'

function AppLayout() {
  const location = useLocation()
  const isFilmRoute = location.pathname.startsWith('/film/')

  return (
    <div 
      className={`absolute inset-0 ${isFilmRoute ? 'overflow-y-auto scroll-smooth' : 'overflow-hidden'}`} 
      style={{ background: '#030014' }}
    >
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

      {/* ── Page Routes ───────────────────────────────────── */}
      <div className={`relative z-10 w-full ${isFilmRoute ? 'min-h-full' : 'h-full'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/film/:filmId" element={<FilmDetail />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
