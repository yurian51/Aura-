import React from 'react';
import { Artifact, MOOD_COLORS } from '../types';
import { Grid, Quote } from 'lucide-react';

interface ArtifactsViewProps {
  artifacts: Artifact[];
}

const ArtifactsView: React.FC<ArtifactsViewProps> = ({ artifacts }) => {
  return (
    <div className="w-full h-full overflow-y-auto p-6 pb-24">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-light tracking-[0.2em] text-white/80">ARTIFACTS</h2>
        <Grid size={20} className="text-white/30" />
      </div>

      {artifacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-white/20">
            <Quote size={48} className="mb-4 opacity-50" />
            <p className="font-light">No crystallized memories yet.</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {artifacts.map((artifact) => (
            <div 
                key={artifact.id}
                className="break-inside-avoid glass-panel rounded-xl p-6 hover:bg-white/5 transition-colors group cursor-pointer border-t border-white/10"
                style={{ borderTopColor: MOOD_COLORS[artifact.mood] }}
            >
                <div className="mb-3 flex justify-between items-start">
                    <span 
                        className="text-[10px] uppercase tracking-widest opacity-60" 
                        style={{ color: MOOD_COLORS[artifact.mood] }}
                    >
                        {artifact.poeticTag}
                    </span>
                    <Quote size={12} className="text-white/20" />
                </div>
                
                <p className="text-lg font-serif italic leading-relaxed text-white/90 mb-4">
                    "{artifact.text}"
                </p>

                <div className="flex justify-between items-end border-t border-white/5 pt-3">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-white/60">{artifact.senderName}</span>
                        <span className="text-[10px] text-white/30">
                            {new Date(artifact.timestamp).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtifactsView;