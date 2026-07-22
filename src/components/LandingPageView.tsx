import React, { useState } from 'react';
import {
  Search,
  Check,
  ChevronRight,
  Play,
  ArrowRight,
  BarChart3,
  Globe2,
  ShieldCheck,
  Zap,
  Users,
  Building2,
  Bell,
  Cpu,
  Lock,
  Layers,
  FileText,
  Star,
  MapPin,
  Clock,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Radio,
  ExternalLink
} from 'lucide-react';
import { SubscriptionTier, SUBSCRIPTION_TIERS } from '../data/mockTenants';
import { formatRupiah } from '../services/api';
import { VendorLeaderboardMarquee } from './VendorLeaderboardMarquee';

interface LandingPageViewProps {
  onEnterApp: (tab?: string) => void;
  onOpenAuthModal?: (mode: 'login' | 'signup', tier?: SubscriptionTier) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onEnterApp, onOpenAuthModal }) => {
  const [activeNav, setActiveNav] = useState('beranda');
  const [demoTab, setDemoTab] = useState<'map' | 'table'>('map');

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
      
      {/* ========================================================= */}
      {/* TOP NAVIGATION BAR (Matching Mockup Header) */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onEnterApp('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <Radio className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                LPSE Radar Pro
                <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 px-1.5 py-0.2 rounded">
                  PRO
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">By PT Fas Technology Solutions</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <button
              onClick={() => scrollToSection('hero')}
              className={`hover:text-white transition-colors ${activeNav === 'beranda' ? 'text-white font-bold' : ''}`}
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection('fitur')}
              className={`hover:text-white transition-colors ${activeNav === 'fitur' ? 'text-white font-bold' : ''}`}
            >
              Fitur
            </button>
            <button
              onClick={() => scrollToSection('harga')}
              className={`hover:text-white transition-colors ${activeNav === 'harga' ? 'text-white font-bold' : ''}`}
            >
              Harga
            </button>
            <button
              onClick={() => scrollToSection('keunggulan')}
              className="hover:text-white transition-colors"
            >
              Keunggulan
            </button>
            <button
              onClick={() => scrollToSection('tentang')}
              className="hover:text-white transition-colors"
            >
              Tentang Kami
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (onOpenAuthModal) onOpenAuthModal('login');
                else onEnterApp('dashboard');
              }}
              className="px-4 py-2 text-xs font-bold text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 rounded-xl transition-all cursor-pointer"
            >
              Masuk
            </button>

            <button
              onClick={() => {
                if (onOpenAuthModal) onOpenAuthModal('signup', 'FREE');
                else onEnterApp('dashboard');
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-extrabold rounded-xl transition-all shadow-lg shadow-rose-600/30 hover:scale-[1.02] cursor-pointer flex items-center gap-2"
            >
              <span>Daftar Akun Gratis</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* HERO SECTION (Faithful to Mockup Visual Layout) */}
      {/* ========================================================= */}
      <section id="hero" className="relative pt-12 pb-24 overflow-hidden bg-slate-950">
        
        {/* Background Radial Glow & Cyan Grid Mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-rose-500/10 via-sky-500/5 to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-5 space-y-8">
              
              <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-full px-3.5 py-1.5 text-xs text-rose-300 shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold">Dipercaya 1.500+ Vendor & Kontraktor</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Pantau, Analisis, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-rose-300">
                  Menangkan Tender
                </span> <br />
                dengan <span className="text-rose-500">LPSE Radar Pro</span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
                Akses ribuan tender dari seluruh LPSE Indonesia secara real-time, kelola tim, dan tingkatkan peluang kemenangan Anda dalam satu platform canggih.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    if (onOpenAuthModal) onOpenAuthModal('signup', 'FREE');
                    else onEnterApp('tenders');
                  }}
                  className="px-7 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm rounded-xl transition-all shadow-xl shadow-rose-600/40 hover:scale-[1.02] cursor-pointer flex items-center gap-2"
                >
                  Daftar Paket Free / Gratis
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onEnterApp('dashboard')}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-100 font-bold text-sm rounded-xl border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                >
                  <Play className="w-4 h-4 text-rose-400 fill-rose-400" />
                  Lihat Demo
                </button>
              </div>

              {/* Feature Highlights Badges (Bottom Left Stats in Mockup) */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-2xl font-black font-mono text-white tracking-tight">5.200+</div>
                  <div className="text-[11px] text-slate-400 leading-tight">Data Tender Real-Time Hari Ini</div>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-black font-mono text-white tracking-tight">200+</div>
                  <div className="text-[11px] text-slate-400 leading-tight">Instansi & LPSE Terhubung</div>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-black font-mono text-white tracking-tight">1.500+</div>
                  <div className="text-[11px] text-slate-400 leading-tight">Perusahaan & Vendor Terdaftar</div>
                </div>
              </div>

            </div>

            {/* Right Hero Laptop Mockup (Pixel-Perfect to Image) */}
            <div className="lg:col-span-7 relative">
              
              {/* Laptop Shell frame */}
              <div className="relative mx-auto max-w-[680px]">
                
                {/* Glow behind laptop */}
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/20 via-sky-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-75"></div>

                {/* Laptop Bezel */}
                <div className="relative bg-slate-900 border-4 border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-2">
                  
                  {/* Laptop Web Camera Dot */}
                  <div className="w-full bg-slate-950 py-1 flex items-center justify-center gap-1.5 border-b border-slate-800">
                    <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                  </div>

                  {/* SCREEN INTERFACE DISPLAY (Inside Mockup) */}
                  <div className="bg-slate-950 text-slate-100 rounded-xl overflow-hidden border border-slate-800 text-xs shadow-inner">
                    
                    {/* Inner Screen Topbar */}
                    <div className="bg-slate-900 p-2.5 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-xs flex items-center gap-1">
                          <Radio className="w-3.5 h-3.5 text-rose-500" /> LPSE Radar Pro
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
                          v3.8 Live
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Globe2 className="w-3 h-3 text-emerald-400" /> Seluruh Indonesia
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-300 font-semibold bg-slate-800 px-2 py-1 rounded-lg">
                          <div className="w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
                            AP
                          </div>
                          <span>Andi Pratama</span>
                        </div>
                      </div>
                    </div>

                    {/* Inner Screen Layout Grid */}
                    <div className="grid grid-cols-12 min-h-[380px]">
                      
                      {/* Left Mini Sidebar */}
                      <div className="col-span-3 bg-slate-900/60 p-2 border-r border-slate-800/80 space-y-1 text-[11px]">
                        <div className="p-1.5 bg-rose-600 text-white font-bold rounded-lg flex items-center gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5" /> Dashboard
                        </div>
                        <div className="p-1.5 text-slate-400 hover:text-slate-200 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" /> Tender
                        </div>
                        <div className="p-1.5 text-slate-400 hover:text-slate-200 flex items-center gap-1.5">
                          <Bell className="w-3.5 h-3.5" /> Notifikasi
                        </div>
                        <div className="p-1.5 text-slate-400 hover:text-slate-200 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5" /> Analitik
                        </div>
                        <div className="p-1.5 text-slate-400 hover:text-slate-200 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" /> Instansi
                        </div>
                        <div className="p-1.5 text-slate-400 hover:text-slate-200 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> Perusahaan
                        </div>
                      </div>

                      {/* Right Main Screen Dashboard Content */}
                      <div className="col-span-9 p-3 space-y-3 bg-slate-950">
                        
                        {/* Map & Stats Widget Row */}
                        <div className="grid grid-cols-2 gap-2">
                          
                          {/* Map Card */}
                          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-slate-200">Peta Distribusi Tender</span>
                              <span className="text-emerald-400 font-mono">680 LPSE</span>
                            </div>
                            
                            <div className="h-24 bg-slate-950 rounded border border-slate-800/80 relative overflow-hidden flex items-center justify-center">
                              {/* Simulated Map Pin Dots */}
                              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:8px_8px] opacity-40"></div>
                              <div className="absolute top-4 left-6 w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
                              <div className="absolute top-4 left-6 w-2 h-2 rounded-full bg-rose-500"></div>
                              <div className="absolute top-10 left-16 w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
                              <div className="absolute top-10 left-16 w-2 h-2 rounded-full bg-amber-400"></div>
                              <div className="absolute bottom-6 right-10 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                              <div className="absolute bottom-6 right-10 w-2 h-2 rounded-full bg-emerald-400"></div>
                              <span className="text-[10px] font-mono text-slate-400 z-10 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                                🗺️ Live Radar Indonesia
                              </span>
                            </div>
                          </div>

                          {/* Stat Card */}
                          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-slate-200">Statistik Tender</span>
                              <span className="text-slate-400">30 Hari</span>
                            </div>
                            <div className="text-lg font-black font-mono text-white">1,248</div>
                            <span className="text-[10px] text-slate-400 block">Total Tender Aktif</span>
                            
                            {/* Bar Chart Simulation */}
                            <div className="h-10 flex items-end gap-1 pt-1">
                              <div className="w-1/6 bg-rose-500/40 h-[40%] rounded-t"></div>
                              <div className="w-1/6 bg-rose-500/60 h-[70%] rounded-t"></div>
                              <div className="w-1/6 bg-rose-500/80 h-[55%] rounded-t"></div>
                              <div className="w-1/6 bg-rose-500 h-[90%] rounded-t"></div>
                              <div className="w-1/6 bg-amber-500 h-[75%] rounded-t"></div>
                              <div className="w-1/6 bg-emerald-500 h-[100%] rounded-t"></div>
                            </div>
                          </div>

                        </div>

                        {/* Recent Tenders Table */}
                        <div className="bg-slate-900/80 rounded-lg border border-slate-800 p-2 space-y-1.5">
                          <span className="font-bold text-[11px] text-slate-200 block">Tender Terbaru Hari Ini</span>
                          <table className="w-full text-[10px] text-left">
                            <thead className="text-slate-500 font-medium border-b border-slate-800">
                              <tr>
                                <th className="p-1">Nama Tender</th>
                                <th className="p-1">Instansi</th>
                                <th className="p-1">Nilai Pagu</th>
                                <th className="p-1">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 text-slate-300">
                              <tr>
                                <td className="p-1 font-semibold text-white truncate max-w-[120px]">Pembangunan Gedung Olahraga</td>
                                <td className="p-1 text-slate-400 truncate max-w-[80px]">Pemprov Jatim</td>
                                <td className="p-1 font-mono text-emerald-400">Rp 45,2 M</td>
                                <td className="p-1"><span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1 py-0.2 rounded">Baru</span></td>
                              </tr>
                              <tr>
                                <td className="p-1 font-semibold text-white truncate max-w-[120px]">Peningkatan Rumah Sakit</td>
                                <td className="p-1 text-slate-400 truncate max-w-[80px]">Kemenkes RI</td>
                                <td className="p-1 font-mono text-emerald-400">Rp 12,8 M</td>
                                <td className="p-1"><span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1 py-0.2 rounded">Baru</span></td>
                              </tr>
                              <tr>
                                <td className="p-1 font-semibold text-white truncate max-w-[120px]">Pemeliharaan Jalan Nasional</td>
                                <td className="p-1 text-slate-400 truncate max-w-[80px]">PUPR Jateng</td>
                                <td className="p-1 font-mono text-emerald-400">Rp 26,6 M</td>
                                <td className="p-1"><span className="bg-amber-500/20 text-amber-400 text-[9px] px-1 py-0.2 rounded">Proses</span></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                {/* Laptop Base Stand */}
                <div className="relative mx-auto w-3/4 h-3.5 bg-gradient-to-b from-slate-700 to-slate-900 rounded-b-xl border-t border-slate-600 shadow-xl flex items-center justify-center">
                  <div className="w-16 h-1 bg-slate-800 rounded-full"></div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* TOP VENDOR LEADERBOARD SLIDER */}
      {/* ========================================================= */}
      <VendorLeaderboardMarquee onVendorClick={onEnterApp} />

      {/* ========================================================= */}
      {/* FEATURES SECTION (Fitur-Fitur Unggulan) */}
      {/* ========================================================= */}
      <section id="fitur" className="py-20 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              Fitur Lengkap Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Semua yang Anda Butuhkan untuk Memenangkan Tender
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Platform LPSE Radar Pro dirancang khusus oleh PT Fas Technology Solutions dengan integrasi scraping pyproc otomatis dan fitur analitik cerdas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 p-6 rounded-2xl space-y-4 transition-all hover:scale-[1.02] shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Scraper Real-Time 680+ LPSE</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Menghubungkan langsung ke seluruh server LPSE Kementerian, Provinsi, Kabupaten/Kota se-Indonesia tanpa delay.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl space-y-4 transition-all hover:scale-[1.02] shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Analitik HPS & Prediksi Pemenang</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Hitung persentase penurunan HPS ideal dan analisis histori pemenang tender dari kompetitor Anda.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl space-y-4 transition-all hover:scale-[1.02] shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Manajemen Tim & Berkas</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Bagi tugas penyusunan dokumen penawaran ke tim internal dengan hak akses terisolasi dan notifikasi deadline.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl space-y-4 transition-all hover:scale-[1.02] shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Notifikasi WhatsApp & Email</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Dapatkan pemberitahuan instan saat ada tender baru sesuai bidang usaha Anda atau jadwal penutupan yang mendekat.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl space-y-4 transition-all hover:scale-[1.02] shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">RESTful Open API & Webhooks ERP</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Integrasikan data tender LPSE langsung ke sistem SAP, Odoo, atau CRM perusahaan Anda dengan aman.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 p-6 rounded-2xl space-y-4 transition-all hover:scale-[1.02] shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-all">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Keamanan & ISO 27001 Ready</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Isolasi data multi-tenant dengan Row-Level Security PostgreSQL dan enkripsi AES-256 untuk kerahasiaan berkas.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* PRICING SECTION (Harga Paket Berlangganan) */}
      {/* ========================================================= */}
      <section id="harga" className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              Pilihan Paket SaaS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Investasi Terbaik untuk Pertumbuhan Bisnis Anda
            </h2>
            <p className="text-slate-400 text-sm">
              Tanpa biaya tersembunyi. Batalkan atau tingkatkan paket kapan saja.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SUBSCRIPTION_TIERS.map((tier) => {
              const isFree = tier.tier === 'FREE';
              const isBusiness = tier.tier === 'BUSINESS';

              return (
                <div
                  key={tier.tier}
                  className={`bg-slate-900 border rounded-2xl p-6 flex flex-col justify-between space-y-6 relative transition-all hover:scale-[1.01] ${
                    isBusiness
                      ? 'border-rose-500 shadow-2xl shadow-rose-500/20 ring-2 ring-rose-500/40'
                      : isFree
                      ? 'border-sky-500/60 shadow-xl shadow-sky-500/10 ring-1 ring-sky-500/30'
                      : 'border-slate-800'
                  }`}
                >
                  {isFree && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-sky-500 text-slate-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                      GRATIS SELAMANYA
                    </span>
                  )}

                  {isBusiness && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                      PALING POPULER
                    </span>
                  )}

                  <div className="space-y-5">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block mb-1">{tier.target}</span>
                      <h3 className="text-lg font-black text-white">{tier.name}</h3>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80">
                      <span className={`text-xl font-black font-mono block ${isFree ? 'text-sky-400' : 'text-rose-400'}`}>
                        {tier.priceLabel}
                      </span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-300">
                      {tier.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isFree ? 'text-sky-400' : 'text-emerald-400'}`} />
                          <span className="text-[11px] leading-snug">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      if (onOpenAuthModal) onOpenAuthModal('signup', tier.tier);
                      else onEnterApp('dashboard');
                    }}
                    className={`w-full py-3 font-extrabold text-xs rounded-xl transition-all shadow-lg cursor-pointer ${
                      isFree
                        ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/20'
                        : isBusiness
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    {isFree ? 'Mulai Gratis Sekarang' : `Pilih Paket ${tier.name}`}
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* FINAL CTA BANNER */}
      {/* ========================================================= */}
      <section className="py-20 bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-t border-rose-500/30 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Siap Memenangkan Tender Berikutnya?
          </h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Bergabunglah dengan ribuan kontraktor & vendor yang menggunakan LPSE Radar Pro untuk menemukan peluang tender bernilai miliaran rupiah setiap hari.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onEnterApp('tenders')}
              className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-black text-sm rounded-xl transition-all shadow-xl shadow-rose-600/40 hover:scale-[1.02] cursor-pointer flex items-center gap-2"
            >
              Coba Gratis 14 Hari Sekarang
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-white font-extrabold text-base">
                <Radio className="w-5 h-5 text-rose-500" />
                LPSE Radar Pro
              </div>
              <p className="text-slate-400 max-w-md">
                Produk SaaS Intelijen Pengadaan dikembangkan dan dikelola secara komersial oleh <strong className="text-slate-200">PT Fas Technology Solutions</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button onClick={() => onEnterApp('dashboard')} className="hover:text-rose-400">
                Dashboard App
              </button>
              <button onClick={() => onEnterApp('tenders')} className="hover:text-rose-400">
                Cari Tender
              </button>
              <button onClick={() => onEnterApp('pyproc-docs')} className="hover:text-rose-400">
                API & pyproc
              </button>
              <button onClick={() => onEnterApp('saas-portal')} className="hover:text-rose-400 font-bold text-emerald-400">
                Portal PT Fas
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} PT Fas Technology Solutions. All rights reserved. Mematuhi UU KIP No. 14/2008.
            </div>
            <div>
              Platform Multi-Tenant SaaS Engine
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
