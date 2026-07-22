import React from 'react';
import {
  Building2,
  TrendingUp,
  Clock,
  Zap,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  AlertCircle,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Layers,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { TenderStats, Tender } from '../types';
import { formatRupiah, getStatusBadge } from '../services/api';
import { DashboardSkeleton } from './Skeletons';
import { AITenderSuggestionEngine } from './AITenderSuggestionEngine';

import React, { useMemo } from 'react';
import {
  Building2,
  TrendingUp,
  Clock,
  Zap,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  AlertCircle,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Layers,
  Target,
  MapPin,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { TenderStats, Tender } from '../types';
import { formatRupiah, getStatusBadge } from '../services/api';
import { DashboardSkeleton } from './Skeletons';
import { AITenderSuggestionEngine } from './AITenderSuggestionEngine';
import { matchesLocation } from '../utils/locationMatcher';

interface DashboardViewProps {
  stats: TenderStats | null;
  tenders: Tender[];
  selectedLocation?: string | null;
  onSelectLocation?: (locationName: string | null) => void;
  onSelectTender: (tender: Tender) => void;
  onNavigateTab: (tab: string, filterParam?: { category?: string; status?: string }) => void;
}

const CATEGORY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
const STATUS_COLORS = ['#38bdf8', '#818cf8', '#34d399', '#fbbf24', '#c084fc', '#94a3b8'];

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  tenders,
  selectedLocation = null,
  onSelectLocation,
  onSelectTender,
  onNavigateTab
}) => {
  if (!stats) {
    return <DashboardSkeleton />;
  }

  // Smart location filtered tenders for the dashboard
  const displayTenders = useMemo(() => {
    if (!selectedLocation || selectedLocation === 'ALL' || selectedLocation === 'Semua Lokasi') {
      return tenders;
    }
    return tenders.filter((t) => matchesLocation(t, selectedLocation));
  }, [tenders, selectedLocation]);

  // Compute dynamic stats for displayTenders when location filter is active
  const activeStats = useMemo(() => {
    if (!selectedLocation || selectedLocation === 'ALL' || selectedLocation === 'Semua Lokasi') {
      return stats;
    }
    const totalTenders = displayTenders.length;
    const totalValueHPS = displayTenders.reduce((acc, t) => acc + t.nilaiHPS, 0);

    const now = Date.now();
    const closingSoonCount = displayTenders.filter((t) => {
      const closingDate = new Date(t.tanggalTutup);
      const diffDays = (closingDate.getTime() - now) / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 10 && t.status !== 'selesai' && t.status !== 'batal';
    }).length;

    const newTodayCount = displayTenders.filter((t) => {
      const bukaDate = new Date(t.tanggalBuka);
      const diffDays = (now - bukaDate.getTime()) / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 7;
    }).length;

    // Categories aggregation
    const catMap = new Map<string, { count: number; totalHps: number }>();
    displayTenders.forEach((t) => {
      const cat = t.kategori || 'Lainnya';
      const cur = catMap.get(cat) || { count: 0, totalHps: 0 };
      catMap.set(cat, { count: cur.count + 1, totalHps: cur.totalHps + t.nilaiHPS });
    });
    const byCategory = Array.from(catMap.entries()).map(([name, val]) => ({
      name,
      count: val.count,
      totalHps: val.totalHps
    }));

    // Instansi aggregation
    const instMap = new Map<string, { count: number; totalHps: number }>();
    displayTenders.forEach((t) => {
      const inst = t.instansi || 'Lainnya';
      const cur = instMap.get(inst) || { count: 0, totalHps: 0 };
      instMap.set(inst, { count: cur.count + 1, totalHps: cur.totalHps + t.nilaiHPS });
    });
    const byInstansiTop = Array.from(instMap.entries())
      .map(([instansi, val]) => ({ instansi, count: val.count, totalHps: val.totalHps }))
      .sort((a, b) => b.totalHps - a.totalHps)
      .slice(0, 5);

    return {
      totalTenders,
      totalValueHPS,
      closingSoonCount,
      newTodayCount,
      byCategory,
      byInstansiTop,
      byStatus: stats.byStatus
    };
  }, [stats, displayTenders, selectedLocation]);

  // Filter tenders closing soon (<10 days) from displayTenders
  const closingSoonTenders = displayTenders
    .filter((t) => {
      const closingDate = new Date(t.tanggalTutup);
      const diffDays = (closingDate.getTime() - Date.now()) / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 10 && t.status !== 'selesai' && t.status !== 'batal';
    })
    .slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Active Location Filter Header Banner */}
      {selectedLocation && selectedLocation !== 'ALL' && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl shrink-0">
              <MapPin className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-medium">Filter Wilayah Terpasang:</span>
                <span className="font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 text-sm">
                  {selectedLocation}
                </span>
              </div>
              <p className="text-slate-400 mt-0.5 text-[11px]">
                Menampilkan data {displayTenders.length} paket tender aktif untuk wilayah {selectedLocation} (SPSE Node & LPSE Daerah).
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectLocation && onSelectLocation(null)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5 text-rose-400" />
            <span>Reset Filter Lokasi</span>
          </button>
        </div>
      )}

      {/* Hero Welcome & Quick Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Data Real-Time SPSE LPSE
              </span>
              <span className="text-xs text-slate-400">
                {selectedLocation ? `Lokasi: ${selectedLocation}` : 'Diperbarui otomatis tiap 2 jam'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Portal Pantau & Analisis Tender Pengadaan Indonesia
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {selectedLocation
                ? `Menampilkan analisis intelijen tender pengadaan barang/jasa untuk wilayah ${selectedLocation}.`
                : 'Memudahkan vendor dan penyedia jasa dalam menemukan peluang bisnis, memantau perubahan jadwal, dan menganalisis nilai HPS secara akurat.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab('competitors')}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 cursor-pointer border border-indigo-400/30"
            >
              <Target className="w-4 h-4 text-amber-300" />
              <span>Analisis Kompetitor</span>
            </button>
            <button
              onClick={() => onNavigateTab('tenders')}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg hover:shadow-emerald-500/20 cursor-pointer"
            >
              <span>Jelajahi Tender</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="/api/export/csv"
              download
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3.5 py-2.5 rounded-xl text-sm border border-slate-700 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Ekspor CSV</span>
            </a>
          </div>
        </div>
      </div>

      {/* AI Tender Suggestion Engine Section */}
      <AITenderSuggestionEngine tenders={displayTenders} onSelectTender={onSelectTender} />

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Active Tenders */}
        <div
          onClick={() => onNavigateTab('tenders')}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/50 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Total Tender Aktif
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {activeStats.totalTenders} <span className="text-xs font-normal text-slate-400">Paket</span>
          </div>
          <p className="text-xs text-blue-400 mt-2 font-medium flex items-center gap-1">
            <span>{selectedLocation ? `Wilayah ${selectedLocation}` : 'Tersebar di 680+ LPSE'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Card 2: Total HPS Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Total Nilai HPS / Anggaran
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {formatRupiah(activeStats.totalValueHPS)}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Akumulasi nilai HPS tender aktif
          </p>
        </div>

        {/* Card 3: Closing Soon */}
        <div
          onClick={() => onNavigateTab('tenders', { status: 'upload_penawaran' })}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Segera Ditutup (&lt;10 Hari)
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-400">
            {activeStats.closingSoonCount} <span className="text-xs font-normal text-slate-400">Paket</span>
          </div>
          <p className="text-xs text-amber-400 mt-2 font-medium flex items-center gap-1">
            <span>Periksa tenggat penawaran</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Card 4: New Today */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Tender Baru Diumumkan
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-400">
            {activeStats.newTodayCount} <span className="text-xs font-normal text-slate-400">Paket</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Paket pengadaan baru minggu ini
          </p>
        </div>
      </div>

      {/* Category Shortcut Chips */}
      {activeStats.byCategory.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">Filter Cepat Kategori:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {activeStats.byCategory.map((cat) => (
              <button
                key={cat.name}
                onClick={() => onNavigateTab('tenders', { category: cat.name })}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>{cat.name}</span>
                <span className="px-1.5 py-0.2 rounded-md bg-slate-950 text-emerald-400 font-bold text-[10px]">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Charts Grid */}
      {activeStats.byCategory.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Category HPS Distribution */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  Distribusi Nilai HPS per Kategori
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Total estimasi anggaran pengadaan per kategori (IDR)
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activeStats.byCategory.map((c) => ({
                    name: c.name.length > 18 ? c.name.substring(0, 16) + '...' : c.name,
                    fullName: c.name,
                    totalHpsMiliar: Math.round(c.totalHps / 1000000000)
                  }))}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} interval={0} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} unit=" B" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                    formatter={(value: any) => [`Rp ${value} Miliar`, 'Total HPS']}
                    labelFormatter={(label, payload) => payload[0]?.payload?.fullName || label}
                  />
                  <Bar dataKey="totalHpsMiliar" radius={[6, 6, 0, 0]}>
                    {activeStats.byCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Top Agencies Budget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-blue-400" />
                  Instansi Pemilik Anggaran Terbesar
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instansi dengan total HPS tertinggi
                </p>
              </div>
            </div>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeStats.byInstansiTop.map((inst) => ({
                      name: inst.instansi.length > 25 ? inst.instansi.substring(0, 22) + '...' : inst.instansi,
                      fullName: inst.instansi,
                      value: Math.round(inst.totalHps / 1000000000)
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {activeStats.byInstansiTop.map((_, index) => (
                      <Cell key={`cell-inst-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                    formatter={(val: any) => [`Rp ${val} Miliar`, 'Nilai HPS']}
                    labelFormatter={(label, payload) => payload[0]?.payload?.fullName || label}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Urgent Closing Soon Tenders Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Tender Aktif & Segera Ditutup
              {selectedLocation && (
                <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {selectedLocation}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Paket tender yang sedang menerima dokumen penawaran dalam beberapa hari mendatang
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('tenders')}
            className="text-xs text-emerald-400 hover:underline font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua ({displayTenders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {closingSoonTenders.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800">
            <Building2 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-semibold">
              Semua Paket Tender Aktif di {selectedLocation || 'Wilayah Ini'} Tampil Lengkap
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Anda dapat menjelajahi seluruh paket tender aktif melalui menu Jelajahi Tender.
            </p>
            <button
              onClick={() => onNavigateTab('tenders')}
              className="mt-3 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <span>Jelajahi {displayTenders.length} Tender Wilayah Ini</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {closingSoonTenders.map((tender) => {
              const badge = getStatusBadge(tender.status);
              return (
                <div
                  key={tender.id}
                  onClick={() => onSelectTender(tender)}
                  className="bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-4 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-amber-500/10 text-amber-300 border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Tutup: {tender.tanggalTutup}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-2 mb-1.5">
                      {tender.judul}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{tender.lokasi}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Nilai HPS:</span>
                      <span className="font-bold text-emerald-400">{formatRupiah(tender.nilaiHPS)}</span>
                    </div>

                    <span className="text-emerald-400 font-semibold group-hover:underline flex items-center gap-1">
                      Detail <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

