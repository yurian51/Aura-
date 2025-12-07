
import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, User, Mail, Phone, Calendar, Lock, CheckCircle } from 'lucide-react';

interface AuthViewProps {
    onLogin: (userData: any) => void;
    onSignup: (userData: any) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, onSignup }) => {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form Data
    const [identifier, setIdentifier] = useState(''); // User/Phone/Email for login
    const [password, setPassword] = useState('');
    
    // Signup Specific
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('Prefer not to say');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const handleSubmit = () => {
        if (mode === 'signin') {
            if (identifier && password) {
                onLogin({ identifier, password });
            }
        } else {
            if (password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }
            onSignup({
                firstName, lastName, username, email, phone, gender,
                dob: `${day} ${month} ${year}`,
                password
            });
        }
    };

    return (
        <div className="w-full h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md glass-panel p-8 rounded-3xl animate-fade-in-up relative z-10 border border-white/10 max-h-[90vh] overflow-y-auto scrollbar-hide">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-serif text-white tracking-widest mb-2">
                        {mode === 'signin' ? 'WELCOME BACK' : 'CREATE IDENTITY'}
                    </h2>
                    <p className="text-white/40 text-xs uppercase tracking-wider">
                        {mode === 'signin' ? 'Resume your connection' : 'Begin your journey'}
                    </p>
                </div>

                <div className="space-y-4">
                    {mode === 'signup' && (
                        <>
                            <div className="flex gap-4">
                                <InputGroup icon={<User size={16}/>} placeholder="First Name" value={firstName} onChange={setFirstName} />
                                <InputGroup icon={<User size={16}/>} placeholder="Last Name" value={lastName} onChange={setLastName} />
                            </div>
                            <InputGroup icon={<User size={16}/>} placeholder="Username" value={username} onChange={setUsername} />
                            <InputGroup icon={<Mail size={16}/>} placeholder="Email Address" value={email} onChange={setEmail} type="email" />
                            <InputGroup icon={<Phone size={16}/>} placeholder="Phone Number" value={phone} onChange={setPhone} type="tel" />
                            
                            {/* DOB */}
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase text-white/40 font-bold ml-2">Date of Birth</label>
                                <div className="flex gap-2">
                                    <select className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm outline-none flex-1" value={day} onChange={e => setDay(e.target.value)}>
                                        <option value="">Day</option>
                                        {days.map(d => <option key={d} value={d} className="text-black">{d}</option>)}
                                    </select>
                                    <select className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm outline-none flex-1" value={month} onChange={e => setMonth(e.target.value)}>
                                        <option value="">Month</option>
                                        {months.map(m => <option key={m} value={m} className="text-black">{m}</option>)}
                                    </select>
                                    <select className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm outline-none flex-1" value={year} onChange={e => setYear(e.target.value)}>
                                        <option value="">Year</option>
                                        {years.map(y => <option key={y} value={y} className="text-black">{y}</option>)}
                                    </select>
                                </div>
                            </div>

                             {/* Gender */}
                             <div className="space-y-1">
                                <label className="text-[10px] uppercase text-white/40 font-bold ml-2">Gender</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm outline-none" value={gender} onChange={e => setGender(e.target.value)}>
                                    <option value="Male" className="text-black">Male</option>
                                    <option value="Female" className="text-black">Female</option>
                                    <option value="Non-binary" className="text-black">Non-binary</option>
                                    <option value="Prefer not to say" className="text-black">Prefer not to say</option>
                                </select>
                            </div>
                        </>
                    )}

                    {mode === 'signin' && (
                        <InputGroup icon={<User size={16}/>} placeholder="Username, Phone, or Email" value={identifier} onChange={setIdentifier} />
                    )}

                    {/* Password */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"><Lock size={16} /></div>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white outline-none focus:border-teal-500/50 transition-colors placeholder-white/20"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {mode === 'signup' && (
                         <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"><Lock size={16} /></div>
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Confirm Password" 
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white outline-none focus:border-teal-500/50 transition-colors placeholder-white/20"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    )}
                </div>

                <button 
                    onClick={handleSubmit}
                    className="w-full mt-8 py-4 bg-gradient-to-r from-teal-500 to-teal-700 rounded-xl text-white font-bold tracking-widest uppercase hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all flex items-center justify-center gap-2"
                >
                    {mode === 'signin' ? 'Access' : 'Register'} <ArrowRight size={16} />
                </button>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                        className="text-xs text-white/50 hover:text-white transition-colors uppercase tracking-wider"
                    >
                        {mode === 'signin' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({ icon, placeholder, value, onChange, type = "text" }: any) => (
    <div className="relative w-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">{icon}</div>
        <input 
            type={type} 
            placeholder={placeholder} 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-teal-500/50 transition-colors placeholder-white/20"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

export default AuthView;
