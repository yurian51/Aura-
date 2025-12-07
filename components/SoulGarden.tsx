
import React, { useEffect, useRef } from 'react';
import { Plant, MoodType, MOOD_COLORS } from '../types';

interface SoulGardenProps {
  plants: Plant[];
  mood: MoodType;
}

const SoulGarden: React.FC<SoulGardenProps> = ({ plants, mood }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const drawBranch = (
        x: number, 
        y: number, 
        length: number, 
        angle: number, 
        width: number, 
        color: string, 
        depth: number
    ) => {
        if (depth === 0) return;

        ctx.beginPath();
        ctx.moveTo(x, y);
        const endX = x + Math.sin(angle) * length;
        const endY = y - Math.cos(angle) * length;
        
        ctx.quadraticCurveTo(
            x + Math.sin(angle) * (length / 2) + (Math.random() - 0.5) * 10,
            y - Math.cos(angle) * (length / 2),
            endX,
            endY
        );
        
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Branch out
        if (depth > 1) {
            drawBranch(endX, endY, length * 0.7, angle + 0.3, width * 0.7, color, depth - 1);
            drawBranch(endX, endY, length * 0.7, angle - 0.3, width * 0.7, color, depth - 1);
        } else {
            // Draw flower/leaf at tip
            ctx.beginPath();
            ctx.arc(endX, endY, 4, 0, Math.PI * 2);
            ctx.fillStyle = MOOD_COLORS[mood] || '#fff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = ctx.fillStyle;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw base ground glow
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - 100);
        gradient.addColorStop(0, `${MOOD_COLORS[mood]}44`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

        plants.forEach(plant => {
            // Use seeded randomness based on plant ID for consistency in frame redraw
            // Simplified here: Draw procedural vine based on plant properties
            const startX = plant.x * canvas.width;
            const height = plant.height * plant.growth;
            
            // Draw Main Stem
            ctx.beginPath();
            ctx.moveTo(startX, canvas.height);
            
            // Simple sway animation
            const time = Date.now() * 0.001;
            const sway = Math.sin(time + startX) * 10;

            const endY = canvas.height - height;
            const endX = startX + sway;

            ctx.quadraticCurveTo(startX, canvas.height - height / 2, endX, endY);
            ctx.strokeStyle = `${plant.color}88`; // Semi-transparent
            ctx.lineWidth = 2 + (plant.growth * 2);
            ctx.stroke();

            // Draw glowing node at top
            if (plant.growth > 0.8) {
                ctx.beginPath();
                ctx.arc(endX, endY, 3 + Math.sin(time * 3) * 2, 0, Math.PI * 2);
                ctx.fillStyle = plant.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = plant.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });
        
        requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [plants, mood]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <canvas ref={canvasRef} className="w-full h-full" />
        <div className="absolute bottom-4 left-0 w-full text-center">
            <span className="text-[10px] uppercase tracking-[0.5em] text-white/20">Soul Garden</span>
        </div>
    </div>
  );
};

export default SoulGarden;
