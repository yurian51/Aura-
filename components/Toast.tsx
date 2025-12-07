
import React, { useEffect } from 'react';
import { Toast } from '../types';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
    toast: Toast;
    onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastProps> = ({ toast, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, 3000);
        return () => clearTimeout(timer);
    }, [toast.id, onClose]);

    const getIcon = () => {
        switch (toast.type) {
            case 'success': return <CheckCircle size={18} className="text-teal-400" />;
            case 'error': return <AlertCircle size={18} className="text-red-400" />;
            case 'warning': return <AlertCircle size={18} className="text-amber-400" />;
            default: return <Info size={18} className="text-blue-400" />;
        }
    };

    return (
        <div className="flex items-center gap-3 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 shadow-2xl min-w-[300px] animate-fade-in-up backdrop-blur-md">
            {getIcon()}
            <span className="text-sm font-medium text-white/90 flex-1">{toast.message}</span>
            <button onClick={() => onClose(toast.id)} className="text-white/30 hover:text-white">
                <X size={14} />
            </button>
        </div>
    );
};

interface ToastContainerProps {
    toasts: Toast[];
    removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 z-[100] pointer-events-none">
            {toasts.map(t => (
                <div key={t.id} className="pointer-events-auto">
                    <ToastItem toast={t} onClose={removeToast} />
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
