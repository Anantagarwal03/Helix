import { useEffect, useRef, useState, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import * as THREE from 'three'
import SpriteText from 'three-spritetext'
import { INITIAL_GRAPH_DATA } from '../data/storyGraphs.js'

const NODE_COLOR = {
  film: '#fbbf24',
  character: '#00f2fe',
  event: '#8b5cf6',
  twist: '#ec4899',
}

const nodeColor = node => NODE_COLOR[node.type] || '#ffffff'

const buildNodeObject = node => {
  const color = nodeColor(node)
  const radius = node.size || 4
  const group = new THREE.Group()

  const coreMat = new THREE.MeshPhongMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(color),
    emissiveIntensity: node.type === 'twist' ? 1.6 : 1.1,
    shininess: 120,
    transparent: true,
    opacity: 0.92,
  })
  group.add(new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 20), coreMat))

  const haloMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: node.type === 'film' ? 0.12 : 0.07,
    side: THREE.BackSide,
  })
  group.add(new THREE.Mesh(new THREE.SphereGeometry(radius * 2.6, 12, 12), haloMat))

  if (node.type === 'film') {
    const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity: 0.28 })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius * 2, 0.5, 8, 32), ringMat)
    ring.rotation.x = Math.PI / 2
    group.add(ring)
  }

  const sprite = new SpriteText(node.graphLabel || node.label)
  sprite.color = '#ffffff'
  sprite.textHeight = node.type === 'film' ? 14 : 11
  sprite.fontFamily = 'Inter, system-ui, sans-serif'
  sprite.fontWeight = node.type === 'film' || node.type === 'twist' ? '600' : '500'
  sprite.backgroundColor = 'rgba(3,0,20,0.76)'
  sprite.borderColor = color + (node.type === 'film' || node.type === 'twist' ? '70' : '45')
  sprite.borderWidth = 0.8
  sprite.borderRadius = 5
  sprite.padding = [3, 7]
  sprite.position.y = radius * 2 + 9
  group.add(sprite)

  return group
}

const linkColor = link => {
  if (link.isBridge) return 'rgba(255,255,255,0.07)'
  const c = {
    'sixth-sense': 'rgba(0,242,254,0.38)',
    'donnie-darko': 'rgba(139,92,246,0.38)',
    zodiac: 'rgba(236,72,153,0.38)',
    'taxi-driver': 'rgba(251,146,60,0.38)',
    oldboy: 'rgba(217,70,239,0.38)',
  }
  return c[link.film] || 'rgba(255,255,255,0.42)'
}

const particleColor = link => {
  if (link.isBridge) return 'rgba(255,255,255,0.2)'
  const c = { 'sixth-sense': '#00f2fe', 'donnie-darko': '#8b5cf6', 'zodiac': '#ec4899' }
  return c[link.film] || '#ffffff'
}

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]))

const linkLabel = link => {
  const source = typeof link.source === 'object' ? link.source.label : link.source;
  const target = typeof link.target === 'object' ? link.target.label : link.target;
  const relationship = escapeHtml(link.relationship || 'connects to');
  const explanation = escapeHtml(link.explanation || 'This connection has not been explained yet.');
  return `<div style="font-family:Inter,system-ui,sans-serif;max-width:280px;padding:10px 12px;background:rgba(3,0,20,.96);border:1px solid rgba(139,92,246,.55);border-radius:10px;color:#fff;box-shadow:0 8px 28px rgba(0,0,0,.7)">
    <div style="font-size:11px;font-weight:700;color:#c4b5fd;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px">${relationship}</div>
    <div style="font-size:12px;font-weight:600;margin-bottom:5px">${escapeHtml(source)} → ${escapeHtml(target)}</div>
    <div style="font-size:11px;line-height:1.45;color:#cbd5e1">${explanation}</div>
    <div style="font-size:9px;color:#64748b;margin-top:7px">Click for story details</div>
  </div>`;
}

const nodeLabel = node => {
  const color = NODE_COLOR[node.type] || '#fff'
  const canClick = node.type !== 'film'
  return `<div style="font-family:Inter,sans-serif;font-size:12px;color:#fff;background:rgba(3,0,20,0.92);border:1px solid ${color}28;border-radius:10px;padding:8px 12px;max-width:210px;box-shadow:0 4px 24px rgba(0,0,0,0.65)">
    <div style="font-weight:600;margin-bottom:3px">${node.label}</div>
    <div style="color:#475569;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:${canClick ? '6px' : '0'}">${node.type}${node.filmName ? ' · ' + node.filmName : ''}</div>
    ${canClick ? `<div style="color:${color};font-size:10px;font-family:monospace;opacity:0.7">Click to reveal ↗</div>` : ''}
  </div>`
}

