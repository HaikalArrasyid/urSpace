const fs = require('fs');
const path = require('path');

let reconstructed = `'use client';

import { useEffect, useState, useRef } from 'react';
import apiClient from '@/lib/axios';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, CheckCircle2, ChevronLeft, ChevronRight, Wifi, Coffee, CalendarDays } from 'lucide-react';

export default function Home() {
  const [calendar, setCalendar] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const router = useRouter();

  // Scroll Horizontal State
  const horizontalTargetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: horizontalTargetRef,
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]); 

  // Kategori Ruang (Statis)
  const categories = [
    {
      id: 'desk',
      tipe: 'WORKSPACE',
      nama: 'Desk Personal',
      foto: 'https://images.unsplash.com/photo-1497215848143-6c8ed90e9ebfc?auto=format&fit=crop&q=80',
      desc: 'Pilihan fleksibel untuk individu yang butuh ruang kerja dinamis.',
    },
    {
      id: 'meeting_room',
      tipe: 'MEETING ROOM',
      nama: 'Ruang Rapat',
      foto: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80',
      desc: 'Ruang tertutup transparan namun kedap suara, nyaman dan representatif untuk kolaborasi tim dan pertemuan klien.',
    },
    {
      id: 'private_office',
      tipe: 'PRIVATE OFFICE',
      nama: 'Kantor Privat',
      foto: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80',
      desc: 'Solusi eksklusif bagi tim yang menginginkan privasi maksimal dan identitas kerja tersendiri, dengan akses penuh 24 jam.',
    }
  ];

  // Calendar State
  const [calMonth, setCalMonth] = useState(new Date().getMonth() + 1);
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  useEffect(() => {
    generateCalendar(calMonth, calYear);
  }, [calMonth, calYear]);

  const generateCalendar = (m: number, y: number) => {
      const days = new Date(y, m, 0).getDate();
      const cal = [];
      const today = new Date();
      for (let i = 1; i <= days; i++) {
          const date = new Date(y, m - 1, i);
          cal.push({
              tanggal: date.toISOString().split('T')[0],
              full: i % 7 === 0 || i % 10 === 0 // random simulation for "full" indicator
          });
      }
      setCalendar(cal);
  };

  // Calendar render logic
  const daysInMonth = new Date(calYear, calMonth, 0).getDate();
  const firstDay = new Date(calYear, calMonth - 1, 1).getDay(); // 0 = Sunday
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const monthName = new Date(calYear, calMonth - 1, 1).toLocaleString('id-ID', { month: 'long' });

  return (
    <main className="min-h-screen bg-surface text-text-primary selection:bg-primary selection:text-text-primary flex flex-col">
      <Navbar />
      
      {/* 1. HERO SECTION (MURNI SLOGAN) */}
      <section className="relative px-6 flex flex-col items-center text-center max-w-5xl mx-auto pt-32 pb-16 min-h-[80vh] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-dark/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="w-full mt-10">
            <span className="px-4 py-1.5 rounded-full border border-border text-xs font-bold tracking-widest uppercase text-text-primary mb-8 inline-block bg-primary/20 shadow-none">
                urSpace Experience
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-6">
                Tingkatkan <br/><span className="relative z-10"><span className="absolute bottom-4 left-0 w-full h-1/3 -rotate-1 -z-10"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration:1.3, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} style={{ transformOrigin: "left" }} className="block w-full h-full bg-primary rounded-sm" /></span>Produktivitasmu.</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
                Sewa Meja & Ruang Kerja Nyaman Dalam Hitungan Detik. <br className="hidden md:block"/> Fokus pada ide besarmu, kami urus sisanya.
            </p>
            <button 
                onClick={() => {
                  horizontalTargetRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-brand-dark text-white rounded-full px-8 py-4 font-bold text-lg inline-flex items-center gap-2 hover:opacity-80 transition-all outline-none"
            >
                Jelajahi Ruang <ArrowRight className="w-5 h-5 text-primary"/>
            </button>
        </motion.div>
        
        <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 flex flex-col items-center text-text-secondary opacity-60"
        >
            <span className="text-xs font-bold uppercase tracking-widest mb-2">Scroll</span>
            <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* 2. HORIZONTAL SCROLL REVEAL (KATEGORI RUANG) */}
      <section ref={horizontalTargetRef} className="h-[250vh] relative bg-background border-y border-border" id="jelajah">
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="max-w-7xl mx-auto w-full px-6 mb-16 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
             <div>
                 <h2 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">Kategori Ruang</h2>
                 <p className="text-xl text-text-secondary font-medium mt-2">Geser untuk menelusuri koleksi kategori ruang kerja kami.</p>
             </div>
             <button 
                 onClick={() => router.push("/spaces")}
                 className="flex items-center gap-2 text-sm font-bold bg-surface border border-border px-6 py-3 rounded-xl hover:border-primary hover:text-primary transition-all shrink-0"
             >
                 Jelajahi lebih lanjut <ArrowRight className="w-4 h-4" />
             </button>
          </div>
          
          <motion.div style={{ x }} className="flex gap-8 px-6 md:px-[max(1.5rem,calc((100vw-80rem)/2))] w-max items-stretch">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="w-[320px] md:w-[450px] group bg-surface rounded-3xl border border-border flex flex-col shrink-0 overflow-hidden"
              >
                <div className="relative w-full h-56 md:h-72 bg-badge-bg overflow-hidden shrink-0">
                   <img src={cat.foto} alt={cat.nama} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute top-4 left-4">
                     <span className="text-text-primary bg-primary shadow-sm px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest">
                       {cat.tipe}
                     </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-black text-text-primary mb-3">{cat.nama}</h3>
                  <p className="text-text-secondary font-medium text-lg leading-relaxed">{cat.desc}</p>
                </div>
              </div>
            ))}
            
            {/* Akhir List Buffer - Teks Mentok */}
            <div className="w-[300px] shrink-0 flex flex-col justify-center px-8 border-l-2 border-dashed border-border ml-8">
                <h3 className="text-4xl font-black text-text-primary tracking-tight">Pilih sesuai dengan kebutuhanmu.</h3>
                <p className="text-text-secondary mt-4 font-medium">Lanjutkan scroll ke bawah untuk melihat cara kerja kami.</p>
            </div>
            
            <div className="w-[10vw] shrink-0"></div>
          </motion.div>
        </div>
      </section>

      {/* 3. OPSI SEWA (BUNDLE PRICING) */}
      <section className="py-32 px-6 max-w-7xl mx-auto w-full" id="opsi-sewa">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary mb-4">Opsi Sewa Fleksibel</h2>
            <p className="text-lg md:text-xl text-text-secondary font-medium max-w-2xl mx-auto">Kami mengerti ritme kerja Anda berbeda-beda. Pilih paket booking yang paling masuk akal untuk Anda.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -8 }} className="bg-surface p-8 rounded-2xl border border-border shadow-none hover:shadow-floating hover:border-primary transition-all flex flex-col">
                <div className="text-4xl mb-6">⏳</div>
                <h3 className="text-2xl font-black text-text-primary mb-2">Pay-as-you-go</h3>
                <p className="text-text-primary font-bold mb-4">Fokus: <span className="font-medium text-text-secondary">Meeting kilat atau *deep work* sejenak.</span></p>
                <div className="bg-badge-bg p-4 rounded-xl text-sm text-text-secondary font-medium leading-relaxed mt-auto">Sangat fleksibel, Anda hanya membayar mutlak sesuai jumlah jam yang dihabiskan di ruangan.</div>
            </motion.div>
            
            <motion.div whileHover={{ y: -8 }} className="bg-primary/5 p-8 rounded-2xl border border-primary/30 shadow-none hover:shadow-floating hover:border-primary transition-all flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-text-primary px-4 py-1 font-bold text-[10px] uppercase tracking-widest rounded-bl-xl">Paling Diminati</div>
                <div className="text-4xl mb-6">☕</div>
                <h3 className="text-2xl font-black text-text-primary mb-2">Day Pass</h3>
                <p className="text-text-primary font-bold mb-4">Fokus: <span className="font-medium text-text-secondary">Bekerja seharian penuh tanpa limitasi durasi habis.</span></p>
                <div className="bg-white/60 p-4 rounded-xl text-sm text-text-secondary font-medium leading-relaxed mt-auto">Lebih hemat dari tarif per-jam. Nikmati akses tak terbatas ke area *Pantry* dari pagi hingga tutup.</div>
            </motion.div>

            <motion.div whileHover={{ y: -8 }} className="bg-brand-dark p-8 rounded-2xl shadow-none hover:shadow-floating transition-all flex flex-col">
                <div className="text-4xl mb-6">🏢</div>
                <h3 className="text-2xl font-black text-white mb-2">Corporate Team</h3>
                <p className="text-white font-bold mb-4">Fokus: <span className="font-medium text-text-secondary">Sewa mingguan/bulanan untuk tim kecil Anda.</span></p>
                <div className="bg-white/10 p-4 rounded-xl text-sm text-gray-300 font-medium leading-relaxed mt-auto">Dapatkan *dedicated desk* dan kemudahan mengaplikasikan kupon (Promo) untuk potongan harga massal.</div>
            </motion.div>
        </div>
      </section>

      {/* 4. BENEFITS SECTION */}
      <section className="bg-background py-24 px-6 border-y border-border overflow-hidden">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
              <h2 className="text-4xl font-black tracking-tight text-text-primary mb-4">Mengapa Memilih Kami?</h2>
              <p className="text-lg text-text-secondary font-medium">Platform ekosistem produktivitas yang dirancang untuk kenyamanan menyeluruh.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center text-center group cursor-pointer bg-surface p-6 rounded-2xl border border-transparent hover:border-primary transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-badge-bg border border-border group-hover:bg-primary/20 group-hover:border-primary/50 flex items-center justify-center mb-6 transition-colors"><Wifi className="w-6 h-6 text-text-primary" /></div>
                  <h4 className="font-bold text-text-primary text-xl mb-3">Gigabit Internet</h4>
                  <p className="text-text-secondary font-medium leading-relaxed text-sm">Jalur internet dedikasi yang meminimalisir delay pada komunikasi bisnis Anda.</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center text-center group cursor-pointer bg-surface p-6 rounded-2xl border border-transparent hover:border-primary transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-badge-bg border border-border group-hover:bg-primary/20 group-hover:border-primary/50 flex items-center justify-center mb-6 transition-colors"><Coffee className="w-6 h-6 text-text-primary" /></div>
                  <h4 className="font-bold text-text-primary text-xl mb-3">Premium Pantry</h4>
                  <p className="text-text-secondary font-medium leading-relaxed text-sm">Aliran kopi premium tanpa jeda merangsang energi tim sepanjang hari.</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center text-center group cursor-pointer bg-surface p-6 rounded-2xl border border-transparent hover:border-primary transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-badge-bg border border-border group-hover:bg-primary/20 group-hover:border-primary/50 flex items-center justify-center mb-6 transition-colors"><CheckCircle2 className="w-6 h-6 text-text-primary" /></div>
                  <h4 className="font-bold text-text-primary text-xl mb-3">Private & Secure</h4>
                  <p className="text-text-secondary font-medium leading-relaxed text-sm">Ruang isolasi akustik menunjang kerahasiaan diskusi internal perusahaan.</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center text-center group cursor-pointer bg-surface p-6 rounded-2xl border border-transparent hover:border-primary transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-badge-bg border border-border group-hover:bg-primary/20 group-hover:border-primary/50 flex items-center justify-center mb-6 transition-colors"><CalendarDays className="w-6 h-6 text-text-primary" /></div>
                  <h4 className="font-bold text-text-primary text-xl mb-3">Flexible Hours</h4>
                  <p className="text-text-secondary font-medium leading-relaxed text-sm">Pesan berdasarkan jam, tanpa deposit berbelit. Segera dapatkan akses.</p>
              </motion.div>
          </div>
        </div>
      </section>

      {/* 5. CALENDAR AVAILABILITY SUMMARY */}
      <section className="bg-background py-32 px-6 border-t border-border w-full" id="kalender">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black tracking-tight mb-4 text-text-primary">Ketersediaan Bulan Ini</h2>
                <p className="text-lg text-text-secondary font-medium">Jadwal ringkasan (Tanggal yang redup & tidak bisa diklik menandakan Full Booked).</p>
            </div>

            <div className="bg-surface rounded-2xl border border-border p-8 md:p-12 shadow-none">
                <div className="flex justify-between items-center mb-8 pb-8 border-b border-border">
                    <button 
                      onClick={() => {
                        if (calMonth === 1) { setCalMonth(12); setCalYear(y => y - 1); }
                        else setCalMonth(m => m - 1);
                      }} 
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-badge-bg border border-border text-text-secondary hover:bg-primary hover:text-text-primary transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="w-5 h-5"/>
                    </button>
                    <div className="text-2xl font-black uppercase tracking-widest text-text-primary">{monthName} {calYear}</div>
                     <button 
                      onClick={() => {
                        if (calMonth === 12) { setCalMonth(1); setCalYear(y => y + 1); }
                        else setCalMonth(m => m + 1);
                      }} 
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-badge-bg border border-border text-text-secondary hover:bg-primary hover:text-text-primary transition-colors cursor-pointer"
                    >
                        <ChevronRight className="w-5 h-5"/>
                    </button>
                </div>

                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
                    <div className="w-4 h-4 rounded-md border border-border bg-surface"></div> Tersedia
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
                    <div className="w-4 h-4 rounded-md border border-border bg-badge-bg opacity-40"></div> Penuh Total 24 Jam
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 md:gap-4">
                    {['Mng', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                        <div key={day} className="text-center text-xs font-bold text-text-secondary opacity-70 uppercase tracking-widest py-2">
                            {day}
                        </div>
                    ))}
                    
                    {blanks.map((b) => (
                        <div key={\`blank-\${b}\`} className="h-10 md:h-16 rounded-lg bg-transparent"></div>
                    ))}

                    {calendar.map((c) => (
                        <div 
                          key={c.tanggal} 
                          title={c.tanggal}
                          className={\`h-12 md:h-16 rounded-lg border flex items-center justify-center transition-colors relative group \${
                              c.full 
                                ? 'bg-badge-bg border-border opacity-40 cursor-not-allowed' 
                                : 'bg-surface border-border hover:border-primary hover:bg-primary/5 cursor-pointer'
                          }\`}
                        >
                            <span className={\`text-base md:text-xl font-black \${c.full ? 'text-text-secondary' : 'text-text-primary'}\`}>
                                {new Date(c.tanggal).getDate()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
`;
fs.writeFileSync('frontend/app/page.tsx', reconstructed);
