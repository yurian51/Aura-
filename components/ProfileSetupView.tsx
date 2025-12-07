
import React, { useState } from 'react';
import { Camera, Check, User } from 'lucide-react';

interface ProfileSetupViewProps {
    username: string;
    onComplete: (avatar: string, bio: string) => void;
}

const ProfileSetupView: React.FC<ProfileSetupViewProps> = ({ username, onComplete }) => {
    const [bio, setBio] = useState('Digital nomad exploring the Aura.');
    const [avatarUrl, setAvatarUrl] = useState(`https://ui-avatars.com/api/?name=${username}&background=random`);

    // Simulate file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setAvatarUrl(url);
        }
    };

    return (
        <div className="w-full h-screen bg-[#050505] flex items-center justify-center p-4">
            <div className="w-full max-w-md glass-panel p-8 rounded-3xl animate-fade-in-up flex flex-col items-center">
                <h2 className="text-xl font-serif text-white tracking-widest mb-2">COMPLETE PROFILE</h2>
                <p className="text-white/40 text-xs mb-8">Establish your visual presence</p>

                <div className="relative mb-8 group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-teal-500/30 bg-black">
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                        <Camera className="text-white" size={24} />
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>

                <div className="w-full space-y-4">
                     <div>
                        <label className="text-[10px] uppercase text-white/40 font-bold ml-2">Display Name</label>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-white flex items-center gap-3">
                            <User size={16} className="text-white/30" />
                            <span>@{username}</span>
                        </div>
                     </div>

                     <div>
                        <label className="text-[10px] uppercase text-white/40 font-bold ml-2">About</label>
                        <textarea 
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-teal-500/50 min-h-[100px]"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell your story..."
                        />
                     </div>
                </div>

                <button 
                    onClick={() => onComplete(avatarUrl, bio)}
                    className="w-full mt-8 py-3 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                    Initialize <Check size={18} />
                </button>
            </div>
        </div>
    );
};

export default ProfileSetupView;
