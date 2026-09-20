'use client';

import { Sidebar } from '@/components/admin/Sidebar';
import { motion } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row p-4 gap-6">
      <Sidebar />
      <motion.main 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-1 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-200/60 overflow-hidden flex flex-col min-w-0 h-[calc(100vh-2rem)] relative"
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 lg:p-12 lg:px-16 w-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
