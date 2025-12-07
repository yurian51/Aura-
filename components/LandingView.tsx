
import React from 'react';
import BackgroundParticles from './BackgroundParticles';

interface LandingViewProps {
    onStart: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
    return (
        <div className="w-full h-screen relative bg-black flex flex-col items-center justify-center overflow-hidden text-white">
            <BackgroundParticles mood="neutral" />
            
            <div className="z-20 flex flex-col items-center text-center animate-fade-in-up px-6">
                <div className="mb-8 relative">
                    <div className="w-24 h-24 rounded-full border border-teal-500/30 flex items-center justify-center relative z-10 bg-black/50 backdrop-blur-md">
                        <div className="w-16 h-16 rounded-full bg-teal-500/10 animate-pulse flex items-center justify-center">
                            <div className="w-4 h-4 bg-teal-400 rounded-full shadow-[0_0_20px_currentColor]" />
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-teal-500/20 blur-3xl rounded-full" />
                </div>

                <h1 className="text-5xl md:text-7xl font-serif font-light tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-purple-200 mb-6">
                    AURA
                </h1>

                <p className="text-lg md:text-xl font-light text-white/60 max-w-md mb-12 leading-relaxed">
                    The digital sanctuary for meaningful connection. <br/>
                    <span className="text-teal-400 text-sm tracking-widest uppercase mt-2 block">Connect • Resonate • Flow</span>
                </p>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <button 
                        onClick={onStart}
                        className="w-full py-4 bg-white text-black font-bold text-sm tracking-widest uppercase rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        Enter Sanctuary
                    </button>
                    <div className="flex items-center gap-4 text-xs text-white/30 uppercase tracking-widest justify-center mt-4">
                        <span>Secure</span> • <span>Private</span> • <span>Ethereal</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 text-[10px] text-white/20 uppercase tracking-[0.3em]">
                v2.0 • System Online
            </div>
        </div>
    );
};

export default LandingView;
