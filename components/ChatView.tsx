import React, { useState, useEffect, useRef } from 'react';
import { Contact, Message, MOOD_COLORS, MoodType, Plant, AttachmentType, PollOption } from '../types';
import { ArrowLeft, Send, Mic, Smile, Phone, Video, Check, CheckCheck, Clock, Atom, Leaf, Fingerprint, Gem, Sparkles, Trash2, X, Reply, Heart, SmilePlus, Crown, Zap, Code, CheckCircle, MoreVertical, Paperclip, MapPin, User, BarChart2, Star, EyeOff, Lock, Image as ImageIcon, Camera, Plus, Play } from 'lucide-react';
import SoulGarden from './SoulGarden';
import GhostTouch from './GhostTouch';

interface ChatViewProps {
  contact: Contact;
  userMood: MoodType;
  messages: Message[];
  isTyping: boolean;
  onBack: () => void;
  onSendMessage: (text: string, replyTo?: Message, type?: AttachmentType, extra?: any) => void;
  onDeleteMessage: (msgId: string) => void;
  onCrystallize: (msg: Message) => void;
  onAcknowledge: (msgId: string) => void;
  onReact: (msgId: string, emoji: string) => void;
  onStartCall: (type: 'audio' | 'video') => void;
  onUpdateContact: (updatedContact: Contact) => void;
  onViewArtifacts: () => void;
  onStarMessage: (msgId: string) => void;
}

const COMMON_REACTIONS = ['❤️', '😂', '😮', '😢', '😡', '👍'];

