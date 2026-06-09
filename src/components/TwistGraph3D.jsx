import { useEffect, useRef, useState, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import * as THREE from 'three'
import SpriteText from 'three-spritetext'

const NODE_COLOR = {
  film: '#fbbf24',
  character: '#00f2fe',
  event: '#8b5cf6',
  twist: '#ec4899',
}

export const INITIAL_GRAPH_DATA = {
  nodes: [
    // --- THE SIXTH SENSE ---
    { id: 'sixth-sense', label: 'The Sixth Sense', type: 'film', size: 9, revealText: 'Not every gift is a blessing.', revealSubtext: 'Every clue was hidden in plain sight across 107 minutes.', revealClassification: 'Film Hub' },
    { id: 'ss-malcolm', label: 'Dr. Malcolm Crowe', type: 'character', size: 5.5, revealText: 'The Unwitting Ghost', revealSubtext: 'He spends the film trying to help Cole, completely unaware that he died in the opening scene.', revealClassification: 'Character' },
    { id: 'ss-cole', label: 'Cole Sear', type: 'character', size: 5.5, revealText: 'The Living Medium', revealSubtext: 'He confesses, "I see dead people," which bridges his world with Malcolms.', revealClassification: 'Character' },
    { id: 'ss-shooting', label: 'The Opening Gunshot', type: 'event', size: 4.5, revealText: 'The Inciting Tragic Event', revealSubtext: 'A former patient shoots Malcolm. This event marks the true death of the doctor.', revealClassification: 'Event' },
    { id: 'ss-twist', label: 'Malcolm is Dead', type: 'twist', size: 8, revealText: 'Identity Reveal Twist', revealSubtext: 'The dropped wedding ring confirms Malcolm has been a ghost the entire time; nobody except Cole ever interacts with him.', revealClassification: 'Core Twist' },

    // --- DONNIE DARKO ---
    { id: 'donnie-darko', label: 'Donnie Darko', type: 'film', size: 9, revealText: '28 days, 6 hours, 42 minutes, 12 seconds.', revealSubtext: 'The countdown to the absolute collapse of reality.', revealClassification: 'Film Hub' },
    { id: 'dd-donnie', label: 'Donnie Darko', type: 'character', size: 5.5, revealText: 'The Living Receiver', revealSubtext: 'Granted temporal powers to guide an artifact out of a collapsing, unstable timeline.', revealClassification: 'Character' },
    { id: 'dd-frank', label: 'Frank the Rabbit', type: 'character', size: 5.5, revealText: 'The Manipulated Dead', revealSubtext: 'A specter from the future who coordinates Donnies actions to fix the universe.', revealClassification: 'Character' },
    { id: 'dd-engine', label: 'Jet Engine Crash', type: 'event', size: 4.5, revealText: 'The Temporal Fracture Event', revealSubtext: 'An artifact falls from an unknown sky, ripping open a dangerous Tangent Universe.', revealClassification: 'Event' },
    { id: 'dd-twist', label: 'Tangent Universe Collapse', type: 'twist', size: 8, revealText: 'Sacrificial Loop Twist', revealSubtext: 'Donnie realizes he must stay in bed and let the engine crush him to save the primary universe and his family.', revealClassification: 'Core Twist' },

    // --- ZODIAC ---
    { id: 'zodiac', label: 'Zodiac', type: 'film', size: 9, revealText: 'This is the Zodiac speaking.', revealSubtext: 'A cold case mystery that slowly consumes everyone who investigates it.', revealClassification: 'Film Hub' },
    { id: 'z-robert', label: 'Robert Graysmith', type: 'character', size: 5.5, revealText: 'The Obsessed Cartoonist', revealSubtext: 'His obsession with codes outlasts the official police investigation, costing him his marriage.', revealClassification: 'Character' },
    { id: 'z-allen', label: 'Arthur Leigh Allen', type: 'character', size: 5.5, revealText: 'The Prime Suspect', revealSubtext: 'Circumstantial evidence matches perfectly, but lack of physical proof and DNA clears him.', revealClassification: 'Character' },
    { id: 'z-cipher', label: 'The San Francisco Ciphers', type: 'event', size: 4.5, revealText: 'The Taunting Letters', revealSubtext: 'The killer sends cryptic symbols to newspapers, forcing the public into panic.', revealClassification: 'Event' },
    { id: 'z-twist', label: 'Unresolvable Mystery', type: 'twist', size: 8, revealText: 'The Anticlimactic Reality Twist', revealSubtext: 'The true horror is that despite decades of investigation, the case remains officially unsolved and open.', revealClassification: 'Core Twist' },

    // --- TAXI DRIVER ---
    { id: 'taxi-driver', label: 'Taxi Driver', type: 'film', size: 9, revealText: 'You talkin to me?', revealSubtext: 'A psychological descent into night-shrouded urban isolation.', revealClassification: 'Film Hub' },
    { id: 'td-travis', label: 'Travis Bickle', type: 'character', size: 5.5, revealText: 'The Isolated Veteran', revealSubtext: 'An insomniac ex-Marine whose loneliness morphs into dangerous, erratic vigilantism.', revealClassification: 'Character' },
    { id: 'td-iris', label: 'Iris Steensma', type: 'character', size: 5.5, revealText: 'The Captive Runaway', revealSubtext: 'A twelve-year-old girl trapped in a seedy underworld whom Travis vows to save.', revealClassification: 'Character' },
    { id: 'td-diner', label: 'The Diner Meeting', type: 'event', size: 4.5, revealText: 'The Social Breakdown Event', revealSubtext: 'Travis seeks advice from fellow drivers, but his inability to connect isolates him further.', revealClassification: 'Event' },
    { id: 'td-twist', label: 'The Accidental Hero', type: 'twist', size: 8, revealText: 'Perception Distortion Twist', revealSubtext: 'Travis carries out a bloody shootout, but instead of being jailed, the media ironically praises him as a heroic citizen.', revealClassification: 'Core Twist' },

    // --- OLDBOY ---
    { id: 'oldboy', label: 'Oldboy', type: 'film', size: 9, revealText: 'Laugh, and the world laughs with you.', revealSubtext: 'A masterpiece tracking carefully calculated vengeance.', revealClassification: 'Film Hub' },
    { id: 'ob-daesu', label: 'Oh Dae-su', type: 'character', size: 5.5, revealText: 'The Imprisoned Captive', revealSubtext: 'Abducted on his daughters birthday, he spend 15 years in a single room training for revenge.', revealClassification: 'Character' },
    { id: 'ob-woojin', label: 'Lee Woo-jin', type: 'character', size: 5.5, revealText: 'The Cruel Mastermind', revealSubtext: 'The wealthy captor who orchestrates the entire puzzle to inflict psychological torture.', revealClassification: 'Character' },
    { id: 'ob-miha', label: 'Mi-do', type: 'character', size: 5.5, revealText: 'The Supportive Chef', revealSubtext: 'A young chef who assists Dae-su on his journey, falling deeply in love with him.', revealClassification: 'Character' },
    { id: 'ob-twist', label: 'The Incestuous Trap', type: 'twist', size: 8, revealText: 'Tragic Reveal Twist', revealSubtext: 'Woo-jin reveals through a hidden album that Mi-do is actually Dae-sus biological daughter, completing his revenge.', revealClassification: 'Core Twist' }
  ],
  links: [
    // Sixth Sense Connections
    { source: 'sixth-sense', target: 'ss-malcolm', film: 'sixth-sense' },
    { source: 'sixth-sense', target: 'ss-cole', film: 'sixth-sense' },
    { source: 'ss-malcolm', target: 'ss-shooting', film: 'sixth-sense' },
    { source: 'ss-cole', target: 'ss-twist', film: 'sixth-sense' },
    { source: 'ss-malcolm', target: 'ss-twist', film: 'sixth-sense' },

    // Donnie Darko Connections
    { source: 'donnie-darko', target: 'dd-donnie', film: 'donnie-darko' },
    { source: 'donnie-darko', target: 'dd-frank', film: 'donnie-darko' },
    { source: 'dd-donnie', target: 'dd-engine', film: 'donnie-darko' },
    { source: 'dd-frank', target: 'dd-twist', film: 'donnie-darko' },
    { source: 'dd-donnie', target: 'dd-twist', film: 'donnie-darko' },

    // Zodiac Connections
    { source: 'zodiac', target: 'z-robert', film: 'zodiac' },
    { source: 'zodiac', target: 'z-allen', film: 'zodiac' },
    { source: 'z-robert', target: 'z-cipher', film: 'zodiac' },
    { source: 'z-cipher', target: 'z-twist', film: 'zodiac' },
    { source: 'z-allen', target: 'z-twist', film: 'zodiac' },

    // Taxi Driver Connections
    { source: 'taxi-driver', target: 'td-travis', film: 'taxi-driver' },
    { source: 'taxi-driver', target: 'td-iris', film: 'taxi-driver' },
    { source: 'td-travis', target: 'td-diner', film: 'taxi-driver' },
    { source: 'td-diner', target: 'td-twist', film: 'taxi-driver' },
    { source: 'td-iris', target: 'td-twist', film: 'taxi-driver' },

    // Oldboy Connections
    { source: 'oldboy', target: 'ob-daesu', film: 'oldboy' },
    { source: 'oldboy', target: 'ob-woojin', film: 'oldboy' },
    { source: 'ob-daesu', target: 'ob-miha', film: 'oldboy' },
    { source: 'ob-miha', target: 'ob-twist', film: 'oldboy' },
    { source: 'ob-woojin', target: 'ob-twist', film: 'oldboy' },

    // Inter-Film Cinematic Hub Bridges
    { source: 'sixth-sense', target: 'donnie-darko', isBridge: true },
    { source: 'donnie-darko', target: 'zodiac', isBridge: true },
    { source: 'zodiac', target: 'taxi-driver', isBridge: true },
    { source: 'taxi-driver', target: 'oldboy', isBridge: true },
    { source: 'oldboy', target: 'sixth-sense', isBridge: true }
  ]
};

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

    const sprite = new SpriteText(node.label)
    sprite.color = '#ffffff'
    sprite.textHeight = 2.8
    sprite.fontFamily = 'Inter, system-ui, sans-serif'
    sprite.fontWeight = '600'
    sprite.backgroundColor = 'rgba(3,0,20,0.72)'
    sprite.borderColor = color + '55'
    sprite.borderWidth = 0.6
    sprite.borderRadius = 4
    sprite.padding = [2, 5]
    sprite.position.y = radius * 3.2 + 6
    group.add(sprite)
  }

  return group
}

