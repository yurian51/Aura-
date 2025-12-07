import React from 'react';
import { ArrowLeft, TrendingUp, Users, DollarSign, Video, Gift, Globe, BarChart2, MessageSquare, PlayCircle, Zap, Award, BookOpen, Target, ChevronRight } from 'lucide-react';
import { UserSettings } from '../types';

interface AuraStudioProps {
  onBack: () => void;
  settings: UserSettings;
}

const AuraStudio: React.FC<AuraStudioProps> = ({ onBack, settings }) => {
  return (
    <div className="w-full h-full bg-[#121212] flex flex-col text-white overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-white/5 bg-[#121212] sticky top-0 z-20">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-base font-bold">Aura Studio</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        {/* Creator Hero */}
        <div className="p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border border-white/10 overflow-hidden">
                <img src={settings.avatar} className="w-full h-full object-cover" />
            </div>
            <div>
                <h2 className="text-xl font-bold">{settings.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                    <button className="text-xs bg-white/10 px-3 py-1 rounded-full font-medium hover:bg-white/20 transition-colors">
                        Check Analytics
                    </button>
                </div>
            </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="px-4 mb-8">
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#1e1e1e] p-3 rounded-lg flex flex-col items-center text-center">
                    <span className="text-xs text-gray-400 mb-1">Total Views</span>
                    <span className="text-lg font-bold">12.5K</span>
                    <span className="text-[10px] text-green-400 flex items-center gap-0.5 mt-1">
                        <TrendingUp size={8} /> +12%
                    </span>
                </div>
                 <div className="bg-[#1e1e1e] p-3 rounded-lg flex flex-col items-center text-center">
                    <span className="text-xs text-gray-400 mb-1">Net Followers</span>
                    <span className="text-lg font-bold">+840</span>
                    <span className="text-[10px] text-green-400 flex items-center gap-0.5 mt-1">
                        <Users size={8} /> +5%
                    </span>
                </div>
                 <div className="bg-[#1e1e1e] p-3 rounded-lg flex flex-col items-center text-center">
                    <span className="text-xs text-gray-400 mb-1">Likes</span>
                    <span className="text-lg font-bold">45.2K</span>
                     <span className="text-[10px] text-gray-500 mt-1">
                        Last 7 days
                    </span>
                </div>
            </div>
        </div>

        {/* Analytics Chart Preview */}
        <div className="px-4 mb-8">
             <div className="bg-[#1e1e1e] rounded-xl p-4">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="text-sm font-bold flex items-center gap-2">
                         <BarChart2 size={16} className="text-teal-400" /> Engagement Overview
                     </h3>
                     <ChevronRight size={16} className="text-gray-500" />
                 </div>
                 <div className="h-24 flex items-end gap-2 px-2">
                     {[30, 45, 20, 60, 50, 80, 65].map((h, i) => (
                         <div key={i} className="flex-1 bg-white/5 hover:bg-teal-500/50 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                             <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                 {h * 10}
                             </div>
                         </div>
                     ))}
                 </div>
                 <div className="flex justify-between text-[10px] text-gray-500 mt-2 px-1">
                     <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                 </div>
             </div>
        </div>

        {/* Monetization Section */}
        <div className="px-4 mb-2">
            <h3 className="text-sm font-bold text-gray-400 mb-3 px-1 uppercase tracking-wider">Monetization</h3>
        </div>
        <div className="px-4 mb-8 grid grid-cols-2 gap-3">
             <ToolCard icon={<Gift size={20} />} title="Video Gifts" subtitle="Active" color="text-pink-500" bg="bg-pink-500/10" />
             <ToolCard icon={<DollarSign size={20} />} title="Marketplace" subtitle="Join" color="text-green-500" bg="bg-green-500/10" />
             <ToolCard icon={<Award size={20} />} title="Series" subtitle="Get Paid" color="text-amber-500" bg="bg-amber-500/10" />
             <ToolCard icon={<Zap size={20} />} title="Pulse Pulse" subtitle="Ad Revenue" color="text-blue-500" bg="bg-blue-500/10" />
        </div>

        {/* Tools Section */}
        <div className="px-4 mb-2">
            <h3 className="text-sm font-bold text-gray-400 mb-3 px-1 uppercase tracking-wider">Tools & Resources</h3>
        </div>
        <div className="px-4 space-y-1">
            <ListItem icon={<Target size={18} />} title="Promote" subtitle="Grow your audience" />
            <ListItem icon={<Video size={18} />} title="Live Center" subtitle="Stream management" />
            <ListItem icon={<BookOpen size={18} />} title="Creator Academy" subtitle="Learn trending tips" />
            <ListItem icon={<Globe size={18} />} title="Creator Portal" subtitle="Advanced analytics on web" />
            <ListItem icon={<MessageSquare size={18} />} title="Q&A" subtitle="Engage with fans" />
        </div>

        {/* Recent Uploads */}
        <div className="mt-8 px-4">
             <div className="flex justify-between items-center mb-4">
                 <h3 className="text-sm font-bold">Recent Uploads</h3>
                 <span className="text-xs text-teal-400">See All</span>
             </div>
             <div className="space-y-3">
                 {[1, 2, 3].map((i) => (
                     <div key={i} className="flex gap-3 bg-[#1e1e1e] p-2 rounded-lg">
                         <div className="w-16 h-20 bg-gray-800 rounded relative overflow-hidden">
                             <img src={`https://picsum.photos/100/150?random=${i}`} className="w-full h-full object-cover opacity-80" />
                             <div className="absolute bottom-1 right-1 flex items-center gap-0.5 text-[9px] font-bold">
                                 <PlayCircle size={8} /> {1.2 * i}k
                             </div>
                         </div>
                         <div className="flex-1 py-1">
                             <div className="text-xs text-white/90 line-clamp-2 mb-2">
                                 Exploring the new features in Aura 2.0! #aura #tech #design
                             </div>
                             <div className="text-[10px] text-gray-500">
                                 {i} day ago • 12 comments
                             </div>
                         </div>
                         <div className="flex flex-col justify-center px-2">
                             <ChevronRight size={16} className="text-gray-600" />
                         </div>
                     </div>
                 ))}
             </div>
        </div>
      </div>
    </div>
  );
};

const ToolCard = ({ icon, title, subtitle, color, bg }: any) => (
    <div className="bg-[#1e1e1e] p-4 rounded-xl flex flex-col gap-3 hover:bg-[#252525] transition-colors cursor-pointer border border-white/5">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bg} ${color}`}>
            {icon}
        </div>
        <div>
            <span className="block text-sm font-bold text-white">{title}</span>
            <span className="block text-xs text-gray-500">{subtitle}</span>
        </div>
    </div>
);

const ListItem = ({ icon, title, subtitle }: any) => (
    <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
        <div className="flex items-center gap-4">
            <div className="text-gray-400">{icon}</div>
            <div>
                <span className="block text-sm font-medium text-white">{title}</span>
                <span className="block text-xs text-gray-500">{subtitle}</span>
            </div>
        </div>
        <ChevronRight size={16} className="text-gray-600" />
    </div>
);

export default AuraStudio;