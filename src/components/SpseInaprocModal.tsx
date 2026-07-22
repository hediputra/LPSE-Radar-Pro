import React, { useState, useEffect } from 'react';
import {
  Globe,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  X,
  Server,
  DownloadCloud,
  Check,
  Copy,
  Search,
  Building2,
  ListFilter,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { Tender } from '../types';
import { formatFullRupiah } from '../services/api';

interface SpseInaprocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete?: () => void;
  onSelectTender?: (tender: Tender) => void;
}

interface PortalItem {
  name: string;
  slug: string;
  url: string;
  isOnline: boolean;
  activeTenderCount: number;
}

export const SpseInaprocModal: React.FC<SpseInaprocModalProps> = ({
  isOpen,
  onClose,
  onSyncComplete,
  onSelectTender
}) => {
  const [portals, setPortals] = useState<PortalItem[]>([]);
  const [isLoadingPortals, setIsLoadingPortals] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncReport, setSyncReport] = useState<{
    success: boolean;
    message: string;
    ingestedCount: number;
    totalTendersInStore: number;
    syncTimestamp: string;
    ingestedTenders: Tender[];
  } | null>(null);

  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadPortals();
    }
  }, [isOpen]);

  const loadPortals = async () => {
    setIsLoadingPortals(true);
    try {
      const res = await api.getSpsePortals();
      setPortals(res.portals || []);
    } catch (err) {
      console.error('Failed to load SPSE portals:', err);
    } finally {
      setIsLoadingPortals(false);
    }
  };

  const handleAutoIngest = async () => {
    setIsSyncing(true);
    try {
      const report = await api.syncSpseInaproc();
      setSyncReport(report);
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (!isOpen) return null;

  const filteredPortals = portals.filter(
    (p) =>
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.url.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-sky-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-sky-950 via-slate-900 to-slate-950 border-b border-sky-800/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Integrasi Analisis SPSE INAPROC
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                  https://spse.inaproc.id/
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pusat Ekstraksi & Auto-Ingestion Data Lelang Pengadaan Barang/Jasa Nasional LKPP
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-5 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-xs text-slate-300 font-medium block">
              Sistem Otomatis Ingest SPSE Inaproc:
            </span>
            <span className="text-xs text-slate-400">
              Menghubungkan {portals.length} server LPSE daerah & pusat (LKPP, PUPR, Lebak, Bandung, DKI Jakarta, dll)
            </span>
          </div>

          <button
            onClick={handleAutoIngest}
            disabled={isSyncing}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-sky-600 via-sky-500 to-emerald-500 hover:from-sky-500 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            <DownloadCloud className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
            <span>{isSyncing ? 'Mengekstrak Data SPSE...' : '⚡ Auto Ingest Semua Data SPSE'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Sync Report Banner if triggered */}
          {syncReport && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{syncReport.message}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">
                  {new Date(syncReport.syncTimestamp).toLocaleTimeString('id-ID')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <div className="p-2 bg-emerald-900/40 rounded-lg border border-emerald-800/40 text-center">
                  <span className="text-[10px] text-slate-400 block">Tender Diimpor</span>
                  <span className="font-extrabold text-emerald-300 text-sm">+{syncReport.ingestedCount}</span>
                </div>
                <div className="p-2 bg-emerald-900/40 rounded-lg border border-emerald-800/40 text-center">
                  <span className="text-[10px] text-slate-400 block">Total di Database</span>
                  <span className="font-extrabold text-white text-sm">{syncReport.totalTendersInStore}</span>
                </div>
                <div className="p-2 bg-emerald-900/40 rounded-lg border border-emerald-800/40 text-center">
                  <span className="text-[10px] text-slate-400 block">Portal Tersinkron</span>
                  <span className="font-extrabold text-sky-300 text-sm">{syncReport.spsePortalsSynced.length} Portal</span>
                </div>
                <div className="p-2 bg-emerald-900/40 rounded-lg border border-emerald-800/40 text-center">
                  <span className="text-[10px] text-slate-400 block">Format URL</span>
                  <span className="font-mono text-[10px] text-slate-300 truncate block">spse.inaproc.id</span>
                </div>
              </div>

              {/* Sample Ingested List */}
              {syncReport.ingestedTenders && syncReport.ingestedTenders.length > 0 && (
                <div className="pt-2 border-t border-emerald-900/50 space-y-2">
                  <span className="text-xs font-bold text-slate-200 block">
                    Daftar Tender SPSE Inaproc Terbaru yang Berhasil Dimasukkan:
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {syncReport.ingestedTenders.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-white text-xs block truncate">
                            {item.judul}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {item.instansi} • HPS: {formatFullRupiah(item.nilaiHPS)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <a
                            href={item.source_url || `https://spse.inaproc.id/lkpp/lelang/${item.kodeTender}/pengumumanlelang`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-sky-600/80 hover:bg-sky-500 text-white rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Buka SPSE</span>
                          </a>
                          {onSelectTender && (
                            <button
                              onClick={() => {
                                onSelectTender(item);
                                onClose();
                              }}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold cursor-pointer"
                            >
                              Detail
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SPSE Inaproc Direct URL Mapping Scheme Explanation */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Struktur Skema URL Resmi SPSE INAPROC National System</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sistem secara otomatis mengarahkan dan memasukkan data tender sesuai spesifikasi baku LKPP RI:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-slate-400 font-semibold block">Format Halaman Utama Portal:</span>
                <code className="text-sky-300 font-mono text-[10px] block mt-0.5">https://spse.inaproc.id/[SLUG]/lelang</code>
                <span className="text-[10px] text-slate-400 mt-1 block">Contoh: /lkpp, /lebakkab, /bandung, /jakarta</span>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-slate-400 font-semibold block">Format Direct Pengumuman Lelang:</span>
                <code className="text-emerald-300 font-mono text-[10px] block mt-0.5">https://spse.inaproc.id/[SLUG]/lelang/[KODE]/pengumumanlelang</code>
                <span className="text-[10px] text-slate-400 mt-1 block">Langsung membuka berkas pengumuman lelang resmi</span>
              </div>
            </div>
          </div>

          {/* Portal List Index */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-sky-400" />
                Daftar Portal Monitored SPSE INAPROC ({filteredPortals.length} Server)
              </h4>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari portal (e.g. bandung, lebak)..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {filteredPortals.map((portal) => (
                <div
                  key={portal.slug}
                  className="p-3 bg-slate-950/70 border border-slate-800 hover:border-sky-500/40 rounded-xl flex items-center justify-between gap-2 transition-all group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs truncate">
                        {portal.name}
                      </span>
                      <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[9px] font-mono">
                        Online
                      </span>
                    </div>
                    <code className="text-[10px] text-sky-400 font-mono mt-0.5 block truncate">
                      {portal.url}
                    </code>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleCopy(portal.url)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Salin URL Portal SPSE"
                    >
                      {copiedUrl === portal.url ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-sky-950/80 hover:bg-sky-600 text-sky-300 hover:text-white transition-colors cursor-pointer"
                      title="Buka Portal SPSE di Tab Baru"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>
            Powered by SPSE Inaproc Engine & pyproc API Parser • Terhubung Langsung ke Sistem LKPP RI
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup Console
          </button>
        </div>
      </div>
    </div>
  );
};
