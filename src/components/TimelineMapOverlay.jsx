import { motion } from 'framer-motion'

export default function TimelineMapOverlay({ timelineData, currentNodeId, visitedPath, closeMap }) {
  // Extract all canonical nodes in order
  const getCanonicalPath = () => {
    const path = [];
    let curr = timelineData.rootNode;
    while (curr) {
      const node = timelineData.nodes[curr];
      if (node.type === 'canonical') {
        path.push(curr);
      }
      // find next canonical
      const nextChoice = node.choices?.find(c => timelineData.nodes[c.targetId].type === 'canonical');
      curr = nextChoice ? nextChoice.targetId : null;
    }
    return path;
  }

  const canonicalPath = getCanonicalPath();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-8">
      <button 
        onClick={closeMap}
        className="absolute top-8 right-8 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl border border-white/10 transition-all text-sm tracking-wide"
      >
        Close Map ✕
      </button>

      <div className="relative flex items-start justify-center gap-16 w-full max-w-6xl mt-12">
        {/* Horizontal line connecting canonical nodes */}
        <div className="absolute top-6 left-12 right-12 h-0.5 bg-white/10 -z-10" />

        {canonicalPath.map((nodeId, idx) => {
          const node = timelineData.nodes[nodeId];
          const isCurrent = nodeId === currentNodeId;
          const isVisited = visitedPath.includes(nodeId);

          // Find tangent branches from this node
          const tangentChoices = node.choices?.filter(c => timelineData.nodes[c.targetId].type === 'tangent');
          const visitedTangents = tangentChoices?.filter(c => visitedPath.includes(c.targetId));

          return (
            <div key={nodeId} className="relative flex flex-col items-center">
              {/* Canonical Node */}
              <div 
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center z-10 bg-black transition-colors ${isCurrent ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]' : isVisited ? 'border-white/60' : 'border-white/20'}`}
              >
                <div className={`w-3 h-3 rounded-full ${isCurrent ? 'bg-cyan-400' : isVisited ? 'bg-white/60' : 'bg-transparent'}`} />
              </div>
              
              <div className="mt-4 text-center w-32">
                <p className={`text-xs font-semibold ${isCurrent ? 'text-cyan-400' : 'text-white/60'}`}>{node.title}</p>
              </div>

              {/* Visited Tangent Nodes (Branched below) */}
              {visitedTangents?.map((tangent, tIdx) => {
                const tangentNode = timelineData.nodes[tangent.targetId];
                const isTangentCurrent = tangent.targetId === currentNodeId;
                
                return (
                  <div key={tangent.targetId} className="absolute top-24 flex flex-col items-center" style={{ top: `${6 + (tIdx + 1) * 6}rem` }}>
                    {/* Vertical connecting line */}
                    <div className="absolute bottom-full w-0.5 h-16 bg-red-500/40" />
                    
                    <div 
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 bg-black transition-colors ${isTangentCurrent ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'border-red-500/40'}`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${isTangentCurrent ? 'bg-red-500' : 'bg-red-500/40'}`} />
                    </div>
                    <div className="mt-3 text-center w-32">
                      <p className={`text-[10px] font-semibold tracking-wide ${isTangentCurrent ? 'text-red-500' : 'text-red-500/60'}`}>{tangentNode.title}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
