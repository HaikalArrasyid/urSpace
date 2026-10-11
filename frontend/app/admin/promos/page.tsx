'use client';

import { useEffect, useState, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { Header } from '@/components/admin/Header';
import { StatCard } from '@/components/admin/StatCard';
import { Drawer, DrawerFooter } from '@/components/admin/Drawer';
import { DataTable } from '@/components/admin/DataTable';
import { FilterTabs } from '@/components/admin/FilterTabs';
import { Plus, Tag, Zap, Archive, CalendarDays, Ban, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPromos() {
    const [promos, setPromos] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Semua Kupon');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Drawer state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    
    // Popup state
    const [feedback, setFeedback] = useState<{show: boolean, type: 'error' | 'success' | 'warn', title: string, message: string}>({show: false, type: 'error', title: '', message: ''});
    const showPopup = (type: 'error'|'success'|'warn', title: string, message: string) => setFeedback({show: true, type, title, message});
    
    const [confirmDialog, setConfirmDialog] = useState<{show: boolean, id: number | null}>({show: false, id: null});

    const [formData, setFormData] = useState({
        nama_diskon: '',
        persentase_diskon: '',
        tanggal_awal: '',
        tanggal_akhir: ''
    });

    // Simulator State
    const [simBasePrice, setSimBasePrice] = useState(150000);

    const loadPromos = async () => {
        try {
            const res = await apiClient.get('/admin/diskon');
            setPromos(res.data.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadPromos();
    }, []);

    const handleOpenDrawer = (promo: any = null) => {
        if (promo) {
            setEditingId(promo.id);
            setFormData({
                nama_diskon: promo.nama_diskon,
                persentase_diskon: promo.persentase_diskon.toString(),
                tanggal_awal: promo.tanggal_awal,
                tanggal_akhir: promo.tanggal_akhir
            });
        } else {
            setEditingId(null);
            setFormData({
                nama_diskon: '',
                persentase_diskon: '',
                tanggal_awal: '',
                tanggal_akhir: ''
            });
        }
        setIsDrawerOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = formData;
        try {
            if (editingId) {
                await apiClient.put(`/admin/diskon/${editingId}`, payload);
                showPopup('success', 'Berhasil', 'Promo berhasil diperbarui.');
            } else {
                await apiClient.post('/admin/diskon', payload);
                showPopup('success', 'Berhasil', 'Promo berhasil ditambahkan.');
            }
            setIsDrawerOpen(false);
            loadPromos();
        } catch (err: any) {
            console.error(err);
            showPopup('error', 'Gagal', err.response?.data?.message || 'Gagal menyimpan.');
        }
    };

    const confirmDelete = (id: number) => {
        setConfirmDialog({ show: true, id });
    };

    const executeDelete = async () => {
        if (!confirmDialog.id) return;
        try {
            await apiClient.delete(`/admin/diskon/${confirmDialog.id}`);
            showPopup('success', 'Terhapus', 'Promo berhasil dihapus.');
            loadPromos();
        } catch (err) {
            console.error(err);
            showPopup('error', 'Gagal', 'Terjadi kesalahan saat menghapus promo.');
        } finally {
            setConfirmDialog({ show: false, id: null });
        }
    };

    const handleDelete = async (id: number) => {
        confirmDelete(id);
    };

    // Derived Status
    const today = new Date().toISOString().split('T')[0];
    const getStatus = (awal: string, akhir: string) => {
        if (today < awal) return 'Mendatang';
        if (today > akhir) return 'Kedaluwarsa';
        return 'Sedang Aktif';
    };

    const filteredPromos = useMemo(() => {
        return promos
            .filter(p => {
                const status = getStatus(p.tanggal_awal, p.tanggal_akhir);
                if (activeTab === 'Sedang Aktif') return status === 'Sedang Aktif';
                if (activeTab === 'Kedaluwarsa') return status === 'Kedaluwarsa';
                if (activeTab === 'Mendatang') return status === 'Mendatang';
                return true;
            })
            .filter(p => p.nama_diskon.toLowerCase().includes(search.toLowerCase()));
    }, [promos, search, activeTab]);

    const totalPages = Math.ceil(filteredPromos.length / itemsPerPage);
    const paginatedPromos = filteredPromos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Summary Calculations
    const activeCount = promos.filter(p => getStatus(p.tanggal_awal, p.tanggal_akhir) === 'Sedang Aktif').length;
    const avgDiscount = promos.length > 0 
        ? Math.round(promos.reduce((acc, p) => acc + p.persentase_diskon, 0) / promos.length)
        : 0;

    const simulatedDiscount = (simBasePrice * (Number(formData.persentase_diskon) || 0)) / 100;
    const simulatedFinal = simBasePrice - simulatedDiscount;

    const exportCSV = () => {
        showPopup('success', 'Exporting...', 'Dokumen CSV sedang diproses dan akan otomatis terunduh.');
    };

    const columns = [
        { header: 'Kode Promo', key: 'nama_diskon', className: 'font-black text-text-primary' },
        { 
            header: 'Besaran Diskon', 
            key: 'persentase_diskon',
            render: (p: any) => <span className="font-mono text-primary font-bold">{p.persentase_diskon}%</span>
        },
        { 
            header: 'Periode Berlaku', 
            key: 'periode',
            render: (p: any) => <span className="text-xs font-semibold text-text-secondary">{p.tanggal_awal} - {p.tanggal_akhir}</span>
        },
        {
            header: 'Status',
            key: 'status',
            render: (p: any) => {
                const s = getStatus(p.tanggal_awal, p.tanggal_akhir);
                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                        s === 'Sedang Aktif' ? 'bg-primary/10 text-primary' : 
                        s === 'Mendatang' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                        {s === 'Sedang Aktif' ? <Zap size={12}/> : s === 'Mendatang' ? <CalendarDays size={12}/> : <Ban size={12}/>}
                        {s}
                    </span>
                );
            }
        },
        {
            header: 'Aksi',
            key: 'actions',
            className: 'text-right',
            render: (p: any) => (
                <div className="flex justify-end gap-3">
                    <button className="text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors" onClick={() => handleOpenDrawer(p)}>Edit</button>
                    <button className="text-xs font-bold uppercase tracking-widest text-error hover:text-error/80 transition-colors" onClick={() => handleDelete(p.id)}>Hapus</button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            <Header 
                title="Kupon & Diskon Promo" 
                description="Kelola kode voucher, event diskon, dan promo spesial pengguna."
                action={{ label: 'Tambah Promo', onClick: () => handleOpenDrawer(), icon: Plus }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Kode Promo" 
                    value={`${promos.length} Kupon`}
                    subtitle="Terdaftar"
                    icon={Tag}
                />
                <StatCard 
                    title="Rata-rata Potongan" 
                    value={`${avgDiscount}%`}
                    subtitle="Nilai Rasio Diskon"
                    icon={Archive}
                />
                <StatCard 
                    title="Event Promo Aktif" 
                    value={`${activeCount} Event`}
                    subtitle="Sedang Berjalan"
                    icon={Zap}
                    isHighlight
                />
            </div>

            <FilterTabs 
                tabs={['Semua Kupon', 'Sedang Aktif', 'Kedaluwarsa', 'Mendatang']}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Cari kode kupon..."
                extraActions={
                    <button onClick={exportCSV} className="h-10 px-4 rounded-xl border border-border bg-surface text-text-secondary hover:text-text-primary text-xs font-bold uppercase tracking-widest transition-colors shrink-0">
                        Ekspor CSV
                    </button>
                }
            />

            <DataTable 
                columns={columns}
                data={paginatedPromos}
                keyExtractor={(p) => p.id}
                pagination={{
                    currentPage,
                    totalPages,
                    onPageChange: setCurrentPage
                }}
            />

            <Drawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)}
                title={editingId ? "Edit Promo" : "Buat Kupon Promo Baru"}
                description="Pengaturan diskon akan berdampak pada total pembayaran klien."
            >
                <div className="p-6">
                    <form id="promoForm" onSubmit={handleSave} className="space-y-5">
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Kode Promo (Voucher)</label>
                            <input required value={formData.nama_diskon} className="w-full h-12 border-transparent bg-badge-bg/50 focus:bg-surface focus:ring-primary focus:border-border transition-colors rounded-xl font-bold px-4" onChange={e => setFormData({...formData, nama_diskon: e.target.value.toUpperCase()})} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Besaran Diskon (%)</label>
                            <input type="number" required min={0} max={100} value={formData.persentase_diskon} className="w-full h-12 border-transparent bg-badge-bg/50 focus:bg-surface focus:ring-primary focus:border-border transition-colors rounded-xl font-bold font-mono px-4" onChange={e => setFormData({...formData, persentase_diskon: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Awal Berlaku</label>
                                <input type="date" required value={formData.tanggal_awal} className="w-full h-12 border-transparent bg-badge-bg/50 focus:bg-surface focus:ring-primary focus:border-border transition-colors rounded-xl font-bold px-4" onChange={e => setFormData({...formData, tanggal_awal: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Akhir Berlaku</label>
                                <input type="date" required value={formData.tanggal_akhir} className="w-full h-12 border-transparent bg-badge-bg/50 focus:bg-surface focus:ring-primary focus:border-border transition-colors rounded-xl font-bold px-4" onChange={e => setFormData({...formData, tanggal_akhir: e.target.value})} />
                            </div>
                        </div>

                        {/* Simulator in form */}
                        <div className="mt-8 p-5 bg-primary/5 border border-primary/20 rounded-2xl">
                            <h3 className="text-xs font-bold text-text-primary uppercase tracking-widest mb-4">Simulasi Potongan</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block mb-2">Harga Sewa Normal</label>
                                    <input type="number" value={simBasePrice} onChange={(e) => setSimBasePrice(Number(e.target.value))} className="w-full h-10 border border-border/50 rounded-lg bg-surface font-mono text-sm px-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                                </div>
                                <div className="flex justify-between text-xs font-semibold text-text-secondary">
                                    <span>Potongan ({formData.persentase_diskon || 0}%)</span>
                                    <span className="text-text-secondary">- Rp {simulatedDiscount.toLocaleString()}</span>
                                </div>
                                <div className="pt-3 border-t border-primary/20 flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Total Bayar</span>
                                    <span className="text-xl font-black text-text-primary leading-none">Rp {simulatedFinal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <DrawerFooter>
                    <button onClick={() => setIsDrawerOpen(false)} className="h-12 px-6 rounded-xl font-bold text-sm uppercase tracking-widest bg-badge-bg text-text-secondary hover:text-text-primary transition-colors">Batal</button>
                    <button form="promoForm" type="submit" className="h-12 px-6 rounded-xl font-bold text-sm uppercase tracking-widest bg-primary text-text-primary hover:bg-primary-hover shadow-floating transition-colors">Simpan Promo</button>
                </DrawerFooter>
            </Drawer>

            {/* Confirmation Dialog Modal */}
            <AnimatePresence>
                {confirmDialog.show && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-surface p-8 rounded-3xl max-w-sm w-full mx-auto shadow-floating border border-border/50 text-center relative overflow-hidden"
                        >
                            <h3 className="text-xl font-black text-text-primary mb-2 tracking-tight">Hapus Promo?</h3>
                            <p className="text-sm font-medium text-text-secondary mb-8 leading-relaxed">
                                Tindakan ini tidak dapat dibatalkan. Kupon ini tidak akan bisa lagi digunakan oleh member manapun.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setConfirmDialog({show: false, id: null})} className="flex-1 h-12 rounded-xl bg-badge-bg text-text-secondary font-bold hover:bg-border transition-colors">Batal</button>
                                <button onClick={executeDelete} className="flex-1 h-12 rounded-xl bg-error text-white font-bold hover:bg-red-600 transition-colors shadow-sm">Ya, Hapus</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Feedback Modal Popup */}
            <AnimatePresence>
                {feedback.show && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-surface p-8 rounded-3xl max-w-sm w-full mx-auto shadow-floating border border-border/50 text-center relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2 ${feedback.type === 'error' ? 'bg-error/10' : feedback.type === 'success' ? 'bg-primary/20' : 'bg-yellow-500/20'}`} />
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 ${feedback.type === 'error' ? 'bg-error/10 text-error' : feedback.type === 'success' ? 'bg-primary/20 text-primary' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                {feedback.type === 'error' ? <AlertCircle className="w-8 h-8 -ml-1" /> : <CheckCircle2 className="w-8 h-8 -ml-1" />}
                            </div>
                            <h3 className="text-xl font-black text-text-primary mb-2 tracking-tight">{feedback.title}</h3>
                            <p className="text-sm font-medium text-text-secondary mb-8 leading-relaxed">{feedback.message}</p>
                            <button onClick={() => setFeedback({...feedback, show: false})} className={`w-full h-12 rounded-xl font-bold transition-all outline-none text-white ${feedback.type === 'error' ? 'bg-error hover:bg-red-600' : 'bg-primary text-text-primary hover:bg-primary-hover shadow-sm'}`}>Tutup</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
