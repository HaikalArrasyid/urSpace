'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/axios';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const router = useRouter();
  
  // Profile State
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    nama_member: '',
    email: '',
    instansi: '',
    alamat: '',
    telp: '',
    password: '',
  });
  const [instansiType, setInstansiType] = useState<'freelance' | 'instansi'>('instansi');
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // History State
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        const [profRes, histRes] = await Promise.all([
          apiClient.get('/auth/profile'),
          apiClient.get('/reservasi/my/history')
        ]);
        
        const memberData = profRes.data.data.member;
        
        const isFreelance = memberData.instansi === 'Freelance / Independen';
        setInstansiType(isFreelance ? 'freelance' : 'instansi');

        setProfile(memberData);
        setFormData({
            nama_member: memberData.nama_member || '',
            email: memberData.email || '',
            instansi: isFreelance ? '' : (memberData.instansi || ''),
            alamat: memberData.alamat || '',
            telp: memberData.telp || '',
            password: '',
        });

        setHistory(histRes.data.data);
      } catch (err) {
        console.error(err);
      }
    }
    init();
  }, []);

  const finalInstansi = instansiType === 'freelance' ? 'Freelance / Independen' : formData.instansi;
  const hasInstansiChanged = profile && finalInstansi !== profile.instansi;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password && formData.password.length < 6) {
        setError('Kata sandi minimal 6 karakter.');
        return;
    }
    if (!/^[0-9]+$/.test(formData.telp)) {
        setError('Telepon hanya boleh berisi angka.');
        return;
    }
    if (instansiType === 'instansi' && !formData.instansi) {
        setError('Nama Instansi / Perusahaan tidak boleh kosong.');
        return;
    }
    if (hasInstansiChanged && !isConsentChecked) {
        setError('Anda harus menyetujui Pakta Integritas untuk mengubah Asal Instansi.');
        return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Clean empty fields
      const payload: any = {};
      if (formData.nama_member !== profile.nama_member) payload.nama_member = formData.nama_member;
      if (formData.email && formData.email !== profile.email) payload.email = formData.email;
      if (hasInstansiChanged) payload.instansi = finalInstansi;
      if (formData.alamat !== profile.alamat) payload.alamat = formData.alamat;
      if (formData.telp !== profile.telp) payload.telp = formData.telp;
      if (formData.password) payload.password = formData.password;

      await apiClient.put('/member/profile', payload);
      setSuccess('Profil berhasil diperbarui!');
      
      // Update local profile state to reflect changes
      setProfile((prev: any) => ({ ...prev, ...payload }));
      setIsConsentChecked(false);
      setFormData(prev => ({...prev, password: ''}));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div className="min-h-screen bg-background flex items-center justify-center font-bold">Memuat Profil...</div>;

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

        <div className="max-w-6xl mx-auto px-6 py-12 w-full grid grid-cols-1 md:grid-cols-12 gap-10 flex-grow relative items-start">
        
        {/* Left Column: Edit Profile */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-4 space-y-8 sticky top-28"
        >
            <div>
                <h1 className="text-3xl font-black text-text-primary tracking-tight">Profil Saya</h1>
                <p className="text-sm font-medium text-text-secondary mt-1">Kelola data identitas dan akses Anda.</p>
            </div>

            {error && <div className="bg-error/10 text-error p-3 rounded-lg text-sm font-bold border border-error/20">{error}</div>}
            {success && <div className="bg-success/10 text-success p-3 rounded-lg text-sm font-bold border border-success/30">{success}</div>}

            <form onSubmit={handleUpdate} className="bg-surface p-6 rounded-2xl border border-border shadow-none space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-widest">Nama Lengkap</label>
                  <Input required value={formData.nama_member} onChange={e => setFormData({...formData, nama_member: e.target.value})} className="h-12 bg-badge-bg border-transparent focus:bg-surface focus:ring-primary transition-colors font-bold" />
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-text-primary uppercase tracking-widest">Asal Instansi / Perusahaan</label>
                    <div className="flex gap-2">
                       <span onClick={() => setInstansiType('freelance')} className={`cursor-pointer text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${instansiType === 'freelance' ? 'bg-primary text-text-primary' : 'bg-badge-bg text-text-secondary'}`}>Freelance</span>
                       <span onClick={() => setInstansiType('instansi')} className={`cursor-pointer text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${instansiType === 'instansi' ? 'bg-primary text-text-primary' : 'bg-badge-bg text-text-secondary'}`}>Instansi</span>
                    </div>
                  </div>
                  {instansiType === 'instansi' ? (
                    <Input placeholder="Nama Perusahaan / Universitas" value={formData.instansi} onChange={e => setFormData({...formData, instansi: e.target.value})} className="h-12 bg-badge-bg border-transparent focus:bg-surface focus:ring-primary transition-colors font-bold" />
                  ) : (
                    <div className="h-12 bg-badge-bg flex items-center px-3 rounded-xl text-text-secondary text-sm font-bold border-transparent">Freelance / Independen</div>
                  )}
                </div>

                {hasInstansiChanged && (
                  <div className="pt-2 flex items-start gap-3 bg-error/5 p-3 rounded-lg border border-error/20">
                    <input type="checkbox" required checked={isConsentChecked} onChange={e => setIsConsentChecked(e.target.checked)} className="mt-1 w-4 h-4 text-error rounded border-border focus:ring-error cursor-pointer accent-error shrink-0" />
                    <label className="text-xs font-semibold text-error leading-relaxed cursor-pointer" onClick={() => setIsConsentChecked(!isConsentChecked)}>
                       *Peringatan:* Saya menjamin bahwa saya adalah representasi sah dari instansi ini. Saya bersedia menerima pemblokiran akun dan dilaporkan kepada pihak berwajib berwenang jika terbukti memalsukan data.
                    </label>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-widest">Alamat Domisili</label>
                  <Input required value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} className="h-12 bg-badge-bg border-transparent focus:bg-surface focus:ring-primary transition-colors font-bold" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-widest">Telepon</label>
                  <Input required type="tel" pattern="[0-9]*" value={formData.telp} onChange={e => setFormData({...formData, telp: e.target.value.replace(/\D/g, '')})} className="h-12 bg-badge-bg border-transparent focus:bg-surface focus:ring-primary transition-colors font-bold" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-widest">Alamat Email</label>
                  <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-12 bg-badge-bg border-transparent focus:bg-surface focus:ring-primary transition-colors font-bold" />
                </div>

                <div className="space-y-1.5 pt-4 border-t border-border">
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-widest">Kata Sandi Baru</label>
                  <Input type="password" placeholder="Kosongkan jika tidak ingin ubah" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="h-12 bg-badge-bg border-transparent focus:bg-surface focus:ring-primary transition-colors font-medium" />
                </div>

                <Button type="submit" className="w-full h-12 mt-4 text-sm font-bold uppercase tracking-widest bg-primary text-text-primary hover:bg-primary-hover rounded-xl shadow-floating" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
            </form>
        </motion.div>

        {/* Right Column: History */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-8 space-y-8"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                  <h2 className="text-2xl font-black text-text-primary tracking-tight">Histori Reservasi</h2>
                  <p className="text-sm font-medium text-text-secondary mt-1">Daftar transaksi dan tiket aktif Anda.</p>
              </div>
              <button 
                  onClick={() => router.push('/#jelajah')}
                  className="h-12 px-6 rounded-xl text-sm font-bold uppercase tracking-widest bg-primary text-text-primary hover:bg-primary-hover shadow-floating transition-colors shrink-0"
              >
                  Mulai Reservasi →
              </button>
            </div>

            <motion.div 
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                className="space-y-4"
            >
                {history.length === 0 ? (
                    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="bg-surface border border-border p-8 rounded-2xl text-center text-text-secondary font-medium">Belum ada transaksi.</motion.div>
                ) : history.slice(0, 5).map((res: any) => (
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }} key={res.id} className="bg-surface p-6 rounded-2xl border border-border flex flex-col md:flex-row justify-between items-center gap-6 shadow-none hover:border-primary transition-colors">
                    <div className="flex-1 w-full relative">
                        <div className="absolute top-0 right-0">    
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-badge-bg text-text-secondary px-2 py-1 rounded-md">{res.status.replace('_', ' ')}</span>
                        </div>
                        <p className="font-mono text-xs font-bold text-text-secondary mb-1">#{res.kode_booking}</p>
                        <h3 className="font-black text-xl text-text-primary mb-1">{res.tanggal_reservasi}</h3>
                        <p className="text-sm font-medium text-text-secondary font-mono mb-4">{res.jam_mulai} ({res.durasi_jam} Jam)</p>
                        <p className="font-black text-text-primary text-2xl">Rp {res.total_bayar.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
                        <button 
                            disabled={res.status !== 'disetujui' && res.status !== 'aktif'}
                            onClick={() => router.push(`/history/${res.id}/ticket`)}
                            className="h-10 px-5 rounded-lg text-xs font-bold uppercase tracking-widest bg-primary text-text-primary hover:bg-primary-hover disabled:opacity-50 disabled:bg-badge-bg disabled:text-text-secondary shadow-sm transition-colors"
                        >
                            Lihat E-Ticket
                        </button>
                        <button 
                            disabled={res.status === 'dibatalkan' || res.status === 'selesai'}
                            onClick={async () => {
                                if(!confirm('Yakin membatalkan reservasi ini?')) return;
                                try {
                                    await apiClient.patch(`/reservasi/${res.id}/cancel`);
                                    window.location.reload();
                                } catch(e) { alert('Gagal membatalkan.') }
                            }}
                            className="h-10 px-5 rounded-lg text-xs font-bold uppercase tracking-widest border border-error/50 text-error hover:bg-error/10 disabled:opacity-30 transition-colors"
                        >
                            Batalkan
                        </button>
                    </div>
                </motion.div>
                ))}

                {history.length > 5 && (
                    <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="pt-4 text-center">
                        <button 
                            onClick={() => router.push('/history')}
                            className="inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-primary transition-colors"
                        >
                            Lihat Selengkapnya MynTiket →
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>

      </div>

      <Footer />
    </main>
  );
}
