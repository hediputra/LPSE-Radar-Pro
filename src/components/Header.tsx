import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Bell,
  RefreshCw,
  BookmarkCheck,
  TrendingUp,
  FileCode2,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  MapPin,
  Navigation,
  Compass,
  Shield,
  Layers,
  ChevronDown,
  Globe2,
  Home,
  Smartphone,
  Target,
  Plus
} from 'lucide-react';
import { api } from '../services/api';
import { AppNotification } from '../types';
import { LocationNodeModal } from './LocationNodeModal';
import { SpseInaprocModal } from './SpseInaprocModal';
import { Tenant, MOCK_TENANTS } from '../data/mockTenants';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchSubmit: (query: string) => void;
  trackedCount: number;
  selectedLocation: string | null;
  onSelectLocation: (loc: string | null) => void;
  onSyncComplete?: () => void;
  currentTenant: Tenant;
  onSwitchTenant: (tenant: Tenant) => void;
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
  onOpenCreateTenderModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSearchSubmit,
  trackedCount,
  selectedLocation,
  onSelectLocation,
  onSyncComplete,
  currentTenant,
  onSwitchTenant,
  onOpenAuthModal,
  onOpenCreateTenderModal
}) => {
  const [quickSearch, setQuickSearch] = useState('');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSpseModalOpen, setIsSpseModalOpen] = useState(false);
  const [isDetectingIp, setIsDetectingIp] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAutoDetectIpQuick = async () => {
    setIsDetectingIp(true);
    setSyncStatusMsg('Mendeteksi lokasi dari IP address...');
    try {
      const locData = await api.detectIpLocation();
      if (locData.detectedLocation) {
        onSelectLocation(locData.detectedLocation);
        setSyncStatusMsg(`📍 Lokasi terdeteksi dari IP: ${locData.detectedLocation}`);
      }
    } catch (err) {
      setSyncStatusMsg('Gagal mendeteksi lokasi IP');
    } finally {
      setIsDetectingIp(false);
      setTimeout(() => setSyncStatusMsg(null), 4000);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearchSubmit(quickSearch);
      setActiveTab('tenders');
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatusMsg('Menghubungkan ke node LPSE via pyproc...');
    try {
      const res = await api.triggerSync();
      setSyncStatusMsg(`Sync sukses! Data diperbarui pukul ${new Date().toLocaleTimeString('id-ID')}`);
      await loadNotifications();
      if (onSyncComplete) onSyncComplete();
    } catch (err) {
      setSyncStatusMsg('Gagal melakukan sinkronisasi LPSE');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusMsg(null), 4000);
    }
  };

  const handleMarkAllRead = async () => {
    for (const notif of notifications.filter((n) => !n.read)) {
      await api.markNotificationRead(notif.id);
    }
    await loadNotifications();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-lg">
      {/* Top Banner Status Bar */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            pyproc v0.4.2 Active
          </span>
          <span className="hidden md:inline text-slate-400">
            680+ LPSE Nodes (416 Kabupaten • 98 Kota • Kementerian)
          </span>
        </div>

        {/* IP Auto-detect Location Quick Action */}
        <div className="flex items-center space-x-2">
          {syncStatusMsg && (
            <span className="text-emerald-300 bg-emerald-950/80 border border-emerald-800/50 px-2 py-0.5 rounded text-xs animate-fade-in">
              {syncStatusMsg}
            </span>
          )}

          <button
            onClick={handleAutoDetectIpQuick}
            disabled={isDetectingIp}
            className="flex items-center gap-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded transition-colors text-xs cursor-pointer border border-indigo-500/30"
            title="Auto-detect lokasi Anda berdasarkan IP address"
          >
            <Navigation className={`w-3.5 h-3.5 ${isDetectingIp ? 'animate-spin text-indigo-400' : ''}`} />
            <span className="hidden sm:inline">📍 Auto-Detect IP</span>
          </button>

          <button
            onClick={() => setIsSpseModalOpen(true)}
            className="flex items-center gap-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 px-2.5 py-1 rounded transition-colors text-xs cursor-pointer border border-sky-400/40 font-bold"
            title="Buka Konsol Integrasi Auto-Ingest Data SPSE INAPROC (https://spse.inaproc.id/)"
          >
            <Globe2 className="w-3.5 h-3.5 text-sky-400" />
            <span>⚡ Auto Ingest SPSE</span>
          </button>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded transition-colors disabled:opacity-50 text-xs cursor-pointer border border-slate-700"
            title="Sikronkan data tender LPSE terbaru via pyproc"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan pyproc'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 p-0.5 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">
                LPSE<span className="text-emerald-400">Radar</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Portal Intelijen Tender Pengadaan Barang/Jasa LPSE Indonesia
            </p>
          </div>
        </div>

        {/* Location Picker Badge / Button */}
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 px-3 py-1.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer group"
        >
          <MapPin className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <span className="text-[10px] text-slate-400 block -mb-0.5 font-medium">Lokasi / Node LPSE:</span>
            <span className="font-bold text-white max-w-[140px] sm:max-w-[180px] truncate block">
              {selectedLocation || 'Semua Kabupaten / Kota'}
            </span>
          </div>
          <Compass className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </button>

        {/* Quick Search Header Bar */}
        <div className="flex-1 max-w-sm hidden lg:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Cari tender cepat (misal: Lebak, Jembatan, PUPR)... [Enter]"
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Language Switcher (i18n ID / EN) */}
          <button
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Switch Language / Ganti Bahasa"
          >
            <Globe2 className="w-3.5 h-3.5 text-sky-400" />
            <span>{language === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
          </button>

          {/* Multi-Tenant Organization Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowTenantDropdown(!showTenantDropdown)}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 px-3 py-1.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
              title="Ganti Tenant Perusahaan Klien SaaS"
            >
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                style={{ backgroundColor: currentTenant.branding.primaryColor }}
              ></span>
              <div className="text-left hidden md:block">
                <span className="text-[9px] text-slate-400 block -mb-0.5 uppercase tracking-wider font-extrabold">
                  {currentTenant.tier} TENANT
                </span>
                <span className="font-bold text-white max-w-[120px] truncate block">
                  {currentTenant.name}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* Tenant Selector Menu */}
            {showTenantDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden text-slate-200 animate-fade-in">
                <div className="p-3 bg-slate-950 border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-300">Tenant / Klien Aktif</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                      Multi-Tenant
                    </span>
                  </div>
                </div>

                <div className="p-1 space-y-1 max-h-60 overflow-y-auto">
                  {MOCK_TENANTS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSwitchTenant(t);
                        setShowTenantDropdown(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        currentTenant.id === t.id
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-white font-bold'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full inline-block"
                            style={{ backgroundColor: t.branding.primaryColor }}
                          ></span>
                          <span className="truncate max-w-[150px]">{t.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {t.branding.subdomain}.ptfas.co.id
                        </span>
                      </div>

                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                        {t.tier}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setShowTenantDropdown(false);
                      setActiveTab('saas-portal');
                    }}
                    className="text-xs text-emerald-400 font-bold hover:underline cursor-pointer flex items-center justify-center gap-1 w-full"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Pusat Operasional PT Fas SaaS &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 transition-colors border border-slate-700/60 cursor-pointer"
              title="Notifikasi tender"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-slate-900 animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Menu */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden text-slate-200 animate-fade-in">
                <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-sm">Notifikasi Tender</span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-emerald-400 hover:underline cursor-pointer"
                    >
                      Tandai Dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      Belum ada notifikasi baru
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 text-xs transition-colors hover:bg-slate-800/50 ${
                          !notif.read ? 'bg-slate-800/30' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-semibold text-emerald-300 line-clamp-1">
                            {notif.tenderTitle}
                          </span>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-slate-300 leading-relaxed mb-1.5">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(notif.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 bg-slate-950 text-center border-t border-slate-800">
                  <button
                    onClick={() => {
                      setShowNotifDropdown(false);
                      setActiveTab('watchlist');
                    }}
                    className="text-xs text-emerald-400 font-medium hover:underline cursor-pointer"
                  >
                    Lihat Semua Tender Dilacak ({trackedCount})
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Watchlist Button */}
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
              activeTab === 'watchlist'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-semibold'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700/60'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Dilacak</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950/40 text-xs font-bold">
              {trackedCount}
            </span>
          </button>

          {/* Post Private / BUMN Tender Button */}
          {onOpenCreateTenderModal && (
            <button
              onClick={onOpenCreateTenderModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all cursor-pointer"
              title="Buat Pengadaan / Lelang Pekerjaan untuk Swasta atau BUMN"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden md:inline">Buat Lelang Pekerjaan</span>
              <span className="inline md:hidden">Lelang</span>
            </button>
          )}

          {/* Login & Sign Up Quick Action */}
          {onOpenAuthModal && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
              >
                Masuk
              </button>

              <button
                onClick={() => onOpenAuthModal('signup')}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs rounded-lg shadow transition-all cursor-pointer hidden md:flex items-center gap-1"
              >
                <span>Daftar Gratis</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <nav className="bg-slate-950/90 border-t border-slate-800/80 px-4">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto scrollbar-none py-1.5">
          <button
            onClick={() => setActiveTab('landing')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
              activeTab === 'landing'
                ? 'bg-rose-600 text-white border-rose-500 shadow-md font-extrabold'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
            }`}
          >
            <Home className="w-4 h-4 text-rose-400" />
            Halaman Depan
            <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 text-[9px] font-mono border border-rose-500/30">
              Landing
            </span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-blue-400" />
            Dashboard Utama
          </button>

          <button
            onClick={() => setActiveTab('tenders')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'tenders'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-4 h-4 text-emerald-400" />
            Cari & Filter Tender
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
              activeTab === 'map'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg font-black'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            Peta Tender Indonesia
            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[9px] font-mono border border-emerald-500/30 font-bold">
              GIS SPSE
            </span>
          </button>

          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'watchlist'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-amber-400" />
            Tender Dilacak
            {trackedCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded text-[10px] font-bold">
                {trackedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-purple-400" />
            Analisis Tren & Vendor
          </button>

          <button
            onClick={() => setActiveTab('competitors')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
              activeTab === 'competitors'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg font-black'
                : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20'
            }`}
          >
            <Target className="w-4 h-4 text-indigo-400" />
            Analisis Kompetitor
            <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 text-[9px] font-mono border border-indigo-500/30 font-bold">
              AI INTEL
            </span>
          </button>

          <button
            onClick={() => setActiveTab('mobile-app')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
              activeTab === 'mobile-app'
                ? 'bg-rose-600 text-white border-rose-400 shadow-lg font-black'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
            }`}
          >
            <Smartphone className="w-4 h-4 text-rose-400" />
            App Mobile Native
            <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 text-[9px] font-mono border border-rose-500/30">
              iOS & Android
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pyproc-docs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'pyproc-docs'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileCode2 className="w-4 h-4 text-indigo-400" />
            Arsitektur & pyproc
          </button>

          <button
            onClick={() => setActiveTab('buyer-dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
              activeTab === 'buyer-dashboard'
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-lg font-black'
                : 'bg-sky-500/10 text-sky-300 border-sky-500/30 hover:bg-sky-500/20'
            }`}
          >
            <Building2 className="w-4 h-4 text-sky-400" />
            Portal Pengadaan Buyer
            <span className="px-1.5 py-0.2 rounded bg-sky-950 text-sky-300 text-[9px] font-mono border border-sky-500/30">
              Yonyou S2C
            </span>
          </button>

          <button
            onClick={() => setActiveTab('saas-portal')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
              activeTab === 'saas-portal'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg font-black'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            <Shield className="w-4 h-4" />
            PT Fas Operations Portal
            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 text-[9px] font-mono border border-emerald-500/30">
              SaaS B2B
            </span>
          </button>
        </div>
      </nav>

      {/* Location & Nodes Selector Modal */}
      <LocationNodeModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={onSelectLocation}
      />

      {/* SPSE Inaproc Multi-Portal Auto-Ingestion Console Modal */}
      <SpseInaprocModal
        isOpen={isSpseModalOpen}
        onClose={() => setIsSpseModalOpen(false)}
        onSyncComplete={onSyncComplete}
      />
    </header>
  );
};
