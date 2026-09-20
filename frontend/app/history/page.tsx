'use client';

import { useEffect, useState, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { Navbar } from '@/components/layout/navbar';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/layout/footer';
import { ArrowLeft, Wallet, Clock, Ticket } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const router = useRouter();

  const [filterMonth, setFilterMonth] = useState<string>(String(new Date().getMonth() + 1));
  const [filterYear, setFilterYear] = useState<string>(String(new Date().getFullYear()));
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.get('/reservasi/my/history');
        setHistory(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' }, { value: '4', label: 'April' },
    { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' }, { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' }, { value: '12', label: 'Desember' }
  ];

  const filteredHistory = useMemo(() => {
    return history.filter(h => {
      const d = new Date(h.tanggal_reservasi);
      const matchMonth = filterMonth === 'all' || String(d.getMonth() + 1) === filterMonth;
      const matchYear = filterYear === 'all' || String(d.getFullYear()) === filterYear;
      const matchStatus = filterStatus === 'all' || h.status === filterStatus;
      return matchMonth && matchYear && matchStatus;
    });
  }, [history, filterMonth, filterYear, filterStatus]);

  const stats = useMemo(() => {
    const currentMonthData = history.filter(h => {
      const d = new Date(h.tanggal_reservasi);
      return String(d.getMonth() + 1) === filterMonth && String(d.getFullYear()) === filterYear;
    });

    const totalReservasi = currentMonthData.length;
    const pengeluaranBulanIni = currentMonthData
        .filter(h => h.status === 'selesai' || h.status === 'aktif' || h.status === 'disetujui')
        .reduce((sum, h) => sum + h.total_bayar, 0);
    const akumulasiJamSewa = currentMonthData.reduce((sum, h) => sum + h.durasi_jam, 0);

    return { totalReservasi, pengeluaranBulanIni, akumulasiJamSewa };
  }, [history, filterMonth, filterYear]);

  // QR Modal State
  const [showQrCode, setShowQrCode] = useState<string | null>(null);

  // Cancel Modal State
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'belum_dikonfirm': return { label: 'Menunggu Konfirmasi', classes: 'bg-amber-100 text-amber-700' };
          case 'disetujui': return { label: 'Disetujui', classes: 'bg-blue-100 text-blue-700' };
          case 'aktif': return { label: 'Sedang Berjalan', classes: 'bg-green-100 text-green-700' };
          case 'selesai': return { label: 'Selesai', classes: 'bg-teal-100 text-teal-700' };
          case 'dibatalkan': return { label: 'Dibatalkan', classes: 'bg-red-100 text-red-700' };
          default: return { label: status.replace('_', ' '), classes: 'bg-badge-bg text-text-secondary group-hover:bg-primary/10 group-hover:text-primary' };
      }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-12 w-full flex-grow">
        <Link href="/profile" className="inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Profil
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-black text-text-primary tracking-tight">Histori Reservasi</h1>
          <p className="text-sm font-medium text-text-secondary mt-2">Daftar transaksi dan seluruh tiket pemesanan ruang Anda.</p>
        </div>

        {/* 3 STATS CARDS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
        >
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface p-6 rounded-2xl border border-border shadow-none">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-badge-bg rounded-lg"><Ticket className="w-5 h-5 text-primary" /></div>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Total Reservasi</span>
                </div>
                <p className="text-3xl font-black text-text-primary mt-2">{stats.totalReservasi} <span className="text-sm text-text-secondary font-medium">bln ini</span></p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-surface p-6 rounded-2xl border border-border shadow-none">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg"><Wallet className="w-5 h-5 text-primary" /></div>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Total Pengeluaran</span>
                </div>
                <p className="text-3xl font-black text-text-primary mt-2">Rp {stats.pengeluaranBulanIni.toLocaleString()}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-surface p-6 rounded-2xl border border-border shadow-none">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-badge-bg rounded-lg"><Clock className="w-5 h-5 text-text-secondary" /></div>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Akumulasi Sewa</span>
                </div>
                <p className="text-3xl font-black text-text-primary mt-2">{stats.akumulasiJamSewa} <span className="text-sm text-text-secondary font-medium">Jam</span></p>
            </motion.div>
        </motion.div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 bg-badge-bg p-2 rounded-xl">
            <select 
                value={filterMonth} 
                onChange={e => setFilterMonth(e.target.value)}
                className="bg-surface border-none text-sm font-bold text-text-primary h-12 rounded-lg px-4 outline-none flex-1"
            >
                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <select 
                value={filterYear} 
                onChange={e => setFilterYear(e.target.value)}
                className="bg-surface border-none text-sm font-bold text-text-primary h-12 rounded-lg px-4 outline-none flex-1"
            >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select 
                value={filterStatus} 
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-surface border-none text-sm font-bold text-text-primary h-12 rounded-lg px-4 outline-none flex-1"
            >
                <option value="all">Semua Status</option>
                <option value="belum_dikonfirm">Menunggu Konfirmasi</option>
                <option value="disetujui">Disetujui (Akan datang)</option>
                <option value="aktif">Digunakan / Aktif</option>
                <option value="selesai">Selesai</option>
                <option value="dibatalkan">Dibatalkan</option>
            </select>
        </div>
        
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="space-y-4"
        >
          {filteredHistory.length === 0 ? (
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="bg-surface border border-border p-12 rounded-2xl text-center shadow-none flex flex-col items-center justify-center">
              <Ticket className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-text-primary mb-2">Belum ada history</h3>
              <p className="text-text-secondary font-medium mb-6">Belum ada transaksi ditemukan untuk kriteria tersebut.</p>
              <button 
                  onClick={() => router.push('/spaces')}
                  className="h-12 px-8 rounded-xl text-xs font-bold uppercase tracking-widest bg-primary text-text-primary hover:bg-primary-hover shadow-floating transition-colors"
               >
                  Mulai Jelajah Ruang
               </button>
            </motion.div>
          ) : filteredHistory.map((res: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
            <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }}
                key={res.id} 
                onClick={() => router.push(`/history/${res.id}`)}
                className="cursor-pointer bg-surface p-4 sm:p-6 rounded-3xl border border-border flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-floating hover:border-primary transition-all group"
            >
                <div className="w-full md:w-32 h-32 bg-badge-bg rounded-xl overflow-hidden shrink-0">
                    {res.space?.foto ? (
                        <img src={res.space.foto} alt={res.space.nama_space} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-text-secondary uppercase">No Image</div>
                    )}
                </div>
                
                <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${getStatusBadge(res.status).classes}`}>
                          {getStatusBadge(res.status).label}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-2.5 py-1 bg-primary/5 rounded-md">
                          {res.space?.tipe?.replace('_', ' ') || 'WORKSPACE'}
                        </span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <h3 className="font-black text-2xl text-text-primary mb-1 group-hover:text-primary transition-colors">{res.space?.nama_space || 'Ruangan Dihapus'}</h3>
                            <p className="font-mono text-xs font-bold text-text-secondary mb-3">#{res.kode_booking}</p>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary bg-badge-bg px-2.5 py-1 rounded-md w-fit">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{res.tanggal_reservasi} • {res.jam_mulai} ({res.durasi_jam} Jam)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:items-end w-full md:w-auto shrink-0 mt-4 md:mt-0 gap-4">
                    <div className="text-left md:text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1">Total Harga</p>
                        <p className="font-black text-text-primary text-2xl">Rp {res.total_bayar?.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto shrink-0">
                    
                    {/* Aksi Berdasarkan Status */}
                    {res.status === 'aktif' && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); setShowQrCode(res.qr_serial_token || res.qr_code_payload || `VERIFY-${res.id}`); }}
                            className="h-12 px-6 rounded-xl text-xs font-bold uppercase tracking-widest bg-primary text-text-primary hover:bg-primary-hover shadow-floating transition-colors w-full sm:w-auto"
                        >
                            Tampilkan Kode QR
                        </button>
                    )}

                    {(res.status === 'belum_dikonfirm' || res.status === 'disetujui') && (
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setCancelModalId(String(res.id)); }}
                                className="h-12 px-6 rounded-xl text-xs font-bold uppercase tracking-widest border border-error/50 text-error hover:bg-error/10 transition-colors w-full sm:w-auto"
                            >
                                Batalkan
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); router.push(`/history/${res.id}`); }}
                                className="h-12 px-6 rounded-xl text-xs font-bold uppercase tracking-widest bg-primary text-text-primary hover:bg-primary-hover shadow-floating transition-colors w-full sm:w-auto"
                            >
                                Lihat E-Ticket
                            </button>
                        </>
                    )}

                    {res.status === 'selesai' && (
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); router.push(`/history/${res.id}`); }}
                                className="h-12 px-6 rounded-xl text-xs font-bold uppercase tracking-widest border border-border text-text-primary hover:bg-badge-bg transition-colors w-full sm:w-auto"
                            >
                                Unduh Nota
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); router.push(`/space/${res.id_space}`); }}
                                className="h-12 px-6 rounded-xl text-xs font-bold uppercase tracking-widest bg-gray-900 text-white hover:bg-black transition-colors w-full sm:w-auto"
                            >
                                Pesan Ulang
                            </button>
                        </>
                    )}
                    
                    </div>
                </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* QR CODE MODAL */}
      <AnimatePresence>
      {showQrCode && (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }} 
                className="bg-surface p-8 rounded-3xl max-w-sm w-full mx-auto shadow-floating flex flex-col items-center"
            >
                <h3 className="text-xl font-black text-text-primary mb-2">Gate Access</h3>
                <p className="text-sm font-medium text-text-secondary text-center mb-8">Scan QR ini pada mesin gerbang atau resepsionis di lokasi urSpace.</p>
                <div className="p-4 bg-white rounded-2xl border-4 border-gray-100 shadow-sm mb-8 w-64 h-64 flex items-center justify-center">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(showQrCode)}`} alt="Ticket QR" className="w-full h-full" />
                </div>
                <button onClick={() => setShowQrCode(null)} className="w-full h-12 rounded-xl bg-badge-bg text-text-secondary font-bold hover:bg-border transition-colors">Tutup</button>
            </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* CANCEL MODAL */}
      <AnimatePresence>
      {cancelModalId && (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }} 
                className="bg-surface p-8 rounded-3xl max-w-sm w-full mx-auto shadow-floating flex flex-col items-center text-center"
            >
                <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <h3 className="text-xl font-black text-text-primary mb-2">Batalkan Pesanan?</h3>
                <p className="text-sm font-medium text-text-secondary mb-8">Apakah Anda yakin ingin membatalkan pesanan ini? Aksi ini tidak dapat dikembalikan lagi setelahnya.</p>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button onClick={() => setCancelModalId(null)} className="flex-1 h-12 rounded-xl bg-badge-bg text-text-secondary font-bold hover:bg-border transition-colors">Kembali</button>
                    <button 
                        onClick={async () => {
                            try {
                                await apiClient.patch(`/reservasi/${cancelModalId}/cancel`);
                                window.location.reload();
                            } catch(e) {
                                alert('Gagal membatalkan pesanan.');
                                setCancelModalId(null);
                            }
                        }} 
                        className="flex-1 h-12 rounded-xl bg-error text-white font-bold hover:bg-red-600 transition-colors shadow-floating"
                    >
                        Ya, Batalkan
                    </button>
                </div>
            </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}