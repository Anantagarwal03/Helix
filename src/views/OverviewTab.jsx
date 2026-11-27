import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MOVIES } from '../data/movies';

const C = {
  cyan:    '#00f2fe',
  violet:  '#8b5cf6',
  magenta: '#ec4899',
  amber:   '#f59e0b',
  emerald: '#34d399',
};
const SORTED_MOVIES = [...MOVIES].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));

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

const OverviewTab = () => {
  const [selectedMovieId, setSelectedMovieId] = useState('');
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

  const selectedMovie = SORTED_MOVIES.find(movie => movie.id === selectedMovieId) || null;

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
              FILM STORY EXPLORER
            </span>
            <span className="h-px flex-1 max-w-[60px]" style={{ background: `linear-gradient(90deg, ${C.cyan}60, transparent)` }} />
            <span className="text-[9px] font-mono uppercase tracking-[0.45em]" style={{ color: 'rgba(255,255,255,0.2)' }}>
              TIMELINES · CHARACTERS · REVEALS
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
            Explore how a film’s timeline, characters, and reveals fit together. Start with one story, then follow the connections that make it work.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 relative z-10 w-full mt-auto mb-16">

          <ShimmerCard className="lg:col-span-3" accentA={C.cyan} accentB={C.violet} accentC={C.magenta}>
            <div className="p-6 md:p-8 flex flex-col gap-6">
              <div>
                <h2 className="text-[12px] font-mono uppercase tracking-[0.14em] font-bold mb-2 text-white/90">Start with one film</h2>
                <p className="text-xs text-slate-400">Choose any film to open its timeline, characters, and story connections.</p>
              </div>
              <label htmlFor="overview-film" className="text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-300">Choose a film</label>
              <select id="overview-film" value={selectedMovieId} onChange={event => setSelectedMovieId(event.target.value)} className="select-styled rounded-lg p-3 text-sm font-mono focus:outline-none cursor-pointer bg-black/60 border border-cyan-400/20 text-white">
                <option value="">Choose a film…</option>
                {SORTED_MOVIES.map(movie => <option key={movie.id} value={movie.id}>{movie.title} ({movie.year})</option>)}
              </select>
              {selectedMovie ? <div className="flex flex-col sm:flex-row gap-5 items-start rounded-xl p-4 bg-black/40 border border-white/10">
                {selectedMovie.poster ? <img src={selectedMovie.poster} alt={`${selectedMovie.title} poster`} className="w-20 h-28 object-cover rounded-md" /> : <div aria-hidden="true" className="w-20 h-28 shrink-0 rounded-md bg-white/[0.06] flex items-center justify-center text-[10px] text-slate-500">No poster</div>}
                <div className="flex-1">
                  <h3 className="text-lg text-white font-semibold">{selectedMovie.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{selectedMovie.year} · {selectedMovie.director}</p>
                  <p className="text-xs text-slate-400 mt-3">{selectedMovie.genres.join(' · ')} · {selectedMovie.nodes} mapped nodes · {selectedMovie.events} story events</p>
                  <div className="flex flex-wrap gap-3 mt-5">
                    <Link to={`/film/${selectedMovie.id}`} className="rounded-lg px-4 py-2 text-xs font-semibold text-[#030014] bg-cyan-300 hover:bg-cyan-200 transition-colors">Explore film →</Link>
                    <Link to={`/graph?film=${selectedMovie.id}`} className="rounded-lg px-4 py-2 text-xs font-medium text-slate-200 border border-white/15 hover:bg-white/5 transition-colors">Open story graph</Link>
                    <Link to="/library" className="rounded-lg px-4 py-2 text-xs font-medium text-slate-200 border border-white/15 hover:bg-white/5 transition-colors">Browse library</Link>
                  </div>
                </div>
              </div> : <div className="rounded-xl border border-white/10 bg-black/25 p-5">
                <p className="text-sm font-medium text-slate-200">No film selected</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">Your overview is ready when you are. Pick a title above, or browse the full library first.</p>
                <Link to="/library" className="mt-4 inline-flex rounded-lg border border-white/15 px-4 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/5">Browse the library</Link>
              </div>}
            </div>
          </ShimmerCard>

          <ShimmerCard className="flex-1" accentA={C.magenta} accentB={C.violet} accentC={C.cyan}>
            <div className="p-6 flex flex-col gap-5 h-full">
              <h2 className="text-[10px] font-mono uppercase tracking-[0.16em] font-bold text-white/60">How Helix works</h2>
              <ol className="space-y-4 text-xs text-slate-400">
                <li><span className="text-cyan-300 font-mono mr-2">01</span>Choose a film you know.</li>
                <li><span className="text-violet-300 font-mono mr-2">02</span>Follow its events and characters.</li>
                <li><span className="text-pink-300 font-mono mr-2">03</span>See how the reveal changes earlier scenes.</li>
              </ol>
              <p className="mt-auto text-[10px] font-mono uppercase tracking-wider text-violet-300">One film at a time · Spoiler levels on every map</p>
            </div>
          </ShimmerCard>
        </div>
      </div>
    </>
  );
};

export default OverviewTab;
