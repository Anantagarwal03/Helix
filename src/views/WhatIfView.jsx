import { useState } from 'react'
import { MOVIES, TWIST_TYPES } from '../data/movies'

// ── Breadcrumb ───────────────────────────────────────────────────────────
const Breadcrumb = ({ crumbs }) => (
  <div className="flex items-center gap-1.5 text-[12px] font-mono text-slate-600">
    {crumbs.map((c, i) => (
      <span key={i} className="flex items-center gap-1.5">
        {i > 0 && <span className="text-slate-800">/</span>}
        <span className={i === crumbs.length - 1 ? 'text-slate-400' : ''}>{c}</span>
      </span>
    ))}
  </div>
)

// ── Input field ──────────────────────────────────────────────────────────
const InputField = ({ label, id, placeholder, type = 'text', mono = false }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.07em]">
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className={`w-full h-8 px-3 rounded-lg text-[13px] text-slate-200 placeholder-slate-700 outline-none transition-all duration-150 ${mono ? 'font-mono' : ''}`}
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      onFocus={e => { e.target.style.borderColor = 'rgba(0,242,254,0.35)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,242,254,0.06)' }}
      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
    />
  </div>
)

// ── Select field ─────────────────────────────────────────────────────────
const SelectField = ({ label, id, options }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.07em]">
      {label}
    </label>
    <select
      id={id}
      className="w-full h-8 px-3 rounded-lg text-[13px] text-slate-200 outline-none transition-all duration-150 appearance-none cursor-pointer"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      onFocus={e => { e.target.style.borderColor = 'rgba(0,242,254,0.35)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,242,254,0.06)' }}
      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
    >
      {options.map(o => <option key={o} value={o} style={{ background: '#0a0a0f' }}>{o}</option>)}
    </select>
  </div>
)

