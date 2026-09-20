'use client';

import { useEffect, useState, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { Header } from '@/components/admin/Header';
import { StatCard } from '@/components/admin/StatCard';
import { Drawer, DrawerFooter } from '@/components/admin/Drawer';
import { DataTable } from '@/components/admin/DataTable';
import { FilterTabs } from '@/components/admin/FilterTabs';
import { Plus, Tag, Zap, Archive, CalendarDays, Ban } from 'lucide-react';

export default function AdminPromos() {
    const [promos, setPromos] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Semua Kupon');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Drawer state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
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
        try {
            if (editingId) {
                await apiClient.put(`/admin/diskon/${editingId}`, formData);
            } else {
                await apiClient.post('/admin/diskon', formData);
            }
            setIsDrawerOpen(false);
            loadPromos();
        } catch (err) {
            console.error(err);
            alert('Gagal menyimpan.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin hapus?')) return;
        try {
            await apiClient.delete(`/admin/diskon/${id}`);
            loadPromos();
        } catch (err) {
            console.error(err);
            alert('Gagal menghapus.');
        }
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
        alert("Downloading CSV...");
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
        </div>
    );
}
