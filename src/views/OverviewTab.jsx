import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import movies from '../data/moviesData.json';

const NumberTicker = ({ value }) => {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { damping: 55, stiffness: 80 });
  const display = useTransform(spring, (v) =>
    Math.round(v) >= 1000 ? Math.round(v).toLocaleString() : String(Math.round(v))
  );

  useEffect(() => {
    motionVal.set(value);
  }, [motionVal, value]);

  return <motion.span>{display}</motion.span>;
};

const ShimmerCard = ({ children, className = '' }) => (
  <div className={`relative rounded-xl overflow-hidden p-[1px] ${className}`}>
    <div
      className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%]"
      style={{
        background:
          'conic-gradient(from 0deg, transparent 0deg, rgba(0,242,254,0.55) 60deg, rgba(139,92,246,0.45) 130deg, rgba(236,72,153,0.35) 200deg, transparent 260deg)',
        animation: 'shimmer-spin 5s linear infinite',
      }}
    />
    <div className="relative rounded-[11px] bg-[#030014]/95 backdrop-blur-md w-full h-full">
      {children}
    </div>
  </div>
);

const OverviewTab = () => {
  const [sourceMovie, setSourceMovie] = useState('1');
  const [targetMovie, setTargetMovie] = useState('4');
  const containerRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    const spot = spotlightRef.current;
    if (!el || !spot) return;
    const onMove = (e) => {
      const { left, top } = el.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      spot.style.background = `radial-gradient(700px circle at ${x}px ${y}px, rgba(0,242,254,0.045), transparent 55%)`;
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  const activePathways = {
    '1-2': { path: ['Timeline Splice', 'Traumatic Revelation'], match: 91 },
    '1-3': { path: ['Localized Loop', 'Retroactive Shift'], match: 88 },
    '1-4': { path: ['Tangent Universe', 'Delusion Projection'], match: 94 },
    '1-5': { path: ['Temporal Anomaly', 'Obsession Loop'], match: 76 },
    '2-3': { path: ['Identity Fracture', 'Perception Pivot'], match: 85 },
    '2-4': { path: ['Psychological Trauma', 'Ambiguous Ending'], match: 89 },
    '2-5': { path: ['Vengeance Vector', 'Unresolved Labyrinth'], match: 82 },
    '3-4': { path: ['Subconscious Projection', 'Narrator Fracture'], match: 92 },
    '3-5': { path: ['Hidden Reality', 'Procedural Obsession'], match: 70 },
    '4-5': { path: ['Insomnia Degeneration', 'Archival Maze'], match: 84 },
  };

  const currentPath =
    activePathways[`${sourceMovie}-${targetMovie}`] ||
    activePathways[`${targetMovie}-${sourceMovie}`] || {
      path: ['Symmetric Vector', 'Structural Link'],
      match: 80,
    };

  return (
    <>
      <style>{`
        @keyframes shimmer-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes aurora-drift-1 {
          0%, 100% { transform: translate(0%, 0%) scale(1);   opacity: 0.10; }
          50%       { transform: translate(5%, -8%) scale(1.12); opacity: 0.16; }
        }
        @keyframes aurora-drift-2 {
          0%, 100% { transform: translate(0%, 0%) scale(1);    opacity: 0.08; }
          50%       { transform: translate(-7%, 6%) scale(1.15); opacity: 0.13; }
        }
        @keyframes aurora-drift-3 {
          0%, 100% { transform: translate(0%, 0%)  scale(1);    opacity: 0.06; }
          33%       { transform: translate(4%, 5%)  scale(1.08); opacity: 0.10; }
          66%       { transform: translate(-3%, -4%) scale(0.94); opacity: 0.07; }
        }
      `}</style>

      <div
        ref={containerRef}
        className="min-h-screen w-full bg-[#030014] text-white p-6 md:p-12 lg:p-16 flex flex-col overflow-y-auto relative box-border select-none"
      >
        {/* Fine grid */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Aurora blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-[-12%] left-[8%] w-[720px] h-[620px] rounded-full"
            style={{
              background: 'radial-gradient(ellipse, rgba(0,242,254,0.13) 0%, transparent 70%)',
              animation: 'aurora-drift-1 16s ease-in-out infinite',
            }}
          />
          <div
            className="absolute bottom-[-8%] right-[4%] w-[640px] h-[540px] rounded-full"
            style={{
              background: 'radial-gradient(ellipse, rgba(139,92,246,0.11) 0%, transparent 70%)',
              animation: 'aurora-drift-2 20s ease-in-out infinite',
            }}
          />
          <div
            className="absolute top-[38%] left-[38%] w-[440px] h-[440px] rounded-full"
            style={{
              background: 'radial-gradient(ellipse, rgba(236,72,153,0.08) 0%, transparent 70%)',
              animation: 'aurora-drift-3 24s ease-in-out infinite',
            }}
          />
        </div>

        {/* Cursor spotlight */}
        <div ref={spotlightRef} className="absolute inset-0 pointer-events-none" style={{ transition: 'background 80ms linear' }} />

        {/* Editorial headline */}
        <div className="relative z-10 my-auto max-w-5xl pt-8 pb-12">
          <span className="text-xs font-mono text-[#00f2fe] uppercase tracking-[0.45em] block mb-4">
            SYSTEM DIRECTIVE // INTERFACE MATRIX
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white mb-8">
            Deconstruct <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/30 to-white/20">
              The Labyrinth.
            </span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-gray-400 max-w-3xl leading-relaxed tracking-wide">
            Helix tracks, coordinates, and models structural paradoxes across complex psychological
            layouts, tracking hidden thematic bridges between disparate non-linear timelines.
          </p>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10 w-full mt-auto mb-16">

          {/* Paradox Link Finder */}
          <ShimmerCard className="lg:col-span-3">
            <div className="p-6 flex flex-col justify-between gap-8">
              <div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-sm font-mono text-white uppercase tracking-wider font-bold">
                      Narrative Paradox Link Finder
                    </h2>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mt-0.5">
                      ALGORITHMIC TRANSVERSAL SYSTEM
                    </span>
                  </div>
                  <Link
                    to="/graph"
                    className="w-max px-4 py-2 border border-white/20 hover:border-white rounded-lg font-mono text-[11px] tracking-widest uppercase transition-all duration-200 bg-white/5 hover:bg-white/10"
                  >
                    EXPAND CORE SYSTEM →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                      Source Core Node
                    </label>
                    <select
                      value={sourceMovie}
                      onChange={(e) => setSourceMovie(e.target.value)}
                      className="bg-black/80 border border-white/15 rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-[#00f2fe] cursor-pointer"
                    >
                      {movies.map((m) => (
                        <option key={m.id} value={m.id} disabled={m.id === targetMovie} className="bg-[#030014]">
                          {m.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                      Target Destination
                    </label>
                    <select
                      value={targetMovie}
                      onChange={(e) => setTargetMovie(e.target.value)}
                      className="bg-black/80 border border-white/15 rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-[#ec4899] cursor-pointer"
                    >
                      {movies.map((m) => (
                        <option key={m.id} value={m.id} disabled={m.id === sourceMovie} className="bg-[#030014]">
                          {m.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-black/60 border border-white/5 rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="flex flex-col min-w-[140px]">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">ROOT AXIS</span>
                  <span className="font-serif font-black text-sm tracking-wider uppercase text-white mt-1 truncate">
                    {movies.find((m) => m.id === sourceMovie)?.title}
                  </span>
                </div>

                <div className="flex-1 w-full flex flex-col items-center">
                  <div className="w-full flex justify-between text-[9px] font-mono text-[#00f2fe] mb-2 uppercase px-1 tracking-wide">
                    <span>{currentPath.path[0]}</span>
                    <span>{currentPath.path[1]}</span>
                  </div>
                  <div className="h-[1px] w-full bg-gradient-to-r from-[#00f2fe] via-[#8b5cf6] to-[#ec4899] relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 py-0.5 bg-black border border-white/10 rounded font-mono text-[9px] text-white tracking-widest font-bold whitespace-nowrap">
                      <NumberTicker value={currentPath.match} />% SYMMETRY
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end min-w-[140px] md:text-right">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">TERMINAL REF</span>
                  <span className="font-serif font-black text-sm tracking-wider uppercase text-white mt-1 truncate">
                    {movies.find((m) => m.id === targetMovie)?.title}
                  </span>
                </div>
              </div>
            </div>
          </ShimmerCard>

          <div className="flex flex-col gap-6">
            {/* Database Metrics */}
            <ShimmerCard className="flex-1">
              <div className="p-6 flex flex-col justify-between gap-5 h-full">
                <h2 className="text-xs font-mono text-gray-400 uppercase tracking-wider font-bold">
                  Database Metrics
                </h2>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-[11px] mb-2 font-mono">
                      <span className="text-gray-400 uppercase tracking-wider">Indexed Volumes</span>
                      <span className="text-white font-bold tabular-nums">
                        <NumberTicker value={movies.length} />
                      </span>
                    </div>
                    <div className="h-0.5 w-full bg-white/10 overflow-hidden rounded-full">
                      <motion.div
                        className="h-full bg-white rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-2 font-mono">
                      <span className="text-gray-400 uppercase tracking-wider">Topology Intersects</span>
                      <span className="text-white font-bold tabular-nums">
                        <NumberTicker value={8943} />
                      </span>
                    </div>
                    <div className="h-0.5 w-full bg-white/10 overflow-hidden rounded-full">
                      <motion.div
                        className="h-full bg-white/40 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '45%' }}
                        transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ShimmerCard>

            {/* Recent Registry */}
            <ShimmerCard className="flex-1">
              <div className="p-6 flex flex-col justify-between gap-4 h-full">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs font-mono text-gray-400 uppercase tracking-wider font-bold">
                    Recent Registry
                  </h2>
                  <Link
                    to="/library"
                    className="text-[10px] text-gray-400 hover:text-white transition-colors uppercase font-mono tracking-wider border-b border-white/20 pb-0.5"
                  >
                    VIEW ALL
                  </Link>
                </div>
                <ul className="space-y-2">
                  {movies.slice(0, 2).map((movie) => (
                    <li
                      key={movie.id}
                      className="flex items-center justify-between p-2 rounded bg-white/5 font-mono text-[11px] tracking-wide hover:bg-white/10 transition-colors"
                    >
                      <span className="text-gray-300 truncate max-w-[130px] font-medium uppercase">
                        {movie.title}
                      </span>
                      <span className="text-white font-bold">{movie.deviation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ShimmerCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverviewTab;
