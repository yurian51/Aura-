
import React, { useState } from 'react';
import { UserSettings, Post, Contact, MOOD_COLORS } from '../types';
import { Settings, Edit3, Share2, Grid, Heart, Lock, MapPin, Link as LinkIcon, Users, Calendar, Camera, Image as ImageIcon, Video, MoreHorizontal, Bookmark, Play } from 'lucide-react';

interface PersonaViewProps {
  settings: UserSettings;
  posts: Post[];
  contacts: Contact[];
  onNavigate: (dest: string) => void;
}

const PersonaView: React.FC<PersonaViewProps> = ({ settings, posts, contacts, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'private'>('posts');

  const myPosts = posts.filter(p => p.authorId === 'me');

  return (
    <div className="w-full h-full overflow-y-auto bg-[#050505] pb-24 relative">
      
      {/* Facebook Style Cover Photo */}
      <div className="relative h-48 w-full bg-gradient-to-r from-teal-900 to-purple-900 overflow-hidden group">
          <img src={`https://picsum.photos/800/400?random=cover`} className="w-full h-full object-cover opacity-60" />
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100">
              <Camera size={18} className="text-white" />
          </div>
      </div>

      {/* Profile Header Info */}
      <div className="px-4 relative -mt-16 mb-4">
          <div className="flex justify-between items-end">
              <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-[#050505] overflow-hidden bg-black relative group cursor-pointer">
                      <img src={settings.avatar} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera size={24} className="text-white" />
                      </div>
                  </div>
                  {settings.subscriptionTier === 'supernova' && (
                      <div className="absolute bottom-2 right-2 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#050505]">
                          PRO
                      </div>
                  )}
              </div>
              
              <div className="flex gap-2 mb-4">
                   <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">
                       <Share2 size={20} />
                   </button>
                   <button 
                    onClick={() => onNavigate('settings')}
                    className="p-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                   >
                       <Settings size={20} />
                   </button>
              </div>
          </div>

          <div className="mt-3">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  {settings.name} 
                  {settings.badges.some(b => b.type === 'verified') && <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-black font-bold">✓</div>}
              </h1>
              <p className="text-white/50 text-sm font-mono">@{settings.username}</p>
          </div>

          {/* TikTok Style Stats */}
          <div className="flex items-center gap-6 mt-4 border-b border-white/5 pb-4">
              <div className="text-center cursor-pointer hover:opacity-80">
                  <span className="block text-lg font-bold text-white">142</span>
                  <span className="text-xs text-white/40">Following</span>
              </div>
              <div className="text-center cursor-pointer hover:opacity-80">
                  <span className="block text-lg font-bold text-white">8.5k</span>
                  <span className="text-xs text-white/40">Followers</span>
              </div>
              <div className="text-center cursor-pointer hover:opacity-80">
                  <span className="block text-lg font-bold text-white">12.4k</span>
                  <span className="text-xs text-white/40">Likes</span>
              </div>
          </div>

          {/* Bio & Details */}
          <div className="mt-4 space-y-2 text-sm">
              <p className="text-white/90 whitespace-pre-line">{settings.about || "Digital nomad exploring the Aura."}</p>
              
              <div className="flex flex-wrap gap-3 text-white/50 text-xs">
                  {settings.facebookSettings.currentCity && (
                      <div className="flex items-center gap-1"><MapPin size={12} /> {settings.facebookSettings.currentCity}</div>
                  )}
                  {settings.facebookSettings.workplace && (
                      <div className="flex items-center gap-1"><LinkIcon size={12} /> {settings.facebookSettings.workplace}</div>
                  )}
                  <div className="flex items-center gap-1"><Calendar size={12} /> Joined March 2024</div>
              </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-6">
              <button className="flex-1 py-2.5 bg-teal-500 text-black font-bold rounded-lg text-sm hover:bg-teal-400 transition-colors flex items-center justify-center gap-2">
                  <Edit3 size={16} /> Edit Persona
              </button>
              <button className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white font-bold rounded-lg text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                  <Bookmark size={16} /> Saved
              </button>
          </div>
      </div>

      {/* Facebook Style Friends Grid */}
      <div className="mt-2 px-4 py-4 border-t border-white/5">
          <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-bold text-sm">My Circle</h3>
              <span className="text-white/40 text-xs cursor-pointer">See all</span>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {contacts.map(contact => (
                  <div key={contact.id} className="flex flex-col items-center gap-1 min-w-[60px] cursor-pointer group">
                      <div className="w-14 h-14 rounded-full border border-white/10 overflow-hidden relative">
                          <img src={contact.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black" style={{ backgroundColor: MOOD_COLORS[contact.mood] }} />
                      </div>
                      <span className="text-xs text-white/70 truncate w-full text-center">{contact.name.split(' ')[0]}</span>
                  </div>
              ))}
              <div className="flex flex-col items-center gap-1 min-w-[60px] cursor-pointer group">
                  <div className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <Users size={20} className="text-white/50" />
                  </div>
                  <span className="text-xs text-white/50">Find</span>
              </div>
          </div>
      </div>

      {/* Content Tabs */}
      <div className="sticky top-0 bg-[#050505]/95 backdrop-blur-md z-10 border-t border-b border-white/5 mt-2">
          <div className="flex">
              <button 
                onClick={() => setActiveTab('posts')}
                className={`flex-1 py-3 flex justify-center items-center transition-colors relative ${activeTab === 'posts' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                  <Grid size={20} />
                  {activeTab === 'posts' && <div className="absolute bottom-0 w-12 h-0.5 bg-white rounded-t-full" />}
              </button>
              <button 
                onClick={() => setActiveTab('likes')}
                className={`flex-1 py-3 flex justify-center items-center transition-colors relative ${activeTab === 'likes' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                  <Heart size={20} />
                  {activeTab === 'likes' && <div className="absolute bottom-0 w-12 h-0.5 bg-white rounded-t-full" />}
              </button>
              <button 
                onClick={() => setActiveTab('private')}
                className={`flex-1 py-3 flex justify-center items-center transition-colors relative ${activeTab === 'private' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
              >
                  <Lock size={20} />
                  {activeTab === 'private' && <div className="absolute bottom-0 w-12 h-0.5 bg-white rounded-t-full" />}
              </button>
          </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-0.5 min-h-[300px]">
          {activeTab === 'posts' ? (
              myPosts.length > 0 ? (
                  myPosts.map(post => (
                      <div key={post.id} className="aspect-[3/4] bg-white/5 relative group cursor-pointer overflow-hidden">
                          {post.type === 'video' ? (
                               <div className="w-full h-full relative">
                                  <video src={post.videoUrl} className="w-full h-full object-cover" muted />
                                  <div className="absolute top-2 right-2"><Video size={14} className="text-white drop-shadow-md" /></div>
                                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-bold drop-shadow-md">
                                      <Play size={10} fill="currentColor" /> {post.views || 0}
                                  </div>
                               </div>
                          ) : (
                               <div className="w-full h-full relative">
                                  <img src={post.image || 'https://picsum.photos/300'} className="w-full h-full object-cover" />
                                  {post.type === 'image' && <div className="absolute top-2 right-2"><ImageIcon size={14} className="text-white drop-shadow-md" /></div>}
                               </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="flex items-center gap-1 text-white font-bold">
                                  <Heart size={16} fill="currentColor" /> {post.likes}
                              </div>
                          </div>
                      </div>
                  ))
              ) : (
                  <div className="col-span-3 py-20 flex flex-col items-center justify-center text-white/30">
                      <Camera size={48} className="mb-4 opacity-50" />
                      <p>No moments captured yet.</p>
                      <button className="mt-4 px-4 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 text-white">Create First Post</button>
                  </div>
              )
          ) : activeTab === 'likes' ? (
              <div className="col-span-3 py-20 flex flex-col items-center justify-center text-white/30">
                  <Heart size={48} className="mb-4 opacity-50" />
                  <p>Posts you've liked will appear here.</p>
              </div>
          ) : (
              <div className="col-span-3 py-20 flex flex-col items-center justify-center text-white/30">
                  <Lock size={48} className="mb-4 opacity-50" />
                  <p>This content is private.</p>
              </div>
          )}
      </div>

    </div>
  );
};

export default PersonaView;
