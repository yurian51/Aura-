

import React, { useState, useCallback } from 'react';
import { UserSettings, Badge, SubscriptionTier, SystemConfiguration, MarketAddon, FacebookSettings, MarketplaceConfiguration, CreatorSettings, TelegramComprehensiveSettings } from '../types';
import { ArrowLeft, User, Users, Shield, Bell, Database, LogOut, Key, HelpCircle, FileText, Smartphone, Star, Crown, CheckCircle, Zap, Code, Gem, Monitor, Cpu, Music, Clapperboard, Video, Mic, Share2, Lock, Eye, Download, Globe, BarChart2, MessageSquare, Heart, Clock, Settings, Folder, Image as ImageIcon, Moon, Sun, Volume2, Save, Wifi, Battery, Radio, EyeOff, Smile, MapPin, Phone, Hash, Link, RefreshCw, Layers, Grid, Palette, Speaker, Terminal, Package, ShoppingBag, Sliders, ToggleLeft, ToggleRight, WifiOff, HardDrive, ShieldAlert, Activity, BookOpen, Briefcase, Award, Map as MapIcon, Navigation, Tag, Camera, UserPlus, Search, List, Filter, DollarSign, Truck, Gift, Play, Pause, AlertTriangle, Languages, RadioReceiver, Tv, Scissors, Facebook, Edit2, Wallet, TrendingUp, PieChart, ChevronRight } from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdate: (newSettings: UserSettings) => void;
  onBack: () => void;
  onUpgrade?: () => void;
  onOpenWallet?: () => void;
}

