import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { MOVIES } from '../data/movies'

const SectionReveal = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94], delay }}
  >
    {children}
  </motion.div>
)

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 mb-4">
    <motion.div
      className="h-[14px] w-[2px] rounded-full bg-white/25"
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ transformOrigin: 'top' }}
    />
    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
      {children}
    </h3>
  </div>
)

export default function FilmDetail() {
  const { id } = useParams()
  const [film, setFilm] = useState(null)
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({ container: containerRef })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 30, restDelta: 0.001 })

  const ambientY    = useTransform(smoothProgress, [0, 1], ['0%', '-22%'])
  const ambientOpacity = useTransform(smoothProgress, [0, 0.18, 0.65, 1], [0.18, 0.32, 0.22, 0.10])
  const posterScale = useTransform(smoothProgress, [0, 0.5], [1, 1.06])
  const posterY     = useTransform(smoothProgress, [0, 1], ['0%', '8%'])

  useEffect(() => {
    if (window.gsap) window.gsap.killTweensOf('*')
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.body.style.overflow = 'auto'
    document.body.style.position = 'static'
    document.body.style.height = 'auto'
    document.documentElement.style.overflow = 'auto'
    document.documentElement.style.height = 'auto'
  }, [])

  useEffect(() => {
    const targetFilm = MOVIES.find(m => m.id === id)
    if (targetFilm) {
      setFilm({
        id: targetFilm.id,
        title: targetFilm.title,
        director: targetFilm.director,
        releaseYear: targetFilm.year,
        poster: targetFilm.posterUrl || targetFilm.poster,
        tagline: targetFilm.tagline || 'Deception fractures structural reality parameters apart.',
        runtime: targetFilm.runtime || '125 min',
        summary: targetFilm.synopsis || targetFilm.summary || 'This cinematic index record has been successfully mapped via the local frontend infrastructure.',
        genres: targetFilm.genres || ['Thriller', 'Mystery'],
        themes: targetFilm.themes || ['Perception Shift', 'Obsession'],
        cast: targetFilm.cast || [{ actor: targetFilm.director, role: 'Director Archival Core' }],
        boxOffice: targetFilm.boxOffice || 'Classified Transaction Records',
        reception: targetFilm.reception || `${targetFilm.complexity || 'High'} Tier Evaluation Matrix`,
        soundtrack: targetFilm.soundtrack || 'Thematic Orchestration Ambient Waves',
        tracklist: targetFilm.tracklist || ['Main Title Narrative Theme'],
        whereToWatch: targetFilm.whereToWatch || 'Secure Archive Stream Hub',
      })
    }
  }, [id])

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
    <div
      ref={containerRef}
      className="w-full min-h-screen overflow-y-auto block relative p-8 pb-24 md:p-16 md:pb-32 lg:p-24 lg:pb-40 scroll-smooth"
      style={{ zIndex: 10 }}
    >
      <motion.nav
        className="pb-8"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.8)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
            e.currentTarget.style.color = '#fff'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
          }}
        >
          <span>←</span> Return to The Labyrinth
        </Link>
      </motion.nav>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-16 pt-4 md:pt-0">

        {/* Sticky poster column */}
        <motion.div
          className="w-full md:w-72 lg:w-80 flex-shrink-0 mx-auto md:mx-0 md:sticky md:top-8 self-start"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div
            className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              scale: posterScale,
              y: posterY,
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-800">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="2.5" />
                <path d="M7 2v20M17 2v20M2 7h5M2 17h5M17 7h5M17 17h5M7 12h10" />
              </svg>
            </div>
            <img
              src={film?.poster || film?.posterUrl}
              alt={film?.title || 'Film Poster'}
              className="absolute inset-0 w-full h-full object-cover z-10"
              onError={e => {
                const currentId = window.location.pathname.split('/').pop()
                const backupData = MOVIES.find(m => m.id === currentId)
                if (backupData) e.target.src = backupData.poster
              }}
            />
            {/* Poster edge vignette */}
            <div className="absolute inset-0 z-20 pointer-events-none"
              style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)' }} />
          </motion.div>

          {/* Floating accent line below poster */}
          <motion.div
            className="mt-4 h-[1px] w-full"
            style={{ background: 'linear-gradient(90deg, rgba(0,242,254,0.4), rgba(139,92,246,0.2), transparent)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
          />
        </motion.div>

        {/* Content column */}
        <div className="relative flex-1 text-slate-200 flex flex-col justify-center">

          {/* Parallax ambient background */}
          <motion.img
            src={film.posterUrl || film.poster}
            alt="ambient background"
            className="absolute inset-0 -z-10 blur-[100px] scale-110 pointer-events-none object-cover w-full h-full"
            style={{ y: ambientY, opacity: ambientOpacity }}
          />

          {/* Title block */}
          <motion.div
            className="flex flex-col md:flex-row md:items-center gap-6 mb-2"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
          >
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
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-lg md:text-xl italic text-slate-400 mb-6 font-serif"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            "{film.tagline}"
          </motion.p>

          {/* Meta row */}
          <motion.div
            className="flex items-center gap-4 text-base font-mono text-slate-300 mb-8 border-b border-white/10 pb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="text-white font-medium">{film.director}</span>
            <span className="text-white/30">•</span>
            <span>{film.releaseYear}</span>
            <span className="text-white/30">•</span>
            <span>{film.runtime}</span>
          </motion.div>

          {/* Genre tags */}
          <motion.div
            className="flex flex-wrap gap-2 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {film.genres.map((g, i) => (
              <motion.span
                key={g}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.5 + i * 0.06 }}
                className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase text-slate-300"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {g}
              </motion.span>
            ))}
          </motion.div>

          {/* Synopsis */}
          <SectionReveal className="mb-8">
            <SectionLabel>Spoiler-Free Synopsis</SectionLabel>
            <p className="text-lg leading-relaxed text-slate-300">{film.summary}</p>
          </SectionReveal>

          {/* Themes */}
          <SectionReveal className="mb-10" delay={0.06}>
            <SectionLabel>Narrative Themes</SectionLabel>
            <div className="flex flex-wrap gap-3">
              {film.themes.map((theme, i) => (
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="px-3 py-1 rounded-lg text-sm font-medium text-[#00f2fe]"
                  style={{
                    background: 'rgba(0,242,254,0.05)',
                    border: '1px solid rgba(0,242,254,0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {theme}
                </motion.span>
              ))}
            </div>
          </SectionReveal>

          {/* Characters + Box Office + Soundtrack */}
          <SectionReveal className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10" delay={0.08}>
            <div>
              <SectionLabel>Main Characters</SectionLabel>
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
                <SectionLabel>Box Office &amp; Reception</SectionLabel>
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
                <SectionLabel>Notable Soundtrack</SectionLabel>
                <p className="text-sm text-slate-300 italic mb-2">{film.soundtrack}</p>
                <ul className="flex flex-col gap-1">
                  {film.tracklist.map(track => (
                    <li key={track}>
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(film.title + ' soundtrack ' + track)}`}
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
          </SectionReveal>

          {/* Where to Watch */}
          <SectionReveal delay={0.1}>
            <SectionLabel>Where to Watch</SectionLabel>
            <div
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold tracking-wide"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              {film.whereToWatch}
            </div>
          </SectionReveal>

        </div>
      </div>
    </div>
  )
}
