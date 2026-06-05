import { useState } from 'react'
import { MOVIES }   from '../data/movies'

// ── Breadcrumb ───────────────────────────────────────────────────────────
const Breadcrumb = ({ crumbs }) => (
  <div className="flex items-center gap-1.5 text-[12px] font-mono text-slate-600">
    {crumbs.map((c, i) => (
      <span key={i} className="flex items-center gap-1.5">
        {i > 0 && <span className="text-slate-800">/</span>}
        <span className={i === crumbs.length - 1 ? 'text-slate-400' : ''}>{c}</span>
      </span>
    ))}
  </div>
)

// ── Empty poster fallback ────────────────────────────────────────────────
const PosterFallback = ({ color, title }) => (
  <div
    className="w-full h-full flex flex-col items-center justify-center gap-3"
    style={{
      background: `radial-gradient(ellipse at 50% 30%, ${color}18 0%, rgba(5,5,5,0.95) 70%)`,
    }}
  >
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center"
      style={{ background: `${color}15`, border: `1px solid ${color}30` }}
    >
      <svg width="20" height="20" viewBox="0 0 15 15" fill="none">
        <rect x="1.5" y="2.5" width="12" height="10" rx="1.5" stroke={color} strokeWidth="1.2"/>
        <path d="M6 5.5L10 7.5L6 9.5V5.5Z" fill={color}/>
      </svg>
    </div>
    <span className="text-[11px] font-mono text-center px-3 leading-relaxed"
      style={{ color: `${color}80` }}>
      {title}
    </span>
  </div>
)

// ── Movie Card — 21st.dev card pattern ──────────────────────────────────
const MovieCard = ({ movie }) => {
  const [imgError, setImgError] = useState(false)

  return (
    <article
      id={`card-${movie.slug}`}
      className="hover-lift group rounded-xl overflow-hidden flex flex-col cursor-pointer"
      style={{
        background: 'rgba(10,10,15,0.5)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* Poster */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '2/3' }}>
        {!imgError ? (
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            onError={() => setImgError(true)}
          />
        ) : (
          <PosterFallback color={movie.accentColor} title={movie.title} />
        )}

        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />

        {/* Twist score — top-right chip */}
        <div className="absolute top-2.5 right-2.5">
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold"
            style={{
              background: `${movie.accentColor}18`,
              border: `1px solid ${movie.accentColor}30`,
              color: movie.accentColor,
              backdropFilter: 'blur(8px)',
            }}
          >
            <span style={{ fontSize: '9px' }}>⚡</span>
            {movie.twistScore}
          </div>
        </div>

        {/* Genre tags — bottom of poster */}
        <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1">
          {movie.genres.slice(0, 2).map(g => (
            <span key={g}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(0,0,0,0.65)', color: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Title + meta */}
        <div>
          <h3 className="text-[14px] font-semibold text-white tracking-tight leading-snug">
            {movie.title}
          </h3>
          <p className="text-[11px] font-mono text-slate-600 mt-0.5">
            {movie.year} · {movie.director} · {movie.runtime}m
          </p>
        </div>

        {/* Twist type badge */}
        <span className={`badge ${movie.badgeClass} self-start`}>{movie.twistType}</span>

        {/* Synopsis */}
        <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-3 flex-1">
          {movie.synopsis}
        </p>

        {/* Stats + CTA row */}
        <div
          className="flex items-center gap-4 pt-3 mt-auto"
          style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[13px] font-semibold tabular-nums" style={{ color: movie.accentColor }}>
                {movie.nodes}
              </p>
              <p className="text-[10px] font-mono text-slate-700">nodes</p>
            </div>
            <div className="w-px h-6" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div>
              <p className="text-[13px] font-semibold tabular-nums" style={{ color: movie.accentColor }}>
                {movie.events}
              </p>
              <p className="text-[10px] font-mono text-slate-700">events</p>
            </div>
          </div>

          <button
            className="ml-auto text-[11px] font-medium transition-all duration-150 px-3 py-1.5 rounded-lg"
            style={{
              color: movie.accentColor,
              background: `${movie.accentColor}0d`,
              border: `1px solid ${movie.accentColor}25`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${movie.accentColor}1a`
              e.currentTarget.style.borderColor = `${movie.accentColor}50`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = `${movie.accentColor}0d`
              e.currentTarget.style.borderColor = `${movie.accentColor}25`
            }}
          >
            Explore →
          </button>
        </div>
      </div>
    </article>
  )
}

// ── Add-card placeholder — 21st.dev dashed empty state ──────────────────
const AddCard = () => (
  <div
    className="rounded-xl flex flex-col items-center justify-center gap-3 p-8 cursor-pointer group transition-all duration-200 hover-lift"
    style={{
      border: '1px dashed rgba(255,255,255,0.08)',
      background: 'rgba(255,255,255,0.01)',
      minHeight: '220px',
    }}
  >
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
      style={{ background: 'rgba(0,242,254,0.05)', border: '1px dashed rgba(0,242,254,0.2)' }}
    >
      <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 1v13M1 7.5h13" stroke="#00f2fe" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
    <div className="text-center">
      <p className="text-[12px] font-medium text-slate-600 group-hover:text-slate-400 transition-colors">
        Index new film
      </p>
      <p className="text-[11px] font-mono text-slate-700 mt-0.5">
        Add to HELIX library
      </p>
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────────────────────
const TWIST_FILTERS = ['All', ...new Set(MOVIES.map(m => m.twistType))]

const MovieLibraryView = () => {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? MOVIES
    : MOVIES.filter(m => m.twistType === activeFilter)

  return (
    <div className="max-w-6xl mx-auto px-8 py-8 animate-slide-up">

      {/* ── Header ────────────────────────────────────────────── */}
      <header className="mb-8">
        <Breadcrumb crumbs={['HELIX', 'Movie Library']} />

        <div className="mt-5 flex items-end justify-between gap-6">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-white leading-tight">
              Film <span className="text-grad-violet">Library</span>
            </h1>
            <p className="mt-2 text-[13px] text-slate-400 max-w-lg leading-relaxed">
              Each film is a universe of interlocking narratives. Select a title to
              explore its full twist graph and character event network.
            </p>
          </div>
          <button id="btn-index-film" className="btn-primary flex-shrink-0">
            + Index Film
          </button>
        </div>

        {/* Filter bar */}
        <div className="mt-5 flex items-center gap-2 flex-wrap">
          <div
            className="flex items-center gap-px p-0.5 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {TWIST_FILTERS.map(f => (
              <button
                key={f}
                id={`filter-${f.toLowerCase().replace(/\s+/g,'-')}`}
                onClick={() => setActiveFilter(f)}
                className="text-[11px] font-medium px-3 py-1.5 rounded-md transition-all duration-150"
                style={activeFilter === f ? {
                  background: 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                } : {
                  color: '#64748b',
                }}
                onMouseEnter={e => { if (activeFilter !== f) e.currentTarget.style.color = '#94a3b8' }}
                onMouseLeave={e => { if (activeFilter !== f) e.currentTarget.style.color = '#64748b' }}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="text-[11px] font-mono text-slate-700 ml-1">
            {filtered.length} film{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </header>

      {/* ── Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
        {filtered.map(movie => <MovieCard key={movie.id} movie={movie} />)}
        <AddCard />
      </div>

    </div>
  )
}

export default MovieLibraryView
