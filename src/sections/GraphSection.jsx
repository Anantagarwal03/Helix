/**
 * Section 2 — Graph Workspace v4
 *
 * Changes:
 *  - Center modal removed
 *  - Sliding side panel (fixed right-0, w-96, glassmorphic) replaces it
 *  - Navigation pill: Left-Click: Orbit | Right-Click: Pan | Scroll: Zoom
 *  - DecryptedText cipher-reveal inside side panel
 *  - Event table row highlighting synced to active node
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import GlitchText    from '../components/animations/GlitchText'
import DecryptedText from '../components/animations/DecryptedText'
import TwistGraph3D, { INITIAL_GRAPH_DATA } from '../components/TwistGraph3D'
import { MOVIES } from '../data/movies'

const FILM_COLOR = { ss:'#00f2fe', dd:'#8b5cf6', z:'#ec4899' }
const FILM_NAME  = { ss:'The Sixth Sense', dd:'Donnie Darko', z:'Zodiac' }

// EVENTS array is now generated dynamically inside GraphSection

// ── Floating Side Panel ──────────────────────────────────────────────────
const SideRevealPanel = ({ node, onClose }) => {
  const open  = !!node
  const color = node ? (FILM_COLOR[node.film] || '#00f2fe') : '#00f2fe'
  const filmLabel = node ? (FILM_NAME[node.film] || node.filmName || '') : ''

  return (
    <>
      {/* Dim click-away overlay (only visible when open, doesn't block graph interaction) */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background:'rgba(3,0,14,0.32)' }}
          onClick={onClose}
        />
      )}

      {/* Side panel — slides in from right */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col overflow-hidden"
        style={{
          width: '384px',   // w-96
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
            {/* ── Top accent stripe ─────────────────────── */}
            <div className="h-0.5 w-full flex-shrink-0"
              style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

            {/* ── Header ───────────────────────────────── */}
            <div className="flex items-start justify-between px-6 pt-5 pb-4 flex-shrink-0"
              style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-mono uppercase tracking-[0.16em]"
                    style={{ color:`${color}70` }}>{filmLabel}</span>
                  <span className="text-slate-800">·</span>
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider"
                    style={{ color, background:`${color}10`, border:`1px solid ${color}22` }}>
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
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', color:'#475569' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.09)'; e.currentTarget.style.color='#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#475569' }}
              >
                <svg width="9" height="9" viewBox="0 0 15 15" fill="none">
                  <path d="M1 1l13 13M14 1L1 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* ── Body ─────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6"
              style={{ scrollbarWidth:'none' }}>

              {/* Twist reveal — DecryptedText cipher animation */}
              <div className="flex flex-col gap-3">
                <p className="text-[9.5px] font-mono text-slate-700 uppercase tracking-[0.14em]">
                  Narrative Reveal
                </p>
                <div style={{ borderLeft:`2px solid ${color}35`, paddingLeft:'16px' }}>
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

              {/* Subtext */}
              {node.revealSubtext && (
                <div className="flex flex-col gap-2" style={{ animation:'fadeIn 0.5s ease 0.9s both', opacity:0 }}>
                  <p className="text-[9.5px] font-mono text-slate-700 uppercase tracking-[0.14em]">
                    Context
                  </p>
                  <p className="text-[12.5px] text-slate-400 leading-relaxed">
                    {node.revealSubtext}
                  </p>
                </div>
              )}

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-3 pt-2"
                style={{ borderTop:'1px solid rgba(255,255,255,0.05)', animation:'fadeIn 0.5s ease 1.1s both', opacity:0 }}>
                {[
                  { label:'Node ID',  value:`#${node.id}` },
                  { label:'Type',     value:node.type },
                  { label:'Film',     value:filmLabel },
                  { label:'Class',    value:node.revealClassification || '—' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[9.5px] font-mono text-slate-700 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-[11.5px] font-mono" style={{ color:`${color}80` }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Cross-film connection note */}
              {node.type === 'twist' && (
                <div className="rounded-xl p-4 flex flex-col gap-1.5"
                  style={{ background:`${color}06`, border:`1px solid ${color}15`, animation:'fadeIn 0.5s ease 1.3s both', opacity:0 }}>
                  <p className="text-[9.5px] font-mono uppercase tracking-[0.12em]" style={{ color:`${color}60` }}>
                    Cross-Film Bridge
                  </p>
                  <p className="text-[11.5px] text-slate-500 leading-relaxed">
                    This Twist node is connected to the other two Core Twists via thematic bridge edges — exploring how each film's central deception relates to the others.
                  </p>
                </div>
              )}
            </div>

            {/* ── Footer ───────────────────────────────── */}
            <div className="flex-shrink-0 px-6 py-4"
              style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[10px] font-mono text-slate-800 text-center">
                Click anywhere outside to dismiss
              </p>
            </div>
          </>
        )}
      </div>
    </>
  )
}

// ── Glass panel ──────────────────────────────────────────────────────────
const GlassPanel = ({ children, style = {}, className = '' }) => (
  <div className={className} style={{
    background:'rgba(0,0,0,0.40)', backdropFilter:'blur(16px)',
    WebkitBackdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.05)',
    borderRadius:'14px', ...style,
  }}>
    {children}
  </div>
)

const LegendDot = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <div className="w-2 h-2 rounded-full flex-shrink-0"
      style={{ background:color, boxShadow:`0 0 6px ${color}` }} />
    <span className="text-[10.5px] font-mono text-slate-600">{label}</span>
  </div>
)

