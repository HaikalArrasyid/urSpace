'use client';

import { LucideIcon } from 'lucide-react';

import { motion } from 'framer-motion';

interface HeaderProps {
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
        icon?: LucideIcon;
    };
}

export function Header({ title, description, action }: HeaderProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
            <div>
                <h1 className="text-3xl font-black text-text-primary tracking-tight">{title}</h1>
                <p className="text-sm font-medium text-text-secondary mt-1">{description}</p>
            </div>
            {action && (
                <button 
                    onClick={action.onClick}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-text-primary h-12 px-6 rounded-xl text-sm font-bold uppercase tracking-widest shadow-floating transition-colors shrink-0"
                >
                    {action.icon && <action.icon size={18} />}
                    {action.label}
                </button>
            )}
        </motion.div>
    );
}
