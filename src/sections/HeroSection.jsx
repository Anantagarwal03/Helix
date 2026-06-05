/**
 * Section 1 — Hero & Overview
 * Features: DecryptedText title, ShinyText CTA, borderless animated counters
 */
import DecryptedText   from '../components/animations/DecryptedText'
import AnimatedCounter from '../components/animations/AnimatedCounter'
import { STATS }       from '../data/movies'

const SCROLL_HINT = () => (
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.15em]">Scroll</span>
    <div className="w-px h-8 relative overflow-hidden">
      <div className="absolute top-0 w-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
        style={{ height:'60%', animation:'scrollHint 1.8s ease-in-out infinite' }} />
    </div>
  </div>
)

const HeroSection = () => (
  <div className="relative w-full h-full flex flex-col justify-center px-12 py-16">

    {/* Glassmorphic content card */}
    <div
      className="relative max-w-3xl"
      style={{
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '20px',
        padding: '52px 56px',
      }}
    >
      {/* Top label */}
      <div data-reveal className="flex items-center gap-2 mb-6">
        <span className="w-6 h-px" style={{ background:'linear-gradient(90deg,#00f2fe,transparent)' }} />
        <span className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-[0.2em]">
          The Labyrinth · NARRATIVE ENGINE
        </span>
      </div>

      {/* DecryptedText headline */}
      <h1 data-reveal className="text-[46px] font-bold leading-[1.08] tracking-[-0.03em] text-white mb-2">
        <DecryptedText
          text="Narrative Twist"
          speed={35}
          maxIterations={14}
          sequential={true}
          revealDirection="start"
          animateOn="view"
          characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*_+-=<>"
          className="text-white"
          encryptedClassName=""
        />
      </h1>
      <h1 data-reveal
        className="text-[46px] font-bold leading-[1.08] tracking-[-0.03em] mb-8"
        style={{ background:'linear-gradient(135deg,#00f2fe 0%,#7c3aed 50%,#ec4899 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}
      >
        <DecryptedText
          text="Visualizer"
          speed={30}
          maxIterations={12}
          sequential={true}
          revealDirection="start"
          animateOn="view"
          characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#@$"
          className=""
          encryptedClassName=""
        />
      </h1>

      <p data-reveal className="text-[13.5px] text-slate-400 leading-relaxed max-w-lg mb-10">
        The Labyrinth maps the hidden architectures of cinema's most mind-bending films —
        every character, every event, and the precise moments where reality breaks.
      </p>

      {/* CTA row */}
      <div data-reveal className="flex items-center gap-3 mb-12">
        {/* Primary — gradient border + shiny text */}
        <div className="relative rounded-lg p-px cursor-pointer group"
          style={{ background:'linear-gradient(135deg,#00f2fe,#7c3aed,#ec4899)', backgroundSize:'200% 200%', animation:'gradientBorderSpin 3s linear infinite' }}>
          <div
            id="btn-explore"
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-[7px] overflow-hidden transition-all duration-150"
            style={{ background:'rgba(3,0,20,0.9)' }}
          >
            <span className="text-[13px] font-semibold"
              style={{
                background:'linear-gradient(110deg,#00f2fe 0%,#00f2fe 30%,#ffffff 50%,#00f2fe 70%,#00f2fe 100%)',
                backgroundSize:'300% 100%',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                animation:'shinyTextSweep 2.8s linear infinite',
              }}>
              Explore Graph
            </span>
            <svg width="12" height="12" viewBox="0 0 15 15" fill="none" style={{ color:'#00f2fe', flexShrink:0 }}>
              <path d="M3 7.5h9M8 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Ghost */}
        <button
          id="btn-add-film"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13px] font-medium text-slate-500 transition-all duration-150"
          style={{ border:'1px solid rgba(255,255,255,0.07)', background:'transparent' }}
          onMouseEnter={e => { e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='rgba(255,255,255,0.14)'; e.currentTarget.style.background='rgba(255,255,255,0.03)' }}
          onMouseLeave={e => { e.currentTarget.style.color='#64748b'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.background='transparent' }}
        >
          + Add Film
        </button>
      </div>

      {/* Borderless stats */}
      <div data-reveal className="grid grid-cols-4 gap-0">
        {STATS.map((stat, i) => (
          <div key={stat.label} className="relative flex flex-col gap-1.5">
            {i > 0 && (
              <div className="absolute left-0 top-1 bottom-1 w-px"
                style={{ background:'rgba(255,255,255,0.05)' }} />
            )}
            <div className={i > 0 ? 'pl-6' : ''}>
              <div className="text-[36px] font-bold tabular-nums leading-none"
                style={{ color:stat.color, textShadow:`0 0 24px ${stat.color}50` }}>
                <AnimatedCounter target={stat.value} delay={i * 120} />
              </div>
              <p className="mt-1.5 text-[9.5px] font-medium text-slate-600 uppercase tracking-widest leading-none">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>



    <SCROLL_HINT />
  </div>
)

export default HeroSection