// ── GraphSection ─────────────────────────────────────────────────────────
const GraphSection = ({ initialNode }) => {
  const [mounted,      setMounted]      = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)
  const [graphData,    setGraphData]    = useState(INITIAL_GRAPH_DATA)
  const [movies,       setMovies]       = useState(MOVIES)
  const EVENTS = movies.map(m => ({
    film: m.id,
    filmName: m.title,
    char: m.director,
    event: m.complexity || m.twistType || 'Mind-Bend Twist',
    color: m.accentColor || '#8b5cf6',
    nodeIds: [m.id + '-twist']
  }))

  const handleGraphMount = useCallback(() => setMounted(true), [])
  const handleNodeClick  = useCallback(node => setSelectedNode(node), [])
  const closePanel       = useCallback(() => setSelectedNode(null), [])
  const graphRef         = useRef(null)

  const handleTableNodeTarget = (filmSlugId) => {
    const graphInstance = graphRef.current;
    if (!graphInstance) return;

    // Query internal graph nodes to isolate the main target film hub
    const targetHub = graphData.nodes.find(node => node.id === filmSlugId && node.type === 'film');
    if (!targetHub) return;

    // Smoothly position the 3D space camera right in front of the selected sphere coordinate
    const viewDistance = 130;
    const vectorAngle = Math.atan2(targetHub.z || 0, targetHub.x || 0);

    graphInstance.cameraPosition(
      {
        x: (targetHub.x || 0) + viewDistance * Math.cos(vectorAngle),
        y: (targetHub.y || 0) + 35,
        z: (targetHub.z || 0) + viewDistance * Math.sin(vectorAngle)
      },
      { x: targetHub.x || 0, y: targetHub.y || 0, z: targetHub.z || 0 },
      1000 // Animate over exactly 1 second
    );
  };

  const highlightedRow = selectedNode
    ? EVENTS.findIndex(e => e.nodeIds.includes(selectedNode.id))
    : -1

  return (
    <div className="relative w-full h-full flex flex-col px-8 py-8 gap-4 overflow-hidden">

      {/* Header */}
      <div data-reveal className="flex items-center justify-between flex-shrink-0">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-px" style={{ background:'linear-gradient(90deg,#7c3aed,transparent)' }} />
            <span className="text-[10px] font-mono text-violet-400/50 uppercase tracking-[0.18em]">02 — The Labyrinth</span>
          </div>
          <h2 className="text-[26px] font-bold text-white tracking-tight leading-none mt-1">
            <GlitchText speed={0.5} enableShadows={true} enableOnHover={true}>Twist Graph</GlitchText>
            {' '}
            <span style={{ background:'linear-gradient(135deg,#7c3aed,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              3D Engine
            </span>
          </h2>
        </div>


      </div>

      {/* 3D Canvas */}
      <div data-reveal className="flex-1 min-h-0 relative rounded-xl overflow-hidden"
        style={{ background:'rgba(0,0,0,0.28)', border:'1px solid rgba(255,255,255,0.05)' }}>

        {/* Legend HUD */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5"
          style={{ background:'rgba(3,0,20,0.65)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'10px', padding:'8px 12px' }}>
          <LegendDot color="#fbbf24" label="Film Hub"  />
          <LegendDot color="#00f2fe" label="Character" />
          <LegendDot color="#8b5cf6" label="Event"     />
          <LegendDot color="#ec4899" label="Twist"     />
        </div>

        {/* Stats HUD */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-3 px-3 py-1.5 rounded-lg"
          style={{ background:'rgba(3,0,20,0.65)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.05)' }}>
          {[['22','nodes'],['31','links'],[`${movies.length}`,'films']].map(([v,l]) => (
            <div key={l} className="text-center">
              <p className="text-[12px] font-bold text-white/80 tabular-nums leading-none">{v}</p>
              <p className="text-[9px] font-mono text-slate-700 uppercase tracking-wide mt-0.5">{l}</p>
            </div>
          ))}
        </div>

        {/* ── Navigation pill — bottom center ────────────── */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-2 rounded-full"
          style={{ background:'rgba(3,0,20,0.70)', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)', border:'1px solid rgba(255,255,255,0.07)', whiteSpace:'nowrap' }}>
          {[
            ['Left-Click','Orbit'],
            ['Right-Click','Pan'],
            ['Scroll','Zoom'],
          ].map(([key, action], i) => (
            <div key={key} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-slate-800 text-xs">·</span>}
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.07)' }}>
                {key}
              </span>
              <span className="text-[10px] font-mono text-slate-600">{action}</span>
            </div>
          ))}
        </div>

        {/* Live 3D graph */}
        <TwistGraph3D ref={graphRef} graphData={graphData} movies={movies} onMount={handleGraphMount} onNodeClick={handleNodeClick} initialNode={initialNode} />
      </div>

      {/* Event Index table */}
      <div data-reveal className="flex-shrink-0">
        <GlassPanel style={{ padding:0, overflow:'hidden' }}>
          <div className="px-4 py-2.5 flex items-center justify-between"
            style={{ borderBottom:'0.5px solid rgba(255,255,255,0.04)' }}>
            <div className="flex items-center gap-2">
              <h3 className="text-[11.5px] font-semibold text-white/70 tracking-tight">Twist Events</h3>
              <span className="text-[10px] font-mono text-slate-400">· {movies.length} films · 22 nodes · 31 links</span>
            </div>
            <button className="text-[10.5px] font-mono text-slate-300 hover:text-white transition-colors">Full table →</button>
          </div>
          {EVENTS.map((row, i) => {
            const hi = highlightedRow === i
            return (
              <div key={i}
                className="flex items-center gap-4 px-4 py-2 cursor-pointer hover:bg-white/5 transition-all animate-none"
                onClick={() => handleTableNodeTarget(row.filmName.toLowerCase().replace(/\s+/g, '-'))}
                style={{
                  borderBottom: i < EVENTS.length-1 ? '0.5px solid rgba(255,255,255,0.04)' : 'none',
                  background: hi ? `${row.color}08` : 'transparent',
                  borderLeft: `2px solid ${hi ? row.color+'55' : 'transparent'}`,
                }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-200"
                  style={{ background:row.color, boxShadow:hi?`0 0 8px ${row.color}`:'none', transform:hi?'scale(1.5)':'scale(1)' }} />
                <span className="text-[12px] font-medium w-32 flex-shrink-0 truncate transition-colors duration-200"
                  style={{ color:hi?'#fff':'#cbd5e1' }}>{row.filmName}</span>
                <span className="text-[11px] font-mono flex-shrink-0 transition-colors duration-200"
                  style={{ color:hi?`${row.color}cc`:`${row.color}99`, width:120 }}>{row.char}</span>
                <span className="text-[11px] flex-1 truncate transition-colors duration-200"
                  style={{ color:hi?'#f8fafc':'#94a3b8' }}>{row.event}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full flex-shrink-0 transition-all duration-200"
                  style={{ color:row.color, background:hi?`${row.color}18`:`${row.color}08`, border:`1px solid ${hi?row.color+'40':row.color+'16'}` }}>
                  {hi ? '▶ active' : 'indexed'}
                </span>
              </div>
            )
          })}
        </GlassPanel>
      </div>

      {/* ── Floating side panel — fixed, slides from right ─── */}
      <SideRevealPanel node={selectedNode} onClose={closePanel} />
    </div>
  )
}

export default GraphSection
