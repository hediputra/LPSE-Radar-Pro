import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Building2,
  Calendar,
  MapPin,
  BookmarkCheck,
  BookmarkPlus,
  Download,
  Eye,
  FileSpreadsheet,
  RotateCcw,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Briefcase,
  Plus,
  ExternalLink
} from 'lucide-react';
import { Tender, TenderFilterParams } from '../types';
import { api, formatRupiah, getStatusBadge, getLpseUrl } from '../services/api';
import { TenderListSkeleton } from './Skeletons';

interface TenderListViewProps {
  initialSearch?: string;
  initialCategory?: string;
  initialStatus?: string;
  selectedLocation?: string | null;
  onSelectTender: (tender: Tender) => void;
  onToggleTrack: (tenderId: string) => void;
  onOpenCreateTenderModal?: () => void;
}

export const TenderListView: React.FC<TenderListViewProps> = ({
  initialSearch = '',
  initialCategory = 'ALL',
  initialStatus = 'ALL',
  selectedLocation = null,
  onSelectTender,
  onToggleTrack,
  onOpenCreateTenderModal
}) => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter States
  const [search, setSearch] = useState(initialSearch);
  const [instansi, setInstansi] = useState('ALL');
  const [kategori, setKategori] = useState(initialCategory);
  const [metode, setMetode] = useState('ALL');
  const [status, setStatus] = useState(initialStatus);
  const [lokasi, setLokasi] = useState(selectedLocation || 'ALL');
  const [minHps, setMinHps] = useState<string>('');
  const [maxHps, setMaxHps] = useState<string>('');
  const [sortBy, setSortBy] = useState<'buka_desc' | 'tutup_asc' | 'hps_desc' | 'hps_asc'>('buka_desc');
  const [page, setPage] = useState(1);

  // Sync selectedLocation prop when updated from Header modal or IP detection
  useEffect(() => {
    if (selectedLocation) {
      setLokasi(selectedLocation);
    } else {
      setLokasi('ALL');
    }
  }, [selectedLocation]);

  // Pagination & Meta Options
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filterOptions, setFilterOptions] = useState<{
    allInstansi: string[];
    allKategori: string[];
    allMetode: string[];
    allLokasi: string[];
  }>({
    allInstansi: [],
    allKategori: [],
    allMetode: [],
    allLokasi: []
  });

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Checkbox Selection State for Bulk Watchlist Action
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionSuccessMsg, setBulkActionSuccessMsg] = useState<string>('');

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllCurrentPage = () => {
    const currentPageIds = tenders.map((t) => t.id);
    const isAllSelected =
      currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id));
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      const combined = Array.from(new Set([...selectedIds, ...currentPageIds]));
      setSelectedIds(combined);
    }
  };

  const handleBulkAddToWatchlist = () => {
    const untrackedSelected = tenders.filter((t) => selectedIds.includes(t.id) && !t.isTracked);
    if (untrackedSelected.length === 0) {
      setBulkActionSuccessMsg('Semua tender terpilih sudah ada di Watchlist!');
      setTimeout(() => setBulkActionSuccessMsg(''), 3000);
      return;
    }

    untrackedSelected.forEach((t) => {
      onToggleTrack(t.id);
    });

    setTenders((prev) =>
      prev.map((t) => (selectedIds.includes(t.id) ? { ...t, isTracked: true } : t))
    );

    setBulkActionSuccessMsg(`Berhasil menambahkan ${untrackedSelected.length} tender ke Watchlist!`);
    setTimeout(() => setBulkActionSuccessMsg(''), 3500);
  };

  const handleBulkRemoveFromWatchlist = () => {
    const trackedSelected = tenders.filter((t) => selectedIds.includes(t.id) && t.isTracked);
    if (trackedSelected.length === 0) {
      setBulkActionSuccessMsg('Tidak ada tender terpilih yang sedang dilacak.');
      setTimeout(() => setBulkActionSuccessMsg(''), 3000);
      return;
    }

    trackedSelected.forEach((t) => {
      onToggleTrack(t.id);
    });

    setTenders((prev) =>
      prev.map((t) => (selectedIds.includes(t.id) ? { ...t, isTracked: false } : t))
    );

    setBulkActionSuccessMsg(`Berhasil menghapus ${trackedSelected.length} tender dari Watchlist!`);
    setTimeout(() => setBulkActionSuccessMsg(''), 3500);
  };

  useEffect(() => {
    fetchTenders();
  }, [search, instansi, kategori, metode, status, lokasi, minHps, maxHps, sortBy, page]);

  const fetchTenders = async () => {
    setLoading(true);
    try {
      const params: TenderFilterParams = {
        search,
        instansi,
        kategori,
        metode,
        status,
        lokasi,
        minHps: minHps ? Number(minHps) : undefined,
        maxHps: maxHps ? Number(maxHps) : undefined,
        sortBy,
        page,
        limit: 8
      };

      const res = await api.getTenders(params);
      setTenders(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotalItems(res.pagination.totalItems);
      setFilterOptions(res.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setInstansi('ALL');
    setKategori('ALL');
    setMetode('ALL');
    setStatus('ALL');
    setLokasi('ALL');
    setMinHps('');
    setMaxHps('');
    setSortBy('buka_desc');
    setPage(1);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari berdasarkan judul, nama instansi, kode tender, atau lokasi..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            {/* Input Lelang Swasta/BUMN Button */}
            {onOpenCreateTenderModal && (
              <button
                onClick={onOpenCreateTenderModal}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-3.5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all shadow-md"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline">Input Lelang Pekerjaan</span>
                <span className="sm:hidden">Buat Lelang</span>
              </button>
            )}

            {/* Toggle Mobile Filter Drawer */}
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span>Filter</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-slate-200 focus:outline-none cursor-pointer font-medium"
              >
                <option value="buka_desc" className="bg-slate-900 text-slate-200">Terbaru Buka</option>
                <option value="tutup_asc" className="bg-slate-900 text-slate-200">Tutup Terdekat</option>
                <option value="hps_desc" className="bg-slate-900 text-slate-200">HPS Tertinggi</option>
                <option value="hps_asc" className="bg-slate-900 text-slate-200">HPS Terendah</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Tampilan Kartu Grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Tampilan Tabel Ringkas"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium">Kategori:</span>
            {['ALL', 'Pekerjaan Konstruksi', 'Pengadaan Barang', 'Jasa Konsultansi Badan Usaha', 'Jasa Lainnya'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setKategori(cat);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  kategori === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat === 'ALL' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>

          {/* Entity Type Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto shrink-0">
            <span className="text-[11px] text-slate-400 px-1.5 font-medium">Penyelenggara:</span>
            <button
              onClick={() => { setSearch(''); setInstansi('ALL'); setPage(1); }}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                !search && instansi === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => { setSearch('Swasta'); setPage(1); }}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                search === 'Swasta' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🏬 Swasta
            </button>
            <button
              onClick={() => { setSearch('BUMN'); setPage(1); }}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                search === 'BUMN' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🏢 BUMN
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Expandable Box */}
      {showFilterDrawer && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-400" />
              Filter Lanjutan Pengadaan LPSE
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Semua Filter
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Filter 1: Instansi */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Instansi / Pemilik Proyek</label>
              <select
                value={instansi}
                onChange={(e) => {
                  setInstansi(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">Semua Instansi</option>
                {filterOptions.allInstansi.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>

            {/* Filter 2: Metode Pengadaan */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Metode Pengadaan</label>
              <select
                value={metode}
                onChange={(e) => {
                  setMetode(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">Semua Metode</option>
                {filterOptions.allMetode.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Filter 3: Status Tender */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Status Tahapan Lelang</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">Semua Status</option>
                <option value="pengumuman">Pengumuman Tender</option>
                <option value="prakualifikasi">Prakualifikasi</option>
                <option value="upload_penawaran">Upload Penawaran</option>
                <option value="evaluasi">Evaluasi Penawaran</option>
                <option value="pemenang">Pengumuman Pemenang</option>
                <option value="selesai">Selesai / Kontrak</option>
              </select>
            </div>

            {/* Filter 4: Range HPS */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">Nilai HPS Minimal (IDR)</label>
              <input
                type="number"
                value={minHps}
                onChange={(e) => {
                  setMinHps(e.target.value);
                  setPage(1);
                }}
                placeholder="Contoh: 1000000000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results Header Info Bar & Select All Control */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400 px-1">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-300 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
            <input
              type="checkbox"
              checked={tenders.length > 0 && tenders.every((t) => selectedIds.includes(t.id))}
              onChange={handleSelectAllCurrentPage}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
            />
            <span>Pilih Semua Halaman Ini</span>
          </label>

          <div>
            Menampilkan <span className="font-bold text-white">{tenders.length}</span> dari{' '}
            <span className="font-bold text-emerald-400">{totalItems}</span> paket tender
          </div>
        </div>

        <a
          href="/api/export/csv"
          download
          className="flex items-center gap-1.5 text-emerald-400 hover:underline font-semibold cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Unduh Hasil (CSV)</span>
        </a>
      </div>

      {/* Floating Sticky Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-3.5 sm:p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in text-xs sticky top-4 z-30 bg-slate-900/95 backdrop-blur-md">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs">
                {selectedIds.length}
              </span>
              <span className="font-bold text-white text-xs sm:text-sm">
                Tender Dipilih
              </span>
            </div>

            <button
              onClick={handleSelectAllCurrentPage}
              className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
            >
              {tenders.every((t) => selectedIds.includes(t.id))
                ? 'Batal Pilih Semua'
                : 'Pilih Semua Halaman Ini'}
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {bulkActionSuccessMsg && (
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg animate-pulse">
                {bulkActionSuccessMsg}
              </span>
            )}

            <button
              onClick={handleBulkAddToWatchlist}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
            >
              <BookmarkPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah ke Watchlist</span>
            </button>

            <button
              onClick={handleBulkRemoveFromWatchlist}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 border border-slate-700 font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span className="hidden md:inline">Hapus dari Watchlist</span>
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Bersihkan pilihan"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton or Tenders Grid/Table */}
      {loading ? (
        <TenderListSkeleton viewMode={viewMode} count={6} />
      ) : tenders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Search className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Tidak ada tender yang sesuai</h3>
          <p className="text-xs max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau reset filter kategori & nilai HPS Anda.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer hover:bg-emerald-400"
          >
            Reset Filter
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tenders.map((tender) => {
            const badge = getStatusBadge(tender.status);
            const isSelected = selectedIds.includes(tender.id);

            return (
              <div
                key={tender.id}
                className={`bg-slate-900 border rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between group relative ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-slate-900/90'
                    : 'border-slate-800 hover:border-emerald-500/50'
                }`}
              >
                <div>
                  {/* Status & Checkbox & Track Action Row */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Individual Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(tender.id)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500 shrink-0"
                        title="Pilih tender ini"
                      />

                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${badge.bg}`}>
                        {badge.label}
                      </span>

                      {/* 24-Hour Urgent Closing Badge */}
                      {(() => {
                        const target = tender.tanggalTutup.includes('T')
                          ? new Date(tender.tanggalTutup).getTime()
                          : new Date(`${tender.tanggalTutup}T23:59:59`).getTime();
                        const diff = target - Date.now();
                        const isClosingWithin24h = diff > 0 && diff <= 24 * 60 * 60 * 1000;

                        if (isClosingWithin24h) {
                          const hours = Math.floor(diff / (1000 * 60 * 60));
                          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                          return (
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse flex items-center gap-1">
                              🔥 TUTUP &lt; {hours}j {mins}m
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    <button
                      onClick={() => onToggleTrack(tender.id)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        tender.isTracked
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
                      }`}
                      title={tender.isTracked ? 'Dihapus dari watchlist' : 'Lacak tender ini'}
                    >
                      {tender.isTracked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-400" />
                      ) : (
                        <BookmarkPlus className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Title & Agency */}
                  <h3
                    onClick={() => onSelectTender(tender)}
                    className="font-bold text-base text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-2 mb-2 cursor-pointer"
                  >
                    {tender.judul}
                  </h3>

                  <div className="space-y-1 text-xs text-slate-400 mb-4">
                    <p className="flex items-center gap-1.5 line-clamp-1 font-medium text-slate-300">
                      <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      {tender.instansi}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      {tender.lokasi}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      {tender.kategori} • <span className="text-slate-300 font-medium">{tender.metode}</span>
                    </p>
                  </div>
                </div>

                {/* HPS Value & Dates Bar */}
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">
                        Nilai HPS:
                      </span>
                      <span className="font-extrabold text-emerald-400 text-sm">
                        {formatRupiah(tender.nilaiHPS)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">Batas Tutup:</span>
                      <span className="font-semibold text-slate-200 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {tender.tanggalTutup}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => onSelectTender(tender)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Detail & Dokumen</span>
                    </button>

                    <a
                      href={getLpseUrl(tender)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-sky-950/80 hover:bg-sky-900 text-sky-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-sky-800/80 cursor-pointer shrink-0"
                      title="Buka Halaman Pengumuman Resmi SPSE / LPSE"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                      <span>LPSE</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact Table View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={tenders.length > 0 && tenders.every((t) => selectedIds.includes(t.id))}
                      onChange={handleSelectAllCurrentPage}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                      title="Pilih semua tender di halaman ini"
                    />
                  </th>
                  <th className="p-3.5">Kode & Title</th>
                  <th className="p-3.5">Instansi & Lokasi</th>
                  <th className="p-3.5">Kategori</th>
                  <th className="p-3.5">Nilai HPS</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {tenders.map((tender) => {
                  const badge = getStatusBadge(tender.status);
                  const isSelected = selectedIds.includes(tender.id);

                  return (
                    <tr
                      key={tender.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-emerald-950/20' : ''
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(tender.id)}
                          className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                        />
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <span className="text-[10px] font-mono text-emerald-400 block font-semibold">
                          #{tender.kodeTender}
                        </span>
                        <span
                          onClick={() => onSelectTender(tender)}
                          className="font-bold text-slate-100 hover:text-emerald-300 transition-colors cursor-pointer line-clamp-2"
                        >
                          {tender.judul}
                        </span>
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <span className="font-medium text-slate-200 block line-clamp-1">{tender.instansi}</span>
                        <span className="text-slate-400 text-[11px]">{tender.lokasi}</span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {tender.kategori}
                        </span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap font-extrabold text-emerald-400">
                        {formatRupiah(tender.nilaiHPS)}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => onSelectTender(tender)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium cursor-pointer border border-slate-700"
                        >
                          Detail
                        </button>
                        <a
                          href={getLpseUrl(tender)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-sky-950 hover:bg-sky-900 text-sky-300 font-bold cursor-pointer border border-sky-800/80 inline-flex items-center gap-1"
                          title="Buka Pengumuman Resmi LPSE"
                        >
                          <ExternalLink className="w-3 h-3 text-sky-400" />
                          <span>LPSE</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300">
          <span>
            Halaman <span className="font-bold text-white">{page}</span> dari{' '}
            <span className="font-bold text-white">{totalPages}</span>
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-8 h-8 rounded-xl font-bold cursor-pointer transition-colors ${
                  page === pageNum
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
