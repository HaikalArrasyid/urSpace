'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import apiClient from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Zap, UserPlus } from 'lucide-react';

export function AuthCard({ defaultTab = 'login' }: { defaultTab?: 'login' | 'register' }) {
 const router = useRouter();
 const [tab, setTab] = useState<'login' | 'register'>(defaultTab);

 const [loginData, setLoginData] = useState({ username: '', password: '' });
 const [loginLoading, setLoginLoading] = useState(false);

  const [regData, setRegData] = useState({
    username: '', password: '', nama_member: '', email: '', instansi: '', alamat: '', telp: ''
  });
  const [instansiType, setInstansiType] = useState<'freelance' | 'instansi'>('instansi');
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [showRegSuccess, setShowRegSuccess] = useState(false);

  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', loginData);
      const data = response.data.data;
      
      const config = { maxAge: 30 * 24 * 60 * 60, path: '/', secure: process.env.NODE_ENV === 'production' };
      setCookie(null, 'access_token', data.access_token, config);
      setCookie(null, 'user_data', JSON.stringify({
          id: data.id, 
          username: data.username, 
          role: data.role,
          name: data.role === 'member' ? data.member?.nama_member : data.space_owner?.nama_pemilik,
          instansi: data.role === 'member' ? data.member?.instansi : data.space_owner?.nama_coworking
      }), config);

      if (data.role === 'admin_space') router.push('/admin');
      else router.push('/profile');
    } catch (err: any) {
      if (err.message === 'Network Error') setError('Gagal terhubung ke Server Backend.');
      else setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConsentChecked) return;
    
    if (!/^[0-9]+$/.test(regData.telp)) {
      setError('Telepon hanya boleh berisi angka.');
      return;
    }

    setRegLoading(true);
    setError('');

    const finalInstansi = instansiType === 'freelance' ? 'Freelance / Independen' : regData.instansi;

    try {
      await apiClient.post('/auth/register/member', { ...regData, instansi: finalInstansi });
      setError('');
      setShowRegSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat pendaftaran.');
    } finally {
      setRegLoading(false);
    }
  };

 return (
 <div className="min-h-screen flex items-center justify-center bg-background p-4 text-text-primary relative overflow-hidden z-0">
    {/* Animated Background Ambience */}
    <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none -z-10" />
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none -z-10 opacity-70" />
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-dark/10 rounded-full blur-[120px] pointer-events-none -z-10" />

 <button 
 onClick={() => router.push('/')} 
 className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors z-10 bg-surface/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/50 shadow-sm"
 >
 <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
 </button>

      <div className="max-w-5xl w-full mx-auto bg-surface/80 backdrop-blur-2xl rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/60 flex flex-col md:flex-row min-h-[600px] relative z-10">
 
 {/* Left Column (45%) */}
 <div className="hidden md:flex flex-col md:w-[45%] relative bg-brand-dark overflow-hidden">
 <img 
 src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000" 
 alt="Coworking" 
 className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
 
 <div className="relative z-10 p-10 h-full flex flex-col">
 <h2 className="text-white font-black text-2xl tracking-tighter">urSpace<span className="text-primary">.</span></h2>
 <div className="mt-auto">
 <h3 className="text-3xl font-black text-white leading-[1.1] mb-3">
 Ruang Kerja Tanpa Hambatan.
 </h3>
 <p className="text-text-secondary opacity-70 font-medium mb-6">
 Pesan ruang rapat dan meja kerja instan. Fokus pada gagasan besar Anda, kami siapkan tempanya.
 </p>
 <div className="space-y-3">
 <div className="flex items-center gap-3 text-text-secondary opacity-50 text-sm font-medium">
 <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Opsi booking instan & jadwal pasti
 </div>
 <div className="flex items-center gap-3 text-text-secondary opacity-50 text-sm font-medium">
 <Zap className="w-5 h-5 text-primary shrink-0" /> Dedikasi layanan prioritas
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Right Column (55%) */}
 <div className="w-full md:w-[55%] p-8 sm:p-12 flex flex-col bg-surface/40 overflow-y-auto">
 {/* Tab Pill */}
 <div className="flex items-center p-1 bg-badge-bg rounded-lg mb-8 w-full max-w-[300px] shrink-0">
 <button onClick={() => { setTab('login'); setError(''); }} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${tab === 'login' ? 'bg-surface text-text-primary shadow-none' : 'text-text-secondary hover:text-text-secondary'}`}>
 Masuk
 </button>
 <button onClick={() => { setTab('register'); setError(''); }} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${tab === 'register' ? 'bg-surface text-text-primary shadow-none' : 'text-text-secondary hover:text-text-secondary'}`}>
 Daftar Member
 </button>
 </div>

 <h1 className="text-3xl font-black tracking-tight mb-2 text-text-primary pb-1">
 {tab === 'login' ? 'Selamat Datang.' : 'Bergabung Sekarang.'}
 </h1>
 <p className="text-text-secondary font-medium mb-8">
 {tab === 'login' ? 'Masuk ke portal reservasi Anda.' : 'Klaim akun Anda untuk mempermudah operasional pemesanan.'}
 </p>

 {error && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-error/10 text-error p-4 rounded-xl mb-6 text-sm font-bold border border-error/20">
 {error}
 </motion.div>
 )}

          <div className="flex-1">
            {tab === 'login' ? (
              <motion.form key="login" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-text-primary">Username</label>
                  <Input required placeholder="username_anda" value={loginData.username} onChange={e => setLoginData({...loginData, username: e.target.value})} className="h-12 bg-badge-bg border-transparent focus:bg-surface focus:ring-primary transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-text-primary">Kata Sandi</label>
                  <Input type="password" required placeholder="••••••••" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} className="h-12 bg-badge-bg border-transparent focus:bg-surface focus:ring-primary transition-colors" />
                </div>
                <Button type="submit" className="w-full h-12 mt-6 text-base font-bold bg-primary text-text-primary hover:bg-primary-hover rounded-xl shadow-floating " disabled={loginLoading}>
                  {loginLoading ? 'Memproses...' : 'Sign In'}
                </Button>
              </motion.form>
            ) : (
              <motion.form key="register" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleRegisterSubmit} className="space-y-4 pb-8">
                {/* Row 1: Username & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-text-primary">Username</label>
                    <Input required placeholder="johndoe123" value={regData.username} onChange={e => setRegData({...regData, username: e.target.value})} className="h-12 bg-badge-bg border-transparent focus:bg-surface focus:ring-primary transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-text-primary">Alamat Email</label>
                    <Input type="email" required placeholder="john@example.com" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} className="h-12 bg-badge-bg border-transparent focus:bg-surface focus:ring-primary transition-colors" />
                  </div>
                </div>

                {/* Row 2: Nama Lengkap & Telepon */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-text-primary">Nama Lengkap</label>
                    <Input required placeholder="John Doe" value={regData.nama_member} onChange={e => setRegData({...regData, nama_member: e.target.value})} className="h-12 bg-badge-bg border-transparent focus:bg-surface focus:ring-primary transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-text-primary">Nomor WhatsApp / Telepon</label>
                    <Input type="tel" required placeholder="08123456789" pattern="[0-9]*" value={regData.telp} onChange={e => setRegData({...regData, telp: e.target.value.replace(/\D/g, '')})} className="h-12 bg-badge-bg border-transparent focus:bg-surface focus:ring-primary transition-colors" />
                  </div>
                </div>

                {/* Row 3: Status / Instansi & Kata Sandi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center h-5">
                      <label className="block text-sm font-bold text-text-primary">Asal Instansi</label>
                      <div className="flex gap-1.5">
                         <span onClick={() => setInstansiType('freelance')} className={`cursor-pointer text-[10px] uppercase font-bold px-2 py-0.5 rounded-md transition-colors ${instansiType === 'freelance' ? 'bg-primary text-text-primary' : 'bg-badge-bg text-text-secondary'}`}>Freelance</span>
                         <span onClick={() => setInstansiType('instansi')} className={`cursor-pointer text-[10px] uppercase font-bold px-2 py-0.5 rounded-md transition-colors ${instansiType === 'instansi' ? 'bg-primary text-text-primary' : 'bg-badge-bg text-text-secondary'}`}>Instansi</span>
                      </div>
                    </div>
                    {instansiType === 'instansi' ? (
                      <Input required placeholder="Nama Perusahaan / Universitas" value={regData.instansi} onChange={e => setRegData({...regData, instansi: e.target.value})} className="h-12 bg-badge-bg border-transparent focus:bg-surface focus:ring-primary transition-colors" />
                    ) : (
                      <div className="h-12 bg-badge-bg flex items-center px-4 rounded-xl text-text-secondary text-sm font-bold border-transparent">Freelance / Independen</div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center h-5">
                      <label className="block text-sm font-bold text-text-primary">Kata Sandi</label>
                    </div>
                    <Input type="password" required minLength={6} placeholder="Minimal 6 karakter" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} className="h-12 bg-badge-bg border-transparent focus:bg-surface focus:ring-primary transition-colors" />
                  </div>
                </div>

                {/* Row 4: Alamat Domisili */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-text-primary">Alamat Domisili</label>
                  <textarea rows={2} required placeholder="Jl. Sudirman No 1..." value={regData.alamat} onChange={e => setRegData({...regData, alamat: e.target.value})} className="w-full p-3 text-sm bg-badge-bg rounded-xl border-transparent focus:border-primary focus:ring-primary transition-colors resize-y font-medium" />
                </div>

                {/* Row 5: Consent & Submit */}
                <div className="pt-2 flex items-start gap-3">
                  <input type="checkbox" required checked={isConsentChecked} onChange={e => setIsConsentChecked(e.target.checked)} className="mt-1 w-4 h-4 text-primary rounded border-border focus:ring-primary cursor-pointer accent-primary" />
                  <label className="text-xs font-semibold text-text-secondary leading-relaxed cursor-pointer" onClick={() => setIsConsentChecked(!isConsentChecked)}>
                    Saya menyetujui Ketentuan Layanan dan mematuhi aturan reservasi fasilitas yang berlaku.
                  </label>
                </div>

                <Button type="submit" className="w-full h-12 mt-4 text-base font-bold bg-primary text-text-primary hover:bg-primary-hover rounded-xl shadow-floating " disabled={regLoading || !isConsentChecked}>
                  {regLoading ? 'Memproses...' : 'Daftar Sekarang'}
                </Button>
              </motion.form>
            )}
          </div>
 </div>
 </div>

      {/* Registration Success Modal */}
      <AnimatePresence>
          {showRegSuccess && (
              <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4"
              >
                  <motion.div 
                      initial={{ scale: 0.95, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.95, opacity: 0, y: 20 }}
                      className="bg-surface p-10 rounded-3xl max-w-md w-full mx-auto shadow-floating border border-border/50 text-center relative overflow-hidden"
                  >
                      <div className="absolute top-0 right-0 w-40 h-40 bg-success/20 rounded-full blur-[50px] -z-10 -translate-y-1/2 translate-x-1/2" />
                      
                      <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6 transform shadow-[0_0_20px_0_rgba(16,185,129,0.2)]">
                          <CheckCircle2 className="w-10 h-10" />
                      </div>
                      
                      <h3 className="text-2xl font-black text-text-primary mb-3 tracking-tight">Akun Berhasil Dibuat!</h3>
                      <p className="text-sm font-medium text-text-secondary mb-8 leading-relaxed">
                          Selamat datang di ekosistem urSpace. Akun member Anda sudah terdaftar dan siap digunakan. Silakan masuk untuk memulai reservasi pertamamu.
                      </p>
                      
                      <button 
                          onClick={() => {
                              setShowRegSuccess(false);
                              setTab('login');
                          }}
                          className="w-full h-14 rounded-2xl bg-primary text-text-primary text-lg font-black hover:bg-primary-hover shadow-[0_4px_14px_0_rgba(255,213,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,213,0,0.23)] transition-all outline-none"
                      >
                          Lanjut ke Login
                      </button>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>
 </div>
 );
}
