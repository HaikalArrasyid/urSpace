'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: LucideIcon;
    isHighlight?: boolean;
}

export function StatCard({ title, value, subtitle, icon: Icon, isHighlight = false }: StatCardProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4 }}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                isHighlight 
                    ? 'bg-brand-dark border-brand-dark shadow-floating' 
                    : 'bg-surface border-border hover:border-primary/50 hover:shadow-floating shadow-none'
            }`}
        >
            {isHighlight && (
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            )}
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isHighlight ? 'bg-white/10' : 'bg-slate-50 border border-slate-100'}`}>
                        {Icon && <Icon size={18} className={isHighlight ? 'text-white' : 'text-slate-500'} />}
                    </div>
                </div>
                
                <div>
                    <h3 className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${isHighlight ? 'text-slate-300' : 'text-slate-500'}`}>
                        {title}
                    </h3>
                    <p className="text-3xl font-black tracking-tight leading-none mb-1.5">{value}</p>
                    {subtitle && (
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${isHighlight ? 'text-slate-400' : 'text-slate-400'}`}>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
