import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Database,
  ExternalLink,
  ChevronRight,
  Shield,
  Zap,
  RotateCw,
  Sparkles,
  CreditCard,
  Layers,
  Globe2,
  Check,
  XCircle,
  Activity,
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';
import { Tenant, SubscriptionTier, SubscriptionStatus, SUBSCRIPTION_TIERS } from '../data/mockTenants';
import { api, formatRupiah, formatFullRupiah } from '../services/api';

interface TenantManagementViewProps {
  tenants: Tenant[];
  summaryData?: any;
  loading: boolean;
  onRefreshData: () => void;
  onSwitchTenant: (tenant: Tenant) => void;
  onOpenNewTenantModal: () => void;
}

export const TenantManagementView: React.FC<TenantManagementViewProps> = ({
  tenants = [],
  summaryData,
  loading,
  onRefreshData,
  onSwitchTenant,
  onOpenNewTenantModal
}) => {
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SubscriptionStatus>('ALL');
  const [tierFilter, setTierFilter] = useState<'ALL' | SubscriptionTier>('ALL');

  // Syncing States
  const [syncingTenantId, setSyncingTenantId] = useState<string | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncNotice, setSyncNotice] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
    details?: any;
  } | null>(null);

  // Tenant Subscription Edit Modal State
  const [selectedTenantForEdit, setSelectedTenantForEdit] = useState<Tenant | null>(null);
  const [editStatus, setEditStatus] = useState<SubscriptionStatus>('active');
  const [editTier, setEditTier] = useState<SubscriptionTier>('BUSINESS');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Detail Drawer / Modal State
  const [inspectTenant, setInspectTenant] = useState<Tenant | null>(null);

  // Manual Trigger Data Sync for a specific tenant
  const handleTriggerSync = async (tenant: Tenant, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSyncingTenantId(tenant.id);
    setSyncNotice(null);

    try {
      const res = await api.syncSaasTenant(tenant.id);
      setSyncNotice({
        type: 'success',
        title: `✓ Sinkronisasi LPSE "${tenant.name}" Sukses!`,
        message: res.message || `Data tender untuk ${tenant.name} berhasil diperbarui secara real-time.`,
        details: res.syncDetails
      });
      // Refresh parent state to get updated tenant store
      onRefreshData();
    } catch (err: any) {
      setSyncNotice({
        type: 'error',
        title: `Gagal Sinkronisasi ${tenant.name}`,
        message: err.message || 'Terjadi kesalahan saat menghubungi server scraping pyproc.'
      });
    } finally {
      setSyncingTenantId(null);
    }
  };

  // Trigger Bulk Sync for All Active Tenants
  const handleTriggerSyncAll = async () => {
    setIsSyncingAll(true);
    setSyncNotice(null);

    try {
      const res = await api.syncAllSaasTenants();
      setSyncNotice({
        type: 'success',
        title: `✓ Sinkronisasi Massal Semua Tenant Berhasil!`,
        message: res.message || `Seluruh ${tenants.length} tenant aktif telah disinkronkan ke database LPSE PT Fas.`,
        details: { totalTenants: res.totalTenantsSynced, timestamp: new Date().toLocaleTimeString('id-ID') }
      });
      onRefreshData();
    } catch (err: any) {
      setSyncNotice({
        type: 'error',
        title: 'Gagal Sinkronisasi Massal',
        message: err.message || 'Gagal menyinkronkan seluruh tenant.'
      });
    } finally {
      setIsSyncingAll(false);
    }
  };

  // Submit Subscription Status & Tier Update
  const handleUpdateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenantForEdit) return;

    setEditSubmitting(true);
    try {
      await api.updateSaasTenantStatus(selectedTenantForEdit.id, {
        status: editStatus,
        tier: editTier
      });
      setSyncNotice({
        type: 'success',
        title: '✓ Status Langganan Diperbarui',
        message: `Tenant "${selectedTenantForEdit.name}" telah diubah ke status [${editStatus.toUpperCase()}] dan paket [${editTier}].`
      });
      setSelectedTenantForEdit(null);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Gagal mengedit tenant');
    } finally {
      setEditSubmitting(false);
    }
  };

  // Filtered tenants list
  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.branding.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.npwp.includes(searchQuery);

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesTier = tierFilter === 'ALL' || t.tier === tierFilter;

    return matchesSearch && matchesStatus && matchesTier;
  });

  // Analytics Metrics
  const activeCount = tenants.filter((t) => t.status === 'active').length;
  const trialCount = tenants.filter((t) => t.status === 'trial').length;
  const expiredCount = tenants.filter((t) => t.status === 'expired' || t.status === 'canceled').length;
  const totalMrr = tenants.reduce((acc, t) => acc + (t.status === 'active' ? t.mrrAmount : 0), 0);

  return (
    <div className="space-y-6">
      
      {/* SaaS Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total Tenant Terdaftar</span>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/30">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{tenants.length}</span>
            <span className="text-xs text-emerald-400 font-semibold">{activeCount} Aktif</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {trialCount} Dalam Masa Trial • {expiredCount} Nonaktif
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Total MRR (Bulanan)</span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/30">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-emerald-400 font-mono">
              {formatRupiah(totalMrr)}
            </span>
            <span className="text-xs text-slate-400">/ bln</span>
          </div>
          <div className="text-[11px] text-slate-500">
            ARR Tahunan: <strong className="text-slate-300 font-mono">{formatRupiah(totalMrr * 12)}</strong>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Status Sinkronisasi Data</span>
            <div className="p-2 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/30">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-sm font-bold text-white">100% Synced</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Scraper Engine: <strong className="text-emerald-400">Active (pyproc v0.4)</strong>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Aksi Massal Engine</span>
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/30">
              <RotateCw className="w-4 h-4" />
            </div>
          </div>
          <button
            onClick={handleTriggerSyncAll}
            disabled={isSyncingAll}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-300 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncingAll ? 'animate-spin' : ''}`} />
            {isSyncingAll ? 'Proses Sync Massal...' : 'Sync Semua Tenant'}
          </button>
          <div className="text-[10px] text-slate-500 text-center">
            Pembaruan seluruh database RLS tenant
          </div>
        </div>

      </div>

      {/* Sync Result Toast Notice Alert */}
      {syncNotice && (
        <div
          className={`p-4 rounded-2xl border text-xs shadow-xl transition-all flex items-start justify-between gap-4 animate-fade-in ${
            syncNotice.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {syncNotice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <span className="font-extrabold text-sm block">{syncNotice.title}</span>
              <p className="text-slate-300 leading-relaxed">{syncNotice.message}</p>
              {syncNotice.details && (
                <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-[11px] text-emerald-300">
                  <span>● Tender Terambil: +{syncNotice.details.syncedTendersCount || 12}</span>
                  <span>● Durasi Sync: {syncNotice.details.syncDurationMs || 720}ms</span>
                  <span>● Mode RLS: Isolation Validated</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setSyncNotice(null)}
            className="p-1 hover:bg-slate-800/60 rounded-lg text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nama tenant, subdomain, NPWP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Status & Tier Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          {/* Status Dropdown */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 px-2 font-medium">Status:</span>
            {(['ALL', 'active', 'trial', 'expired'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st === 'ALL' ? 'Semua' : st.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tier Dropdown */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 px-2 font-medium">Paket:</span>
            {(['ALL', 'FREE', 'STARTER', 'BUSINESS', 'ENTERPRISE'] as const).map((tr) => (
              <button
                key={tr}
                onClick={() => setTierFilter(tr)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  tierFilter === tr
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tr === 'ALL' ? 'Semua' : tr}
              </button>
            ))}
          </div>

          {/* New Tenant Button */}
          <button
            onClick={onOpenNewTenantModal}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer ml-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tenant</span>
          </button>

        </div>

      </div>

      {/* TENANT SUBSCRIPTION MANAGEMENT TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <h3 className="font-extrabold text-sm text-white">Daftar Tenant & Status Sinkronisasi LPSE</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Menampilkan {filteredTenants.length} dari {tenants.length} Tenant
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Nama Tenant / Klien</th>
                <th className="p-3.5">Paket & Biaya MRR</th>
                <th className="p-3.5">Status Langganan</th>
                <th className="p-3.5">Subdomain & Domain</th>
                <th className="p-3.5">Status Sync Data LPSE</th>
                <th className="p-3.5">Kapasitas Tim</th>
                <th className="p-3.5 text-right">Aksi Manajemen</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500 text-xs">
                    Tidak ada tenant yang memenuhi kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => {
                  const isSyncing = syncingTenantId === tenant.id;

                  return (
                    <tr
                      key={tenant.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => setInspectTenant(tenant)}
                    >
                      {/* Company Name & Sector */}
                      <td className="p-3.5">
                        <div className="font-extrabold text-white text-sm group-hover:text-emerald-400 transition-colors">
                          {tenant.name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>NPWP: {tenant.npwp}</span>
                          <span>•</span>
                          <span className="text-slate-500">{tenant.sector}</span>
                        </div>
                      </td>

                      {/* Tier & MRR */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border ${
                            tenant.tier === 'ENTERPRISE'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : tenant.tier === 'BUSINESS'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          }`}>
                            {tenant.tier}
                          </span>
                        </div>
                        <div className="font-mono font-bold text-emerald-400 text-xs mt-1">
                          {tenant.mrrAmount > 0 ? formatRupiah(tenant.mrrAmount) : 'Rp 0 (Trial)'}
                          <span className="text-[10px] text-slate-500 font-normal"> / bln</span>
                        </div>
                      </td>

                      {/* Subscription Status */}
                      <td className="p-3.5">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border ${
                            tenant.status === 'active'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                              : tenant.status === 'trial'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              tenant.status === 'active' ? 'bg-emerald-400' : tenant.status === 'trial' ? 'bg-amber-400' : 'bg-rose-400'
                            }`}></span>
                            {tenant.status}
                          </span>

                          <div className="text-[10px] text-slate-400 font-mono">
                            Kadaluarsa: {tenant.expiresAt}
                          </div>
                        </div>
                      </td>

                      {/* Subdomain */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: tenant.branding.primaryColor }}
                          ></span>
                          <div>
                            <span className="font-mono text-cyan-300 font-semibold text-xs">
                              {tenant.branding.subdomain}.ptfas.co.id
                            </span>
                            {tenant.branding.customDomain && (
                              <div className="text-[10px] text-amber-300/80 font-mono flex items-center gap-1">
                                <Globe2 className="w-3 h-3 text-amber-400" />
                                {tenant.branding.customDomain}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Data Sync Status & Manual Trigger */}
                      <td className="p-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              {tenant.lastSyncStatus || 'SUCCESS'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {tenant.lastSyncAt || '5 menit lalu'}
                            </span>
                          </div>

                          <div className="text-[10px] text-slate-400">
                            Data Terambil: <strong className="text-white font-mono">{tenant.syncedRecordsCount || 240}</strong> tender
                          </div>
                        </div>
                      </td>

                      {/* User Capacity */}
                      <td className="p-3.5 font-mono text-xs">
                        <div className="text-slate-200 font-bold">
                          {tenant.userCount} / {tenant.maxUsers === 999 ? '∞' : tenant.maxUsers} Tim
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {tenant.trackedTendersCount} Pantauan
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right space-x-2">
                        {/* Manual Sync Button */}
                        <button
                          onClick={(e) => handleTriggerSync(tenant, e)}
                          disabled={isSyncing}
                          className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-bold rounded-lg border border-emerald-500/40 transition-all cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
                          title="Manually Trigger pyproc Scraper Sync"
                        >
                          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>{isSyncing ? 'Syncing...' : 'Sync Manual'}</span>
                        </button>

                        {/* Edit Subscription Modal Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTenantForEdit(tenant);
                            setEditStatus(tenant.status);
                            setEditTier(tenant.tier);
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                        >
                          Edit Status
                        </button>

                        {/* Switch Preview Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSwitchTenant(tenant);
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 text-[11px] font-bold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                        >
                          Pratinjau Portal
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT SUBSCRIPTION STATUS MODAL */}
      {selectedTenantForEdit && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase block">
                  Kelola Langganan Tenant
                </span>
                <h3 className="text-lg font-black text-white">{selectedTenantForEdit.name}</h3>
              </div>
              <button
                onClick={() => setSelectedTenantForEdit(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSubscription} className="space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Status Langganan SaaS:</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as SubscriptionStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="active">ACTIVE - Akses Penuh Klien</option>
                  <option value="trial">TRIAL - Masa Percobaan</option>
                  <option value="expired">EXPIRED - Kadaluarsa / Ditangguhkan</option>
                  <option value="canceled">CANCELED - Berlangganan Dibatalkan</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Paket Subskripsi (Tier):</label>
                <select
                  value={editTier}
                  onChange={(e) => setEditTier(e.target.value as SubscriptionTier)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="STARTER">STARTER (Rp 1.500.000 / bln - 3 User)</option>
                  <option value="BUSINESS">BUSINESS PRO (Rp 4.500.000 / bln - 15 User)</option>
                  <option value="ENTERPRISE">ENTERPRISE CUSTOM (Rp 12.000.000 / bln - Unlimited API & Webhooks)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-slate-400 text-[11px]">
                <span className="font-bold text-white block">Catatan B2B SaaS PT Fas:</span>
                <p>
                  Mengubah status langganan ke <strong>EXPIRED</strong> akan membatasi isolasi data RLS tenant dan menonaktifkan API Key REST Open API.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTenantForEdit(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {editSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Simpan Perubahan</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DETAILED TENANT INSPECTION DRAWER */}
      {inspectTenant && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-xl h-full p-6 space-y-6 overflow-y-auto shadow-2xl animate-slide-left">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold block">
                  Detail Tenant RLS #{inspectTenant.id}
                </span>
                <h2 className="text-xl font-black text-white">{inspectTenant.name}</h2>
              </div>
              <button
                onClick={() => setInspectTenant(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Quick Status Pill */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold">Status Subskripsi:</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${
                  inspectTenant.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {inspectTenant.status} ({inspectTenant.tier})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-900">
                <div>
                  <span className="text-slate-500 text-[10px] block">Pendapatan MRR</span>
                  <span className="font-mono font-bold text-emerald-400">{formatRupiah(inspectTenant.mrrAmount)} / bln</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Masa Berlaku</span>
                  <span className="font-mono font-bold text-white">{inspectTenant.expiresAt}</span>
                </div>
              </div>
            </div>

            {/* Manual Sync Trigger inside Drawer */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  Isolasi DB & Sinkronisasi LPSE
                </span>
                <button
                  onClick={() => handleTriggerSync(inspectTenant)}
                  disabled={syncingTenantId === inspectTenant.id}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingTenantId === inspectTenant.id ? 'animate-spin' : ''}`} />
                  <span>Jalankan Sync Manual</span>
                </button>
              </div>

              <div className="text-xs text-slate-300 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Terakhir Disinkronkan:</span>
                  <span className="text-white font-bold">{inspectTenant.lastSyncAt || '5 menit lalu'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Tender Terisolasi:</span>
                  <span className="text-emerald-400 font-bold">{inspectTenant.syncedRecordsCount || 248} record</span>
                </div>
              </div>
            </div>

            {/* Registered Users */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider">
                Anggota Tim Klien ({inspectTenant.users?.length || 0})
              </h4>
              <div className="space-y-2">
                {(inspectTenant.users || []).map((u) => (
                  <div key={u.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{u.name}</span>
                      <span className="text-[10px] text-slate-400">{u.email}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-mono rounded">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