// ── Output panel ─────────────────────────────────────────────────────────
const OutputPanel = ({ result }) => {
  if (!result) return (
    <div
      className="flex flex-col items-center justify-center gap-4 h-full min-h-[200px] rounded-xl"
      style={{ border: '1px dashed rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center animate-pulse-slow"
        style={{ background: 'rgba(0,242,254,0.06)', border: '1px solid rgba(0,242,254,0.12)' }}
      >
        <svg width="16" height="16" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="6" stroke="#00f2fe" strokeWidth="1.2"/>
          <path d="M7.5 4v3.5l2 2" stroke="#00f2fe" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="text-[12px] text-slate-700 text-center">
        Configure variables and run the simulation<br />to see the alternate timeline output.
      </p>
    </div>
  )

  return (
    <div
      className="rounded-xl p-5 space-y-4"
      style={{
        background: 'rgba(0,242,254,0.03)',
        border: '1px solid rgba(0,242,254,0.12)',
        boxShadow: '0 0 30px rgba(0,242,254,0.04)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="badge badge-cyan">Simulation Complete</span>
        <span className="text-[11px] font-mono text-slate-600">Δ Timeline Generated</span>
      </div>
      <div className="space-y-3">
        {result.outcomes.map((o, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-1 rounded-full flex-shrink-0 mt-1"
              style={{ background: i === 0 ? '#00f2fe' : i === 1 ? '#8b5cf6' : '#ec4899', minHeight: '40px' }} />
            <div>
              <p className="text-[12px] font-medium text-white">{o.label}</p>
              <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">{o.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 pt-2" style={{ borderTop: '0.5px solid rgba(0,242,254,0.1)' }}>
        <span className="text-[11px] font-mono text-slate-700">Confidence:</span>
        <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full" style={{ width: `${result.confidence}%`, background: 'linear-gradient(90deg, #00f2fe, #7c3aed)' }} />
        </div>
        <span className="text-[11px] font-mono text-cyan-400">{result.confidence}%</span>
      </div>
    </div>
  )
}

// ── Variable row ─────────────────────────────────────────────────────────
const VariableRow = ({ label, value, color }) => (
  <div className="flex items-center justify-between py-2" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.04)' }}>
    <span className="text-[12px] text-slate-500">{label}</span>
    <span className="text-[12px] font-mono" style={{ color }}>{value}</span>
  </div>
)

// ─────────────────────────────────────────────────────────────────────────
const SAMPLE_RESULT = {
  confidence: 73,
  outcomes: [
    { label: 'Primary Divergence', desc: 'Without the twist event, the protagonist\'s arc collapses into a closed loop — no resolution is possible.' },
    { label: 'Character Impact',   desc: 'The supporting cast loses narrative purpose. 4 of 7 characters become orphaned nodes in the graph.' },
    { label: 'Structural Effect',  desc: 'Act III disintegrates. The film would require a completely rewritten third act to maintain coherence.' },
  ],
}

const WhatIfView = () => {
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSimulate = () => {
    setLoading(true)
    setResult(null)
    setTimeout(() => { setLoading(false); setResult(SAMPLE_RESULT) }, 1600)
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-8 animate-slide-up">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="mb-8">
        <Breadcrumb crumbs={['HELIX', 'What If Simulator']} />
        <div className="mt-5">
          <h1 className="text-[28px] font-bold tracking-tight text-white leading-tight">
            What If <span className="text-grad-full">Simulator</span>
          </h1>
          <p className="mt-2 text-[13px] text-slate-400 max-w-lg leading-relaxed">
            Propose alternate narrative paths by modifying twist variables. HELIX
            will simulate the downstream effect on characters, events, and story structure.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Input panel ─────────────────────────────────────── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'rgba(10,10,15,0.5)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {/* Panel header */}
          <div className="px-5 py-3.5" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-[13px] font-semibold text-white tracking-tight">Twist Variables</h2>
            <p className="text-[11px] text-slate-600 mt-0.5">Define the scenario parameters</p>
          </div>

          <div className="p-5 space-y-4">
            <SelectField label="Source Film"     id="sim-film"  options={MOVIES.map(m => m.title)} />
            <SelectField label="Twist Type"      id="sim-twist" options={TWIST_TYPES} />
            <InputField  label="Pivot Event"     id="sim-event" placeholder="e.g. Malcolm never meets Cole" />
            <InputField  label="Alternate Outcome" id="sim-alt" placeholder="e.g. Malcolm accepts his own death" />

            {/* Intensity slider */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.07em]">
                Narrative Divergence Intensity
              </label>
              <input
                type="range" min="1" max="10" defaultValue="6"
                id="sim-intensity"
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#00f2fe', background: 'rgba(255,255,255,0.08)' }}
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-700">
                <span>Subtle</span><span>Extreme</span>
              </div>
            </div>

            {/* Simulate CTA */}
            <button
              id="btn-simulate"
              onClick={handleSimulate}
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
              style={loading ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="20"/>
                  </svg>
                  Simulating…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                    <path d="M7.5 1L14 7.5L7.5 14M14 7.5H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Run Simulation
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Output panel + context ──────────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* Simulation output */}
          <div
            className="rounded-xl overflow-hidden flex-1"
            style={{
              background: 'rgba(10,10,15,0.5)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            <div className="px-5 py-3.5" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
              <h2 className="text-[13px] font-semibold text-white tracking-tight">Alternate Timeline</h2>
              <p className="text-[11px] text-slate-600 mt-0.5">Simulated narrative divergence output</p>
            </div>
            <div className="p-5">
              <OutputPanel result={result} />
            </div>
          </div>

          {/* Context card — active parameters */}
          <div
            className="rounded-xl p-4"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p className="text-[11px] font-medium text-slate-600 uppercase tracking-[0.07em] mb-2">
              Active Context
            </p>
            <VariableRow label="Film Index"     value="3 films loaded"           color="#00f2fe" />
            <VariableRow label="Graph Nodes"    value="59 nodes mapped"          color="#8b5cf6" />
            <VariableRow label="Engine"         value="HELIX Narrative v1.0"     color="#ec4899" />
            <VariableRow label="Model"          value="Causal inference (local)"  color="#fbbf24" />
          </div>

        </div>
      </div>

    </div>
  )
}

export default WhatIfView
