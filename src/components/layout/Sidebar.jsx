import { useState, useRef, useCallback } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { playClickSound } from '../../utils/audio'

const NAV = [
  {
    label: 'Overview',
    path: '/overview',
    accent: '#00f2fe',
    icon: (
      <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 1.5L13.5 5.5V13.5H9.5V9.5H5.5V13.5H1.5V5.5L7.5 1.5Z"
          stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Graph',
    path: '/graph',
    accent: '#8b5cf6',
    icon: (
      <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="2"   cy="2"   r="1.2" fill="currentColor"/>
        <circle cx="13"  cy="2"   r="1.2" fill="currentColor"/>
        <circle cx="2"   cy="13"  r="1.2" fill="currentColor"/>
        <circle cx="13"  cy="13"  r="1.2" fill="currentColor"/>
        <path d="M2 2l4 4M13 2l-4 4M2 13l4-4M13 13l-4-4" stroke="currentColor" strokeWidth="1.1"/>
      </svg>
    ),
  },
  {
    label: 'Library',
    path: '/library',
    accent: '#ec4899',
    icon: (
      <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
        <rect x="1.5" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M6 5.5L10 7.5L6 9.5V5.5Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Timelines',
    path: '/timeline',
    accent: '#f59e0b',
    icon: (
      <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
        <path d="M2 7.5h11m-3-3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

const useMagnet = ({ strength = 0.28 } = {}) => {
  const ref = useRef(null)
  const [transform, setTransform] = useState('translate3d(0px,0px,0px)')
  const ease = '0.3s cubic-bezier(0.25,0.46,0.45,0.94)'

  const onMouseMove = useCallback((e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength
    setTransform(`translate3d(${dx.toFixed(2)}px,${dy.toFixed(2)}px,0px)`)
  }, [strength])

  const onMouseLeave = useCallback(() => setTransform('translate3d(0px,0px,0px)'), [])

  return { ref, transform, ease, onMouseMove, onMouseLeave }
}

const MagneticNavItem = ({ item, active, isCollapsed, moviesCount }) => {
  const { ref, transform, ease, onMouseMove, onMouseLeave } = useMagnet()
  const accent = item.accent

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transform, transition: `transform ${ease}`, willChange: 'transform' }}
    >
      <Link
        to={item.path}
        id={`nav-${item.label.toLowerCase()}`}
        onClick={() => playClickSound()}
        className={`group relative flex w-full items-center rounded-lg text-left transition-all duration-150 py-2.5 ${
          isCollapsed ? 'justify-center px-0' : 'px-3 gap-2.5'
        }`}
        title={isCollapsed ? item.label : ''}
        style={{
          background: active ? `${accent}0d` : 'transparent',
          color: active ? '#fff' : 'rgba(255,255,255,0.38)',
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.72)' }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.38)' }}
      >
        {active && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full"
            style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
          />
        )}

        <span
          className="flex-shrink-0 flex items-center justify-center w-5 h-5 transition-all duration-200"
          style={{
            color: active ? accent : 'inherit',
            filter: active ? `drop-shadow(0 0 6px ${accent})` : 'none',
          }}
        >
          {item.icon}
        </span>

        {!isCollapsed && (
          <span className="text-[12px] font-medium tracking-tight flex-1 overflow-hidden whitespace-nowrap">
            {item.label}
          </span>
        )}

        {!isCollapsed && (item.count !== undefined || item.label === 'Library') && (
          <span
            className="text-[10px] font-mono tabular-nums pr-1"
            style={{ color: active ? accent : 'rgba(255,255,255,0.22)' }}
          >
            {item.label === 'Library' ? moviesCount : item.count}
          </span>
        )}
      </Link>
    </div>
  )
}

export default function Sidebar({ moviesCount }) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const activeItem = NAV.find(n => location.pathname === n.path)
  const activeAccent = activeItem?.accent || '#00f2fe'

  return (
    <>
      <style>{`
        @keyframes sidebar-top-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.9; }
        }
      `}</style>

      <aside
        className="flex flex-col h-full relative select-none transition-all duration-300 ease-in-out flex-shrink-0"
        style={{
          width: collapsed ? '64px' : '200px',
          background: 'rgba(2,0,16,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${activeAccent}18 0%, transparent 75%)`,
            animation: 'sidebar-top-glow 4s ease-in-out infinite',
            transition: 'background 0.6s ease',
          }}
        />

        <div
          className="absolute top-0 bottom-0 right-0 w-[1px] pointer-events-none"
          style={{ background: `linear-gradient(180deg, transparent, ${activeAccent}20, transparent)` }}
        />

        <div
          className="flex-shrink-0 min-h-[65px] px-3 py-4 flex items-center justify-between gap-1 w-full box-border"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          {!collapsed ? (
            <Link to="/" className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0 pl-1">
              <div className="relative w-6 h-6 flex items-center justify-center flex-shrink-0">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: `1px solid ${activeAccent}40`,
                    animation: 'spin 24s linear infinite',
                    transition: 'border-color 0.6s ease',
                  }}
                />
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: activeAccent, boxShadow: `0 0 10px ${activeAccent}` }}
                />
              </div>
              <div className="flex flex-col">
                <div className="text-[12px] font-bold tracking-[0.06em] text-white uppercase leading-tight">HELIX</div>
                <div
                  className="text-[9px] font-mono tracking-[0.1em] mt-0.5 leading-none uppercase"
                  style={{ color: `${activeAccent}70` }}
                >
                  TWIST ENGINE
                </div>
              </div>
            </Link>
          ) : null}

          <button
            onClick={() => { playClickSound(); setCollapsed(!collapsed) }}
            className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${collapsed ? 'w-full mx-auto' : 'shrink-0'}`}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.35)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
          >
            <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
              <path d="M1.5 3.5h12m-12 4h12m-12 4h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto py-3 ${collapsed ? 'px-1.5' : 'px-2'}`}>
          {!collapsed && (
            <p
              className="px-3 mb-2 text-[9px] font-mono uppercase tracking-[0.18em]"
              style={{ color: 'rgba(255,255,255,0.18)' }}
            >
              Sections
            </p>
          )}
          <nav className="flex flex-col gap-0.5">
            {NAV.map((item) => (
              <MagneticNavItem
                key={item.label}
                item={item}
                active={location.pathname === item.path}
                isCollapsed={collapsed}
                moviesCount={moviesCount}
              />
            ))}
          </nav>
        </div>

        {!collapsed && (
          <div
            className="flex-shrink-0 px-4 py-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
              <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
                System Online
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
