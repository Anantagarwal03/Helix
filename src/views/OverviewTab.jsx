import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BentoCard = ({ children, className, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 relative overflow-hidden group ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
    <div className="relative z-10 h-full flex flex-col">{children}</div>
  </motion.div>
);

const OverviewTab = () => {
  const recentMovies = [
    { title: "Oldboy", twist: "High Deviation", color: "text-[#ec4899]" },
    { title: "Taxi Driver", twist: "Moderate", color: "text-[#8b5cf6]" },
    { title: "Donnie Darko", twist: "Timeline Fracture", color: "text-[#00f2fe]" },
    { title: "The Sixth Sense", twist: "Critical Shift", color: "text-red-400" }
  ];

  return (
    <div className="min-h-screen bg-[#030014] text-white p-6 md:p-8 relative overflow-hidden w-full">
      
      {/* TECHNICAL GRID OVERLAY */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* ANIMATED AMBIENT AURORAS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#8b5cf6]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00f2fe]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

      <header className="mb-10 relative z-10">
        <h1 className="text-4xl font-serif tracking-widest uppercase mb-2 drop-shadow-lg">
          Labyrinth <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Overview</span>
        </h1>
        <p className="text-white/50 text-sm tracking-[0.2em] uppercase">System node architecture and timeline analysis</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10 auto-rows-[220px]">
        
        <BentoCard className="md:col-span-2 lg:col-span-3 row-span-2" delay={0.1}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-mono text-[#00f2fe] uppercase tracking-wider">Active Twist Topography</h2>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse" />
              <span className="text-[10px] font-mono text-white/50 tracking-widest">LIVE</span>
            </div>
          </div>
          <div className="flex-1 rounded-xl bg-black/40 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-40" 
                 style={{ backgroundImage: 'radial-gradient(circle at center, #8b5cf6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            <div className="w-32 h-32 rounded-full border border-[#8b5cf6]/30 flex items-center justify-center relative animate-[spin_20s_linear_infinite]">
              <div className="w-24 h-24 rounded-full border border-[#00f2fe]/30 absolute top-2 left-2" />
              <div className="w-16 h-16 rounded-full border border-[#ec4899]/30 absolute bottom-2 right-2" />
            </div>
            
            <Link to="/graph" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
              <span className="px-6 py-2 border border-white/20 rounded-full font-mono text-sm tracking-widest hover:bg-white/10 transition-colors">ENTER FULL GRAPH</span>
            </Link>
          </div>
        </BentoCard>

        <BentoCard className="md:col-span-1 lg:col-span-1" delay={0.2}>
          <h2 className="text-sm font-mono text-white/50 uppercase tracking-wider mb-6">Database Metrics</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white/70 uppercase tracking-wider">Films Indexed</span>
                <span className="text-[#8b5cf6] font-mono text-lg leading-none">1,402</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] w-[75%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white/70 uppercase tracking-wider">Nodes Connected</span>
                <span className="text-[#00f2fe] font-mono text-lg leading-none">8,943</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] w-[45%]" />
              </div>
            </div>
          </div>
        </BentoCard>

        <BentoCard className="md:col-span-1 lg:col-span-1" delay={0.3}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-mono text-white/50 uppercase tracking-wider">Recent Additions</h2>
            <Link to="/library" className="text-[10px] text-white/40 hover:text-white transition-colors uppercase tracking-widest border-b border-white/20 pb-0.5">View All</Link>
          </div>
          <ul className="space-y-3 flex-1 overflow-hidden">
            {recentMovies.map((movie, i) => (
              <li key={i} className="flex items-center justify-between group p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-black flex items-center justify-center border border-white/10 shadow-inner">
                    <span className="text-[10px] font-mono text-white/50">{i + 1}</span>
                  </div>
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors font-medium tracking-wide">{movie.title}</span>
                </div>
                <span className={`text-[10px] font-mono ${movie.color} opacity-0 group-hover:opacity-100 transition-opacity`}>{movie.twist}</span>
              </li>
            ))}
          </ul>
        </BentoCard>

      </div>
    </div>
  );
};

export default OverviewTab;
