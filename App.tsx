
import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, Contact, MoodType, Message, CallState, UserSettings, SocialNotification, Artifact, Post, Story, FilterType, Folder, ScheduledMessage, TelegramFeatures, CalendarEvent, Product, Toast, MOOD_COLORS, CoinPackage } from './types';
import OrbitView from './components/OrbitView';
import ChatView from './components/ChatView';
import EchoesView from './components/EchoesView';
import SettingsView from './components/SettingsView';
import CallOverlay from './components/CallOverlay';
import MoodSelector from './components/MoodSelector';
import GodModePanel from './components/GodModePanel';
import BackgroundParticles from './components/BackgroundParticles';
import ArtifactsView from './components/ArtifactsView';
import ReelsView from './components/ReelsView';
import PersonaView from './components/PersonaView';
import ToastContainer from './components/Toast';
import LandingView from './components/LandingView';
import AuthView from './components/AuthView';
import ProfileSetupView from './components/ProfileSetupView';
import WalletModal from './components/WalletModal';
import AuraStudio from './components/AuraStudio';
import { persistence } from './services/persistence';
import { INITIAL_CONTACTS, INITIAL_PRODUCTS, INITIAL_EVENTS, INITIAL_SETTINGS, INITIAL_CHAT_HISTORY, INITIAL_POSTS, INITIAL_STORIES, INITIAL_NOTIFICATIONS } from './services/mockData';
import { MessageSquare, Clapperboard, Users, Settings as SettingsIcon, Hexagon, Layers, ArrowLeft, Menu, Search, MoreVertical, LogOut, Archive, ShoppingBag, PieChart, Clock, Radio, Crown, Monitor, Activity, User, Inbox, PlayCircle, Zap, Shield, Camera, Mic, MapPin, Bell, HardDrive, Layout, RefreshCw } from 'lucide-react';
import { crystallizeMessageArtifact, generateReply } from './services/geminiService';

