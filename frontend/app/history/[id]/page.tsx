'use client';

import { useEffect, useState, use } from 'react';
import apiClient from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Printer, MessageCircleQuestion } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

export default function ETicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [ticket, setTicket] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  
  useEffect(() => {
    async function fetchTicket() {
      try {
        const res = await apiClient.get(`/reservasi/${id}`);
        setTicket(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTicket();
  }, [id]);

  if (!ticket) return <div className="min-h-screen bg-background flex items-center justify-center font-bold text-text-secondary">Memuat E-Tiket...</div>;

  return (
    <main className="min-h-screen bg-background py-10 font-sans">
      
      {/* Top Nav (Screen only) */}
      <div className="max-w-4xl mx-auto px-4 mb-6 print:hidden">
         <button onClick={() => router.push('/history')} className="flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Riwayat
         </button>
      </div>

      {/* Ticket Container */}
      <motion.div 
         initial={{ opacity: 0, y: 30, scale: 0.98 }}
         animate={{ opacity: 1, y: 0, scale: 1 }}
         transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
         className="max-w-4xl mx-auto bg-surface rounded-3xl shadow-floating overflow-hidden border border-border print:shadow-none print:border-0 print:rounded-none"
      >
          
          {/* Header */}
          <div className="bg-primary p-8 relative flex justify-between items-start">
             <div>
                 <div className="flex items-center gap-3 mb-4">
                     <span className="bg-white/40 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest text-text-primary border border-white/50">E-Tiket urSpace</span>
                     <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest ${ticket.status === 'aktif' ? 'bg-success text-white' : (ticket.status === 'dibatalkan' ? 'bg-error text-white' : 'bg-brand-dark text-white')}`}>
                         {ticket.status?.replace('_', ' ')}
                     </span>
                 </div>
                 <p className="text-xs font-bold text-text-primary/60 uppercase tracking-widest mb-1">No Booking</p>
                 <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text-primary">{ticket.kode_booking}</h2>
             </div>
             <div className="hidden sm:block text-right">
                <div className="w-14 h-14 bg-brand-dark text-white font-black text-3xl flex items-center justify-center rounded-xl ml-auto mb-2">u.</div>
             </div>
          </div>

          <div className="p-8">
              {/* Seksi 1: Ruangan & Waktu */}
              <div className="border-b border-border pb-8 mb-8 flex flex-col md:flex-row justify-between gap-6">
                  <div>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Ruangan / Kategori</p>
                      <h3 className="text-2xl font-black text-text-primary mb-1">{ticket.space?.nama_space}</h3>
                      <p className="text-base font-bold text-text-secondary">{ticket.space?.tipe?.replace('_', ' ')} • Kapasitas {ticket.space?.kapasitas} Org</p>
                  </div>
                  <div className="md:text-right">
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Jadwal Penggunaan</p>
                      <h3 className="text-2xl font-black text-text-primary mb-1">{ticket.tanggal_reservasi}</h3>
                      <p className="text-base font-bold text-text-secondary font-mono">{ticket.jam_mulai} — {ticket.jam_selesai} <span className="font-sans">({ticket.durasi_jam} Jam)</span></p>
                  </div>
              </div>

              {/* Seksi 2: Informasi Penyewa */}
              <div className="border-b border-border pb-8 mb-8 grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0 gap-x-4">
                  <div>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Nama Penyewa</p>
                      <p className="text-base font-bold text-text-primary">{ticket.member?.nama_member}</p>
                  </div>
                  <div>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Instansi / Profil</p>
                      <p className="text-base font-bold text-text-primary">{ticket.member?.instansi || '-'}</p>
                  </div>
                  <div>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Nomor WhatsApp</p>
                      <p className="text-base font-bold text-text-primary">{ticket.member?.telp}</p>
                  </div>
                  <div>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Metode Bayar (Kasir)</p>
                      <p className="text-base font-bold text-text-primary uppercase">{ticket.payment_method || 'BELUM/MENUNGGU ADMIN'}</p>
                  </div>
              </div>

              {/* Seksi 3 & QR */}
              <div className="flex flex-col md:flex-row justify-between gap-10">
                  <div className="flex-1">
                      <h4 className="text-base font-black text-text-primary mb-4 border-b border-text-primary pb-2">RINCIAN PEMBAYARAN</h4>
                      <div className="space-y-4 text-base font-bold text-text-secondary">
                          <div className="flex justify-between items-center whitespace-nowrap">
                              <span className="truncate mr-4">Harga Dasar Sewa {ticket.harga_per_jam?.toLocaleString()} x {ticket.durasi_jam} Jam</span>
                              <span>Rp {ticket.total_harga_awal?.toLocaleString()}</span>
                          </div>
                          {ticket.potongan_diskon > 0 && (
                              <div className="flex justify-between items-center text-success whitespace-nowrap">
                                  <span className="truncate mr-4">Potongan Promo ({ticket.discount_code})</span>
                                  <span>- Rp {ticket.potongan_diskon?.toLocaleString()}</span>
                              </div>
                          )}
                          <div className="flex justify-between pt-4 mt-4 border-t border-dashed border-border text-2xl text-text-primary whitespace-nowrap">
                              <span className="font-black">Total Tagihan</span>
                              <span className="font-black">Rp {ticket.total_bayar?.toLocaleString()}</span>
                          </div>
                      </div>
                      <p className="mt-8 text-sm font-bold text-text-secondary bg-badge-bg p-4 rounded-xl">Catatan: Tunjukkan E-Tiket ini beserta QR Code kepada petugas front-desk saat kedatangan Anda.</p>
                  </div>

                  <div className="shrink-0 flex flex-col items-center border-t md:border-t-0 md:border-l border-border pt-8 md:pt-0 md:pl-12">
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">QR Akses Petugas</p>
                      <div className="p-4 border-2 border-border rounded-xl bg-surface mb-3 shadow-none">
                          <QRCodeSVG value={ticket.qr_serial_token || `VERIFY-RESERVASI-${ticket.id}-${ticket.kode_booking}`} size={160} />
                      </div>
                      <p className="text-xs font-bold text-text-secondary font-mono tracking-widest opacity-60 break-all w-40 text-center">{ticket.qr_serial_token}</p>
                  </div>
              </div>

          </div>
      </motion.div>

      {/* Footer Actions (Screen only) */}
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 0.4 }}
         className="max-w-4xl mx-auto px-4 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden"
      >
         <p className="text-sm font-medium text-text-secondary text-center sm:text-left">Bingung atau ada kendala dengan pesanan Anda?</p>
         <div className="flex gap-3">
            <button 
                onClick={() => window.print()}
                className="bg-surface border border-border text-text-primary px-6 py-3 rounded-xl text-sm font-bold shadow-none hover:bg-badge-bg hover:border-primary flex items-center gap-2 transition-colors"
            >
                <Printer className="w-4 h-4" /> Cetak / Download PDF
            </button>
            <a 
                href="https://wa.me/6281122334455"
                target="_blank" rel="noreferrer"
                className="bg-brand-dark text-white border border-brand-dark px-6 py-3 rounded-xl text-sm font-bold shadow-floating hover:bg-black flex items-center gap-2 transition-colors"
            >
                <MessageCircleQuestion className="w-4 h-4" /> Kontak CS
            </a>
         </div>
      </motion.div>

    </main>
  );
}