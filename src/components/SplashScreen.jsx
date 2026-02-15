import React, { useEffect, useState } from 'react';

const random = (min, max) => Math.random() * (max - min) + min;

export default function SplashScreen({ onFinish }) {
  const [particles, setParticles] = useState([]);
  const [exiting, setExiting] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    let mq = null;
    try {
      mq = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
      setPrefersReduced(mq ? mq.matches : false);
      const handler = (e) => setPrefersReduced(e.matches);
      if (mq) {
        if (mq.addEventListener) mq.addEventListener('change', handler);
        else mq.addListener(handler);
      }

      // generate 48-64 particles
      const count = Math.floor(random(48, 64));
      const parts = Array.from({ length: count }).map(() => ({
        id: Math.random().toString(36).slice(2, 9),
        x: random(5, 95),
        y: random(5, 95),
        size: random(6, 18),
        rotate: random(0, 360),
        delay: random(0, 0.5),
        color: `hsl(${Math.floor(random(0, 360))} ${Math.floor(random(70, 100))}% ${Math.floor(random(45, 65))}%)`
      }));
      setParticles(parts);

      return () => {
        if (mq) {
          if (mq.removeEventListener) mq.removeEventListener('change', handler);
          else mq.removeListener(handler);
        }
      };
    } catch (err) {
      // matchMedia not available in test envs
    }
  }, []);

  useEffect(() => {
    if (exiting) {
      // after exit animation completes, notify parent
      const t = setTimeout(() => onFinish && onFinish(), prefersReduced ? 250 : 900);
      return () => clearTimeout(t);
    }
  }, [exiting, onFinish, prefersReduced]);

  const handleClose = () => {
    setExiting(true);
  };

  return (
    <div className={`fixed inset-0 z-[900] flex items-center justify-center`}>
      <div className={`absolute inset-0 ${exiting ? 'pointer-events-none' : ''}`} />

      <div className={`absolute inset-0 bg-gradient-to-b from-white/95 to-transparent backdrop-blur-sm ${exiting ? 'opacity-0 transition-opacity duration-500' : 'opacity-100'} `} />

      {/* particles */}
      <div className={`pointer-events-none w-full h-full absolute inset-0 overflow-hidden`}> 
        {particles.map((p) => (
          <span
            key={p.id}
            className={`particle ${exiting ? 'out' : 'in'}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: exiting ? 'rgba(220,220,220,0.9)' : p.color,
              transform: `translate(-50%, -50%) rotate(${p.rotate}deg)`,
              animationDelay: `${p.delay}s`,
              borderRadius: '4px'
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 max-w-md w-[92%] ${exiting ? (prefersReduced ? 'animate-fade-out' : 'animate-disintegrate-out') : (prefersReduced ? 'animate-fade-in' : 'animate-disintegrate-in')} bg-white rounded-2xl p-6 shadow-2xl border-2 border-stone-100 text-center`}> 
        <h1 className="text-5xl font-black mb-1" style={{ fontFamily: '"Bubblegum Sans", cursive', letterSpacing: '-0.5px' }}>Science Sprouts</h1>
        <p className="text-stone-500 mb-4 text-lg" style={{ fontFamily: '"Bubblegum Sans", cursive' }}>Short daily science practice to build confidence</p>
        <ul className="text-left mb-6 pl-4 text-stone-600 leading-snug text-[15px]">
          <li className="mb-1">• Quick daily practice — just a few minutes</li>
          <li className="mb-1">• Multiple choice problems with gentle feedback</li>
          <li className="mb-1">• Explore gardens, oceans, and space</li>
          <li className="mb-1">• Adjustable difficulty for your child</li>
        </ul>

        <div className="flex gap-3 justify-center">
          <button onClick={handleClose} aria-label="Start Science Sprouts" className="start-btn px-8 py-2 bg-green-500 text-white font-black rounded-2xl border-b-4 border-green-700 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-200">Start</button>
        </div>
      </div>

      <style>{`
        /* Entrance/Exit animations */
        @media (prefers-reduced-motion: reduce) {
          .animate-disintegrate-in { animation: fade-in 220ms ease-out forwards; }
          .animate-disintegrate-out { animation: fade-out 220ms ease-in forwards; }
        }

        .animate-fade-in { animation: fade-in 260ms ease-out forwards; }
        .animate-fade-out { animation: fade-out 220ms ease-in forwards; }

        @keyframes fade-in { from { opacity: 0; transform: translateY(6px) scale(0.99); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }

        /* loud colorful entrance */
        @keyframes disintegrate-in-card {
          0% { filter: blur(8px) saturate(1.2); opacity: 0; transform: scale(0.96); }
          60% { filter: blur(0px) saturate(1.05); opacity: 1; transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .animate-disintegrate-in { animation: disintegrate-in-card 700ms cubic-bezier(.2,.9,.25,1) forwards; }

        @keyframes disintegrate-out-card {
          0% { opacity: 1; filter: blur(0px); transform: scale(1); }
          100% { opacity: 0; filter: blur(8px); transform: scale(0.96) translateY(-20px); }
        }
        .animate-disintegrate-out { animation: disintegrate-out-card 600ms cubic-bezier(.4,.0,.2,1) forwards; }

        /* particles */
        .particle { position: absolute; display: block; opacity: 0; transform-origin: center; }
        .particle.in { animation: particle-in 900ms cubic-bezier(.2,.9,.25,1) forwards; }
        .particle.out { animation: particle-out 900ms cubic-bezier(.1,.6,.25,1) forwards; }

        @keyframes particle-in {
          0% { opacity: 0; transform: translate(-50%, -50%) translateY(-40px) scale(0.2) rotate(0deg); filter: drop-shadow(0 6px 12px rgba(0,0,0,0.06)); }
          60% { opacity: 1; transform: translate(-50%, -50%) translateY(6px) scale(1.05) rotate(45deg); }
          100% { opacity: 1; transform: translate(-50%, -50%) translateY(0) scale(1) rotate(0deg); }
        }

        @keyframes particle-out {
          0% { opacity: 1; transform: translate(-50%, -50%) translateY(0) scale(1) rotate(0deg); }
          100% { opacity: 0; transform: translate(-50%, -50%) translateY(-160px) scale(0.6) rotate(120deg); }
        }

        /* Start button: playful hover animation */
        .start-btn {
          transition: transform 220ms cubic-bezier(.2,.9,.25,1), box-shadow 220ms ease, filter 220ms ease;
          will-change: transform;
          transform: translateZ(0);
        }
        .start-btn:hover {
          transform: translateY(-6px) scale(1.04);
          box-shadow: 0 18px 30px rgba(16,185,129,0.18);
          filter: brightness(1.02);
        }
        .start-btn:active {
          transform: translateY(-2px) scale(0.98);
        }

        /* reduced motion fallback: reduce to fades and disable hover transforms */
        @media (prefers-reduced-motion: reduce) {
          .particle.in, .particle.out { animation: fade-in 220ms ease-out forwards; }
          .start-btn, .start-btn:hover, .start-btn:active { transform: none !important; box-shadow: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}
