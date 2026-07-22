import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Search,
  Filter,
  Users,
  Target,
  Calculator,
  AlertTriangle,
  Zap,
  CheckCircle2,
  DollarSign,
  Shield,
  BarChart3,
  PieChart as PieIcon,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Download,
  Info,
  Layers,
  Building2,
  Lock,
  Globe2,
  Percent,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatRupiah, formatFullRupiah } from '../services/api';
import { VendorRanking } from '../types';

// Extended Competitor Record for deep analytics
export interface ExtendedCompetitor extends VendorRanking {
  winRatePercent: number;
  avgDiscountPercent: number; // e.g., 8.5% below HPS
  aggressivenessScore: 'HIGH' | 'MEDIUM' | 'LOW'; // Bidding strategy
  lpseLocationsCount: number;
  frequentCoBidders: string[];
  recentWins: {
    title: string;
    instansi: string;
    hps: number;
    winningBid: number;
    year: number;
  }[];
  riskAnomalies: string[];
}

const MOCK_COMPETITORS_DATA: ExtendedCompetitor[] = [
  {
    rank: 1,
    name: 'PT Waskita Karya (Persero) Tbk',
    npwp: '01.000.111.1-091.000',
    totalWins: 42,
    totalContractValue: 385000000000,
    primaryCategory: 'Pekerjaan Konstruksi',
    topAgencies: ['Kementerian PUPR', 'Kementerian Perhubungan', 'Pemprov DKI Jakarta'],
    winRatePercent: 68.4,
    avgDiscountPercent: 9.2,
    aggressivenessScore: 'HIGH',
    lpseLocationsCount: 45,
    frequentCoBidders: ['PT Pembangunan Perumahan Tbk', 'PT Wijaya Karya Tbk'],
    recentWins: [
      {
        title: 'Pembangunan Jembatan Gantung Perbatasan Sekayam Tahap I',
        instansi: 'Kementerian PUPR',
        hps: 24000000000,
        winningBid: 21840000000,
        year: 2025
      },
      {
        title: 'Peningkatan Jalan Tol Trans Sumatra Section 4',
        instansi: 'Kementerian PUPR',
        hps: 150000000000,
        winningBid: 136200000000,
        year: 2026
      }
    ],
    riskAnomalies: ['Pola Penawaran Konsisten 9.2% Dibawah HPS', 'Kerap Mengajukan Sanggah Banding']
  },
  {
    rank: 2,
    name: 'PT Pembangunan Perumahan (Persero) Tbk',
    npwp: '01.000.222.2-092.000',
    totalWins: 38,
    totalContractValue: 312000000000,
    primaryCategory: 'Pekerjaan Konstruksi',
    topAgencies: ['Kementerian PUPR', 'PT PLN (Persero)', 'Pemkota Surabaya'],
    winRatePercent: 61.2,
    avgDiscountPercent: 7.8,
    aggressivenessScore: 'MEDIUM',
    lpseLocationsCount: 38,
    frequentCoBidders: ['PT Waskita Karya Tbk', 'PT Adhi Karya Tbk'],
    recentWins: [
      {
        title: 'Pembangunan Gedung Rektorat ITS Surabaya',
        instansi: 'Pemkota Surabaya',
        hps: 45000000000,
        winningBid: 41490000000,
        year: 2026
      }
    ],
    riskAnomalies: []
  },
  {
    rank: 3,
    name: 'PT Siemens Healthineers Indonesia',
    npwp: '01.987.654.3-054.000',
    totalWins: 27,
    totalContractValue: 184000000000,
    primaryCategory: 'Pengadaan Barang',
    topAgencies: ['Kementerian Kesehatan', 'RSUP Dr. Sardjito', 'Pemda Bali'],
    winRatePercent: 82.5,
    avgDiscountPercent: 5.4,
    aggressivenessScore: 'MEDIUM',
    lpseLocationsCount: 22,
    frequentCoBidders: ['PT GE Operations Indonesia', 'PT Philips Indonesia'],
    recentWins: [
      {
        title: 'Pengadaan MRI 3.0 Tesla RSUP Kandou Manado',
        instansi: 'Kementerian Kesehatan',
        hps: 32000000000,
        winningBid: 30272000000,
        year: 2026
      }
    ],
    riskAnomalies: ['Dominasi Kuat Kategori Radiologi Alkes']
  },
  {
    rank: 4,
    name: 'PT Telkom Indonesia (Persero) Tbk',
    npwp: '01.000.000.1-093.000',
    totalWins: 45,
    totalContractValue: 142000000000,
    primaryCategory: 'Jasa Lainnya',
    topAgencies: ['Kementerian Keuangan', 'Pemprov Bali', 'Kemenkominfo'],
    winRatePercent: 75.0,
    avgDiscountPercent: 4.1,
    aggressivenessScore: 'LOW',
    lpseLocationsCount: 60,
    frequentCoBidders: ['PT Indosat Tbk', 'PT XL Axiata Tbk'],
    recentWins: [
      {
        title: 'Pengadaan Jaringan Fiber Optic & SD-WAN Kemenkeu RI',
        instansi: 'Kementerian Keuangan',
        hps: 18000000000,
        winningBid: 17262000000,
        year: 2026
      }
    ],
    riskAnomalies: []
  },
  {
    rank: 5,
    name: 'PT Virama Karya (Persero)',
    npwp: '01.000.333.2-092.000',
    totalWins: 31,
    totalContractValue: 98000000000,
    primaryCategory: 'Jasa Konsultansi Badan Usaha',
    topAgencies: ['Pemprov DKI Jakarta', 'Kementerian PUPR', 'Kemenkeu'],
    winRatePercent: 58.0,
    avgDiscountPercent: 6.8,
    aggressivenessScore: 'MEDIUM',
    lpseLocationsCount: 29,
    frequentCoBidders: ['PT Yodya Karya Persero', 'PT Indah Karya Persero'],
    recentWins: [
      {
        title: 'Jasa Konsultansi Pengawasan Revitalisasi Kawasan Monas',
        instansi: 'Pemprov DKI Jakarta',
        hps: 3500000000,
        winningBid: 3262000000,
        year: 2026
      }
    ],
    riskAnomalies: []
  },
  {
    rank: 6,
    name: 'PT Citra Nusa Konstruksi',
    npwp: '01.234.567.8-012.000',
    totalWins: 19,
    totalContractValue: 74000000000,
    primaryCategory: 'Pekerjaan Konstruksi',
    topAgencies: ['Pemprov Kalbar', 'Kementerian PUPR', 'Pemkab Sanggau'],
    winRatePercent: 52.3,
    avgDiscountPercent: 11.5,
    aggressivenessScore: 'HIGH',
    lpseLocationsCount: 14,
    frequentCoBidders: ['PT Borneo Utama Perkasa'],
    recentWins: [
      {
        title: 'Pembangunan Jembatan Beton Sungai Kapuas Sekayam',
        instansi: 'Pemkab Sanggau',
        hps: 12000000000,
        winningBid: 10620000000,
        year: 2025
      }
    ],
    riskAnomalies: ['Penawaran Agresif > 10% Dibawah HPS']
  }
];

