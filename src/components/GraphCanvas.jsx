/**
 * GraphCanvas — Immersive viewport panel
 * Features:
 *  - Particles WebGL background (React Bits)
 *  - Glassmorphic floating HUD overlays
 *  - SVG force graph rendered above particles
 *  - Full-height viewport feel
 */
import Particles from './animations/Particles'

const NODES = [
  { id:'n1',  x:50, y:48, r:6,   color:'#00f2fe', label:'Malcolm Crowe',  delay:'0.0s' },
  { id:'n2',  x:27, y:28, r:5,   color:'#00f2fe', label:'Cole Sear',      delay:'0.3s' },
  { id:'n3',  x:72, y:22, r:4.5, color:'#8b5cf6', label:'Frank',          delay:'0.6s' },
  { id:'n4',  x:82, y:62, r:6,   color:'#00f2fe', label:'Donnie Darko',  delay:'0.9s' },
  { id:'n5',  x:22, y:68, r:4.5, color:'#8b5cf6', label:'Graysmith',     delay:'1.2s' },
  { id:'n6',  x:58, y:78, r:5,   color:'#ec4899', label:'Identity Twist',delay:'1.5s' },
  { id:'n7',  x:38, y:55, r:4,   color:'#ec4899', label:'Time Loop',     delay:'0.2s' },
  { id:'n8',  x:88, y:35, r:3.5, color:'#ec4899', label:'Cipher Event',  delay:'0.8s' },
  { id:'n9',  x:12, y:42, r:3.5, color:'#fbbf24', label:'Engine Falls',  delay:'1.1s' },
  { id:'n10', x:62, y:38, r:4,   color:'#fbbf24', label:'Revelation',    delay:'0.5s' },
  { id:'n11', x:44, y:18, r:3,   color:'#8b5cf6', label:'Zodiac',        delay:'1.4s' },
  { id:'n12', x:18, y:82, r:3,   color:'#fbbf24', label:'Catalyst',      delay:'0.7s' },
]
const EDGES = [
  ['n1','n2'],['n1','n6'],['n1','n10'],
  ['n2','n7'],['n2','n9'],['n2','n5'],
  ['n3','n4'],['n3','n7'],['n3','n8'],
  ['n4','n7'],['n4','n6'],['n4','n9'],
  ['n5','n12'],['n6','n10'],['n7','n12'],
  ['n8','n11'],['n10','n11'],['n11','n3'],
]
const getNode = id => NODES.find(n => n.id === id)

// Tiny glassmorphic HUD chip
const HudChip = ({ children, style }) => (
  <div style={{
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    background: 'rgba(3,0,20,0.55)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding: '6px 12px',
    ...style,
  }}>
    {children}
  </div>
)

const LEGEND = [
  { color:'#00f2fe', label:'Character' },
  { color:'#8b5cf6', label:'Event'     },
  { color:'#ec4899', label:'Twist'     },
  { color:'#fbbf24', label:'Catalyst'  },
]

