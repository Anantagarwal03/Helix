import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { playClickSound } from '../utils/audio';
import { useAuth } from '../auth/useAuth';
import { loadSavedFilms, readCachedFilms, saveFilm as saveFilmToApi } from '../utils/libraryApi';
import { MOVIES } from '../data/movies';
import { STORY_GRAPHS } from '../data/storyGraphs';

const C = {
  cyan:    '#00f2fe',
  violet:  '#8b5cf6',
  magenta: '#ec4899',
  amber:   '#f59e0b',
  emerald: '#34d399',
};

const readSavedValue = (key, fallback) => {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    return saved ?? fallback;
  } catch {
    return fallback;
  }
};

const libraryData = [
  ...MOVIES.map(movie => {
    const story = STORY_GRAPHS[movie.id];
    const storyNodes = story?.nodes || [];
    return {
      id: movie.id,
      detailId: movie.id,
      title: movie.title,
      year: String(movie.year),
      director: movie.director,
      genre: movie.genres,
      twistTag: movie.twistType,
      nodes: storyNodes.filter(node => node.type !== 'film').length || movie.nodes,
      events: storyNodes.filter(node => node.type === 'event').length || movie.events,
      image: movie.poster,
      color: movie.accentColor,
    };
  }),
];
const withoutCuratedDuplicates = saved => saved.filter(movie => !STORY_GRAPHS[movie.graphId || movie.id]);

const useTilt = (maxTilt = 9) => {
  const ref = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
    transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
  });
  const onMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTiltStyle({
      transform: `perspective(900px) rotateX(${((0.5 - y) * maxTilt * 2).toFixed(2)}deg) rotateY(${((x - 0.5) * maxTilt * 2).toFixed(2)}deg) scale3d(1.02,1.02,1.02)`,
      transition: 'transform 0.08s ease',
    });
  }, [maxTilt]);
  const onMouseLeave = useCallback(() => {
    setTiltStyle({
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
      transition: 'transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)',
    });
  }, []);
  return { ref, tiltStyle, onMouseMove, onMouseLeave };
};

