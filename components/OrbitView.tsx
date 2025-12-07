
import React from 'react';
import { Contact, MOOD_COLORS } from '../types';
import { CheckCheck, Crown, Users } from 'lucide-react';

interface OrbitViewProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  width: number;
  height: number;
  onTriggerGodMode: () => void;
  isGodMode: boolean;
  filter?: 'all' | 'groups';
  onNavigate: (destination: string) => void;
  onCreateGroup: (name: string, members: string[]) => void;
}

const OrbitView: React.FC<OrbitViewProps> = ({ 
  contacts, 
  onSelectContact
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-[#050505] relative overflow-hidden text-white">
      {/* MAIN LIST CONTENT */}
      <div className="flex-1 overflow-y-auto relative px-2 pt-2 scrollbar-hide">
          <div className="space-y-1 pb-24">
            {contacts.map((contact) => (
                <div 
                    key={contact.id}
                    onClick={() => onSelectContact(contact)}
                    className="group relative flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5 active:scale-[0.99]"
                >
                    {/* Avatar with Aura Ring */}
                    <div className="relative">
                        <div className="w-14 h-14 rounded-full p-[2px]" style={{ background: `linear-gradient(135deg, ${MOOD_COLORS[contact.mood]}, transparent)` }}>
                             <div className="w-full h-full rounded-full overflow-hidden bg-black border-2 border-black">
                                <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                             </div>
                        </div>
                        {contact.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-teal-500 rounded-full border-2 border-[#050505] shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="text-base font-medium text-white/90 group-hover:text-white transition-colors truncate">
                                {contact.nickname || contact.name}
                            </h3>
                            <span className={`text-[10px] font-medium ${contact.isTyping ? 'text-teal-400 animate-pulse' : 'text-white/30'}`}>
                                {contact.isTyping ? 'typing...' : (contact.lastSeen ? new Date(contact.lastSeen).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Now')}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-sm text-white/50 truncate max-w-[85%] group-hover:text-white/70 transition-colors">
                                {!contact.isTyping && !contact.isGroup && (
                                    <CheckCheck size={14} className="text-teal-500/50" />
                                )}
                                <p className="truncate font-light">{contact.lastMessage}</p>
                            </div>
                            
                            {/* Unread / Badges */}
                            <div className="flex gap-1 items-center">
                                {contact.isGroup && <Users size={12} className="text-white/30" />}
                                {contact.badges?.some(b => b.type === 'gold') && <Crown size={12} className="text-amber-400" />}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default OrbitView;
