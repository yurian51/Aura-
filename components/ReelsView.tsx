

import React, { useRef, useState, useEffect } from 'react';
import { Post, Contact, LiveGuest, LiveGift } from '../types';
import { Heart, MessageCircle, Share2, Music, Play, Volume2, VolumeX, Search, Flag, EyeOff, Layers, Scissors, User, Home, Plus, Users, Inbox, Camera, Gift, Tv, ArrowLeft, Bookmark, X, Zap, Grid, Eye, Settings, MoreHorizontal, FastForward, Maximize2, UserPlus, Mic, MicOff, Video, VideoOff, RotateCcw, Smile, Send, Swords, Wand2, RefreshCw, Sparkles, Coins } from 'lucide-react';
import WalletModal from './WalletModal';

interface ReelsViewProps {
  posts: Post[];
  contacts: Contact[];
  onLike: (postId: string) => void;
  onNavigate: (destination: string) => void;
  auraCoins: number;
  onSpendCoins: (amount: number) => boolean;
  onBuyCoins: (pkg: any) => void;
}

const GIFTS = [
    { id: 'g1', name: 'Rose', icon: '🌹', cost: 1 },
    { id: 'g2', name: 'Heart', icon: '💖', cost: 5 },
    { id: 'g3', name: 'Doughnut', icon: '🍩', cost: 10 },
    { id: 'g4', name: 'Diamond', icon: '💎', cost: 100 },
    { id: 'g5', name: 'Rocket', icon: '🚀', cost: 500 },
    { id: 'g6', name: 'Galaxy', icon: '🌌', cost: 1000 },
];

