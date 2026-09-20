'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import apiClient from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function RegisterAdminPage() {
 const router = useRouter();
 const [formData, setFormData] = useState({
 username: '',
 password: '',
 nama_coworking: '',
 nama_pemilik: '',
 telp: '',
 });
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setError('');

 try {
 await apiClient.post('/auth/register/admin-space', formData);
 // Pindahkan ke login setelah register
 router.push('/login');
 } catch (err: any) {
 setError(err.response?.data?.message || 'Terjadi kesalahan saat pendaftaran.');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="min-h-screen flex py-12 items-center justify-center bg-background p-4 text-text-primary relative">
 <button 
 onClick={() => router.push('/')} 
 className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
 >
 <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
 </button>

 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, ease: "easeOut" }}
 className="max-w-md w-full bg-brand-dark p-10 rounded-2xl shadow-floating border border-border"
 >
 <div className="mb-10 text-center">
 <h1 className="text-3xl font-black tracking-tight mb-2 text-white pb-1">Register Admin<span className="text-primary">.</span></h1>
 <p className="text-text-secondary font-medium">Platform operasional urSpace.hq</p>
 </div>
 
 {error && (
 <motion.div 
 initial={{ opacity: 0 }} 
 animate={{ opacity: 1 }} 
 className="bg-error/100/10 text-error p-4 rounded-xl mb-6 text-sm font-medium border border-error/20"
 >
 {error}
 </motion.div>
 )}

 <form onSubmit={handleSubmit} className="space-y-4">
 <div className="space-y-1.5">
 <label className="block text-sm font-bold text-text-secondary opacity-50">Username Admin</label>
 <Input required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="h-12 bg-white/10 border-transparent text-white focus:bg-white/20 focus:ring-primary transition-colors" />
 </div>
 <div className="space-y-1.5">
 <label className="block text-sm font-bold text-text-secondary opacity-50">Password</label>
 <Input type="password" required minLength={6} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="h-12 bg-white/10 border-transparent text-white focus:bg-white/20 focus:ring-primary transition-colors" />
 </div>
 <div className="h-px bg-gray-800 my-6"></div>
 <div className="space-y-1.5 pt-2">
 <label className="block text-sm font-bold text-text-secondary opacity-50">Nama Coworking Space</label>
 <Input required value={formData.nama_coworking} onChange={(e) => setFormData({...formData, nama_coworking: e.target.value})} className="h-12 bg-white/10 border-transparent text-white focus:bg-white/20 focus:ring-primary transition-colors" />
 </div>
 <div className="space-y-1.5">
 <label className="block text-sm font-bold text-text-secondary opacity-50">Nama Pemilik/Penanggung Jawab</label>
 <Input required value={formData.nama_pemilik} onChange={(e) => setFormData({...formData, nama_pemilik: e.target.value})} className="h-12 bg-white/10 border-transparent text-white focus:bg-white/20 focus:ring-primary transition-colors" />
 </div>
 <div className="space-y-1.5">
 <label className="block text-sm font-bold text-text-secondary opacity-50">Telepon Pengelola</label>
 <Input required value={formData.telp} onChange={(e) => setFormData({...formData, telp: e.target.value})} className="h-12 bg-white/10 border-transparent text-white focus:bg-white/20 focus:ring-primary transition-colors" />
 </div>
 <Button type="submit" className="w-full mt-8 h-12 text-base font-bold bg-primary text-text-primary hover:bg-primary-hover rounded-xl shadow-floating " disabled={loading}>
 {loading ? 'Memproses...' : 'Daftar sebagai Admin'}
 </Button>
 </form>

 <div className="mt-8 pt-6 text-center text-sm font-medium text-text-secondary border-t border-border">
 <p>Sudah punya akun? <button onClick={() => router.push('/login')} className="text-white font-bold underline underline-offset-4 hover:text-primary transition-colors">Masuk di sini</button></p>
 </div>
 </motion.div>
 </div>
 );
}
