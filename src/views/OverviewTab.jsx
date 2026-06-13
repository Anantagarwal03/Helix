import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import movies from '../data/moviesData.json';

const C = {
  cyan:    '#00f2fe',
  violet:  '#8b5cf6',
  magenta: '#ec4899',
  amber:   '#f59e0b',
  emerald: '#34d399',
};

const NumberTicker = ({ value, color = '#fff' }) => {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { damping: 55, stiffness: 80 });
  const display = useTransform(spring, (v) =>
    Math.round(v) >= 1000 ? Math.round(v).toLocaleString() : String(Math.round(v))
  );
  useEffect(() => { motionVal.set(value); }, [motionVal, value]);
  return <motion.span style={{ color }}>{display}</motion.span>;
};

const ShimmerCard = ({ children, className = '', accentA = C.cyan, accentB = C.violet, accentC = C.magenta }) => (
  <div className={`relative rounded-xl overflow-hidden p-[1px] ${className}`}>
    <div
      className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%]"
      style={{
        background: `conic-gradient(from 0deg, transparent 0deg, ${accentA}55 60deg, ${accentB}45 130deg, ${accentC}35 200deg, transparent 260deg)`,
        animation: 'shimmer-spin 5s linear infinite',
      }}
    />
    <div className="relative rounded-[11px] bg-[#030014]/96 backdrop-blur-md w-full h-full">
      {children}
    </div>
  </div>
);

