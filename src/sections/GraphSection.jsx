import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { loadSavedFilms, readCachedFilms } from '../utils/libraryApi';
import DecryptedText from '../components/animations/DecryptedText';
import TwistGraph3D from '../components/TwistGraph3D';
import { MOVIES } from '../data/movies';
import { STORY_GRAPHS } from '../data/storyGraphs';

const SideRevealPanel = ({ node, onClose, spoilerLevel, selectedConnectionId }) => {
  const open = !!node;
  const color = node?.filmColor || '#00f2fe';
  const filmLabel = node?.filmName || '';

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(3,0,14,0.32)' }}
          onClick={onClose}
        />
      )}

      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col overflow-hidden"
        style={{
          width: '384px',
          background: 'rgba(0,0,0,0.42)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: open ? `-24px 0 80px rgba(0,0,0,0.6), -2px 0 0 ${color}18` : 'none',
        }}
      >
        {node && (
          <>
            <div className="h-0.5 w-full flex-shrink-0"
              style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

            <div className="flex items-start justify-between px-6 pt-5 pb-4 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-mono uppercase tracking-[0.16em]"
                    style={{ color: `${color}70` }}>{filmLabel}</span>
                  <span className="text-slate-800">·</span>
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider"
                    style={{ color, background: `${color}10`, border: `1px solid ${color}22` }}>
                    {node.revealClassification || node.type}
                  </span>
                </div>
                <h3 className="text-[13px] font-semibold text-white/80 tracking-tight leading-snug">
                  {node.label}
                </h3>
              </div>

              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-150"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#475569' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#475569' }}
              >
                <svg width="9" height="9" viewBox="0 0 15 15" fill="none">
                  <path d="M1 1l13 13M14 1L1 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6"
              style={{ scrollbarWidth: 'none' }}>

              <div className="flex flex-col gap-3">
                <p className="text-[9.5px] font-mono text-slate-700 uppercase tracking-[0.14em]">
                  {node.type === 'twist' ? 'Twist explanation' : 'Story explanation'}
                </p>
                <div style={{ borderLeft: `2px solid ${color}35`, paddingLeft: '16px' }}>
                  <p className="text-[17px] font-bold text-white leading-snug tracking-tight">
                    <DecryptedText
                      key={node.id}
                      text={node.revealText || node.label}
                      speed={22}
                      maxIterations={18}
                      sequential={true}
                      revealDirection="start"
                      animateOn="view"
                      characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_+-=<>?|~"
                      className="text-white"
                      encryptedClassName=""
                    />
                  </p>
                </div>
              </div>

              {node.revealSubtext && (
                <div className="flex flex-col gap-2" style={{ animation: 'fadeIn 0.5s ease 0.9s both', opacity: 0 }}>
                  <p className="text-[9.5px] font-mono text-slate-700 uppercase tracking-[0.14em]">
                    Context
                  </p>
                  <p className="text-[12.5px] text-slate-400 leading-relaxed">
                    {node.revealSubtext}
                  </p>
                </div>
              )}

              {node.timelineStage && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-600">Story order</span>
                  <span>{node.timelineOrder}. {node.timelineStage}</span>
                </div>
              )}

              {node.relationships?.length > 0 && (
                <div className="flex flex-col gap-3">
                  <p className="text-[9.5px] font-mono text-slate-700 uppercase tracking-[0.14em]">Why it connects</p>
                  {node.relationships.map(relation => (
                    <div key={relation.id} className="rounded-lg p-3 transition-colors" style={{ background: relation.id === selectedConnectionId ? `${color}12` : 'rgba(255,255,255,0.025)', border: `1px solid ${relation.id === selectedConnectionId ? `${color}80` : 'rgba(255,255,255,0.06)'}` }}>
                      <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color }}>{relation.relationship} · {relation.direction}</p>
                      <p className="text-xs text-slate-300 mt-1">{relation.otherLabel}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{relation.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              {spoilerLevel >= 2 && node.sources?.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-[9.5px] font-mono text-slate-700 uppercase tracking-[0.14em]">References</p>
                  {node.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="text-[11px] text-cyan-300 hover:text-cyan-200 underline">{source.label} ↗</a>)}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)', animation: 'fadeIn 0.5s ease 1.1s both', opacity: 0 }}>
                {[
                  { label: 'Node ID', value: `#${node.id}` },
                  { label: 'Type', value: node.type },
                  { label: 'Film', value: filmLabel },
                  { label: 'Class', value: node.revealClassification || '—' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[9.5px] font-mono text-slate-700 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-[11.5px] font-mono" style={{ color: `${color}80` }}>{value}</p>
                  </div>
                ))}
              </div>

            </div>

            <div className="flex-shrink-0 px-6 py-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[10px] font-mono text-slate-800 text-center">
                Click anywhere outside to dismiss
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const GlassPanel = ({ children, style = {}, className = '' }) => (
  <div className={className} style={{
    background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '14px', ...style,
  }}>
    {children}
  </div>
);

const LegendDot = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <div className="w-2 h-2 rounded-full flex-shrink-0"
      style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
    <span className="text-[10.5px] font-mono text-slate-600">{label}</span>
  </div>
);

const StoryTimeline = ({ nodes, selectedNodeId, onSelect }) => (
  <div data-reveal className="relative flex-shrink-0 h-[48vh] min-h-[340px] max-h-[620px] rounded-xl overflow-y-auto px-4 md:px-7 py-5"
    style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.08)' }}>
    <div className="flex items-center justify-between gap-4 mb-5">
      <div>
        <h3 className="text-sm font-semibold text-white">Story timeline</h3>
        <p className="text-[10px] font-mono text-slate-500 mt-1">Select a beat to read its context and related connections.</p>
      </div>
      <span className="text-[10px] font-mono text-slate-400">{nodes.length} beats</span>
    </div>
    {nodes.length ? (
      <ol className="relative ml-2 border-l border-violet-400/20">
        {nodes.map((node, index) => {
          const color = node.type === 'character' ? '#00f2fe' : node.type === 'event' ? '#8b5cf6' : '#ec4899';
          const selected = node.id === selectedNodeId;
          return (
            <li key={node.id} className="relative pl-7 pb-4 last:pb-0">
              <span className="absolute -left-[5px] top-4 w-[9px] h-[9px] rounded-full ring-4 ring-[#080516]"
                style={{ background: color, boxShadow: `0 0 10px ${color}80` }} />
              <button type="button" onClick={() => onSelect(node)} aria-label={`Open story beat ${node.timelineOrder || index + 1}: ${node.label}`}
                className="w-full rounded-lg px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
                style={{ background: selected ? `${color}12` : 'rgba(255,255,255,0.025)', border: `1px solid ${selected ? `${color}55` : 'rgba(255,255,255,0.06)'}` }}>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-[9px] font-mono text-slate-500">{String(node.timelineOrder || index + 1).padStart(2, '0')}</span>
                  <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color }}>{node.type}{node.isContext ? ' · context' : ''}</span>
                  <span className="text-[9px] font-mono text-slate-600">{node.timelineStage || 'Story beat'}</span>
                </div>
                <span className="block text-xs font-semibold text-slate-100 mt-1">{node.label}</span>
                {(node.revealSubtext || node.revealText) && <span className="block text-[10px] leading-relaxed text-slate-400 mt-1">{node.revealSubtext || node.revealText}</span>}
              </button>
            </li>
          );
        })}
      </ol>
    ) : (
      <p className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-4 py-5 text-xs text-slate-400">Turn on a node type to show story beats in the timeline.</p>
    )}
  </div>
);

