/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Obsidian base — Linear/Vercel dark
        base: {
          950: '#030014',
          900: '#050505',
          800: '#0a0a0f',
          700: '#0f0f17',
          600: '#141420',
        },
        // Subtle surface elevations
        surface: {
          0:  'rgba(255,255,255,0.00)',
          1:  'rgba(255,255,255,0.03)',
          2:  'rgba(255,255,255,0.05)',
          3:  'rgba(255,255,255,0.08)',
          4:  'rgba(255,255,255,0.12)',
        },
        // Borders
        border: {
          subtle:  'rgba(255,255,255,0.06)',
          DEFAULT: 'rgba(255,255,255,0.08)',
          muted:   'rgba(255,255,255,0.04)',
          focus:   'rgba(0,242,254,0.4)',
        },
        // Neon accents — HELIX palette
        cyan:   { DEFAULT: '#00f2fe', dim: '#00c4cf', dark: '#004d55', glow: 'rgba(0,242,254,0.15)' },
        violet: { DEFAULT: '#7c3aed', bright: '#8b5cf6', dim: '#5b21b6', glow: 'rgba(139,92,246,0.15)' },
        pink:   { DEFAULT: '#ec4899', dim: '#be185d', glow: 'rgba(236,72,153,0.12)' },
        // Text hierarchy — matches 21st.dev / Linear
        fg: {
          DEFAULT:  '#ffffff',
          muted:    '#94a3b8',   // slate-400
          subtle:   '#64748b',   // slate-500
          faint:    '#334155',   // slate-700
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      borderWidth: { px: '1px' },
      boxShadow: {
        // Elevation system
        'card':        '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6)',
        'card-hover':  '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
        // Neon glows — localized, not chaotic
        'glow-cyan':   '0 0 30px rgba(0,242,254,0.10), 0 0 0 1px rgba(0,242,254,0.12)',
        'glow-violet': '0 0 30px rgba(139,92,246,0.10), 0 0 0 1px rgba(139,92,246,0.12)',
        'glow-pink':   '0 0 30px rgba(236,72,153,0.10), 0 0 0 1px rgba(236,72,153,0.12)',
        // Inner highlight — glassmorphic top edge
        'inner-light': 'inset 0 1px 0 rgba(255,255,255,0.06)',
        // Sidebar shadow
        'sidebar':     '1px 0 0 rgba(255,255,255,0.04)',
      },
      backgroundImage: {
        // Noise texture overlay — premium depth
        'noise':          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        // Radial ambient glows
        'ambient-cyan':   'radial-gradient(ellipse 80% 50% at 20% 20%, rgba(0,242,254,0.06) 0%, transparent 100%)',
        'ambient-violet': 'radial-gradient(ellipse 60% 40% at 80% 80%, rgba(139,92,246,0.07) 0%, transparent 100%)',
        // Graph panel
        'graph-panel':    'radial-gradient(ellipse at 50% 30%, rgba(124,58,237,0.08) 0%, rgba(0,242,254,0.04) 40%, transparent 70%), linear-gradient(180deg, rgba(10,10,15,0.95) 0%, rgba(5,5,5,0.98) 100%)',
        // Gradient text
        'grad-cyan-violet': 'linear-gradient(135deg, #00f2fe 0%, #7c3aed 100%)',
        'grad-violet-pink': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
        'grad-full':       'linear-gradient(135deg, #00f2fe 0%, #7c3aed 50%, #ec4899 100%)',
        // Subtle shimmer
        'shimmer':         'linear-gradient(90deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.04) 50%, rgba(0,242,254,0.02) 60%, rgba(255,255,255,0.04) 70%, rgba(255,255,255,0.0) 100%)',
      },
      animation: {
        'fade-in':        'fadeIn 0.4s ease-out',
        'slide-up':       'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
        'shimmer':        'shimmer 2.5s linear infinite',
        'pulse-slow':     'pulse 4s ease-in-out infinite',
        'spin-slow':      'spin 25s linear infinite',
        'spin-slow-rev':  'spinRev 18s linear infinite',
        'float':          'float 7s ease-in-out infinite',
        'glow-breathe':   'glowBreathe 3s ease-in-out infinite',
        'dash-march':     'dashMarch 12s linear infinite',
        'node-beat':      'nodeBeat 2.5s ease-in-out infinite',
        'scan':           'scan 5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:      { from: { opacity: '0' },                 to: { opacity: '1' } },
        slideUp:     { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer:     { from: { backgroundPosition: '-2000px 0' }, to: { backgroundPosition: '2000px 0' } },
        spinRev:     { from: { transform: 'rotate(360deg)' },  to: { transform: 'rotate(0deg)' } },
        float:       { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        glowBreathe: { '0%,100%': { opacity: '0.5' }, '50%': { opacity: '1' } },
        dashMarch:   { to: { strokeDashoffset: '-800' } },
        nodeBeat:    { '0%,100%': { r: '4', opacity: '0.8' }, '50%': { r: '5.5', opacity: '1' } },
        scan:        { '0%': { transform: 'translateY(0%)', opacity: '0' }, '5%': { opacity: '0.7' }, '95%': { opacity: '0.7' }, '100%': { transform: 'translateY(480px)', opacity: '0' } },
      },
    },
  },
  plugins: [],
}
