import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FILM_DETAILS } from '../data/filmDetails'

export default function FilmDetail() {
  const { filmId } = useParams()
  const film = FILM_DETAILS.find(f => f.id === filmId)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.body.style.overflow = "auto"
    document.documentElement.style.overscrollBehavior = "auto"
  }, [])

  if (!film) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen h-auto overflow-y-auto scroll-smooth text-white">
        <h1 className="text-3xl font-bold mb-4">Film not found</h1>
        <Link to="/" className="text-[#00f2fe] hover:text-[#8b5cf6] transition-colors">
          ← Return to The Labyrinth
        </Link>
      </div>
    )
  }

  return (
    <div className="relative w-full min-h-screen h-auto p-8 pb-24 md:p-16 md:pb-32 lg:p-24 lg:pb-40 overflow-y-auto scroll-smooth" style={{ zIndex: 10 }}>
      
      <nav className="pb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.color = '#fff'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <span>←</span> Return to The Labyrinth
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-16 pt-4 md:pt-0">
        
        <div className="w-full md:w-72 lg:w-80 flex-shrink-0 mx-auto md:mx-0">
          <div
            className="w-full rounded-2xl overflow-hidden"
            style={{
              boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <img
              src={film.poster}
              alt={film.title}
              className="w-full h-auto object-cover block"
            />
          </div>
        </div>

        <div className="relative flex-1 text-slate-200 flex flex-col justify-center">
          
          <img
            src={film.poster}
            alt="ambient background"
            className="absolute inset-0 -z-10 blur-[100px] opacity-20 scale-110 pointer-events-none object-cover"
          />
          
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              {film.title}
            </h1>
            <Link
              to={`/?node=${film.id}-film`}
              className="inline-block px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all text-sm w-max"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              View on Twist Graph →
            </Link>
          </div>

          <p className="text-lg md:text-xl italic text-slate-400 mb-6 font-serif">
            "{film.tagline}"
          </p>
          
          <div className="flex items-center gap-4 text-base font-mono text-slate-300 mb-8 border-b border-white/10 pb-6">
            <span className="text-white font-medium">{film.director}</span>
            <span className="text-white/30">•</span>
            <span>{film.releaseYear}</span>
            <span className="text-white/30">•</span>
            <span>{film.runtime}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {film.genres.map(g => (
              <span
                key={g}
                className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase text-slate-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                {g}
              </span>
            ))}
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-l-2 border-white/20 pl-3">
              Spoiler-Free Synopsis
            </h3>
            <p className="text-lg leading-relaxed text-slate-300">
              {film.summary}
            </p>
          </div>

          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-l-2 border-white/20 pl-3">
              Narrative Themes
            </h3>
            <div className="flex flex-wrap gap-3">
              {film.themes.map(theme => (
                <span
                  key={theme}
                  className="px-3 py-1 rounded-lg text-sm font-medium text-[#00f2fe]"
                  style={{
                    background: 'rgba(0, 242, 254, 0.05)',
                    border: '1px solid rgba(0, 242, 254, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-l-2 border-white/20 pl-3">
                Main Characters
              </h3>
              <ul className="flex flex-col gap-2">
                {film.cast.map(c => (
                  <li key={c.actor} className="group flex items-baseline cursor-default">
                    <span className="text-slate-300 font-medium">{c.actor}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-400 text-sm ml-2">
                      as {c.role}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-l-2 border-white/20 pl-3">
                  Box Office & Reception
                </h3>
                <div className="flex flex-col gap-2">
                  <p className="text-sm">
                    <span className="text-slate-400 font-mono mr-2">Box Office:</span>
                    <span className="text-white font-medium">{film.boxOffice}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-slate-400 font-mono mr-2">Reception:</span>
                    <span className="text-white font-medium">{film.reception}</span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-l-2 border-white/20 pl-3">
                  Notable Soundtrack
                </h3>
                <p className="text-sm text-slate-300 italic mb-2">
                  {film.soundtrack}
                </p>
                <ul className="flex flex-col gap-1">
                  {film.tracklist.map(track => (
                    <li key={track}>
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(film.title + " soundtrack " + track)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-blue-400 hover:underline transition-colors cursor-pointer"
                      >
                        ♪ {track}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-l-2 border-white/20 pl-3">
              Where to Watch
            </h3>
            <div
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold tracking-wide"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
            >
              {film.whereToWatch}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
