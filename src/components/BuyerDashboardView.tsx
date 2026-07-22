import React, { useState, useEffect } from 'react';
import {
  Building2,
  PlusCircle,
  FileText,
  Users,
  BarChart3,
  Gavel,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Award,
  ShieldAlert,
  Send,
  Upload,
  ChevronRight,
  Trash2,
  Star,
  RefreshCw,
  ExternalLink,
  DollarSign,
  Sparkles,
  UserCheck,
  Building,
  Briefcase,
  HelpCircle,
  Zap,
  Lock,
  Download
} from 'lucide-react';
import {
  BuyerTender,
  BuyerVendor,
  BuyerBidSubmission,
  EAuctionBid,
  QnaItem,
  TenderCategory,
  OfferSystemType,
  SelectionMethod,
  EvaluationMethod,
  BuyerTenderStatus
} from '../types';
import { api, formatRupiah, formatFullRupiah } from '../services/api';

interface BuyerDashboardViewProps {
  onOpenCreateModal?: () => void;
}

export const BuyerDashboardView: React.FC<BuyerDashboardViewProps> = () => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'wizard' | 'my_tenders' | 'srm_vendors' | 'e_auction' | 'qna' | 'analytics' | 'pricing'>('overview');

  // State Stores
  const [buyerTenders, setBuyerTenders] = useState<BuyerTender[]>([]);
  const [buyerVendors, setBuyerVendors] = useState<BuyerVendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTender, setSelectedTender] = useState<BuyerTender | null>(null);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [vendorSearch, setVendorSearch] = useState<string>('');

  // Notifications / Alert State
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Wizard Multi-Step Form State
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardForm, setWizardForm] = useState({
    judul: '',
    deskripsi: '',
    kategori: 'Pekerjaan Konstruksi' as TenderCategory,
    instansi: 'PT Fastrate Technology Group (Buyer)',
    satuanKerja: 'Divisi Procurement & SCM',
    lokasi: 'DKI Jakarta',
    spesifikasiTeknis: 'Spesifikasi teknis terperinci mencakup standar ISO, garansi 3 tahun, dan kualifikasi sertifikasi vendor.',
    syaratKualifikasi: [
      'Memiliki NIB & SBU Berkelanjutan yang Masih Berlaku',
      'NPWP Perusahaan & Laporan Keuangan Diaudit 2 Tahun Terakhir',
      'Pengalaman Proyek Sejenis senilai min 50% HPS'
    ],
    customRequirement: '',
    tanggalBuka: new Date().toISOString().split('T')[0],
    tanggalTutup: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
    tanggalPembukaan: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString().split('T')[0],
    nilaiPagu: 2500000000,
    nilaiHPS: 2300000000,
    sistemPenawaran: 'Dua File' as OfferSystemType,
    metodePemilihan: 'Lelang Terbuka' as SelectionMethod,
    metodeEvaluasi: 'Kualitas & Harga' as EvaluationMethod,
    bobotKualitas: 40,
    bobotHarga: 60,
    jumlahPemenang: 1,
    eAuctionEnabled: true,
    eAuctionMinBidStep: 10000000,
    invitedVendors: [] as string[]
  });

  // Selected Tender Details State (Bids, Q&A, Auction)
  const [tenderBids, setTenderBids] = useState<BuyerBidSubmission[]>([]);
  const [tenderQna, setTenderQna] = useState<QnaItem[]>([]);
  const [auctionBids, setAuctionBids] = useState<EAuctionBid[]>([]);
  const [qnaAnswerInput, setQnaAnswerInput] = useState<{ [key: string]: string }>({});
  const [auctionBidInput, setAuctionBidInput] = useState<string>('2950000000');

  // Load Data
  const fetchAllBuyerData = async () => {
    setLoading(true);
    try {
      const [tendersRes, vendorsRes] = await Promise.all([
        api.getBuyerTenders(),
        api.getBuyerVendors()
      ]);
      setBuyerTenders(tendersRes.tenders || []);
      setBuyerVendors(vendorsRes.vendors || []);
      if (tendersRes.tenders && tendersRes.tenders.length > 0) {
        setSelectedTender(tendersRes.tenders[0]);
        loadTenderSubDetails(tendersRes.tenders[0].id);
      }
    } catch (err) {
      console.error('Error fetching buyer portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTenderSubDetails = async (tenderId: string) => {
    try {
      const res = await api.getBuyerTenderById(tenderId);
      setTenderBids(res.bids || []);
      setTenderQna(res.qna || []);
      setAuctionBids(res.auctionBids || []);
    } catch (err) {
      console.error('Error loading tender detail:', err);
    }
  };

  useEffect(() => {
    fetchAllBuyerData();
  }, []);

  const handleSelectTender = (tender: BuyerTender) => {
    setSelectedTender(tender);
    loadTenderSubDetails(tender.id);
  };

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Submit Wizard Form
  const handleWizardSubmit = async (submitAction: 'draft' | 'approval' | 'publish') => {
    try {
      const payload = {
        ...wizardForm,
        submitAction
      };
      const res = await api.createBuyerTender(payload);
      showAlert('success', res.message);
      fetchAllBuyerData();
      setActiveSubTab('my_tenders');
      setWizardStep(1);
    } catch (err: any) {
      showAlert('error', err.message || 'Gagal menerbitkan tender buyer');
    }
  };

  // Vendor Blacklist / Whitelist
  const handleVendorStatusChange = async (vendorId: string, status: 'active' | 'blacklisted' | 'whitelisted', reason?: string) => {
    try {
      const res = await api.updateBuyerVendorStatus(vendorId, { status, reason });
      showAlert('success', res.message);
      const updatedVendors = await api.getBuyerVendors();
      setBuyerVendors(updatedVendors.vendors);
    } catch (err: any) {
      showAlert('error', err.message || 'Gagal memperbarui status vendor');
    }
  };

  // Answer Q&A Question
  const handleAnswerQna = async (qnaId: string) => {
    if (!selectedTender) return;
    const answer = qnaAnswerInput[qnaId];
    if (!answer || !answer.trim()) return;

    try {
      const res = await api.postBuyerQna(selectedTender.id, {
        questionId: qnaId,
        answer: answer.trim()
      });
      showAlert('success', res.message);
      setQnaAnswerInput((prev) => ({ ...prev, [qnaId]: '' }));
      loadTenderSubDetails(selectedTender.id);
    } catch (err: any) {
      showAlert('error', err.message || 'Gagal mengirim jawaban');
    }
  };

  // Place EAuction Bid
  const handlePlaceAuctionBid = async () => {
    if (!selectedTender) return;
    const amount = Number(auctionBidInput);
    if (isNaN(amount) || amount <= 0) {
      showAlert('error', 'Masukkan nominal penawaran e-auction yang valid');
      return;
    }

    try {
      const res = await api.postBuyerAuctionBid(selectedTender.id, {
        vendorAnonName: 'Vendor #03 (PT Karya Mandiri)',
        bidAmount: amount
      });
      showAlert('success', res.message);
      loadTenderSubDetails(selectedTender.id);
    } catch (err: any) {
      showAlert('error', err.message || 'Gagal mengajukan penawaran');
    }
  };

  // Award Winner
  const handleAwardWinner = async (bid: BuyerBidSubmission) => {
    if (!selectedTender) return;
    if (!confirm(`Konfirmasi penetapan ${bid.vendorName} sebagai pemenang tender ini dengan nilai ${formatRupiah(bid.offerPrice)}?`)) return;

    try {
      const res = await api.awardBuyerTender(selectedTender.id, {
        bidId: bid.id,
        winnerName: bid.vendorName,
        winningAmount: bid.offerPrice
      });
      showAlert('success', res.message);
      fetchAllBuyerData();
      loadTenderSubDetails(selectedTender.id);
    } catch (err: any) {
      showAlert('error', err.message || 'Gagal merilis pemenang');
    }
  };

  // Approve Workflow Step
  const handleApproveWorkflowStep = async (stepLevel: number) => {
    if (!selectedTender) return;
    try {
      const res = await api.updateBuyerTenderStatus(selectedTender.id, {
        approveStepLevel: stepLevel,
        comment: 'Disetujui berdasarkan verifikasi anggaran HPS dan kelengkapan RKS.'
      });
      showAlert('success', res.message);
      fetchAllBuyerData();
      loadTenderSubDetails(selectedTender.id);
    } catch (err: any) {
      showAlert('error', err.message || 'Gagal menyetujui tahap approval');
    }
  };

  // Computed KPIs
  const totalActiveTenders = buyerTenders.filter((t) => t.status === 'active' || t.status === 'evaluating').length;
  const totalHpsBudget = buyerTenders.reduce((sum, t) => sum + t.nilaiHPS, 0);
  const totalWhitelistedVendors = buyerVendors.filter((v) => v.status === 'whitelisted' || v.status === 'active').length;
  const pendingApprovalCount = buyerTenders.filter((t) => t.status === 'pending_approval').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Global Alert Notification */}
        {alertMessage && (
          <div
            className={`p-4 rounded-xl border font-semibold flex items-center justify-between text-sm shadow-xl transition-all animate-fade-in ${
              alertMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {alertMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
              <span>{alertMessage.text}</span>
            </div>
            <button onClick={() => setAlertMessage(null)} className="text-xs underline hover:opacity-80">
              Tutup
            </button>
          </div>
        )}

        {/* Header Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Portal Pengadaan Cloud Buyer
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Inspired by Yonyou S2C & SRM
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Platform Pengadaan End-to-End Perusahaan
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                Kelola pendaftaran tender, evaluasi penawaran vendor, e-Auction real-time, manajemen hubungan pemasok (SRM), serta kontrak e-Sign dalam satu pintu terpadu.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setWizardStep(1);
                  setActiveSubTab('wizard');
                }}
                className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2 text-sm"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Buat Tender Baru</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-slate-800/80 no-scrollbar text-xs">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'overview'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview Buyer</span>
            </button>

            <button
              onClick={() => setActiveSubTab('wizard')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'wizard'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Tender Baru (Wizard)</span>
            </button>

            <button
              onClick={() => setActiveSubTab('my_tenders')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'my_tenders'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Daftar Tender Saya ({buyerTenders.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('srm_vendors')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'srm_vendors'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Manajemen Vendor & SRM ({buyerVendors.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('e_auction')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'e_auction'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Gavel className="w-4 h-4" />
              <span>E-Auction Real-Time</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </button>

            <button
              onClick={() => setActiveSubTab('qna')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'qna'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Forum Q&A ({tenderQna.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('analytics')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'analytics'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Laporan & Analitik</span>
            </button>

            <button
              onClick={() => setActiveSubTab('pricing')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSubTab === 'pricing'
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Paket Langganan Buyer</span>
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW BUYER */}
        {activeSubTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-medium">
                  <span>Tender Buyer Aktif</span>
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">{totalActiveTenders} Paket</div>
                <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Terbit & Sedang Berjalan
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-medium">
                  <span>Total Anggaran HPS</span>
                  <DollarSign className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-black text-sky-400">{formatRupiah(totalHpsBudget)}</div>
                <div className="text-[11px] text-slate-400 mt-1">Efisiensi Rata-rata 7.8%</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-medium">
                  <span>Vendor SRM Terverifikasi</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white">{totalWhitelistedVendors} Perusahaan</div>
                <div className="text-[11px] text-purple-400 mt-1 font-semibold">
                  {buyerVendors.filter((v) => v.status === 'blacklisted').length} vendor diblacklist
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-medium">
                  <span>Pending Approval Internal</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-400">{pendingApprovalCount} Paket</div>
                <div className="text-[11px] text-slate-400 mt-1">S2C Multi-Level Approval</div>
              </div>
            </div>

            {/* Yonyou Inspired Cloud Capabilities Grid */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="font-extrabold text-white text-base">
                    Kapabilitas Yonyou Procurement Cloud dalam LPSE Radar Pro
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Arsitektur Pengadaan Terpadu Satu Pintu</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                    <UserCheck className="w-4 h-4" /> SRM (Manajemen Pemasok)
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Evaluasi kinerja vendor berorientasi AI, histori penawaran, scorecard kualitas, dan pendaftaran/blacklist vendor.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="font-bold text-sky-400 flex items-center gap-1.5 text-sm">
                    <FileCheck className="w-4 h-4" /> S2C (Source-to-Contract)
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Alur pembuatan tender bertahap dari perencanaan RAB/KAK hingga penandatanganan e-Sign & E-Materai Peruri (Integrasi Perum Peruri Direct).
                  </p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
                    <Gavel className="w-4 h-4" /> E-Bidding & E-Auction
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Ruang lelang elektronik live dengan perlindungan waktu anti-sniper dan leaderboard penawaran anonim.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="font-bold text-purple-400 flex items-center gap-1.5 text-sm">
                    <MessageSquare className="w-4 h-4" /> Supply Chain Collaboration
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Forum Q&A Aanwijzing terintegrasi untuk klarifikasi RKS dan pengiriman penawaran dua file terenkripsi.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Buyer Tenders Summary Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-base">Daftar Tender Terbaru Pemilik / Buyer</h3>
                <button
                  onClick={() => setActiveSubTab('my_tenders')}
                  className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  Lihat Semua ({buyerTenders.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-200">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3">Kode & Nama Tender</th>
                      <th className="p-3">Kategori & Lokasi</th>
                      <th className="p-3">Nilai HPS</th>
                      <th className="p-3">Metode & Evaluasi</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {buyerTenders.map((tender) => (
                      <tr key={tender.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 max-w-xs">
                          <span className="text-[10px] font-mono text-emerald-400 font-semibold block">{tender.kodeTender}</span>
                          <span className="font-bold text-white block truncate">{tender.judul}</span>
                          <span className="text-[11px] text-slate-400">{tender.instansi}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-medium text-slate-300 block">{tender.kategori}</span>
                          <span className="text-[11px] text-slate-400">{tender.lokasi}</span>
                        </td>
                        <td className="p-3 font-bold text-emerald-400">
                          {formatRupiah(tender.nilaiHPS)}
                        </td>
                        <td className="p-3">
                          <span className="block font-medium">{tender.metodePemilihan}</span>
                          <span className="text-[11px] text-slate-400">{tender.metodeEvaluasi}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                            tender.status === 'active' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                            tender.status === 'pending_approval' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                            tender.status === 'evaluating' ? 'bg-sky-500/10 text-sky-300 border-sky-500/30' :
                            tender.status === 'awarded' ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' :
                            'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {tender.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              handleSelectTender(tender);
                              setActiveSubTab('my_tenders');
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Kelola
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

        {/* TAB 2: STEP-BY-STEP TENDER CREATION WIZARD */}
        {activeSubTab === 'wizard' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8 animate-fade-in">
            {/* Wizard Step Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Langkah {wizardStep} dari 5</span>
                <span className="text-emerald-400 font-extrabold">
                  {wizardStep === 1 && '1. Informasi Dasar Tender'}
                  {wizardStep === 2 && '2. Spesifikasi & Dokumen Pengadaan'}
                  {wizardStep === 3 && '3. Jadwal & Anggaran HPS'}
                  {wizardStep === 4 && '4. Metode Pemilihan & Evaluasi'}
                  {wizardStep === 5 && '5. Review, Approval & Publikasi'}
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-sky-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(wizardStep / 5) * 100}%` }}
                />
              </div>

              {/* Step Badges */}
              <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-bold pt-2">
                {[1, 2, 3, 4, 5].map((stepNum) => (
                  <button
                    key={stepNum}
                    onClick={() => setWizardStep(stepNum)}
                    className={`py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                      wizardStep === stepNum
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : wizardStep > stepNum
                        ? 'bg-slate-800 text-emerald-400'
                        : 'bg-slate-950 text-slate-500'
                    }`}
                  >
                    Langkah {stepNum}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 1: INFORMASI DASAR */}
            {wizardStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-400" /> Informasi Dasar Tender
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="font-bold text-slate-300">Judul Paket Tender / Pengadaan *</label>
                    <input
                      type="text"
                      value={wizardForm.judul}
                      onChange={(e) => setWizardForm({ ...wizardForm, judul: e.target.value })}
                      placeholder="Contoh: Pengadaan Hardware Server & Storage Cloud Data Center 2026"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="font-bold text-slate-300">Deskripsi Singkat & Ruang Lingkup Pekerjaan</label>
                    <textarea
                      rows={3}
                      value={wizardForm.deskripsi}
                      onChange={(e) => setWizardForm({ ...wizardForm, deskripsi: e.target.value })}
                      placeholder="Jelaskan cakupan pekerjaan, lokasi, dan ekspektasi hasil pengadaan..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Kategori Pekerjaan *</label>
                    <select
                      value={wizardForm.kategori}
                      onChange={(e) => setWizardForm({ ...wizardForm, kategori: e.target.value as TenderCategory })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Pekerjaan Konstruksi">Pekerjaan Konstruksi</option>
                      <option value="Pengadaan Barang">Pengadaan Barang</option>
                      <option value="Jasa Konsultansi Badan Usaha">Jasa Konsultansi Badan Usaha</option>
                      <option value="Jasa Lainnya">Jasa Lainnya</option>
                      <option value="Jasa Konsultansi Perorangan">Jasa Konsultansi Perorangan</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Instansi / Perusahaan Penyelenggara *</label>
                    <input
                      type="text"
                      value={wizardForm.instansi}
                      onChange={(e) => setWizardForm({ ...wizardForm, instansi: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Satuan Kerja / Divisi Internal</label>
                    <input
                      type="text"
                      value={wizardForm.satuanKerja}
                      onChange={(e) => setWizardForm({ ...wizardForm, satuanKerja: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Lokasi Pelaksanaan Pekerjaan</label>
                    <input
                      type="text"
                      value={wizardForm.lokasi}
                      onChange={(e) => setWizardForm({ ...wizardForm, lokasi: e.target.value })}
                      placeholder="Contoh: DKI Jakarta / Surabaya"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SPESIFIKASI & DOKUMEN */}
            {wizardStep === 2 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" /> Spesifikasi & Dokumen Pengadaan (RKS/BoQ)
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Rincian Spesifikasi Teknis (Rich Text Format)</label>
                    <textarea
                      rows={5}
                      value={wizardForm.spesifikasiTeknis}
                      onChange={(e) => setWizardForm({ ...wizardForm, spesifikasiTeknis: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
                    />
                  </div>

                  {/* Syarat Kualifikasi */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-300">Daftar Persyaratan Kualifikasi Vendor</label>
                    <div className="space-y-2">
                      {wizardForm.syaratKualifikasi.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-slate-200 flex-1">{req}</span>
                          <button
                            onClick={() => {
                              const updated = wizardForm.syaratKualifikasi.filter((_, i) => i !== idx);
                              setWizardForm({ ...wizardForm, syaratKualifikasi: updated });
                            }}
                            className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={wizardForm.customRequirement}
                        onChange={(e) => setWizardForm({ ...wizardForm, customRequirement: e.target.value })}
                        placeholder="Tambah persyaratan kualifikasi custom baru..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (wizardForm.customRequirement.trim()) {
                            setWizardForm({
                              ...wizardForm,
                              syaratKualifikasi: [...wizardForm.syaratKualifikasi, wizardForm.customRequirement.trim()],
                              customRequirement: ''
                            });
                          }
                        }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl cursor-pointer"
                      >
                        Tambah
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: JADWAL & ANGGARAN */}
            {wizardStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" /> Jadwal Pengadaan & Anggaran HPS
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Nilai Pagu Anggaran (IDR) *</label>
                    <input
                      type="number"
                      value={wizardForm.nilaiPagu}
                      onChange={(e) => setWizardForm({ ...wizardForm, nilaiPagu: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                    />
                    <span className="text-[11px] text-emerald-400 font-bold">{formatRupiah(wizardForm.nilaiPagu)}</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Nilai HPS / OE (Harga Perkiraan Sendiri) *</label>
                    <input
                      type="number"
                      value={wizardForm.nilaiHPS}
                      onChange={(e) => setWizardForm({ ...wizardForm, nilaiHPS: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                    />
                    <span className="text-[11px] text-emerald-400 font-bold">{formatRupiah(wizardForm.nilaiHPS)}</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Tanggal Mulai Pendaftaran</label>
                    <input
                      type="date"
                      value={wizardForm.tanggalBuka}
                      onChange={(e) => setWizardForm({ ...wizardForm, tanggalBuka: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Tanggal Batas Tutup Penawaran</label>
                    <input
                      type="date"
                      value={wizardForm.tanggalTutup}
                      onChange={(e) => setWizardForm({ ...wizardForm, tanggalTutup: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="font-bold text-slate-300">Sistem Penawaran Dokumen</label>
                    <select
                      value={wizardForm.sistemPenawaran}
                      onChange={(e) => setWizardForm({ ...wizardForm, sistemPenawaran: e.target.value as OfferSystemType })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Satu File">Satu File (Harga & Teknis Bersamaan)</option>
                      <option value="Dua File">Dua File (Tahap 1: Teknis, Tahap 2: Harga)</option>
                      <option value="Tertutup (Khusus Undangan)">Tertutup (Khusus Vendor Undangan SRM)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: METODE PEMILIHAN & EVALUASI */}
            {wizardStep === 4 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-emerald-400" /> Metode Pemilihan, Evaluasi & E-Auction
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Metode Pemilihan Vendor</label>
                    <select
                      value={wizardForm.metodePemilihan}
                      onChange={(e) => setWizardForm({ ...wizardForm, metodePemilihan: e.target.value as SelectionMethod })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Lelang Terbuka">Lelang Terbuka (Public Tendering)</option>
                      <option value="Lelang Terbatas">Lelang Terbatas (Undangan Selective)</option>
                      <option value="Penunjukan Langsung">Penunjukan Langsung (Direct Contracting)</option>
                      <option value="E-Purchasing">E-Purchasing / Katalog</option>
                      <option value="Tender Kilat">Tender Kilat Fast-Track</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Metode Evaluasi Penawaran</label>
                    <select
                      value={wizardForm.metodeEvaluasi}
                      onChange={(e) => setWizardForm({ ...wizardForm, metodeEvaluasi: e.target.value as EvaluationMethod })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Harga Terendah">Sistem Harga Terendah</option>
                      <option value="Kualitas & Harga">Kualitas & Harga (Pembobotan Skor)</option>
                      <option value="Kualitas">Sistem Kualitas Teknis Utamakan</option>
                      <option value="Penilaian Komprehensif">Penilaian Komprehensif Matrix Scorecard</option>
                    </select>
                  </div>

                  {wizardForm.metodeEvaluasi === 'Kualitas & Harga' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-300">Bobot Kualitas Teknis (%)</label>
                        <input
                          type="number"
                          value={wizardForm.bobotKualitas}
                          onChange={(e) => setWizardForm({ ...wizardForm, bobotKualitas: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-300">Bobot Harga Commercial (%)</label>
                        <input
                          type="number"
                          value={wizardForm.bobotHarga}
                          onChange={(e) => setWizardForm({ ...wizardForm, bobotHarga: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </>
                  )}

                  {/* Enable Live E-Auction */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl md:col-span-2 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
                      <input
                        type="checkbox"
                        checked={wizardForm.eAuctionEnabled}
                        onChange={(e) => setWizardForm({ ...wizardForm, eAuctionEnabled: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 accent-emerald-500"
                      />
                      <span>Aktifkan Fitur Lelang Elektronik Real-Time (E-Auction Live Bidding)</span>
                    </label>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      E-Auction memungkinkan vendor menurunkan penawaran secara live dalam jangka waktu terbatas dengan proteksi perpanjangan waktu otomatis (anti-sniper).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW, APPROVAL & PUBLIKASI */}
            {wizardStep === 5 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Ringkasan Tender & Workflow Approval
                </h3>

                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-slate-400 block font-medium">Judul Tender:</span>
                      <span className="font-bold text-white text-sm block">{wizardForm.judul}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Instansi:</span>
                      <span className="font-bold text-sky-400 block">{wizardForm.instansi}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Nilai HPS:</span>
                      <span className="font-extrabold text-emerald-400 text-sm">{formatRupiah(wizardForm.nilaiHPS)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Metode & Evaluasi:</span>
                      <span className="font-bold text-slate-200">{wizardForm.metodePemilihan} ({wizardForm.metodeEvaluasi})</span>
                    </div>
                  </div>

                  {/* Internal Approval Chain Preview */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-300 block">Alur Approval S2C Internal (Multi-Level):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-400 block font-bold">LEVEL 1</span>
                        <span className="font-bold text-slate-200 block">Manager Procurement</span>
                        <span className="text-[10px] text-amber-400">Verifikasi RAB & Spesifikasi</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-400 block font-bold">LEVEL 2</span>
                        <span className="font-bold text-slate-200 block">VP Supply Chain</span>
                        <span className="text-[10px] text-amber-400">Approval HPS & Jadwal</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                        <span className="text-[10px] text-slate-400 block font-bold">LEVEL 3</span>
                        <span className="font-bold text-slate-200 block">Direktur Keuangan</span>
                        <span className="text-[10px] text-emerald-400">Otorisasi Anggaran Pagu</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => handleWizardSubmit('draft')}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer"
                  >
                    Simpan sebagai Draf
                  </button>

                  <button
                    onClick={() => handleWizardSubmit('approval')}
                    className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim untuk Approval Internal</span>
                  </button>

                  <button
                    onClick={() => handleWizardSubmit('publish')}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Terbitkan Langsung ke Vendor</span>
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Buttons for Wizard Steps */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
              <button
                disabled={wizardStep === 1}
                onClick={() => setWizardStep((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Kembali
              </button>

              {wizardStep < 5 && (
                <button
                  onClick={() => setWizardStep((prev) => Math.min(5, prev + 1))}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Lanjut Ke Langkah {wizardStep + 1}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DAFTAR TENDER SAYA & KELOLA PENAWARAN */}
        {activeSubTab === 'my_tenders' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Left Column: List of Tenders */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Tender yang Anda Kelola</h3>
                <button
                  onClick={() => setActiveSubTab('wizard')}
                  className="text-xs text-emerald-400 hover:underline font-bold"
                >
                  + Tambah
                </button>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {buyerTenders.map((tender) => (
                  <div
                    key={tender.id}
                    onClick={() => handleSelectTender(tender)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedTender?.id === tender.id
                        ? 'bg-slate-900 border-sky-500 ring-2 ring-sky-500/20'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">{tender.kodeTender}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        tender.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' :
                        tender.status === 'pending_approval' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {tender.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-xs line-clamp-2">{tender.judul}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">{tender.kategori}</p>
                    <div className="font-extrabold text-emerald-400 text-xs mt-2">{formatRupiah(tender.nilaiHPS)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Selected Tender Details & Bid Submissions Evaluation */}
            <div className="lg:col-span-2 space-y-6">
              {selectedTender ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
                  {/* Selected Tender Summary Banner */}
                  <div className="border-b border-slate-800 pb-5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-emerald-400 font-bold">{selectedTender.kodeTender}</span>
                      <span className="text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-sky-400" />
                        E-Sign Peruri Direct: {selectedTender.esignStatus === 'signed_peruri' ? 'TERDITANDATANGANI PERURI' : 'BELUM TTD PERURI'}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-white">{selectedTender.judul}</h2>
                    <p className="text-slate-300 text-xs">{selectedTender.deskripsi}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-xs">
                      <div className="p-2.5 bg-slate-950 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Nilai HPS:</span>
                        <span className="font-extrabold text-emerald-400">{formatRupiah(selectedTender.nilaiHPS)}</span>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Evaluasi:</span>
                        <span className="font-bold text-white">{selectedTender.metodeEvaluasi}</span>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Tutup Penawaran:</span>
                        <span className="font-bold text-white">{selectedTender.tanggalTutup}</span>
                      </div>
                      <div className="p-2.5 bg-slate-950 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Total Bids:</span>
                        <span className="font-extrabold text-amber-400">{tenderBids.length} Vendor</span>
                      </div>
                    </div>
                  </div>

                  {/* Internal Approval Workflow Actions */}
                  {selectedTender.status === 'pending_approval' && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                          <Clock className="w-4 h-4" /> Persetujuan Internal S2C Diperlukan
                        </span>
                        <span className="text-slate-400">Approval Level 1 / 3</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproveWorkflowStep(1)}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
                        >
                          Setujui RKS & Terbitkan
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submissions / Bids List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-400" /> Evaluasi Penawaran Vendor Terdaftar
                      </h3>
                      <span className="text-xs text-slate-400">{tenderBids.length} berkas masuk</span>
                    </div>

                    <div className="space-y-3">
                      {tenderBids.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs bg-slate-950 rounded-xl border border-slate-800">
                          Belum ada penawaran vendor yang masuk untuk tender ini.
                        </div>
                      ) : (
                        tenderBids.map((bid) => (
                          <div key={bid.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-bold text-white text-sm">{bid.vendorName}</h4>
                                <span className="text-slate-400 font-mono text-[11px]">{bid.vendorNpwp}</span>
                              </div>
                              <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                                bid.status === 'winner' ? 'bg-emerald-500 text-slate-950' :
                                bid.status === 'shortlisted' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-slate-800 text-slate-300'
                              }`}>
                                {bid.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 bg-slate-900 p-2.5 rounded-xl">
                              <div>
                                <span className="text-slate-400 text-[10px] block">Harga Penawaran:</span>
                                <span className="font-extrabold text-emerald-400">{formatRupiah(bid.offerPrice)}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 text-[10px] block">Skor Teknis:</span>
                                <span className="font-bold text-sky-300">{bid.technicalScore} / 100</span>
                              </div>
                              <div>
                                <span className="text-slate-400 text-[10px] block">Skor Akhir:</span>
                                <span className="font-extrabold text-amber-300">{bid.finalScore} / 100</span>
                              </div>
                            </div>

                            <p className="text-slate-300 text-[11px] italic bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                              Catatan Evaluator: {bid.notes}
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                              <span className="text-slate-500 text-[10px]">Masuk: {bid.submittedAt}</span>
                              <div className="flex items-center gap-2">
                                <a
                                  href="https://e-materai.co.id"
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold text-[11px] rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                                  <span>Portal Peruri Direct</span>
                                </a>

                                {bid.status !== 'winner' && (
                                  <button
                                    onClick={() => handleAwardWinner(bid)}
                                    className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-[11px] rounded-lg shadow-md hover:from-emerald-400 cursor-pointer flex items-center gap-1"
                                  >
                                    <Award className="w-3.5 h-3.5" />
                                    <span>Tetapkan Pemenang & TTD Peruri Direct</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 text-sm bg-slate-900 border border-slate-800 rounded-2xl">
                  Pilih tender dari daftar di sebelah kiri untuk melihat evaluasi dan detail.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: MANAJEMEN VENDOR & SRM */}
        {activeSubTab === 'srm_vendors' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" /> Supplier Relationship Management (SRM)
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Database vendor terdaftar, evaluasi kinerja, scorecard AI, serta manajemen daftar hitam (blacklist).
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  placeholder="Cari nama vendor / NPWP..."
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Vendor Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Nama Vendor & NPWP</th>
                    <th className="p-3.5">Kategori Utama</th>
                    <th className="p-3.5">Rating & Scorecard</th>
                    <th className="p-3.5">Statistik Menang</th>
                    <th className="p-3.5">Status SRM</th>
                    <th className="p-3.5 text-right">Aksi SRM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {buyerVendors
                    .filter((v) => v.name.toLowerCase().includes(vendorSearch.toLowerCase()) || v.npwp.includes(vendorSearch))
                    .map((vendor) => (
                      <tr key={vendor.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <span className="font-bold text-white block text-sm">{vendor.name}</span>
                          <span className="text-[11px] font-mono text-emerald-400">{vendor.npwp}</span>
                          <span className="text-[10px] text-slate-400 block">{vendor.email}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-medium text-slate-200 block">{vendor.category}</span>
                          <span className="text-[10px] text-slate-400">{vendor.sbuCode || 'NIB Active'}</span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1 font-bold text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{vendor.rating} / 5.0</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            Skor Kinerja: <strong className="text-emerald-400">{vendor.performanceScore} pts</strong>
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-white block">{vendor.totalWins} Menang</span>
                          <span className="text-[10px] text-slate-400">dari {vendor.totalBidsSubmitted} penawaran</span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                            vendor.status === 'whitelisted' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                            vendor.status === 'blacklisted' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                            'bg-sky-500/10 text-sky-300 border-sky-500/30'
                          }`}>
                            {vendor.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          {vendor.status !== 'whitelisted' && (
                            <button
                              onClick={() => handleVendorStatusChange(vendor.id, 'whitelisted')}
                              className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-lg font-bold text-[10px] cursor-pointer"
                            >
                              Whitelist
                            </button>
                          )}
                          {vendor.status !== 'blacklisted' && (
                            <button
                              onClick={() => {
                                const reason = prompt(`Alasan blacklist vendor ${vendor.name}:`);
                                if (reason) handleVendorStatusChange(vendor.id, 'blacklisted', reason);
                              }}
                              className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg font-bold text-[10px] cursor-pointer"
                            >
                              Blacklist
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: E-AUCTION REAL-TIME */}
        {activeSubTab === 'e_auction' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <h3 className="text-lg font-black text-white">Ruang Lelang Elektronik Real-Time (E-Auction Live)</h3>
                </div>
                <p className="text-slate-400 text-xs mt-1">
                  Sistem lelang terenkripsi dengan Anti-Sniper Protection (+2 menit jika ada penawaran di menit terakhir).
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Countdown Sisa Waktu</span>
                <span className="text-lg font-mono font-black text-amber-400">01 : 42 : 18</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
              {/* Leaderboard Table */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" /> Live Leaderboard Penawaran Terendah (Anonim)
                </h4>

                <div className="space-y-2">
                  {auctionBids.map((abid, index) => (
                    <div
                      key={abid.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        abid.isWinningRank1
                          ? 'bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/30'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center ${
                          index === 0 ? 'bg-amber-400 text-slate-950' : index === 1 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white'
                        }`}>
                          #{index + 1}
                        </span>
                        <div>
                          <span className="font-bold text-white text-sm block">{abid.vendorAnonName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Waktu: {abid.timestamp}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-emerald-400 block">{formatRupiah(abid.bidAmount)}</span>
                        {abid.isWinningRank1 && (
                          <span className="text-[10px] font-extrabold text-emerald-300 uppercase bg-emerald-500/20 px-2 py-0.5 rounded-md">
                            PERINGKAT 1 SAAT INI
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Bid Simulator Form */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> Simulasi Kirim Penawaran E-Auction
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Nominal Penawaran Baru (IDR):</label>
                    <input
                      type="number"
                      value={auctionBidInput}
                      onChange={(e) => setAuctionBidInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[11px] text-emerald-400 font-bold block mt-1">
                      {formatRupiah(Number(auctionBidInput) || 0)}
                    </span>
                  </div>

                  <button
                    onClick={handlePlaceAuctionBid}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-slate-950 font-black rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-xs"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>Kirim Penawaran Lelang Live</span>
                  </button>

                  <p className="text-[10px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
                    Sistem otomatis memperbarui leaderboard secara instan dan mengaktifkan perpanjangan waktu sniper (+2 menit) untuk transparansi penuh.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FORUM TANYA JAWAB (Q&A) */}
        {activeSubTab === 'qna' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" /> Forum Tanya Jawab & Aanwijzing Resmi
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Klarifikasi dokumen RKS, penjelasan spesifikasi teknis, dan pengumuman addendum dari buyer ke seluruh vendor terdaftar.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {tenderQna.map((item) => (
                <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-sky-400">{item.vendorName}</span>
                    <span className="text-[10px] text-slate-500">{item.askedAt}</span>
                  </div>

                  <p className="text-white text-xs font-medium">T: "{item.question}"</p>

                  {item.buyerAnswer ? (
                    <div className="p-3 bg-slate-900 border-l-4 border-emerald-500 rounded-r-xl space-y-1">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">Jawaban Resmi Buyer:</span>
                      <p className="text-slate-200 text-xs">{item.buyerAnswer}</p>
                      <span className="text-[10px] text-slate-500 block text-right">{item.answeredAt}</span>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <input
                        type="text"
                        value={qnaAnswerInput[item.id] || ''}
                        onChange={(e) => setQnaAnswerInput({ ...qnaAnswerInput, [item.id]: e.target.value })}
                        placeholder="Tulis jawaban resmi buyer..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={() => handleAnswerQna(item.id)}
                        className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg cursor-pointer text-xs"
                      >
                        Publikasikan Jawaban
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: LAPORAN & ANALITIK BUYER */}
        {activeSubTab === 'analytics' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-fade-in text-xs">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Analitik Pengeluaran & Efisiensi Buyer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="font-bold text-white text-sm">Alokasi Anggaran per Kategori</h4>
                <div className="space-y-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300">Pengadaan Barang & IT</span>
                    <span className="text-emerald-400 font-bold">Rp 3.50 Miliar (55%)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[55%]" />
                  </div>

                  <div className="flex justify-between font-medium pt-2">
                    <span className="text-slate-300">Pekerjaan Konstruksi & Fitout</span>
                    <span className="text-sky-400 font-bold">Rp 2.80 Miliar (45%)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full w-[45%]" />
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="font-bold text-white text-sm">Capaian Hemat Anggaran (Cost Savings)</h4>
                <div className="text-3xl font-black text-emerald-400">Rp 400 Juta</div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Efisiensi anggaran rata-rata sebesar <strong>8.2%</strong> dari HPS awal dengan memanfaatkan e-Auction dan lelang bersaing LPSE Radar Pro.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: PRICING PACKAGES */}
        {activeSubTab === 'pricing' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Model Bisnis Buyer LPSE Radar Pro
              </span>
              <h3 className="text-2xl font-black text-white">Paket Langganan Platform Buyer</h3>
              <p className="text-slate-400 text-xs">
                Pilih paket yang sesuai dengan kapasitas pengadaan korporasi atau instansi Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs pt-4">
              {/* Starter */}
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-white text-base">Starter Buyer</h4>
                  <div className="text-2xl font-black text-slate-200 mt-2">Gratis</div>
                  <p className="text-slate-400 text-[11px] mt-1">Untuk UKM / Pembuat Tender Pemula</p>
                  <ul className="space-y-2 text-slate-300 mt-4">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Maksimal 2 Tender / Bulan</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Evaluasi Penawaran Standar</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Forum Q&A Aanwijzing Dasar</li>
                  </ul>
                </div>
                <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl cursor-pointer mt-4">
                  Paket Aktif Saat Ini
                </button>
              </div>

              {/* Business */}
              <div className="p-6 bg-gradient-to-b from-sky-950/80 to-slate-950 border-2 border-sky-500 rounded-2xl space-y-4 relative flex flex-col justify-between shadow-xl">
                <span className="absolute -top-3 right-4 px-3 py-0.5 rounded-full text-[10px] font-black bg-sky-500 text-slate-950 uppercase">
                  RECOMMENDED
                </span>
                <div>
                  <h4 className="font-extrabold text-white text-base">Business Corporate</h4>
                  <div className="text-2xl font-black text-sky-400 mt-2">Rp 4.500.000 <span className="text-xs font-normal text-slate-400">/bulan</span></div>
                  <p className="text-slate-300 text-[11px] mt-1">Untuk Perusahaan Menengah & BUMN</p>
                  <ul className="space-y-2 text-slate-200 mt-4">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" /> Tender Tidak Terbatas</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" /> SRM Vendor Scorecard & Blacklist</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" /> Ruang E-Auction Real-Time</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" /> Integrasi Kontrak MekariSign</li>
                  </ul>
                </div>
                <button className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl shadow-lg cursor-pointer mt-4">
                  Upgrade Ke Business
                </button>
              </div>

              {/* Enterprise */}
              <div className="p-6 bg-slate-950 border border-purple-500/50 rounded-2xl space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-white text-base">Enterprise Custom</h4>
                  <div className="text-2xl font-black text-purple-400 mt-2">Custom Pricing</div>
                  <p className="text-slate-400 text-[11px] mt-1">Untuk Holding / Instansi Pemerintah</p>
                  <ul className="space-y-2 text-slate-300 mt-4">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> S2C & Multi-Level Approval Workflow</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> RESTful Open API & ERP Sync</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Dedicated Account Manager & SLA 99.9%</li>
                  </ul>
                </div>
                <button className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl cursor-pointer mt-4">
                  Hubungi Sales Enterprise
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
