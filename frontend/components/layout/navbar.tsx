'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { destroyCookie, parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';

type User = {
    name: string;
    role: string;
    instansi?: string;
};

function getUserFromCookies(): User | null {
    const cookies = parseCookies();
    if (cookies.user_data) {
        try {
            return JSON.parse(cookies.user_data);
        } catch {
            return null;
        }
    }
    return null;
}

export function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setUser(getUserFromCookies());
        setMounted(true);
    }, []);

    const handleLogout = () => {
        destroyCookie(null, 'access_token');
        destroyCookie(null, 'user_data');
        setUser(null);
        router.push('/login');
    };

    return (
        <motion.nav 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 bg-surface/65 backdrop-blur-xl border-b border-border"
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-text-primary font-black text-lg transition-transform group-hover:scale-105 shadow-none ">
                        u.
                    </div>
                    <span className="font-black text-xl tracking-tight text-text-primary transition-colors">urSpace</span>
                </Link>
                
                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/spaces" className="text-sm font-bold text-text-secondary hover:text-text-primary transition-colors">
                        Katalog Ruang
                    </Link>
                    <Link href="/#opsi-sewa" className="text-sm font-bold text-text-secondary hover:text-text-primary transition-colors">
                        Opsi Sewa
                    </Link>
                    <Link href="/history" className="text-sm font-bold text-text-secondary hover:text-text-primary transition-colors">
                        Reservasi Saya
                    </Link>
                </div>

                {/* User Bounds */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link 
                                href={user.role === 'member' ? '/profile' : '/admin'}
                                className="flex items-center gap-3 p-1.5 pr-4 rounded-full border border-transparent hover:bg-badge-bg transition-all group"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-text-primary text-xs shrink-0 group-hover:scale-105 transition-transform">
                                    {user.name?.substring(0, 2).toUpperCase() || 'US'}
                                </div>
                                <div className="hidden sm:flex flex-col items-start text-left max-w-[120px]">
                                    <span className="text-xs font-bold text-text-primary truncate w-full group-hover:text-primary transition-colors">{user.name}</span>
                                    <span className="text-[9px] font-semibold text-text-secondary uppercase tracking-widest truncate w-full mt-0.5">
                                        {user.instansi || (user.role === 'admin_space' ? 'Pengelola Hub' : 'Member')}
                                    </span>
                                </div>
                            </Link>

                            <button 
                                onClick={() => setShowLogoutConfirm(true)} 
                                className="flex items-center justify-center w-10 h-10 rounded-full border border-error/20 bg-error/5 hover:bg-error/10 text-error transition-colors focus:outline-none"
                                title="Keluar Sesi"
                            >
                                <LogOut className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-bold text-text-secondary hover:text-text-primary transition-colors">
                                Masuk
                            </Link>
                            <Link href="/register/member" className="bg-brand-dark text-primary px-5 py-2.5 rounded-full text-sm font-bold hover:bg-black transition-colors shadow-floating ">
                                Daftar
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Logout Confirmation Modal - Portaled to avoid transform issues */}
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
                                className="bg-surface p-8 rounded-3xl max-w-sm w-full mx-auto shadow-floating border border-border/50 text-center relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-error/10 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
                                
                                <div className="w-16 h-16 bg-error/10 text-error rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                                    <LogOut className="w-8 h-8 -ml-1" />
                                </div>
                                
                                <h3 className="text-xl font-black text-text-primary mb-2 tracking-tight">Keluar Sesi?</h3>
                                <p className="text-sm font-medium text-text-secondary mb-8 leading-relaxed">
                                    Anda yakin ingin keluar dari akun? Anda akan diminta memasukkan kata sandi kembali saat masuk berikutnya.
                                </p>
                                
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setShowLogoutConfirm(false)} 
                                        className="flex-1 h-12 rounded-xl bg-badge-bg text-text-secondary font-bold hover:bg-border transition-colors outline-none"
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
        </motion.nav>
    );
}