const linkColor = link => {
  if (link.isBridge) return 'rgba(255,255,255,0.07)'
  const c = { 'sixth-sense': 'rgba(0,242,254,0.28)', 'donnie-darko': 'rgba(139,92,246,0.28)', 'zodiac': 'rgba(236,72,153,0.28)' }
  return c[link.film] || 'rgba(255,255,255,0.15)'
}

const particleColor = link => {
  if (link.isBridge) return 'rgba(255,255,255,0.2)'
  const c = { 'sixth-sense': '#00f2fe', 'donnie-darko': '#8b5cf6', 'zodiac': '#ec4899' }
  return c[link.film] || '#ffffff'
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
    movies = [], 
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
    const camera = graphRef.current?.camera();
    if (camera) {
      camera.position.z *= 0.8; // Move camera closer along focal plane
    }
  };

  const handleZoomOut = () => {
    const camera = graphRef.current?.camera();
    if (camera) {
      camera.position.z *= 1.25; // Pull camera back out
    }
  };

  useEffect(() => {
    // Let DOM finalize structural adjustments before re-centering
    const timer = setTimeout(() => {
      if (graphRef.current) {
        graphRef.current.resizeHandler();
        graphRef.current.zoomToFit(600, 80);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isMaximized]);

  useEffect(() => {
    setInternalGraphData(INITIAL_GRAPH_DATA);
    graphRef.current?.d3ReheatSimulation();
  }, [movies]);


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
    graphRef.current.cameraPosition({ x: 0, y: 0, z: 340 }, { x: 0, y: 0, z: 0 }, 1200)
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
        linkColor={linkColor}
        linkOpacity={1}
        linkWidth={link => link.isBridge ? 0.3 : 0.6}
        linkDirectionalParticles={link => link.isBridge ? 0 : 3}
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
        rendererConfig={{ antialias: true, alpha: true }}
        showNavInfo={false}
      />
    </div>
  );
});

export default TwistGraph3D;