const ReelsView: React.FC<ReelsViewProps> = ({ posts, contacts, onLike, onNavigate, auraCoins, onSpendCoins, onBuyCoins }) => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const [activeTab, setActiveTab] = useState<'following' | 'foryou' | 'friends'>('foryou');
  const [isLiveMode, setIsLiveMode] = useState(false); 
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  const [showCreate, setShowCreate] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [clearMode, setClearMode] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  
  // Live Stream State
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [liveComments, setLiveComments] = useState<{id: number, user: string, text: string}[]>([]);
  const [liveDuration, setLiveDuration] = useState(0);

  // Live Multi-Guest & Gifts
  const [liveGuests, setLiveGuests] = useState<LiveGuest[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [giftQueue, setGiftQueue] = useState<LiveGift[]>([]);
  const [showGiftDrawer, setShowGiftDrawer] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const videoPosts = posts.filter(p => p.type === 'video' && p.videoUrl);
  const getAuthor = (id: string) => contacts.find(c => c.id === id) || { name: 'Unknown', avatar: '', mood: 'neutral', badges: [] };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveVideoId(entry.target.getAttribute('data-id'));
          }
        });
      },
      { threshold: 0.6 }
    );
    const elements = containerRef.current?.querySelectorAll('.reel-container');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [posts, activeTab]);

  useEffect(() => {
      if (isLiveMode) {
          startCamera();
      } else {
          stopCamera();
          setIsBroadcasting(false);
          setViewerCount(0);
          setLiveComments([]);
          setLiveDuration(0);
          setLiveGuests([]);
          setGiftQueue([]);
      }
      return () => stopCamera();
  }, [isLiveMode]);

  useEffect(() => {
      let viewerInterval: ReturnType<typeof setInterval>;
      let commentInterval: ReturnType<typeof setInterval>;
      let durationInterval: ReturnType<typeof setInterval>;

      if (isBroadcasting) {
          viewerInterval = setInterval(() => {
              setViewerCount(prev => Math.max(0, prev + (Math.floor(Math.random() * 10) - 3)));
          }, 1000);
          commentInterval = setInterval(() => {
              if (Math.random() > 0.4) {
                  const randomUser = contacts[Math.floor(Math.random() * contacts.length)];
                  const phrases = ["Love this!", "Amazing energy ✨", "Hello from NY!", "Can you say hi?", "Wow 😮", "❤️❤️❤️", "Aura is evolving..."];
                  const newComment = { id: Date.now(), user: randomUser.name, text: phrases[Math.floor(Math.random() * phrases.length)] };
                  setLiveComments(prev => [...prev.slice(-4), newComment]);
              }
          }, 1500);
          durationInterval = setInterval(() => {
              setLiveDuration(prev => prev + 1);
          }, 1000);
      }

      return () => {
          clearInterval(viewerInterval);
          clearInterval(commentInterval);
          clearInterval(durationInterval);
      };
  }, [isBroadcasting, contacts]);

  const startCamera = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
          setCameraPermission('granted');
      } catch (err) {
          console.error("Camera denied", err);
          setCameraPermission('denied');
      }
  };

  const stopCamera = () => {
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
      }
  };

  const toggleSpeed = () => {
      const speeds = [0.5, 1, 1.5, 2];
      const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
      setPlaybackSpeed(speeds[nextIdx]);
  };

  const handleSendGift = (gift: typeof GIFTS[0]) => {
      if (onSpendCoins(gift.cost)) {
           const incoming: LiveGift = {
              id: Date.now().toString(),
              name: gift.name,
              icon: gift.icon,
              value: gift.cost,
              senderName: 'You',
              senderAvatar: 'https://ui-avatars.com/api/?name=Me'
          };
          setGiftQueue(prev => [...prev, incoming]);
          setTimeout(() => setGiftQueue(prev => prev.filter(g => g.id !== incoming.id)), 4000);
          setShowGiftDrawer(false);
      } else {
          setShowGiftDrawer(false);
          setShowWallet(true);
      }
  };

  // LIVE MODE UI
  if (isLiveMode) {
      const totalStreams = 1 + liveGuests.length;
      let gridClass = "w-full h-full"; 
      if (totalStreams === 2) gridClass = "grid grid-rows-2 h-full";
      if (totalStreams > 2) gridClass = "grid grid-cols-2 grid-rows-2 h-full";

      return (
          <div className="w-full h-full bg-black relative flex flex-col">
               <div className={`absolute inset-0 z-0 bg-[#111] ${gridClass} gap-1`}>
                    <div className="relative w-full h-full bg-[#1a1a1a] overflow-hidden">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        {totalStreams > 1 && <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-0.5 rounded text-[10px] text-white">Host</div>}
                    </div>
                    {liveGuests.map(guest => (
                        <div key={guest.id} className="relative w-full h-full bg-[#1a1a1a] overflow-hidden">
                            <img src={guest.avatar} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-0.5 rounded text-[10px] text-white">{guest.name}</div>
                            <button onClick={() => setLiveGuests(prev => prev.filter(g => g.id !== guest.id))} className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full text-white hover:bg-red-500"><X size={14} /></button>
                        </div>
                    ))}
               </div>
               
               {/* Live Overlay */}
               <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none">
                   <div className="flex justify-between items-start pointer-events-auto">
                       <div className="flex gap-2 items-center">
                           <button onClick={() => setIsLiveMode(false)} className="bg-black/40 p-2 rounded-full text-white backdrop-blur-md border border-white/10 hover:bg-white/10"><X size={20} /></button>
                           {isBroadcasting && (
                               <div className="flex flex-col">
                                   <div className="bg-pink-600 px-3 py-1 rounded-md flex items-center gap-2 animate-pulse mb-1"><span className="text-white text-xs font-bold uppercase tracking-wider">LIVE</span></div>
                               </div>
                           )}
                           <div className="bg-black/40 px-2 py-1 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-2">
                               <img src="https://picsum.photos/100" className="w-8 h-8 rounded-full border border-white" />
                               <div className="flex flex-col pr-2"><span className="text-xs font-bold text-white leading-none">Me</span><span className="text-[10px] text-white/60 leading-none">Follow</span></div>
                           </div>
                       </div>
                       {isBroadcasting ? (
                           <div className="bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-2">
                               <Eye size={16} className="text-white" />
                               <span className="text-white text-xs font-bold">{viewerCount}</span>
                           </div>
                       ) : (
                           <button className="bg-black/40 p-2 rounded-full text-white backdrop-blur-md border border-white/10"><RotateCcw size={20} /></button>
                       )}
                   </div>

                   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center justify-center pointer-events-none">
                        {giftQueue.map(gift => (
                            <div key={gift.id} className="animate-fade-in-up flex flex-col items-center mb-4">
                                <div className="text-6xl animate-bounce">{gift.icon}</div>
                                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1 rounded-full text-white text-xs font-bold shadow-lg border border-white/20 mt-2">
                                    {gift.senderName} sent {gift.name}
                                </div>
                            </div>
                        ))}
                   </div>

                   {!isBroadcasting && (
                       <div className="absolute inset-0 flex flex-col items-center justify-center z-0 pointer-events-none">
                           {cameraPermission === 'denied' ? (
                               <div className="text-center bg-black/80 p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
                                   <VideoOff size={48} className="text-white/50 mx-auto mb-4" />
                                   <h3 className="text-white font-bold mb-2">Camera Access Required</h3>
                               </div>
                           ) : (
                               <div className="text-center pointer-events-auto">
                                   <input placeholder="Add a title to your Flow..." className="bg-transparent border-b border-white/30 text-center text-white text-xl placeholder-white/50 outline-none pb-2 mb-8 w-64 font-medium" />
                                   <button onClick={() => { setIsBroadcasting(true); setViewerCount(0); }} className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 px-12 rounded-full shadow-[0_0_30px_rgba(219,39,119,0.4)] transition-all active:scale-95 flex items-center gap-3 mx-auto">
                                       <Zap size={20} fill="currentColor" /> GO LIVE
                                   </button>
                               </div>
                           )}
                       </div>
                   )}

                   {isBroadcasting && (
                       <div className="flex flex-col gap-4 pointer-events-auto">
                           <div className="h-48 overflow-y-auto flex flex-col-reverse gap-2 mask-linear-fade">
                               {liveComments.map(c => (
                                   <div key={c.id} className="flex items-start gap-2 animate-fade-in-up">
                                       <div className="bg-black/40 rounded-full px-3 py-1.5 backdrop-blur-sm">
                                           <span className="text-white/70 text-xs font-bold mr-2">{c.user}</span>
                                           <span className="text-white text-xs">{c.text}</span>
                                       </div>
                                   </div>
                               ))}
                           </div>
                           <div className="flex items-center justify-between gap-3">
                               <div className="flex items-center gap-2 flex-1 bg-black/40 rounded-full px-4 py-2 border border-white/10">
                                   <input className="bg-transparent text-white text-sm outline-none flex-1 placeholder-white/50" placeholder="Comment..." />
                                   <button><Send size={16} className="text-teal-400" /></button>
                               </div>
                               <button onClick={() => setShowInviteModal(true)} className="p-3 rounded-full bg-black/40 text-white border border-white/10 hover:bg-white/10 relative">
                                   <Users size={20} />
                               </button>
                               <button onClick={() => setShowGiftDrawer(true)} className="p-3 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/50 hover:bg-pink-500/40"><Gift size={20} /></button>
                               <button onClick={() => setIsBroadcasting(false)} className="px-4 py-3 rounded-full bg-red-600 text-white font-bold text-xs hover:bg-red-500">END</button>
                           </div>
                       </div>
                   )}
               </div>

               {showInviteModal && (
                   <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end">
                       <div className="bg-[#1a1a1a] rounded-t-2xl max-h-[70%] flex flex-col animate-fade-in-up">
                           <div className="p-4 border-b border-white/10 flex justify-between items-center"><h3 className="text-white font-bold">Invite to Co-host</h3><button onClick={() => setShowInviteModal(false)}><X size={20} className="text-white/50" /></button></div>
                           <div className="p-4 overflow-y-auto flex-1 space-y-4">
                               {contacts.map(contact => (
                                    <div key={contact.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3"><img src={contact.avatar} className="w-10 h-10 rounded-full bg-white/10" /><span className="text-white text-sm font-medium">{contact.name}</span></div>
                                        <button onClick={() => setLiveGuests(prev => [...prev, {id: Date.now().toString(), contactId: contact.id, name: contact.name, avatar: contact.avatar, isAudioOn: true, isVideoOn: true}])} className="px-4 py-1.5 rounded-full text-xs font-bold bg-teal-500 text-black hover:bg-teal-400">Invite</button>
                                    </div>
                               ))}
                           </div>
                       </div>
                   </div>
               )}
          </div>
      );
  }

  // Friends / Community Profile Page
  if (activeTab === 'friends') {
      return (
          <div className="w-full h-full bg-[#050505] flex flex-col text-white pb-[60px] overflow-y-auto">
              <div className="p-4 flex items-center justify-between sticky top-0 bg-[#050505]/95 backdrop-blur z-20 border-b border-white/5">
                  <div className="flex items-center gap-2"><User size={20} /><h2 className="font-bold">My Circle</h2></div>
                  <div className="flex gap-4"><Search size={20} /><Settings size={20} onClick={() => onNavigate('settings')} className="cursor-pointer" /></div>
              </div>
              <div className="p-6 flex flex-col items-center border-b border-white/5 relative">
                  <div className="w-24 h-24 rounded-full border-2 border-teal-500 p-1 mb-3 relative"><img src="https://picsum.photos/200" className="w-full h-full rounded-full object-cover" /></div>
                  <h1 className="text-xl font-bold mb-1 flex items-center gap-1">Traveler <Zap size={14} className="text-amber-400 fill-amber-400" /></h1>
                  <p className="text-white/50 text-sm mb-4 font-mono">@aura_traveler</p>
                  <div className="flex gap-8 mb-6">
                      <div className="text-center"><span className="block font-bold text-lg">142</span><span className="text-xs text-white/50">Following</span></div>
                      <div className="text-center"><span className="block font-bold text-lg">8.5k</span><span className="text-xs text-white/50">Followers</span></div>
                      <div className="text-center"><span className="block font-bold text-lg">12k</span><span className="text-xs text-white/50">Likes</span></div>
                  </div>
              </div>
          </div>
      );
  }

  // Main Flow View
  return (
    <div className="relative w-full h-full bg-black flex flex-col">
        {!clearMode && (
            <div className="absolute top-0 left-0 w-full z-40 flex items-center justify-between px-4 py-8 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
                 <button onClick={() => onNavigate('Echoes')} className="text-white/80 hover:text-white pointer-events-auto bg-black/20 rounded-full p-2 backdrop-blur-sm"><ArrowLeft size={24} /></button>
                <div className="flex items-center gap-4 text-white font-medium pointer-events-auto">
                    <button onClick={() => setActiveTab('following')} className={`text-base transition-opacity ${activeTab === 'following' ? 'opacity-100 font-bold border-b-2 border-white pb-1' : 'opacity-60 hover:opacity-80'}`}>Following</button>
                    <div className="w-[1px] h-4 bg-white/20" />
                    <button onClick={() => setActiveTab('foryou')} className={`text-base transition-opacity ${activeTab === 'foryou' ? 'opacity-100 font-bold border-b-2 border-white pb-1' : 'opacity-60 hover:opacity-80'}`}>For You</button>
                </div>
                <button className="text-white/80 hover:text-white pointer-events-auto"><Search size={24} /></button>
            </div>
        )}
        
         {!clearMode && (
             <button onClick={() => setIsLiveMode(true)} className="absolute top-24 left-4 z-40 text-white/80 hover:text-white relative pointer-events-auto flex flex-col items-center gap-1">
                <div className="relative"><Tv size={28} /><span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse border border-black"></span></div>
                <span className="text-[10px] font-bold bg-pink-500 px-1.5 rounded text-white shadow-lg">LIVE</span>
            </button>
         )}

        <div ref={containerRef} className="w-full flex-1 overflow-y-scroll snap-y snap-mandatory scrollbar-hide bg-black relative" onClick={() => setClearMode(!clearMode)}>
            {videoPosts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/30"><Play size={48} className="mb-4 opacity-50" /><p>No Flow content available.</p></div>
            ) : (
                videoPosts.map((post) => (
                    <ReelItem key={post.id} post={post} author={getAuthor(post.authorId) as any} isActive={activeVideoId === post.id} muted={muted} speed={playbackSpeed} clearMode={clearMode} onToggleMute={() => setMuted(!muted)} onLike={() => onLike(post.id)} onGift={() => setShowGiftDrawer(true)} />
                ))
            )}
        </div>

        {!clearMode && (
             <div className="absolute top-24 right-4 z-40 flex flex-col gap-4">
                 <button onClick={toggleSpeed} className="w-8 h-8 rounded-full bg-black/20 backdrop-blur text-white text-[10px] font-bold flex items-center justify-center border border-white/10">{playbackSpeed}x</button>
                 <button onClick={() => setClearMode(true)} className="w-8 h-8 rounded-full bg-black/20 backdrop-blur text-white/70 flex items-center justify-center border border-white/10"><Maximize2 size={14} /></button>
             </div>
        )}

        <div className={`h-[60px] bg-black text-white flex justify-around items-center border-t border-white/10 z-50 transition-transform duration-300 ${clearMode ? 'translate-y-full' : 'translate-y-0'}`}>
            <NavButton icon={<Layers size={24} />} label="Echoes" onClick={() => onNavigate('pulse')} />
            <NavButton icon={<Users size={24} />} label="Friends" active={activeTab === 'friends'} onClick={() => setActiveTab('friends')} />
            <button onClick={() => setShowCreate(true)} className="relative w-12 h-8 flex items-center justify-center hover:scale-105 transition-transform"><div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-lg opacity-80" /><div className="absolute inset-[2px] bg-white rounded-md flex items-center justify-center"><Plus size={20} className="text-black" /></div></button>
            <NavButton icon={<Inbox size={24} />} label="Orbit" onClick={() => onNavigate('orbit')} />
            <NavButton icon={<User size={24} />} label="Persona" onClick={() => onNavigate('profile')} />
        </div>

        {/* Gift Drawer */}
        {(showGiftDrawer) && (
             <div className="absolute inset-0 z-[60] bg-black/50 backdrop-blur-sm flex flex-col justify-end" onClick={() => setShowGiftDrawer(false)}>
                 <div className="bg-[#1a1a1a] rounded-t-3xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="text-white font-bold flex items-center gap-2"><Gift size={18} className="text-pink-400" /> Send a Gift</h3>
                         <div onClick={() => { setShowGiftDrawer(false); setShowWallet(true); }} className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full cursor-pointer hover:bg-white/20">
                             <Coins size={14} className="text-amber-400" /><span className="text-white text-xs font-bold">{auraCoins}</span>
                         </div>
                     </div>
                     <div className="grid grid-cols-4 gap-4">
                         {GIFTS.map(gift => (
                             <button key={gift.id} onClick={() => handleSendGift(gift)} className="flex flex-col items-center gap-2 p-2 hover:bg-white/5 rounded-xl transition-colors">
                                 <div className="text-4xl">{gift.icon}</div>
                                 <span className="text-xs text-white/60 font-medium">{gift.name}</span>
                                 <div className="flex items-center gap-0.5 text-[10px] text-amber-400 font-bold"><Coins size={8} /> {gift.cost}</div>
                             </button>
                         ))}
                     </div>
                 </div>
             </div>
        )}
        
        {/* Wallet Modal */}
        <WalletModal isOpen={showWallet} onClose={() => setShowWallet(false)} balance={auraCoins} onBuy={(pkg) => { onBuyCoins(pkg); setShowWallet(false); }} />
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }: any) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-0.5 w-16 ${active ? 'text-white' : 'text-white/50 hover:text-white'}`}>{icon}<span className="text-[10px] font-medium">{label}</span></button>
);

const ReelItem: React.FC<any> = ({ post, author, isActive, muted, speed, clearMode, onToggleMute, onLike, onGift }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isActive) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    // console.log("Auto-play prevented/interrupted", error);
                    setIsPlaying(false);
                });
            }
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }

        // Cleanup: pause on unmount or inactive
        return () => {
             video.pause();
        }
    }, [isActive]);
    
    useEffect(() => {
        if (videoRef.current) videoRef.current.playbackRate = speed;
    }, [speed]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            if (videoRef.current) {
                setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [isPlaying]);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            const playPromise = video.play();
             if (playPromise !== undefined) {
                playPromise.catch(() => {});
            }
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    return (
        <div className="w-full h-full snap-start relative flex items-center justify-center bg-[#111] reel-container border-b border-white/5 overflow-hidden" data-id={post.id}>
            <div className="absolute inset-0 z-0" onClick={togglePlay} onDoubleClick={(e) => { e.stopPropagation(); onLike(); }}>
                <video ref={videoRef} src={post.videoUrl} className="w-full h-full object-cover" loop muted={muted} playsInline />
                {!isPlaying && <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none"><Play size={64} className="text-white/80 fill-white/20" /></div>}
            </div>

            <div className={`absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 pointer-events-none z-10 transition-opacity duration-300 ${clearMode ? 'opacity-0' : 'opacity-100'}`} />

            <div className={`absolute bottom-0 left-0 w-full h-1 bg-white/20 z-30 ${clearMode ? 'opacity-0' : 'opacity-100'}`}>
                <div className="h-full bg-white transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>

            <div className={`absolute bottom-20 right-2 z-20 flex flex-col items-center gap-5 pb-4 transition-transform duration-300 ${clearMode ? 'translate-x-20' : 'translate-x-0'}`}>
                <div className="relative mb-2 cursor-pointer">
                    <div className="w-12 h-12 rounded-full border border-white overflow-hidden"><img src={author.avatar} className="w-full h-full object-cover" /></div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-pink-500 rounded-full w-5 h-5 flex items-center justify-center border border-white"><span className="text-white text-lg leading-none mb-0.5">+</span></div>
                </div>
                <ActionBtn icon={<Heart size={32} fill={post.likedByMe ? 'currentColor' : 'rgba(0,0,0,0.2)'} />} label={post.likes} active={post.likedByMe} onClick={(e: any) => { e.stopPropagation(); onLike(); }} color="text-red-500" />
                <ActionBtn icon={<MessageCircle size={32} fill="rgba(0,0,0,0.2)" />} label={post.comments.length} onClick={(e: any) => { e.stopPropagation(); setShowComments(true); }} />
                <ActionBtn icon={<Bookmark size={32} fill="rgba(0,0,0,0.2)" />} label="Save" onClick={(e: any) => e.stopPropagation()} color="text-yellow-400" />
                <ActionBtn icon={<Share2 size={32} fill="rgba(0,0,0,0.2)" />} label="Share" onClick={(e: any) => e.stopPropagation()} />
                <ActionBtn icon={<Gift size={32} />} label="Gift" onClick={(e: any) => { e.stopPropagation(); onGift(); }} />
                <div className={`mt-4 w-12 h-12 rounded-full bg-[#222] border-[6px] border-[#111] overflow-hidden flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
                     <img src={post.musicTrack?.cover || author.avatar} className="w-7 h-7 rounded-full object-cover" />
                </div>
            </div>

            <div className={`absolute bottom-6 left-4 right-20 z-20 text-white pointer-events-none pb-2 transition-transform duration-300 ${clearMode ? 'translate-y-20' : 'translate-y-0'}`}>
                <div className="mb-2"><span className="font-bold text-base shadow-black drop-shadow-md mr-2 text-white">@{author.name.replace(/\s/g, '').toLowerCase()}</span><span className="text-sm font-light text-white/90 drop-shadow-md">{post.content}</span></div>
                <div className="flex items-center gap-2 mb-2"><Music size={14} className="text-white animate-pulse" /><div className="overflow-hidden w-40"><p className="whitespace-nowrap text-sm font-medium animate-marquee">{post.musicTrack ? `${post.musicTrack.title} - ${post.musicTrack.artist}` : `Original Sound - ${author.name}`}</p></div></div>
            </div>

            {!clearMode && <button onClick={(e) => { e.stopPropagation(); onToggleMute(); }} className="absolute top-24 right-4 z-20 p-2 bg-black/20 backdrop-blur-lg rounded-full text-white/80 hover:bg-black/40">{muted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>}
            
            {showComments && (
                <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col justify-end" onClick={(e) => { e.stopPropagation(); setShowComments(false); }}>
                    <div className="bg-[#1a1a1a] rounded-t-2xl p-4 h-[60%] flex flex-col animate-slide-up" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2"><span className="text-xs font-bold text-white text-center flex-1">{post.comments.length} comments</span><button onClick={() => setShowComments(false)}><X size={16} className="text-white" /></button></div>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                             {post.comments.map(c => (
                                 <div key={c.id} className="flex gap-3"><div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden"><img src={`https://picsum.photos/50?random=${c.id}`} className="w-full h-full object-cover" /></div><div className="flex-1"><span className="text-xs font-bold text-white/70 block">{c.authorName}</span><span className="text-sm text-white">{c.text}</span></div><Heart size={14} className="text-white/30" /></div>
                             ))}
                        </div>
                        <div className="mt-2 flex items-center gap-2 border-t border-white/10 pt-2"><input value={commentText} onChange={e => setCommentText(e.target.value)} className="flex-1 bg-white/5 rounded-full px-4 py-2 text-sm text-white outline-none" placeholder="Add comment..." /><button className="text-teal-400 font-bold text-xs">Post</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ActionBtn = ({ icon, label, active, onClick, color = 'text-white' }: any) => (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group"><div className={`p-2 transition-transform group-hover:scale-110 ${active ? color : 'text-white'}`}>{icon}</div><span className="text-xs font-semibold text-white drop-shadow-md">{label}</span></button>
);

export default ReelsView;
