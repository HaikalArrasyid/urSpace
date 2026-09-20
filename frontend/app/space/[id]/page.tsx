'use client';

import { useEffect, useState, use } from 'react';
import apiClient from '@/lib/axios';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addDays, format, isBefore, startOfToday } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import { CalendarDays, Clock, MapPin, Check, X, ArrowLeft } from 'lucide-react'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { Footer } from '@/components/layout/footer';

export default function SpaceDetail({ params }: { params: Promise<{ id: string }> }) {
 const { id } = use(params);
 const router = useRouter();
 const searchParams = useSearchParams();
 const dateParam = searchParams.get('date');
 
 const [space, setSpace] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
 
 // Dialog & Calendar State
 const [isCalendarOpen, setIsCalendarOpen] = useState(false);
 const [selectedDate, setSelectedDate] = useState<Date>(dateParam ? new Date(dateParam) : startOfToday());
 const [slots, setSlots] = useState<{jam_mulai: string, available: boolean}[]>([]);
 const [loadingSlots, setLoadingSlots] = useState(false);
 
 // End Date State
 const [selectedEndDate, setSelectedEndDate] = useState<Date>(dateParam ? new Date(dateParam) : startOfToday());
 const [endSlots, setEndSlots] = useState<{jam: string}[]>([]);
 
 // Checkout Form State
 const [jamMulai, setJamMulai] = useState('');
 const [jamSelesai, setJamSelesai] = useState('');
 const [kodePromo, setKodePromo] = useState('');
 const [loadingCheckout, setLoadingCheckout] = useState(false);
 const [errorObj, setErrorObj] = useState('');

 useEffect(() => {
 apiClient.get(`/spaces/${id}`).then(res => setSpace(res.data.data)).catch(console.error);
 }, [id]);

 useEffect(() => {
 async function loadDaySlots() {
 setLoadingSlots(true);
 const tanggal = format(selectedDate, 'yyyy-MM-dd');
 const hours = Array.from({ length: 24 }, (_, i) => i); // 00:00 to 23:00
 
 try {
 const results = await Promise.all(
 hours.map(async (h) => {
 const timeStr = `${String(h).padStart(2, "0")}:00`;
 try {
 await apiClient.get(`/spaces/availability`, {
 params: { id_space: id, tanggal, jam_mulai: timeStr, durasi_jam: 1 }
 });
 return { jam_mulai: timeStr, available: true };
 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
 return { jam_mulai: timeStr, available: false }; 
 }
 })
 );
 setSlots(results);
 } catch (err) {
 console.error(err);
 } finally {
 setLoadingSlots(false);
 }
 }
 
 if (isCalendarOpen) {
 if (!isBefore(selectedDate, startOfToday())) {
 loadDaySlots();
 } else {
 // eslint-disable-next-line react-hooks/set-state-in-effect
 setSlots([]); 
 }
 }
 }, [id, selectedDate, isCalendarOpen]);

 // Compute end slots
 useEffect(() => {
 const hours = Array.from({ length: 24 }, (_, i) => i);
 // eslint-disable-next-line react-hooks/set-state-in-effect
 setEndSlots(hours.map(h => ({ jam: `${String(h).padStart(2, "0")}:00` })));
 }, []);

 const handleSlotSelect = (timeStr: string, isEnd: boolean) => {
 if (isEnd) {
 setJamSelesai(timeStr);
 } else {
 setJamMulai(timeStr);
 }
 setIsCalendarOpen(false); // Close modal on select
 };

 // END DATE DIBEKUKAN MENJADI SAMA DENGAN SELECTED DATE (HANYA ROUNDING JAM PERHARI BERDASARKAN DIFFERENCE)
 // Karena hanya selisih jam saja, kita perbaiki set jam otomatis dengan perbatasan 24 jam.

 // Compute durasi jam
 let computedDurasi = 0;
 if (jamMulai && jamSelesai) {
 const start = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${jamMulai}`);
 const end = new Date(`${format(selectedEndDate, 'yyyy-MM-dd')}T${jamSelesai}`);
 const diffMs = end.getTime() - start.getTime();
 if (diffMs > 0) {
 computedDurasi = Math.ceil(diffMs / (1000 * 60 * 60));
 }
 }

 const handleCheckout = async (e: React.FormEvent) => {
 e.preventDefault();
 if (computedDurasi <= 0) {
 setErrorObj('Waktu selesai harus setelah waktu datang.');
 return;
 }
 setLoadingCheckout(true);
 setErrorObj('');

 try {
 let promoId = null;
 if (kodePromo) {
 const promoRes = await apiClient.post('/diskon/check', { nama_diskon: kodePromo });
 promoId = promoRes.data.data.id;
 }

 await apiClient.post('/reservasi', {
 id_space: id,
 tanggal_reservasi: format(selectedDate, 'yyyy-MM-dd'),
 jam_mulai: jamMulai,
 durasi_jam: computedDurasi,
 id_diskon: promoId,
 kode_promo: kodePromo || null,
 });

 router.push('/history');
 } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
 setErrorObj(err.response?.data?.message || 'Gagal memproses reservasi.');
 } finally {
 setLoadingCheckout(false);
 }
 };

 const today = startOfToday();
 const dateOptions = Array.from({length: 7}, (_, i) => addDays(today, i));

 const [pickerMode, setPickerMode] = useState<'start' | 'end'>('start');

 if (!space) return <div className="min-h-screen bg-surface" />;

  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-16 w-full">
        <button 
          onClick={() => router.push('/#jelajah')} 
          className="inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT: SPACE DETAILS */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 flex flex-col"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-text-secondary mb-6 uppercase tracking-widest">
              <MapPin className="w-4 h-4" /> {space.tipe.replace('_', ' ')}
 </div>
 
 <h1 className="text-5xl md:text-6xl font-black tracking-tight text-text-primary mb-6">{space.nama_space}</h1>
 
 <div className="w-full aspect-[21/9] bg-badge-bg rounded-3xl overflow-hidden mb-12">
 {space.foto ? (
 <img src={space.foto} alt="Space" className="w-full h-full object-cover" />
 ) : (
 <div className="w-full h-full flex items-center justify-center text-text-secondary opacity-70 font-bold uppercase">No Image</div>
 )}
 </div>

 <div className="prose prose-lg text-text-secondary font-medium">
 <h3 className="text-xl font-bold text-text-primary mb-4">Tentang Ruangan Ini</h3>
 <p className="leading-relaxed">{space.deskripsi}</p>
 </div>
 
 <div className="mt-8 border-t border-border pt-8 flex gap-8">
 <div>
 <span className="block text-text-secondary font-bold text-sm tracking-widest uppercase mb-1">Kapasitas</span>
 <span className="font-bold text-xl text-text-primary">{space.kapasitas} Pax</span>
 </div>
 <div>
 <span className="block text-text-secondary font-bold text-sm tracking-widest uppercase mb-1">Fasilitas</span>
 <span className="font-bold text-xl text-text-primary">Termasuk</span>
 </div>
 </div>
 </motion.div>

          {/* RIGHT: FLOATING CHECKOUT PANEL */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4"
          >
 <div className="bg-surface p-8 rounded-3xl shadow-none border border-border sticky top-32">
 
 <div className="mb-8">
 <h2 className="text-3xl font-black text-text-primary">Rp {space.harga_per_jam.toLocaleString()}</h2>
 <p className="text-text-secondary font-medium">per jam</p>
 </div>

 {errorObj && <div className="bg-error/10 text-error p-4 rounded-xl mb-6 text-sm font-bold">{errorObj}</div>}
 
 <form onSubmit={handleCheckout} className="space-y-5">
 <div className="space-y-1.5">
 <label className="block text-sm font-bold text-text-primary">Waktu Kedatangan</label>
 <div className="flex gap-2">
 <Input disabled value={format(selectedDate, 'yyyy-MM-dd')} className="bg-badge-bg flex-1 font-mono text-center" />
 <Input readOnly value={jamMulai} placeholder="--" className="w-20 bg-badge-bg font-mono text-center" />
 </div>
 </div>

 <Dialog.Root open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
 <Dialog.Trigger asChild>
 <Button type="button" onClick={() => setPickerMode('start')} className="w-full bg-surface border border-border text-text-primary hover:bg-badge-bg h-12 flex items-center justify-center gap-2">
 <Clock className="w-4 h-4" /> Pilih Datang
 </Button>
 </Dialog.Trigger>
 
 <Dialog.Portal>
 <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" />
 <Dialog.Content data-lenis-prevent className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-3xl bg-surface p-8 shadow-floating focus:outline-none">
 <div className="flex justify-between items-center mb-6">
 <div>
 <Dialog.Title className="text-2xl font-black tracking-tight">{pickerMode === 'start' ? 'Pilih Waktu Kedatangan' : 'Pilih Waktu Selesai'}</Dialog.Title>
 <Dialog.Description className="text-sm font-medium text-text-secondary mt-1">Pilih tanggal dan slot jam.</Dialog.Description>
 </div>
 <Dialog.Close asChild>
 <button className="w-8 h-8 rounded-full bg-badge-bg flex items-center justify-center text-text-secondary hover:bg-border"><X className="w-4 h-4" /></button>
 </Dialog.Close>
 </div>

 <div data-lenis-prevent className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
 {dateOptions.map(d => (
 <button 
 key={d.toISOString()} 
 onClick={() => pickerMode === 'start' ? setSelectedDate(d) : setSelectedEndDate(d)}
 className={`shrink-0 px-4 py-3 rounded-xl border text-sm font-bold whitespace-nowrap transition-colors ${format(pickerMode === 'start' ? selectedDate : selectedEndDate, 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd') ? 'bg-gray-900 border-gray-900 text-white' : 'bg-surface border-border text-text-secondary hover:border-border'}`}
 >
 {format(d, 'dd MMM')}
 </button>
 ))}
 </div>

 <div data-lenis-prevent className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-2 no-scrollbar">
 {pickerMode === 'start' ? (
 loadingSlots ? (
 [...Array(24)].map((_, i) => <div key={i} className="h-12 bg-badge-bg animate-pulse rounded-xl shadow-none"></div>)
 ) : slots.length > 0 ? (
 slots.map(slot => (
 <button
 key={slot.jam_mulai}
 disabled={!slot.available}
 onClick={() => handleSlotSelect(slot.jam_mulai, false)}
 className={`h-12 rounded-xl text-sm font-bold transition-all shadow-none ${!slot.available ? 'bg-badge-bg text-text-secondary opacity-70 cursor-not-allowed border border-transparent' : jamMulai === slot.jam_mulai ? 'bg-primary text-text-primary' : 'bg-surface text-text-primary border border-border hover:border-gray-900'}`}
 >
 {slot.jam_mulai}
 </button>
 ))
 ) : (
 <p className="col-span-full py-4 text-center font-bold text-error">Pemesanan di masa lalu tidak diizinkan.</p>
 )
 ) : (
 endSlots.map(slot => (
 <button
 key={slot.jam}
 onClick={() => handleSlotSelect(slot.jam, true)}
 className={`h-12 rounded-xl text-sm font-bold transition-all shadow-none ${jamSelesai === slot.jam ? 'bg-primary text-text-primary' : 'bg-surface text-text-primary border border-border hover:border-gray-900'}`}
 >
 {slot.jam}
 </button>
 ))
 )}
 </div>
 </Dialog.Content>
 </Dialog.Portal>
 </Dialog.Root>

 <div className="space-y-1.5 pt-4">
 <label className="block text-sm font-bold text-text-primary">Waktu Selesai</label>
 <div className="flex gap-2">
 <Input disabled value={format(selectedEndDate, 'yyyy-MM-dd')} className="bg-badge-bg flex-1 font-mono text-center" />
 <Input readOnly value={jamSelesai} placeholder="--" className="w-20 bg-badge-bg font-mono text-center" />
 </div>
 </div>
 
 <Dialog.Root open={isCalendarOpen && pickerMode === 'end'} onOpenChange={(open) => {
 if (open) {
 setPickerMode('end');
 setIsCalendarOpen(true);
 } else {
 setIsCalendarOpen(false);
 }
 }}>
 <Dialog.Trigger asChild>
 <Button type="button" onClick={() => setPickerMode('end')} className="w-full bg-surface border border-border text-text-primary hover:bg-badge-bg h-12 flex items-center justify-center gap-2">
 <Clock className="w-4 h-4" /> Pilih Selesai
 </Button>
 </Dialog.Trigger>
 </Dialog.Root>
 
 {computedDurasi > 0 && (
 <div className="bg-primary/10 text-primary-hover p-4 rounded-xl text-sm font-medium mt-4">
 Reservasi dihitung berdasarkan <strong>{computedDurasi} jam</strong> penuh.
 </div>
 )}

 <div className="space-y-1.5 pt-4">
 <label className="block text-sm font-bold text-text-primary">Kode Promo <span className="text-text-secondary font-normal">(Opsional)</span></label>
 <Input value={kodePromo} onChange={e => setKodePromo(e.target.value.toUpperCase())} placeholder="Ketik kode disini..." className="h-12 bg-badge-bg uppercase placeholder:normal-case font-mono" />
 </div>

 <div className="border-t border-border pt-6 mt-6">
 <div className="flex justify-between items-end">
 <span className="font-bold text-text-secondary">Estimasi Total</span>
 <span className="text-2xl font-black text-text-primary">Rp {(computedDurasi * space.harga_per_jam).toLocaleString()}</span>
 </div>
 </div>

 <p className="mt-4 text-center text-xs text-primary font-bold bg-yellow-50 p-3 rounded-lg border border-yellow-200">
 Silakan lakukan pembayaran langsung di resepsionis pada saat kedatangan. Aplikasi ini tidak memproses pembayaran.
 </p>

 <Button type="submit" className="w-full mt-2 h-14 text-lg font-bold bg-primary hover:bg-primary-hover text-text-primary shadow-floating shadow-yellow-500/20 rounded-xl transition-all hover:scale-[1.02]" disabled={!jamMulai || loadingCheckout}>
 {loadingCheckout ? 'Memproses...' : 'Request Booking'}
 </Button>
 </form>
 </div>
 </motion.div>

 </div>
 </div>
 <Footer />
 </main>
 );
}
