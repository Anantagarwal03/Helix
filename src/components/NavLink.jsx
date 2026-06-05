// NavLink — reusable sidebar navigation item
const NavLink = ({ icon, label, active, onClick, badge }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg
        text-left transition-all duration-300 group relative
        ${active
          ? 'bg-white/5 nav-active-glow text-neon-cyan'
          : 'text-cosmic-200 hover:text-white hover:bg-white/5'
        }
      `}
    >
      {/* Active left border indicator */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-neon-cyan rounded-r-full shadow-neon-cyan" />
      )}

      {/* Icon */}
      <span className={`text-xl transition-all duration-300 ${active ? 'text-neon-cyan drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]' : 'text-cosmic-300 group-hover:text-neon-cyan'}`}>
        {icon}
      </span>

      {/* Label */}
      <span className={`font-display font-medium text-sm tracking-wide transition-all duration-300 ${active ? 'text-glow-cyan' : ''}`}>
        {label}
      </span>

      {/* Badge */}
      {badge && (
        <span className="ml-auto text-xs font-mono bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}

      {/* Hover arrow */}
      {!active && (
        <span className="ml-auto text-cosmic-600 group-hover:text-neon-cyan opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs">
          →
        </span>
      )}
    </button>
  );
};

export default NavLink;
