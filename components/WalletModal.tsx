
import React from 'react';
import { CoinPackage } from '../types';
import { X, Sparkles, CreditCard, Gift, Shield, ChevronRight, Zap } from 'lucide-react';

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    balance: number;
    onBuy: (pkg: CoinPackage) => void;
}

// TikTok-style micro-transaction pricing
const COIN_PACKAGES: CoinPackage[] = [
    { id: 'p1', coins: 70, price: '$0.74' },
    { id: 'p2', coins: 350, price: '$3.70', bonus: 10 },
    { id: 'p3', coins: 700, price: '$7.40', bonus: 30 },
    { id: 'p4', coins: 1400, price: '$14.80', bonus: 80 },
    { id: 'p5', coins: 3500, price: '$37.00', bonus: 250 },
    { id: 'p6', coins: 7000, price: '$74.00', bonus: 600 },
    { id: 'p7', coins: 17500, price: '$185.00', bonus: 1800 },
];

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, balance, onBuy }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md" onClick={onClose}>
            <div className="glass-panel w-full sm:max-w-md max-h-[90vh] sm:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col animate-slide-up bg-[#121212]" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#1a1a1a]">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-white">Recharge</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Balance Card */}
                <div className="p-6 bg-gradient-to-r from-teal-900/20 to-amber-900/20 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles size={64} className="text-amber-400" /></div>
                    <span className="text-xs text-white/50 uppercase tracking-widest font-medium mb-1 block">Total Balance</span>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/50">
                            <span className="text-black font-bold text-xs">A</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white">{balance.toLocaleString()}</h2>
                    </div>
                </div>

                {/* Custom Amount / Payment Method */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 hover:bg-white/5 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <CreditCard size={18} className="text-white/60" />
                        <span className="text-sm text-white">Payment Method</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                        <span>Apple Pay</span>
                        <ChevronRight size={14} />
                    </div>
                </div>

                {/* Packages */}
                <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 px-1">Select Amount</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {COIN_PACKAGES.map(pkg => (
                            <button 
                                key={pkg.id} 
                                className="relative flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-teal-500/50 transition-all active:scale-95 group"
                                onClick={() => onBuy(pkg)}
                            >
                                {pkg.bonus && (
                                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl-lg rounded-tr-lg">
                                        BONUS
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 mb-2">
                                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shadow shadow-amber-500/50">
                                        <span className="text-black font-bold text-[10px]">A</span>
                                    </div>
                                    <span className="text-lg font-bold text-white">{pkg.coins}</span>
                                </div>
                                {pkg.bonus && <span className="text-[10px] text-teal-400 mb-1">+{pkg.bonus} extra</span>}
                                <div className="bg-white/10 px-6 py-1.5 rounded-full group-hover:bg-teal-500 group-hover:text-black transition-colors">
                                    <span className="text-sm font-bold text-white group-hover:text-black">{pkg.price}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                    
                    <div className="mt-6 flex gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                        <Shield size={20} className="text-green-400 flex-shrink-0" />
                        <p className="text-[10px] text-white/40 leading-relaxed">
                            By recharging, you agree to Aura's Terms of Service. Coins are non-refundable and can be used to send Gifts in Flow and Live.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletModal;
