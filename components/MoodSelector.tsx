import React from 'react';
import { MoodType, MOOD_COLORS, MOOD_DESCRIPTIONS } from '../types';
import { Sparkles, Cloud, Sun, Zap, Coffee } from 'lucide-react';

interface MoodSelectorProps {
  currentMood: MoodType;
  onSelect: (mood: MoodType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ currentMood, onSelect, isOpen, onClose }) => {
  if (!isOpen) return null;

  const moods: { type: MoodType; icon: React.ReactNode }[] = [
    { type: 'serene', icon: <Sparkles size={20} /> },
    { type: 'joyful', icon: <Sun size={20} /> },
    { type: 'melancholic', icon: <Cloud size={20} /> },
    { type: 'energetic', icon: <Zap size={20} /> },
    { type: 'neutral', icon: <Coffee size={20} /> },
  ];

  return (
    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4 z-50">
      <div className="glass-panel rounded-2xl p-4 shadow-2xl animate-fade-in-up">
        <h3 className="text-center text-sm font-light text-gray-400 mb-4">Set your Aura</h3>
        <div className="flex justify-between items-center gap-2">
          {moods.map((m) => (
            <button
              key={m.type}
              onClick={() => {
                onSelect(m.type);
                onClose();
              }}
              className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-300 hover:bg-white/5 ${
                currentMood === m.type ? 'scale-110 bg-white/10' : 'opacity-60 scale-90'
              }`}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500"
                style={{ 
                  backgroundColor: currentMood === m.type ? MOOD_COLORS[m.type] : 'transparent',
                  border: `1px solid ${MOOD_COLORS[m.type]}`,
                  color: currentMood === m.type ? '#000' : MOOD_COLORS[m.type]
                }}
              >
                {m.icon}
              </div>
              <span className="text-[10px] uppercase tracking-wider">{m.type}</span>
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 mt-4 italic">
          "{MOOD_DESCRIPTIONS[currentMood]}"
        </p>
      </div>
    </div>
  );
};

export default MoodSelector;