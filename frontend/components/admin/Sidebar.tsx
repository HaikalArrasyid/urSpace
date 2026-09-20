'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { destroyCookie } from 'nookies';
import { 
    LayoutDashboard, 
    CalendarCheck, 
    Box, 
    Ticket, 
    Users, 
    MapPin, 
    LogOut 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/lib/axios';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        apiClient.get('/auth/profile').then(res => setProfile(res.data.data)).catch(() => {});
    }, []);

    const MENU_ITEMS = [
        { name: 'Ringkasan & Laporan', href: '/admin', icon: LayoutDashboard },
        { name: 'Operasional Reservasi', href: '/admin/reservations', icon: CalendarCheck },
        { name: 'Inventaris Space & Meja', href: '/admin/spaces', icon: Box },
        { name: 'Kupon & Diskon Promo', href: '/admin/promos', icon: Ticket },
        { name: 'Direktori Member', href: '/admin/members', icon: Users },
        { name: 'Pengaturan Lokasi', href: '/admin/profile', icon: MapPin },
    ];

    const handleLogout = () => {
    destroyCookie(null, 'access_token');
    destroyCookie(null, 'user_data');
    router.push('/login');
  };

  return (
    <aside className="w-full md:w-[280px] bg-transparent flex flex-col shrink-0 h-[calc(100vh-2rem)]">
        <div className="p-6 mb-4">
            <h2 className="text-3xl font-black tracking-tighter text-slate-800">urSpace<span className="text-primary">.hq</span></h2>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-2 font-bold">Admin Workspace</p>
        </div>
        
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
            {MENU_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                    <Link 
                        key={item.href} 
                        href={item.href} 
                        className={`flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                            isActive 
                            ? 'bg-white text-primary shadow-sm border border-slate-100' 
                            : 'text-slate-500 hover:bg-white/60 hover:text-slate-900 border border-transparent'
                        }`}
                    >
                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-primary' : 'text-slate-400'}/>
                        {item.name}
                    </Link>
                );
            })}
        </nav>

        <div className="p-4 mt-6">
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4 border-b border-slate-50 pb-4">
                   <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center font-black text-slate-800 shrink-0 text-sm border border-slate-100">
                       {profile?.nama_member?.substring(0,2).toUpperCase() || 'AD'}
                   </div>
                   <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-slate-800 truncate">{profile?.nama_member || 'Ahmad Bidin'}</p>
                       <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold truncate mt-0.5">Admin Pengelola</p>
                   </div>
                </div>
                
                <button 
                    onClick={() => setShowLogoutConfirm(true)} 
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-error text-xs font-bold uppercase tracking-widest transition-colors"
                >
                    <LogOut size={16} />
                    Keluar Sesi
                </button>
            </div>
        </div>

        {/* Logout Confirmation Modal - Portaled */}
        {mounted && createPortal(
            <AnimatePresence>
                {showLogoutConfirm && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white p-8 rounded-3xl max-w-sm w-full mx-auto shadow-floating border border-slate-100 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-error/10 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="w-16 h-16 bg-error/10 text-error rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                                <LogOut className="w-8 h-8 -ml-1" />
                            </div>
                            
                            <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Keluar Sesi?</h3>
                            <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                                Anda yakin ingin keluar dari panel admin? Sesi kerja Anda akan dihentikan saat ini juga.
                            </p>
                            
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowLogoutConfirm(false)} 
                                    className="flex-1 h-12 rounded-xl bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 transition-colors outline-none"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={() => {
                                        setShowLogoutConfirm(false);
                                        handleLogout();
                                    }}
                                    className="flex-1 h-12 rounded-xl bg-error text-white font-bold hover:bg-red-600 shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.23)] transition-all outline-none"
                                >
                                    Ya, Keluar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>,
            document.body
        )}
    </aside>
  );
}
