import { useState } from 'react'
import { Link } from 'react-router-dom'
import SpotlightCard from '../components/animations/SpotlightCard'
import { MOVIES } from '../data/movies'

const PosterCard = ({ movie }) => {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  return (
    <Link to={`/film/${movie.slug}`} className="block h-full">
      <SpotlightCard
        spotlightColor={`${movie.accentColor}40`}
        spotlightSize={340}
        className="rounded-xl overflow-hidden group cursor-pointer h-full"
        style={{
          background: 'rgba(3,0,20,0.80)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.06)',
          transition: 'transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = `0 24px 60px rgba(0,0,0,0.65), 0 0 32px ${movie.accentColor}18`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div className="relative overflow-hidden" style={{ aspectRatio: '2/3' }}>
          <div className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse at 50% 25%, ${movie.accentColor}14 0%, rgba(3,0,20,1) 75%)` }} />

          <img
            src={movie.poster}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-400 group-hover:scale-[1.03]"
            style={{
              opacity: imgLoaded && !imgErr ? 0.9 : 0,
              transition: 'opacity 0.3s ease, transform 0.4s ease',
            }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgErr(true)}
          />

          {imgLoaded && !imgErr && (
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
              style={{ background: `rgba(0,0,0,0)` }}
            />
          )}

          {imgErr && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: `${movie.accentColor}12`, border: `1px solid ${movie.accentColor}25` }}>
                <svg width="22" height="22" viewBox="0 0 15 15" fill="none">
                  <rect x="1.5" y="2.5" width="12" height="10" rx="1.5" stroke={movie.accentColor} strokeWidth="1.2" />
                  <path d="M6 5.5L10 7.5L6 9.5V5.5Z" fill={movie.accentColor} />
                </svg>
              </div>
              <span className="text-[11px] font-mono text-center px-4"
                style={{ color: `${movie.accentColor}50` }}>{movie.title}</span>
            </div>
          )}

          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10.5px] font-mono font-semibold"
            style={{ background: `rgba(0,0,0,0.72)`, color: movie.accentColor, border: `1px solid ${movie.accentColor}30`, backdropFilter: 'blur(8px)' }}>
            ⚡ {movie.twistScore}
          </div>

          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1 z-10">
            {movie.genres.slice(0, 2).map(g => (
              <span key={g} className="text-[9px] font-medium px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(0,0,0,0.80)', color: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {g}
              </span>
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.82) 18%, rgba(0,0,0,0.4) 38%, transparent 65%)' }} />
        </div>

        <div className="p-4 flex flex-col gap-2.5">
          <div>
            <h3 className="text-[14px] font-semibold text-white tracking-tight leading-snug">{movie.title}</h3>
            <p className="text-[10.5px] font-mono text-slate-700 mt-0.5">{movie.year} · {movie.director}</p>
          </div>

          <span className="self-start text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{ color: movie.accentColor, background: `${movie.accentColor}0d`, border: `1px solid ${movie.accentColor}20` }}>
            {movie.twistType}
          </span>

          <div className="flex items-center justify-between pt-2"
            style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
            <div className="flex gap-4">
              {[['nodes', movie.nodes], ['events', movie.events]].map(([label, val]) => (
                <div key={label}>
                  <p className="text-[13px] font-bold tabular-nums" style={{ color: movie.accentColor }}>{val}</p>
                  <p className="text-[9px] font-mono text-slate-700 uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
            <button
              className="text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all duration-150"
              style={{ color: movie.accentColor, background: `${movie.accentColor}0d`, border: `1px solid ${movie.accentColor}20` }}
              onMouseEnter={e => { e.currentTarget.style.background = `${movie.accentColor}1a`; e.currentTarget.style.borderColor = `${movie.accentColor}45` }}
              onMouseLeave={e => { e.currentTarget.style.background = `${movie.accentColor}0d`; e.currentTarget.style.borderColor = `${movie.accentColor}20` }}
            >
              Explore →
            </button>
          </div>
        </div>
      </SpotlightCard>
    </Link>
  )
}

const AddCard = () => (
  <div
    className="flex flex-col items-center justify-center gap-3 rounded-xl cursor-pointer group transition-all duration-200"
    style={{ border: '1px dashed rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.008)', minHeight: 300 }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,242,254,0.18)'; e.currentTarget.style.background = 'rgba(0,242,254,0.02)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.008)' }}
  >
    <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
      style={{ background: 'rgba(0,242,254,0.05)', border: '1px dashed rgba(0,242,254,0.15)' }}>
      <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 1v13M1 7.5h13" stroke="#00f2fe" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
    <div className="text-center">
      <p className="text-[11.5px] font-medium text-slate-700 group-hover:text-slate-500 transition-colors">Index new film</p>
      <p className="text-[10px] font-mono text-slate-800 mt-0.5">Add to The Labyrinth library</p>
    </div>
  </div>
)

const LibrarySection = () => {
  const [filter, setFilter] = useState('All')
  const types = ['All', ...new Set(MOVIES.map(m => m.twistType))]
  const films = filter === 'All' ? MOVIES : MOVIES.filter(m => m.twistType === filter)

  return (
    <div className="relative w-full h-full flex flex-col px-8 py-8 gap-5 overflow-hidden">
      <div data-reveal className="flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-px" style={{ background: 'linear-gradient(90deg,#ec4899,transparent)' }} />
            <span className="text-[10px] font-mono text-pink-400/50 uppercase tracking-[0.18em]">03 — Library</span>
          </div>
          <h2 className="text-[28px] font-bold tracking-tight text-white leading-none">
            Film{' '}
            <span style={{ background: 'linear-gradient(135deg,#ec4899,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Library
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-px p-0.5 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
          {types.map(t => (
            <button key={t}
              id={`filter-${t.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setFilter(t)}
              className="text-[10.5px] font-medium px-3 py-1.5 rounded-md transition-all duration-150"
              style={filter === t ? { background: 'rgba(255,255,255,0.07)', color: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' } : { color: '#475569' }}
              onMouseEnter={e => { if (filter !== t) e.currentTarget.style.color = '#94a3b8' }}
              onMouseLeave={e => { if (filter !== t) e.currentTarget.style.color = '#475569' }}
            >{t}</button>
          ))}
        </div>
      </div>

      <div data-reveal className="flex-1 min-h-0 grid grid-cols-4 gap-4 overflow-y-auto pb-2"
        style={{ scrollbarWidth: 'none' }}>
        {films.map(m => <PosterCard key={m.id} movie={m} />)}
        <AddCard />
      </div>
    </div>
  )
}

export default LibrarySection
