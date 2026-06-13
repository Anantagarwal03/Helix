import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { playClickSound } from '../utils/audio';

// Poster Assets Setup
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
  { id: '5', title: 'Oldboy', year: '2003', director: 'Park Chan-wook', rating: '9.9', genre: ['Action', 'Drama'], twistTag: 'Revenge Trap', nodes: 24, events: 42, image: oldboyImg, color: '#ec4899' }
];

export default function LibrarySection() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredMovies = activeFilter === 'All' 
    ? libraryData 
    : libraryData.filter(m => m.twistTag === activeFilter);

  return (
    <div className="min-h-screen bg-transparent text-white p-6 md:p-8 overflow-y-auto w-full box-border pb-24">
      
      {/* Header View */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <span className="text-[10px] font-mono text-[#ec4899] tracking-[0.3em] uppercase block mb-1">03 — LIBRARY</span>
          <h1 className="text-4xl font-serif tracking-widest uppercase font-bold">Film Library</h1>
        </div>
        
        {/* Navigation Filters */}
        <div className="flex flex-wrap gap-2 max-w-xl">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => { playClickSound(); setActiveFilter(filter); }}
              className={`px-3 py-1.5 rounded-lg font-mono text-[11px] tracking-wide border transition-all duration-200 ${activeFilter === filter ? 'bg-white/10 text-white border-white/30 shadow-md' : 'bg-transparent text-gray-400 border-white/5 hover:text-white hover:bg-white/5'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {filteredMovies.map((movie) => (
          <div 
            key={movie.id}
            className="bg-[#0b081e]/60 border border-white/10 rounded-xl overflow-hidden flex flex-col p-3 relative group shadow-2xl backdrop-blur-md"
          >
            {/* Poster Element */}
            <div className="w-full aspect-[2/3] overflow-hidden relative border border-white/10 rounded-lg bg-black/40">
              <img src={movie.image} alt={movie.title} className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500 sepia-[.15]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b081e] via-transparent to-transparent opacity-90" />
              
              {/* Rating Pill */}
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md border border-orange-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-orange-400 flex items-center gap-1 shadow-md">
                ⚡ {movie.rating}
              </div>

              {/* Genres Pills */}
              <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 max-w-[90%]">
                {movie.genre.map((g, i) => (
                  <span key={i} className="text-[9px] bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded text-white/60 tracking-wide">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Typography Metadata */}
            <div className="mt-4 flex flex-col flex-1">
              <h2 className="text-base font-serif font-bold uppercase tracking-wide text-white group-hover:text-[#00f2fe] transition-colors truncate">
                {movie.title}
              </h2>
              <span className="text-[10px] font-mono text-gray-400 tracking-wider mt-0.5">
                {movie.year} • {movie.director}
              </span>

              {/* Primary Dynamic Tag Button */}
              <div className="mt-3">
                <span 
                  className="inline-block text-[10px] font-mono px-2.5 py-1 rounded border uppercase tracking-wider"
                  style={{ borderColor: `${movie.color}40`, color: movie.color, backgroundColor: `${movie.color}0a` }}
                >
                  {movie.twistTag}
                </span>
              </div>

              {/* Grid Footer Actions */}
              <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-400 tracking-widest uppercase">
                <div className="flex gap-2.5">
                  <span><strong className="text-white font-bold">{movie.nodes}</strong> Nodes</span>
                  <span><strong className="text-white font-bold">{movie.events}</strong> Events</span>
                </div>
                <button className="text-[#00f2fe] font-bold group-hover:translate-x-1 transition-transform cursor-pointer">
                  Explore →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