const AuraLogo = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-teal-400">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" className="animate-pulse" />
    <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const App: React.FC = () => {
  // --- STATE ---
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => persistence.load('auth', false));
  
  const [view, setView] = useState<ViewState>(() => isAuthenticated ? 'feed' : 'landing');
  const [activeTab, setActiveTab] = useState<'pulse' | 'bazaar' | 'flow' | 'persona' | 'orbit'>('pulse'); 
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [userMood, setUserMood] = useState<MoodType>('neutral');
  const [isMoodSelectorOpen, setIsMoodSelectorOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // UI State for Global Header
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupMembers, setNewGroupMembers] = useState<string[]>([]);
  
  // God Mode
  const [isGodMode, setIsGodMode] = useState(false);
  const [godModeClicks, setGodModeClicks] = useState(0);

  // System Initialization State
  const [hasInitialized, setHasInitialized] = useState(false);
  const [initStep, setInitStep] = useState(0);

  // Wallet State
  const [showWallet, setShowWallet] = useState(false);

  // DATA STATE - Loaded from Persistence
  const [contacts, setContacts] = useState<Contact[]>(() => persistence.load('contacts', INITIAL_CONTACTS));
  const [products, setProducts] = useState<Product[]>(() => persistence.load('products', INITIAL_PRODUCTS));
  const [events, setEvents] = useState<CalendarEvent[]>(() => persistence.load('events', INITIAL_EVENTS));
  const [settings, setSettings] = useState<UserSettings>(() => persistence.load('settings', INITIAL_SETTINGS));
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>(() => persistence.load('chatHistory', INITIAL_CHAT_HISTORY));
  const [posts, setPosts] = useState<Post[]>(() => persistence.load('posts', INITIAL_POSTS));
  const [stories, setStories] = useState<Story[]>(() => persistence.load('stories', INITIAL_STORIES));
  const [notifications, setNotifications] = useState<SocialNotification[]>(() => persistence.load('notifications', INITIAL_NOTIFICATIONS));
  const [artifacts, setArtifacts] = useState<Artifact[]>(() => persistence.load('artifacts', []));
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>(() => persistence.load('scheduledMessages', []));

  // Ephemeral State (Not Persisted)
  const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({});
  const [callState, setCallState] = useState<CallState>({ isActive: false, status: 'ended', type: 'audio', contact: null, isMuted: false, isVideoEnabled: true });

  // --- PERSISTENCE EFFECT ---
  useEffect(() => { persistence.save('auth', isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { persistence.save('contacts', contacts); }, [contacts]);
  useEffect(() => { persistence.save('products', products); }, [products]);
  useEffect(() => { persistence.save('events', events); }, [events]);
  useEffect(() => { persistence.save('settings', settings); }, [settings]);
  useEffect(() => { persistence.save('chatHistory', chatHistory); }, [chatHistory]);
  useEffect(() => { persistence.save('posts', posts); }, [posts]);
  useEffect(() => { persistence.save('stories', stories); }, [stories]);
  useEffect(() => { persistence.save('notifications', notifications); }, [notifications]);
  useEffect(() => { persistence.save('artifacts', artifacts); }, [artifacts]);
  useEffect(() => { persistence.save('scheduledMessages', scheduledMessages); }, [scheduledMessages]);

  // --- TOAST HELPERS ---
  const showToast = (message: string, type: Toast['type'] = 'info') => {
      const newToast: Toast = { id: Date.now().toString(), message, type };
      setToasts(prev => [...prev, newToast]);
  };
  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  // --- AUTH HANDLERS ---
  const handleLandingStart = () => {
      setView('auth');
  };

  const handleLogin = (data: any) => {
      // Simulate Login Logic
      showToast(`Welcome back, ${data.identifier}`, 'success');
      setIsAuthenticated(true);
      setView('feed');
  };

  const handleSignup = (data: any) => {
      // Update Settings with new user data
      setSettings(prev => ({
          ...prev,
          name: `${data.firstName} ${data.lastName}`,
          username: data.username,
          email: data.email,
          phoneNumber: data.phone,
          dob: data.dob,
          gender: data.gender
      }));
      setView('profile-setup');
  };

  const handleProfileSetupComplete = (avatar: string, bio: string) => {
      setSettings(prev => ({
          ...prev,
          avatar: avatar,
          about: bio
      }));
      setIsAuthenticated(true);
      setView('feed');
      showToast('Identity Crystallized', 'success');
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      persistence.clear(); // Or just set auth to false if you want to keep data
      setView('landing');
  };

  // --- COIN HANDLERS ---
  const handleSpendCoins = (amount: number): boolean => {
      if ((settings.auraCoins || 0) >= amount) {
          setSettings(prev => ({ ...prev, auraCoins: (prev.auraCoins || 0) - amount }));
          showToast(`Spent ${amount} Aura Coins`, 'success');
          return true;
      } else {
          showToast("Insufficient Aura Coins", 'error');
          return false;
      }
  };

  const handleBuyCoins = (pkg: CoinPackage) => {
      const totalCoins = pkg.coins + (pkg.bonus || 0);
      setSettings(prev => ({ ...prev, auraCoins: (prev.auraCoins || 0) + totalCoins }));
      showToast(`Recharged ${totalCoins} Aura Coins!`, 'success');
      setShowWallet(false);
  };

  // --- APP HANDLERS ---

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setView('chat');
    if (!chatHistory[contact.id]) {
        setChatHistory(prev => ({ ...prev, [contact.id]: [] }));
    }
  };

  const handleSendMessage = async (text: string, replyTo?: Message, type: any = 'text', extra: any = {}) => {
      if (!selectedContact) return;
      const contactId = selectedContact.id;
      
      const newMessage: Message = {
        id: Date.now().toString(),
        text: text,
        sender: 'me',
        timestamp: Date.now(),
        status: 'sent',
        isCrystallized: false,
        type: type,
        sentiment: 'neutral',
        reactions: [],
        replyTo: replyTo ? { id: replyTo.id, text: replyTo.text, sender: replyTo.sender } : undefined,
        ...extra
      };

      setChatHistory(prev => ({
          ...prev,
          [contactId]: [...(prev[contactId] || []), newMessage]
      }));

      setContacts(prev => prev.map(c => c.id === contactId ? { ...c, lastMessage: text, lastSeen: Date.now() } : c));

      // Simulate AI
      if (!selectedContact.isGroup) {
          setTypingStatus(prev => ({ ...prev, [contactId]: true }));
          const currentHistory = [...(chatHistory[contactId] || []), newMessage];
          
          // Realistic delay: 2s to 6s
          const randomDelay = Math.floor(Math.random() * 4000) + 2000;
          
          setTimeout(async () => {
              const replyText = await generateReply(selectedContact, currentHistory, userMood);
              const replyMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: replyText,
                sender: 'them',
                timestamp: Date.now(),
                status: 'read',
                isCrystallized: false,
                type: 'text',
                sentiment: 'neutral',
                reactions: []
              };
              setChatHistory(prev => ({ ...prev, [contactId]: [...(prev[contactId] || []), replyMessage] }));
              setContacts(prev => prev.map(c => c.id === contactId ? { ...c, lastMessage: replyText, lastSeen: Date.now() } : c));
              setTypingStatus(prev => ({ ...prev, [contactId]: false }));
          }, randomDelay);
      }
  };

  const handleScheduleMessage = (text: string, time: number) => {
      if (!selectedContact) return;
      setScheduledMessages(prev => [...prev, {
          id: Date.now().toString(),
          chatId: selectedContact.id,
          text,
          scheduledFor: time
      }]);
      showToast("Message Scheduled", 'success');
  };

  const handleDeleteMessage = (msgId: string) => {
      if (!selectedContact) return;
      setChatHistory(prev => ({
          ...prev,
          [selectedContact.id]: prev[selectedContact.id].filter(m => m.id !== msgId)
      }));
      showToast("Message deleted", 'info');
  };
  
  const handleAcknowledgeMessage = (msgId: string) => {
      if (!selectedContact) return;
      setChatHistory(prev => ({
          ...prev,
          [selectedContact.id]: prev[selectedContact.id].map(m => m.id === msgId ? { ...m, status: 'received_with_love' } : m)
      }));
      showToast("Acknowledged with Love", 'success');
  };
  
  const handleStarMessage = (msgId: string) => {
      if (!selectedContact) return;
      setChatHistory(prev => ({
          ...prev,
          [selectedContact.id]: prev[selectedContact.id].map(m => m.id === msgId ? { ...m, isStarred: !m.isStarred } : m)
      }));
  };

  const handleMessageReaction = (msgId: string, emoji: string) => {
      if (!selectedContact) return;
      setChatHistory(prev => {
          const conversation = prev[selectedContact.id] || [];
          return {
              ...prev,
              [selectedContact.id]: conversation.map(msg => {
                  if (msg.id === msgId) {
                      const existingReactions = msg.reactions || [];
                      const existingReactionIndex = existingReactions.findIndex(r => r.emoji === emoji);
                      let newReactions;
                      if (existingReactionIndex >= 0) {
                          const reaction = existingReactions[existingReactionIndex];
                          if (reaction.me) {
                              if (reaction.count <= 1) newReactions = existingReactions.filter(r => r.emoji !== emoji);
                              else newReactions = existingReactions.map(r => r.emoji === emoji ? { ...r, count: r.count - 1, me: false } : r);
                          } else {
                              newReactions = existingReactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, me: true } : r);
                          }
                      } else {
                          newReactions = [...existingReactions, { emoji, count: 1, me: true }];
                      }
                      return { ...msg, reactions: newReactions };
                  }
                  return msg;
              })
          };
      });
  };

  const handleLikePost = (postId: string, reaction: string) => {
      setPosts(prev => prev.map(p => {
          if (p.id === postId) {
              const newLikedState = !p.likedByMe;
              return { ...p, likedByMe: newLikedState, likes: newLikedState ? p.likes + 1 : p.likes - 1, myReaction: newLikedState ? reaction : undefined };
          }
          return p;
      }));
  };

  const handleCommentPost = (postId: string, text: string) => {
      setPosts(prev => prev.map(p => {
          if (p.id === postId) {
              return { ...p, comments: [...p.comments, { id: Date.now().toString(), authorId: 'me', authorName: settings.name, text, timestamp: Date.now() }] };
          }
          return p;
      }));
  };

  const handleCreatePost = (text: string, image?: string, filter?: FilterType) => {
      const newPost: Post = {
          id: Date.now().toString(), authorId: 'me', content: text, type: image ? 'image' : 'text', image: image, filter: filter, likes: 0, comments: [], timestamp: Date.now(), likedByMe: false
      };
      setPosts(prev => [newPost, ...prev]);
      showToast("Post published", 'success');
  };

  const handleCreateProduct = (product: Partial<Product>) => {
      const newProduct: Product = {
          id: Date.now().toString(),
          sellerId: 'me',
          title: product.title || 'New Item',
          price: product.price || 0,
          currency: settings.marketplaceSettings.currency,
          image: product.image || 'https://picsum.photos/300',
          description: product.description || '',
          category: product.category || 'Physical',
          location: 'Remote',
          condition: 'new',
          rating: 0,
          reviews: 0
      };
      setProducts(prev => [newProduct, ...prev]);
      showToast("Product listed", 'success');
  };

  const handleCreateEvent = (event: Partial<CalendarEvent>) => {
      const newEvent: CalendarEvent = {
          id: Date.now().toString(),
          organizerId: 'me',
          title: event.title || 'New Event',
          description: event.description || '',
          startTime: event.startTime || Date.now() + 3600000,
          location: event.location || 'TBD',
          image: event.image || 'https://picsum.photos/800/400',
          attendees: ['me'],
          interested: []
      };
      setEvents(prev => [...prev, newEvent]);
      showToast("Event created", 'success');
  };
  
  const handleCreateGroup = () => {
      if (!newGroupName || newGroupMembers.length === 0) return;
      const newGroup: Contact = {
          id: Date.now().toString(),
          name: newGroupName,
          mood: 'energetic',
          affinity: 1,
          avatar: `https://ui-avatars.com/api/?name=${newGroupName}&background=random`,
          isGroup: true,
          members: newGroupMembers,
          lastMessage: 'Group Created',
          isOnline: true
      };
      setContacts(prev => [newGroup, ...prev]);
      setShowNewGroupModal(false);
      setNewGroupName('');
      setNewGroupMembers([]);
      showToast("Orbit Group Initialized", 'success');
  };

  const handleTriggerGodMode = () => {
      setGodModeClicks(prev => {
          if (prev + 1 >= 5) { setIsGodMode(true); return 0; }
          return prev + 1;
      });
  };

  const handleUpdateGlobalMood = (mood: MoodType) => { 
      setContacts(prev => prev.map(c => ({ ...c, mood }))); 
      showToast(`Global Atmosphere: ${mood.toUpperCase()}`, 'info');
  };
  const handleUnlockAllQuantum = () => { alert("Quantum States Collapsed."); };
  const handleSimulateNotification = () => {
      const types: SocialNotification['type'][] = ['like', 'comment', 'follow'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
      const newNotif: SocialNotification = { id: Date.now().toString(), type: randomType, actorId: randomContact.id, timestamp: Date.now(), read: false, text: randomType === 'comment' ? 'The void stares back.' : undefined };
      setNotifications(prev => [newNotif, ...prev]);
      showToast("Simulated Signal Received", 'warning');
  };

  const handleCrystallize = async (msg: Message) => {
    const senderName = msg.sender === 'me' ? 'You' : selectedContact?.name || 'Them';
    const tempId = Date.now().toString();
    const tempArtifact: Artifact = { id: tempId, originalMessageId: msg.id, text: msg.text, senderName: senderName, poeticTag: "Crystallizing...", timestamp: msg.timestamp, mood: selectedContact?.mood || 'neutral' };
    setArtifacts(prev => [tempArtifact, ...prev]);
    if (selectedContact) handleDeleteMessage(msg.id);
    const { poeticTag } = await crystallizeMessageArtifact(msg.text, senderName);
    setArtifacts(prev => prev.map(a => a.id === tempId ? { ...a, poeticTag: poeticTag || "Memory" } : a));
    showToast("Memory Crystallized", 'success');
  };
  
  const handleUpgradeToPremium = () => {
      setSettings(prev => ({ ...prev, isPremium: true, subscriptionTier: 'supernova', badges: [...prev.badges, { type: 'supernova', label: 'Supernova' }] }));
      showToast("Supernova Status Unlocked", 'success');
  };
  
  const handleNavigation = (destination: string) => {
      if (destination === 'settings') {
          setView('settings');
      } else if (destination === 'studio') {
          setView('studio');
      } else if (destination === 'profile' || destination === 'persona') {
          setActiveTab('persona');
          setView('feed');
      } else if (['orbit', 'pulse', 'flow', 'bazaar'].includes(destination)) {
          setActiveTab(destination as any);
          setView('feed');
      } else if (destination === 'New Group') {
          setShowNewGroupModal(true);
      } else if (destination === 'Disconnect') {
          handleLogout();
      } else if (destination === 'Echoes') { 
          setActiveTab('pulse'); 
          setView('feed');
      }
      setIsMenuOpen(false);
  };

  const toggleMenu = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setIsMenuOpen(!isMenuOpen);
  };

  // Initialization Sequence
  const handleSystemInit = async () => {
      setInitStep(1); 
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          stream.getTracks().forEach(track => track.stop());
      } catch (e) { console.warn("Media permissions denied", e); }
      
      setInitStep(2); 
      try {
          await new Promise((resolve) => {
              navigator.geolocation.getCurrentPosition(resolve, resolve, { timeout: 3000 });
          });
      } catch (e) { console.warn("Geo permissions denied", e); }
      
      setInitStep(3); 
      if ('Notification' in window) {
          try {
              await Notification.requestPermission();
          } catch(e) { console.warn("Notification permission error", e); }
      }

      setInitStep(4); await new Promise(r => setTimeout(r, 600));
      setInitStep(5); await new Promise(r => setTimeout(r, 600));
      setInitStep(6);
      setTimeout(() => { setHasInitialized(true); showToast("Systems Online", 'success'); }, 1000);
  };

  const renderHomepageContent = () => {
      switch (activeTab) {
          case 'orbit':
              return (
                  <OrbitView 
                    contacts={contacts} 
                    onSelectContact={handleContactSelect} 
                    width={window.innerWidth} 
                    height={window.innerHeight} 
                    onTriggerGodMode={handleTriggerGodMode} 
                    isGodMode={isGodMode} 
                    filter={settings.telegramFeatures?.chatFolders.find(f => f.id === 'work')?.includedChats ? 'all' : undefined} 
                    onNavigate={handleNavigation} 
                    onCreateGroup={(name, members) => { setNewGroupName(name); setNewGroupMembers(members); handleCreateGroup(); }} 
                  />
              );
          case 'pulse':
              return <EchoesView posts={posts} stories={stories} contacts={contacts} currentUserAvatar={settings.avatar} onLikePost={handleLikePost} onCommentPost={handleCommentPost} onCreatePost={handleCreatePost} notifications={notifications} initialTab='echoes' onNavigate={handleNavigation} products={products} events={events} onCreateProduct={handleCreateProduct} onCreateEvent={handleCreateEvent} />;
          case 'flow':
              return (
                <ReelsView 
                    posts={posts} 
                    contacts={contacts} 
                    onLike={(id) => handleLikePost(id, '❤️')} 
                    onNavigate={handleNavigation}
                    auraCoins={settings.auraCoins || 0}
                    onSpendCoins={handleSpendCoins}
                    onBuyCoins={handleBuyCoins}
                />
              );
          case 'bazaar':
              return <EchoesView posts={posts} stories={stories} contacts={contacts} currentUserAvatar={settings.avatar} onLikePost={handleLikePost} onCommentPost={handleCommentPost} onCreatePost={handleCreatePost} notifications={notifications} initialTab='market' onNavigate={handleNavigation} products={products} events={events} onCreateProduct={handleCreateProduct} onCreateEvent={handleCreateEvent} />;
          case 'persona':
              return <PersonaView settings={settings} posts={posts} contacts={contacts} onNavigate={handleNavigation} />;
          default:
              return null;
      }
  };

  // --- RENDER VIEWS ---

  if (view === 'landing') {
      return <LandingView onStart={handleLandingStart} />;
  }

  if (view === 'auth') {
      return <AuthView onLogin={handleLogin} onSignup={handleSignup} />;
  }

  if (view === 'profile-setup') {
      return <ProfileSetupView username={settings.username} onComplete={handleProfileSetupComplete} />;
  }

  if (view === 'chat' && selectedContact) {
      return (
          <div className="w-full h-full bg-[#050505]">
            <BackgroundParticles mood={selectedContact.mood} />
            <ChatView 
                contact={selectedContact}
                userMood={userMood}
                messages={chatHistory[selectedContact.id] || []}
                isTyping={typingStatus[selectedContact.id] || false}
                onBack={() => setView('feed')}
                onCrystallize={handleCrystallize}
                onSendMessage={handleSendMessage}
                onDeleteMessage={handleDeleteMessage}
                onAcknowledge={handleAcknowledgeMessage}
                onReact={handleMessageReaction}
                onStartCall={(type) => setCallState({ isActive: true, status: 'connected', type, contact: selectedContact, isMuted: false, isVideoEnabled: true })}
                onUpdateContact={() => {}}
                onViewArtifacts={() => setView('artifacts')}
                onStarMessage={handleStarMessage}
            />
             <CallOverlay callState={callState} onEndCall={() => setCallState(prev => ({ ...prev, isActive: false }))} onToggleMute={() => setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }))} onToggleVideo={() => setCallState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }))} />
             <ToastContainer toasts={toasts} removeToast={removeToast} />
          </div>
      );
  }

  if (view === 'artifacts') {
      return (
        <div className="w-full h-full bg-[#050505] flex flex-col">
            <BackgroundParticles mood="neutral" />
            <div className="p-4 flex items-center gap-4 z-20">
                <button onClick={() => setView(selectedContact ? 'chat' : 'feed')} className="text-white/70 hover:text-white p-2 glass-panel rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-serif text-white tracking-widest">TREASURE BOX</h2>
            </div>
            <ArtifactsView artifacts={artifacts} />
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
      );
  }

  if (view === 'settings') {
      return (
          <div className="w-full h-full bg-[#050505]">
              <SettingsView 
                settings={settings} 
                onUpdate={setSettings} 
                onBack={() => { setView('feed'); setActiveTab('persona'); }} 
                onUpgrade={handleUpgradeToPremium}
                onOpenWallet={() => setShowWallet(true)}
              />
              <ToastContainer toasts={toasts} removeToast={removeToast} />
              <WalletModal isOpen={showWallet} onClose={() => setShowWallet(false)} balance={settings.auraCoins || 0} onBuy={handleBuyCoins} />
          </div>
      )
  }

  if (view === 'studio') {
      return (
          <AuraStudio onBack={() => { setView('feed'); setActiveTab('flow'); }} settings={settings} />
      );
  }

  // MAIN APP VIEW
  return (
    <div className="w-full h-screen flex flex-col bg-[#050505] text-white relative overflow-hidden">
        {isGodMode && (<><div className="god-rays" /><GodModePanel isOpen={isGodMode} onClose={() => setIsGodMode(false)} contacts={contacts} onUpdateGlobalMood={handleUpdateGlobalMood} onUnlockAllQuantum={handleUnlockAllQuantum} onSimulateNotification={handleSimulateNotification} onUpdateAffinity={(val) => {}} /></>)}
        <BackgroundParticles mood={userMood} />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <WalletModal isOpen={showWallet} onClose={() => setShowWallet(false)} balance={settings.auraCoins || 0} onBuy={handleBuyCoins} />
        
        {/* Initialization Overlay */}
        {!hasInitialized && (
            <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 animate-fade-in-up">
                <div className="mb-10 scale-150"><AuraLogo size={48} /></div>
                <h1 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-purple-200 mb-6 tracking-widest">INITIALIZING AURA</h1>
                
                {initStep === 0 && (
                    <div className="text-center max-w-md">
                        <p className="text-white/60 mb-8 leading-relaxed">
                            To create your digital sanctuary, Aura requires access to your sensory inputs. 
                            We establish a secure link to your Camera, Microphone, and Location to power the Flow and Pulse networks.
                        </p>
                        <button 
                            onClick={handleSystemInit}
                            className="px-8 py-3 bg-teal-500/20 text-teal-400 border border-teal-500/50 rounded-full font-bold tracking-widest hover:bg-teal-500 hover:text-black transition-all shadow-[0_0_30px_rgba(45,212,191,0.2)]"
                        >
                            ESTABLISH CONNECTION
                        </button>
                    </div>
                )}

                {initStep > 0 && (
                    <div className="space-y-4 w-64">
                        <div className={`flex items-center gap-4 transition-opacity ${initStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${initStep > 1 ? 'bg-green-500 text-black' : 'bg-white/10'}`}>
                                {initStep > 1 ? <Shield size={16} /> : <Camera size={16} />}
                            </div>
                            <span className="text-sm">Visual & Audio Sensors</span>
                        </div>
                        <div className={`flex items-center gap-4 transition-opacity ${initStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${initStep > 2 ? 'bg-green-500 text-black' : 'bg-white/10'}`}>
                                {initStep > 2 ? <Shield size={16} /> : <MapPin size={16} />}
                            </div>
                            <span className="text-sm">Spatial Anchoring</span>
                        </div>
                        <div className={`flex items-center gap-4 transition-opacity ${initStep >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${initStep > 3 ? 'bg-green-500 text-black' : 'bg-white/10'}`}>
                                {initStep > 3 ? <Shield size={16} /> : <Bell size={16} />}
                            </div>
                            <span className="text-sm">Neural Notifications</span>
                        </div>
                         <div className={`flex items-center gap-4 transition-opacity ${initStep >= 4 ? 'opacity-100' : 'opacity-30'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${initStep > 4 ? 'bg-green-500 text-black' : 'bg-white/10'}`}>
                                {initStep > 4 ? <Shield size={16} /> : <HardDrive size={16} />}
                            </div>
                            <span className="text-sm">Storage Access</span>
                        </div>
                         <div className={`flex items-center gap-4 transition-opacity ${initStep >= 5 ? 'opacity-100' : 'opacity-30'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${initStep > 5 ? 'bg-green-500 text-black' : 'bg-white/10'}`}>
                                {initStep > 5 ? <Shield size={16} /> : <Layout size={16} />}
                            </div>
                            <span className="text-sm">System Overlay</span>
                        </div>
                        {initStep === 6 && <div className="text-center text-teal-400 text-xs font-bold tracking-widest mt-4 animate-pulse">SYSTEM READY</div>}
                    </div>
                )}
            </div>
        )}

        {/* GLOBAL APP HEADER (For Homepage Views) */}
        {view === 'feed' && activeTab !== 'flow' && (
             <div className="pt-6 pb-2 px-4 flex flex-col gap-4 z-20 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm sticky top-0">
                {/* Top Bar */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <AuraLogo size={28} />
                        <h1 onClick={handleTriggerGodMode} className="text-2xl font-serif tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-purple-200 cursor-pointer select-none">
                            AURA
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                            <Search size={18} />
                        </button>
                        <button onClick={toggleMenu} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>

                {/* Custom Segmented Navigation - 5 Items Order: Echoes | Bazaar | Flow | Persona | Orbit */}
                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden backdrop-blur-md">
                    <div 
                        className="absolute top-1 bottom-1 bg-white/10 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300 ease-out border border-white/10"
                        style={{ 
                            width: '19%', 
                            left: activeTab === 'pulse' ? '0.5%' : 
                                  activeTab === 'bazaar' ? '20.5%' : 
                                  activeTab === 'flow' ? '40.5%' : 
                                  activeTab === 'persona' ? '60.5%' : '80.5%' 
                        }}
                    />

                    <NavSegment label="ECHOES" icon={<Layers size={14} />} active={activeTab === 'pulse'} onClick={() => setActiveTab('pulse')} />
                    <NavSegment label="BAZAAR" icon={<ShoppingBag size={14} />} active={activeTab === 'bazaar'} onClick={() => setActiveTab('bazaar')} />
                    <NavSegment label="FLOW" icon={<Clapperboard size={14} />} active={activeTab === 'flow'} onClick={() => setActiveTab('flow')} />
                    <NavSegment label="PERSONA" icon={<User size={14} />} active={activeTab === 'persona'} onClick={() => setActiveTab('persona')} />
                    <NavSegment label="ORBIT" icon={<Inbox size={14} />} active={activeTab === 'orbit'} onClick={() => setActiveTab('orbit')} />
                </div>
            </div>
        )}

        <div className="flex-1 overflow-hidden relative z-10">
            {renderHomepageContent()}
        </div>
        
        {/* Mood Selector Global */}
        <MoodSelector currentMood={userMood} onSelect={setUserMood} isOpen={isMoodSelectorOpen} onClose={() => setIsMoodSelectorOpen(false)} />
        
        {/* Floating Action Button (Only on Orbit) */}
        {activeTab === 'orbit' && (
             <button onClick={() => setIsMoodSelectorOpen(true)} className="absolute bottom-8 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 shadow-[0_0_20px_rgba(45,212,191,0.3)] flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all z-30 group">
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-full transition-opacity" />
                <div className="w-3 h-3 rounded-full bg-white" />
            </button>
        )}

        {/* 3-DOT DROPDOWN MENU (CONSOLIDATED) */}
        {isMenuOpen && (
            <div className="fixed top-16 right-4 w-72 glass-panel rounded-2xl shadow-2xl z-[60] py-2 animate-[fade-in-up_0.2s_ease-out] origin-top-right border border-white/10 max-h-[80vh] overflow-y-auto">
                {/* Profile Shortcut */}
                 <div className="px-4 py-3 flex items-center gap-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleNavigation('profile')}>
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                        <img src={settings.avatar} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="text-white font-medium text-sm">{settings.name}</h3>
                        <p className="text-white/40 text-xs">@{settings.username}</p>
                    </div>
                    <User size={16} className="ml-auto text-white/30" />
                </div>

                <div className="py-2">
                    <p className="px-4 py-1 text-[10px] uppercase tracking-widest text-white/30 font-bold">Navigation</p>
                    <DropdownItem label="Echoes Feed" icon={<Layers size={16} />} onClick={() => handleNavigation('pulse')} />
                    <DropdownItem label="Flow Stream" icon={<Clapperboard size={16} />} onClick={() => handleNavigation('flow')} />
                    <DropdownItem label="Aura Bazaar" icon={<ShoppingBag size={16} />} onClick={() => handleNavigation('bazaar')} />
                </div>

                <div className="border-t border-white/5 py-2">
                    <p className="px-4 py-1 text-[10px] uppercase tracking-widest text-white/30 font-bold">Essentials</p>
                    <DropdownItem label="New Orbit Group" icon={<Users size={16} />} onClick={() => handleNavigation('New Group')} />
                    <DropdownItem label="Archived Orbits" icon={<Archive size={16} />} onClick={() => handleNavigation('Archived')} />
                </div>

                <div className="border-t border-white/5 py-2">
                    <p className="px-4 py-1 text-[10px] uppercase tracking-widest text-white/30 font-bold">Pro Tools</p>
                    <DropdownItem label="Aura Settings" icon={<SettingsIcon size={16} />} onClick={() => handleNavigation('settings')} />
                    <DropdownItem label="Aura Studio" icon={<Zap size={16} className="text-pink-500" />} onClick={() => handleNavigation('studio')} />
                    <DropdownItem label="Scheduler" icon={<Clock size={16} />} onClick={() => handleNavigation('Scheduler')} />
                    <DropdownItem label="Auto Reply" icon={<Radio size={16} />} onClick={() => handleNavigation('Auto Reply')} />
                    <DropdownItem label="Analytics" icon={<PieChart size={16} />} onClick={() => handleNavigation('Business Tools')} />
                </div>

                <div className="border-t border-white/5 py-2">
                    <p className="px-4 py-1 text-[10px] uppercase tracking-widest text-white/30 font-bold">System</p>
                    <DropdownItem label="Linked Devices" icon={<Monitor size={16} />} onClick={() => handleNavigation('Linked Devices')} />
                    <DropdownItem label="Sever Link (Reset)" icon={<LogOut size={16} />} className="text-red-400 hover:text-red-300" onClick={() => handleNavigation('Disconnect')} />
                </div>
            </div>
        )}

         {/* New Group Modal */}
         {showNewGroupModal && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowNewGroupModal(false)}>
                <div className="glass-panel w-full max-w-md rounded-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b border-white/5">
                        <h3 className="text-white font-light text-xl tracking-wide">Form New Orbit</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <input 
                            className="w-full bg-black/40 p-4 rounded-xl text-white outline-none border border-white/10 focus:border-teal-500/50 transition-colors text-center text-lg"
                            placeholder="Name your constellation"
                            value={newGroupName}
                            onChange={e => setNewGroupName(e.target.value)}
                        />
                        <div className="max-h-60 overflow-y-auto pr-2">
                            <p className="text-white/30 text-[10px] mb-3 uppercase tracking-widest pl-1">Add Entities</p>
                            {contacts.filter(c => !c.isGroup).map(c => (
                                <div 
                                    key={c.id} 
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${newGroupMembers.includes(c.id) ? 'bg-teal-500/20 border border-teal-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                                    onClick={() => setNewGroupMembers(prev => prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id])}
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden grayscale"><img src={c.avatar} className="w-full h-full" /></div>
                                    <span className="text-sm">{c.name}</span>
                                    {newGroupMembers.includes(c.id) && <div className="ml-auto w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_10px_currentColor]" />}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 border-t border-white/5 flex gap-3 bg-black/20">
                        <button onClick={() => setShowNewGroupModal(false)} className="flex-1 py-3 text-white/50 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">Cancel</button>
                        <button onClick={handleCreateGroup} className="flex-1 py-3 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 rounded-lg text-xs uppercase tracking-widest font-bold border border-teal-500/30 transition-all">Initialize</button>
                    </div>
                </div>
            </div>
        )}

        {/* Backdrop for overlays */}
        {isMenuOpen && (
            <div className="fixed inset-0 bg-black/60 z-[55] backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsMenuOpen(false)} />
        )}
    </div>
  );
};

const NavSegment = ({ label, icon, active, onClick }: { label: string, icon: React.ReactNode, active: boolean, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`flex-1 py-2.5 flex flex-col items-center justify-center gap-1 relative z-10 transition-colors duration-300 ${active ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
    >
        <span className="mb-0.5">{icon}</span>
        <span className="text-[6px] sm:text-[8px] font-bold tracking-[0.1em]">{label}</span>
    </button>
);

const DropdownItem = ({ label, icon, className = "", onClick }: any) => (
    <div 
        onClick={onClick}
        className={`px-4 py-3 hover:bg-white/5 cursor-pointer text-white/80 text-sm flex items-center justify-between transition-colors ${className}`}
    >
        <span className="flex items-center gap-3">
            <span className="opacity-60">{icon}</span>
            {label}
        </span>
    </div>
);

export default App;