const GraphCanvas = () => (
  // Full-height, no rounded border top — feels like an expansive viewport
  <div
    id="graph-canvas"
    className="relative w-full overflow-hidden"
    style={{
      height: '520px',
      background: 'rgba(3,0,14,0.92)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '14px',
    }}
  >
    {/* ── React Bits Particles WebGL layer ────── */}
    <Particles
      particleCount={140}
      particleSpread={10}
      speed={0.035}
      particleColors={['#00f2fe', '#7c3aed', '#8b5cf6', '#004d55', '#3b0764']}
      alphaParticles={true}
      particleBaseSize={75}
      sizeRandomness={1.4}
      cameraDistance={18}
    />

    {/* ── Subtle vignette over particles ──────── */}
    <div className="absolute inset-0 pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(3,0,20,0.75) 100%)',
      }}
    />

    {/* ── Ambient glow blobs ───────────────────── */}
    <div className="absolute pointer-events-none"
      style={{ top:'15%', left:'30%', width:300, height:300,
        background:'radial-gradient(circle,rgba(0,242,254,0.055) 0%,transparent 70%)', borderRadius:'50%' }} />
    <div className="absolute pointer-events-none"
      style={{ bottom:'15%', right:'20%', width:240, height:240,
        background:'radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)', borderRadius:'50%' }} />

    {/* ── SVG force graph ──────────────────────── */}
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full"
      style={{ padding: '7%' }}
    >
      {/* Edges */}
      {EDGES.map(([fromId, toId], i) => {
        const from = getNode(fromId)
        const to   = getNode(toId)
        if (!from || !to) return null
        const isHot = from.color === '#ec4899' || to.color === '#ec4899'
        return (
          <line key={i}
            x1={from.x} y1={from.y} x2={to.x} y2={to.y}
            stroke={isHot ? '#ec4899' : '#00f2fe'}
            strokeWidth="0.25"
            strokeOpacity="0.2"
            strokeDasharray="5 3"
            style={{ animation: `dashMarch ${10 + i * 0.6}s linear ${-i * 0.4}s infinite` }}
          />
        )
      })}
      {/* Outer rings */}
      {NODES.map(n => (
        <circle key={`r-${n.id}`} cx={n.x} cy={n.y} r={n.r+3.5}
          fill="none" stroke={n.color} strokeWidth="0.25" strokeOpacity="0.1"
          style={{ animation:`glowBreathe 3s ease-in-out ${n.delay} infinite` }} />
      ))}
      {/* Nodes */}
      {NODES.map(n => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={n.r}
            fill={n.color} fillOpacity="0.88"
            style={{ animation:`nodeBeat 2.5s ease-in-out ${n.delay} infinite`,
              filter:`drop-shadow(0 0 2.5px ${n.color})` }} />
          <text x={n.x} y={n.y - n.r - 1.8}
            textAnchor="middle" fontSize="2.6"
            fill="rgba(255,255,255,0.38)"
            fontFamily="Inter,sans-serif" letterSpacing="-0.03">
            {n.label}
          </text>
        </g>
      ))}
    </svg>

    {/* ── Scan line ────────────────────────────── */}
    <div className="absolute left-0 right-0 h-px pointer-events-none"
      style={{
        background:'linear-gradient(90deg,transparent 0%,rgba(0,242,254,0.4) 40%,rgba(0,242,254,0.55) 50%,rgba(0,242,254,0.4) 60%,transparent 100%)',
        animation:'scan 7s ease-in-out infinite', top:0,
      }} />

    {/* ── Top-left HUD ─────────────────────────── */}
    <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
      <HudChip>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70"
              style={{ background:'#00f2fe' }} />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background:'#00f2fe' }} />
          </span>
          <span className="text-[10.5px] font-mono text-cyan-400 tracking-wide">LIVE</span>
        </div>
      </HudChip>
      <HudChip>
        <span className="text-[10.5px] font-mono text-slate-500">
          {NODES.length} nodes · {EDGES.length} edges
        </span>
      </HudChip>
    </div>

    {/* ── Top-right HUD ────────────────────────── */}
    <div className="absolute top-3.5 right-3.5">
      <HudChip>
        <span className="text-[10px] font-mono"
          style={{ background:'linear-gradient(135deg,#00f2fe,#7c3aed)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          ForceGraph3D · soon
        </span>
      </HudChip>
    </div>

    {/* ── Bottom legend HUD ────────────────────── */}
    <div className="absolute bottom-3.5 left-3.5">
      <HudChip style={{ padding: '5px 12px' }}>
        <div className="flex items-center gap-4">
          {LEGEND.map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background:l.color, boxShadow:`0 0 4px ${l.color}` }} />
              <span className="text-[10.5px] font-mono text-slate-500">{l.label}</span>
            </div>
          ))}
        </div>
      </HudChip>
    </div>

    {/* ── Bottom-right hint ────────────────────── */}
    <div className="absolute bottom-3.5 right-3.5">
      <HudChip style={{ padding: '5px 10px' }}>
        <span className="text-[10px] font-mono text-slate-700">Drag · Zoom · Rotate</span>
      </HudChip>
    </div>
  </div>
)

export default GraphCanvas
