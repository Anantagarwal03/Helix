import { TABLE_SAMPLE_DATA } from '../data/movies'

const COLS = [
  { key: 'movie',     label: 'Film',        width: '22%' },
  { key: 'character', label: 'Character',    width: '18%' },
  { key: 'event',     label: 'Event',        width: '25%' },
  { key: 'twist',     label: 'Twist Type',   width: '20%' },
  { key: 'timestamp', label: 'Story Time',   width: '15%' },
]

const TWIST_STYLE = {
  'Identity Reveal':    { color: '#00f2fe', bg: 'rgba(0,242,254,0.07)',   border: 'rgba(0,242,254,0.18)'   },
  'Temporal Loop':      { color: '#8b5cf6', bg: 'rgba(139,92,246,0.07)', border: 'rgba(139,92,246,0.18)' },
  'Unreliable Reality': { color: '#ec4899', bg: 'rgba(236,72,153,0.07)', border: 'rgba(236,72,153,0.18)' },
}

const FILTERS = ['All', 'Identity', 'Temporal', 'Reality']

const SortIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-30">
    <path d="M5 2L8 5H2L5 2Z" fill="currentColor"/>
    <path d="M5 8L2 5H8L5 8Z" fill="currentColor"/>
  </svg>
)

const DataTableSkeleton = ({ isLoaded = true }) => {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'rgba(10,10,15,0.5)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* ── Toolbar ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 gap-4"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <h3 className="text-[13px] font-semibold text-white tracking-tight">
            Narrative Event Index
          </h3>
          <span className="badge badge-cyan">{TABLE_SAMPLE_DATA.length} events</span>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {FILTERS.map((f, i) => (
            <button key={f}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-all duration-150 ${
                i === 0
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              style={i === 0 ? {
                background: 'rgba(255,255,255,0.07)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
              } : {}}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="btn-ghost text-[11px] py-1 px-3">
            <svg width="11" height="11" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 1v13M1 7.5h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Add Event
          </button>
          <button className="btn-ghost text-[11px] py-1 px-3">
            Export ↗
          </button>
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
              {COLS.map(col => (
                <th key={col.key}
                  className="px-4 py-2.5 text-left"
                  style={{ width: col.width }}>
                  <button className="flex items-center gap-1.5 group">
                    <span className="text-[11px] font-medium text-slate-600 uppercase tracking-[0.07em]">
                      {col.label}
                    </span>
                    <SortIcon />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoaded
              ? TABLE_SAMPLE_DATA.map((row, i) => {
                  const ts = TWIST_STYLE[row.twist] ?? TWIST_STYLE['Identity Reveal']
                  return (
                    <tr key={i}
                      className="table-row-hover group"
                      style={{ borderBottom: '0.5px solid rgba(255,255,255,0.03)' }}>
                      {/* Film */}
                      <td className="px-4 py-3">
                        <span className="text-[13px] font-medium text-white/90 tracking-tight">{row.movie}</span>
                      </td>
                      {/* Character */}
                      <td className="px-4 py-3">
                        <span className="text-[12px] font-mono text-cyan-400/80">{row.character}</span>
                      </td>
                      {/* Event */}
                      <td className="px-4 py-3">
                        <span className="text-[12px] text-slate-400">{row.event}</span>
                      </td>
                      {/* Twist Type */}
                      <td className="px-4 py-3">
                        <span className="badge" style={{ color: ts.color, background: ts.bg, border: `1px solid ${ts.border}` }}>
                          {row.twist}
                        </span>
                      </td>
                      {/* Timestamp */}
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-mono text-slate-600">{row.timestamp}</span>
                      </td>
                    </tr>
                  )
                })
              : /* Skeleton rows */
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '0.5px solid rgba(255,255,255,0.03)' }}>
                    {[140, 100, 180, 90, 70].map((w, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="skeleton h-2.5 rounded-full"
                          style={{ width: `${w}px`, maxWidth: '100%', animationDelay: `${i * 0.08}s` }} />
                      </td>
                    ))}
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {/* ── Pagination footer ────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
        <span className="text-[11px] font-mono text-slate-700">
          1–{TABLE_SAMPLE_DATA.length} of {TABLE_SAMPLE_DATA.length} results
        </span>
        <div className="flex items-center gap-0.5">
          {['←', '1', '2', '3', '…', '→'].map((p, i) => (
            <button key={i}
              className={`w-6 h-6 rounded flex items-center justify-center text-[11px] font-mono transition-all duration-150 ${
                p === '1'
                  ? 'text-white'
                  : 'text-slate-600 hover:text-slate-300 hover:bg-white/[0.04]'
              }`}
              style={p === '1' ? { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' } : {}}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DataTableSkeleton
