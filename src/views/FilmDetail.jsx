import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MOVIES } from '../data/movies'

export default function FilmDetail() {
  const { id } = useParams()
  const [film, setFilm] = useState(null)

  useEffect(() => {
    if (window.gsap) {
      window.gsap.killTweensOf("*")
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    document.body.style.overflow = "auto"
    document.body.style.position = "static"
    document.body.style.height = "auto"
    document.documentElement.style.overflow = "auto"
    document.documentElement.style.height = "auto"
  }, [])

  useEffect(() => {
    const targetFilm = MOVIES.find(m => m.id === id);
    if (targetFilm) {
      setFilm({
        id: targetFilm.id,
        title: targetFilm.title,
        director: targetFilm.director,
        releaseYear: targetFilm.year,
        poster: targetFilm.posterUrl || targetFilm.poster,
        tagline: targetFilm.tagline || "Deception fractures structural reality parameters apart.",
        runtime: targetFilm.runtime || "125 min",
        summary: targetFilm.synopsis || targetFilm.summary || "This cinematic index record has been successfully mapped via the local frontend infrastructure.",
        genres: targetFilm.genres || ["Thriller", "Mystery"],
        themes: targetFilm.themes || ["Perception Shift", "Obsession"],
        cast: targetFilm.cast || [{ actor: targetFilm.director, role: "Director Archival Core" }],
        boxOffice: targetFilm.boxOffice || "Classified Transaction Records",
        reception: targetFilm.reception || `${targetFilm.complexity || 'High'} Tier Evaluation Matrix`,
        soundtrack: targetFilm.soundtrack || "Thematic Orchestration Ambient Waves",
        tracklist: targetFilm.tracklist || ["Main Title Narrative Theme"],
        whereToWatch: targetFilm.whereToWatch || "Secure Archive Stream Hub"
      });
    }
  }, [id]);

  if (!film) {
    return (
      <div className="w-full min-h-screen overflow-y-auto block relative p-8 text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Film not found</h1>
        <Link to="/" className="text-[#00f2fe] hover:text-[#8b5cf6] transition-colors">
          ← Return to The Labyrinth
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen overflow-y-auto block relative p-8 pb-24 md:p-16 md:pb-32 lg:p-24 lg:pb-40 scroll-smooth" style={{ zIndex: 10 }}>
      
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
          <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            {/* Fallback structural layer */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-800">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="2.5" />
                <path d="M7 2v20M17 2v20M2 7h5M2 17h5M17 7h5M17 17h5M7 12h10" />
              </svg>
            </div>

            {/* Real Dynamic Poster Asset */}
            <img 
              src={film?.poster || film?.posterUrl || movie?.poster || movie?.posterUrl} 
              alt={film?.title || "Film Poster"} 
              className="absolute inset-0 w-full h-full object-cover z-10"
              onError={(e) => {
                // Direct variable reference fallback fallback loop if state array changes shape
                const currentId = window.location.pathname.split('/').pop();
                const backupData = MOVIES.find(m => m.id === currentId);
                if (backupData) e.target.src = backupData.poster;
              }}
            />
          </div>
        </div>

        <div className="relative flex-1 text-slate-200 flex flex-col justify-center">
          
          <img
            src={film.posterUrl || film.poster}
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
