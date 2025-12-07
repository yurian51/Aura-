import React, { useEffect, useState } from 'react';
import { CallState, MOOD_COLORS } from '../types';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Maximize2 } from 'lucide-react';

interface CallOverlayProps {
  callState: CallState;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}

const CallOverlay: React.FC<CallOverlayProps> = ({ callState, onEndCall, onToggleMute, onToggleVideo }) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval: number;
    if (callState.status === 'connected') {
      interval = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState.status]);

  if (!callState.isActive || !callState.contact) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const moodColor = MOOD_COLORS[callState.contact.mood];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in-up">
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${moodColor}, transparent 70%)`
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-8">
        
        {/* Contact Info */}
        <div className="text-center mb-12">
            <h2 className="text-3xl font-light tracking-wide text-white mb-2">{callState.contact.name}</h2>
            <p className="text-teal-400 text-sm uppercase tracking-widest">
                {callState.status === 'ringing' ? 'Calling...' : formatTime(duration)}
            </p>
        </div>

        {/* Avatar / Video Placeholder */}
        <div className="relative mb-20">
            {callState.type === 'video' && callState.status === 'connected' ? (
                <div className="w-64 h-80 bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
                     <img src={callState.contact.avatar} className="w-full h-full object-cover opacity-80" alt="video-feed" />
                     {/* Self view */}
                     <div className="absolute bottom-4 right-4 w-20 h-28 bg-black rounded-lg border border-white/20 overflow-hidden">
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs text-gray-500">You</div>
                     </div>
                </div>
            ) : (
                <div className="relative">
                    {/* Ripple Effect */}
                    {callState.status === 'ringing' && (
                        <>
                            <div className="absolute inset-0 rounded-full border border-white/20 animate-[ping_2s_linear_infinite]" />
                            <div className="absolute inset-0 rounded-full border border-white/10 animate-[ping_2s_linear_infinite_0.5s]" />
                        </>
                    )}
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                        <img src={callState.contact.avatar} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                </div>
            )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
            <button 
                onClick={onToggleMute}
                className={`p-4 rounded-full transition-all ${callState.isMuted ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
                {callState.isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            
            <button 
                onClick={onEndCall}
                className="p-6 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 transform hover:scale-110 transition-all"
            >
                <PhoneOff size={32} />
            </button>

            {callState.type === 'video' && (
                <button 
                    onClick={onToggleVideo}
                    className={`p-4 rounded-full transition-all ${!callState.isVideoEnabled ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    {!callState.isVideoEnabled ? <VideoOff size={24} /> : <Video size={24} />}
                </button>
            )}
            
            {callState.type === 'audio' && (
                 <button className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20">
                    <Maximize2 size={24} />
                 </button>
            )}
        </div>

      </div>
    </div>
  );
};

export default CallOverlay;