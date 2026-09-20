'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Header } from '@/components/admin/Header';
import { StatCard } from '@/components/admin/StatCard';
import { DataTable } from '@/components/admin/DataTable';
import { Wallet, TrendingUp, Clock, Monitor, Users, Briefcase } from 'lucide-react';

export default function AdminDashboard() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    apiClient.get('/admin/reports/monthly').then((res) => {
        setReport(res.data.data);
    }).catch(console.error);
  }, []);

  if (!report) return <div className="p-8 text-sm font-bold animate-pulse text-text-secondary">Loading Dashboard...</div>;

  const chartData = [
      { name: 'Bruto (Kotor)', value: report.estimasi_pendapatan_kotor },
      { name: 'Potongan (Diskon)', value: report.total_potongan_diskon },
      { name: 'Netto (Bersih)', value: report.realisasi_pendapatan_bersih },
  ];

  return (
    <div className="space-y-8 pb-12">
        <Header 
            title="Analytics & Overview" 
            description={`Laporan operasional dan kinerja bulanan (Bulan ${report.month})`}
            action={{ label: 'Unduh Laporan CSV', onClick: () => alert('Downloading...') }}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
                title="Pendapatan Bersih" 
                value={`Rp ${report.realisasi_pendapatan_bersih.toLocaleString()}`}
                subtitle="Realisasi Pendapatan"
                icon={TrendingUp}
                isHighlight
            />
            <StatCard 
                title="Kotor & Diskon" 
                value={`Rp ${report.estimasi_pendapatan_kotor.toLocaleString()}`}
                subtitle="Estimasi Kotor"
                icon={Wallet}
            />
            <StatCard 
                title="Akumulasi Waktu" 
                value={`${report.total_jam_terpakai} Jam`}
                subtitle="Total Selesai"
                icon={Clock}
            />
        </div>

        {/* Distributor Ruangan Dummy / Placeholder mapping for now until API provides it */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-none flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <Monitor size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-text-primary">Personal Desk</h4>
                    <p className="text-xs text-text-secondary font-medium mt-1">Distribusi Sesi Aktif</p>
                </div>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-none flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                    <Users size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-text-primary">Meeting Room</h4>
                    <p className="text-xs text-text-secondary font-medium mt-1">Distribusi Sesi Aktif</p>
                </div>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-none flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                    <Briefcase size={24} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-text-primary">Private Office</h4>
                    <p className="text-xs text-text-secondary font-medium mt-1">Distribusi Sesi Aktif</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 bg-surface p-8 rounded-2xl border border-border shadow-none">
                <h3 className="text-lg font-bold text-text-primary tracking-tight mb-8">Distribusi Keuangan</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-text-secondary)', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-secondary)', fontWeight: 'bold' }} axisLine={false} tickLine={false} tickFormatter={(val) => `Rp${val.toLocaleString()}`} />
                            <Tooltip cursor={{ fill: 'var(--color-badge-bg)' }} contentStyle={{ borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'none', fontWeight: 'bold', color: 'var(--color-text-primary)' }} />
                            <Bar dataKey="value" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="xl:col-span-1 bg-surface p-6 rounded-2xl border border-border shadow-none flex flex-col">
                <h3 className="text-lg font-bold text-text-primary tracking-tight mb-6">Ringkasan Cepat</h3>
                <div className="space-y-4 flex-1">
                    <div className="p-4 bg-badge-bg rounded-xl">
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">Total Transaksi</p>
                        <p className="text-2xl font-black">{report.total_transaksi}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
