'use client';

import { useEffect, useState, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { Header } from '@/components/admin/Header';
import { StatCard } from '@/components/admin/StatCard';
import { Drawer, DrawerFooter } from '@/components/admin/Drawer';
import { DataTable } from '@/components/admin/DataTable';
import { FilterTabs } from '@/components/admin/FilterTabs';
import { Plus, Users, Building, ActivitySquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminMembers() {
    const [members, setMembers] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Semua');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    // Popup state
    const [feedback, setFeedback] = useState<{show: boolean, type: 'error' | 'success' | 'warn', title: string, message: string}>({show: false, type: 'error', title: '', message: ''});
    const showPopup = (type: 'error'|'success'|'warn', title: string, message: string) => setFeedback({show: true, type, title, message});
    
    const [confirmDialog, setConfirmDialog] = useState<{show: boolean, id: number | null}>({show: false, id: null});

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nama_member: '',
        email: '',
        instansi: '',
        telp: '',
        alamat: '',
    });

    const loadMembers = async () => {
        try {
            const res = await apiClient.get('/admin/members');
            setMembers(res.data.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadMembers();
    }, []);

    const handleOpenDrawer = () => {
        setFormData({
            username: '',
            password: '',
            nama_member: '',
            email: '',
            instansi: '',
            telp: '',
            alamat: '',
        });
        setIsDrawerOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('/admin/members', {
                username: formData.username,
                password: formData.password,
                nama_member: formData.nama_member,
                email: formData.email,
                instansi: formData.instansi,
                telp: formData.telp,
                alamat: formData.alamat,
            });
            
            setIsDrawerOpen(false);
            showPopup('success', 'Berhasil', 'Member berhasil ditambahkan.');
            loadMembers();
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
            await apiClient.delete(`/admin/members/${confirmDialog.id}`);
            showPopup('success', 'Terhapus', 'Member berhasil dihapus.');
            loadMembers();
        } catch (err) {
            console.error(err);
            showPopup('error', 'Gagal', 'Terjadi kesalahan saat menghapus member.');
        } finally {
            setConfirmDialog({ show: false, id: null });
        }
    };

    const filteredMembers = useMemo(() => {
        return members
            .filter(m => {
                // Dummy status filtering if needed
                if (activeTab === 'Aktif di Ruangan') return false; // Mock
                if (activeTab === 'Reservasi Hari Ini') return false; // Mock
                return true;
            })
            .filter(m => 
                m.nama_member.toLowerCase().includes(search.toLowerCase()) || 
                m.instansi.toLowerCase().includes(search.toLowerCase())
            );
    }, [members, search, activeTab]);

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const paginatedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Summary calculations
    const uniqueInstansi = new Set(members.map(m => m.instansi)).size;
    const activeMembers = 0; // Dummy

    const exportCSV = () => {
        showPopup('success', 'Exporting...', 'Dokumen CSV sedang diproses dan akan segera diunduh.');
    };

    const columns = [
        { 
            header: 'Nama Lengkap', 
            key: 'nama_member', 
            className: 'font-black text-text-primary',
            render: (m: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">
                        {m.nama_member?.substring(0, 2).toUpperCase() || 'MB'}
                    </div>
                    <div>
                        <p className="font-bold text-sm text-text-primary">{m.nama_member}</p>
                        <p className="text-[10px] text-text-secondary">{m.email || (m.user?.username ? `@${m.user.username}` : '-')}</p>
                    </div>
                </div>
            )
        },
        { 
            header: 'Instansi/Asal', 
            key: 'instansi',
            render: (m: any) => <span className="text-xs font-semibold text-text-secondary">{m.instansi || '-'}</span>
        },
        { 
            header: 'Kontak WhatsApp', 
            key: 'telp',
            render: (m: any) => <span className="text-xs font-semibold text-text-secondary">{m.telp || '-'}</span>
        },
        { 
            header: 'Status (Dummy)', 
            key: 'status',
            render: (m: any) => (
                <span className="inline-flex items-center px-2 py-1 rounded bg-badge-bg text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                    Tidak Aktif
                </span>
            )
        },
        {
            header: 'Aksi',
            key: 'actions',
            className: 'text-right',
            render: (m: any) => (
                <div className="flex justify-end gap-3">
                    <button className="text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors">Edit</button>
                    <button className="text-xs font-bold uppercase tracking-widest text-error hover:text-error/80 transition-colors" onClick={() => confirmDelete(m.id)}>Hapus</button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            <Header 
                title="Direktori Member & Pelanggan" 
                description="Database pengguna dan member coworking space."
                action={{ label: 'Tambah Member', onClick: handleOpenDrawer, icon: Plus }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Member" 
                    value={`${members.length} Orang`}
                    subtitle="Terdaftar"
                    icon={Users}
                />
                <StatCard 
                    title="Afiliasi Instansi" 
                    value={`${uniqueInstansi} Organisasi`}
                    subtitle="Perusahaan/Sekolah"
                    icon={Building}
                />
                <StatCard 
                    title="Aktif di Lokasi" 
                    value={`${activeMembers} Sesi`}
                    subtitle="Sedang Menggunakan Ruangan"
                    icon={ActivitySquare}
                    isHighlight
                />
            </div>

            <FilterTabs 
                tabs={['Semua', 'Aktif di Ruangan', 'Reservasi Hari Ini']}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Cari nama atau instansi..."
                extraActions={
                    <button onClick={exportCSV} className="h-10 px-4 rounded-xl border border-border bg-surface text-text-secondary hover:text-text-primary text-xs font-bold uppercase tracking-widest transition-colors shrink-0">
                        Ekspor CSV
                    </button>
                }
            />

            <DataTable 
                columns={columns}
                data={paginatedMembers}
                keyExtractor={(m) => m.id}
                pagination={{
                    currentPage,
                    totalPages,
                    onPageChange: setCurrentPage
                }}
            />

            <Drawer 
                title="Tambah Member Baru" 
                description="Buatkan akun pengguna secara manual oleh admin."
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)}
            >
                <div className="p-6">
                    <form id="memberForm" onSubmit={handleSave} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Username Login</label>
                                <input required value={formData.username} className="w-full h-12 border-transparent bg-badge-bg/50 focus:bg-surface focus:ring-primary focus:border-border transition-colors rounded-xl font-bold px-4 text-sm" onChange={e => setFormData({...formData, username: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Password Awal</label>
                                <input required type="password" value={formData.password} className="w-full h-12 border-transparent bg-badge-bg/50 focus:bg-surface focus:ring-primary focus:border-border transition-colors rounded-xl font-bold px-4 text-sm" onChange={e => setFormData({...formData, password: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Nama Lengkap</label>
                            <input required value={formData.nama_member} className="w-full h-12 border-transparent bg-badge-bg/50 focus:bg-surface focus:ring-primary focus:border-border transition-colors rounded-xl font-bold px-4 text-sm" onChange={e => setFormData({...formData, nama_member: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Alamat Email</label>
                                <input required type="email" value={formData.email} className="w-full h-12 border-transparent bg-badge-bg/50 focus:bg-surface focus:ring-primary focus:border-border transition-colors rounded-xl font-bold px-4 text-sm" onChange={e => setFormData({...formData, email: e.target.value})} placeholder="user@example.com" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Nomor WhatsApp</label>
                                <input required type="tel" value={formData.telp} className="w-full h-12 border-transparent bg-badge-bg/50 focus:bg-surface focus:ring-primary focus:border-border transition-colors rounded-xl font-bold font-mono px-4 text-sm" onChange={e => setFormData({...formData, telp: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Asal Instansi</label>
                            <input required value={formData.instansi} className="w-full h-12 border-transparent bg-badge-bg/50 focus:bg-surface focus:ring-primary focus:border-border transition-colors rounded-xl font-bold px-4 text-sm" onChange={e => setFormData({...formData, instansi: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Alamat Domisili</label>
                            <textarea required value={formData.alamat} className="w-full border-transparent bg-badge-bg/50 focus:bg-surface focus:ring-primary focus:border-border transition-colors rounded-xl font-bold px-4 py-3 text-sm min-h-[100px] resize-none" onChange={e => setFormData({...formData, alamat: e.target.value})}></textarea>
                        </div>
                    </form>
                </div>
                <DrawerFooter>
                    <button onClick={() => setIsDrawerOpen(false)} className="h-12 px-6 rounded-xl font-bold text-sm uppercase tracking-widest bg-badge-bg text-text-secondary hover:text-text-primary transition-colors">Batal</button>
                    <button form="memberForm" type="submit" className="h-12 px-6 rounded-xl font-bold text-sm uppercase tracking-widest bg-primary text-text-primary hover:bg-primary-hover shadow-floating transition-colors">Daftarkan Member</button>
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
                            <h3 className="text-xl font-black text-text-primary mb-2 tracking-tight">Hapus Member?</h3>
                            <p className="text-sm font-medium text-text-secondary mb-8 leading-relaxed">
                                Tindakan ini tidak dapat dibatalkan. Semua data riwayat dan akses member akan ikut terhapus.
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
