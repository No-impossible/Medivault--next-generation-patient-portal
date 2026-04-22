import React from 'react';
import { Loader2, ShieldCheck, Heart } from 'lucide-react';

export default function LoadingOverlay({ message = "Please Wait", subtext = "MediVault is processing your request securely..." }) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="flex flex-col items-center text-center p-8 max-w-sm">
                {/* Animated Icon Container */}
                <div className="relative mb-8">
                    {/* Outer Rotating Ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-primary/10 border-t-primary animate-spin" style={{ width: '80px', height: '80px', margin: '-10px' }} />

                    {/* Inner Pulsing Core */}
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 animate-pulse">
                        <Heart className="h-8 w-8 text-white fill-current" />
                    </div>

                    {/* Floating Orbiting Shields (Micro-animation) */}
                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
                        <ShieldCheck size={14} />
                    </div>
                </div>

                {/* Text Content */}
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    {message}
                </h2>

                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                    {subtext}
                </p>

                {/* Progress Dots */}
                <div className="flex gap-1.5 mt-6 justify-center">
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                </div>
            </div>
        </div>
    );
}
