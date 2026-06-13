import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playClickSound } from '../utils/audio';

import sixthSenseImg from '../assets/posters/sixth-sense.jpg';
import donnieDarkoImg from '../assets/posters/donnie-darko.jpg';
import zodiacImg from '../assets/posters/zodiac.jpg';
import taxiDriverImg from '../assets/posters/taxi-driver.jpg';
import oldboyImg from '../assets/posters/oldboy.jpg';

const FILTERS = ['All', 'Identity Reveal', 'Temporal Loop', 'Unreliable Reality', 'Psychological Descent', 'Revenge Trap'];

const libraryData = [
  { id: '1', title: 'The Sixth Sense', year: '1999', director: 'M. Night Shyamalan', rating: '9.8', genre: ['Psychological Thriller', 'Supernatural'], twistTag: 'Identity Reveal', nodes: 12, events: 23, image: sixthSenseImg, color: '#ef4444' },
  { id: '2', title: 'Donnie Darko', year: '2001', director: 'Richard Kelly', rating: '9.4', genre: ['Sci-Fi', 'Psychological'], twistTag: 'Temporal Loop', nodes: 18, events: 31, image: donnieDarkoImg, color: '#00f2fe' },
  { id: '3', title: 'Zodiac', year: '2007', director: 'David Fincher', rating: '8.7', genre: ['Crime', 'Mystery'], twistTag: 'Unreliable Reality', nodes: 29, events: 54, image: zodiacImg, color: '#eab308' },
  { id: '4', title: 'Taxi Driver', year: '1976', director: 'Martin Scorsese', rating: '8.5', genre: ['Crime', 'Drama'], twistTag: 'Psychological Descent', nodes: 21, events: 38, image: taxiDriverImg, color: '#8b5cf6' },
  { id: '5', title: 'Oldboy', year: '2003', director: 'Park Chan-wook', rating: '9.9', genre: ['Action', 'Drama'], twistTag: 'Revenge Trap', nodes: 24, events: 42, image: oldboyImg, color: '#ec4899' },
];

const useTilt = (maxTilt = 9) => {
  const ref = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
    transition: 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  });

  const onMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * maxTilt * 2;
    const rotateY = (x - 0.5) * maxTilt * 2;
    setTiltStyle({
      transform: `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02,1.02,1.02)`,
      transition: 'transform 0.08s ease',
    });
  }, [maxTilt]);

  const onMouseLeave = useCallback(() => {
    setTiltStyle({
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
      transition: 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    });
  }, []);

  return { ref, tiltStyle, onMouseMove, onMouseLeave };
};

const TerminalSearch = ({ value, onChange, resultCount, total }) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  return (
    <div className="w-full max-w-lg">
      <button
        type="button"
        className="w-full text-left"
        onClick={() => inputRef.current?.focus()}
      >
        <div
          className="relative flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200"
          style={{
            background: focused ? 'rgba(0,242,254,0.03)' : 'rgba(0,0,0,0.55)',
            border: focused ? '1px solid rgba(0,242,254,0.35)' : '1px solid rgba(255,255,255,0.08)',
            boxShadow: focused ? '0 0 24px rgba(0,242,254,0.08), inset 0 0 12px rgba(0,242,254,0.03)' : 'none',
          }}
        >
          <span
            className="text-[11px] font-mono flex-shrink-0 select-none"
            style={{ color: focused ? '#00f2fe' : 'rgba(255,255,255,0.2)' }}
          >
            /&gt;_
          </span>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search title, director, or tag..."
            className="flex-1 bg-transparent text-[12px] font-mono text-white placeholder-white/20 focus:outline-none tracking-wide"
            style={{ caretColor: '#00f2fe' }}
          />

          <div className="flex items-center gap-2 flex-shrink-0">
            {value && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(''); }}
                className="text-[10px] font-mono text-white/30 hover:text-white/70 transition-colors px-1"
              >
                ✕
              </button>
            )}
            <span className="text-[9px] font-mono tabular-nums" style={{ color: 'rgba(255,255,255,0.18)' }}>
              {resultCount}/{total}
            </span>
          </div>

          {focused && (
            <div
              className="absolute bottom-0 left-4 right-4 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, #00f2fe, transparent)', opacity: 0.6 }}
            />
          )}
        </div>
      </button>

      {value && (
        <p className="mt-1.5 text-[9px] font-mono tracking-widest uppercase pl-1" style={{ color: 'rgba(0,242,254,0.45)' }}>
          {resultCount === 0
            ? '— no matches in index —'
            : `${resultCount} record${resultCount !== 1 ? 's' : ''} matched`}
        </p>
      )}
    </div>
  );
};

