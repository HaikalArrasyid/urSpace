'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import apiClient from '@/lib/axios';
import { Header } from '@/components/admin/Header';
import { StatCard } from '@/components/admin/StatCard';
import { DataTable } from '@/components/admin/DataTable';
import { FilterTabs } from '@/components/admin/FilterTabs';
import { QrCode, Clock, PlayCircle, CheckCircle2, AlertCircle, Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';

export default function AdminReservations() {
    const [queue, setQueue] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('Semua');
    const [simulatorScanner, setSimulatorScanner] = useState('');
    
    // Popup state
    const [feedback, setFeedback] = useState<{show: boolean, type: 'error' | 'success' | 'warn', title: string, message: string}>({show: false, type: 'error', title: '', message: ''});
    const showPopup = (type: 'error'|'success'|'warn', title: string, message: string) => {
        setFeedback({show: true, type, title, message});
    };

    // Scanner Camera State
    const [showCamera, setShowCamera] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const queueRef = useRef(queue);

    // Keep queue ref updated
    useEffect(() => {
        queueRef.current = queue;
    }, [queue]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const loadQueue = async () => {
        try {
            const res = await apiClient.get('/admin/reservasi');
            setQueue(res.data.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadQueue();
    }, []);

    const handleAction = async (id: number, action: 'approve' | 'check-in' | 'check-out') => {
        try {
            if (action === 'approve') {
                await apiClient.patch(`/admin/reservasi/${id}/status`, { status: 'disetujui' });
            } else {
                await apiClient.post(`/admin/reservasi/${id}/${action}`);
            }
            showPopup('success', 'Berhasil', `Tindakan ${action} berhasil dilakukan.`);
            loadQueue();
        } catch (e: any) {
            showPopup('error', 'Gagal', e.response?.data?.message || 'Gagal mengeksekusi perintah.');
        }
    };

    const handleQuickVerify = () => {
        if (!simulatorScanner) return showPopup('warn', 'Kode Kosong', 'Silakan masukkan UUID Scanner/Kode Ticket');
        // Filter directly client-side based on qr_code_payload or kode_booking
        const match = queue.find(r => r.qr_code_payload === simulatorScanner || r.qr_serial_token === simulatorScanner || r.kode_booking === simulatorScanner.toUpperCase());
        if (match) {
            if (match.status === 'disetujui') {
                handleAction(match.id, 'check-in');
                setSimulatorScanner('');
            } else {
                showPopup('error', 'Cek Status', `Tidak dapat check-in instan. Status saat ini: ${match.status.replace('_', ' ')}`);
            }
        } else {
            showPopup('error', 'Tidak Ditemukan', 'Data tiket batal atau tidak ditemukan!');
        }
    };

    const closeScannerSafe = () => {
        if (scannerRef.current) {
            scannerRef.current.stop().then(() => {
                scannerRef.current?.clear();
                setShowCamera(false);
            }).catch(e => {
                setShowCamera(false);
            });
        } else {
            setShowCamera(false);
        }
    };

    // Auto-verify when scanner reads code
    useEffect(() => {
        let isComponentMounted = true;
        
        if (showCamera) {
            const html5QrCode = new Html5Qrcode("qr-reader");
            scannerRef.current = html5QrCode;

            html5QrCode.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    if (!isComponentMounted) return;
                    setSimulatorScanner(decodedText);
                    const qData = queueRef.current;
                    const match = qData.find(r => r.qr_serial_token === decodedText || r.qr_code_payload === decodedText || r.kode_booking === decodedText.toUpperCase());
                    
                    if (match && match.status === 'disetujui') {
                        html5QrCode.stop().then(() => {
                            if (isComponentMounted) {
                                setShowCamera(false);
                                handleAction(match.id, 'check-in');
                                setSimulatorScanner('');
                            }
                        }).catch(console.error);
                    } else if (match) {
                        html5QrCode.pause(true);
                        showPopup('warn', 'Perhatian', `Tiket terbaca! Namun status saat ini: ${match.status.replace('_', ' ')}`);
                        setTimeout(() => isComponentMounted && html5QrCode.resume(), 3000);
                    } else {
                        html5QrCode.pause(true);
                        showPopup('error', 'Gagal', 'Tiket terbaca namun tidak terdaftar dalam sistem!');
                        setTimeout(() => isComponentMounted && html5QrCode.resume(), 3000);
                    }
                },
                (errorMessage) => {
                    // ignore generic read errors
                }
            ).catch((err) => {
                if (isComponentMounted) {
                    showPopup('error', 'Kamera Gagal', 'Gagal mengakses kamera: ' + err);
                    setShowCamera(false);
                }
            });
        }
        
        return () => {
            isComponentMounted = false;
            // Note: stop() won't always resolve instantly if tearing down, but safe cleanup will still happen at DOM unmount via Html5Qrcode internals.
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(() => {});
            }
        };
    }, [showCamera]);

    const filteredQueue = useMemo(() => {
        return queue
            .filter((res) => {
                const searchLower = search.toLowerCase();
                const matchesSearch = 
                    res.kode_booking?.toLowerCase().includes(searchLower) || 
                    res.member?.nama_member?.toLowerCase().includes(searchLower);
                
                if (activeTab === 'Semua') return matchesSearch;
                
                // Map tab to status
                const tabToStatus: Record<string, string> = {
                    'Menunggu Konfirmasi': 'belum_dikonfirm',
                    'Disetujui (Siap In)': 'disetujui',
                    'Sedang Aktif': 'aktif',
                    'Selesai': 'selesai',
                    'Dibatalkan': 'dibatalkan'
                };
                
                return matchesSearch && (res.status === tabToStatus[activeTab]);
            });
    }, [queue, search, activeTab]);

    const totalPages = Math.ceil(filteredQueue.length / itemsPerPage);
    const paginatedQueue = filteredQueue.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const summary = useMemo(() => {
        const pending = queue.filter(r => r.status === 'belum_dikonfirm').length;
        const ready = queue.filter(r => r.status === 'disetujui').length; // ready to check-in
        const active = queue.filter(r => r.status === 'aktif').length;
        return { pending, ready, active };
    }, [queue]);

    const tabs = ['Semua', 'Menunggu Konfirmasi', 'Disetujui (Siap In)', 'Sedang Aktif', 'Selesai', 'Dibatalkan'];

    const columns = [
        {
            header: 'Kode & Member',
            key: 'member_info',
            render: (res: any) => (
                <div>
                    <p className="font-black text-sm text-text-primary uppercase tracking-widest">{res.kode_booking}</p>
                    <p className="text-[11px] font-bold text-text-secondary mt-1">{res.member?.nama_member}</p>
                </div>
            )
        },
        {
            header: 'Jadwal Penggunaan',
            key: 'jadwal',
            render: (res: any) => (
                <div>
                    <p className="font-bold text-sm text-text-primary">{res.tanggal_reservasi}</p>
                    <p className="text-[11px] font-semibold text-text-secondary mt-1 font-mono uppercase tracking-widest">{res.jam_mulai} - {res.jam_selesai}</p>
                </div>
            )
        },
        {
            header: 'Ruang Kerja',
            key: 'ruang',
            render: (res: any) => (
                <span className="text-sm font-bold text-text-secondary">{res.space?.nama_space || 'Space'}</span>
            )
        },
        {
            header: 'Total Bayar',
            key: 'total_bayar',
            render: (res: any) => (
                <span className="font-black text-sm text-text-primary">
                    Rp {res.total_bayar.toLocaleString()}
                </span>
            )
        },
        {
            header: 'Status',
            key: 'status',
            render: (res: any) => {
                const sMap: Record<string, {label: string, color: string}> = {
                    'belum_dikonfirm': {label: 'Menunggu', color: 'bg-yellow-500/10 text-yellow-600'},
                    'disetujui': {label: 'Siap In', color: 'bg-blue-500/10 text-blue-500'},
                    'aktif': {label: 'Aktif', color: 'bg-primary/20 text-primary'},
                    'selesai': {label: 'Selesai', color: 'bg-green-500/10 text-green-600'},
                    'dibatalkan': {label: 'Batal', color: 'bg-error/10 text-error'},
                };
                const mapping = sMap[res.status] || { label: res.status, color: 'bg-badge-bg text-text-secondary'};
                return (
                    <span className={`inline-flex px-2 py-1 uppercase tracking-widest text-[10px] font-bold rounded ${mapping.color}`}>
                        {mapping.label}
                    </span>
                );
            }
        },
        {
            header: 'Tindakan Operasional',
            key: 'actions',
            className: 'text-right',
            render: (res: any) => (
                <div className="flex justify-end gap-2">
                    {res.status === 'belum_dikonfirm' && (
                        <button className="h-8 px-4 text-[10px] uppercase font-bold tracking-widest bg-yellow-500 text-yellow-950 hover:bg-yellow-400 rounded-lg transition-colors" onClick={() => handleAction(res.id, 'approve')}>Setujui</button>
                    )}
                    {res.status === 'disetujui' && (
                        <button className="h-8 px-4 text-[10px] uppercase font-bold tracking-widest bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-colors shadow-sm" onClick={() => handleAction(res.id, 'check-in')}>Check-In Tamu</button>
                    )}
                    {res.status === 'aktif' && (
                        <button className="h-8 px-4 text-[10px] uppercase font-bold tracking-widest bg-badge-bg border border-border text-text-primary hover:bg-border rounded-lg transition-colors shadow-sm" onClick={() => handleAction(res.id, 'check-out')}>Proses Selesai</button>
                    )}
                    {(res.status === 'selesai' || res.status === 'dibatalkan') && (
                        <span className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest italic px-2 py-1">Closed</span>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-8 pb-12">
            <Header 
                title="Operasional & Jadwal Reservasi" 
                description="Manajemen check-in, check-out, serta persetujuan pesanan klien masuk."
            />

            {/* Quick Verify Bar */}
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h3 className="text-sm font-black text-text-primary flex items-center gap-2">
                        <QrCode size={18} className="text-primary"/> 
                        Verifikasi Cepat E-Ticket
                    </h3>
                    <p className="text-xs font-semibold text-text-secondary mt-1">Gunakan scanner fisik atau input kode untuk check-in instan klien.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => setShowCamera(true)}
                        className="h-12 px-6 rounded-xl font-bold text-xs uppercase tracking-widest bg-badge-bg text-text-secondary hover:bg-border transition-colors shrink-0 flex items-center justify-center gap-2"
                    >
                        <Camera size={14} /> Buka Kamera Pindai
                    </button>
                    <input 
                        type="text" 
                        placeholder="Scan / Ketik Kode Validasi..." 
                        value={simulatorScanner}
                        onChange={(e) => setSimulatorScanner(e.target.value)}
                        className="h-12 w-full sm:w-64 border-transparent bg-badge-bg/80 focus:bg-surface focus:ring-primary focus:border-border transition-colors rounded-xl font-bold font-mono px-4 text-sm"
                    />
                    <button 
                        onClick={handleQuickVerify} 
                        className="h-12 px-6 rounded-xl font-bold text-xs uppercase tracking-widest bg-primary text-text-primary hover:bg-primary-hover shadow-floating transition-colors shrink-0"
                    >
                        Validasi & Check-In
                    </button>
                </div>
            </div>

            {/* Kamera Modal Popup */}
            <AnimatePresence>
                {showCamera && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-surface p-6 rounded-3xl max-w-lg w-full shadow-floating border border-border flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-text-primary flex items-center gap-2">
                                    <QrCode className="text-primary"/> 
                                    Pindai E-Ticket Klien
                                </h3>
                                <button onClick={closeScannerSafe} className="w-10 h-10 rounded-full bg-badge-bg flex items-center justify-center hover:bg-error/10 hover:text-error transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                            
                            <div className="w-full bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center min-h-[300px]">
                                <div id="qr-reader" className="w-full h-full" style={{ border: 'none' }}></div>
                            </div>
                            
                            <p className="mt-6 text-sm font-semibold text-text-secondary text-center">
                                Arahkan kamera ke QR Code pada tiket atau handphone pelanggan. Tiket valid akan diproses secara instan.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Menunggu Konfirmasi" 
                    value={`${summary.pending} Booking`}
                    subtitle="Butuh aksi segera"
                    icon={Clock}
                />
                <StatCard 
                    title="Siap Check-In Hari Ini" 
                    value={`${summary.ready} Tamu`}
                    subtitle="Menunggu kedatangan fisik"
                    icon={CheckCircle2}
                />
                <StatCard 
                    title="Sedang Aktif di Ruangan" 
                    value={`${summary.active} Sesi`}
                    subtitle="Berjalan saat ini"
                    icon={PlayCircle}
                    isHighlight
                />
            </div>

            <FilterTabs 
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Cari kode atau nama member..."
            />

            <DataTable 
                columns={columns}
                data={paginatedQueue}
                keyExtractor={(r) => r.id}
                pagination={{
                    currentPage,
                    totalPages,
                    onPageChange: setCurrentPage
                }}
            />

            {/* Feedback Modal Popup */}
            <AnimatePresence>
                {feedback.show && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-md z-[10000] flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-surface p-8 rounded-3xl max-w-sm w-full mx-auto shadow-floating border border-border/50 text-center relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2 ${feedback.type === 'error' ? 'bg-error/10' : feedback.type === 'success' ? 'bg-primary/20' : 'bg-yellow-500/20'}`} />
                            
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 ${feedback.type === 'error' ? 'bg-error/10 text-error' : feedback.type === 'success' ? 'bg-primary/20 text-primary' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                {feedback.type === 'error' ? <AlertCircle className="w-8 h-8 -ml-1" /> : feedback.type === 'success' ? <CheckCircle2 className="w-8 h-8 -ml-1" /> : <AlertCircle className="w-8 h-8 -ml-1" />}
                            </div>
                            
                            <h3 className="text-xl font-black text-text-primary mb-2 tracking-tight">{feedback.title}</h3>
                            <p className="text-sm font-medium text-text-secondary mb-8 leading-relaxed">
                                {feedback.message}
                            </p>
                            
                            <button 
                                onClick={() => setFeedback({...feedback, show: false})} 
                                className={`w-full h-12 rounded-xl font-bold transition-all outline-none text-white ${feedback.type === 'error' ? 'bg-error hover:bg-red-600 shadow-[0_4px_14px_0_rgba(239,68,68,0.39)]' : feedback.type === 'success' ? 'bg-primary text-text-primary hover:bg-primary-hover shadow-[0_4px_14px_0_rgba(255,213,0,0.39)]' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                            >
                                Tutup
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
