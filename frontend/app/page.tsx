'use client';

import { useRef } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, CheckCircle2, Wifi, Coffee, CalendarDays, Sparkles, Quote } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const horizontalTargetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: horizontalTargetRef,
  });

  const x = useTransform(scrollYProgress, (p) => `calc(15vw + ${p} * ((100vw - 100%) - 15vw))`);

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

  return (
    <main className="min-h-screen bg-surface text-text-primary selection:bg-primary selection:text-text-primary flex flex-col">
      <Navbar />
      
      {/* 1. HERO SECTION WITH GRID BG */}
      <section className="relative px-6 flex flex-col items-center text-center max-w-5xl mx-auto pt-32 pb-16 min-h-[75vh] overflow-hidden justify-center">
        {/* Net / Grid Background Pattern */}
        <div className="absolute inset-0 bg-grid pointer-events-none -z-10" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-dark/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="w-full">
            <span className="px-4 py-1.5 rounded-full border border-border text-xs font-bold tracking-widest uppercase text-text-primary mb-8 inline-block bg-primary/20 shadow-none">
                urSpace Experience
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-6">
                Tingkatkan <br/><span className="relative z-10"><span className="absolute bottom-4 left-0 w-full h-1/3 -rotate-1 -z-10"><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration:1.3, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} style={{ transformOrigin: "left" }} className="block w-full h-full bg-primary rounded-sm" /></span>Produktivitasmu.</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
                Sewa Meja & Ruang Kerja Nyaman Dalam Hitungan Detik. <br className="hidden md:block"/> Fokus pada ide besarmu, kami urus sisanya.
            </p>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  horizontalTargetRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-brand-dark text-white rounded-full px-8 py-4 font-bold text-lg inline-flex items-center gap-2 hover:opacity-90 transition-all outline-none shadow-floating"
            >
                Jelajahi Ruang <ArrowRight className="w-5 h-5 text-primary"/>
            </motion.button>
        </motion.div>
        
        <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-6 flex flex-col items-center text-text-secondary opacity-60"
        >
            <span className="text-xs font-bold uppercase tracking-widest mb-2">Scroll</span>
            <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* 2. HORIZONTAL SCROLL REVEAL (KATEGORI RUANG) */}
      <section ref={horizontalTargetRef} className="h-[200vh] relative bg-background border-y border-border" id="jelajah">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-40 z-0 h-full" />
        
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden z-10">
          <div className="max-w-7xl mx-auto w-full px-6 mb-16 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
             <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                 <h2 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">Kategori Ruang</h2>
                 <p className="text-xl text-text-secondary font-medium mt-2">Geser untuk menelusuri koleksi kategori ruang kerja kami.</p>
             </motion.div>
             <button 
                 onClick={() => router.push('/spaces')}
                 className="flex items-center gap-2 text-sm font-bold bg-surface border border-border px-6 py-3 rounded-xl hover:border-primary hover:text-primary transition-all shrink-0 shadow-sm"
             >
                 Jelajahi lebih lanjut <ArrowRight className="w-4 h-4" />
             </button>
          </div>
          
          <motion.div style={{ x }} className="flex gap-8 px-6 md:px-[max(1.5rem,calc((100vw-80rem)/2))] w-max items-stretch">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="w-[320px] md:w-[450px] group bg-surface/80 backdrop-blur-xl rounded-3xl border border-white/40 flex flex-col shrink-0 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-primary/50 transition-all duration-300"
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
            
            {/* Akhir List Buffer */}
            <div className="w-[300px] shrink-0 flex flex-col justify-center px-8 border-l-2 border-dashed border-border ml-8 mr-16">
                <h3 className="text-4xl font-black text-text-primary tracking-tight">Pilih sesuai dengan kebutuhanmu.</h3>
                <p className="text-text-secondary mt-4 font-medium">Lanjutkan scroll ke bawah untuk melihat cara kerja kami.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. OPSI SEWA (BUNDLE PRICING) */}
      <section className="py-32 px-6 max-w-7xl mx-auto w-full relative" id="opsi-sewa">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary mb-4">Opsi Sewa Fleksibel</h2>
            <p className="text-lg md:text-xl text-text-secondary font-medium max-w-2xl mx-auto">Kami mengerti ritme kerja Anda berbeda-beda. Pilih paket booking yang paling masuk akal untuk Anda.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} whileHover={{ y: -8 }} className="bg-surface/80 backdrop-blur-xl p-8 rounded-3xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-floating transition-all flex flex-col">
                <div className="text-4xl mb-6">⏳</div>
                <h3 className="text-2xl font-black text-text-primary mb-2">Pay-as-you-go</h3>
                <p className="text-text-primary font-bold mb-4">Fokus: <span className="font-medium text-text-secondary">Meeting kilat atau *deep work* sejenak.</span></p>
                <div className="bg-badge-bg p-4 rounded-xl text-sm text-text-secondary font-medium leading-relaxed mt-auto">Sangat fleksibel, Anda hanya membayar mutlak sesuai jumlah jam yang dihabiskan di ruangan.</div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} whileHover={{ y: -8 }} className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-xl p-8 rounded-3xl border border-primary/20 shadow-[0_8px_30px_rgb(255,213,0,0.1)] hover:shadow-[0_8px_30px_rgb(255,213,0,0.2)] transition-all flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-text-primary px-4 py-1 font-bold text-[10px] uppercase tracking-widest rounded-bl-xl shadow-sm">Paling Diminati</div>
                <div className="text-4xl mb-6">☕</div>
                <h3 className="text-2xl font-black text-text-primary mb-2">Day Pass</h3>
                <p className="text-text-primary font-bold mb-4">Fokus: <span className="font-medium text-text-secondary">Bekerja seharian penuh tanpa limitasi durasi habis.</span></p>
                <div className="bg-white/60 p-4 rounded-xl text-sm text-text-secondary font-medium leading-relaxed mt-auto">Lebih hemat dari tarif per-jam. Nikmati akses tak terbatas ke area *Pantry* dari pagi hingga tutup.</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} whileHover={{ y: -8 }} className="bg-gradient-to-br from-brand-dark to-gray-900 p-8 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-floating transition-all flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-0 translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10 text-4xl mb-6">🏢</div>
                <h3 className="relative z-10 text-2xl font-black text-white mb-2">Corporate Team</h3>
                <p className="relative z-10 text-white font-bold mb-4">Fokus: <span className="font-medium text-text-secondary">Sewa mingguan/bulanan untuk tim kecil Anda.</span></p>
                <div className="relative z-10 bg-white/10 backdrop-blur-md p-4 rounded-xl text-sm text-gray-300 font-medium leading-relaxed mt-auto border border-white/5">Dapatkan *dedicated desk* dan kemudahan mengaplikasikan kupon (Promo) untuk potongan harga massal.</div>
            </motion.div>
        </div>
      </section>

      {/* 4. BENEFITS SECTION */}
      <section className="bg-background py-24 px-6 border-y border-border overflow-hidden relative">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
              <h2 className="text-4xl font-black tracking-tight text-text-primary mb-4">Mengapa Memilih Kami?</h2>
              <p className="text-lg text-text-secondary font-medium">Platform ekosistem produktivitas yang dirancang untuk kenyamanan menyeluruh.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} whileHover={{ scale: 1.05 }} className="flex flex-col items-center text-center group cursor-pointer bg-surface/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 hover:border-primary/50 hover:bg-surface transition-all shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-floating">
                  <div className="w-16 h-16 rounded-2xl bg-badge-bg border border-border group-hover:bg-primary/10 group-hover:border-primary/30 flex items-center justify-center mb-6 transition-colors"><Wifi className="w-6 h-6 text-text-primary" /></div>
                  <h4 className="font-bold text-text-primary text-xl mb-3">Gigabit Internet</h4>
                  <p className="text-text-secondary font-medium leading-relaxed text-sm">Jalur internet dedikasi yang meminimalisir delay pada komunikasi bisnis Anda.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} whileHover={{ scale: 1.05 }} className="flex flex-col items-center text-center group cursor-pointer bg-surface/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 hover:border-primary/50 hover:bg-surface transition-all shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-floating">
                  <div className="w-16 h-16 rounded-2xl bg-badge-bg border border-border group-hover:bg-primary/10 group-hover:border-primary/30 flex items-center justify-center mb-6 transition-colors"><Coffee className="w-6 h-6 text-text-primary" /></div>
                  <h4 className="font-bold text-text-primary text-xl mb-3">Premium Pantry</h4>
                  <p className="text-text-secondary font-medium leading-relaxed text-sm">Aliran kopi premium tanpa jeda merangsang energi tim sepanjang hari.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.05 }} className="flex flex-col items-center text-center group cursor-pointer bg-surface/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 hover:border-primary/50 hover:bg-surface transition-all shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-floating">
                  <div className="w-16 h-16 rounded-2xl bg-badge-bg border border-border group-hover:bg-primary/10 group-hover:border-primary/30 flex items-center justify-center mb-6 transition-colors"><CheckCircle2 className="w-6 h-6 text-text-primary" /></div>
                  <h4 className="font-bold text-text-primary text-xl mb-3">Private & Secure</h4>
                  <p className="text-text-secondary font-medium leading-relaxed text-sm">Ruang isolasi akustik menunjang kerahasiaan diskusi internal perusahaan.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} whileHover={{ scale: 1.05 }} className="flex flex-col items-center text-center group cursor-pointer bg-surface/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 hover:border-primary/50 hover:bg-surface transition-all shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-floating">
                  <div className="w-16 h-16 rounded-2xl bg-badge-bg border border-border group-hover:bg-primary/20 group-hover:border-primary/50 flex items-center justify-center mb-6 transition-colors"><CalendarDays className="w-6 h-6 text-text-primary" /></div>
                  <h4 className="font-bold text-text-primary text-xl mb-3">Flexible Hours</h4>
                  <p className="text-text-secondary font-medium leading-relaxed text-sm">Pesan berdasarkan jam, tanpa deposit berbelit. Segera dapatkan akses.</p>
              </motion.div>
          </div>
        </div>
      </section>

      {/* 5. REPLACED CALENDAR WITH QUOTE & CTA CARD */}
      <section className="py-28 px-6 bg-surface relative overflow-hidden">
        {/* Subtle background grid pattern without fade to stand out more */}
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          
          {/* Quote Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20 px-4"
          >
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8 border border-primary/40">
              <Quote className="w-8 h-8 text-text-primary" />
            </div>
            <blockquote className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-text-primary max-w-4xl mx-auto mb-6">
              "A better place makes <span className="bg-primary px-3 py-1 rounded-lg">better decisions</span>."
            </blockquote>
            <p className="text-lg md:text-xl text-text-secondary font-medium">
              Lingkungan kerja yang tepat memicu ide-ide terbaik dan mempercepat pertumbuhan ide Anda.
            </p>
          </motion.div>

          {/* CTA Card Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-brand-dark text-white rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-floating"
          >
            {/* Gradient Accents inside Card */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-primary/10 rounded-full blur-[70px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-xl text-center md:text-left">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                  <Sparkles className="w-3.5 h-3.5" /> Ruang Kerja Impian
                </span>
                <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
                  Siap Memulai Langkah Besarmu Hari Ini?
                </h3>
                <p className="text-gray-400 font-medium text-base md:text-lg leading-relaxed">
                  Temukan meja kerja atau ruang rapat yang sesuai dengan tim Anda. Pesan secara instan dalam hitungan detik.
                </p>
              </div>

              <div className="shrink-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/spaces')}
                  className="bg-primary text-text-primary px-8 py-5 rounded-2xl font-black text-lg hover:bg-primary-hover transition-all inline-flex items-center gap-3 shadow-floating"
                >
                  Pesan Ruang Sekarang <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
