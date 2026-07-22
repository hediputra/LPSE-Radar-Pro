import React, { useState } from 'react';
import {
  BookmarkCheck,
  Bell,
  Trash2,
  Eye,
  Mail,
  ShieldCheck,
  FileSpreadsheet,
  Clock,
  Building2,
  Calendar,
  AlertCircle,
  Check
} from 'lucide-react';
import { Tender, AppNotification } from '../types';
import { formatRupiah, getStatusBadge } from '../services/api';

interface WatchlistViewProps {
  trackedTenders: Tender[];
  notifications: AppNotification[];
  onSelectTender: (tender: Tender) => void;
  onUntrackTender: (tenderId: string) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  trackedTenders,
  notifications,
  onSelectTender,
  onUntrackTender
}) => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [scheduleAlerts, setScheduleAlerts] = useState(true);
  const [winnerAlerts, setWinnerAlerts] = useState(true);
  const [saveToast, setSaveToast] = useState(false);

  const handleSaveSettings = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <BookmarkCheck className="w-3.5 h-3.5" />
              Watchlist Terpersonalisasi
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Tender Dilacak & Pusat Notifikasi
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Pantau status terbaru, perubahan jadwal, dan pengumuman pemenang untuk paket tender yang Anda ikuti secara otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/export/csv"
            download
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3.5 py-2 rounded-xl text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Ekspor Watchlist CSV</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tracked Tenders List (2 cols on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-amber-400" />
              Daftar Tender Dilacak ({trackedTenders.length})
            </h2>
          </div>

          {trackedTenders.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
              <BookmarkCheck className="w-12 h-12 text-slate-700 mx-auto" />
              <h3 className="text-base font-bold text-white">Belum Ada Tender Dilacak</h3>
              <p className="text-xs max-w-sm mx-auto">
                Anda dapat menambahkan tender ke daftar ini dengan mengeklik tombol "Lacak Tender" pada halaman Cari Tender.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {trackedTenders.map((tender) => {
                const badge = getStatusBadge(tender.status);
                return (
                  <div
                    key={tender.id}
                    className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>

                        <button
                          onClick={() => onUntrackTender(tender.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
                          title="Hapus dari watchlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3
                        onClick={() => onSelectTender(tender)}
                        className="font-bold text-sm text-slate-100 hover:text-emerald-300 transition-colors cursor-pointer line-clamp-2 mb-1.5"
                      >
                        {tender.judul}
                      </h3>

                      <p className="text-xs text-slate-400 flex items-center gap-1.5 line-clamp-1 mb-3">
                        <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        {tender.instansi}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Nilai HPS:</span>
                        <span className="font-extrabold text-emerald-400">{formatRupiah(tender.nilaiHPS)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Tutup {tender.tanggalTutup}
                        </span>

                        <button
                          onClick={() => onSelectTender(tender)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer border border-slate-700 flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Detail</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Notification Settings & History */}
        <div className="space-y-6">
          {/* Email Notification Settings Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Mail className="w-4 h-4 text-emerald-400" />
              Pengaturan Notifikasi Email
            </h3>

            {saveToast && (
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                Pengaturan notifikasi berhasil disimpan!
              </div>
            )}

            <div className="space-y-3 text-xs text-slate-300">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Notifikasi Email Langsung</span>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Peringatan Perubahan Jadwal</span>
                <input
                  type="checkbox"
                  checked={scheduleAlerts}
                  onChange={(e) => setScheduleAlerts(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Pengumuman Pemenang Tender</span>
                <input
                  type="checkbox"
                  checked={winnerAlerts}
                  onChange={(e) => setWinnerAlerts(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </label>
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Simpan Pengaturan Alert
            </button>
          </div>

          {/* History of Notifications Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Bell className="w-4 h-4 text-blue-400" />
              Riwayat Notifikasi Terbaru
            </h3>

            <div className="space-y-2.5 text-xs">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-semibold text-emerald-300 block line-clamp-1">{notif.tenderTitle}</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {new Date(notif.date).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