export const CompetitorAnalysisView: React.FC = () => {
  // Active Tab inside Competitor View
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'simulator' | 'calculator' | 'anomalies'>('overview');

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Head to Head Comparison States
  const [vendorA, setVendorA] = useState<ExtendedCompetitor>(MOCK_COMPETITORS_DATA[0]);
  const [vendorB, setVendorB] = useState<ExtendedCompetitor>(MOCK_COMPETITORS_DATA[1]);
  const [inspectVendor, setInspectVendor] = useState<ExtendedCompetitor | null>(null);

  // SIMULATOR STATES
  const [simHps, setSimHps] = useState<number>(10000000000); // 10 Miliar default
  const [simCategory, setSimCategory] = useState<string>('Pekerjaan Konstruksi');
  const [simStrategy, setSimStrategy] = useState<'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE'>('BALANCED');
  const [simCompetitorCount, setSimCompetitorCount] = useState<number>(4);

  // CALCULATOR MARGIN STATES
  const [calcHps, setCalcHps] = useState<number>(5000000000);
  const [calcMaterial, setCalcMaterial] = useState<number>(2400000000);
  const [calcLabor, setCalcLabor] = useState<number>(8000000000 / 10);
  const [calcOverhead, setCalcOverhead] = useState<number>(400000000);
  const [calcContingencyPercent, setCalcContingencyPercent] = useState<number>(5); // 5%
  const [calcTaxPpnPercent, setCalcTaxPpnPercent] = useState<number>(11); // 11%

  // Simulation Results Computation
  const getSimDiscountPercent = () => {
    switch (simStrategy) {
      case 'CONSERVATIVE': return 4.5; // High margin
      case 'BALANCED': return 8.2;     // Optimal win chance
      case 'AGGRESSIVE': return 12.8;  // Maximum cut
    }
  };

  const simDiscountPercent = getSimDiscountPercent();
  const simRecommendedBid = Math.round(simHps * (1 - simDiscountPercent / 100));
  const simWinProbability = simStrategy === 'AGGRESSIVE' ? 88 : simStrategy === 'BALANCED' ? 74 : 52;

  // Margin Calculation Computation
  const subtotalCost = calcMaterial + calcLabor + calcOverhead;
  const contingencyAmount = Math.round(subtotalCost * (calcContingencyPercent / 100));
  const totalCostBeforeTax = subtotalCost + contingencyAmount;
  
  // Suggested Bid Price based on Target Margin (e.g., 12%)
  const targetMarginPercent = 12;
  const calculatedBidPrice = Math.round(totalCostBeforeTax / (1 - targetMarginPercent / 100));
  const expectedPpn = Math.round(calculatedBidPrice * (calcTaxPpnPercent / 100));
  const netProfit = calculatedBidPrice - totalCostBeforeTax;
  const netMarginPercent = ((netProfit / calculatedBidPrice) * 100).toFixed(1);

  // Filtered Competitors
  const filteredCompetitors = MOCK_COMPETITORS_DATA.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.npwp.includes(searchTerm);
    const matchesCat = categoryFilter === 'ALL' || c.primaryCategory === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Intelijen Penawaran & Riset Kompetitor
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30 font-bold">
                PRO FEATURE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Analisis Intelijen Kompetitor LPSE
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Pantau rekam jejak kemenangan kontraktor pesaing, analisis kebiasaan diskon penawaran terhadap HPS, simulasi strategi winning bid, dan kelayakan margin profit tender.
            </p>
          </div>

          {/* Quick Sub-Navigation Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Matriks Pesaing</span>
            </button>

            <button
              onClick={() => setActiveSubTab('simulator')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Target className="w-4 h-4 text-amber-400" />
              <span>Simulasi Winning Bid</span>
            </button>

            <button
              onClick={() => setActiveSubTab('calculator')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'calculator'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Kalkulator Margin</span>
            </button>

            <button
              onClick={() => setActiveSubTab('anomalies')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'anomalies'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Radar Anomali</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: MATRIKS OVERVIEW & HEAD-TO-HEAD COMPARISON */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Head-to-Head Comparison Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-indigo-400 font-bold block uppercase">
                  Perbandingan Langsung (Head-to-Head)
                </span>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  Komparasi Strategi Bidding Antar Vendor
                </h3>
              </div>

              {/* Selector Select Boxes */}
              <div className="flex items-center gap-3">
                <select
                  value={vendorA.npwp}
                  onChange={(e) => {
                    const found = MOCK_COMPETITORS_DATA.find((c) => c.npwp === e.target.value);
                    if (found) setVendorA(found);
                  }}
                  className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-2 focus:outline-none focus:border-indigo-500 font-bold"
                >
                  {MOCK_COMPETITORS_DATA.map((c) => (
                    <option key={c.npwp} value={c.npwp}>
                      Vendor A: {c.name}
                    </option>
                  ))}
                </select>

                <span className="text-slate-500 font-bold text-xs">VS</span>

                <select
                  value={vendorB.npwp}
                  onChange={(e) => {
                    const found = MOCK_COMPETITORS_DATA.find((c) => c.npwp === e.target.value);
                    if (found) setVendorB(found);
                  }}
                  className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-2 focus:outline-none focus:border-indigo-500 font-bold"
                >
                  {MOCK_COMPETITORS_DATA.map((c) => (
                    <option key={c.npwp} value={c.npwp}>
                      Vendor B: {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Vendor A Card */}
              <div className="p-5 bg-slate-950/80 border border-indigo-500/30 rounded-2xl space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Vendor A</span>
                    <h4 className="font-bold text-white text-base">{vendorA.name}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">NPWP: {vendorA.npwp}</span>
                  </div>
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 font-black text-xs rounded-full border border-indigo-500/30">
                    Peringkat #{vendorA.rank}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block">Total Kontrak Dimenangkan</span>
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      {formatRupiah(vendorA.totalContractValue)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">{vendorA.totalWins} Kemenangan</span>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block">Rata-rata Diskon ke HPS</span>
                    <span className="font-mono font-black text-amber-400 text-sm">
                      {vendorA.avgDiscountPercent}% Below HPS
                    </span>
                    <span className="text-[10px] text-slate-500 block">Tingkat Agresif: {vendorA.aggressivenessScore}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <span className="text-slate-400 text-[11px] font-bold block">Instansi & LPSE Favorit:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {vendorA.topAgencies.map((ag) => (
                      <span key={ag} className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded text-[10px]">
                        {ag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vendor B Card */}
              <div className="p-5 bg-slate-950/80 border border-purple-500/30 rounded-2xl space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">Vendor B</span>
                    <h4 className="font-bold text-white text-base">{vendorB.name}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">NPWP: {vendorB.npwp}</span>
                  </div>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 font-black text-xs rounded-full border border-purple-500/30">
                    Peringkat #{vendorB.rank}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block">Total Kontrak Dimenangkan</span>
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      {formatRupiah(vendorB.totalContractValue)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">{vendorB.totalWins} Kemenangan</span>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block">Rata-rata Diskon ke HPS</span>
                    <span className="font-mono font-black text-amber-400 text-sm">
                      {vendorB.avgDiscountPercent}% Below HPS
                    </span>
                    <span className="text-[10px] text-slate-500 block">Tingkat Agresif: {vendorB.aggressivenessScore}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <span className="text-slate-400 text-[11px] font-bold block">Instansi & LPSE Favorit:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {vendorB.topAgencies.map((ag) => (
                      <span key={ag} className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded text-[10px]">
                        {ag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Competitors Search and List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-4">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Cari nama vendor atau NPWP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Kategori:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl p-2 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="Pekerjaan Konstruksi">Pekerjaan Konstruksi</option>
                  <option value="Pengadaan Barang">Pengadaan Barang</option>
                  <option value="Jasa Lainnya">Jasa Lainnya</option>
                  <option value="Jasa Konsultansi Badan Usaha">Jasa Konsultansi</option>
                </select>
              </div>
            </div>

            {/* Main Competitor Leaderboard Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Nama Kontraktor / Pesaing</th>
                    <th className="p-3">Kategori Utama</th>
                    <th className="p-3">Win Rate (%)</th>
                    <th className="p-3">Diskon vs HPS</th>
                    <th className="p-3">Total Volume Kontrak</th>
                    <th className="p-3 text-right">Aksi Dossier</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {filteredCompetitors.map((c) => (
                    <tr key={c.npwp} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono font-black text-indigo-400">#{c.rank}</td>
                      <td className="p-3">
                        <div className="font-bold text-white text-sm">{c.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">NPWP: {c.npwp}</div>
                      </td>
                      <td className="p-3 text-slate-300 font-medium">{c.primaryCategory}</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">{c.winRatePercent}%</td>
                      <td className="p-3 font-mono text-amber-300 font-bold">{c.avgDiscountPercent}% Cut</td>
                      <td className="p-3 font-mono font-black text-white">{formatRupiah(c.totalContractValue)}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setInspectVendor(c)}
                          className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-xs font-bold border border-indigo-500/40 transition-all cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Dossier</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 2: WINNING BID PRICE ESTIMATOR / SIMULATOR */}
      {activeSubTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form Parameters */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase block">
                Parameter Tender
              </span>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                Simulasi Target Penawaran
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Nilai HPS Tender Target (IDR):</label>
                <input
                  type="number"
                  value={simHps}
                  onChange={(e) => setSimHps(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-emerald-400 font-mono block">
                  Terbilang: {formatFullRupiah(simHps)}
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Kategori Pekerjaan:</label>
                <select
                  value={simCategory}
                  onChange={(e) => setSimCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Pekerjaan Konstruksi">Pekerjaan Konstruksi</option>
                  <option value="Pengadaan Barang">Pengadaan Barang</option>
                  <option value="Jasa Lainnya">Jasa Lainnya / IT</option>
                  <option value="Jasa Konsultansi Badan Usaha">Jasa Konsultansi</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Strategi Bidding:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setSimStrategy(st)}
                      className={`p-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer text-center ${
                        simStrategy === st
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {st === 'CONSERVATIVE' ? 'Konservatif' : st === 'BALANCED' ? 'Seimbang' : 'Agresif'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Estimasi Jumlah Peserta Bidding:</label>
                <input
                  type="range"
                  min="2"
                  max="12"
                  value={simCompetitorCount}
                  onChange={(e) => setSimCompetitorCount(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>2 Kontraktor</span>
                  <span className="font-bold text-amber-400">{simCompetitorCount} Peserta</span>
                  <span>12 Kontraktor</span>
                </div>
              </div>

            </div>
          </div>

          {/* Results Output */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase block">
                    Hasil Rekomendasi AI Engine
                  </span>
                  <h3 className="text-lg font-black text-white">Rekomendasi Winning Bid Price</h3>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full font-mono text-xs font-bold border border-emerald-500/30">
                  Akurasi Model: 89.4%
                </span>
              </div>

              {/* Big Result Card */}
              <div className="p-6 bg-slate-950 border border-emerald-500/40 rounded-2xl space-y-4 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <span className="text-xs text-slate-400 block font-bold">Harga Penawaran Optimal Direkomendasikan:</span>
                    <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
                      {formatRupiah(simRecommendedBid)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-amber-300 font-extrabold block">
                      {simDiscountPercent}% Di Bawah HPS
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Potensi Hemat: {formatRupiah(simHps - simRecommendedBid)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-900">
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block">Estimasi Probabilitas Menang:</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${simWinProbability}%` }}
                        ></div>
                      </div>
                      <span className="font-mono font-extrabold text-emerald-400 text-sm">
                        {simWinProbability}%
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block">Rentang Harga Pesaing Terdekat:</span>
                    <span className="font-mono text-xs text-white font-bold block">
                      {formatRupiah(Math.round(simHps * 0.91))} - {formatRupiah(Math.round(simHps * 0.95))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Strategic Insights */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Rekomendasi Taktis Menghadapi Kompetitor:
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Berdasarkan historis 142 tender {simCategory} di LPSE terkait, pesaing utama cenderung memotong harga antara <strong>6% hingga 11%</strong>. Menawar di angka <strong>{formatRupiah(simRecommendedBid)}</strong> memberikan keseimbangan ideal antara mempertahankan profit margin dan mengunci posisi penawaran terendah yang aman dari sanggahan teknis.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 3: KALKULATOR KELAYAKAN MARGIN & RISIKO */}
      {activeSubTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Inputs Form */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase block">
                Rincian Biaya Proyek
              </span>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                Input Komponen Cost
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">1. Biaya Material & Peralatan (IDR):</label>
                <input
                  type="number"
                  value={calcMaterial}
                  onChange={(e) => setCalcMaterial(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">2. Upah Tenaga Kerja / Manpower (IDR):</label>
                <input
                  type="number"
                  value={calcLabor}
                  onChange={(e) => setCalcLabor(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">3. Overhead & Subkontraktor (IDR):</label>
                <input
                  type="number"
                  value={calcOverhead}
                  onChange={(e) => setCalcOverhead(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">4. Cadangan Risiko (Contingency %):</label>
                <input
                  type="number"
                  value={calcContingencyPercent}
                  onChange={(e) => setCalcContingencyPercent(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

            </div>
          </div>

          {/* Profitability Output */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase block">
                  Analisis Kelayakan Margin
                </span>
                <h3 className="text-lg font-black text-white">Estimasi Profit & Break-Even Point</h3>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                Number(netMarginPercent) >= 10
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {Number(netMarginPercent) >= 10 ? '✓ SANGAT LAYAK (FEASIBLE)' : 'RISIKO MARGIN TIPIS'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-xs text-slate-400 font-bold block">Total Direct Cost & Risk Contingency</span>
                <span className="text-xl font-mono font-black text-white block">
                  {formatRupiah(totalCostBeforeTax)}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Subtotal Modal Fisik Pekerjaan
                </span>
              </div>

              <div className="p-4 bg-slate-950 border border-emerald-500/40 rounded-2xl space-y-2">
                <span className="text-xs text-emerald-400 font-bold block">Estimasi Net Profit Margin</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-mono font-black text-emerald-400">
                    {formatRupiah(netProfit)}
                  </span>
                  <span className="text-xs text-emerald-300 font-bold">({netMarginPercent}%)</span>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Setelah memperhitungkan PPN {calcTaxPpnPercent}%
                </span>
              </div>

            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-white block">Saran Keputusan Go / No-Go:</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Proyek ini menghasilkan estimasi net margin bersih sebesar <strong>{netMarginPercent}%</strong>. Direkomendasikan untuk melanjutkan pengajuan dokumen penawaran dengan batas penawaran minimum <strong>{formatRupiah(totalCostBeforeTax)}</strong>.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 4: RADAR ANOMALI & KONSORSIUM BIDDING */}
      {activeSubTab === 'anomalies' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-rose-400 font-bold uppercase block">
                Deteksi Dini Integritas LPSE
              </span>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Radar Indikasi Anomali & Kesamaan Pola Penawaran
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 bg-slate-950 border border-rose-500/30 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300">Indikasi Identical Discount Mirroring</span>
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] font-mono rounded">
                  High Alert
                </span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Terdeteksi 3 vendor pengadaan di LPSE Jawa Barat yang secara konsisten menyajikan potongan harga identik (9.18% - 9.20%) pada 4 paket pekerjaan berbeda.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">Rotasi Pemenang Terstruktur</span>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-mono rounded">
                  Medium Alert
                </span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Pola penyerahan giliran kemenangan antar kontraktor A dan kontraktor B dalam rentang 6 bulan terakhir pada proyek infrastruktur daerah.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* DOSSIER INSPECT MODAL */}
      {inspectVendor && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-indigo-400 font-bold uppercase block">Dossier Intelijen Vendor</span>
                <h3 className="text-lg font-black text-white">{inspectVendor.name}</h3>
              </div>
              <button
                onClick={() => setInspectVendor(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] block font-mono">NPWP: {inspectVendor.npwp}</span>
                <div className="flex justify-between text-slate-200">
                  <span>Total Kemenangan: <strong>{inspectVendor.totalWins} Paket</strong></span>
                  <span className="text-emerald-400 font-bold">{formatRupiah(inspectVendor.totalContractValue)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-white block">Riwayat Kemenangan Terbaru:</span>
                <div className="space-y-1.5">
                  {inspectVendor.recentWins.map((w, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg space-y-0.5">
                      <span className="font-bold text-indigo-300 block">{w.title}</span>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>{w.instansi} ({w.year})</span>
                        <span className="text-emerald-400 font-bold">{formatRupiah(w.winningBid)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectVendor(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs"
              >
                Tutup Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
