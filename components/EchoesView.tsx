
import React, { useState, useEffect } from 'react';
import { Contact, Post, Story, MOOD_COLORS, FilterType, FILTERS, PostType, SocialNotification, Product, CalendarEvent } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Send, X, Plus, PlayCircle, Grid, Clapperboard, Layers, Bell, Check, Calendar, ShoppingBag, Clock, Play, Tag, Star, Filter, Search, MapPin, Zap, UserPlus, Gift, Smile, Camera, ChevronRight, Bookmark, DollarSign, Truck, ShieldCheck, Music } from 'lucide-react';
import ReelsView from './ReelsView';

interface EchoesViewProps {
  posts: Post[];
  stories: Story[];
  contacts: Contact[];
  currentUserAvatar: string;
  onLikePost: (postId: string, reaction: string) => void;
  onCommentPost: (postId: string, text: string) => void;
  onCreatePost: (text: string, image?: string, filter?: FilterType) => void;
  notifications: SocialNotification[];
  initialTab?: 'echoes' | 'flow' | 'schedule' | 'market';
  onNavigate: (destination: string) => void;
  products: Product[];
  events: CalendarEvent[];
  onCreateProduct: (product: Partial<Product>) => void;
  onCreateEvent: (event: Partial<CalendarEvent>) => void;
}

const FB_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];
const MARKET_CATEGORIES = ['All', 'Digital Art', 'Services', 'Physical', 'Collectibles', 'Software', 'Vehicles', 'Real Estate'];
const SCHEDULE_TABS = ['Upcoming', 'Hosting', 'Birthdays', 'Past'];