const MARKET_ADDONS: MarketAddon[] = [
    // Visuals
    { id: 'v1', name: 'Cyberpunk Theme', category: 'theme', price: 1.99, icon: '🌆', description: 'Neon lights and dark alleys', purchased: false },
    { id: 'v2', name: 'Nature Pack', category: 'theme', price: 'free', icon: '🌿', description: 'Forest sounds and green tints', purchased: true },
    { id: 'v3', name: 'Glitch Effects', category: 'visual', price: 0.99, icon: '📺', description: 'CRT distortion for chat bubbles', purchased: false },
    { id: 'v4', name: 'Trail Cursor', category: 'visual', price: 0.99, icon: '✨', description: 'Sparkles follow your touch', purchased: false },
    { id: 'v5', name: 'Glass UI', category: 'theme', price: 2.99, icon: '🧊', description: 'Ultra-frosted glass aesthetic', purchased: false },
    { id: 'v6', name: 'Retro 80s', category: 'theme', price: 1.49, icon: '📼', description: 'VHS aesthetics', purchased: false },
    { id: 'v7', name: 'Monospace Font', category: 'visual', price: 'free', icon: '📝', description: 'Coder vibe typography', purchased: true },
    { id: 'v8', name: 'Bubble Shapes', category: 'visual', price: 0.99, icon: '⚪', description: 'Custom message bubble geometry', purchased: false },
    { id: 'v9', name: 'Dynamic Weather', category: 'visual', price: 2.99, icon: '⛈️', description: 'Rain on your screen based on location', purchased: false },
    { id: 'v10', name: 'Solarized', category: 'theme', price: 1.99, icon: '☀️', description: 'Easy on the eyes day mode', purchased: false },
    
    // Audio
    { id: 'a1', name: 'Lo-Fi Beats', category: 'audio', price: 'free', icon: '🎧', description: 'Chill background music loop', purchased: true },
    { id: 'a2', name: 'Spatial SFX', category: 'audio', price: 4.99, icon: '🔊', description: '3D positioning for message alerts', purchased: false },
    { id: 'a3', name: 'Typewriter', category: 'audio', price: 0.99, icon: '⌨️', description: 'Mechanical keyboard typing sounds', purchased: false },
    { id: 'a4', name: 'Rain Ambience', category: 'audio', price: 1.99, icon: '🌧️', description: 'Continuous rain background', purchased: false },
    { id: 'a5', name: 'Synthwave', category: 'audio', price: 1.99, icon: '🎹', description: 'Retro futuristic notification pack', purchased: false },
    
    // Privacy & Tools
    { id: 'p1', name: 'Ghost Mask', category: 'privacy', price: 9.99, icon: '🎭', description: 'Complete digital invisibility', purchased: false },
    { id: 'p2', name: 'Voice Changer', category: 'tool', price: 4.99, icon: '🎤', description: 'Real-time voice modulation', purchased: false },
    { id: 'p3', name: 'Burner Number', category: 'privacy', price: 2.99, icon: '🔥', description: 'Temporary ID for chats', purchased: false },
    { id: 'p4', name: 'IP Cloak', category: 'privacy', price: 4.99, icon: '🛡️', description: 'Route traffic through Aura nodes', purchased: false },
    { id: 'p5', name: 'Bot API Key', category: 'tool', price: 'free', icon: '🤖', description: 'Developer access token', purchased: true },
    { id: 'p6', name: '4K Uploads', category: 'tool', price: 4.99, icon: '📹', description: 'Bypass compression algorithms', purchased: false },
    { id: 'p7', name: 'Group Boost', category: 'tool', price: 9.99, icon: '🚀', description: 'Increase group limit to 100k', purchased: false },
    { id: 'p8', name: 'Analytics Pro', category: 'tool', price: 4.99, icon: '📊', description: 'Deep chat insights', purchased: false },
    
    // Badges
    { id: 'b1', name: 'Angel Wings', category: 'badge', price: 9.99, icon: '👼', description: 'Exclusive profile flair', purchased: false },
    { id: 'b2', name: 'Demon Horns', category: 'badge', price: 9.99, icon: '😈', description: 'Exclusive profile flair', purchased: false },
    { id: 'b3', name: 'Cyber Eye', category: 'badge', price: 4.99, icon: '👁️', description: 'Exclusive profile flair', purchased: false },
    { id: 'b4', name: 'Patron', category: 'badge', price: 19.99, icon: '🎩', description: 'Show your support', purchased: false },
];

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onBack, onUpdate, onUpgrade, onOpenWallet }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'social' | 'store' | 'system' | 'flow' | 'advanced'>('profile');
  const [systemCategory, setSystemCategory] = useState<'display' | 'audio' | 'network' | 'storage' | 'security' | 'experimental'>('display');
  const [marketCategory, setMarketCategory] = useState<'all' | 'visual' | 'audio' | 'privacy' | 'tool'>('all');
  const [creatorCategory, setCreatorCategory] = useState<'tools' | 'privacy' | 'discovery' | 'playback' | 'wellbeing' | 'data'>('tools');

  const handleTierSelect = useCallback((tier: SubscriptionTier) => {
      if (tier === 'supernova') {
          onUpgrade && onUpgrade();
      }
      onUpdate({ ...settings, subscriptionTier: tier });
  }, [settings, onUpdate, onUpgrade]);

  // Generic handler for nested settings to ensure efficiency and type safety
  const updateNestedSetting = useCallback((parentKey: keyof UserSettings, childKey: string, value: any) => {
      onUpdate({
          ...settings,
          [parentKey]: {
              ...(settings[parentKey] as object),
              [childKey]: value
          }
      });
  }, [settings, onUpdate]);

  const filteredAddons = marketCategory === 'all' 
    ? MARKET_ADDONS 
    : MARKET_ADDONS.filter(a => a.category === marketCategory || (marketCategory === 'visual' && a.category === 'theme'));

  return (
    <div className="w-full h-full flex flex-col pt-4 bg-[#050505]">
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-20">
          <button onClick={onBack} className="text-white/70 hover:text-white p-2 glass-panel rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-6 ml-4 overflow-x-auto scrollbar-hide">
              {['profile', 'social', 'store', 'flow', 'advanced', 'system'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)} 
                    className={`text-sm font-medium tracking-wider uppercase transition-colors whitespace-nowrap ${activeTab === tab ? 'text-teal-400 border-b-2 border-teal-400 pb-1' : 'text-white/40 hover:text-white'}`}
                  >
                      {tab}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-6">
          
          {/* PROFILE TAB (Enhanced & Editable) */}
          {activeTab === 'profile' && (
              <div className="animate-fade-in-up space-y-6">
                <div className="glass-panel rounded-2xl p-8 flex flex-col items-center relative overflow-hidden group">
                    <div className="absolute top-4 right-4 text-white/20 hover:text-teal-400 cursor-pointer">
                        <Edit2 size={18} />
                    </div>

                    {/* Avatar Upload Simulation */}
                    <div className={`w-32 h-32 rounded-full p-1 mb-6 relative group cursor-pointer ${
                        settings.subscriptionTier === 'supernova' ? 'border-2 border-rose-400 shadow-[0_0_30px_rgba(251,113,133,0.3)]' : 
                        settings.subscriptionTier === 'nebula' ? 'border-2 border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.3)]' :
                        'border border-teal-500/30'
                    }`}>
                        <div className="w-full h-full rounded-full overflow-hidden bg-black/50 relative">
                            <img src={settings.avatar} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Camera size={24} className="text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1 w-full max-w-sm">
                        <input 
                            type="text" 
                            value={settings.name} 
                            onChange={(e) => onUpdate({ ...settings, name: e.target.value })}
                            className="bg-transparent text-2xl font-light text-white tracking-wide text-center outline-none border-b border-transparent focus:border-teal-500/50 transition-colors w-full"
                            placeholder="Your Name"
                        />
                        <div className="flex items-center gap-0.5 text-teal-400 text-sm font-mono opacity-80">
                            <span>@</span>
                            <input 
                                type="text" 
                                value={settings.username} 
                                onChange={(e) => onUpdate({ ...settings, username: e.target.value })}
                                className="bg-transparent outline-none border-b border-transparent focus:border-teal-500/50 transition-colors w-32 text-center"
                                placeholder="username"
                            />
                        </div>
                    </div>
                    
                    <div className="mt-8 w-full max-w-md">
                        <label className="text-[10px] uppercase tracking-widest text-white/30 mb-2 block pl-2">About</label>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-3 focus-within:border-teal-500/30 transition-colors relative">
                             <textarea 
                                value={settings.about}
                                onChange={(e) => onUpdate({ ...settings, about: e.target.value })}
                                className="w-full bg-transparent text-white/80 text-sm font-serif italic text-center outline-none resize-none"
                                rows={2}
                                placeholder="Your bio..."
                            />
                        </div>
                    </div>

                    <div className="mt-6 w-full max-w-md">
                        <label className="text-[10px] uppercase tracking-widest text-white/30 mb-2 block pl-2">Phone</label>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                            <Phone size={16} className="text-white/40" />
                            <input 
                                type="text" 
                                value={settings.phoneNumber}
                                onChange={(e) => onUpdate({ ...settings, phoneNumber: e.target.value })}
                                className="bg-transparent text-white/80 text-sm outline-none w-full font-mono"
                                placeholder="+1 000 000 0000"
                            />
                        </div>
                    </div>
                </div>
              </div>
          )}

          {/* SOCIAL TAB (FACEBOOK FEATURES) */}
          {activeTab === 'social' && (
              <div className="animate-fade-in-up space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-600/20 mb-6">
                      <div className="flex items-center gap-3 mb-2">
                          <Users className="text-blue-400" size={24} />
                          <h2 className="text-lg font-bold text-white">Social Graph</h2>
                      </div>
                      <p className="text-xs text-white/60">Manage your digital identity, timeline, and connections.</p>
                  </div>

                  <h3 className="section-header text-blue-300/60"><User size={12} /> Profile Details</h3>
                  <div className="glass-panel rounded-xl overflow-hidden">
                      <SettingRow icon={<Briefcase size={18} />} title="Work" subtitle={settings.facebookSettings.workplace || "Add workplace"} />
                      <div className="separator" />
                      <SettingRow icon={<BookOpen size={18} />} title="Education" subtitle={settings.facebookSettings.education || "Add school"} />
                      <div className="separator" />
                      <SettingToggle icon={<Mic size={18} />} title="Name Pronunciation" subtitle="Help others say your name" checked={settings.facebookSettings.namePronunciation.length > 0} onToggle={() => {}} />
                      <div className="separator" />
                      <SettingToggle icon={<Music size={18} />} title="Music on Profile" subtitle="Feature a song" checked={settings.facebookSettings.musicOnProfile} onToggle={() => updateNestedSetting('facebookSettings', 'musicOnProfile', !settings.facebookSettings.musicOnProfile)} />
                      <div className="separator" />
                      <SettingToggle icon={<ImageIcon size={18} />} title="Featured Photos" subtitle="Showcase grid" checked={settings.facebookSettings.featuredPhotos} onToggle={() => updateNestedSetting('facebookSettings', 'featuredPhotos', !settings.facebookSettings.featuredPhotos)} />
                  </div>

                  <h3 className="section-header text-blue-300/60"><Shield size={12} /> Privacy</h3>
                  <div className="glass-panel rounded-xl overflow-hidden">
                      <SettingToggle icon={<Lock size={18} />} title="Profile Locking" subtitle="Only friends can see photos" checked={settings.facebookSettings.profileLock} onToggle={() => updateNestedSetting('facebookSettings', 'profileLock', !settings.facebookSettings.profileLock)} />
                      <div className="separator" />
                      <SettingToggle icon={<Camera size={18} />} title="Face Recognition" subtitle="Recognize me in photos" checked={settings.facebookSettings.faceRecognition} onToggle={() => updateNestedSetting('facebookSettings', 'faceRecognition', !settings.facebookSettings.faceRecognition)} />
                      <div className="separator" />
                      <SettingToggle icon={<MapPin size={18} />} title="Location History" subtitle="Track places you go" checked={settings.facebookSettings.locationHistory} onToggle={() => updateNestedSetting('facebookSettings', 'locationHistory', !settings.facebookSettings.locationHistory)} />
                  </div>

                  <h3 className="section-header text-blue-300/60"><Tag size={12} /> Timeline & Tagging</h3>
                  <div className="glass-panel rounded-xl overflow-hidden">
                       <SettingToggle icon={<CheckCircle size={18} />} title="Review Tags" subtitle="Before appearing on timeline" checked={settings.facebookSettings.reviewTagsBeforeAppearing} onToggle={() => updateNestedSetting('facebookSettings', 'reviewTagsBeforeAppearing', !settings.facebookSettings.reviewTagsBeforeAppearing)} />
                       <div className="separator" />
                       <SettingToggle icon={<CheckCircle size={18} />} title="Review Posts" subtitle="Posts you're tagged in" checked={settings.facebookSettings.reviewPostsTaggedIn} onToggle={() => updateNestedSetting('facebookSettings', 'reviewPostsTaggedIn', !settings.facebookSettings.reviewPostsTaggedIn)} />
                  </div>
              </div>
          )}

          {/* STORE TAB (MARKET / BAZAAR) */}
          {activeTab === 'store' && (
              <div className="animate-fade-in-up space-y-8 pb-10">
                  <div className="text-center mb-8">
                      <h2 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-amber-200 mb-2">Aura Bazaar</h2>
                      <p className="text-white/40 text-xs tracking-widest uppercase">Global Marketplace & Seller Hub</p>
                  </div>
                  
                  {/* Balance / Wallet Entry */}
                  <div 
                    onClick={onOpenWallet}
                    className="glass-panel p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors border border-amber-500/20"
                  >
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/30">
                              <Wallet size={20} />
                          </div>
                          <div>
                              <h3 className="text-white font-bold text-sm">Balance</h3>
                              <p className="text-amber-400 font-mono text-xs">{settings.auraCoins.toLocaleString()} Coins</p>
                          </div>
                      </div>
                      <button className="px-4 py-1.5 bg-amber-500 text-black text-xs font-bold rounded-full hover:bg-amber-400">Recharge</button>
                  </div>

                  {/* Seller Dashboard */}
                  <div className="glass-panel p-6 rounded-2xl mb-8 border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                      <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-bold text-white flex items-center gap-2"><Briefcase size={18} className="text-teal-400" /> Seller Dashboard</h3>
                          <button 
                            onClick={() => updateNestedSetting('marketplaceSettings', 'sellerDashboard', !settings.marketplaceSettings.sellerDashboard)}
                            className={`text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wider transition-colors ${settings.marketplaceSettings.sellerDashboard ? 'bg-teal-500/20 text-teal-400' : 'bg-white/10 text-white/50'}`}
                          >
                             {settings.marketplaceSettings.sellerDashboard ? 'Active' : 'Disabled'}
                          </button>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-center">
                          {[
                              { label: 'Listings', val: '12' }, { label: 'Rating', val: '4.8' }, { label: 'Clicks', val: '85' }, { label: 'Sold', val: '$450' }
                          ].map(stat => (
                              <div key={stat.label} className="bg-white/5 rounded-xl p-3 flex flex-col items-center">
                                  <span className="text-2xl font-bold text-white mb-1">{stat.val}</span>
                                  <span className="text-[9px] uppercase tracking-widest text-white/50">{stat.label}</span>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Core Tiers */}
                  <h3 className="section-header"><Layers size={12} /> Core Resonance Packs</h3>
                  <div className="grid grid-cols-1 gap-6">
                      <div 
                        onClick={() => handleTierSelect('supernova')}
                        className={`glass-panel p-6 rounded-2xl relative group cursor-pointer border transition-all duration-500 overflow-hidden ${settings.subscriptionTier === 'supernova' ? 'border-amber-400/60 shadow-[0_0_40px_rgba(251,191,36,0.2)]' : 'border-amber-500/20 hover:border-amber-500/40'}`}
                      >
                           <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-rose-500/5 to-purple-500/5 opacity-50" />
                          <div className="flex justify-between items-start mb-4 relative z-10">
                              <div>
                                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-300 mb-1 flex items-center gap-2">Supernova <Zap size={16} className="text-amber-400" /></h3>
                                  <p className="text-xs text-amber-200/50">Omnipotent Access</p>
                              </div>
                              <div className="text-right">
                                  <span className="text-2xl font-light text-white">$19.99</span>
                              </div>
                          </div>
                          {settings.subscriptionTier === 'supernova' ? (
                              <div className="w-full py-2 bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-200 border border-amber-500/30 text-center text-xs uppercase tracking-widest rounded-lg">Active Resonance</div>
                          ) : (
                              <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-black font-bold hover:opacity-90 transition-opacity rounded-lg text-xs uppercase tracking-widest shadow-lg shadow-amber-900/50">Ignite Supernova</button>
                          )}
                      </div>
                  </div>

                  {/* Aura Bazaar Settings */}
                  <div className="pt-8 border-t border-white/5">
                      <h3 className="section-header mb-6"><ShoppingBag size={12} /> Marketplace Configuration</h3>
                      
                      <div className="glass-panel rounded-xl overflow-hidden mb-6">
                          <SettingToggle icon={<Truck size={18} />} title="Shipping" subtitle="Enable nationwide shipping" checked={settings.marketplaceSettings.shippingEnabled} onToggle={() => updateNestedSetting('marketplaceSettings', 'shippingEnabled', !settings.marketplaceSettings.shippingEnabled)} />
                          <div className="separator" />
                          <SettingToggle icon={<MapIcon size={18} />} title="Local Pickup" subtitle="Meetups & Drop-off" checked={settings.marketplaceSettings.localDelivery} onToggle={() => updateNestedSetting('marketplaceSettings', 'localDelivery', !settings.marketplaceSettings.localDelivery)} />
                          <div className="separator" />
                          <SettingToggle icon={<DollarSign size={18} />} title="Secure Checkout" subtitle="Enable Aura Pay" checked={settings.marketplaceSettings.secureCheckout} onToggle={() => updateNestedSetting('marketplaceSettings', 'secureCheckout', !settings.marketplaceSettings.secureCheckout)} />
                          <div className="separator" />
                          <SettingToggle icon={<Shield size={18} />} title="Purchase Protection" subtitle="Buyer coverage" checked={settings.marketplaceSettings.purchaseProtection} onToggle={() => updateNestedSetting('marketplaceSettings', 'purchaseProtection', !settings.marketplaceSettings.purchaseProtection)} />
                          <div className="separator" />
                          <SettingToggle icon={<Rocket size={18} />} title="Boost Listings" subtitle="Promote items automatically" checked={settings.marketplaceSettings.boostListings} onToggle={() => updateNestedSetting('marketplaceSettings', 'boostListings', !settings.marketplaceSettings.boostListings)} />
                      </div>

                      <h3 className="section-header mb-6"><Gift size={12} /> Digital Add-ons</h3>
                      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
                         {['all', 'visual', 'audio', 'privacy', 'tool'].map((cat) => (
                             <button
                                key={cat}
                                onClick={() => setMarketCategory(cat as any)}
                                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider whitespace-nowrap border ${marketCategory === cat ? 'bg-white/10 border-white/30 text-white' : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'}`}
                             >
                                 {cat}
                             </button>
                         ))}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {filteredAddons.map(item => (
                              <div key={item.id} className="glass-panel p-4 rounded-xl flex flex-col items-center text-center group hover:bg-white/5 cursor-pointer border border-white/5 hover:border-teal-500/30 transition-all">
                                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                                  <h4 className="text-white text-sm font-medium mb-1 truncate w-full">{item.name}</h4>
                                  <p className="text-white/40 text-[10px] mb-3 line-clamp-2">{item.description}</p>
                                  {item.purchased ? (
                                      <div className="mt-auto px-3 py-1 bg-teal-500/20 text-teal-400 rounded text-[10px] uppercase font-bold tracking-wider w-full">Owned</div>
                                  ) : (
                                      <button className="mt-auto px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] uppercase font-bold tracking-wider w-full transition-colors">
                                          {item.price === 'free' ? 'Get' : `$${item.price}`}
                                      </button>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {/* FLOW TAB (CREATOR TOOLS / AURA STUDIO) */}
          {activeTab === 'flow' && settings.creatorSettings && (
             <div className="animate-fade-in-up space-y-4">
                  {/* NOTE: Aura Studio Dashboard moved to 3-dots menu -> Aura Studio View */}
                  
                  {/* Category Nav */}
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 p-1">
                      {[
                          { id: 'tools', icon: <Clapperboard size={14} />, label: 'Config' },
                          { id: 'privacy', icon: <Lock size={14} />, label: 'Privacy' },
                          { id: 'discovery', icon: <Globe size={14} />, label: 'Discovery' },
                          { id: 'playback', icon: <Play size={14} />, label: 'Content' },
                          { id: 'wellbeing', icon: <Heart size={14} />, label: 'Wellbeing' },
                          { id: 'data', icon: <Database size={14} />, label: 'Data' },
                      ].map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setCreatorCategory(cat.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${creatorCategory === cat.id ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                          >
                              {cat.icon} {cat.label}
                          </button>
                      ))}
                  </div>

                  {creatorCategory === 'tools' && (
                      <div className="space-y-4">
                           <div className="glass-panel rounded-xl overflow-hidden">
                               <SettingToggle icon={<BarChart2 size={18} />} title="Analytics" subtitle="View insights" checked={settings.creatorSettings.analyticsEnabled} onToggle={() => updateNestedSetting('creatorSettings', 'analyticsEnabled', !settings.creatorSettings.analyticsEnabled)} />
                               <div className="separator" />
                               <SettingToggle icon={<MessageSquare size={18} />} title="Q&A" subtitle="Allow questions" checked={settings.creatorSettings.qaFeature} onToggle={() => updateNestedSetting('creatorSettings', 'qaFeature', !settings.creatorSettings.qaFeature)} />
                               <div className="separator" />
                               <SettingToggle icon={<DollarSign size={18} />} title="Video Gifts" subtitle="Receive diamonds on videos" checked={settings.creatorSettings.videoGifts} onToggle={() => updateNestedSetting('creatorSettings', 'videoGifts', !settings.creatorSettings.videoGifts)} />
                               <div className="separator" />
                               <SettingToggle icon={<Gift size={18} />} title="Live Gifts" subtitle="Receive during streams" checked={settings.creatorSettings.liveGifts} onToggle={() => updateNestedSetting('creatorSettings', 'liveGifts', !settings.creatorSettings.liveGifts)} />
                               <div className="separator" />
                               <SettingToggle icon={<ShoppingBag size={18} />} title="Shop Feature" subtitle="Display products" checked={settings.creatorSettings.shopFeature} onToggle={() => updateNestedSetting('creatorSettings', 'shopFeature', !settings.creatorSettings.shopFeature)} />
                               <div className="separator" />
                               <SettingToggle icon={<Music size={18} />} title="Copyright Check" subtitle="Pre-upload sound scan" checked={settings.creatorSettings.soundCopyrightCheck} onToggle={() => updateNestedSetting('creatorSettings', 'soundCopyrightCheck', !settings.creatorSettings.soundCopyrightCheck)} />
                               <div className="separator" />
                               <SettingToggle icon={<Tag size={18} />} title="Branded Content" subtitle="Disclosure tools" checked={settings.creatorSettings.brandedContentToggle} onToggle={() => updateNestedSetting('creatorSettings', 'brandedContentToggle', !settings.creatorSettings.brandedContentToggle)} />
                           </div>
                      </div>
                  )}

                  {creatorCategory === 'privacy' && (
                       <div className="space-y-4">
                            <h3 className="section-header text-pink-300/60">Interactions</h3>
                            <div className="glass-panel rounded-xl overflow-hidden">
                                <SettingToggle icon={<Download size={18} />} title="Allow Downloads" subtitle="Others can save your videos" checked={settings.creatorSettings.allowDownloads} onToggle={() => updateNestedSetting('creatorSettings', 'allowDownloads', !settings.creatorSettings.allowDownloads)} />
                                <div className="separator" />
                                <SettingToggle icon={<Filter size={18} />} title="Filter Comments" subtitle="Hide offensive/spam" checked={settings.creatorSettings.filterComments} onToggle={() => updateNestedSetting('creatorSettings', 'filterComments', !settings.creatorSettings.filterComments)} />
                            </div>
                       </div>
                  )}

                  {creatorCategory === 'discovery' && (
                       <div className="space-y-4">
                           <div className="glass-panel rounded-xl overflow-hidden">
                               <SettingToggle icon={<Lock size={18} />} title="Private Account" subtitle="Only approved followers" checked={settings.creatorSettings.privateAccount} onToggle={() => updateNestedSetting('creatorSettings', 'privateAccount', !settings.creatorSettings.privateAccount)} />
                               <div className="separator" />
                               <SettingToggle icon={<Activity size={18} />} title="Activity Status" subtitle="Show when you're active" checked={settings.creatorSettings.activityStatus} onToggle={() => updateNestedSetting('creatorSettings', 'activityStatus', !settings.creatorSettings.activityStatus)} />
                               <div className="separator" />
                               <SettingToggle icon={<UserPlus size={18} />} title="Suggest to Contacts" subtitle="Sync phone contacts" checked={settings.creatorSettings.suggestAccountToContacts} onToggle={() => updateNestedSetting('creatorSettings', 'suggestAccountToContacts', !settings.creatorSettings.suggestAccountToContacts)} />
                               <div className="separator" />
                               <SettingToggle icon={<Facebook size={18} />} title="Suggest to Facebook" subtitle="Sync FB friends" checked={settings.creatorSettings.suggestAccountToFacebook} onToggle={() => updateNestedSetting('creatorSettings', 'suggestAccountToFacebook', !settings.creatorSettings.suggestAccountToFacebook)} />
                           </div>
                       </div>
                  )}

                  {creatorCategory === 'playback' && (
                       <div className="space-y-4">
                           <div className="glass-panel rounded-xl overflow-hidden">
                               <SettingToggle icon={<Play size={18} />} title="Autoplay Videos" subtitle="On cellular data" checked={settings.creatorSettings.autoplayVideos} onToggle={() => updateNestedSetting('creatorSettings', 'autoplayVideos', !settings.creatorSettings.autoplayVideos)} />
                               <div className="separator" />
                               <SettingToggle icon={<Volume2 size={18} />} title="Open in Mute" subtitle="Start videos silently" checked={settings.creatorSettings.openInMute} onToggle={() => updateNestedSetting('creatorSettings', 'openInMute', !settings.creatorSettings.openInMute)} />
                               <div className="separator" />
                               <SettingToggle icon={<FileText size={18} />} title="Captions" subtitle="Auto-generated captions" checked={settings.creatorSettings.captionsEnabled} onToggle={() => updateNestedSetting('creatorSettings', 'captionsEnabled', !settings.creatorSettings.captionsEnabled)} />
                               <div className="separator" />
                               <SettingToggle icon={<Volume2 size={18} />} title="Auto Volume" subtitle="Adjust for loud videos" checked={settings.creatorSettings.autoVolumeAdjustment} onToggle={() => updateNestedSetting('creatorSettings', 'autoVolumeAdjustment', !settings.creatorSettings.autoVolumeAdjustment)} />
                               <div className="separator" />
                               <SettingToggle icon={<Video size={18} />} title="HD Uploads" subtitle="Upload in 1080p/4k" checked={settings.creatorSettings.hdUploads} onToggle={() => updateNestedSetting('creatorSettings', 'hdUploads', !settings.creatorSettings.hdUploads)} />
                               <div className="separator" />
                               <SettingToggle icon={<ImageIcon size={18} />} title="Animated Thumbnail" subtitle="Show movement in grid" checked={settings.creatorSettings.animatedThumbnail} onToggle={() => updateNestedSetting('creatorSettings', 'animatedThumbnail', !settings.creatorSettings.animatedThumbnail)} />
                               <div className="separator" />
                               <SettingToggle icon={<EyeOff size={18} />} title="Remove Photosensitive" subtitle="Skip strobing videos" checked={settings.creatorSettings.removePhotosensitive} onToggle={() => updateNestedSetting('creatorSettings', 'removePhotosensitive', !settings.creatorSettings.removePhotosensitive)} />
                           </div>
                       </div>
                  )}

                   {creatorCategory === 'wellbeing' && (
                       <div className="space-y-4">
                           <div className="glass-panel rounded-xl overflow-hidden">
                               <SettingToggle icon={<Clock size={18} />} title="Screen Time" subtitle="Management tools" checked={settings.creatorSettings.screenTimeManagement} onToggle={() => updateNestedSetting('creatorSettings', 'screenTimeManagement', !settings.creatorSettings.screenTimeManagement)} />
                               <div className="separator" />
                               <SettingToggle icon={<ShieldAlert size={18} />} title="Restricted Mode" subtitle="Limit mature content" checked={settings.creatorSettings.restrictedMode} onToggle={() => updateNestedSetting('creatorSettings', 'restrictedMode', !settings.creatorSettings.restrictedMode)} />
                               <div className="separator" />
                               <SettingToggle icon={<Users size={18} />} title="Family Pairing" subtitle="Parental controls" checked={settings.creatorSettings.familyPairing} onToggle={() => updateNestedSetting('creatorSettings', 'familyPairing', !settings.creatorSettings.familyPairing)} />
                           </div>
                       </div>
                  )}

                  {creatorCategory === 'data' && (
                       <div className="space-y-4">
                           <div className="glass-panel rounded-xl overflow-hidden">
                               <SettingToggle icon={<WifiOff size={18} />} title="Data Saver" subtitle="Reduce resolution" checked={settings.creatorSettings.dataSaver} onToggle={() => updateNestedSetting('creatorSettings', 'dataSaver', !settings.creatorSettings.dataSaver)} />
                               <div className="separator" />
                               <SettingToggle icon={<RefreshCw size={18} />} title="Clear Cache" subtitle="Free up space on exit" checked={settings.creatorSettings.clearCacheOnExit} onToggle={() => updateNestedSetting('creatorSettings', 'clearCacheOnExit', !settings.creatorSettings.clearCacheOnExit)} />
                               <div className="separator" />
                               <SettingToggle icon={<Globe size={18} />} title="Always Translate" subtitle="Auto-translate comments" checked={settings.creatorSettings.alwaysTranslate} onToggle={() => updateNestedSetting('creatorSettings', 'alwaysTranslate', !settings.creatorSettings.alwaysTranslate)} />
                           </div>
                       </div>
                  )}
             </div>
          )}

          {/* SYSTEM TAB (50 FEATURES) */}
          {activeTab === 'system' && (
              <div className="animate-fade-in-up space-y-4">
                  {/* Category Nav */}
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 p-1">
                      {[
                          { id: 'display', icon: <Monitor size={14} />, label: 'Display' },
                          { id: 'audio', icon: <Volume2 size={14} />, label: 'Audio' },
                          { id: 'network', icon: <Wifi size={14} />, label: 'Network' },
                          { id: 'storage', icon: <HardDrive size={14} />, label: 'Storage' },
                          { id: 'security', icon: <ShieldAlert size={14} />, label: 'Security' },
                          { id: 'experimental', icon: <Terminal size={14} />, label: 'Experimental' },
                      ].map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setSystemCategory(cat.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${systemCategory === cat.id ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                          >
                              {cat.icon} {cat.label}
                          </button>
                      ))}
                  </div>

                  {/* DISPLAY SETTINGS */}
                  {systemCategory === 'display' && (
                      <div className="space-y-4">
                          <div className="glass-panel rounded-xl overflow-hidden">
                              <SettingToggle icon={<Sun size={18} />} title="Adaptive Brightness" subtitle="Adjust based on ambient light" checked={settings.systemSettings.adaptiveBrightness} onToggle={() => updateNestedSetting('systemSettings', 'adaptiveBrightness', !settings.systemSettings.adaptiveBrightness)} />
                              <div className="separator" />
                              <SettingToggle icon={<EyeOff size={18} />} title="Blue Light Filter" subtitle="Reduce eye strain at night" checked={settings.systemSettings.blueLightFilter} onToggle={() => updateNestedSetting('systemSettings', 'blueLightFilter', !settings.systemSettings.blueLightFilter)} />
                              <div className="separator" />
                              <SettingToggle icon={<Moon size={18} />} title="OLED Black Mode" subtitle="True black pixels" checked={settings.systemSettings.oledBlack} onToggle={() => updateNestedSetting('systemSettings', 'oledBlack', !settings.systemSettings.oledBlack)} />
                              <div className="separator" />
                              <SettingToggle icon={<Palette size={18} />} title="Grayscale Mode" subtitle="Monochrome for focus" checked={settings.systemSettings.grayscaleMode} onToggle={() => updateNestedSetting('systemSettings', 'grayscaleMode', !settings.systemSettings.grayscaleMode)} />
                          </div>
                      </div>
                  )}

                  {/* AUDIO SETTINGS */}
                  {systemCategory === 'audio' && (
                       <div className="space-y-4">
                           <div className="glass-panel rounded-xl overflow-hidden p-5">
                               {['Master', 'Ambience', 'SFX'].map(type => (
                                   <div key={type} className="mb-4 last:mb-0">
                                      <div className="flex justify-between text-xs text-white/60 mb-2 font-bold uppercase tracking-wider"><span>{type} Volume</span></div>
                                      <input type="range" min="0" max="100" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500" />
                                   </div>
                               ))}
                           </div>

                           <div className="glass-panel rounded-xl overflow-hidden">
                               <SettingToggle icon={<Speaker size={18} />} title="Spatial Audio" subtitle="3D positional sound" checked={settings.systemSettings.spatialAudio} onToggle={() => updateNestedSetting('systemSettings', 'spatialAudio', !settings.systemSettings.spatialAudio)} />
                               <div className="separator" />
                               <SettingToggle icon={<Music size={18} />} title="Dolby Atmos" subtitle="Immersive surround" checked={settings.systemSettings.dolbyAtmos} onToggle={() => updateNestedSetting('systemSettings', 'dolbyAtmos', !settings.systemSettings.dolbyAtmos)} />
                               <div className="separator" />
                               <SettingToggle icon={<Mic size={18} />} title="Noise Suppression" subtitle="Clear calls AI" checked={settings.systemSettings.noiseSuppression} onToggle={() => updateNestedSetting('systemSettings', 'noiseSuppression', !settings.systemSettings.noiseSuppression)} />
                               <div className="separator" />
                               <SettingToggle icon={<Music size={18} />} title="High Fidelity" subtitle="24-bit/192kHz" checked={settings.systemSettings.highFidelityMusic} onToggle={() => updateNestedSetting('systemSettings', 'highFidelityMusic', !settings.systemSettings.highFidelityMusic)} />
                           </div>
                       </div>
                  )}

                  {/* NETWORK SETTINGS */}
                  {systemCategory === 'network' && (
                       <div className="space-y-4">
                           <div className="glass-panel rounded-xl overflow-hidden">
                               <SettingToggle icon={<WifiOff size={18} />} title="Data Saver" subtitle="Reduce bandwidth usage" checked={settings.systemSettings.dataSaver} onToggle={() => updateNestedSetting('systemSettings', 'dataSaver', !settings.systemSettings.dataSaver)} />
                               <div className="separator" />
                               <SettingToggle icon={<Share2 size={18} />} title="P2P Updates" subtitle="Share updates with peers" checked={settings.systemSettings.p2pUpdates} onToggle={() => updateNestedSetting('systemSettings', 'p2pUpdates', !settings.systemSettings.p2pUpdates)} />
                           </div>
                           
                           <div className="glass-panel rounded-xl overflow-hidden">
                               <SettingToggle icon={<Wifi size={18} />} title="Auto-DL WiFi" subtitle="Media on WiFi" checked={settings.systemSettings.autoDownloadWiFi} onToggle={() => updateNestedSetting('systemSettings', 'autoDownloadWiFi', !settings.systemSettings.autoDownloadWiFi)} />
                               <div className="separator" />
                               <SettingToggle icon={<Radio size={18} />} title="Auto-DL Cellular" subtitle="Media on 5G/LTE" checked={settings.systemSettings.autoDownloadCellular} onToggle={() => updateNestedSetting('systemSettings', 'autoDownloadCellular', !settings.systemSettings.autoDownloadCellular)} />
                           </div>
                       </div>
                  )}

                  {/* STORAGE SETTINGS */}
                  {systemCategory === 'storage' && (
                       <div className="space-y-4">
                           <div className="glass-panel rounded-xl overflow-hidden">
                               <SettingRow icon={<Database size={18} />} title="Max Cache Size" subtitle={`${settings.systemSettings.maxCacheSize} MB`} />
                               <div className="separator" />
                               <SettingToggle icon={<RefreshCw size={18} />} title="Auto-Clear Cache" subtitle="Weekly cleanup" checked={settings.systemSettings.autoClearCache} onToggle={() => updateNestedSetting('systemSettings', 'autoClearCache', !settings.systemSettings.autoClearCache)} />
                               <div className="separator" />
                               <SettingRow icon={<Clock size={18} />} title="Keep Media" subtitle={`${settings.systemSettings.keepMediaDays} days`} />
                           </div>

                           <div className="glass-panel rounded-xl overflow-hidden">
                               <SettingToggle icon={<HardDrive size={18} />} title="Local DB Backup" subtitle="Daily encrypted dump" checked={settings.systemSettings.localDatabaseBackup} onToggle={() => updateNestedSetting('systemSettings', 'localDatabaseBackup', !settings.systemSettings.localDatabaseBackup)} />
                               <div className="separator" />
                               <SettingToggle icon={<Zap size={18} />} title="DB Optimization" subtitle="Vacuum on startup" checked={settings.systemSettings.databaseOptimization} onToggle={() => updateNestedSetting('systemSettings', 'databaseOptimization', !settings.systemSettings.databaseOptimization)} />
                           </div>
                       </div>
                  )}

                  {/* SECURITY SETTINGS */}
                  {systemCategory === 'security' && (
                       <div className="space-y-4">
                           <div className="glass-panel rounded-xl overflow-hidden">
                               <SettingToggle icon={<Lock size={18} />} title="App Lock" subtitle="Require Passcode" checked={settings.appLock || false} onToggle={() => onUpdate({...settings, appLock: !settings.appLock})} />
                               <div className="separator" />
                               <SettingToggle icon={<Fingerprint size={18} />} title="Biometric Auth" subtitle="FaceID / TouchID" checked={settings.systemSettings.biometricAuth} onToggle={() => updateNestedSetting('systemSettings', 'biometricAuth', !settings.systemSettings.biometricAuth)} />
                               <div className="separator" />
                               <SettingRow icon={<Clock size={18} />} title="Auto-Lock Timeout" subtitle={`${settings.systemSettings.appLockTimeout} seconds`} />
                           </div>

                           <div className="glass-panel rounded-xl overflow-hidden">
                               <SettingToggle icon={<EyeOff size={18} />} title="Incognito Keyboard" subtitle="Disable learning" checked={settings.systemSettings.incognitoKeyboard} onToggle={() => updateNestedSetting('systemSettings', 'incognitoKeyboard', !settings.systemSettings.incognitoKeyboard)} />
                               <div className="separator" />
                               <SettingToggle icon={<ImageIcon size={18} />} title="Block Screenshots" subtitle="Prevent capture in app" checked={settings.systemSettings.screenCaptureBlock} onToggle={() => updateNestedSetting('systemSettings', 'screenCaptureBlock', !settings.systemSettings.screenCaptureBlock)} />
                               <div className="separator" />
                               <SettingToggle icon={<Hash size={18} />} title="Scramble Pin" subtitle="Randomize keypad layout" checked={settings.systemSettings.scramblePin} onToggle={() => updateNestedSetting('systemSettings', 'scramblePin', !settings.systemSettings.scramblePin)} />
                           </div>
                       </div>
                  )}

                   {/* EXPERIMENTAL SETTINGS */}
                   {systemCategory === 'experimental' && (
                       <div className="space-y-4">
                           <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4">
                               <p className="text-xs text-amber-200"><ShieldAlert size={14} className="inline mr-2" /> Warning: These features may cause instability or quantum decoherence.</p>
                           </div>

                           <div className="glass-panel rounded-xl overflow-hidden">
                               <SettingToggle icon={<Cpu size={18} />} title="GPU Acceleration" subtitle="Force WebGL rendering" checked={settings.systemSettings.gpuAcceleration} onToggle={() => updateNestedSetting('systemSettings', 'gpuAcceleration', !settings.systemSettings.gpuAcceleration)} />
                               <div className="separator" />
                               <SettingToggle icon={<Activity size={18} />} title="FPS Overlay" subtitle="Monitor performance" checked={settings.systemSettings.fpsOverlay} onToggle={() => updateNestedSetting('systemSettings', 'fpsOverlay', !settings.systemSettings.fpsOverlay)} />
                               <div className="separator" />
                               <SettingToggle icon={<Terminal size={18} />} title="Debug Logging" subtitle="Verbose console output" checked={settings.systemSettings.debugLogging} onToggle={() => updateNestedSetting('systemSettings', 'debugLogging', !settings.systemSettings.debugLogging)} />
                               <div className="separator" />
                               <SettingToggle icon={<Zap size={18} />} title="God Mode Trigger" subtitle="Allow manual override" checked={settings.systemSettings.godModeTrigger} onToggle={() => updateNestedSetting('systemSettings', 'godModeTrigger', !settings.systemSettings.godModeTrigger)} />
                               <div className="separator" />
                               <SettingToggle icon={<Link size={18} />} title="Beta Channel" subtitle="Receive nightly builds" checked={settings.systemSettings.betaChannel} onToggle={() => updateNestedSetting('systemSettings', 'betaChannel', !settings.systemSettings.betaChannel)} />
                           </div>
                       </div>
                  )}

              </div>
          )}

          {/* ADVANCED TAB (TELEGRAM 50+ FEATURES) */}
          {activeTab === 'advanced' && settings.telegramComprehensive && (
              <div className="animate-fade-in-up space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 mb-6">
                      <div className="flex items-center gap-3 mb-2">
                          <Settings className="text-blue-400" size={24} />
                          <h2 className="text-lg font-bold text-white">Advanced Controls</h2>
                      </div>
                      <p className="text-xs text-white/60">Deep system configuration, privacy, and data management.</p>
                  </div>

                  {/* CHAT SETTINGS */}
                  <h3 className="section-header text-blue-300/60"><MessageSquare size={12} /> Chat Configuration</h3>
                  <div className="glass-panel rounded-xl overflow-hidden">
                      <SettingToggle icon={<Moon size={18} />} title="Auto-Night Mode" subtitle="Switch based on time/location" checked={settings.telegramComprehensive.autoNightMode} onToggle={() => updateNestedSetting('telegramComprehensive', 'autoNightMode', !settings.telegramComprehensive?.autoNightMode)} />
                      <div className="separator" />
                      <SettingToggle icon={<Globe size={18} />} title="In-App Browser" subtitle="Open links internally" checked={settings.telegramComprehensive.inAppBrowser} onToggle={() => updateNestedSetting('telegramComprehensive', 'inAppBrowser', !settings.telegramComprehensive?.inAppBrowser)} />
                      <div className="separator" />
                      <SettingToggle icon={<Share2 size={18} />} title="Direct Share" subtitle="Show in Android share sheet" checked={settings.telegramComprehensive.directShare} onToggle={() => updateNestedSetting('telegramComprehensive', 'directShare', !settings.telegramComprehensive?.directShare)} />
                      <div className="separator" />
                      <SettingToggle icon={<Zap size={18} />} title="Enable Animations" subtitle="UI transitions" checked={settings.telegramComprehensive.enableAnimations} onToggle={() => updateNestedSetting('telegramComprehensive', 'enableAnimations', !settings.telegramComprehensive?.enableAnimations)} />
                  </div>

                  {/* DATA & STORAGE */}
                  <h3 className="section-header text-blue-300/60"><Database size={12} /> Data & Storage</h3>
                  <div className="glass-panel rounded-xl overflow-hidden">
                       <SettingToggle icon={<Wifi size={18} />} title="Auto-DL WiFi" subtitle="Media on WiFi" checked={settings.telegramComprehensive.autoDownloadWiFi} onToggle={() => updateNestedSetting('telegramComprehensive', 'autoDownloadWiFi', !settings.telegramComprehensive?.autoDownloadWiFi)} />
                       <div className="separator" />
                       <SettingToggle icon={<Radio size={18} />} title="Auto-DL Roaming" subtitle="Media while roaming" checked={settings.telegramComprehensive.autoDownloadRoaming} onToggle={() => updateNestedSetting('telegramComprehensive', 'autoDownloadRoaming', !settings.telegramComprehensive?.autoDownloadRoaming)} />
                       <div className="separator" />
                       <SettingToggle icon={<Play size={18} />} title="Autoplay GIFs" subtitle="Animate in chat" checked={settings.telegramComprehensive.autoPlayGifs} onToggle={() => updateNestedSetting('telegramComprehensive', 'autoPlayGifs', !settings.telegramComprehensive?.autoPlayGifs)} />
                  </div>

                   {/* PRIVACY & SECURITY */}
                  <h3 className="section-header text-blue-300/60"><Shield size={12} /> Privacy & Security</h3>
                  <div className="glass-panel rounded-xl overflow-hidden">
                      <SettingRow icon={<User size={18} />} title="Blocked Users" subtitle={`${settings.telegramComprehensive.blockedUsers.length} users blocked`} />
                      <div className="separator" />
                      <SettingRow icon={<Phone size={18} />} title="Phone Number" subtitle="My Contacts" />
                      <div className="separator" />
                      <SettingRow icon={<Clock size={18} />} title="Last Seen & Online" subtitle="Everybody" />
                      <div className="separator" />
                      <SettingToggle icon={<Key size={18} />} title="Two-Step Auth" subtitle="Cloud password" checked={settings.telegramComprehensive.twoStepAuth} onToggle={() => updateNestedSetting('telegramComprehensive', 'twoStepAuth', !settings.telegramComprehensive?.twoStepAuth)} />
                  </div>
              </div>
          )}

      </div>
      <style>{`
        .section-header {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: rgba(255,255,255,0.3);
            padding-left: 0.5rem;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .separator {
            height: 1px;
            background-color: rgba(255,255,255,0.05);
            margin-left: 3.5rem;
        }
      `}</style>
    </div>
  );
};

// Memoized Components for Performance
const SettingRow = React.memo(({ icon, title, subtitle, isPremium }: { icon: React.ReactNode, title: string, subtitle: string, isPremium?: boolean }) => (
    <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors group">
        <div className="text-white/60 group-hover:text-teal-400 transition-colors">{icon}</div>
        <div className="flex-1">
            <h4 className="text-white text-sm font-medium flex items-center gap-2">
                {title}
                {isPremium && <Crown size={12} className="text-amber-500" />}
            </h4>
            <p className="text-white/30 text-xs font-light">{subtitle}</p>
        </div>
        {isPremium && <div className="text-[9px] px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded border border-amber-500/30">LOCKED</div>}
    </div>
));

const SettingToggle = React.memo(({ icon, title, subtitle, checked, onToggle }: { icon: React.ReactNode, title: string, subtitle: string, checked: boolean, onToggle: () => void }) => (
    <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors group" onClick={onToggle}>
        <div className="text-white/60 group-hover:text-teal-400 transition-colors">{icon}</div>
        <div className="flex-1">
            <h4 className="text-white text-sm font-medium">{title}</h4>
            <p className="text-white/30 text-xs font-light">{subtitle}</p>
        </div>
        <div className={`w-10 h-5 rounded-full relative transition-colors ${checked ? 'bg-teal-500' : 'bg-white/10'}`}>
            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${checked ? 'left-6' : 'left-1'}`} />
        </div>
    </div>
));

const Rocket = ({ size }: {size: number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>
);

const Fingerprint = ({ size }: {size: number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 6"></path><path d="M5 15.18A5 5 0 0 1 4 13C4 8.66 7.66 5 12 5a8 8 0 0 1 8 4"></path><path d="M12 22c5.5 0 10-4.5 10-10"></path><path d="M7 15.18a4 4 0 0 1-2.43-4.66"></path><path d="M11 20.3a8 8 0 0 1-2.44-5.1"></path><path d="M13 20.3a4 4 0 0 0 2.44-5.1"></path><path d="M15 11.2a1 1 0 1 0 2 0 1 1 0 1 0-2 0"></path><path d="M9 11.2a1 1 0 1 0 2 0 1 1 0 1 0-2 0"></path></svg>
);

export default SettingsView;