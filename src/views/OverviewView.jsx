import BlurText       from '../components/animations/BlurText'
import GlowButton     from '../components/animations/GlowButton'
import AnimatedCounter from '../components/animations/AnimatedCounter'
import GraphCanvas    from '../components/GraphCanvas'
import DataTableSkeleton from '../components/DataTableSkeleton'
import { STATS }     from '../data/movies'

// ── Breadcrumb ────────────────────────────────────────────────────────────
const Breadcrumb = ({ crumbs }) => (
  <div className="flex items-center gap-1.5 text-[11.5px] font-mono text-slate-700">
    {crumbs.map((c, i) => (
      <span key={i} className="flex items-center gap-1.5">
        {i > 0 && <span className="text-slate-800">/</span>}
        <span className={i === crumbs.length - 1 ? 'text-slate-500' : ''}>{c}</span>
      </span>
    ))}
  </div>
)

// ── Borderless animated stat ───────────────────────────────────────────────
const StatItem = ({ stat, delay }) => (
  <div className="flex flex-col gap-2 py-2">
    <div
      className="text-[42px] font-bold leading-none tracking-tight tabular-nums"
      style={{ color: stat.color, textShadow: `0 0 30px ${stat.color}40` }}
    >
      <AnimatedCounter target={stat.value} delay={delay} />
    </div>
    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest leading-none">
      {stat.label}
    </p>
  </div>
)

// ── Section header ─────────────────────────────────────────────────────────
const SectionHeader = ({ title, action }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.08em]">{title}</h3>
    {action && (
      <button className="text-[11.5px] font-mono text-slate-700 hover:text-slate-500 transition-colors duration-150">
        {action}
      </button>
    )}
  </div>
)

// ─────────────────────────────────────────────────────────────────────────
const OverviewView = () => (
  <div className="max-w-6xl mx-auto px-8 py-10 space-y-10">

    {/* ── Page header ──────────────────────────────────────────────────── */}
    <header>
      <Breadcrumb crumbs={['HELIX', 'Overview']} />

      <div className="mt-6">
        {/* BlurText hero — word-by-word blur reveal */}
        <h1 className="text-[32px] font-bold tracking-tight leading-tight">
          <BlurText
            text="Narrative Twist"
            delay={70}
            stepDuration={0.4}
            className="text-white"
            animateBy="words"
          />
          <BlurText
            text="Visualizer"
            delay={70}
            stepDuration={0.4}
            direction="bottom"
            className="text-grad-full"
            style={{ animationDelay: '200ms' }}
          />
        </h1>

        <p className="mt-4 text-[13px] text-slate-500 max-w-lg leading-relaxed">
          HELIX maps the hidden architectures of cinema's most mind-bending films —
          characters, events, and the precise moments where reality bends.
        </p>
      </div>

      {/* CTA row */}
      <div className="flex items-center gap-2.5 mt-6">
        <GlowButton id="btn-explore" variant="primary">
          <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
            <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M5 7.5h5M7.5 5l2.5 2.5L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Explore Graph
        </GlowButton>
        <GlowButton id="btn-add-film" variant="ghost">
          + Add Film
        </GlowButton>
      </div>
    </header>

    {/* ── Stats — borderless animated counters ─────────────────────────── */}
    <section>
      {/* Thin separator line above stats */}
      <div className="mb-6" style={{ height:'1px', background:'rgba(255,255,255,0.05)' }} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
        {STATS.map((stat, i) => (
          <div key={stat.label} className="relative flex flex-col">
            {/* Vertical divider between stats (not before first) */}
            {i > 0 && (
              <div className="absolute left-0 top-2 bottom-2 w-px"
                style={{ background: 'rgba(255,255,255,0.05)' }} />
            )}
            <div className={i > 0 ? 'pl-8' : ''}>
              <StatItem stat={stat} delay={i * 100} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6" style={{ height:'1px', background:'rgba(255,255,255,0.05)' }} />
    </section>

    {/* ── Announcement ribbon ───────────────────────────────────────────── */}
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg"
      style={{ background:'rgba(0,242,254,0.03)', border:'1px solid rgba(0,242,254,0.1)' }}
    >
      <span className="badge badge-cyan flex-shrink-0">New</span>
      <p className="text-[12px] text-slate-500">
        <span className="text-slate-300 font-medium">HELIX v1.0</span> — Three.js ForceGraph3D integration is in active development. The canvas below runs React Bits WebGL particles.
      </p>
    </div>

    {/* ── Graph Canvas (immersive viewport) ────────────────────────────── */}
    <section>
      <SectionHeader title="Twist Graph — All Films" action="Open full view ↗" />
      <GraphCanvas />
    </section>

    {/* ── Event table ──────────────────────────────────────────────────── */}
    <section className="pb-10">
      <SectionHeader title="Event Index" action="Export CSV →" />
      <DataTableSkeleton isLoaded={true} />
    </section>

  </div>
)

export default OverviewView