const SPOILER_FREE_COPY = {
  'sixth-sense': { revealText: 'Story map: The Sixth Sense', revealSubtext: 'Explore its characters and story connections.' },
  'ss-malcolm': { revealText: 'A child psychologist working with Cole', revealSubtext: 'Malcolm is trying to help Cole while rebuilding his relationship with his wife.' },
  'ss-cole': { revealText: 'A boy coping with frightening experiences', revealSubtext: 'Cole struggles to explain what is happening to him.' },
  'ss-anna': { revealText: 'Malcolm’s wife', revealSubtext: 'Malcolm believes Anna has become distant from him.' },
  'donnie-darko': { revealText: 'Story map: Donnie Darko', revealSubtext: 'Explore its characters and story connections.' },
  'dd-donnie': { revealText: 'A teenager facing strange experiences', revealSubtext: 'Donnie’s story begins with a series of unsettling events.' },
  'dd-gretchen': { revealText: 'A new student who connects with Donnie', revealSubtext: 'Gretchen becomes part of Donnie’s life as unusual events begin to unfold.' },
  zodiac: { revealText: 'Story map: Zodiac', revealSubtext: 'Explore its characters and story connections.' },
  'z-robert': { revealText: 'A cartoonist drawn into a murder investigation', revealSubtext: 'Robert becomes increasingly interested in the Zodiac case.' },
  'td-night-shifts': { revealText: 'Travis’s overnight routine', revealSubtext: 'His cab shifts take him through the city after dark.' },
  'td-betsy': { revealText: 'A campaign worker Travis admires', revealSubtext: 'Travis tries to build a connection with Betsy.' },
  'taxi-driver': { revealText: 'Story map: Taxi Driver', revealSubtext: 'Explore its characters and story connections.' },
  'td-travis': { revealText: 'A cab driver struggling with isolation', revealSubtext: 'Travis finds it difficult to connect with the people around him.' },
  oldboy: { revealText: 'Story map: Oldboy', revealSubtext: 'Explore its characters and story connections.' },
  'ob-captivity': { revealText: 'A man disappears without explanation', revealSubtext: 'His sudden confinement begins the story’s mystery.' },
  'ob-daesu': { revealText: 'A man searching for answers after his release', revealSubtext: 'Dae-su tries to understand what happened to him.' },
  'ob-release': { revealText: 'An unexplained release', revealSubtext: 'Dae-su is freed without being told why he was imprisoned.' },
};

