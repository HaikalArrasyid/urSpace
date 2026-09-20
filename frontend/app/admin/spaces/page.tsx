'use client';

import { useEffect, useState, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { Header } from '@/components/admin/Header';
import { StatCard } from '@/components/admin/StatCard';
import { Drawer, DrawerFooter } from '@/components/admin/Drawer';
import { DataTable } from '@/components/admin/DataTable';
import { FilterTabs } from '@/components/admin/FilterTabs';
import { Box, PackageOpen, CheckCircle, UploadCloud } from 'lucide-react';

export default function AdminSpaces() {
    const [spaces, setSpaces] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Semua Tipe');
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Drawer state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        nama_space: '',
        tipe: 'desk',
        harga_per_jam: '',
        kapasitas: '',
        deskripsi: '',
        foto: null as File | null
    });

    const loadSpaces = async () => {
        try {
            const res = await apiClient.get('/admin/spaces');
            setSpaces(res.data.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadSpaces();
    }, []);

    const handleOpenDrawer = (space: any = null) => {
        if (space) {
            setEditingId(space.id);
            setFormData({
                nama_space: space.nama_space,
                tipe: space.tipe,
                harga_per_jam: space.harga_per_jam.toString(),
                kapasitas: space.kapasitas.toString(),
                deskripsi: space.deskripsi,
                foto: null // To mock file edit just reset client side unless url provided
            });
        } else {
            setEditingId(null);
            setFormData({
                nama_space: '',
                tipe: 'desk',
                harga_per_jam: '',
                kapasitas: '',
                deskripsi: '',
                foto: null
            });
        }
        setIsDrawerOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Mock foto upload
            let fotoUrl = null;
            if (formData.foto) {
                const uploadData = new FormData();
                uploadData.append('file', formData.foto);
                const uploadRes = await apiClient.post('/upload/spaces', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                fotoUrl = uploadRes.data.data.url;
            }

            const payload: any = {
                nama_space: formData.nama_space,
                tipe: formData.tipe,
                harga_per_jam: parseInt(formData.harga_per_jam.toString()) || 0,
                kapasitas: parseInt(formData.kapasitas.toString()) || 0,
                deskripsi: formData.deskripsi
            };
            if (fotoUrl) payload.foto = fotoUrl; // Assume backend handles it

            if (editingId) {
                await apiClient.put(`/admin/spaces/${editingId}`, payload);
            } else {
                await apiClient.post('/admin/spaces', payload);
            }
            setIsDrawerOpen(false);
            loadSpaces();
        } catch (err) {
            console.error(err);
            alert('Gagal menyimpan. Pastikan semua field terisi benar.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin hapus?')) return;
        try {
            await apiClient.delete(`/admin/spaces/${id}`);
            loadSpaces();
        } catch (err) {
            console.error(err);
            alert('Gagal menghapus.');
        }
    };

    const filteredSpaces = useMemo(() => {
        return spaces.filter(p => {
            const matchesSearch = p.nama_space.toLowerCase().includes(search.toLowerCase());
            
            const spaceMap: Record<string, string> = {
                'Personal Desk': 'desk',
                'Meeting Room': 'meeting_room',
                'Private Office': 'private_office'
            };
            
            if (activeTab === 'Semua Tipe') return matchesSearch;
            return matchesSearch && p.tipe === spaceMap[activeTab];
        });
    }, [spaces, search, activeTab]);

    const totalPages = Math.ceil(filteredSpaces.length / itemsPerPage);
    const paginatedSpaces = filteredSpaces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Summary calculations
    const totalSpaces = spaces.length;
    const totalCapacity = spaces.reduce((acc, curr) => acc + (curr.kapasitas || 0), 0);
    const activeUnit = 0; // Dummy active booking

    const columns = [
        {
            header: 'Space & Ruangan',
            key: 'space',
            render: (s: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-badge-bg border border-border rounded-lg overflow-hidden shrink-0">
                        {s.foto ? (
                            <img src={s.foto} alt={s.nama_space} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-secondary">
                                <Box size={20} />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-black text-sm text-text-primary">{s.nama_space}</p>
                        <p className="text-[10px] font-bold text-text-secondary mt-1 uppercase tracking-widest">{s.tipe.replace('_', ' ')}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Kapasitas',
            key: 'kapasitas',
            render: (s: any) => <span className="font-bold text-text-secondary">{s.kapasitas} Pax</span>
        },
        {
            header: 'Tarif Sewa',
            key: 'harga_per_jam',
            render: (s: any) => (
                <span className="font-mono text-sm font-bold text-text-primary">
                    Rp {s.harga_per_jam.toLocaleString()} <span className="text-[10px] text-text-secondary">/ jam</span>
                </span>
            )
        },
        {
            header: 'Status (Realtime)',
            key: 'status',
            render: (s: any) => (
                // Mock value
                <span className="inline-flex py-1 px-2.5 rounded text-[10px] uppercase font-bold tracking-widest bg-green-500/10 text-green-500">
                    Kosong / Siap
                </span>
            )
        },
        {
            header: 'Aksi Data',
            key: 'actions',
            className: 'text-right',
            render: (s: any) => (
                <div className="flex justify-end gap-3">
                    <button className="text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors" onClick={() => handleOpenDrawer(s)}>Edit</button>
                    <button className="text-xs font-bold uppercase tracking-widest text-error hover:text-error/80 transition-colors" onClick={() => handleDelete(s.id)}>Hapus</button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            <Header 
                title="Inventaris Ruang & Meja Kerja" 
                description="Database master aset properti dan manajemen inventaris ruangan yang disewakan."
                action={{ label: 'Tambah Unit Ruang Baru', onClick: () => handleOpenDrawer(), icon: PackageOpen }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Unit Ruang" 
                    value={`${totalSpaces} Unit`}
                    subtitle="Aset Terdaftar"
                    icon={Box}
                />
                <StatCard 
                    title="Kapasitas Total" 
                    value={`${totalCapacity} Orang`}
                    subtitle="Kursi Tersedia"
                    icon={CheckCircle}
                />
                <StatCard 
                    title="Okupansi Saat Ini" 
                    value={`${activeUnit} Unit`}
                    subtitle="Sedang digunakan user"
                    icon={PackageOpen}
                    isHighlight
                />
            </div>

            <FilterTabs 
                tabs={['Semua Tipe', 'Personal Desk', 'Meeting Room', 'Private Office']}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Cari nama ruangan..."
            />

            <DataTable 
                columns={columns}
                data={paginatedSpaces}
                keyExtractor={(s) => s.id}
                pagination={{
                    currentPage,
                    totalPages,
                    onPageChange: setCurrentPage
                }}
            />

            <Drawer 
                title={editingId ? "Edit Ruangan" : "Tambah Ruangan Baru"} 
                description="Silakan input sesuai dengan kondisi aset aslinya."
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)}
            >
                <div className="p-6">
                    <form id="spaceForm" onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Nama Ruangan</label>
                            <input required value={formData.nama_space} className="w-full h-12 border-transparent bg-badge-bg/50 focus:bg-surface focus:ring-primary focus:border-border transition-colors rounded-xl font-bold px-4 text-sm" onChange={e => setFormData({...formData, nama_space: e.target.value})} placeholder="Misal: Room Apollo" />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Tipe Kategori</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'desk', label: 'Personal Desk' },
                                    { id: 'meeting_room', label: 'Meeting Room' },
                                    { id: 'private_office', label: 'Private Office' }
                                ].map(type => (
                                    <label key={type.id} className={`flex flex-col items-center justify-center p-3 text-center border rounded-xl cursor-pointer transition-colors ${formData.tipe === type.id ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-surface text-text-secondary hover:bg-badge-bg'}`}>
                                        <input type="radio" name="tipe" value={type.id} className="sr-only" checked={formData.tipe === type.id} onChange={(e) => setFormData({...formData, tipe: e.target.value})} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{type.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Kapasitas (Pax)</label>
                                <input type="number" required min={1} value={formData.kapasitas} className="w-full h-12 border-transparent bg-badge-bg/50 focus:bg-surface focus:ring-primary focus:border-border transition-colors rounded-xl font-bold font-mono px-4 text-sm" onChange={e => setFormData({...formData, kapasitas: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Tarif Sewa/Jam (Rp)</label>
                                <input type="number" required min={0} value={formData.harga_per_jam} className="w-full h-12 border-transparent bg-badge-bg/50 focus:bg-surface focus:ring-primary focus:border-border transition-colors rounded-xl font-bold font-mono px-4 text-sm" onChange={e => setFormData({...formData, harga_per_jam: e.target.value})} />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Rincian Fasilitas & Deskripsi</label>
                            <textarea required value={formData.deskripsi} className="w-full border-transparent bg-badge-bg/50 focus:bg-surface focus:ring-primary focus:border-border transition-colors rounded-xl font-medium px-4 py-3 text-sm min-h-[100px] resize-none" onChange={e => setFormData({...formData, deskripsi: e.target.value})} placeholder="Misal: AC, Free WiFi, Proyektor..."></textarea>
                        </div>
                        
                        <div>
                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">Foto Ruangan (Maks 5MB)</label>
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer bg-badge-bg/20 hover:bg-badge-bg/50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 text-text-secondary mb-2" />
                                    <p className="text-xs text-text-secondary font-bold">
                                        {formData.foto ? formData.foto.name : 'Drag & Drop atau Klik untuk Upload'}
                                    </p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => setFormData({...formData, foto: e.target.files?.[0] || null})} />
                            </label>
                        </div>
                    </form>
                </div>
                <DrawerFooter>
                    <button onClick={() => setIsDrawerOpen(false)} className="h-12 px-6 rounded-xl font-bold text-sm uppercase tracking-widest bg-badge-bg text-text-secondary hover:text-text-primary transition-colors">Batal</button>
                    <button form="spaceForm" type="submit" className="h-12 px-6 rounded-xl font-bold text-sm uppercase tracking-widest bg-primary text-text-primary hover:bg-primary-hover shadow-floating transition-colors">Simpan Unit</button>
                </DrawerFooter>
            </Drawer>
        </div>
    );
}
