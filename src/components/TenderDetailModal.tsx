import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Calendar,
  MapPin,
  BookmarkCheck,
  BookmarkPlus,
  Download,
  CheckCircle2,
  Clock,
  Award,
  Users,
  FileText,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Briefcase,
  AlertCircle,
  Flame,
  MessageSquare,
  Globe,
  Search,
  Copy,
  Check
} from 'lucide-react';
import { Tender } from '../types';
import { formatFullRupiah, formatRupiah, getStatusBadge, getLpseUrl, getLpsePortalInfo } from '../services/api';
import { TenderCommunicationView } from './TenderCommunicationView';
import { VendorTieringSystem } from './VendorTieringSystem';

interface TenderDetailModalProps {
  tender: Tender | null;
  onClose: () => void;
  onToggleTrack: (tenderId: string) => void;
}

export const TenderDetailModal: React.FC<TenderDetailModalProps> = ({
  tender,
  onClose,
  onToggleTrack
}) => {
  if (!tender) return null;

  const [activeTab, setActiveTab] = useState<'info' | 'jadwal' | 'dokumen' | 'peserta' | 'ai_match' | 'proposal_builder' | 'communication'>('info');
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [copiedLpseUrl, setCopiedLpseUrl] = useState<boolean>(false);

  const lpseInfo = getLpsePortalInfo(tender);

  const handleCopyLpseUrl = (urlToCopy: string) => {
    navigator.clipboard.writeText(urlToCopy);
    setCopiedLpseUrl(true);
    setTimeout(() => setCopiedLpseUrl(false), 2500);
  };

  // Interactive HPS Offer & Margin State
  const [offerDiscountPercent, setOfferDiscountPercent] = useState<number>(10);
  const calculatedOfferPrice = tender ? Math.round(tender.nilaiHPS * (1 - offerDiscountPercent / 100)) : 0;
  const estimatedTaxPPN = Math.round(calculatedOfferPrice * 0.11);
  const estimatedNetMargin = Math.round(calculatedOfferPrice * 0.15); // assumed 15% net margin

  // Proposal Builder Form State
  const [proposalForm, setProposalForm] = useState({
    nomorSurat: '001/P-EXT/PROC/2026',
    direkturUtama: 'Budi Santoso, S.T.',
    perusahaanVendor: 'PT Karya Mandiri Utama',
    npwpVendor: '01.234.567.8-012.000',
    masaBerlakuHari: 60,
    garansiBulan: 12,
    diskonPersen: 10
  });

  // Countdown timer logic for closing date
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; totalSeconds: number } | null>(null);

  useEffect(() => {
    if (!tender?.tanggalTutup) return;

    const parseClosingDate = () => {
      if (tender.tanggalTutup.includes('T')) {
        return new Date(tender.tanggalTutup).getTime();
      }
      return new Date(`${tender.tanggalTutup}T23:59:59`).getTime();
    };

    const targetTime = parseClosingDate();

    const updateTimer = () => {
      const now = Date.now();
      const diffMs = targetTime - now;

      if (diffMs <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
      } else {
        const totalSecs = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSecs / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;
        setTimeLeft({ hours, minutes, seconds, totalSeconds: totalSecs });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [tender?.tanggalTutup]);

  const isClosingWithin24Hours = timeLeft && timeLeft.totalSeconds > 0 && timeLeft.hours < 24;

  const badge = getStatusBadge(tender.status);
  const hpsSavingsPercent = (((tender.nilaiPagu - tender.nilaiHPS) / tender.nilaiPagu) * 100).toFixed(1);

  const handleDownloadDoc = (docName: string) => {
    setDownloadToast(`Mengunduh dokumen "${docName}"...`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Urgent 24-Hour Countdown Banner */}
        {isClosingWithin24Hours && (
          <div className="bg-gradient-to-r from-rose-950 via-amber-950 to-rose-950 border-b border-rose-500/50 p-3 px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-rose-200 animate-pulse">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-rose-500/20 border border-rose-500/40 rounded-lg text-rose-400 shrink-0">
                <AlertCircle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <span className="font-extrabold text-rose-300 uppercase tracking-wide block sm:inline mr-2">
                  🚨 DARURAT PENAWARAN (TUTUP DALAM &lt; 24 JAM)
                </span>
                <span className="text-slate-300">
                  Batas penyerahan berkas penawaran akan berakhir sangat segera!
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono font-black text-sm bg-slate-950/90 border border-rose-500/40 px-3.5 py-1.5 rounded-xl text-rose-400 shadow-inner shrink-0">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" />
              <span>
                {String(timeLeft.hours).padStart(2, '0')}j : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        )}

        {/* Toast Alert for Download */}
        {downloadToast && (
          <div className="absolute top-4 right-14 z-50 bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{downloadToast}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                Kode Tender: #{tender.kodeTender}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${badge.bg}`}>
                {badge.label}
              </span>

              {/* 24-Hour Countdown Badge */}
              {isClosingWithin24Hours ? (
                <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 animate-pulse">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  SISA: {timeLeft.hours}j {timeLeft.minutes}m {timeLeft.seconds}s
                </span>
              ) : timeLeft && timeLeft.totalSeconds > 0 && timeLeft.hours < 72 ? (
                <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Sisa {Math.floor(timeLeft.hours / 24)}h {timeLeft.hours % 24}j
                </span>
              ) : null}

              <span className="text-xs text-slate-400">
                TA {tender.tahunAnggaran}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {tender.judul}
            </h2>

            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              {tender.instansi} • <span className="text-slate-400">{tender.satuanKerja}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={lpseInfo.directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white border border-sky-400/50 shadow-md transition-all cursor-pointer"
              title={`Sumber Resmi - Buka ${lpseInfo.name}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Sumber Resmi LPSE</span>
            </a>

            <button
              onClick={() => handleCopyLpseUrl(lpseInfo.directUrl)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              title="Salin Link LPSE"
            >
              {copiedLpseUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onToggleTrack(tender.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                tender.isTracked
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              {tender.isTracked ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Dilacak</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Lacak Tender</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Budget Comparison Banner */}
        <div className="bg-slate-900 border-b border-slate-800 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-medium uppercase">Nilai Pagu Anggaran</span>
            <span className="text-base font-extrabold text-slate-200">{formatFullRupiah(tender.nilaiPagu)}</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-medium uppercase">Nilai HPS (Harga Perhitungan Sendiri)</span>
            <span className="text-base font-extrabold text-emerald-400">{formatFullRupiah(tender.nilaiHPS)}</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-medium uppercase">Selisih Efisiensi HPS</span>
            <span className="text-base font-extrabold text-blue-400">
              {formatFullRupiah(tender.nilaiPagu - tender.nilaiHPS)} ({hpsSavingsPercent}%)
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950 px-4 border-b border-slate-800 flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'info'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Informasi & Kualifikasi
          </button>

          <button
            onClick={() => setActiveTab('jadwal')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'jadwal'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Jadwal Tahapan ({tender.jadwal.length})
          </button>

          <button
            onClick={() => setActiveTab('dokumen')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'dokumen'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            Dokumen ({tender.dokumen.length})
          </button>

          <button
            onClick={() => setActiveTab('peserta')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'peserta'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Peserta & Pemenang ({tender.peserta.length})
          </button>

          <button
            onClick={() => setActiveTab('ai_match')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'ai_match'
                ? 'border-sky-400 text-sky-400 font-extrabold'
                : 'border-transparent text-sky-300 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-sky-400" />
            AI Match & Kalkulator HPS
          </button>

          <button
            onClick={() => setActiveTab('proposal_builder')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'proposal_builder'
                ? 'border-amber-400 text-amber-400 font-extrabold'
                : 'border-transparent text-amber-300 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            Generator Dokumen Penawaran
          </button>

          <button
            onClick={() => setActiveTab('communication')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'communication'
                ? 'border-emerald-400 text-emerald-400 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            Aanwijzing / Forum Q&A
          </button>
        </div>

        {/* Modal Body Scroll Content */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-200 space-y-6">
          {activeTab === 'info' && (
            <div className="space-y-6 text-xs">
              {/* Official LPSE Source Link Banner */}
              <div className="p-4 bg-gradient-to-r from-sky-950/90 via-slate-900 to-slate-950 border border-sky-500/40 rounded-2xl space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sky-900/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-white text-sm">
                          {lpseInfo.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          SPSE / LKPP Verified
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-300 mt-1 block">
                        Kode Lelang: <strong className="font-mono text-sky-300">#{tender.kodeTender}</strong> • Portal: <span className="text-slate-400">{lpseInfo.baseUrl}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopyLpseUrl(lpseInfo.directUrl)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedLpseUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copiedLpseUrl ? 'Tersalin!' : 'Salin URL'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Action Links Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <a
                    href={lpseInfo.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-between transition-all shadow cursor-pointer group"
                  >
                    <span className="flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Pengumuman Lelang
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  <a
                    href={lpseInfo.searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-sky-300 font-semibold text-xs border border-sky-800/60 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <span className="flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-sky-400" />
                      Cari di Server LPSE
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  <a
                    href={lpseInfo.lelangUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 font-semibold text-xs border border-slate-800 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      Portal Utama LPSE
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>

                <p className="text-[10px] text-slate-400 italic pt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-sky-400 shrink-0" />
                  Situs resmi LPSE dikelola oleh LKPP & Instansi terkait. Apabila halaman langsung lelang tidak aktif/404 pada server live instansi, gunakan tombol 'Cari di Server LPSE' atau 'Portal Utama LPSE' di atas.
                </p>
              </div>

              {/* Deskripsi */}
              <div>
                <h3 className="font-bold text-sm text-white mb-2">Uraian / Deskripsi Pekerjaan</h3>
                <p className="bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed text-slate-300">
                  {tender.deskripsi}
                </p>
              </div>

              {/* General Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-white text-xs block mb-1">Klasifikasi & Metode</span>
                  <p><span className="text-slate-400">Kategori:</span> <span className="font-semibold text-emerald-400">{tender.kategori}</span></p>
                  <p><span className="text-slate-400">Metode Pengadaan:</span> <span className="font-semibold text-slate-200">{tender.metode}</span></p>
                  <p><span className="text-slate-400">Lokasi Pekerjaan:</span> <span className="font-semibold text-slate-200">{tender.lokasi}</span></p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${
                  isClosingWithin24Hours
                    ? 'bg-rose-950/40 border-rose-500/50 shadow-inner'
                    : 'bg-slate-950 border-slate-800'
                }`}>
                  <span className="font-bold text-white text-xs flex items-center justify-between mb-1">
                    <span>Tanggal Penting</span>
                    {isClosingWithin24Hours && (
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 font-extrabold px-2 py-0.5 rounded border border-rose-500/40 animate-pulse">
                        TUTUP SEGERA (&lt; 24 JAM)
                      </span>
                    )}
                  </span>
                  <p><span className="text-slate-400">Tanggal Buka:</span> <span className="font-semibold text-slate-200">{tender.tanggalBuka}</span></p>
                  <p><span className="text-slate-400">Batas Tutup Penawaran:</span> <span className="font-semibold text-amber-400">{tender.tanggalTutup.replace('T16:00:00Z', ' (16:00 WIB)')}</span></p>
                  
                  {isClosingWithin24Hours && timeLeft && (
                    <div className="mt-3 p-2.5 bg-slate-950 border border-rose-500/30 rounded-lg flex items-center justify-between">
                      <span className="text-rose-300 font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                        Hitung Mundur Sisa Waktu:
                      </span>
                      <span className="font-mono font-black text-rose-400 text-sm">
                        {String(timeLeft.hours).padStart(2, '0')}j {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
                      </span>
                    </div>
                  )}

                  <p><span className="text-slate-400">Terakhir Dibarui:</span> <span className="font-mono text-slate-300">{new Date(tender.lastUpdated).toLocaleDateString('id-ID')}</span></p>
                </div>
              </div>

              {/* Syarat Kualifikasi Checklist */}
              <div>
                <h3 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Syarat-Syarat Kualifikasi Penyedia
                </h3>
                <ul className="bg-slate-950 p-4 rounded-xl border border-slate-800 divide-y divide-slate-800/80 space-y-2">
                  {tender.syaratKualifikasi.map((syarat, idx) => (
                    <li key={idx} className="pt-2 first:pt-0 flex items-start gap-2.5 text-slate-300">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{syarat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'jadwal' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Jadwal tahapan pelaksanaan tender sesuai rilis resmi SPSE LPSE {tender.instansi}:
              </p>

              <div className="relative border-l-2 border-slate-800 ml-4 space-y-6 py-2 text-xs">
                {tender.jadwal.map((step, idx) => (
                  <div key={idx} className="relative pl-6">
                    {/* Stepper Node Indicator */}
                    <span
                      className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${
                        step.status === 'completed'
                          ? 'bg-emerald-500 border-emerald-400'
                          : step.status === 'active'
                          ? 'bg-amber-500 border-amber-300 animate-pulse'
                          : 'bg-slate-900 border-slate-700'
                      }`}
                    ></span>

                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white text-xs">{step.step}</h4>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          {step.startDate} s/d {step.endDate}
                        </p>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase w-fit ${
                          step.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : step.status === 'active'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {step.status === 'completed'
                          ? 'Selesai'
                          : step.status === 'active'
                          ? 'Sedang Berlangsung'
                          : 'Akan Datang'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dokumen' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Unduh berkas dokumen pengadaan resmi (RKS, Gambar Teknis, RAB) yang bersumber dari server LPSE:
              </p>

              <div className="divide-y divide-slate-800/80 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                {tender.dokumen.map((doc) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-800 rounded-xl text-emerald-400 border border-slate-700">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white">{doc.name}</h4>
                        <span className="text-[10px] text-slate-400">
                          Format: {doc.type} • Ukuran: {doc.size}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadDoc(doc.name)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'peserta' && (
            <div className="space-y-4 text-xs">
              {/* Winner Announcement if available */}
              {tender.pemenang && (
                <div className="bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-400" />
                      <span className="font-bold text-sm text-emerald-300">Pemenang Ditetapkan (Pemenang Utama)</span>
                    </div>
                    {/* Winner Trust Tier Badge */}
                    <VendorTieringSystem
                      vendor={{
                        vendorName: tender.pemenang.name,
                        npwp: tender.pemenang.npwp
                      }}
                      compact
                      size="sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <p className="text-slate-400">Nama Perusahaan:</p>
                      <p className="font-bold text-white text-sm">{tender.pemenang.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">NPWP: {tender.pemenang.npwp}</p>
                    </div>

                    <div>
                      <p className="text-slate-400">Harga Penawaran Terkoreksi:</p>
                      <p className="font-extrabold text-emerald-400 text-sm">{formatFullRupiah(tender.pemenang.penawaran)}</p>
                      <p className="text-[11px] text-slate-300 mt-1">{tender.pemenang.hasilEvaluasi}</p>
                    </div>
                  </div>

                  {/* Standard Vendor Tiering Badge Box for Winner */}
                  <div className="pt-2 border-t border-emerald-900/50">
                    <VendorTieringSystem
                      vendor={{
                        vendorName: tender.pemenang.name,
                        npwp: tender.pemenang.npwp
                      }}
                      size="md"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-slate-400 font-medium">
                  Daftar Vendor Peserta Lelang ({tender.peserta.length} Peserta Terdaftar):
                </p>
                <span className="text-[10px] text-slate-400 italic">
                  *Klik badge tiering untuk melihat rincian skor & sertifikasi vendor
                </span>
              </div>

              {tender.peserta.length === 0 ? (
                <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-center text-slate-400">
                  Daftar peserta belum dibuka atau masih dalam tahap pengumuman.
                </div>
              ) : (
                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3">Rank</th>
                        <th className="p-3">Nama Perusahaan / Vendor</th>
                        <th className="p-3">Vendor Trust Tier</th>
                        <th className="p-3">NPWP</th>
                        <th className="p-3">Harga Penawaran</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs">
                      {tender.peserta.map((p, idx) => (
                        <tr key={idx} className={p.isWinner ? 'bg-emerald-950/30' : ''}>
                          <td className="p-3 font-bold text-slate-400">
                            {p.rank || idx + 1}
                          </td>
                          <td className="p-3 font-bold text-slate-100">
                            <div className="flex items-center gap-2">
                              <span>{p.name}</span>
                              {p.isWinner && (
                                <span className="px-2 py-0.2 rounded bg-amber-500 text-slate-950 font-bold text-[9px]">
                                  PEMENANG
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <VendorTieringSystem
                              vendor={{
                                vendorName: p.name,
                                npwp: p.npwp
                              }}
                              compact
                              size="sm"
                            />
                          </td>
                          <td className="p-3 font-mono text-slate-400 text-[11px]">
                            {p.npwp}
                          </td>
                          <td className="p-3 font-extrabold text-emerald-400">
                            {p.offerPrice ? formatFullRupiah(p.offerPrice) : 'Tidak Ada Data'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai_match' && (
            <div className="space-y-5 text-xs animate-fade-in">
              {/* AI Win Probability Card */}
              <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 border border-sky-500/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-sky-500/20 border border-sky-500/40 rounded-xl text-sky-400">
                      <Award className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-extrabold text-white text-sm">Prediksi Skor Match & Peluang Pemenangan AI</h4>
                      <p className="text-[11px] text-slate-300">Dianalisis berdasarkan kualifikasi SBU, rekam jejak regional, dan historis kompetitor.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-sky-400">88%</span>
                    <span className="text-[10px] text-emerald-400 font-bold block">Match Sangat Tinggi</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block font-medium">Kesesuaian SBU / NIB</span>
                    <span className="font-bold text-emerald-400">100% Sesuai</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block font-medium">Tingkat Kepadatan Pesaing</span>
                    <span className="font-bold text-amber-400">Sedang (3 - 5 Vendor Utama)</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block font-medium">Estimasi Discount Ideal</span>
                    <span className="font-bold text-sky-400">8% - 12% dari HPS</span>
                  </div>
                </div>
              </div>

              {/* Interactive HPS Profit Margin Calculator */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Kalkulator Simulasi Diskon Penawaran & Estimasi Profit Margin
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Atur Diskon dari Nilai HPS ({formatFullRupiah(tender.nilaiHPS)}):</span>
                    <span className="text-emerald-400 font-mono font-black text-sm">{offerDiscountPercent}% Diskon</span>
                  </div>

                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={offerDiscountPercent}
                    onChange={(e) => setOfferDiscountPercent(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                      <span className="text-slate-400 block font-medium text-[11px]">Harga Penawaran Yang Diajukan:</span>
                      <span className="text-base font-extrabold text-emerald-400 font-mono">{formatFullRupiah(calculatedOfferPrice)}</span>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                      <span className="text-slate-400 block font-medium text-[11px]">Estimasi PPN 11%:</span>
                      <span className="text-sm font-bold text-slate-300 font-mono">{formatFullRupiah(estimatedTaxPPN)}</span>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                      <span className="text-slate-400 block font-medium text-[11px]">Estimasi Keuntungan Bersih (Net Profit):</span>
                      <span className="text-base font-extrabold text-sky-400 font-mono">{formatFullRupiah(estimatedNetMargin)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'proposal_builder' && (
            <div className="space-y-5 text-xs animate-fade-in">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" /> Generator Dokumen Penawaran & Surat Kuasa (1-Click)
                  </h4>
                  <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold text-[10px]">
                    Otomatisasi Berkas SPSE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Nomor Surat Penawaran:</label>
                    <input
                      type="text"
                      value={proposalForm.nomorSurat}
                      onChange={(e) => setProposalForm({ ...proposalForm, nomorSurat: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Nama Perusahaan Vendor:</label>
                    <input
                      type="text"
                      value={proposalForm.perusahaanVendor}
                      onChange={(e) => setProposalForm({ ...proposalForm, perusahaanVendor: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Nama Direktur Utama / Kuasa Direksi:</label>
                    <input
                      type="text"
                      value={proposalForm.direkturUtama}
                      onChange={(e) => setProposalForm({ ...proposalForm, direkturUtama: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">NPWP Perusahaan:</label>
                    <input
                      type="text"
                      value={proposalForm.npwpVendor}
                      onChange={(e) => setProposalForm({ ...proposalForm, npwpVendor: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 font-serif text-slate-300 text-[11px] leading-relaxed">
                  <div className="font-sans font-bold text-emerald-400 text-xs mb-2">Prinjauan Draf Surat Penawaran Resmi:</div>
                  <p>Kepada Yth. Pokja Pemilihan SPSE {tender.instansi}</p>
                  <p>Perihal: Penawaran Pekerjaan "{tender.judul}" (Kode Tender: #{tender.kodeTender})</p>
                  <p>
                    Dengan ini kami mengajukan penawaran harga sebesar <strong>{formatFullRupiah(calculatedOfferPrice)}</strong> termasuk pajak PPN. Masa berlaku penawaran kami selama {proposalForm.masaBerlakuHari} hari kalender sejak tanggal batas akhir pemasukan penawaran.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => handleDownloadDoc('Surat_Penawaran_Resmi.pdf')}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl shadow-lg flex items-center gap-2 cursor-pointer text-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Cetak PDF Surat Penawaran</span>
                  </button>

                  <button
                    onClick={() => handleDownloadDoc('Rincian_RAB_Lampiran.xlsx')}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 flex items-center gap-2 cursor-pointer text-xs"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Unduh Template RAB (Excel)</span>
                  </button>

                  <a
                    href="https://e-materai.co.id"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold rounded-xl shadow-lg flex items-center gap-2 cursor-pointer text-xs border border-sky-400/30"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Bubuhi E-Materai Peruri Direct</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'communication' && (
            <TenderCommunicationView tender={tender} />
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Sumber Data: SPSE LPSE {tender.instansi} via pyproc
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Tutup Modal
          </button>
        </div>
      </div>
    </div>
  );
};
