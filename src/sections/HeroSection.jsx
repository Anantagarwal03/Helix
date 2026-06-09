import { Link } from 'react-router-dom';
import helixMainImg from '../assets/helix-bg.jpg';
import sixthSenseImg from '../assets/posters/sixth-sense.jpg';
import donnieDarkoImg from '../assets/posters/donnie-darko.jpg';
import zodiacImg from '../assets/posters/zodiac.jpg';
import taxiDriverImg from '../assets/posters/taxi-driver.jpg';
import oldboyImg from '../assets/posters/oldboy.jpg';

const helixFilms = [
  { id: 1, img: sixthSenseImg },
  { id: 2, img: donnieDarkoImg },
  { id: 3, img: zodiacImg },
  { id: 4, img: taxiDriverImg },
  { id: 5, img: oldboyImg },
  { id: 6, img: sixthSenseImg },
  { id: 7, img: donnieDarkoImg },
  { id: 8, img: zodiacImg }
];

const HeroSection = () => {
  return (
    <div className="relative w-full h-screen bg-[#030014] overflow-hidden flex items-center justify-center m-0 p-0" style={{ perspective: '1200px' }}>
      
      <div className="absolute inset-0 z-0 opacity-40">
        <img 
          src={helixMainImg} 
          alt="Helix Background"
          className="w-full h-full object-cover blur-[2px]"
        />
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div 
          className="relative w-full h-full flex items-center justify-center" 
          style={{ transformStyle: 'preserve-3d', animation: 'spinHelix 25s linear infinite' }}
        >
          {helixFilms.map((film, index) => {
            const total = helixFilms.length;
            const angle = (index / total) * 360 * 1.5; 
            const yOffset = (index - total / 2) * 60; 
            const zRadius = 350; 

            return (
              <div 
                key={`${film.id}-${index}`}
                className="absolute flex items-center justify-center bg-black p-2 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                style={{
                  width: '160px',
                  height: '220px',
                  transform: `rotateY(${angle}deg) translateY(${yOffset}px) translateZ(${zRadius}px) rotateX(10deg)`,
                  backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 5px, #030014 5px, #030014 10px)',
                  backgroundSize: '10px 100%',
                  backgroundPosition: 'left, right',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <img src={film.img} alt="Film Frame" className="w-[120px] h-[200px] object-cover opacity-80" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,#030014_90%)]" />
      
      <div className="relative z-30 flex flex-col items-center mt-[40vh]">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-[#00f2fe]/40 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse" />
          <span className="text-[10px] font-mono text-[#00f2fe] tracking-[0.3em] uppercase">Engine Initialized</span>
        </div>

        <Link 
          to="/graph" 
          className="group relative px-10 py-4 rounded-xl bg-black border border-white/20 text-white font-bold tracking-[0.15em] uppercase hover:bg-white/5 transition-all duration-500 overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.3)]"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#8b5cf6]/0 via-[#8b5cf6]/20 to-[#ec4899]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          <span className="relative z-10">Enter The Labyrinth</span>
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spinHelix {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
      `}} />
    </div>
  );
};

export default HeroSection;