const MovieCard = ({ movie }) => {
  const { ref, tiltStyle, onMouseMove, onMouseLeave } = useTilt(9);

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ ...tiltStyle, transformStyle: 'preserve-3d', willChange: 'transform' }}
      className="bg-[#0b081e]/60 border border-white/[0.07] rounded-xl overflow-hidden flex flex-col p-3 relative group shadow-2xl backdrop-blur-md"
    >
      <div className="w-full aspect-[2/3] overflow-hidden relative border border-white/[0.07] rounded-lg bg-black/40">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500 sepia-[.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b081e] via-transparent to-transparent opacity-90" />

        <div
          className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-lg"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.13) 2px, rgba(0,0,0,0.13) 3px)' }}
        />

        <div
          className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
          style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)' }}
        />

        <div className="absolute top-2 right-2 z-30 bg-black/70 backdrop-blur-md border border-orange-500/25 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1"
          style={{ color: '#fb923c' }}>
          ⚡ {movie.rating}
        </div>

        <div className="absolute bottom-2 left-2 z-30 flex flex-wrap gap-1 max-w-[90%]">
          {movie.genre.map((g, i) => (
            <span key={i} className="text-[9px] bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded tracking-wide" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {g}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col flex-1">
        <h2
          className="text-[13px] font-bold uppercase tracking-[-0.01em] leading-tight text-white group-hover:text-[#00f2fe] transition-colors duration-200 truncate"
        >
          {movie.title}
        </h2>
        <span className="text-[10px] font-mono tracking-wide mt-1 leading-none" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {movie.year} · {movie.director}
        </span>

        <div className="mt-3">
          <span
            className="inline-block text-[9px] font-mono px-2 py-0.5 rounded-sm border uppercase tracking-[0.08em]"
            style={{ borderColor: `${movie.color}35`, color: movie.color, backgroundColor: `${movie.color}08` }}
          >
            {movie.twistTag}
          </span>
        </div>

        <div className="mt-auto pt-3 border-t border-white/[0.05] flex items-center justify-between">
          <div className="flex gap-3">
            <span className="text-[10px] font-mono leading-none">
              <strong className="font-bold" style={{ color: '#00f2fe' }}>{movie.nodes}</strong>
              <span className="ml-1 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>Nodes</span>
            </span>
            <span className="text-[10px] font-mono leading-none">
              <strong className="font-bold" style={{ color: '#ec4899' }}>{movie.events}</strong>
              <span className="ml-1 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>Events</span>
            </span>
          </div>
          <button className="text-[10px] font-mono font-bold tracking-wider uppercase transition-all duration-200 group-hover:translate-x-0.5"
            style={{ color: '#00f2fe' }}>
            Explore →
          </button>
        </div>
      </div>
    </div>
  );
};

export default function LibrarySection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMovies = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return libraryData.filter(m => {
      const matchesFilter = activeFilter === 'All' || m.twistTag === activeFilter;
      const matchesSearch = !q || (
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        m.twistTag.toLowerCase().includes(q) ||
        m.genre.some(g => g.toLowerCase().includes(q))
      );
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-transparent text-white p-6 md:p-8 overflow-y-auto w-full box-border pb-24">

      <div className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
          <div>
            <span
              className="text-[9px] font-mono uppercase tracking-[0.35em] block mb-2"
              style={{ color: '#ec4899' }}
            >
              03 — LIBRARY
            </span>
            <h1
              className="text-[32px] font-black uppercase leading-none tracking-[-0.02em] text-white"
            >
              Film Library
            </h1>
            <p className="text-[11px] font-mono mt-2 tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {libraryData.length} volumes indexed · {libraryData.reduce((a, m) => a + m.nodes, 0)} nodes · {libraryData.reduce((a, m) => a + m.events, 0)} events
            </p>
          </div>

          <TerminalSearch
            value={searchQuery}
            onChange={setSearchQuery}
            resultCount={filteredMovies.length}
            total={libraryData.length}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => { playClickSound(); setActiveFilter(filter); }}
              className="px-3 py-1.5 rounded-md font-mono text-[10px] tracking-[0.08em] uppercase border transition-all duration-200"
              style={{
                background: activeFilter === filter ? 'rgba(0,242,254,0.08)' : 'transparent',
                borderColor: activeFilter === filter ? 'rgba(0,242,254,0.35)' : 'rgba(255,255,255,0.06)',
                color: activeFilter === filter ? '#00f2fe' : 'rgba(255,255,255,0.35)',
                boxShadow: activeFilter === filter ? '0 0 12px rgba(0,242,254,0.1)' : 'none',
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredMovies.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-3"
          >
            <span className="text-[11px] font-mono tracking-widest uppercase" style={{ color: 'rgba(0,242,254,0.4)' }}>
              /&gt;_ no records matched query
            </span>
            <p className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Try adjusting the search or filter.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredMovies.map((movie) => (
                <motion.div
                  key={movie.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
