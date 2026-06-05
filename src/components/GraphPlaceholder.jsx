// GraphPlaceholder — Premium CSS/SVG 3D twist graph illusion
// Aesthetic: Linear/Vercel dark, glassmorphism panel, localized neon glows

const NODES = [
  // {id, x%, y%, r, color, label, type}
  { id: 'n1',  x: 50,  y: 48,  r: 6.5, color: '#00f2fe', label: 'Malcolm Crowe',   type: 'character', delay: '0.0s' },
  { id: 'n2',  x: 27,  y: 28,  r: 5,   color: '#00f2fe', label: 'Cole Sear',       type: 'character', delay: '0.3s' },
  { id: 'n3',  x: 72,  y: 22,  r: 4.5, color: '#8b5cf6', label: 'Frank',           type: 'character', delay: '0.6s' },
  { id: 'n4',  x: 82,  y: 62,  r: 6,   color: '#00f2fe', label: 'Donnie Darko',   type: 'character', delay: '0.9s' },
  { id: 'n5',  x: 22,  y: 68,  r: 4.5, color: '#8b5cf6', label: 'Graysmith',      type: 'character', delay: '1.2s' },
  { id: 'n6',  x: 58,  y: 78,  r: 5,   color: '#ec4899', label: 'Identity Twist', type: 'twist',     delay: '1.5s' },
  { id: 'n7',  x: 38,  y: 55,  r: 4,   color: '#ec4899', label: 'Time Loop',      type: 'twist',     delay: '0.2s' },
  { id: 'n8',  x: 88,  y: 35,  r: 3.5, color: '#ec4899', label: 'Cipher Event',   type: 'event',     delay: '0.8s' },
  { id: 'n9',  x: 12,  y: 42,  r: 3.5, color: '#fbbf24', label: 'Engine Falls',   type: 'event',     delay: '1.1s' },
  { id: 'n10', x: 62,  y: 38,  r: 4,   color: '#fbbf24', label: 'Revelation',     type: 'event',     delay: '0.5s' },
  { id: 'n11', x: 44,  y: 18,  r: 3,   color: '#8b5cf6', label: 'Zodiac',         type: 'character', delay: '1.4s' },
  { id: 'n12', x: 18,  y: 82,  r: 3,   color: '#fbbf24', label: 'Catalyst',       type: 'event',     delay: '0.7s' },
]

const EDGES = [
  ['n1','n2',0.7],['n1','n6',0.9],['n1','n10',0.6],
  ['n2','n7',0.8],['n2','n9',0.5],['n2','n5',0.4],
  ['n3','n4',0.9],['n3','n7',0.7],['n3','n8',0.6],
  ['n4','n7',0.8],['n4','n6',0.5],['n4','n9',0.7],
  ['n5','n12',0.6],['n5','n8',0.4],
  ['n6','n10',0.7],['n7','n12',0.5],
  ['n8','n11',0.8],['n10','n11',0.6],['n11','n3',0.5],
]

const LEGEND = [
  { color: '#00f2fe', label: 'Character' },
  { color: '#8b5cf6', label: 'Event'     },
  { color: '#ec4899', label: 'Twist Node'},
  { color: '#fbbf24', label: 'Catalyst'  },
]

const getNode = id => NODES.find(n => n.id === id)

const GraphPlaceholder = () => (
  <div
    className="relative w-full rounded-xl overflow-hidden"
    style={{
      background: 'radial-gradient(ellipse at 50% 30%, rgba(124,58,237,0.07) 0%, rgba(0,242,254,0.03) 40%, transparent 70%), rgba(10,10,15,0.5)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.5)',
      minHeight: '480px',
    }}
  >
    {/* ── Dot-grid background ─────────────────────────────── */}
    <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.3 }}>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.5" fill="rgba(255,255,255,0.3)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>

    {/* ── Ambient radial glows ────────────────────────────── */}
    <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full pointer-events-none"
      style={{ background: 'radial-gradient(circle, rgba(0,242,254,0.07) 0%, transparent 70%)' }} />
    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full pointer-events-none"
      style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }} />

    {/* ── Scan line ────────────────────────────────────────── */}
    <div className="absolute left-0 right-0 h-px pointer-events-none"
      style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(0,242,254,0.35) 40%, rgba(0,242,254,0.5) 50%, rgba(0,242,254,0.35) 60%, transparent 100%)',
        animation: 'scan 6s ease-in-out infinite',
        top: 0,
      }}
    />

    {/* ── Main force graph SVG ─────────────────────────────── */}
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full"
      style={{ padding: '6%' }}
    >
      <defs>
        {/* Glow filter per color */}
        <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-violet" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Edges */}
      {EDGES.map(([fromId, toId, opacity], i) => {
        const from = getNode(fromId)
        const to   = getNode(toId)
        if (!from || !to) return null
        const edgeColor = from.type === 'twist' || to.type === 'twist' ? '#ec4899' : '#00f2fe'
        return (
          <line
            key={i}
            x1={from.x} y1={from.y}
            x2={to.x}   y2={to.y}
            stroke={edgeColor}
            strokeWidth="0.3"
            strokeOpacity={opacity * 0.35}
            className="edge-line"
            style={{ animationDuration: `${10 + i * 0.7}s`, animationDelay: `${-i * 0.5}s` }}
          />
        )
      })}

      {/* Node outer glow rings */}
      {NODES.map(node => (
        <circle key={`ring-${node.id}`}
          cx={node.x} cy={node.y} r={node.r + 3}
          fill="none"
          stroke={node.color}
          strokeWidth="0.3"
          strokeOpacity="0.15"
          style={{ animation: `glowBreathe 3s ease-in-out ${node.delay} infinite` }}
        />
      ))}

      {/* Nodes */}
      {NODES.map(node => (
        <g key={node.id}>
          <circle
            cx={node.x} cy={node.y}
            r={node.r}
            fill={node.color}
            fillOpacity="0.9"
            className="node-circle"
            style={{
              animationDelay: node.delay,
              filter: `drop-shadow(0 0 3px ${node.color})`,
            }}
          />
          {/* Label */}
          <text
            x={node.x} y={node.y - node.r - 1.8}
            textAnchor="middle"
            fontSize="2.8"
            fill="rgba(255,255,255,0.45)"
            fontFamily="Inter, sans-serif"
            letterSpacing="-0.03"
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>

    {/* ── Header bar ─────────────────────────────────────────── */}
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3"
      style={{ borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center gap-2">
        {/* Live indicator */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md"
          style={{ background: 'rgba(0,242,254,0.06)', border: '1px solid rgba(0,242,254,0.12)' }}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: '#00f2fe' }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#00f2fe' }} />
          </span>
          <span className="text-[11px] font-mono text-cyan-400 tracking-wide">LIVE GRAPH</span>
        </div>
        <span className="text-[11px] font-mono text-slate-600">
          {NODES.length} nodes · {EDGES.length} edges
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-mono text-slate-700">Three.js / ForceGraph3D</span>
        <span className="badge badge-violet">Coming soon</span>
      </div>
    </div>

    {/* ── Bottom legend ────────────────────────────────────────── */}
    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3"
      style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center gap-5">
        {LEGEND.map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: item.color, boxShadow: `0 0 5px ${item.color}` }} />
            <span className="text-[11px] font-mono text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
      <span className="text-[11px] font-mono text-slate-700">Drag · Zoom · Rotate</span>
    </div>
  </div>
)

export default GraphPlaceholder
