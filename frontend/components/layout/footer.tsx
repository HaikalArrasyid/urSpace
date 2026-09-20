import Link from 'next/link';
import { MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 lg:gap-8">
        
        {/* Brand & Social */}
        <div className="w-full md:w-1/4">
          <Link href="/" className="flex items-center gap-2 group mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-text-primary font-black text-lg transition-transform group-hover:scale-105 shadow-sm">
              u.
            </div>
            <span className="font-black text-xl tracking-tight text-text-primary transition-colors">urSpace</span>
          </Link>
          <p className="text-text-secondary text-sm font-medium leading-relaxed mb-6">
            Tingkatkan produktivitasmu dengan menyewa meja & ruang kerja ideal hanya dalam hitungan detik. Ekosistem ruang kerja fleksibel, buka 24/7.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-badge-bg border border-border flex items-center justify-center text-text-secondary hover:bg-primary hover:text-text-primary hover:border-primary transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-badge-bg border border-border flex items-center justify-center text-text-secondary hover:bg-primary hover:text-text-primary hover:border-primary transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-badge-bg border border-border flex items-center justify-center text-text-secondary hover:bg-primary hover:text-text-primary hover:border-primary transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="w-full sm:w-auto">
          <h4 className="font-bold text-text-primary mb-5 text-sm tracking-widest uppercase">Eksplorasi</h4>
          <ul className="space-y-3 text-sm text-text-secondary font-medium">
            <li><Link href="/spaces" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-300">Katalog Ruang</Link></li>
            <li><Link href="/#opsi-sewa" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-300">Opsi Sewa</Link></li>
            <li><Link href="/history" className="hover:text-primary transition-colors hover:translate-x-1 inline-block transform duration-300">Cek Tiket Reservasi</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="w-full sm:w-auto">
          <h4 className="font-bold text-text-primary mb-5 text-sm tracking-widest uppercase">Perusahaan</h4>
          <ul className="space-y-3 text-sm text-text-secondary font-medium">
            <li><span className="hover:text-primary transition-colors cursor-pointer hover:translate-x-1 inline-block transform duration-300">Tentang Kami</span></li>
            <li><span className="hover:text-primary transition-colors cursor-pointer hover:translate-x-1 inline-block transform duration-300">Karir</span></li>
            <li><span className="hover:text-primary transition-colors cursor-pointer hover:translate-x-1 inline-block transform duration-300">Blog</span></li>
            <li><span className="hover:text-primary transition-colors cursor-pointer hover:translate-x-1 inline-block transform duration-300">Kontak</span></li>
          </ul>
        </div>

        {/* Links Column 3: Contact */}
        <div className="w-full md:w-1/4">
          <h4 className="font-bold text-text-primary mb-5 text-sm tracking-widest uppercase">Hubungi Kami</h4>
          <ul className="space-y-4 text-sm text-text-secondary font-medium">
             <li className="flex items-start gap-3">
               <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
               <span>+62 811-2233-4455 <br/> <span className="text-xs opacity-70">(Mon-Fri, 9am-6pm)</span></span>
             </li>
             <li className="flex items-start gap-3">
               <Mail className="w-4 h-4 text-primary shrink-0" />
               <span>hello@urspace.com</span>
             </li>
             <li className="flex items-start gap-3">
               <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
               <span className="leading-relaxed">Jl. Danau Ranau, Sawojajar, Kota Malang, Jawa Timur</span>
             </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-xs font-semibold text-text-secondary">
        <p className="flex gap-4">
          <span>© {new Date().getFullYear()} urSpace Technologies.</span>
          <span className="hidden sm:inline">|</span>
          <span className="hover:text-text-primary cursor-pointer transition-colors">Syarat & Ketentuan</span>
          <span className="hidden sm:inline">|</span>
          <span className="hover:text-text-primary cursor-pointer transition-colors">Kebijakan Privasi</span>
        </p>
        <p className="mt-4 md:mt-0 px-3 py-1.5 bg-badge-bg rounded-md border border-border shadow-sm">
          Protected by urSpace Security
        </p>
      </div>
    </footer>
  );
}
