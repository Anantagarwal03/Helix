import { useState } from 'react';
import { Link } from 'react-router-dom';
import movies from '../data/moviesData.json';

const OverviewTab = () => {
  const [sourceMovie, setSourceMovie] = useState('1');
  const [targetMovie, setTargetMovie] = useState('4');

  const activePathways = {
    '1-2': { path: ['Timeline Splice', 'Traumatic Revelation'], match: '91%' },
    '1-3': { path: ['Localized Loop', 'Retroactive Shift'], match: '88%' },
    '1-4': { path: ['Tangent Universe', 'Delusion Projection'], match: '94%' },
    '1-5': { path: ['Temporal Anomaly', 'Obsession Loop'], match: '76%' },
    '2-3': { path: ['Identity Fracture', 'Perception Pivot'], match: '85%' },
    '2-4': { path: ['Psychological Trauma', 'Ambiguous Ending'], match: '89%' },
    '2-5': { path: ['Vengeance Vector', 'Unresolved Labyrinth'], match: '82%' },
    '3-4': { path: ['Subconscious Projection', 'Narrator Fracture'], match: '92%' },
    '3-5': { path: ['Hidden Reality', 'Procedural Obsession'], match: '70%' },
    '4-5': { path: ['Insomnia Degeneration', 'Archival Maze'], match: '84%' }
  };

  const currentPath = activePathways[`${sourceMovie}-${targetMovie}`] || activePathways[`${targetMovie}-${sourceMovie}`] || { path: ['Symmetric Vector', 'Structural Link'], match: '80%' };

  return (
    <div className="min-h-screen w-full bg-[#030014] text-white p-6 md:p-12 lg:p-16 flex flex-col overflow-y-auto relative box-border select-none">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="relative z-10 my-auto max-w-5xl pt-8 pb-12">
        <span className="text-xs font-mono text-[#00f2fe] uppercase tracking-[0.45em] block mb-4">SYSTEM DIRECTIVE // INTERFACE MATRIX</span>
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white mb-8">
          Deconstruct <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/30 to-white/20">The Labyrinth.</span>
        </h1>
        <p className="text-lg md:text-xl font-medium text-gray-400 max-w-3xl leading-relaxed tracking-wide">
          Helix tracks, coordinates, and models structural paradoxes across complex psychological layouts, tracking hidden thematic bridges between disparate non-linear timelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10 w-full mt-auto mb-16">
        <div className="lg:col-span-3 border border-white/10 bg-black/40 backdrop-blur-md rounded-xl p-6 flex flex-col justify-between gap-8">
          <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-sm font-mono text-white uppercase tracking-wider font-bold">Narrative Paradox Link Finder</h2>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mt-0.5">ALGORITHMIC TRANSVERSAL SYSTEM</span>
              </div>
              <Link to="/graph" className="w-max px-4 py-2 border border-white/20 hover:border-white rounded-lg font-mono text-[11px] tracking-widest uppercase transition-all bg-white/5">
                EXPAND CORE SYSTEM →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Source Core Node</label>
                <select value={sourceMovie} onChange={(e) => setSourceMovie(e.target.value)} className="bg-black/80 border border-white/15 rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-[#00f2fe] cursor-pointer">
                  {movies.map(m => <option key={m.id} value={m.id} disabled={m.id === targetMovie} className="bg-[#030014]">{m.title}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Target Destination</label>
                <select value={targetMovie} onChange={(e) => setTargetMovie(e.target.value)} className="bg-black/80 border border-white/15 rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-[#ec4899] cursor-pointer">
                  {movies.map(m => <option key={m.id} value={m.id} disabled={m.id === sourceMovie} className="bg-[#030014]">{m.title}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-black/60 border border-white/5 rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex flex-col min-w-[140px]">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">ROOT AXIS</span>
              <span className="font-serif font-black text-sm tracking-wider uppercase text-white mt-1 truncate">
                {movies.find(m => m.id === sourceMovie)?.title}
              </span>
            </div>

            <div className="flex-1 w-full flex flex-col items-center">
              <div className="w-full flex justify-between text-[9px] font-mono text-[#00f2fe] mb-2 uppercase px-1 tracking-wide">
                <span>{currentPath.path[0]}</span>
                <span>{currentPath.path[1]}</span>
              </div>
              <div className="h-[1px] w-full bg-gradient-to-r from-[#00f2fe] via-[#8b5cf6] to-[#ec4899] relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 py-0.5 bg-black border border-white/10 rounded font-mono text-[9px] text-white tracking-widest font-bold">
                  {currentPath.match} SYMMETRY
                </div>
              </div>
            </div>

            <div className="flex flex-col md:items-end min-w-[140px] md:text-right">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">TERMINAL REF</span>
              <span className="font-serif font-black text-sm tracking-wider uppercase text-white mt-1 truncate">
                {movies.find(m => m.id === targetMovie)?.title}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="border border-white/10 bg-black/40 backdrop-blur-md rounded-xl p-6 flex flex-col justify-between flex-1 gap-4">
            <h2 className="text-xs font-mono text-gray-400 uppercase tracking-wider font-bold">Database Metrics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[11px] mb-1 font-mono">
                  <span className="text-gray-400 uppercase tracking-wider">Indexed Volumes</span>
                  <span className="text-white font-bold">{movies.length}</span>
                </div>
                <div className="h-0.5 w-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-white w-[100%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1 font-mono">
                  <span className="text-gray-400 uppercase tracking-wider">Topology Intersects</span>
                  <span className="text-white font-bold">8,943</span>
                </div>
                <div className="h-0.5 w-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-white/30 w-[45%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-white/10 bg-black/40 backdrop-blur-md rounded-xl p-6 flex flex-col justify-between flex-1 gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-mono text-gray-400 uppercase tracking-wider font-bold">Recent Registry</h2>
              <Link to="/library" className="text-[10px] text-gray-400 hover:text-white transition-colors uppercase font-mono tracking-wider border-b border-white/20 pb-0.5">VIEW ALL</Link>
            </div>
            <ul className="space-y-2">
              {movies.slice(0, 2).map((movie) => (
                <li key={movie.id} className="flex items-center justify-between p-2 rounded bg-white/5 font-mono text-[11px] tracking-wide">
                  <span className="text-gray-300 truncate max-w-[130px] font-medium uppercase">{movie.title}</span>
                  <span className="text-white font-bold">{movie.deviation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
