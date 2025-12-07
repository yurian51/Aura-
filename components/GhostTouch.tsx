
import React, { useState, useEffect } from 'react';
import { MOOD_COLORS, MoodType } from '../types';

interface GhostTouchProps {
  active: boolean;
  mood: MoodType;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const GhostTouch: React.FC<GhostTouchProps> = ({ active, mood }) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [themRipples, setThemRipples] = useState<Ripple[]>([]); // Simulation of other person

  useEffect(() => {
    if (!active) return;

    // Simulate "Them" touching the screen occasionally
    const interval = setInterval(() => {
        if (Math.random() > 0.7) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const newRipple = { id: Date.now(), x, y, size: 0, opacity: 1 };
            setThemRipples(prev => [...prev, newRipple]);
        }
    }, 2000);

    return () => clearInterval(interval);
  }, [active]);

  // Animation Loop
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setRipples(prev => 
        prev.map(r => ({ ...r, size: r.size + 4, opacity: r.opacity - 0.02 }))
            .filter(r => r.opacity > 0)
      );
      setThemRipples(prev => 
        prev.map(r => ({ ...r, size: r.size + 4, opacity: r.opacity - 0.02 }))
            .filter(r => r.opacity > 0)
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleTouch = (e: React.MouseEvent | React.TouchEvent) => {
      if (!active) return;
      
      let clientX, clientY;
      if ('touches' in e) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
      } else {
          clientX = (e as React.MouseEvent).clientX;
          clientY = (e as React.MouseEvent).clientY;
      }

      const newRipple = { id: Date.now(), x: clientX, y: clientY, size: 0, opacity: 0.8 };
      setRipples(prev => [...prev, newRipple]);
  };

  if (!active) return null;

  return (
    <div 
        className="absolute inset-0 z-40 overflow-hidden"
        onMouseDown={handleTouch}
        onTouchStart={handleTouch}
    >
      {/* My Ripples */}
      {ripples.map(r => (
          <div 
            key={r.id}
            className="absolute rounded-full pointer-events-none border border-white/30"
            style={{
                left: r.x - r.size / 2,
                top: r.y - r.size / 2,
                width: r.size,
                height: r.size,
                opacity: r.opacity,
                backgroundColor: 'rgba(255,255,255,0.05)',
                boxShadow: `0 0 20px ${MOOD_COLORS[mood]}`,
            }}
          />
      ))}

      {/* Their Ripples (Simulated Ghost Touch) */}
      {themRipples.map(r => (
          <div 
            key={r.id}
            className="absolute rounded-full pointer-events-none border-2"
            style={{
                left: r.x - r.size / 2,
                top: r.y - r.size / 2,
                width: r.size,
                height: r.size,
                opacity: r.opacity,
                borderColor: MOOD_COLORS[mood], // They use their mood color
                boxShadow: `0 0 30px ${MOOD_COLORS[mood]}`,
            }}
          >
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10px] text-white/50 tracking-widest uppercase">
                 Ghost Touch
             </div>
          </div>
      ))}
    </div>
  );
};

export default GhostTouch;