const SPOILER_OPTIONS = [
  { label: 'Spoiler-free', level: 0 },
  { label: 'Some spoilers', level: 1 },
  { label: 'Full story', level: 2 },
];

const GraphSection = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const routeFilmId = searchParams.get('film');
  const [selectedFilmId, setSelectedFilmId] = useState(() => routeFilmId || MOVIES[0].id);
  const [savedFilmRecords, setSavedFilmRecords] = useState([]);
  const [visibleTypes, setVisibleTypes] = useState(['character', 'event', 'twist']);
  const [spoilerLevel, setSpoilerLevel] = useState(0);
  const [viewMode, setViewMode] = useState('map');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const graphRef = useRef(null);
  useEffect(() => {
    let active = true;
    loadSavedFilms(user.id)
      .then(saved => { if (active) setSavedFilmRecords(saved.filter(movie => movie.storyGraph?.nodes && movie.storyGraph?.links && !STORY_GRAPHS[movie.graphId || movie.id])); })
      .catch(() => { if (active) setSavedFilmRecords(readCachedFilms(user.id).filter(movie => movie.storyGraph?.nodes && movie.storyGraph?.links && !STORY_GRAPHS[movie.graphId || movie.id])); });
    return () => { active = false; };
  }, [user.id]);
  const graphMovies = useMemo(() => [
    ...MOVIES,
    ...savedFilmRecords.map(movie => ({
      id: movie.graphId || movie.id,
      title: movie.title,
      year: movie.year,
      director: movie.director,
      accentColor: movie.color || '#00f2fe',
    })),
  ], [savedFilmRecords]);
  const customStoryGraphs = useMemo(() => Object.fromEntries(savedFilmRecords.map(movie => [movie.graphId || movie.id, movie.storyGraph])), [savedFilmRecords]);
  const allStoryGraphs = useMemo(() => ({ ...STORY_GRAPHS, ...customStoryGraphs }), [customStoryGraphs]);
  const selectedFilmIdExists = graphMovies.some(movie => movie.id === selectedFilmId);
  const activeFilmId = routeFilmId && graphMovies.some(movie => movie.id === routeFilmId)
    ? routeFilmId
    : selectedFilmIdExists ? selectedFilmId : MOVIES[0].id;
  const selectedFilm = graphMovies.find(movie => movie.id === activeFilmId) || MOVIES[0];

  const graphData = useMemo(() => {
    const selectedStory = allStoryGraphs[selectedFilm.id] || { nodes: [], links: [] };
    const storyNodesById = new Map(selectedStory.nodes.map(node => [node.id, node]));
    const filmLinks = selectedStory.links.filter(link => {
      const source = typeof link.source === 'object' ? link.source.id : link.source;
      const target = typeof link.target === 'object' ? link.target.id : link.target;
      const impliedLevel = Math.max(storyNodesById.get(source)?.spoilerLevel ?? 0, storyNodesById.get(target)?.spoilerLevel ?? 0);
      return (link.spoilerLevel ?? impliedLevel) <= spoilerLevel;
    });
    const availableNodes = selectedStory.nodes.filter(node => (node.spoilerLevel ?? 2) <= spoilerLevel);
    const filmStoryNodes = selectedStory.nodes.filter(node => node.type !== 'film');
    const storyOrder = new Map(filmStoryNodes.map((node, index) => [node.id, node.timelineOrder || index + 1]));
    const sameBeatOffset = new Map();
    ['character', 'event', 'twist'].forEach(type => {
      const orders = [...new Set(filmStoryNodes.filter(node => node.type === type).map(node => storyOrder.get(node.id)))];
      orders.forEach(order => {
        const beatNodes = filmStoryNodes.filter(node => node.type === type && storyOrder.get(node.id) === order);
        beatNodes.forEach((node, index) => sameBeatOffset.set(node.id, (index - (beatNodes.length - 1) / 2) * 28));
      });
    });
    const availableIds = new Set(availableNodes.map(node => node.id));
    const focusIds = new Set(availableNodes
      .filter(node => visibleTypes.includes(node.type))
      .map(node => node.id));
    const contextIds = new Set([selectedFilm.id, ...focusIds]);
    filmLinks.forEach(link => {
      const source = typeof link.source === 'object' ? link.source.id : link.source;
      const target = typeof link.target === 'object' ? link.target.id : link.target;
      if (focusIds.has(source) && availableIds.has(target)) contextIds.add(target);
      if (focusIds.has(target) && availableIds.has(source)) contextIds.add(source);
    });
    const baseNodes = availableNodes
      .filter(node => contextIds.has(node.id))
      .map(node => {
        const order = storyOrder.get(node.id) || 1;
        const x = node.type === 'film' ? -165 : -85 + (order - 1) * 55;
        const stagger = order % 2 === 0 ? 26 : -26;
        const y = node.type === 'character' ? 90 + stagger + (sameBeatOffset.get(node.id) || 0)
          : node.type === 'event' ? stagger + (sameBeatOffset.get(node.id) || 0)
            : node.type === 'twist' ? -90 : 0;
        return {
          ...node,
          ...(spoilerLevel === 0 ? SPOILER_FREE_COPY[node.id] : {}),
          spoilerLevel: node.spoilerLevel ?? 2,
          isContext: node.type !== 'film' && !focusIds.has(node.id),
          film: selectedFilm.id,
          filmName: selectedFilm.title,
          filmColor: selectedFilm.accentColor,
          x, y, z: 0,
          fx: x, fy: y, fz: 0,
        };
      });
    const visibleIds = new Set(baseNodes.map(node => node.id));
    const links = filmLinks.filter(link => {
      const source = typeof link.source === 'object' ? link.source.id : link.source;
      const target = typeof link.target === 'object' ? link.target.id : link.target;
      return visibleIds.has(source) && visibleIds.has(target);
    });
    const namesById = new Map(baseNodes.map(node => [node.id, node.label]));
    const nodes = baseNodes.map(node => ({
      ...node,
      relationships: links.filter(link => {
        const source = typeof link.source === 'object' ? link.source.id : link.source;
        const target = typeof link.target === 'object' ? link.target.id : link.target;
        return source === node.id || target === node.id;
      }).map(link => {
        const source = typeof link.source === 'object' ? link.source.id : link.source;
        const target = typeof link.target === 'object' ? link.target.id : link.target;
        const outgoing = source === node.id;
        const otherId = outgoing ? target : source;
        return {
          id: `${source}-${target}`,
          relationship: link.relationship || 'connects to',
          direction: outgoing ? 'outgoing' : 'incoming',
          otherLabel: namesById.get(otherId) || otherId,
          explanation: link.explanation || 'This story connection has not been described yet.',
        };
      }),
    }));
    return { nodes, links };
  }, [selectedFilm, visibleTypes, spoilerLevel, allStoryGraphs]);

  const graphNodesById = useMemo(() => new Map(graphData.nodes.map(node => [node.id, node])), [graphData]);
  const selectableNodes = graphData.nodes.filter(node => node.type !== 'film').sort((a, b) => (a.timelineOrder || 99) - (b.timelineOrder || 99));
  const closePanel = useCallback(() => { setSelectedNode(null); setSelectedConnectionId(null); }, []);
  const handleNodeClick = useCallback(node => { setSelectedNode(node); setSelectedConnectionId(null); }, []);
  const handleLinkClick = useCallback(link => {
    const source = typeof link.source === 'object' ? link.source : graphNodesById.get(link.source);
    const target = typeof link.target === 'object' ? link.target : graphNodesById.get(link.target);
    const center = {
      x: ((source?.x || 0) + (target?.x || 0)) / 2,
      y: ((source?.y || 0) + (target?.y || 0)) / 2,
      z: ((source?.z || 0) + (target?.z || 0)) / 2,
    };
    if (source && target) {
      graphRef.current?.cameraPosition({ x: center.x, y: center.y + 25, z: center.z + 125 }, center, 550);
    }
    setSelectedConnectionId(`${source?.id || link.source}-${target?.id || link.target}`);
    setSelectedNode(source || target || null);
  }, [graphNodesById]);
  const toggleType = type => {
    setVisibleTypes(current => current.includes(type) ? current.filter(item => item !== type) : [...current, type]);
    setSelectedNode(null);
    setSelectedConnectionId(null);
  };

  const focusNode = node => {
    setSelectedNode(node);
    setSelectedConnectionId(null);
    if (Number.isFinite(node.x) && Number.isFinite(node.y) && Number.isFinite(node.z)) {
      graphRef.current?.cameraPosition(
        { x: node.x + 45, y: node.y + 30, z: node.z + 45 },
        { x: node.x, y: node.y, z: node.z },
        700,
      );
    }
  };

  const selectTimelineNode = node => {
    setSelectedNode(node);
    setSelectedConnectionId(null);
  };

  const toggleFilter = type => toggleType(type);
  const filters = [
    ['character', 'Characters', '#00f2fe'],
    ['event', 'Events', '#8b5cf6'],
    ['twist', 'Twists', '#ec4899'],
  ];

  return (
    <div className="relative w-full min-h-full flex flex-col px-5 md:px-8 py-6 md:py-8 gap-4 overflow-y-auto">
      <div data-reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 flex-shrink-0">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-300/70 uppercase tracking-[0.18em]">02 — One film at a time</span>
          <h2 className="text-[26px] font-bold text-white tracking-tight leading-none mt-1">Story Graph</h2>
          <p className="text-xs text-slate-400 mt-1">Explore the story map or follow its beats in chronological order.</p>
        </div>
        <label className="flex flex-col gap-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
          Film
          <select value={activeFilmId} onChange={event => { setSelectedFilmId(event.target.value); setSearchParams({ film: event.target.value }); setSelectedNode(null); setSelectedConnectionId(null); }} className="min-w-56 rounded-lg px-3 py-2 text-sm normal-case tracking-normal text-white bg-black/50 border border-white/10 focus:outline-none focus:border-cyan-400/50">
            {graphMovies.map(movie => <option key={movie.id} value={movie.id}>{movie.title} ({movie.year})</option>)}
          </select>
        </label>
      </div>

      <div aria-label="Story graph controls" className="flex flex-wrap items-center gap-x-2 gap-y-2 flex-shrink-0 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-3 md:px-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mr-1">Spoiler level</span>
        {SPOILER_OPTIONS.map(option => {
          const active = spoilerLevel === option.level;
          return <button key={option.level} type="button" aria-pressed={active} onClick={() => { setSpoilerLevel(option.level); setSelectedNode(null); setSelectedConnectionId(null); }} className="rounded-full px-3 py-1.5 text-[10px] font-mono border transition-colors" style={{ color: active ? '#fbbf24' : '#64748b', borderColor: active ? 'rgba(251,191,36,.45)' : 'rgba(255,255,255,.08)', background: active ? 'rgba(251,191,36,.08)' : 'transparent' }}>{option.label}</button>;
        })}
        <span className="hidden md:block w-px h-5 bg-white/10 mx-1" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mr-1">Show</span>
        {filters.map(([type, label, color]) => {
          const active = visibleTypes.includes(type);
          return <button key={type} type="button" aria-pressed={active} onClick={() => toggleFilter(type)} className="rounded-full px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border transition-colors" style={{ color: active ? color : '#64748b', borderColor: active ? `${color}55` : 'rgba(255,255,255,.08)', background: active ? `${color}10` : 'transparent' }}>{label}</button>;
        })}
        <span className="hidden md:block w-px h-5 bg-white/10 mx-1" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mr-1">Layout</span>
        {[['map', 'Map'], ['timeline', 'Timeline']].map(([mode, label]) => {
          const active = viewMode === mode;
          return <button key={mode} type="button" aria-pressed={active} onClick={() => setViewMode(mode)}
            className="rounded-full px-3 py-1.5 text-[10px] font-mono border transition-colors"
            style={{ color: active ? '#67e8f9' : '#64748b', borderColor: active ? 'rgba(103,232,249,.4)' : 'rgba(255,255,255,.08)', background: active ? 'rgba(103,232,249,.08)' : 'transparent' }}>{label}</button>;
        })}
        <span className="ml-auto text-xs text-slate-400 tabular-nums">{graphData.nodes.length} nodes <span className="text-slate-600">·</span> {graphData.links.length} connections</span>
      </div>

      <p className="text-xs text-slate-400">{viewMode === 'map' ? 'Select a node to inspect its story context. Select a connection to read why the beats are linked.' : 'Beats follow story order; character entries mark where their story threads enter the timeline.'} {spoilerLevel < 2 && 'Full ending details appear when Full story is selected.'}</p>

      {viewMode === 'map' ? <div data-reveal className="relative rounded-xl overflow-hidden flex-shrink-0 h-[48vh] min-h-[340px] max-h-[620px]" style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 rounded-lg px-3 py-2 bg-[#030014]/80 border border-white/10">
          <LegendDot color={selectedFilm.accentColor} label="Film" />
          {filters.filter(([type]) => graphData.nodes.some(node => node.type === type)).map(([type, label, color]) => <LegendDot key={label} color={color} label={`${label}${visibleTypes.includes(type) ? '' : ' · context'}`} />)}
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-2 rounded-full bg-[#030014]/80 border border-white/10 whitespace-nowrap">
          {[['Left-click', 'select'], ['Drag', 'orbit'], ['Scroll', 'zoom']].map(([key, action], index) => <div key={key} className="flex items-center gap-1.5">{index > 0 && <span className="text-slate-700">·</span>}<span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">{key}</span><span className="text-[9px] font-mono text-slate-500">{action}</span></div>)}
        </div>
        <TwistGraph3D ref={graphRef} graphData={graphData} onNodeClick={handleNodeClick} onLinkClick={handleLinkClick} />
      </div> : <StoryTimeline nodes={selectableNodes} selectedNodeId={selectedNode?.id} onSelect={selectTimelineNode} />}

      {viewMode === 'map' && <div data-reveal className="flex-shrink-0">
        <GlassPanel style={{ padding: 0, overflow: 'hidden' }}>
          <div className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div><h3 className="text-[12px] font-semibold text-white/80">{selectedFilm.title}: story nodes</h3><p className="text-[10px] font-mono text-slate-500 mt-1">Select a row to focus and read its context.</p></div>
            <span className="text-[10px] font-mono text-slate-400">{selectableNodes.length} shown</span>
          </div>
          <div className="max-h-56 overflow-y-auto">
            {selectableNodes.map(node => {
              const active = selectedNode?.id === node.id;
              const color = node.type === 'character' ? '#00f2fe' : node.type === 'event' ? '#8b5cf6' : '#ec4899';
              return <button key={node.id} type="button" onClick={() => focusNode(graphNodesById.get(node.id) || node)} className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/5 border-b border-white/[0.04]" style={{ background: active ? `${color}10` : 'transparent' }}>
                <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 8px ${color}80` }} />
                <span className="min-w-0 flex-1"><span className="block text-xs font-medium text-slate-200">{node.label}</span><span className="block text-[10px] text-slate-500 mt-1 line-clamp-2">{node.revealSubtext || node.revealText}</span></span>
                <span className="text-[9px] font-mono uppercase tracking-wider flex-shrink-0 text-right" style={{ color }}>{node.type}{node.isContext && <span className="block text-slate-600 mt-1">context</span>}</span>
              </button>;
            })}
            {!selectableNodes.length && <p className="px-4 py-6 text-xs text-slate-500">Turn on a node type to show its entries.</p>}
          </div>
        </GlassPanel>
      </div>}

      <SideRevealPanel node={selectedNode} onClose={closePanel} spoilerLevel={spoilerLevel} selectedConnectionId={selectedConnectionId} />
    </div>
  );
};

export default GraphSection;
