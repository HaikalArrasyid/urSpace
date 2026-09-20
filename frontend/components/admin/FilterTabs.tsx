'use client';

import { motion } from 'framer-motion';

interface FilterTabsProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    searchValue: string;
    onSearchChange: (val: string) => void;
    searchPlaceholder?: string;
    extraActions?: React.ReactNode;
}

export function FilterTabs({ 
    tabs, 
    activeTab, 
    onTabChange, 
    searchValue, 
    onSearchChange,
    searchPlaceholder = "Cari data...",
    extraActions
}: FilterTabsProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
        >
            <div className="flex bg-slate-100/80 p-1 rounded-xl overflow-x-auto max-w-full border border-slate-200/50">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap rounded-lg transition-all ${
                            activeTab === tab 
                            ? 'bg-white text-slate-800 shadow-sm border border-slate-200/60' 
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                <input 
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-10 px-4 rounded-xl border border-slate-200 bg-white focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary text-sm font-bold w-full md:w-64 placeholder:text-slate-400 text-slate-800 transition-colors shadow-sm"
                />
                {extraActions}
            </div>
        </motion.div>
    );
}
