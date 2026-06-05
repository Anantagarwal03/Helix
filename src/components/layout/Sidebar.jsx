/**
 * Sidebar v3 — GSAP sync edition
 * activeSection: 0=overview, 1=graph, 2=library
 * onNavigate(index): programmatic GSAP scroll
 */

const NAV = [
  {
    label: 'Overview',
    icon: (
      <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 1.5L13.5 5.5V13.5H9.5V9.5H5.5V13.5H1.5V5.5L7.5 1.5Z"
          stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Graph',
    icon: (
      <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
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
    icon: (
      <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
        <rect x="1.5" y="2.5" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M6 5.5L10 7.5L6 9.5V5.5Z" fill="currentColor"/>
      </svg>
    ),
    count: 3,
  },
]

const NavItem = ({ item, index, active, onClick }) => (
  <button
    id={`nav-${item.label.toLowerCase()}`}
    onClick={() => onClick(index)}
    className="group relative flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150"
    style={{
      color: active ? '#ffffff' : '#475569',
    }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#94a3b8' }}
    onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#475569' }}
  >
    {/* Neon left indicator */}
    {active && (
      <span
        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full"
        style={{ background: 'linear-gradient(180deg, #00f2fe, #7c3aed)', boxShadow: '0 0 8px rgba(0,242,254,0.5)' }}
      />
    )}

    <span
      className="flex-shrink-0"
      style={{
        color: active ? '#00f2fe' : 'inherit',
        filter: active ? 'drop-shadow(0 0 5px rgba(0,242,254,0.8))' : 'none',
        transition: 'filter 200ms, color 200ms',
      }}
    >
      {item.icon}
    </span>

    <span className="text-[12px] font-medium tracking-[-0.01em] flex-1">
      {item.label}
    </span>

    {item.count !== undefined && (
      <span className="text-[10px] font-mono tabular-nums"
        style={{ color: active ? 'rgba(0,242,254,0.5)' : '#1e293b' }}>
        {item.count}
      </span>
    )}
  </button>
)

const Sidebar = ({ activeSection, onNavigate }) => (
  <aside
    className="flex flex-col h-full relative"
    style={{
      width: '200px',
      background: 'rgba(3,0,20,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
    }}
  >
    {/* Top ambient */}
    <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,242,254,0.04) 0%, transparent 100%)' }} />

    {/* ── Logo ─────────────────────────────────────────── */}
    <div className="flex-shrink-0 px-4 pt-5 pb-4"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="flex items-center gap-2.5">
        <div className="relative w-6 h-6 flex items-center justify-center flex-shrink-0">
          <div className="absolute inset-0 rounded-full border border-white/10"
            style={{ animation: 'spin 24s linear infinite' }} />
          <div className="absolute inset-0.5 rounded-full border border-white/[0.05]"
            style={{ animation: 'spin 16s linear infinite reverse' }} />
          <div className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'linear-gradient(135deg,#00f2fe,#7c3aed)', boxShadow:'0 0 8px rgba(0,242,254,0.8)' }} />
        </div>
        <div>
          <div className="text-[12px] font-semibold tracking-[-0.02em] text-white">HELIX</div>
          <div className="text-[9px] font-mono text-slate-800 mt-0.5 tracking-[0.07em]">TWIST ENGINE</div>
        </div>
      </div>
    </div>

    {/* ── Nav ──────────────────────────────────────────── */}
    <div className="flex-1 overflow-y-auto px-2 py-3">
      <p className="px-3 mb-2 text-[9px] font-medium text-slate-800 uppercase tracking-[0.12em]">
        Sections
      </p>
      <nav className="flex flex-col gap-0.5">
        {NAV.map((item, i) => (
          <NavItem
            key={item.label}
            item={item}
            index={i}
            active={activeSection === i}
            onClick={onNavigate}
          />
        ))}
      </nav>

      <div className="mx-3 my-4" style={{ height:'1px', background:'rgba(255,255,255,0.04)' }} />

      {/* Scroll indicator */}
      <div className="px-3">
        <p className="text-[9px] font-mono text-slate-800 uppercase tracking-[0.1em] mb-2">Progress</p>
        <div className="flex flex-col gap-1.5">
          {NAV.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-1 h-1 rounded-full flex-shrink-0 transition-all duration-300"
                style={{
                  background: activeSection === i ? '#00f2fe' : '#1e293b',
                  boxShadow: activeSection === i ? '0 0 6px rgba(0,242,254,0.8)' : 'none',
                  transform: activeSection === i ? 'scale(1.5)' : 'scale(1)',
                }}
              />
              <span className="text-[10px] font-mono transition-colors duration-200"
                style={{ color: activeSection === i ? '#475569' : '#1e293b' }}>
                {String(i + 1).padStart(2,'0')} {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* ── Status footer ────────────────────────────────── */}
    <div className="flex-shrink-0 px-3 pb-4 pt-2"
      style={{ borderTop:'1px solid rgba(255,255,255,0.04)' }}>
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
        style={{ background:'rgba(255,255,255,0.015)', border:'1px solid rgba(255,255,255,0.04)' }}>
        <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
          <span className="animate-ping absolute inset-0 rounded-full opacity-60"
            style={{ background:'#00f2fe' }} />
          <span className="relative flex h-1.5 w-1.5 rounded-full"
            style={{ background:'#00f2fe' }} />
        </span>
        <div>
          <p className="text-[10px] font-medium text-slate-600 leading-none">Live</p>
          <p className="text-[9px] font-mono text-slate-800 mt-0.5">GSAP · OGL · v1.0</p>
        </div>
      </div>
    </div>
  </aside>
)

export default Sidebar