const ChatView: React.FC<ChatViewProps> = ({ 
    contact, 
    userMood, 
    messages, 
    isTyping,
    onBack, 
    onSendMessage, 
    onDeleteMessage,
    onStartCall, 
    onCrystallize, 
    onAcknowledge,
    onReact,
    onViewArtifacts,
    onStarMessage
}) => {
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  
  // Feature Toggles
  const [showSoulGarden, setShowSoulGarden] = useState(true);
  const [ghostTouchActive, setGhostTouchActive] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, msgId: string } | null>(null);
  const [reactionPickerId, setReactionPickerId] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevMessagesLength = useRef(messages.length);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Poll Creation State
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  // Mock Garden Data
  const [gardenPlants, setGardenPlants] = useState<Plant[]>([
       { id: '1', x: 0.2, height: 150, color: MOOD_COLORS.serene, type: 'vine', growth: 1 },
       { id: '2', x: 0.8, height: 100, color: MOOD_COLORS[contact.mood], type: 'flower', growth: 0.8 }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, replyingTo]);

  // Handle Garden Growth on new message
  useEffect(() => {
      if (messages.length > prevMessagesLength.current) {
          const newPlantId = Date.now().toString();
          setGardenPlants(prev => [...prev, {
              id: newPlantId,
              x: Math.random(),
              height: 50 + Math.random() * 100,
              color: MOOD_COLORS[userMood],
              type: 'vine',
              growth: 0
          }]);
      
          setTimeout(() => {
               setGardenPlants(prev => prev.map(p => p.id === newPlantId ? { ...p, growth: 1 } : p));
          }, 100);
      }
      prevMessagesLength.current = messages.length;
  }, [messages, userMood]);

  useEffect(() => {
      const handleClick = () => {
          setContextMenu(null);
          setReactionPickerId(null);
          setShowAttachments(false);
      };
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
  }, []);

  // Recording Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText, replyingTo || undefined);
    setInputText('');
    setReplyingTo(null);
  };

  const handleStartRecording = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // In a real app, we would initialize MediaRecorder here
          // mediaRecorderRef.current = new MediaRecorder(stream);
          // mediaRecorderRef.current.start();
          setIsRecording(true);
          setRecordingDuration(0);
      } catch (err) {
          console.error("Microphone access denied:", err);
          alert("Please enable microphone access to record voice messages.");
      }
  };

  const handleStopRecording = () => {
      setIsRecording(false);
      if (mediaRecorderRef.current) {
          // mediaRecorderRef.current.stop();
          // Logic to get blob would go here
      }
      onSendMessage('Voice Message', undefined, 'voice', { duration: recordingDuration });
  };

  const handleCancelRecording = () => {
      setIsRecording(false);
      if (mediaRecorderRef.current) {
          // mediaRecorderRef.current.stop();
      }
  };

  const handleSendPoll = () => {
      if (!pollQuestion || pollOptions.some(o => !o)) return;
      const options: PollOption[] = pollOptions.map((text, i) => ({ id: i.toString(), text, votes: [] }));
      onSendMessage(pollQuestion, undefined, 'poll', { pollOptions: options });
      setIsCreatingPoll(false);
      setPollQuestion('');
      setPollOptions(['', '']);
  };

  const handleReplyAction = (e: React.MouseEvent, msgId: string) => {
      e.stopPropagation();
      const msg = messages.find(m => m.id === msgId);
      if (msg) {
          setReplyingTo(msg);
          inputRef.current?.focus();
      }
      setContextMenu(null);
  };

  const handleCrystallizeAction = (e: React.MouseEvent, msgId: string) => {
      e.stopPropagation();
      const msg = messages.find(m => m.id === msgId);
      if (msg) {
          onCrystallize(msg);
      }
      setContextMenu(null);
  };

  const handleDeleteAction = (e: React.MouseEvent, msgId: string) => {
      e.stopPropagation();
      onDeleteMessage(msgId);
      setContextMenu(null);
  };
  
  const handleStarAction = (e: React.MouseEvent, msgId: string) => {
      e.stopPropagation();
      onStarMessage(msgId);
      setContextMenu(null);
  };

  const handleTouchStart = (e: React.TouchEvent, msgId: string) => {
      const touch = e.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;
      touchTimer.current = setTimeout(() => {
          setContextMenu({ x, y, msgId });
      }, 600); 
  };

  const handleTouchEnd = () => {
      if (touchTimer.current) clearTimeout(touchTimer.current);
  };

  const handleGalleryClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const imageUrl = URL.createObjectURL(file);
          onSendMessage('Sent an image', replyingTo || undefined, 'image', { attachmentUrl: imageUrl });
          setShowAttachments(false);
          setReplyingTo(null);
      }
  };

  const formatTime = (timestamp: number) => {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
  };

  const getBadgeIcon = (type: string) => {
      switch(type) {
          case 'verified': return <CheckCircle size={14} className="text-blue-400 fill-blue-400/10" />;
          case 'gold': return <Crown size={14} className="text-yellow-400 fill-yellow-400/10" />;
          case 'early_adopter': return <Zap size={14} className="text-purple-400" />;
          case 'developer': return <Code size={14} className="text-green-400" />;
          default: return null;
      }
  };

  const renderAttachmentContent = (msg: Message) => {
      if (msg.type === 'image') {
          return (
              <div className="rounded-lg overflow-hidden mb-1 max-w-[200px]">
                  <img src={msg.attachmentUrl} className="w-full h-auto" alt="attachment" />
              </div>
          );
      }
      if (msg.type === 'poll' && msg.pollOptions) {
          return (
              <div className="w-full min-w-[200px]">
                  <p className="font-bold mb-2">{msg.text}</p>
                  <div className="space-y-2">
                      {msg.pollOptions.map(opt => (
                          <div key={opt.id} className="bg-white/10 rounded p-2 text-sm flex justify-between cursor-pointer hover:bg-white/20 transition-colors">
                              <span>{opt.text}</span>
                              <span className="text-teal-400">{opt.votes.length}</span>
                          </div>
                      ))}
                  </div>
              </div>
          );
      }
      if (msg.type === 'voice') {
          return (
              <div className="flex items-center gap-3 min-w-[150px] py-1">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Play size={14} className="ml-0.5 fill-current" />
                  </div>
                  <div className="flex flex-col flex-1">
                       <div className="h-1 bg-white/20 rounded-full w-full mb-1">
                           <div className="h-full w-1/3 bg-white rounded-full" />
                       </div>
                       <span className="text-[10px] opacity-70">
                           {msg.duration ? `${Math.floor(msg.duration / 60)}:${(msg.duration % 60).toString().padStart(2, '0')}` : '0:05'}
                       </span>
                  </div>
              </div>
          );
      }
      if (msg.type === 'location') {
          return (
              <div className="bg-white/10 rounded-lg p-2 flex items-center gap-3 min-w-[200px]">
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                      <MapPin size={20} />
                  </div>
                  <div className="flex flex-col">
                      <span className="font-bold text-sm">Live Location</span>
                      <span className="text-xs opacity-70">Sharing for 1 hour</span>
                  </div>
              </div>
          );
      }
      return <span className="break-words font-light">{msg.text}</span>;
  };

  return (
    <div className="flex flex-col h-full relative z-20 bg-black/40" style={contact.customTheme ? { background: `linear-gradient(to bottom, #050505, ${contact.customTheme}20)` } : {}}>
      
      {showSoulGarden && <SoulGarden plants={gardenPlants} mood={contact.mood} />}
      <GhostTouch active={ghostTouchActive} mood={userMood} />

      {/* Header */}
      <div className="glass-panel border-x-0 border-t-0 px-4 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-white/70 hover:text-white transition-colors">
                <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3 cursor-pointer ml-1">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                        <img src={contact.avatar} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    {contact.isOnline && (
                         <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black" />
                    )}
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <h2 className="text-white text-base font-medium tracking-wide">
                            {contact.nickname || contact.name}
                        </h2>
                        {contact.badges?.map((badge, i) => (
                            <span key={i} title={badge.label}>{getBadgeIcon(badge.type)}</span>
                        ))}
                    </div>
                    <span className="text-white/40 text-[10px] uppercase tracking-widest">
                        {isTyping ? <span className="text-teal-400">writing...</span> : (contact.isOnline ? 'Active now' : `Last seen ${contact.lastSeen ? new Date(contact.lastSeen).toLocaleTimeString() : 'recently'}`)}
                    </span>
                </div>
            </div>
        </div>
        
        <div className="flex items-center gap-4 text-white/60">
            <button 
                onClick={onViewArtifacts} 
                className="hover:text-teal-400 text-teal-400/70 transition-colors"
                title="Treasure Box"
            >
                <Gem size={20} />
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1" />
            <button onClick={() => setGhostTouchActive(!ghostTouchActive)} className={ghostTouchActive ? "text-teal-400" : "hover:text-white"}>
                <Fingerprint size={20} />
            </button>
            <button onClick={() => setShowSoulGarden(!showSoulGarden)} className={showSoulGarden ? "text-green-400" : "hover:text-white"}>
                <Leaf size={20} />
            </button>
            <button onClick={() => onStartCall('video')} className="hover:text-white"><Video size={20} /></button>
            <button onClick={() => onStartCall('audio')} className="hover:text-white"><Phone size={20} /></button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 relative overflow-y-auto p-4" ref={chatContainerRef}>
        <div className="relative z-10 flex flex-col gap-3 pb-20">
            {messages.map((msg) => {
                const isMe = msg.sender === 'me';
                const isReceivedWithLove = msg.status === 'received_with_love';

                return (
                    <div 
                        key={msg.id} 
                        className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2 mb-1 group ${isMe ? 'animate-fade-in-up' : 'animate-pop-in'}`}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            setContextMenu({ x: e.clientX, y: e.clientY, msgId: msg.id });
                        }}
                        onTouchStart={(e) => handleTouchStart(e, msg.id)}
                        onTouchEnd={handleTouchEnd}
                    >
                         {isMe && (
                             <div className="flex gap-1 mb-1">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setReactionPickerId(reactionPickerId === msg.id ? null : msg.id); }}
                                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-amber-400 transform translate-x-2 group-hover:translate-x-0 relative"
                                >
                                    <SmilePlus size={14} />
                                    {reactionPickerId === msg.id && (
                                        <div className="absolute bottom-10 left-0 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-full p-2 flex gap-2 shadow-2xl animate-message-pop z-50">
                                            {COMMON_REACTIONS.map(emoji => (
                                                <button 
                                                    key={emoji}
                                                    onClick={(e) => { e.stopPropagation(); onReact(msg.id, emoji); setReactionPickerId(null); }}
                                                    className="hover:scale-125 transition-transform text-lg"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onCrystallize(msg); }}
                                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-full hover:bg-white/10 text-teal-400/70 hover:text-teal-400 transform translate-x-2 group-hover:translate-x-0"
                                >
                                    <Sparkles size={14} />
                                </button>
                             </div>
                        )}

                        <div className="flex flex-col max-w-[80%]">
                            <div 
                                className={`
                                    relative px-4 py-2.5 text-[15px] leading-relaxed shadow-lg backdrop-blur-md cursor-pointer
                                    transition-transform duration-200 active:scale-95
                                    ${isMe 
                                        ? 'bg-gradient-to-br from-teal-500/20 to-teal-500/5 border border-teal-500/30 text-white rounded-[18px] rounded-br-[2px]' 
                                        : 'bg-white/10 border border-white/10 text-white/90 rounded-[18px] rounded-bl-[2px]'}
                                `}
                            >
                                {msg.replyTo && (
                                    <div className={`mb-1.5 rounded-md p-2 text-xs border-l-2 border-white/40 ${isMe ? 'bg-black/10' : 'bg-white/5'}`}>
                                        <div className="font-semibold opacity-80 mb-0.5">
                                            {msg.replyTo.sender === 'me' ? 'You' : (contact.nickname || contact.name)}
                                        </div>
                                        <div className="opacity-60 truncate">
                                            {msg.replyTo.text}
                                        </div>
                                    </div>
                                )}

                                {renderAttachmentContent(msg)}
                                
                                <div className="flex items-center justify-end gap-1 mt-1 opacity-50 text-[10px]">
                                    {msg.isStarred && <Star size={8} fill="currentColor" />}
                                    <span>{formatTime(msg.timestamp)}</span>
                                    {isMe && (
                                        <span className={isReceivedWithLove ? 'text-pink-400' : (msg.status === 'read' ? 'text-teal-400' : 'text-white')}>
                                            {msg.status === 'sending' ? (
                                                <Clock size={10} />
                                            ) : isReceivedWithLove ? (
                                                <Heart size={10} fill="currentColor" className="animate-pulse" />
                                            ) : (
                                                <CheckCheck size={12} />
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {msg.reactions && msg.reactions.length > 0 && (
                                <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    {msg.reactions.map(reaction => (
                                        <button 
                                            key={reaction.emoji}
                                            onClick={(e) => { e.stopPropagation(); onReact(msg.id, reaction.emoji); }}
                                            className={`
                                                flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] border transition-colors
                                                ${reaction.me 
                                                    ? 'bg-teal-500/20 border-teal-500/50 text-teal-300' 
                                                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                                }
                                            `}
                                        >
                                            <span>{reaction.emoji}</span>
                                            {reaction.count > 1 && <span>{reaction.count}</span>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                         {!isMe && (
                             <div className="flex flex-col gap-1 mb-1">
                                 <button 
                                    onClick={(e) => { e.stopPropagation(); onAcknowledge(msg.id); }}
                                    className={`
                                        p-2 rounded-full transition-all duration-300 transform
                                        ${isReceivedWithLove 
                                            ? 'text-pink-400 opacity-100 scale-100' 
                                            : 'opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 text-white/40 hover:text-pink-400 hover:bg-white/10'
                                        }
                                    `}
                                    disabled={isReceivedWithLove}
                                 >
                                    <Heart size={14} fill={isReceivedWithLove ? "currentColor" : "none"} />
                                 </button>
                                 <button 
                                    onClick={(e) => { e.stopPropagation(); setReactionPickerId(reactionPickerId === msg.id ? null : msg.id); }}
                                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-amber-400 transform -translate-x-2 group-hover:translate-x-0 relative"
                                >
                                    <SmilePlus size={14} />
                                    {reactionPickerId === msg.id && (
                                        <div className="absolute bottom-10 right-0 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-full p-2 flex gap-2 shadow-2xl animate-message-pop z-50">
                                            {COMMON_REACTIONS.map(emoji => (
                                                <button 
                                                    key={emoji}
                                                    onClick={(e) => { e.stopPropagation(); onReact(msg.id, emoji); setReactionPickerId(null); }}
                                                    className="hover:scale-125 transition-transform text-lg"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </button>
                                 <button 
                                    onClick={(e) => { e.stopPropagation(); onCrystallize(msg); }}
                                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-full hover:bg-white/10 text-teal-400/70 hover:text-teal-400 transform -translate-x-2 group-hover:translate-x-0"
                                >
                                    <Sparkles size={14} />
                                </button>
                             </div>
                        )}
                    </div>
                );
            })}
             {isTyping && (
                <div className="flex justify-start">
                    <div className="glass-panel px-4 py-2 rounded-full rounded-tl-none">
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                            <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Poll Creator Overlay */}
      {isCreatingPoll && (
          <div className="absolute bottom-20 left-4 right-4 bg-[#1a1a1a] border border-white/10 rounded-xl p-4 z-40 shadow-2xl animate-fade-in-up">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-medium">Create Poll</h3>
                  <button onClick={() => setIsCreatingPoll(false)}><X size={16} className="text-white/50" /></button>
              </div>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 mb-3 text-sm text-white outline-none" 
                placeholder="Ask a question..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
              />
              <div className="space-y-2 mb-4">
                  {pollOptions.map((opt, i) => (
                      <input 
                        key={i}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white outline-none" 
                        placeholder={`Option ${i+1}`}
                        value={opt}
                        onChange={(e) => {
                            const newOpts = [...pollOptions];
                            newOpts[i] = e.target.value;
                            setPollOptions(newOpts);
                        }}
                      />
                  ))}
                  <button 
                    onClick={() => setPollOptions([...pollOptions, ''])} 
                    className="text-xs text-teal-400 flex items-center gap-1"
                  >
                      <SmilePlus size={12} /> Add Option
                  </button>
              </div>
              <button 
                onClick={handleSendPoll}
                className="w-full bg-teal-500 text-black font-semibold py-2 rounded-lg text-sm"
              >
                  Create Poll
              </button>
          </div>
      )}

      {/* Reply Context Preview */}
      {replyingTo && (
          <div className="px-4 pt-2 bg-black/40 backdrop-blur-md border-t border-white/5 animate-fade-in-up z-30">
              <div className="glass-panel p-2 rounded-lg flex justify-between items-center border-l-4 border-l-teal-400 bg-white/5">
                  <div className="flex flex-col overflow-hidden mr-2">
                      <span className="text-teal-400 text-xs font-bold mb-0.5">
                          Replying to {replyingTo.sender === 'me' ? 'You' : (contact.nickname || contact.name)}
                      </span>
                      <span className="text-white/60 text-xs truncate max-w-[250px] md:max-w-md">
                          {replyingTo.text}
                      </span>
                  </div>
                  <button 
                      onClick={() => setReplyingTo(null)}
                      className="p-1.5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                  >
                      <X size={16} />
                  </button>
              </div>
          </div>
      )}

      {/* Input Area */}
      <div className="glass-panel border-x-0 border-b-0 px-4 py-3 flex items-end gap-3 z-30">
        {isRecording ? (
            <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]" />
                <span className="text-white font-mono text-sm flex-1">{Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}</span>
                <span className="text-white/30 text-xs uppercase tracking-widest animate-pulse">Recording...</span>
                <button onClick={handleCancelRecording} className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-red-400 transition-colors">
                    <Trash2 size={20} />
                </button>
            </div>
        ) : (
            <>
                <div className="relative">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowAttachments(!showAttachments); }}
                        className={`text-white/40 hover:text-teal-400 transition-colors p-2 ${showAttachments ? 'text-teal-400 rotate-45' : ''}`}
                    >
                        <Plus size={24} />
                    </button>
                    {showAttachments && (
                        <div className="absolute bottom-14 left-0 bg-[#1a1a1a] border border-white/10 rounded-xl p-2 shadow-2xl grid grid-cols-3 gap-2 w-48 animate-fade-in-up">
                            <AttachButton icon={<ImageIcon size={18} />} label="Gallery" color="text-purple-400" onClick={handleGalleryClick} />
                            <AttachButton icon={<Camera size={18} />} label="Camera" color="text-pink-400" onClick={() => { setShowAttachments(false); onSendMessage('Sent a photo', undefined, 'image', { attachmentUrl: 'https://picsum.photos/400' }); }} />
                            <AttachButton icon={<MapPin size={18} />} label="Location" color="text-green-400" onClick={() => { setShowAttachments(false); onSendMessage('Shared Location', undefined, 'location'); }} />
                            <AttachButton icon={<BarChart2 size={18} />} label="Poll" color="text-yellow-400" onClick={() => { setShowAttachments(false); setIsCreatingPoll(true); }} />
                            <AttachButton icon={<User size={18} />} label="Contact" color="text-blue-400" onClick={() => setShowAttachments(false)} />
                            <AttachButton icon={<Paperclip size={18} />} label="File" color="text-gray-400" onClick={() => setShowAttachments(false)} />
                        </div>
                    )}
                </div>
                
                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 py-2 focus-within:border-teal-500/50 transition-colors">
                    <input 
                        ref={inputRef}
                        type="text" 
                        className="flex-1 bg-transparent text-white outline-none placeholder-white/30 max-h-24 py-1"
                        placeholder="Message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <button onClick={handleGalleryClick} className="p-2 text-white/40 hover:text-teal-400 transition-colors">
                        <ImageIcon size={20} />
                    </button>
                    <button className="p-2 text-white/40 hover:text-white transition-colors">
                        <Smile size={20} />
                    </button>
                </div>
            </>
        )}

        {isRecording ? (
             <button 
                onClick={handleStopRecording} 
                className="p-3 rounded-full bg-teal-500 text-black hover:bg-teal-400 hover:scale-105 transition-all shadow-lg animate-fade-in-up"
            >
                <Send size={20} className="ml-0.5" />
            </button>
        ) : (
            <div className="flex items-center gap-2">
                {inputText.trim() && (
                    <button 
                        onClick={handleSendMessage} 
                        className="p-3 rounded-full bg-teal-500 text-black hover:bg-teal-400 hover:scale-105 transition-all shadow-lg"
                    >
                        <Send size={20} className="ml-0.5" />
                    </button>
                )}
                <button 
                    onClick={handleStartRecording} 
                    className={`p-3 rounded-full transition-all duration-300 ${!inputText.trim() ? 'bg-teal-500 text-black hover:bg-teal-400 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    <Mic size={20} />
                </button>
            </div>
        )}
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
    </div>
  );
};

const AttachButton = ({ icon, label, color, onClick }: any) => (
    <button 
        onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
        className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors gap-1"
    >
        <div className={`${color}`}>{icon}</div>
        <span className="text-[10px] text-white/70">{label}</span>
    </button>
);

export default ChatView;