const MetricRow = ({ label, value, color, barColor, barWidth, delay }) => (
  <div>
    <div className="flex justify-between text-[11px] mb-2 font-mono">
      <span className="uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.38)' }}>{label}</span>
      <span className="font-bold tabular-nums">
        <NumberTicker value={value} color={color} />
      </span>
    </div>
    <div className="h-[3px] w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: barColor }}
        initial={{ width: 0 }}
        animate={{ width: barWidth }}
        transition={{ duration: 1.4, ease: 'easeOut', delay }}
      />
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
      spot.style.background = `radial-gradient(700px circle at ${e.clientX - left}px ${e.clientY - top}px, rgba(0,242,254,0.04), transparent 55%)`;
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  const activePathways = {
    '1-2': { path: ['Timeline Splice', 'Traumatic Revelation'], match: 91, linkColor: C.cyan },
    '1-3': { path: ['Localized Loop', 'Retroactive Shift'], match: 88, linkColor: C.violet },
    '1-4': { path: ['Tangent Universe', 'Delusion Projection'], match: 94, linkColor: C.magenta },
    '1-5': { path: ['Temporal Anomaly', 'Obsession Loop'], match: 76, linkColor: C.amber },
    '2-3': { path: ['Identity Fracture', 'Perception Pivot'], match: 85, linkColor: C.cyan },
    '2-4': { path: ['Psychological Trauma', 'Ambiguous Ending'], match: 89, linkColor: C.violet },
    '2-5': { path: ['Vengeance Vector', 'Unresolved Labyrinth'], match: 82, linkColor: C.magenta },
    '3-4': { path: ['Subconscious Projection', 'Narrator Fracture'], match: 92, linkColor: C.cyan },
    '3-5': { path: ['Hidden Reality', 'Procedural Obsession'], match: 70, linkColor: C.amber },
    '4-5': { path: ['Insomnia Degeneration', 'Archival Maze'], match: 84, linkColor: C.violet },
  };

  const currentPath =
    activePathways[`${sourceMovie}-${targetMovie}`] ||
    activePathways[`${targetMovie}-${sourceMovie}`] || {
      path: ['Symmetric Vector', 'Structural Link'], match: 80, linkColor: C.cyan,
    };

  const sourceFilm = movies.find((m) => m.id === sourceMovie);
  const targetFilm = movies.find((m) => m.id === targetMovie);

  return (
    <>
      <style>{`
        @keyframes shimmer-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes aurora-drift-1 {
          0%, 100% { transform: translate(0%,0%) scale(1);    opacity: 0.10; }
          50%       { transform: translate(5%,-8%) scale(1.12); opacity: 0.17; }
        }
        @keyframes aurora-drift-2 {
          0%, 100% { transform: translate(0%,0%) scale(1);     opacity: 0.08; }
          50%       { transform: translate(-7%,6%) scale(1.15); opacity: 0.14; }
        }
        @keyframes aurora-drift-3 {
          0%, 100% { transform: translate(0%,0%)   scale(1);   opacity: 0.06; }
          33%       { transform: translate(4%,5%)   scale(1.08); opacity: 0.10; }
          66%       { transform: translate(-3%,-4%) scale(0.94); opacity: 0.07; }
        }
        .select-styled { appearance: none; -webkit-appearance: none; }
        .select-styled option { background: #030014; }
      `}</style>

      <div
        ref={containerRef}
        className="min-h-screen w-full bg-[#030014] text-white p-6 md:p-12 lg:p-16 flex flex-col overflow-y-auto relative box-border select-none"
      >
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-12%] left-[8%] w-[720px] h-[620px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(0,242,254,0.14) 0%, transparent 70%)', animation: 'aurora-drift-1 16s ease-in-out infinite' }} />
          <div className="absolute bottom-[-8%] right-[4%] w-[640px] h-[540px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)', animation: 'aurora-drift-2 20s ease-in-out infinite' }} />
          <div className="absolute top-[38%] left-[38%] w-[440px] h-[440px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(236,72,153,0.09) 0%, transparent 70%)', animation: 'aurora-drift-3 24s ease-in-out infinite' }} />
        </div>

        <div ref={spotlightRef} className="absolute inset-0 pointer-events-none" style={{ transition: 'background 80ms linear' }} />

        <div className="relative z-10 my-auto max-w-5xl pt-8 pb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[9px] font-mono uppercase tracking-[0.45em]" style={{ color: C.cyan }}>
              SYSTEM DIRECTIVE
            </span>
            <span className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(90deg, ${C.cyan}60, transparent)` }} />
            <span className="text-[9px] font-mono uppercase tracking-[0.45em]" style={{ color: 'rgba(255,255,255,0.2)' }}>
              INTERFACE MATRIX
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.88] mb-8">
            <span style={{ color: 'rgba(255,255,255,0.92)' }}>Deconstruct</span>
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(135deg, ${C.cyan} 0%, ${C.violet} 45%, ${C.magenta} 100%)` }}
            >
              The Labyrinth.
            </span>
          </h1>

          <p className="text-[15px] md:text-[17px] leading-[1.7] max-w-2xl" style={{ color: 'rgba(255,255,255,0.48)' }}>
            Helix tracks, coordinates, and models structural paradoxes across complex psychological
            layouts — mapping hidden thematic bridges between disparate non-linear timelines.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 relative z-10 w-full mt-auto mb-16">

          <ShimmerCard className="lg:col-span-3" accentA={C.cyan} accentB={C.violet} accentC={C.magenta}>
            <div className="p-6 flex flex-col justify-between gap-7">
              <div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-[11px] font-mono uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>
                      Narrative Paradox Link Finder
                    </h2>
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: C.cyan + '60' }}>
                      ALGORITHMIC TRANSVERSAL SYSTEM
                    </span>
                  </div>

                  <Link
                    to="/graph"
                    className="w-max px-4 py-2 rounded-lg font-mono text-[10px] tracking-[0.12em] uppercase transition-all duration-200 flex-shrink-0"
                    style={{
                      background: `${C.violet}10`,
                      border: `1px solid ${C.violet}35`,
                      color: C.violet,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${C.violet}20`;
                      e.currentTarget.style.borderColor = `${C.violet}70`;
                      e.currentTarget.style.boxShadow = `0 0 16px ${C.violet}25`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = `${C.violet}10`;
                      e.currentTarget.style.borderColor = `${C.violet}35`;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    EXPAND CORE SYSTEM →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono uppercase tracking-[0.18em]" style={{ color: C.cyan + '80' }}>
                      Source Core Node
                    </label>
                    <select
                      value={sourceMovie}
                      onChange={(e) => setSourceMovie(e.target.value)}
                      className="select-styled rounded-lg p-3 text-[11px] font-mono focus:outline-none cursor-pointer transition-all"
                      style={{
                        background: 'rgba(0,0,0,0.6)',
                        border: `1px solid ${C.cyan}25`,
                        color: 'rgba(255,255,255,0.82)',
                      }}
                      onFocus={e => { e.target.style.borderColor = `${C.cyan}60`; e.target.style.boxShadow = `0 0 12px ${C.cyan}12`; }}
                      onBlur={e => { e.target.style.borderColor = `${C.cyan}25`; e.target.style.boxShadow = 'none'; }}
                    >
                      {movies.map((m) => (
                        <option key={m.id} value={m.id} disabled={m.id === targetMovie}>{m.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono uppercase tracking-[0.18em]" style={{ color: C.magenta + '80' }}>
                      Target Destination
                    </label>
                    <select
                      value={targetMovie}
                      onChange={(e) => setTargetMovie(e.target.value)}
                      className="select-styled rounded-lg p-3 text-[11px] font-mono focus:outline-none cursor-pointer transition-all"
                      style={{
                        background: 'rgba(0,0,0,0.6)',
                        border: `1px solid ${C.magenta}25`,
                        color: 'rgba(255,255,255,0.82)',
                      }}
                      onFocus={e => { e.target.style.borderColor = `${C.magenta}60`; e.target.style.boxShadow = `0 0 12px ${C.magenta}12`; }}
                      onBlur={e => { e.target.style.borderColor = `${C.magenta}25`; e.target.style.boxShadow = 'none'; }}
                    >
                      {movies.map((m) => (
                        <option key={m.id} value={m.id} disabled={m.id === sourceMovie}>{m.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div
                className="rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="flex flex-col min-w-[140px]">
                  <span className="text-[8.5px] font-mono uppercase tracking-[0.2em] mb-1.5" style={{ color: C.amber + '70' }}>ROOT AXIS</span>
                  <span className="font-serif font-black text-[13px] tracking-tight uppercase leading-tight" style={{ color: 'rgba(255,255,255,0.88)' }}>
                    {sourceFilm?.title}
                  </span>
                </div>

                <div className="flex-1 w-full flex flex-col items-center px-4">
                  <div className="w-full flex justify-between text-[8.5px] font-mono mb-2.5 uppercase tracking-wider">
                    <span style={{ color: currentPath.linkColor + 'cc' }}>{currentPath.path[0]}</span>
                    <span style={{ color: currentPath.linkColor + '88' }}>{currentPath.path[1]}</span>
                  </div>
                  <div className="h-[1px] w-full relative" style={{ background: `linear-gradient(90deg, ${C.cyan}, ${C.violet}, ${C.magenta})` }}>
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded font-mono text-[9px] font-bold tracking-widest whitespace-nowrap"
                      style={{
                        background: '#030014',
                        border: `1px solid ${currentPath.linkColor}30`,
                        color: currentPath.linkColor,
                        boxShadow: `0 0 12px ${currentPath.linkColor}15`,
                      }}
                    >
                      <NumberTicker value={currentPath.match} color={currentPath.linkColor} />% SYMMETRY
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end min-w-[140px] md:text-right">
                  <span className="text-[8.5px] font-mono uppercase tracking-[0.2em] mb-1.5" style={{ color: C.magenta + '70' }}>TERMINAL REF</span>
                  <span className="font-serif font-black text-[13px] tracking-tight uppercase leading-tight" style={{ color: 'rgba(255,255,255,0.88)' }}>
                    {targetFilm?.title}
                  </span>
                </div>
              </div>
            </div>
          </ShimmerCard>

          <div className="flex flex-col gap-5">
            <ShimmerCard className="flex-1" accentA={C.cyan} accentB={C.emerald} accentC={C.violet}>
              <div className="p-6 flex flex-col gap-5 h-full">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.emerald, boxShadow: `0 0 6px ${C.emerald}` }} />
                  <h2 className="text-[10px] font-mono uppercase tracking-[0.16em] font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Database Metrics
                  </h2>
                </div>
                <div className="space-y-4 flex-1">
                  <MetricRow
                    label="Indexed Volumes"
                    value={movies.length}
                    color={C.cyan}
                    barColor={`linear-gradient(90deg, ${C.cyan}, ${C.violet})`}
                    barWidth="100%"
                    delay={0.2}
                  />
                  <MetricRow
                    label="Topology Intersects"
                    value={8943}
                    color={C.violet}
                    barColor={`linear-gradient(90deg, ${C.violet}, ${C.magenta})`}
                    barWidth="45%"
                    delay={0.4}
                  />
                  <MetricRow
                    label="Narrative Nodes"
                    value={104}
                    color={C.amber}
                    barColor={`linear-gradient(90deg, ${C.amber}, ${C.magenta}80)`}
                    barWidth="67%"
                    delay={0.6}
                  />
                </div>
              </div>
            </ShimmerCard>

            <ShimmerCard className="flex-1" accentA={C.magenta} accentB={C.violet} accentC={C.cyan}>
              <div className="p-6 flex flex-col gap-4 h-full">
                <div className="flex justify-between items-center">
                  <h2 className="text-[10px] font-mono uppercase tracking-[0.16em] font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Recent Registry
                  </h2>
                  <Link
                    to="/library"
                    className="text-[9px] font-mono uppercase tracking-widest transition-colors"
                    style={{ color: C.magenta + '90', borderBottom: `1px solid ${C.magenta}30`, paddingBottom: '1px' }}
                    onMouseEnter={e => e.currentTarget.style.color = C.magenta}
                    onMouseLeave={e => e.currentTarget.style.color = C.magenta + '90'}
                  >
                    VIEW ALL
                  </Link>
                </div>

                <ul className="space-y-2">
                  {movies.slice(0, 2).map((movie, i) => (
                    <li
                      key={movie.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg font-mono text-[10px] tracking-wide transition-all duration-150 cursor-default"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    >
                      <span className="truncate max-w-[110px] uppercase tracking-tight font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
                        {movie.title}
                      </span>
                      <span className="font-bold tabular-nums flex-shrink-0" style={{ color: i === 0 ? C.amber : C.cyan }}>
                        {movie.deviation}
                      </span>
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
