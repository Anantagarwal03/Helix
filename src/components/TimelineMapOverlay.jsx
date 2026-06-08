import React from 'react'

export default function TimelineMapOverlay({ timelineData, currentNodeId, visitedPath, closeMap, onNodeClick }) {
  const allNodes = Object.entries(timelineData.nodes).map(([id, data]) => ({
    id,
    ...data,
    isCurrent: id === currentNodeId,
    isVisited: visitedPath.includes(id)
  }));

  const canonicalNodes = allNodes.filter(n => n.type === 'canonical');
  const tangentNodes = allNodes.filter(n => n.type === 'tangent');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col text-white p-8 overflow-y-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8 max-w-5xl w-full mx-auto">
        <div>
          <h3 className="text-xl font-bold text-cyan-400 tracking-tight">Chronological Index</h3>
          <p className="text-xs text-slate-400 mt-1">Select any unlocked point to navigate through space-time tracks.</p>
        </div>
        <button 
          onClick={closeMap}
          className="bg-white/5 hover:bg-white/10 px-5 py-2 rounded-xl border border-white/10 text-xs font-medium transition-all"
        >
          Close View ✕
        </button>
      </div>

      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-500 border-l-2 border-cyan-500 pl-3 mb-6">Canonical Nexus Path</h4>
          {canonicalNodes.map((node) => (
            <div 
              key={node.id}
              onClick={() => node.isVisited && onNodeClick(node.id)}
              className={`p-5 rounded-2xl border transition-all duration-300 text-left ${
                node.isCurrent 
                  ? 'bg-cyan-950/30 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)] ring-1 ring-cyan-400/30' 
                  : node.isVisited 
                    ? 'bg-slate-900/40 border-cyan-500/20 cursor-pointer hover:border-cyan-400/50 hover:-translate-y-0.5 hover:bg-slate-900/60' 
                    : 'bg-zinc-900/10 border-zinc-900/40 opacity-30 select-none pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full ${node.isCurrent ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse' : node.isVisited ? 'bg-cyan-500/70' : 'bg-slate-700'}`} />
                <h5 className={`text-sm font-bold tracking-wide ${node.isCurrent ? 'text-cyan-400' : 'text-slate-200'}`}>{node.title}</h5>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-5.5">{node.description}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-red-500 border-l-2 border-red-500 pl-3 mb-6">Divergent What-If Tangents</h4>
          {tangentNodes.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-slate-500 italic">
              No timeline deviations triggered for this sequence map.
            </div>
          ) : (
            tangentNodes.map((node) => (
              <div 
                key={node.id}
                onClick={() => node.isVisited && onNodeClick(node.id)}
                className={`p-5 rounded-2xl border transition-all duration-300 text-left ${
                  node.isCurrent 
                    ? 'bg-red-950/20 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)] ring-1 ring-red-500/30' 
                    : node.isVisited 
                      ? 'bg-slate-900/40 border-red-500/20 cursor-pointer hover:border-red-400/50 hover:-translate-y-0.5 hover:bg-slate-900/60' 
                      : 'bg-zinc-900/10 border-zinc-900/40 opacity-30 select-none pointer-events-none'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${node.isCurrent ? 'bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse' : node.isVisited ? 'bg-red-500/70' : 'bg-slate-700'}`} />
                  <h5 className={`text-sm font-bold tracking-wide ${node.isCurrent ? 'text-red-400' : 'text-slate-200'}`}>{node.title}</h5>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-5.5">{node.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
