import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  BarChart3,
  Building2,
  Trophy,
  PieChart as PieChartIcon,
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  Legend
} from 'recharts';
import { VendorRanking, TenderStats } from '../types';
import { api, formatRupiah, formatFullRupiah } from '../services/api';
import { AnalyticsSkeleton } from './Skeletons';

export const AnalyticsView: React.FC = () => {
  const [vendorRankings, setVendorRankings] = useState<VendorRanking[]>([]);
  const [stats, setStats] = useState<TenderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendorSearch, setVendorSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vData, sData] = await Promise.all([
        api.getVendorRankings(),
        api.getStatistics()
      ]);
      setVendorRankings(vData);
      setStats(sData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendorRankings.filter(
    (v) =>
      (v.name || '').toLowerCase().includes((vendorSearch || '').toLowerCase()) ||
      (v.primaryCategory || '').toLowerCase().includes((vendorSearch || '').toLowerCase()) ||
      (v.npwp || '').includes(vendorSearch || '')
  );

  if (loading || !stats) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Intelijen Pasar Pengadaan Nasional
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Analisis Tren Pengadaan & Peringkat Vendor LPSE
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Laporan analitis historis tren anggaran pengadaan pemerintah serta rekam jejak penyedia barang/jasa pemenang tender terbesar.
          </p>
        </div>
      </div>

      {/* Chart 1: Monthly Procurement Volume & Budget Trend */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Tren Volume Tender & Total Anggaran Bulanan (2026)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Perkembangan akumulasi nilai HPS (Miliar IDR) dan jumlah paket pengadaan per bulan
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.monthlyTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} unit=" B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px'
                }}
                formatter={(val: any, name: any) => [
                  name === 'hpsMiliar' ? `Rp ${val} Miliar` : `${val} Paket`,
                  name === 'hpsMiliar' ? 'Total HPS' : 'Jumlah Paket'
                ]}
              />
              <Area
                type="monotone"
                dataKey="hpsMiliar"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorHps)"
                name="Total HPS (Miliar IDR)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vendor Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Papan Peringkat Vendor Pemenang Tender Teratas
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Peringkat perusahaan/kontraktor dengan akumulasi nilai pemenangan tender terbesar di Indonesia
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={vendorSearch}
              onChange={(e) => setVendorSearch(e.target.value)}
              placeholder="Cari nama vendor / NPWP..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 text-center">Peringkat</th>
                <th className="p-3.5">Nama Perusahaan / Vendor</th>
                <th className="p-3.5">Kategori Utama</th>
                <th className="p-3.5 text-center">Total Kemenangan</th>
                <th className="p-3.5 text-right">Total Nilai Kontrak</th>
                <th className="p-3.5">Instansi Pelanggan Utama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.rank} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 text-center font-extrabold text-sm">
                    {vendor.rank === 1 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-extrabold">
                        1
                      </span>
                    ) : vendor.rank === 2 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300/20 text-slate-200 border border-slate-400/40 font-extrabold">
                        2
                      </span>
                    ) : vendor.rank === 3 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/40 font-extrabold">
                        3
                      </span>
                    ) : (
                      <span className="text-slate-400">#{vendor.rank}</span>
                    )}
                  </td>

                  <td className="p-3.5">
                    <span className="font-bold text-slate-100 text-sm block">{vendor.name}</span>
                    <span className="font-mono text-slate-400 text-[11px]">NPWP: {vendor.npwp}</span>
                  </td>

                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-emerald-400 font-semibold text-[11px]">
                      {vendor.primaryCategory}
                    </span>
                  </td>

                  <td className="p-3.5 text-center font-extrabold text-emerald-400 text-sm">
                    {vendor.totalWins} <span className="text-slate-400 font-normal text-xs">Paket</span>
                  </td>

                  <td className="p-3.5 text-right font-extrabold text-slate-100 text-sm">
                    {formatFullRupiah(vendor.totalContractValue)}
                  </td>

                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1">
                      {vendor.topAgencies.map((agency, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[10px]">
                          {agency}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