const EchoesView: React.FC<EchoesViewProps> = ({ 
  posts, 
  stories, 
  contacts, 
  currentUserAvatar,
  onLikePost,
  onCommentPost,
  onCreatePost,
  notifications,
  initialTab,
  onNavigate,
  products,
  events,
  onCreateProduct,
  onCreateEvent
}) => {
  const [activeTab, setActiveTab] = useState<'echoes' | 'flow' | 'schedule' | 'market'>('echoes');
  
  useEffect(() => {
    if (initialTab) {
        setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Post Creation
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Market Creation
  const [isSelling, setIsSelling] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ title: '', price: 0, category: 'Physical', description: '' });

  // Event Creation
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({ title: '', location: '', description: '' });

  // Interactions
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [activeComments, setActiveComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showActivity, setShowActivity] = useState(false);
  const [sharingId, setSharingId] = useState<string | null>(null);
  
  // Market State
  const [marketCategory, setMarketCategory] = useState('All');
  const [marketSearch, setMarketSearch] = useState('');
  const [marketView, setMarketView] = useState<'buy' | 'sell'>('buy');

  // Schedule State
  const [scheduleTab, setScheduleTab] = useState('Upcoming');

  const getAuthor = (id: string) => {
    if (id === 'me') return { name: 'You', avatar: currentUserAvatar, mood: 'neutral' };
    return contacts.find(c => c.id === id) || { name: 'Unknown', avatar: '', mood: 'neutral' };
  };

  const handleCreatePost = () => {
    if (!newPostText.trim() && !newPostImage) return;
    onCreatePost(newPostText, newPostImage || undefined, selectedFilter);
    setNewPostText('');
    setNewPostImage('');
    setSelectedFilter('none');
    setIsCreatingPost(false);
  };

  const handleSubmitProduct = () => {
      onCreateProduct(newProduct);
      setNewProduct({ title: '', price: 0, category: 'Physical', description: '' });
      setIsSelling(false);
      setMarketView('buy');
  };

  const handleSubmitEvent = () => {
      onCreateEvent(newEvent);
      setNewEvent({ title: '', location: '', description: '' });
      setIsCreatingEvent(false);
  };

  const handleShare = (id: string) => {
      setSharingId(id);
      // Simulate share action delay
      setTimeout(() => setSharingId(null), 1000);
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const filteredProducts = products.filter(p => 
      (marketCategory === 'All' || p.category === marketCategory) &&
      p.title.toLowerCase().includes(marketSearch.toLowerCase())
  );
  const videoPosts = posts.filter(p => p.type === 'video' && p.videoUrl);

  const renderFlowRail = () => {
      if (videoPosts.length === 0) return null;
      return (
          <div className="py-6 border-b border-white/5 animate-fade-in-up">
              <div className="px-4 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                      <Clapperboard size={18} className="text-pink-500" />
                      <h3 className="text-sm font-bold tracking-wide">Suggested Flows</h3>
                  </div>
                  <button onClick={() => onNavigate('flow')} className="text-xs text-teal-400 hover:text-white transition-colors">See All</button>
              </div>
              <div className="flex overflow-x-auto gap-3 px-4 scrollbar-hide pb-2">
                  {videoPosts.map((post) => {
                       const author = getAuthor(post.authorId);
                       return (
                           <div key={post.id} onClick={() => onNavigate('flow')} className="flex-shrink-0 w-28 h-40 bg-gray-900 rounded-xl overflow-hidden relative group cursor-pointer border border-white/10 hover:border-pink-500/50 transition-all">
                               {post.videoUrl && <video src={post.videoUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" muted />}
                               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
                               <div className="absolute top-2 right-2">
                                   <PlayCircle size={14} className="text-white drop-shadow-md" />
                               </div>
                               <div className="absolute bottom-2 left-2 right-2">
                                   <div className="flex items-center gap-1">
                                       <img src={author.avatar} className="w-4 h-4 rounded-full" />
                                       <span className="text-[9px] text-white/80 truncate">{author.name}</span>
                                   </div>
                               </div>
                           </div>
                       );
                  })}
              </div>
          </div>
      );
  };

  return (
    <div className="w-full h-full overflow-y-hidden relative flex flex-col bg-[#050505]">
      
      {activeTab === 'flow' ? (
          <ReelsView 
            posts={posts} 
            contacts={contacts} 
            onLike={(id) => onLikePost(id, '❤️')} 
            onNavigate={(dest) => {
                if (dest === 'friends') setActiveTab('echoes');
                else onNavigate(dest);
            }} 
          />
      ) : activeTab === 'schedule' ? (
          <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 scroll-smooth">
              <div className="mb-6 flex justify-between items-end">
                  <div>
                      <h2 className="text-2xl font-serif text-white mb-1 tracking-wide">Schedule</h2>
                      <p className="text-xs text-white/50">Plan your digital & physical presence.</p>
                  </div>
                  <button onClick={() => setIsCreatingEvent(true)} className="px-3 py-1.5 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-teal-500/30 transition-colors">
                      + Create
                  </button>
              </div>
              
              {isCreatingEvent && (
                  <div className="glass-panel p-4 mb-4 rounded-xl animate-fade-in-up">
                      <h3 className="text-white font-bold mb-3">New Event</h3>
                      <input className="w-full bg-white/5 p-2 rounded mb-2 text-white" placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                      <input className="w-full bg-white/5 p-2 rounded mb-2 text-white" placeholder="Location" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
                      <textarea className="w-full bg-white/5 p-2 rounded mb-3 text-white" placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
                      <div className="flex gap-2">
                          <button onClick={handleSubmitEvent} className="flex-1 bg-teal-500 text-black py-2 rounded font-bold">Publish</button>
                          <button onClick={() => setIsCreatingEvent(false)} className="px-4 bg-white/10 rounded">Cancel</button>
                      </div>
                  </div>
              )}

              {/* Date Strip */}
              <div className="flex justify-between items-center mb-6 bg-white/5 p-2 rounded-xl border border-white/5">
                  <button className="p-2 hover:bg-white/10 rounded-lg"><ChevronRight className="rotate-180" size={16} /></button>
                  <div className="flex gap-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                          <div key={day} className={`flex flex-col items-center p-2 rounded-lg cursor-pointer ${i === 2 ? 'bg-teal-500 text-black' : 'hover:bg-white/5'}`}>
                              <span className="text-[10px] uppercase font-bold opacity-60">{day}</span>
                              <span className="text-sm font-bold">{12 + i}</span>
                          </div>
                      ))}
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-lg"><ChevronRight size={16} /></button>
              </div>

              {/* Sub Tabs */}
              <div className="flex gap-2 mb-6 border-b border-white/10">
                  {SCHEDULE_TABS.map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setScheduleTab(tab)}
                        className={`px-4 py-2 text-sm font-medium transition-colors relative ${scheduleTab === tab ? 'text-white' : 'text-white/40 hover:text-white'}`}
                      >
                          {tab}
                          {scheduleTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500" />}
                      </button>
                  ))}
              </div>

              {/* Events List */}
              <div className="space-y-4">
                  {scheduleTab === 'Birthdays' ? (
                      <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center gap-4 animate-fade-in-up">
                          <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-400">
                              <Gift size={24} />
                          </div>
                          <div>
                              <h4 className="text-white font-medium">Kael's Birthday</h4>
                              <p className="text-white/50 text-xs">Turning 25 on Friday</p>
                          </div>
                          <button className="ml-auto px-3 py-1 bg-white/10 rounded-full text-xs hover:bg-white/20">Send Gift</button>
                      </div>
                  ) : (
                      events.map(event => (
                          <div key={event.id} className="glass-panel rounded-xl overflow-hidden group hover:border-teal-500/30 transition-all animate-fade-in-up cursor-pointer">
                              <div className="h-32 w-full relative">
                                  <img src={event.image} className="w-full h-full object-cover" />
                                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-center">
                                      <span className="text-xs font-bold text-red-400 block uppercase">{new Date(event.startTime).toLocaleString('default', { month: 'short' })}</span>
                                      <span className="text-lg font-bold text-white leading-none">{new Date(event.startTime).getDate()}</span>
                                  </div>
                              </div>
                              <div className="p-4">
                                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-teal-400 transition-colors">{event.title}</h3>
                                  <div className="flex items-center gap-2 text-xs text-white/50 mb-3">
                                      <Clock size={12} /> <span>{new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                      <span>•</span>
                                      <MapPin size={12} /> <span>{event.location}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                      <div className="flex -space-x-2">
                                          {event.attendees.map(uid => (
                                              <img key={uid} src={contacts.find(c => c.id === uid)?.avatar} className="w-6 h-6 rounded-full border-2 border-[#1a1a1a]" />
                                          ))}
                                          <div className="w-6 h-6 rounded-full bg-white/10 border-2 border-[#1a1a1a] flex items-center justify-center text-[9px] text-white font-bold">
                                              +5
                                          </div>
                                      </div>
                                      <div className="flex gap-2">
                                          <button className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white"><Star size={16} /></button>
                                          <button className="px-3 py-1 bg-teal-500 text-black text-xs font-bold rounded-lg hover:bg-teal-400">Join</button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>
      ) : activeTab === 'market' ? (
          <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 scroll-smooth">
              {/* Market Header */}
              <div className="flex justify-between items-start mb-6">
                  <div>
                      <h2 className="text-2xl font-serif text-white mb-1 tracking-wide">Aura Bazaar</h2>
                      <p className="text-xs text-white/50">The global exchange.</p>
                  </div>
                  <div className="flex bg-white/5 rounded-lg p-1">
                      <button onClick={() => setMarketView('buy')} className={`px-3 py-1 rounded text-xs font-bold ${marketView === 'buy' ? 'bg-white/10 text-white' : 'text-white/40'}`}>Buy</button>
                      <button onClick={() => setMarketView('sell')} className={`px-3 py-1 rounded text-xs font-bold ${marketView === 'sell' ? 'bg-white/10 text-white' : 'text-white/40'}`}>Sell</button>
                  </div>
              </div>

              {marketView === 'sell' ? (
                  isSelling ? (
                      <div className="glass-panel p-4 rounded-xl animate-fade-in-up">
                          <h3 className="text-white font-bold mb-4">List Item</h3>
                          <input className="w-full bg-white/5 p-2 rounded mb-2 text-white" placeholder="Product Title" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} />
                          <input type="number" className="w-full bg-white/5 p-2 rounded mb-2 text-white" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                          <select className="w-full bg-white/5 p-2 rounded mb-2 text-white" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                              {MARKET_CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <textarea className="w-full bg-white/5 p-2 rounded mb-3 text-white" placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                          <div className="flex gap-2">
                              <button onClick={handleSubmitProduct} className="flex-1 bg-teal-500 text-black py-2 rounded font-bold">List Item</button>
                              <button onClick={() => setIsSelling(false)} className="px-4 bg-white/10 rounded">Cancel</button>
                          </div>
                      </div>
                  ) : (
                    <div className="text-center py-10 animate-fade-in-up">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-400">
                            <DollarSign size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Seller Dashboard</h3>
                        <p className="text-white/50 text-sm mb-6">You have no active listings.</p>
                        <button onClick={() => setIsSelling(true)} className="px-6 py-2 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400 transition-colors">
                            Create New Listing
                        </button>
                    </div>
                  )
              ) : (
                  <>
                      {/* Search & Filter */}
                      <div className="flex gap-2 mb-6 sticky top-0 z-10 bg-[#050505] py-2">
                          <div className="flex-1 bg-white/5 border border-white/10 rounded-xl flex items-center px-3 py-2.5">
                              <Search size={16} className="text-white/40 mr-2" />
                              <input 
                                className="bg-transparent outline-none text-white text-sm w-full placeholder-white/30" 
                                placeholder="Search items..." 
                                value={marketSearch}
                                onChange={(e) => setMarketSearch(e.target.value)}
                              />
                          </div>
                          <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white">
                              <Filter size={18} />
                          </button>
                          <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white">
                              <Bookmark size={18} />
                          </button>
                      </div>

                      {/* Categories */}
                      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
                          {MARKET_CATEGORIES.map(cat => (
                              <button 
                                key={cat}
                                onClick={() => setMarketCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border ${marketCategory === cat ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' : 'bg-transparent border-white/10 text-white/60 hover:border-white/30'}`}
                              >
                                  {cat}
                              </button>
                          ))}
                      </div>

                      {/* Featured / Hero */}
                      <div className="mb-8 relative rounded-2xl overflow-hidden aspect-[2/1] group cursor-pointer border border-white/10">
                          <img src="https://picsum.photos/800/400?random=99" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                              <span className="px-2 py-0.5 bg-amber-500 text-black text-[10px] font-bold uppercase rounded mb-2 inline-block">Daily Pick</span>
                              <h3 className="text-xl font-bold text-white mb-1">Ethereal Digital Canvas</h3>
                              <div className="flex justify-between items-end">
                                  <p className="text-xs text-white/70 line-clamp-1 max-w-[70%]">Limited edition NFT collection by @mirage.</p>
                                  <span className="text-lg font-bold text-teal-400">2.5 ETH</span>
                              </div>
                          </div>
                      </div>

                      {/* Product Grid */}
                      <h3 className="text-sm font-bold text-white/80 mb-4 flex items-center gap-2"><Tag size={14} /> Recent Listings</h3>
                      <div className="grid grid-cols-2 gap-4">
                          {filteredProducts.map(product => (
                              <div key={product.id} className="bg-white/5 border border-white/5 rounded-xl overflow-hidden group hover:border-white/20 transition-all cursor-pointer hover:shadow-lg hover:shadow-teal-500/5">
                                  <div className="aspect-square relative overflow-hidden">
                                      <img src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                      <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:bg-teal-500 hover:text-black transition-colors opacity-0 group-hover:opacity-100">
                                          <Heart size={16} />
                                      </button>
                                      {product.isPromoted && (
                                          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-purple-500/80 backdrop-blur-md text-white text-[9px] font-bold rounded uppercase flex items-center gap-1">
                                              <Zap size={8} fill="currentColor" /> Promoted
                                          </div>
                                      )}
                                  </div>
                                  <div className="p-3">
                                      <div className="flex justify-between items-start mb-1">
                                          <h4 className="text-sm font-medium text-white truncate pr-2">{product.title}</h4>
                                          <div className="flex items-center gap-0.5 text-[10px] text-amber-400 bg-amber-400/10 px-1 rounded">
                                              <Star size={8} fill="currentColor" /> {product.rating}
                                          </div>
                                      </div>
                                      <p className="text-xs text-white/50 mb-3 truncate">{product.category} • {product.location}</p>
                                      <div className="flex items-center justify-between">
                                          <span className="text-base font-bold text-white">{product.currency}{product.price}</span>
                                          <button className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"><MessageCircle size={14} /></button>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </>
              )}
          </div>
      ) : (
      <div className="flex-1 overflow-y-auto pb-24 scroll-smooth scrollbar-hide">
        
        {/* Stories Rail */}
        <div className="pt-5 pb-4 px-4 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-3">
            <div className="inline-block relative cursor-pointer group">
                <div className="w-16 h-24 rounded-2xl bg-white/5 overflow-hidden border border-white/10 relative shadow-lg">
                    <img src={currentUserAvatar} alt="Me" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center border-2 border-black">
                        <Plus size={14} className="text-black" />
                    </div>
                </div>
                <span className="text-[10px] text-white/50 block text-center mt-1.5 font-light">Add Glimpse</span>
            </div>

            {stories.map(story => {
                const author = contacts.find(c => c.id === story.authorId) || { name: 'Unknown', avatar: '', mood: 'neutral' };
                return (
                    <div key={story.id} className="inline-block relative cursor-pointer group" onClick={() => setActiveStory(story)}>
                        <div className={`w-16 h-24 rounded-2xl overflow-hidden border-2 relative p-[2px] shadow-lg`} style={{ borderColor: MOOD_COLORS[author.mood as any] || '#fff' }}>
                            <div className="w-full h-full rounded-xl overflow-hidden bg-black relative">
                                <img src={story.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="absolute top-1 left-1 w-5 h-5 rounded-full border border-black overflow-hidden shadow-sm">
                                <img src={author.avatar} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <span className="text-[10px] text-white/70 block text-center mt-1.5 truncate w-16 font-light">{author.name}</span>
                    </div>
                );
            })}
        </div>

        {/* Create Post Area (Enhanced) */}
        <div className="px-4 mb-4">
            <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                        <img src={currentUserAvatar} className="w-full h-full object-cover" />
                    </div>
                    <div 
                        onClick={() => setIsCreatingPost(true)}
                        className="flex-1 bg-white/5 rounded-full px-4 py-2.5 cursor-text hover:bg-white/10 transition-colors"
                    >
                        <span className="text-white/40 text-sm">What's resonating with you?</span>
                    </div>
                </div>
                {isCreatingPost ? (
                    <div className="animate-fade-in-up mt-2">
                        <textarea 
                            className="w-full bg-transparent outline-none text-white text-sm min-h-[80px] mb-3 placeholder-white/20"
                            placeholder="Type your thoughts..."
                            value={newPostText}
                            onChange={(e) => setNewPostText(e.target.value)}
                            autoFocus
                        />
                        <div className="flex justify-between items-center border-t border-white/5 pt-3">
                             <div className="flex gap-2">
                                <button className="p-2 hover:bg-white/5 rounded-full text-green-400"><ImageIcon size={18} /></button>
                                <button className="p-2 hover:bg-white/5 rounded-full text-blue-400"><UserPlus size={18} /></button>
                                <button className="p-2 hover:bg-white/5 rounded-full text-yellow-400"><Smile size={18} /></button>
                                <button className="p-2 hover:bg-white/5 rounded-full text-red-400"><MapPin size={18} /></button>
                             </div>
                             <div className="flex gap-2">
                                 <button onClick={() => setIsCreatingPost(false)} className="px-3 py-1.5 text-xs text-white/50 hover:text-white">Cancel</button>
                                 <button onClick={handleCreatePost} className="px-4 py-1.5 bg-teal-500 text-black text-xs font-bold rounded-lg hover:bg-teal-400">Post</button>
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-between items-center pt-2 mt-1 border-t border-white/5">
                        <button className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5">
                            <ImageIcon size={16} className="text-green-400" /> Photo
                        </button>
                         <button className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5">
                            <UserPlus size={16} className="text-blue-400" /> Tag
                        </button>
                        <button className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5">
                            <Smile size={16} className="text-yellow-400" /> Feeling
                        </button>
                    </div>
                )}
            </div>
        </div>
        
        {/* People You May Know (Carousel) */}
        <div className="px-4 mb-4">
             <div className="flex items-center justify-between mb-2 px-1">
                 <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">Orbit Suggestions</h3>
                 <button className="text-teal-400 text-xs hover:text-teal-300">See all</button>
             </div>
             <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                 {[1, 2, 3, 4].map(i => (
                     <div key={i} className="flex-shrink-0 w-32 bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col items-center gap-2 hover:border-white/20 transition-colors cursor-pointer">
                         <div className="w-14 h-14 rounded-full bg-white/10 overflow-hidden"><img src={`https://picsum.photos/100?random=${100+i}`} className="w-full h-full object-cover" /></div>
                         <div className="text-center">
                             <span className="block text-xs font-bold text-white mb-0.5">User {i}</span>
                             <span className="block text-[9px] text-white/40">2 mutuals</span>
                         </div>
                         <button className="w-full py-1 bg-blue-500/20 text-blue-400 rounded text-[10px] font-bold mt-1 hover:bg-blue-500 hover:text-black transition-colors">Connect</button>
                     </div>
                 ))}
             </div>
        </div>

        {/* Feed */}
        <div className="space-y-4 pb-6 px-4">
            {posts.filter(p => p.type !== 'video').map((post, index) => {
                const author = getAuthor(post.authorId);
                const showFlowRail = index === 1; // Inject rail after 2nd post
                
                return (
                    <React.Fragment key={post.id}>
                        <div className="glass-panel rounded-xl overflow-hidden animate-fade-in-up">
                             {/* Header */}
                             <div className="px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 relative">
                                        <img src={author.avatar} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-white group-hover:text-teal-400 transition-colors">{author.name}</span>
                                        <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                                            <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                                            {post.location && <span>• {post.location}</span>}
                                            {post.feeling && <span>• Feeling {post.feeling}</span>}
                                        </div>
                                    </div>
                                </div>
                                <button className="text-white/30 hover:text-white"><MoreHorizontal size={18} /></button>
                            </div>
                            
                            {/* Content */}
                            <div className="px-4 mb-3">
                                <p className="text-[15px] text-white/90 leading-relaxed font-light">{post.content}</p>
                            </div>
                            {post.image && (
                                 <div className="w-full bg-black/50 relative cursor-pointer" onDoubleClick={() => onLikePost(post.id, '❤️')}>
                                    <img src={post.image} className="w-full h-auto max-h-[500px] object-cover" style={{ filter: post.filter ? FILTERS[post.filter] : 'none' }} />
                                </div>
                            )}

                            {/* Actions */}
                            <div className="px-4 py-3">
                                 <div className="flex items-center justify-between mb-3 relative">
                                    {showReactionPicker === post.id && (
                                        <div className="absolute bottom-8 left-0 bg-[#222] border border-white/10 rounded-full p-1.5 flex gap-2 shadow-xl z-10 backdrop-blur-xl animate-message-pop">
                                            {FB_REACTIONS.map(reaction => (
                                                <button key={reaction} onClick={() => { onLikePost(post.id, reaction); setShowReactionPicker(null); }} className="text-xl hover:scale-125 transition-transform p-0.5">{reaction}</button>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-6">
                                        <button 
                                            className={`flex items-center gap-1.5 transition-transform duration-300 ${post.likedByMe ? 'text-red-500 scale-105' : 'text-white/60 hover:text-white'} hover:scale-110 active:scale-75`}
                                            onClick={() => onLikePost(post.id, '❤️')}
                                            onContextMenu={(e) => { e.preventDefault(); setShowReactionPicker(prev => prev === post.id ? null : post.id); }}
                                        >
                                            {post.myReaction ? <span className="text-lg">{post.myReaction}</span> : <Heart size={20} className={post.likedByMe ? "fill-current" : ""} />}
                                            <span className="text-xs font-bold">{post.likes}</span>
                                        </button>
                                        <button 
                                            className="flex items-center gap-1.5 text-white/60 hover:text-white transition-transform duration-300 hover:scale-110" 
                                            onClick={() => setActiveComments(activeComments === post.id ? null : post.id)}
                                        >
                                            <MessageCircle size={20} />
                                            <span className="text-xs font-bold">{post.comments.length}</span>
                                        </button>
                                        <button 
                                            onClick={() => handleShare(post.id)}
                                            className={`flex items-center gap-1.5 text-white/60 hover:text-white transition-all duration-300 ${sharingId === post.id ? 'animate-bounce text-teal-400' : 'hover:-translate-y-1 active:translate-y-0.5'}`}
                                        >
                                            <Share2 size={20} />
                                        </button>
                                    </div>
                                 </div>
                            </div>

                            {/* Comments */}
                            {activeComments === post.id && (
                                <div className="px-4 pb-4 animate-fade-in-up border-t border-white/5 pt-3">
                                    <div className="space-y-3 mb-3 max-h-40 overflow-y-auto pr-2">
                                        {post.comments.map(comment => (
                                            <div key={comment.id} className="flex gap-2 items-start">
                                                <div className="w-6 h-6 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                                                     <img src={`https://picsum.photos/50?random=${comment.id}`} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="bg-white/5 rounded-2xl rounded-tl-none px-3 py-2">
                                                    <span className="text-xs font-bold text-white block mb-0.5">{comment.authorName}</span>
                                                    <span className="text-sm text-white/80 font-light">{comment.text}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-3 items-center mt-2">
                                        <input type="text" placeholder="Add a comment..." className="flex-1 bg-transparent text-sm text-white outline-none border-b border-white/10 pb-1" value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { onCommentPost(post.id, commentText); setCommentText(''); }}} />
                                        <button onClick={() => { onCommentPost(post.id, commentText); setCommentText(''); }} className="text-teal-400 hover:text-teal-300"><Send size={16} /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                        {showFlowRail && renderFlowRail()}
                    </React.Fragment>
                );
            })}
        </div>
      </div>
      )}
      
      {/* Activity Center */}
      {showActivity && (
          <div className="absolute top-14 right-4 w-80 bg-[#1a1a1a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 animate-message-pop max-h-[60vh] overflow-y-auto">
              <div className="p-4 border-b border-white/5 font-medium text-sm text-white sticky top-0 bg-[#1a1a1a] flex justify-between items-center">
                  <span>Activity</span>
                  <button onClick={() => setShowActivity(false)}><X size={16} className="text-white/50" /></button>
              </div>
              <div className="p-2">
                  {notifications.map(notif => (
                      <div key={notif.id} className="flex gap-3 items-center p-2 hover:bg-white/5 rounded-xl cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden relative">
                              <img src={getAuthor(notif.actorId).avatar} className="w-full h-full object-cover" />
                              <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center text-[8px] text-white">
                                  {notif.type === 'like' ? <Heart size={8} fill="currentColor" /> : <MessageCircle size={8} />}
                              </div>
                          </div>
                          <div className="flex-1">
                              <div className="text-xs text-white leading-tight">
                                  <span className="font-bold">{getAuthor(notif.actorId).name}</span> {notif.type === 'like' ? 'liked your post.' : 'commented on your post.'}
                              </div>
                              <span className="text-[10px] text-white/40">{new Date(notif.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          {notif.previewImage && <div className="w-10 h-10 rounded bg-white/5 overflow-hidden"><img src={notif.previewImage} className="w-full h-full object-cover" /></div>}
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Story Viewer (Simplified) */}
      {activeStory && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-fade-in-up">
              <div className="absolute top-4 right-4 z-50"><button onClick={() => setActiveStory(null)}><X size={32} className="text-white" /></button></div>
              <img src={activeStory.image} className="max-h-[90vh] rounded-xl shadow-2xl" />
              <div className="absolute bottom-10 left-0 w-full px-6 flex items-center gap-3">
                  <input type="text" placeholder="Send message..." className="flex-1 bg-black/50 border border-white/20 rounded-full px-4 py-3 text-white outline-none backdrop-blur-md" />
                  <button className="p-3 bg-white/10 rounded-full text-white"><Heart size={24} /></button>
                  <button className="p-3 bg-white/10 rounded-full text-white"><Send size={24} /></button>
              </div>
          </div>
      )}
    </div>
  );
};

export default EchoesView;
