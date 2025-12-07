import React, { useState } from 'react';
import { MoodType, Contact, MOOD_COLORS } from '../types';
import { Zap, Clock, Users, CloudRain, Lock, RefreshCw, X, Shield, Activity, Terminal, Code, Cpu } from 'lucide-react';

interface GodModePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateGlobalMood: (mood: MoodType) => void;
  onUnlockAllQuantum: () => void;
  onSimulateNotification: () => void;
  onUpdateAffinity: (val: number) => void;
  contacts: Contact[];
}

const GodModePanel: React.FC<GodModePanelProps> = ({ 
  isOpen, onClose, onUpdateGlobalMood, onUnlockAllQuantum, onSimulateNotification, onUpdateAffinity, contacts
}) => {
  const [activeTab, setActiveTab] = useState<'world' | 'users'>('world');

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-[#050505]/95 backdrop-blur-3xl z-[100] animate-fade-in-up flex flex-col font-mono text-amber-500">
      
      {/* Background Grid FX */}
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(251, 191, 36, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      {/* Header */}
      <div className="p-6 border-b border-amber-500/20 flex justify-between items-center bg-amber-900/10 relative z-10">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse">
                <Shield size={24} className="text-amber-500" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-amber-500 tracking-[0.2em] uppercase">God Mode</h1>
                <p className="text-[10px] text-amber-500/60 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    OMNIPOTENCE KERNEL ACTIVE
                </p>
            </div>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full border border-amber-500/30 flex items-center justify-center text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 transition-all">
            <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-amber-500/20 relative z-10 bg-[#050505]/50">
          <button 
            onClick={() => setActiveTab('world')}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'world' ? 'bg-amber-500/10 text-amber-400 border-b-2 border-amber-400' : 'text-amber-900/60 hover:text-amber-500/80'}`}
          >
              <Cpu size={14} /> World State
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'users' ? 'bg-amber-500/10 text-amber-400 border-b-2 border-amber-400' : 'text-amber-900/60 hover:text-amber-500/80'}`}
          >
              <Users size={14} /> Entities
          </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10">
          
          {activeTab === 'world' && (
              <div className="space-y-8 animate-fade-in-up">
                  {/* Weather / Mood Control */}
                  <div className="space-y-4 p-4 rounded-xl border border-amber-500/10 bg-amber-500/5">
                      <h3 className="text-xs font-bold text-amber-500/70 uppercase flex items-center gap-2 mb-4 tracking-wider">
                          <CloudRain size={14} /> Global Atmosphere
                      </h3>
                      <div className="grid grid-cols-5 gap-3">
                          {(['serene', 'joyful', 'melancholic', 'energetic', 'neutral'] as MoodType[]).map(mood => (
                              <button
                                key={mood}
                                onClick={() => onUpdateGlobalMood(mood)}
                                className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[#0a0a0a] border border-amber-500/10 hover:border-amber-500 hover:shadow-[0_0_10px_rgba(251,191,36,0.2)] transition-all group"
                              >
                                  <div className="w-3 h-3 rounded-full shadow-[0_0_5px_currentColor] transition-transform group-hover:scale-125" style={{ backgroundColor: MOOD_COLORS[mood], color: MOOD_COLORS[mood] }} />
                                  <span className="text-[8px] uppercase text-amber-500/60 group-hover:text-amber-400">{mood}</span>
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Quantum Controls */}
                  <div className="space-y-4 p-4 rounded-xl border border-amber-500/10 bg-amber-500/5">
                      <h3 className="text-xs font-bold text-amber-500/70 uppercase flex items-center gap-2 mb-2 tracking-wider">
                          <Lock size={14} /> Quantum State
                      </h3>
                      <button 
                        onClick={onUnlockAllQuantum}
                        className="w-full py-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 hover:bg-amber-500/20 hover:border-amber-500 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all flex items-center justify-center gap-2 font-bold tracking-wide"
                      >
                          <Zap size={16} /> COLLAPSE WAVEFUNCTIONS
                      </button>
                      <p className="text-[9px] text-amber-500/40 text-center uppercase">Force decrypt all locked temporal/mood messages</p>
                  </div>

                  {/* Time / Events */}
                  <div className="space-y-4 p-4 rounded-xl border border-amber-500/10 bg-amber-500/5">
                      <h3 className="text-xs font-bold text-amber-500/70 uppercase flex items-center gap-2 mb-2 tracking-wider">
                          <Clock size={14} /> Temporal Injection
                      </h3>
                      <button 
                        onClick={onSimulateNotification}
                        className="w-full py-3 bg-[#0a0a0a] border border-amber-500/20 rounded-lg text-amber-500/80 hover:text-amber-400 hover:border-amber-500/50 transition-all flex items-center justify-center gap-2 text-xs"
                      >
                          <Activity size={14} /> INJECT RANDOM EVENT
                      </button>
                  </div>
              </div>
          )}

          {activeTab === 'users' && (
              <div className="space-y-6 animate-fade-in-up">
                  {/* Global Affinity */}
                   <div className="space-y-4 p-4 rounded-xl border border-amber-500/10 bg-amber-500/5">
                      <h3 className="text-xs font-bold text-amber-500/70 uppercase flex items-center gap-2 tracking-wider">
                          <Users size={14} /> Global Affinity Modifier
                      </h3>
                      <div className="flex items-center gap-4">
                          <span className="text-xs text-amber-500/50">0.0</span>
                          <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.1" 
                            defaultValue="0.5"
                            onChange={(e) => onUpdateAffinity(parseFloat(e.target.value))}
                            className="flex-1 h-1 bg-amber-900/30 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500"
                          />
                          <span className="text-xs text-amber-500/50">1.0</span>
                      </div>
                      <p className="text-[9px] text-amber-500/40 text-center font-mono">ADJUSTS GRAVITATIONAL PULL OF ORBIT NODES</p>
                  </div>

                  {/* Entity List */}
                  <div className="space-y-2">
                      <div className="flex justify-between px-2 text-[9px] text-amber-500/30 uppercase tracking-widest border-b border-amber-500/10 pb-1">
                          <span>Entity ID</span>
                          <span>Status</span>
                      </div>
                      {contacts.map(contact => (
                          <div key={contact.id} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg border border-amber-500/10 hover:border-amber-500/40 transition-colors group">
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full border border-amber-500/20 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all">
                                      <img src={contact.avatar} className="w-full h-full" />
                                      <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay"></div>
                                  </div>
                                  <div className="flex flex-col">
                                      <span className="text-xs font-bold text-amber-500 group-hover:text-amber-300">{contact.name}</span>
                                      <span className="text-[9px] text-amber-900/60 font-mono">ID: {contact.id.padStart(8, '0')}</span>
                                  </div>
                              </div>
                              <div className="flex items-center gap-2 bg-amber-900/10 px-2 py-1 rounded border border-amber-500/5">
                                  <span className="text-[9px] text-amber-500/60 uppercase">{contact.mood}</span>
                                  <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: MOOD_COLORS[contact.mood], color: MOOD_COLORS[contact.mood] }} />
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

      </div>
      
      {/* Footer */}
      <div className="p-2 border-t border-amber-500/10 bg-[#0a0a0a] text-center">
          <p className="text-[8px] text-amber-900/40 font-mono">AURA_SYS_ADMIN_V9.0 // ROOT ACCESS GRANTED</p>
      </div>
    </div>
  );
};

export default GodModePanel;