const TerminalSearch = ({ value, onChange, resultCount, total }) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  return (
    <div className="w-full max-w-lg">
      <button type="button" className="w-full text-left" onClick={() => inputRef.current?.focus()}>
        <div
          className="relative flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200"
          style={{
            background: focused ? `${C.cyan}05` : 'rgba(0,0,0,0.55)',
            border: focused ? `1px solid ${C.cyan}40` : '1px solid rgba(255,255,255,0.07)',
            boxShadow: focused ? `0 0 24px ${C.cyan}10, inset 0 0 12px ${C.cyan}04` : 'none',
          }}
        >
          <span className="text-[11px] font-mono flex-shrink-0 select-none" style={{ color: focused ? C.cyan : 'rgba(255,255,255,0.18)' }}>
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
            className="flex-1 bg-transparent text-[11px] font-mono focus:outline-none tracking-wide"
            style={{ color: 'rgba(255,255,255,0.82)', caretColor: C.cyan }}
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            {value && (
              <button type="button" onClick={(e) => { e.stopPropagation(); onChange(''); }}
                className="text-[10px] font-mono px-1 transition-colors"
                style={{ color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={e => e.currentTarget.style.color = C.magenta}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >✕</button>
            )}
            <span className="text-[9px] font-mono tabular-nums" style={{ color: 'rgba(255,255,255,0.18)' }}>
              {resultCount}/{total}
            </span>
          </div>
          {focused && (
            <div className="absolute bottom-0 left-4 right-4 h-[1px]"
              style={{ background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`, opacity: 0.5 }} />
          )}
        </div>
      </button>
      {value && (
        <p className="mt-1.5 text-[9px] font-mono tracking-widest uppercase pl-1" style={{ color: resultCount === 0 ? C.magenta + '80' : C.cyan + '60' }}>
          {resultCount === 0 ? '— no matches in index —' : `${resultCount} record${resultCount !== 1 ? 's' : ''} matched`}
        </p>
      )}
    </div>
  );
};

const MovieCard = ({ movie }) => {
  const { ref, tiltStyle, onMouseMove, onMouseLeave } = useTilt(9);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { onMouseLeave(); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      style={{ ...tiltStyle, transformStyle: 'preserve-3d', willChange: 'transform' }}
      className="rounded-xl overflow-hidden flex flex-col p-3 relative group shadow-2xl backdrop-blur-md transition-all duration-200"
      onMouseEnterCapture={() => setHovered(true)}
    >
      <div
        className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300"
        style={{
          background: 'rgba(8,4,28,0.7)',
          border: hovered ? `1px solid ${movie.color}45` : '1px solid rgba(255,255,255,0.06)',
          boxShadow: hovered ? `inset 0 0 30px ${movie.color}08` : 'none',
        }}
      />

      <div className="w-full aspect-[2/3] overflow-hidden relative border border-white/[0.06] rounded-lg bg-black/40">
        {movie.tmdb?.posterUrl || movie.image
          ? <img
              src={movie.tmdb?.posterUrl || movie.image}
              alt={movie.title}
              onError={event => { event.currentTarget.style.display = 'none'; }}
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500 sepia-[.12]"
            />
          : <div className="w-full h-full flex items-center justify-center p-5 text-center font-mono text-xs tracking-[0.25em] uppercase" style={{ background: `radial-gradient(ellipse at 50% 30%, ${movie.color}24, rgba(8,4,28,.95) 72%)`, color: `${movie.color}bb` }}>{movie.title}</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08041c] via-transparent to-transparent opacity-90" />

        <div
          className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-lg"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.13) 2px, rgba(0,0,0,0.13) 3px)' }}
        />
        <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
          style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)' }} />

        <div
          className="absolute top-2 right-2 z-30 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1"
          style={{ background: `${C.amber}14`, border: `1px solid ${C.amber}30`, color: C.amber }}
        >
          {Number.isFinite(Number(movie.tmdb?.rating)) && Number(movie.tmdb.rating) > 0
            ? `TMDB ${Number(movie.tmdb.rating).toFixed(1)}`
            : 'TMDB —'}
        </div>

        <div className="absolute bottom-2 left-2 z-30 flex flex-wrap gap-1 max-w-[90%]">
          {(movie.tmdb?.genres?.length ? movie.tmdb.genres : movie.genre).map((g, i) => (
            <span key={i} className="text-[9px] backdrop-blur-sm px-1.5 py-0.5 rounded tracking-wide"
              style={{ background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.4)' }}>
              {g}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col flex-1 relative z-10">
        <h2
          className="text-[13px] font-bold uppercase tracking-[-0.01em] leading-tight truncate transition-colors duration-200"
          style={{ color: hovered ? movie.color : 'rgba(255,255,255,0.88)' }}
        >
          {movie.title}
        </h2>
        <span className="text-[10px] font-mono tracking-wide mt-1 leading-none" style={{ color: 'rgba(255,255,255,0.28)' }}>
          {movie.year} · {movie.tmdb?.director || movie.director}
        </span>
        {movie.tmdb && <span className="text-[9px] text-slate-500 mt-1">{movie.tmdb.voteCount.toLocaleString()} TMDB votes · <a href={movie.tmdb.sourceUrl} target="_blank" rel="noreferrer" className="underline">source</a></span>}
        {movie.tmdb?.overview && <p className="text-[10px] text-slate-500 leading-relaxed mt-2 line-clamp-3">{movie.tmdb.overview}</p>}

        <div className="mt-3">
          <span
            className="inline-block text-[9px] font-mono px-2 py-0.5 rounded-sm border uppercase tracking-[0.08em]"
            style={{ borderColor: `${movie.color}35`, color: movie.color, backgroundColor: `${movie.color}08` }}
          >
            {movie.twistTag}
          </span>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex gap-3">
            <span className="text-[10px] font-mono leading-none">
              <strong className="font-bold" style={{ color: C.cyan }}>{movie.nodes}</strong>
              <span className="ml-1 uppercase text-[9px] tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>Nodes</span>
            </span>
            <span className="text-[10px] font-mono leading-none">
              <strong className="font-bold" style={{ color: C.magenta }}>{movie.events}</strong>
              <span className="ml-1 uppercase text-[9px] tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>Events</span>
            </span>
          </div>
          {movie.detailId || movie.graphId ? <Link
            to={`/film/${encodeURIComponent(movie.detailId || movie.graphId || movie.id)}`}
            className="text-[10px] font-mono font-bold tracking-wider uppercase transition-all duration-200 group-hover:translate-x-0.5"
            style={{ color: movie.color }}
          >
            Explore →
          </Link> : <span className="text-[9px] font-mono uppercase text-slate-600" title="A Helix story map has not been created for this film yet">Story map pending</span>}
        </div>
      </div>
    </div>
  );
};

export default function LibrarySection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState(() => {
    return [...libraryData, ...withoutCuratedDuplicates(readCachedFilms(user.id))];
  });
  const [tmdbData, setTmdbData] = useState(() => readSavedValue('helix-tmdb-metadata', {}));
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [showAddFilm, setShowAddFilm] = useState(false);
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResults, setLookupResults] = useState([]);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [storyDraft, setStoryDraft] = useState(null);
  const [storyGenerating, setStoryGenerating] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [savingFilm, setSavingFilm] = useState(false);
  const [libraryApiError, setLibraryApiError] = useState('');

  useEffect(() => {
    let active = true;
    loadSavedFilms(user.id).then(saved => {
      if (active) setMovies([...libraryData, ...withoutCuratedDuplicates(saved)]);
    }).catch(error => {
      if (active) {
        setMovies([...libraryData, ...withoutCuratedDuplicates(readCachedFilms(user.id))]);
        setLibraryApiError(`Saved maps are shown from this browser. The API library could not be loaded: ${error.message}`);
      }
    }).finally(() => { if (active) setLibraryLoading(false); });
    return () => { active = false; };
  }, [user.id]);

  const syncCurrentFilms = useCallback(async () => {
    setSyncing(true);
    setSyncMessage('Fetching current film details from TMDB…');
    const results = await Promise.allSettled(libraryData.map(async movie => {
      const response = await fetch(`/api/movie-metadata?title=${encodeURIComponent(movie.title)}&year=${movie.year}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Could not find ${movie.title}.`);
      return [movie.id, data];
    }));
    const next = { ...tmdbData };
    const failures = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') next[result.value[0]] = result.value[1];
      else failures.push(libraryData[index].title);
    });
    setTmdbData(next);
    localStorage.setItem('helix-tmdb-metadata', JSON.stringify(next));
    setSyncMessage(failures.length ? `Updated ${libraryData.length - failures.length} of ${libraryData.length}. Could not match: ${failures.join(', ')}.` : `All ${libraryData.length} films updated from TMDB.`);
    setSyncing(false);
  }, [tmdbData]);

  const initialMetadataSyncStarted = useRef(false);
  useEffect(() => {
    if (initialMetadataSyncStarted.current || libraryData.every(movie => tmdbData[movie.id])) return;
    initialMetadataSyncStarted.current = true;
    void syncCurrentFilms();
  }, [syncCurrentFilms, tmdbData]);

  const searchFilms = async (event) => {
    event.preventDefault();
    if (lookupQuery.trim().length < 2) return;
    setLookupLoading(true);
    setLookupError('');
    setSelectedFilm(null);
    setStoryDraft(null);
    try {
      const response = await fetch(`/api/search-movies?query=${encodeURIComponent(lookupQuery.trim())}`);
      const data = await response.json().catch(() => null);
      if (!data) throw new Error('The movie search server returned an empty response. Make sure the Helix API server is running, then try again.');
      if (!response.ok) throw new Error(data.error || 'Search failed.');
      setLookupResults(data.results || []);
      if (!data.results?.length) setLookupError('No matching movies found.');
    } catch (error) {
      setLookupError(error.message || 'Could not search right now.');
    } finally {
      setLookupLoading(false);
    }
  };

  const generateStoryMap = async () => {
    if (!selectedFilm) return;
    setStoryGenerating(true);
    setLookupError('');
    setStoryDraft(null);
    try {
      const response = await fetch('/api/generate-story-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId: selectedFilm.providerId }),
      });
      const data = await response.json().catch(() => null);
      if (!data) throw new Error('The story-map server returned an empty response. Make sure the Helix API server is running, then try again.');
      if (!response.ok) throw new Error(data.error || 'Could not generate a story map.');
      setStoryDraft(data);
    } catch (error) {
      setLookupError(error.message || 'Could not generate a story map right now.');
    } finally {
      setStoryGenerating(false);
    }
  };

  const addFilm = async () => {
    if (!storyDraft?.movie || !storyDraft?.storyGraph) return;
    if (libraryLoading) return;
    const { movie: details, storyGraph } = storyDraft;
    const graphId = storyGraph.id;
    const existingGeneratedMap = movies.some(item => item.graphId === graphId);
    const alreadyAdded = movies.some(item => item.id === graphId)
      || libraryData.some(item => item.title.toLowerCase() === details.title.toLowerCase() && String(item.year) === String(details.year));
    if (alreadyAdded && !existingGeneratedMap) {
      setLookupError(`${details.title} (${details.year}) is already in the library.`);
      return;
    }
    const palette = [C.cyan, C.violet, C.magenta, C.amber, C.emerald];
    const accentColor = palette[movies.length % palette.length];
    const movie = {
      id: graphId,
      graphId,
      title: details.title,
      year: details.year || 'Year unknown',
      director: details.director || 'Unknown director',
      rating: details.rating || '—',
      genre: details.genres?.length ? details.genres : ['Imported'],
      twistTag: storyGraph.twistType || 'Story map',
      nodes: storyGraph.nodes.filter(node => node.type !== 'film').length,
      events: storyGraph.nodes.filter(node => node.type === 'event').length,
      image: details.posterUrl || '/favicon.svg',
      color: accentColor,
      tmdb: details,
      storyGraph,
    };
    setSavingFilm(true);
    setLookupError('');
    try {
      await saveFilmToApi(movie);
      const saved = await loadSavedFilms(user.id);
      setMovies([...libraryData, ...withoutCuratedDuplicates(saved)]);
      setLibraryApiError('');
      setShowAddFilm(false);
      setSelectedFilm(null);
      setStoryDraft(null);
      setLookupQuery('');
      setLookupResults([]);
      navigate(`/graph?film=${encodeURIComponent(graphId)}`);
    } catch (error) {
      setLookupError(`Could not save this story map: ${error.message}`);
    } finally {
      setSavingFilm(false);
    }
  };

  const filteredMovies = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return movies.map(movie => ({ ...movie, tmdb: tmdbData[movie.id] || movie.tmdb })).filter(m => {
      const matchesFilter = activeFilter === 'All' || m.twistTag === activeFilter;
      const matchesSearch = !q || (
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        m.twistTag.toLowerCase().includes(q) ||
        m.genre.some(g => g.toLowerCase().includes(q))
      );
      return matchesFilter && matchesSearch;
    }).sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
  }, [activeFilter, searchQuery, movies, tmdbData]);
  const storyFilters = useMemo(() => [
    'All',
    ...[...new Set(movies.map(movie => movie.twistTag).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
  ], [movies]);

  const updatingStoryMap = Boolean(storyDraft && movies.some(movie => movie.graphId === storyDraft.storyGraph.id));

  return (
    <div className="min-h-screen bg-transparent text-white p-6 md:p-8 overflow-y-auto w-full box-border pb-24">

      <div className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.35em] block mb-2" style={{ color: C.magenta }}>
              03 — LIBRARY
            </span>
            <h1 className="text-[32px] font-black uppercase leading-none tracking-[-0.02em]" style={{ color: 'rgba(255,255,255,0.92)' }}>
              Film Library
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] font-mono tabular-nums" style={{ color: C.cyan }}>
                {movies.length} volumes
              </span>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px' }}>·</span>
              <span className="text-[10px] font-mono tabular-nums" style={{ color: C.violet }}>
                {movies.reduce((a, m) => a + m.nodes, 0)} nodes
              </span>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px' }}>·</span>
              <span className="text-[10px] font-mono tabular-nums" style={{ color: C.magenta }}>
                {movies.reduce((a, m) => a + m.events, 0)} events
              </span>
            </div>
            {libraryApiError && <p role="status" className="mt-2 max-w-xl text-[10px] font-mono text-amber-300">{libraryApiError}</p>}
          </div>
          <div className="flex flex-col gap-3 w-full max-w-lg">
          <button type="button" onClick={syncCurrentFilms} disabled={syncing} className="self-end px-3 py-2 rounded-md font-mono text-[10px] uppercase tracking-wider disabled:opacity-50" style={{ color: C.cyan, border: `1px solid ${C.cyan}50`, background: `${C.cyan}0c` }}>{syncing ? 'Syncing current films…' : 'Sync ratings & details'}</button>
          {syncMessage && <p className="text-[10px] font-mono text-slate-400 text-right">{syncMessage}</p>}
          <button type="button" onClick={() => setShowAddFilm(true)} className="self-end px-3 py-2 rounded-md font-mono text-[10px] uppercase tracking-wider" style={{ color: C.cyan, border: `1px solid ${C.cyan}50`, background: `${C.cyan}0c` }}>+ Add Film</button>
          <TerminalSearch
            value={searchQuery}
            onChange={setSearchQuery}
            resultCount={filteredMovies.length}
            total={movies.length}
          />
          </div>
        </div>

        <div className="flex justify-end">
          <label className="flex items-center gap-3 rounded-lg px-3 py-2.5 border border-white/[0.08] bg-black/30">
            <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-slate-500">Story type</span>
            <select
              value={activeFilter}
              onChange={event => { playClickSound(); setActiveFilter(event.target.value); }}
              className="max-w-[55vw] sm:max-w-xs bg-transparent text-[10px] font-mono uppercase tracking-wider text-cyan-300 focus:outline-none"
              style={{ colorScheme: 'dark' }}
              aria-label="Filter films by story type"
            >
              {storyFilters.map(filter => (
                <option key={filter} value={filter} className="bg-[#090914] text-slate-200">{filter}</option>
              ))}
            </select>
          </label>
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
            <span className="text-[11px] font-mono tracking-widest uppercase" style={{ color: C.magenta + '60' }}>
              /&gt;_ no records matched query
            </span>
            <p className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.18)' }}>
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

      <p className="mt-8 text-[10px] text-slate-600 text-center">
        This product uses the <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="underline">TMDB API</a> but is not endorsed or certified by TMDB.
      </p>

      {showAddFilm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-labelledby="add-film-title">
          <div className="w-full max-w-xl rounded-xl p-5 max-h-[85vh] overflow-y-auto" style={{ background: '#0b0820', border: '1px solid rgba(0,242,254,.24)' }}>
            <div className="flex justify-between items-center mb-4">
              <div><h2 id="add-film-title" className="text-white font-bold">{storyDraft ? 'Review story map' : 'Add a film'}</h2><p className="text-xs text-slate-400 mt-1">{storyDraft ? 'Check the generated beats, spoiler levels, connections, and sources before saving.' : 'Find the correct TMDB match, then generate a sourced story-map draft.'}</p></div>
              <button onClick={() => { setShowAddFilm(false); setStoryDraft(null); setLookupError(''); }} className="text-slate-400 px-2" aria-label="Close">✕</button>
            </div>
            {!storyDraft && <>
              <form onSubmit={searchFilms} className="flex gap-2">
                <input value={lookupQuery} onChange={e => setLookupQuery(e.target.value)} placeholder="Movie title and year" className="flex-1 rounded-md px-3 py-2 text-sm text-white bg-black/40 border border-white/10 outline-none" />
                <button disabled={lookupLoading || storyGenerating} className="rounded-md px-4 text-sm font-semibold disabled:opacity-50" style={{ background: `${C.cyan}20`, color: C.cyan }}>{lookupLoading ? 'Searching…' : 'Search'}</button>
              </form>
              <div className="mt-4 space-y-2">
                {lookupResults.map(film => <button key={film.providerId} type="button" onClick={() => { setSelectedFilm(film); setLookupError(''); }} className="w-full flex gap-3 text-left p-2 rounded-lg" style={{ background: selectedFilm?.providerId === film.providerId ? `${C.cyan}18` : 'rgba(255,255,255,.03)', border: `1px solid ${selectedFilm?.providerId === film.providerId ? `${C.cyan}60` : 'rgba(255,255,255,.07)'}` }}>
                  {film.posterUrl ? <img src={film.posterUrl} alt="" className="w-12 h-[72px] object-cover rounded" /> : <div className="w-12 h-[72px] bg-white/5 rounded" />}
                  <span className="min-w-0"><strong className="block text-sm text-white">{film.title} <span className="text-slate-400">{film.year}</span></strong><span className="line-clamp-3 text-xs text-slate-400 mt-1">{film.overview || 'No synopsis available.'}</span><span className="text-[10px] text-slate-500 mt-1 block">Poster and metadata: TMDB</span></span>
                </button>)}
              </div>
            </>}
            {lookupError && <p className="text-sm text-rose-300 mt-3">{lookupError}</p>}
            {storyDraft && <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3 rounded-lg p-3 bg-white/[0.03] border border-white/10">
                {storyDraft.movie.posterUrl && <img src={storyDraft.movie.posterUrl} alt="" className="w-12 h-[72px] object-cover rounded" />}
                <div className="min-w-0"><h3 className="text-sm font-semibold text-white">{storyDraft.movie.title} ({storyDraft.movie.year})</h3><p className="text-xs text-slate-400 mt-1">{storyDraft.storyGraph.summary}</p><p className="text-[10px] font-mono text-cyan-300 mt-2">{storyDraft.storyGraph.nodes.length - 1} story beats · {storyDraft.storyGraph.links.length} connections · {storyDraft.storyGraph.twistType}</p></div>
              </div>
              <div className="max-h-64 overflow-y-auto rounded-lg border border-white/10 divide-y divide-white/[0.06]">
                {storyDraft.storyGraph.nodes.filter(node => node.type !== 'film').map(node => <div key={node.id} className="p-3">
                  <div className="flex items-center justify-between gap-3"><strong className="text-xs text-white">{node.label}</strong><span className="text-[9px] font-mono uppercase tracking-wide text-slate-400">{node.type} · {['Spoiler-free', 'Some spoilers', 'Full story'][node.spoilerLevel]}</span></div>
                  <p className="text-[11px] text-slate-400 mt-1">{node.revealSubtext}</p>
                  <div className="flex flex-wrap gap-2 mt-2">{node.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="text-[9px] text-cyan-300 underline">{source.label}</a>)}</div>
                </div>)}
              </div>
              <div className="rounded-lg p-3 bg-black/20 border border-white/[0.06]">
                <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-300 mb-2">Connection explanations</h4>
                <div className="space-y-2 max-h-36 overflow-y-auto">{storyDraft.storyGraph.links.filter(link => link.source !== storyDraft.storyGraph.id).map(link => {
                  const sourceLabel = storyDraft.storyGraph.nodes.find(node => node.id === link.source)?.label || link.source;
                  const targetLabel = storyDraft.storyGraph.nodes.find(node => node.id === link.target)?.label || link.target;
                  return <p key={`${link.source}-${link.target}`} className="text-[10px] text-slate-400"><strong className="text-white">{sourceLabel} → {targetLabel}</strong><br /><span className="text-violet-300">{link.relationship}:</span> {link.explanation}</p>;
                })}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => { setStoryDraft(null); generateStoryMap(); }} disabled={storyGenerating} className="rounded-md py-2 text-xs font-semibold border border-white/10 text-slate-300 disabled:opacity-50">Regenerate</button>
                <button type="button" onClick={addFilm} disabled={savingFilm || libraryLoading} className="rounded-md py-2 text-xs font-bold disabled:opacity-50" style={{ background: C.cyan, color: '#030014' }}>{libraryLoading ? 'Loading library…' : savingFilm ? 'Saving…' : updatingStoryMap ? 'Approve & replace story map' : 'Approve & add to library'}</button>
              </div>
              <p className="text-[9px] text-slate-500">AI-generated maps can contain mistakes. Review the source links and plot details before approval.</p>
            </div>}
            {!storyDraft && selectedFilm && <button type="button" onClick={generateStoryMap} disabled={storyGenerating} className="mt-4 w-full rounded-md py-2 text-sm font-bold disabled:opacity-60" style={{ background: C.cyan, color: '#030014' }}>{storyGenerating ? 'Researching and drafting…' : `Generate story-map draft for ${selectedFilm.title}`}</button>}
          </div>
        </div>
      )}
    </div>
  );
}
