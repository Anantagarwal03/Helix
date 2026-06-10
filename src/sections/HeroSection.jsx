import { useEffect, useRef, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import sixthSenseImg from '../assets/posters/sixth-sense.jpg';
import donnieDarkoImg from '../assets/posters/donnie-darko.jpg';
import zodiacImg from '../assets/posters/zodiac.jpg';
import taxiDriverImg from '../assets/posters/taxi-driver.jpg';
import oldboyImg from '../assets/posters/oldboy.jpg';

const posterAssets = [sixthSenseImg, donnieDarkoImg, zodiacImg, taxiDriverImg, oldboyImg];
const GLITCH_TEXT = "HELIX ENGINE";

// ISOLATED COMPONENT: This component handles its own state. 
// HeroSection won't re-render when this updates, keeping strips stable.
const GlitchText = memo(() => {
  const [displayText, setDisplayText] = useState(GLITCH_TEXT);

  const triggerGlitch = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => prev.split("").map((_, index) => {
        if(index < iteration) return GLITCH_TEXT[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      
      if(iteration >= GLITCH_TEXT.length) clearInterval(interval);
      // Increased speed by changing increment to 1/2
      iteration += 1 / 2; 
    }, 30);
  };

  return (
    <motion.h1 
      onHoverStart={triggerGlitch}
      className="text-5xl md:text-7xl font-serif font-bold text-white tracking-[0.3em] uppercase mb-10 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] cursor-default" 
      style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.8)' }}
      whileHover={{ letterSpacing: "0.35em", textShadow: "0px 0px 30px rgba(255,255,255,0.9)" }}
      transition={{ duration: 0.3 }}
    >
      {displayText}
    </motion.h1>
  );
});

const NetworkBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
      }
      update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx; if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy; }
      draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0, 242, 254, 0.8)'; ctx.fill(); }
    }
    for (let i = 0; i < 120; i++) particles.push(new Particle());
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${1.2 - distance / 150})`;
            ctx.lineWidth = 1.5;
            ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-80 pointer-events-none" />;
};

const HeroSection = () => {
  const baseFrames = Array.from({ length: 15 }).map((_, i) => posterAssets[i % posterAssets.length]);

  const FilmStrip = ({ rotateZ, top, left, speed, direction, zIndex, scale, opacity }) => (
    <div className="absolute flex pointer-events-none w-[200vw]" style={{ top, left, zIndex, transform: `translate(-50%, -50%) rotateZ(${rotateZ}deg) scale(${scale})`, transformStyle: 'preserve-3d', opacity }}>
      <motion.div className="flex gap-4 w-max" animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }} transition={{ repeat: Infinity, duration: speed, ease: "linear" }} style={{ padding: '4px 0', borderTop: '2px dashed rgba(255, 255, 255, 0.3)', borderBottom: '2px dashed rgba(255, 255, 255, 0.3)' }}>
        <div className="flex gap-4 pr-4">{baseFrames.map((p, i) => (<div key={i} className="w-[100px] h-[150px] overflow-hidden relative border border-white/20 rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] flex-shrink-0"><img src={p} alt="" className="w-full h-full object-cover opacity-90 sepia-[.20]" /></div>))}</div>
        <div className="flex gap-4 pr-4">{baseFrames.map((p, i) => (<div key={i} className="w-[100px] h-[150px] overflow-hidden relative border border-white/20 rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] flex-shrink-0"><img src={p} alt="" className="w-full h-full object-cover opacity-90 sepia-[.20]" /></div>))}</div>
      </motion.div>
    </div>
  );

  return (
    <div className="relative w-full h-screen bg-[#030014] overflow-hidden flex items-center justify-center m-0 p-0">
      <NetworkBackground />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030014_80%)]" />
      <FilmStrip rotateZ={-10} top="50%" left="50%" speed={120} direction="left" zIndex={1} scale={2.5} opacity={0.05} />
      <FilmStrip rotateZ={-8} top="15%" left="50%" speed={35} direction="left" zIndex={3} scale={0.85} opacity={0.7} />
      <FilmStrip rotateZ={12} top="85%" left="50%" speed={45} direction="right" zIndex={4} scale={0.9} opacity={0.8} />
      <FilmStrip rotateZ={15} top="20%" left="50%" speed={55} direction="right" zIndex={2} scale={0.65} opacity={0.5} />
      <FilmStrip rotateZ={-15} top="80%" left="50%" speed={65} direction="left" zIndex={2} scale={0.6} opacity={0.5} />

      <div className="relative z-50 flex flex-col items-center mt-[10vh]">
        <GlitchText />
        <Link to="/graph" className="group relative px-12 py-5 rounded-xl bg-black/60 backdrop-blur-md border border-white/30 text-white font-bold tracking-[0.2em] uppercase hover:bg-white/10 hover:border-[#00f2fe]/50 transition-all duration-500 overflow-hidden shadow-[0_0_30px_rgba(0,242,254,0.1)]">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#00f2fe]/0 via-[#00f2fe]/20 to-[#4facfe]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          <span className="relative z-10">Enter Labyrinth</span>
        </Link>
      </div>
    </div>
  );
};
export default HeroSection;
