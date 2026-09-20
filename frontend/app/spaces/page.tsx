'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/axios';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SpacesIndex() {
  const [spaces, setSpaces] = useState<any[]>([]); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchCatalog() {
      try {
        const res = await apiClient.get('/spaces');
        setSpaces(res.data.data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchCatalog();
  }, []);

  const types = [
    { id: 'all', label: 'Semua Ruang' },
    { id: 'desk', label: 'Desk Personal' },
    { id: 'meeting_room', label: 'Ruang Rapat' },
    { id: 'private_office', label: 'Kantor Privat' }
  ];

  const filteredSpaces = spaces.filter(s => {
      const matchType = filterType === 'all' || s.tipe === filterType;
      const matchSearch = String(s.nama_space).toLowerCase().includes(search.toLowerCase()) || 
                          String(s.deskripsi).toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
  });

  return (
    <main className="min-h-screen bg-surface flex flex-col relative overflow-hidden">
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none opacity-50 z-0"></div>
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-brand-dark/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      <div className="relative z-10 w-full flex flex-col flex-1">
        <Navbar />
        
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20">
          
          <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()} 
            className="inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors mb-8"
          >
              <ArrowLeft className="w-4 h-4" /> Kembali
          </motion.button>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
              <h1 className="text-5xl md:text-6xl font-black text-text-primary tracking-tight mb-4">Katalog Ruang</h1>
              <p className="text-lg text-text-secondary font-medium">Temukan ruang kerja ideal yang cocok dengan kebutuhanmu.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 justify-between items-center bg-badge-bg p-2 rounded-2xl mb-12 shadow-sm"
          >
              <div className="flex bg-surface rounded-xl overflow-x-auto w-full md:w-auto p-1 shadow-sm shrink-0">
                  {types.map(t => (
                      <button 
                          key={t.id}
                          onClick={() => setFilterType(t.id)}
                          className={`px-6 py-3 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                              filterType === t.id ? 'bg-gray-900 text-white shadow-none' : 'text-text-secondary hover:text-text-primary hover:bg-badge-bg'
                          }`}
                      >
                          {t.label}
                      </button>
                  ))}
              </div>
              <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input 
                      type="text" 
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Cari nama ruang..."
                      className="w-full h-12 bg-surface pl-11 pr-4 rounded-xl border border-transparent focus:border-primary outline-none text-sm font-bold shadow-sm placeholder:text-text-secondary/60 placeholder:font-medium transition-colors"
                  />
              </div>
          </motion.div>

          {filteredSpaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSpaces.map((space, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1, type: "spring", stiffness: 300, damping: 24 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    key={space.id} 
                    onClick={() => router.push(`/space/${space.id}`)}
                    className="group cursor-pointer bg-surface/80 rounded-3xl border border-white/40 hover:shadow-[0_8px_30px_rgb(255,213,0,0.12)] hover:border-primary/50 transition-all duration-300 flex flex-col backdrop-blur-xl"
                  >
                    <div className="relative w-full h-64 bg-badge-bg rounded-t-3xl overflow-hidden shrink-0">
                      {space.foto ? (
                        <img src={space.foto} alt={space.nama_space} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-secondary opacity-50 font-bold uppercase tracking-widest text-sm bg-badge-bg">No Image</div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="text-text-primary bg-primary shadow-sm px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest">
                          {space.tipe?.replace('_', ' ') || 'WORKSPACE'}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-2xl font-bold text-text-primary group-hover:text-primary transition-colors">{space.nama_space}</h3>
                      <p className="text-text-secondary font-medium mt-3 line-clamp-3 leading-relaxed">{space.deskripsi}</p>
                      
                      <div className="mt-8 flex justify-between items-end border-t border-border pt-6">
                        <div>
                            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">{space.kapasitas} Orang</p>
                            <p className="text-lg font-black text-text-primary">Rp {space.harga_per_jam.toLocaleString()} <span className="text-xs font-medium text-text-secondary">/ jam</span></p>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-text-secondary opacity-70 group-hover:text-text-primary transition-colors">Detail →</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          ) : (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="py-24 text-center"
            >
                <p className="text-xl font-bold text-text-secondary">Tidak ada ruang yang sesuai dengan pencarian.</p>
            </motion.div>
          )}

        </div>
        <Footer />
      </div>
    </main>
  );
}
