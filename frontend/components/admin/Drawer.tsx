'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
}

export function Drawer({ isOpen, onClose, title, description, children }: DrawerProps) {
    // Prevent scrolling when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
                    />
                    
                    {/* Drawer */}
                    <motion.div 
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-2 right-2 bottom-2 w-full sm:w-[480px] bg-white z-50 flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-slate-100"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white shrink-0">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
                                {description && <p className="text-[11px] text-slate-500 mt-1.5 font-bold uppercase tracking-widest">{description}</p>}
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-700 transition-colors bg-slate-50/50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto min-h-0 bg-white">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export function DrawerFooter({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0 flex items-center gap-3 justify-end">
            {children}
        </div>
    );
}