const TwistGraph3D = forwardRef((props, ref) => {
  const { 
    graphData,
    onMount, 
    onNodeClick: onNodeClickProp, 
    initialNode 
  } = props;
  const wrapperRef = useRef(null)
  const graphRef = useRef(null)
  const [dims, setDims] = useState({ w: 800, h: 600 })
  const [ready, setReady] = useState(false)
  const [internalGraphData, setInternalGraphData] = useState(graphData || INITIAL_GRAPH_DATA);
  const [isMaximized, setIsMaximized] = useState(false);

  useImperativeHandle(ref, () => ({
    cameraPosition: (pos, target, time) => graphRef.current?.cameraPosition(pos, target, time),
    zoomToFit: (time) => graphRef.current?.zoomToFit(time),
    scene: () => graphRef.current?.scene()
  }));

  const toggleFullscreen = () => {
    setIsMaximized(prev => !prev);
  };

  const handleZoomIn = () => {
    zoomBy(0.78);
  };

  const handleZoomOut = () => {
    zoomBy(1.28);
  };

  const zoomBy = factor => {
    const graph = graphRef.current;
    if (!graph) return;
    const current = graph.cameraPosition();
    if (!current) return;
    const target = graph.controls()?.target || { x: 0, y: 0, z: 0 };
    const offset = { x: current.x - target.x, y: current.y - target.y, z: current.z - target.z };
    const distance = Math.hypot(offset.x, offset.y, offset.z);
    if (!distance) return;
    const nextDistance = Math.max(35, Math.min(1400, distance * factor));
    const scale = nextDistance / distance;
    graph.cameraPosition({
      x: target.x + offset.x * scale,
      y: target.y + offset.y * scale,
      z: target.z + offset.z * scale,
    }, target, 250);
  };

  const frameGraph = (nodes = internalGraphData.nodes, duration = 500) => {
    const graph = graphRef.current;
    const positionedNodes = nodes?.filter(node =>
      Number.isFinite(node.x) && Number.isFinite(node.y) && Number.isFinite(node.z));
    if (!graph || !positionedNodes?.length) return;

    const bounds = positionedNodes.reduce((result, node) => ({
      minX: Math.min(result.minX, node.x), maxX: Math.max(result.maxX, node.x),
      minY: Math.min(result.minY, node.y), maxY: Math.max(result.maxY, node.y),
      minZ: Math.min(result.minZ, node.z), maxZ: Math.max(result.maxZ, node.z),
      labelWidth: Math.max(result.labelWidth, ((node.graphLabel || node.label)?.length || 0) * 5.5),
    }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: Infinity, maxZ: -Infinity, labelWidth: 0 });
    const center = {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2,
      z: (bounds.minZ + bounds.maxZ) / 2,
    };
    const camera = graph.camera();
    const halfFov = THREE.MathUtils.degToRad((camera?.fov || 60) / 2);
    const tanHalfFov = Math.tan(halfFov);
    const aspect = Math.max(0.5, dims.w / Math.max(1, dims.h));
    const width = bounds.maxX - bounds.minX + bounds.labelWidth + 36;
    const height = bounds.maxY - bounds.minY + 90;
    const depth = bounds.maxZ - bounds.minZ + 40;
    const distance = Math.max(
      width / (2 * tanHalfFov * aspect * 0.82),
      height / (2 * tanHalfFov * 0.82),
      depth * 1.6,
      70,
    );

    graph.cameraPosition({ x: center.x, y: center.y, z: center.z + distance }, center, duration);
  };

  useEffect(() => {
    // Let DOM finalize structural adjustments before re-centering
    const timer = setTimeout(() => {
      if (graphRef.current) {
        graphRef.current.resizeHandler();
        frameGraph(internalGraphData.nodes, 600);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isMaximized]);

  useEffect(() => {
    setInternalGraphData(graphData || INITIAL_GRAPH_DATA);
    const timer = setTimeout(() => {
      graphRef.current?.d3ReheatSimulation();
      frameGraph(graphData?.nodes || INITIAL_GRAPH_DATA.nodes, 500);
    }, 50);
    return () => clearTimeout(timer);
  }, [graphData]);

  useEffect(() => {
    const timer = setTimeout(() => frameGraph(internalGraphData.nodes, 350), 80);
    return () => clearTimeout(timer);
  }, [dims, isMaximized]);


  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      setDims({ w: Math.floor(e.contentRect.width), h: Math.floor(e.contentRect.height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const handleEngineStop = useCallback(() => {
    if (!graphRef.current || ready) return
    const scene = graphRef.current.scene()
    scene.add(new THREE.AmbientLight(0x1a0033, 2.5))
    const cl = new THREE.PointLight(0x00f2fe, 2.5, 200); cl.position.set(60, 80, 60); scene.add(cl)
    const vl = new THREE.PointLight(0x7c3aed, 2.0, 200); vl.position.set(-80, -40, -60); scene.add(vl)
    const pl = new THREE.PointLight(0xec4899, 1.5, 160); pl.position.set(0, -80, 80); scene.add(pl)
    setReady(true)
    if (onMount) onMount()
  }, [ready, onMount])

  useEffect(() => {
    if (ready && initialNode && graphRef.current) {
      setTimeout(() => {
        const node = internalGraphData.nodes.find(n => n.id === initialNode)
        if (node) {
          const dist = node.type === 'twist' ? 45 : 60
          graphRef.current.cameraPosition(
            { x: node.x + dist, y: node.y + dist / 2, z: node.z + dist },
            { x: node.x, y: node.y, z: node.z },
            1200
          )
          if (onNodeClickProp) onNodeClickProp(node)
        }
      }, 500)
    }
  }, [ready, initialNode, onNodeClickProp])

  const pan = useCallback((direction) => {
    if (!graphRef.current) return
    const cam = graphRef.current.cameraPosition()
    const controls = graphRef.current.controls()
    const target = controls ? controls.target : { x: 0, y: 0, z: 0 }
    const step = 20
    const delta = direction === 'left' ? -step : step
    graphRef.current.cameraPosition(
      { x: cam.x + delta, y: cam.y, z: cam.z },
      { x: target.x + delta, y: target.y, z: target.z },
      200
    )
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        pan('left')
      } else if (e.key === 'ArrowRight') {
        pan('right')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [pan])

  return (
    <div ref={wrapperRef} className={isMaximized ? "fixed inset-0 w-screen h-screen z-50 bg-[#030014]" : "relative w-full h-full"}>
      
      {/* Viewport Controls */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        <button 
          onClick={handleZoomIn}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          title="Zoom In"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          title="Zoom Out"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button 
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          title="Toggle Fullscreen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMaximized ? (
              <>
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
              </>
            ) : (
              <>
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </>
            )}
          </svg>
        </button>
      </div>
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-cyan-400/30 border-t-cyan-400"
              style={{ animation: 'spin 1s linear infinite' }} />
            <span className="text-[11px] font-mono text-slate-600">Initializing graph engine…</span>
          </div>
        </div>
      )}



      <ForceGraph3D
        ref={graphRef}
        width={dims.w}
        height={dims.h}
        graphData={internalGraphData}
        backgroundColor="rgba(0,0,0,0)"
        nodeLabel={nodeLabel}
        nodeColor={nodeColor}
        nodeRelSize={1}
        nodeThreeObject={buildNodeObject}
        nodeThreeObjectExtend={false}
        linkLabel={linkLabel}
        linkColor={linkColor}
        linkOpacity={1}
        linkWidth={link => link.isBridge ? 0.5 : 2.6}
        linkHoverPrecision={6}
        linkDirectionalParticles={link => link.isBridge ? 0 : 1}
        linkDirectionalParticleWidth={1.2}
        linkDirectionalParticleSpeed={0.004}
        linkDirectionalParticleColor={particleColor}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.25}
        warmupTicks={120}
        cooldownTicks={0}
        onEngineStop={handleEngineStop}
        onNodeHover={node => { if (wrapperRef.current) wrapperRef.current.style.cursor = node ? 'pointer' : 'grab' }}
        onNodeClick={node => {
          const dist = node.type === 'twist' ? 45 : 60
          graphRef.current?.cameraPosition(
            { x: node.x + dist, y: node.y + dist / 2, z: node.z + dist },
            { x: node.x, y: node.y, z: node.z },
            800,
          )
          if (onNodeClickProp) onNodeClickProp(node)
        }}
        onLinkClick={link => props.onLinkClick?.(link)}
        rendererConfig={{ antialias: true, alpha: true }}
        showNavInfo={false}
      />
    </div>
  );
});

export default TwistGraph3D;
