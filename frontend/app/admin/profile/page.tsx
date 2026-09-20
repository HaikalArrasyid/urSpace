'use client';

import { useState } from 'react';
import { Header } from '@/components/admin/Header';
import { StatCard } from '@/components/admin/StatCard';
import { User, Boxes, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminProfile() {
    const [formData, setFormData] = useState({
        nama_coworking: 'urSpace HQ',
        nama_pemilik: 'Haikal (Admin)',
        telp: '081122334455',
        alamat: 'Jl. Sudirman No. 123, Jakarta Selatan',
        deskripsi: 'Ruang kerja premium yang dirancang khusus untuk memfasilitasi kebutuhan produktivitas dan kolaborasi Anda. Dilengkapi dengan internet super cepat, kopi gratis, dan berbagai ukuran ruangan yang fleksibel menyesuaikan dinamisnya tim Anda.'
    });
    
    // Character limit for description
    const MAX_CHARS = 500;
    const [loading, setLoading] = useState(false);
    
    const handleReset = () => {
        if (confirm('Batal merubah form? Form akan dikembalikan ke data awal.')) {
            window.location.reload();
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate save
        setTimeout(() => {
            alert('Profil berhasil diperbarui!');
            setLoading(false);
        }, 800);
    };

    const isOverLimit = formData.deskripsi.length > MAX_CHARS;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 pb-12"
        >
            <Header 
                title="Pengaturan Identitas Profil" 
                description="Konfigurasi nama brand, kontak, dan alamat gedung pusat coworking Anda."
            />

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Status Visibilitas" 
                    value="Publik & Aktif"
                    subtitle="Dapat diakses Member"
                    icon={Settings2}
                />
                <StatCard 
                    title="Total Ruangan" 
                    value="18 Unit"
                    subtitle="Tersedia disewa"
                    icon={Boxes}
                />
                <StatCard 
                    title="Nama Pemilik / Admin" 
                    value={formData.nama_pemilik}
                    subtitle="Identitas Terdaftar"
                    icon={User}
                    isHighlight
                />
            </div>

            <form onSubmit={handleSave} className="bg-surface border border-border shadow-none rounded-2xl p-8 space-y-10">
                <h3 className="text-lg font-black text-text-primary">Formulir Identitas Gedung</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Nama Coworking Brand</label>
                            <input required value={formData.nama_coworking} 
                                className="w-full h-12 bg-badge-bg/50 border-transparent focus:bg-surface focus:border-border focus:ring-primary transition-colors font-bold text-text-primary px-4 rounded-xl text-sm" 
                                onChange={e => setFormData({...formData, nama_coworking: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Penanggung Jawab / Pemilik</label>
                            <input required value={formData.nama_pemilik} 
                                className="w-full h-12 bg-badge-bg/50 border-transparent focus:bg-surface focus:border-border focus:ring-primary transition-colors font-bold text-text-primary px-4 rounded-xl text-sm" 
                                onChange={e => setFormData({...formData, nama_pemilik: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Manajer Operasional (Telepon/WA)</label>
                            <input required type="tel" value={formData.telp} 
                                className="w-full h-12 bg-badge-bg/50 border-transparent focus:bg-surface focus:border-border focus:ring-primary transition-colors font-bold font-mono text-text-primary px-4 rounded-xl text-sm" 
                                onChange={e => setFormData({...formData, telp: e.target.value})} 
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Alamat Lengkap Pusat Layanan</label>
                            <textarea required value={formData.alamat} 
                                className="w-full bg-badge-bg/50 border-transparent focus:bg-surface focus:border-border focus:ring-primary transition-colors font-bold text-text-primary px-4 py-3 rounded-xl text-sm min-h-[120px] resize-none" 
                                onChange={e => setFormData({...formData, alamat: e.target.value})} 
                            />
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Narasi Promo Singkat (Footer)</label>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isOverLimit ? 'text-error' : 'text-text-secondary'}`}>
                                    {formData.deskripsi.length} / {MAX_CHARS} Karakter
                                </span>
                            </div>
                            <textarea required value={formData.deskripsi} 
                                className={`w-full bg-badge-bg/50 border-transparent focus:bg-surface focus:ring-primary transition-colors font-medium text-text-primary px-4 py-4 rounded-xl text-sm min-h-[140px] resize-none ${isOverLimit ? 'focus:border-error border-error/50' : 'focus:border-border'}`} 
                                onChange={e => setFormData({...formData, deskripsi: e.target.value})} 
                            />
                            {isOverLimit && <p className="text-xs text-error font-bold mt-2">Teks terlalu panjang, akan terpotong pada tampilan UI.</p>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-border mt-8">
                    <button type="button" onClick={handleReset} className="h-12 px-8 rounded-xl font-bold text-sm uppercase tracking-widest bg-badge-bg text-text-secondary hover:text-text-primary transition-colors">
                        Reset
                    </button>
                    <button type="submit" disabled={loading || isOverLimit} className="h-12 px-8 rounded-xl font-bold text-sm uppercase tracking-widest bg-primary text-text-primary focus-visible:outline-primary disabled:opacity-50 hover:bg-primary-hover shadow-[0_4px_14px_0_rgba(255,213,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,213,0,0.23)] transition-all">
                        {loading ? 'Menyimpan...' : 'Simpan Profil Gedung'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
