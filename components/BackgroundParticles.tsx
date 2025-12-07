import React, { useEffect, useRef } from 'react';
import { MoodType, MOOD_COLORS } from '../types';

interface BackgroundParticlesProps {
  mood: MoodType;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({ mood }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set dimensions
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Mood configs
    const getMoodConfig = () => {
      switch (mood) {
        case 'energetic':
          return { count: 3, speed: 2, decay: 0.01, size: 3, color: MOOD_COLORS.energetic };
        case 'serene':
          return { count: 1, speed: 0.5, decay: 0.005, size: 2, color: MOOD_COLORS.serene };
        case 'melancholic':
          return { count: 2, speed: 0.8, decay: 0.008, size: 2, color: MOOD_COLORS.melancholic, gravity: 0.05 };
        case 'joyful':
          return { count: 4, speed: 1.5, decay: 0.02, size: 4, color: MOOD_COLORS.joyful };
        default: // neutral
          return { count: 1, speed: 0.2, decay: 0.002, size: 1.5, color: MOOD_COLORS.neutral };
      }
    };

    const spawnParticle = (w: number, h: number) => {
      const config = getMoodConfig();
      // Energetic sparks from center, others random
      const isEnergetic = mood === 'energetic';
      
      const x = isEnergetic ? w/2 + (Math.random() - 0.5) * 50 : Math.random() * w;
      const y = isEnergetic ? h/2 + (Math.random() - 0.5) * 50 : Math.random() * h;
      
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed + (config.gravity || 0),
        size: Math.random() * config.size,
        life: 1,
        maxLife: 1,
        color: config.color
      };
    };

    // Fill initial buffer
    if (particlesRef.current.length === 0) {
        for(let i=0; i<50; i++) {
            particlesRef.current.push(spawnParticle(canvas.width, canvas.height));
        }
    }

    const animate = () => {
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const config = getMoodConfig();

      // Spawn new particles occasionally
      if (Math.random() < 0.1 * config.count) {
        particlesRef.current.push(spawnParticle(canvas.width, canvas.height));
      }

      particlesRef.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= config.decay;
        
        // Wrap around for some, die for others
        if (mood !== 'energetic') {
             if (p.x < 0) p.x = canvas.width;
             if (p.x > canvas.width) p.x = 0;
             if (p.y < 0) p.y = canvas.height;
             if (p.y > canvas.height) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.5; // Base transparency
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Remove dead particles
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [mood]);

  return (
    <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 mix-blend-screen"
    />
  );
};

export default BackgroundParticles;