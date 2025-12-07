
import React from 'react';
import { Contact, MOOD_COLORS } from '../types';

interface ChatHeadsProps {
  contacts: Contact[];
  onSelect: (contact: Contact) => void;
  activeContactId?: string;
}

const ChatHeads: React.FC<ChatHeadsProps> = ({ contacts, onSelect, activeContactId }) => {
  // Only show top 3 contacts + current active one for demo, to simulate recent chats
  const heads = contacts.slice(0, 4);

  return (
    <div className="fixed right-4 top-1/4 z-50 flex flex-col gap-4">
      {heads.map((contact) => {
        const isActive = activeContactId === contact.id;
        return (
          <div 
            key={contact.id}
            onClick={() => onSelect(contact)}
            className={`
              relative group cursor-pointer transition-all duration-300
              ${isActive ? 'scale-110 translate-x-[-10px]' : 'hover:scale-105'}
            `}
          >
            {/* Status Indicator */}
            <div className={`
              absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-black z-10
              ${isActive ? 'bg-teal-400' : 'bg-transparent'}
            `} style={{ backgroundColor: MOOD_COLORS[contact.mood] }}/>

            {/* Avatar */}
            <div className={`
              w-12 h-12 rounded-full overflow-hidden border-2 shadow-lg
              ${isActive ? 'border-white' : 'border-white/20'}
            `}>
              <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
            </div>

            {/* Hover Tooltip (Name) */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm whitespace-nowrap">
                {contact.nickname || contact.name}
              </div>
            </div>
            
            {/* Unread Badge (Mock) */}
            {!isActive && Math.random() > 0.7 && (
                 <div className="absolute -bottom-1 -left-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-black font-bold">
                     1
                 </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatHeads;
