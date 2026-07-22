import React, { useState, useEffect } from 'react';
import {
  Building2,
  Shield,
  Layers,
  Code2,
  Activity,
  CreditCard,
  Key,
  Webhook,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Server,
  Database,
  Users,
  TrendingUp,
  Cpu,
  Terminal,
  Zap,
  Globe2,
  Palette,
  FileText,
  DollarSign,
  Rocket
} from 'lucide-react';
import { Tenant, SubscriptionTier, SUBSCRIPTION_TIERS } from '../data/mockTenants';
import { api } from '../services/api';
import { formatFullRupiah, formatRupiah } from '../services/api';
import { TenantManagementView } from './TenantManagementView';

interface SaaSAdminPortalViewProps {
  currentTenant: Tenant;
  onSwitchTenant: (tenant: Tenant) => void;
}

export const SaaSAdminPortalView: React.FC<SaaSAdminPortalViewProps> = ({
  currentTenant,
  onSwitchTenant
}) => {
  const [activeTab, setActiveTab] = useState<'tenants' | 'architecture' | 'openapi' | 'health' | 'gtm'>('tenants');

  // SaaS Tenants & System state
  const [tenantsData, setTenantsData] = useState<any>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Open API Test Console State
  const [testApiKey, setTestApiKey] = useState('fas_live_7731b981293a');
  const [selectedTenantId, setSelectedTenantId] = useState('tenant-002');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // New Tenant Modal State
  const [showNewTenantModal, setShowNewTenantModal] = useState(false);
  const [newForm, setNewForm] = useState({
    name: '',
    npwp: '',
    sector: '',
    tier: 'BUSINESS' as SubscriptionTier,
    companyName: '',
    subdomain: '',
    primaryColor: '#10b981'
  });
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadSaaSData();
  }, []);

  const loadSaaSData = async () => {
    setLoading(true);
    try {
      const [tRes, hRes] = await Promise.all([
        api.getSaasTenants(),
        api.getSaasSystemHealth()
      ]);
      setTenantsData(tRes);
      setHealthData(hRes);
    } catch (err) {
      console.error('Error loading SaaS portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestOpenApi = async () => {
    setApiLoading(true);
    try {
      const res = await api.getOpenApiTenders(testApiKey, selectedTenantId);
      setApiResponse(res);
    } catch (err) {
      setApiResponse({ error: 'Gagal mengeksekusi request Open API' });
    } finally {
      setApiLoading(false);
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createSaasTenant(newForm);
      setFormSuccess(`Tenant ${res.tenant.name} berhasil ditambahkan!`);
      setShowNewTenantModal(false);
      setNewForm({
        name: '',
        npwp: '',
        sector: '',
        tier: 'BUSINESS',
        companyName: '',
        subdomain: '',
        primaryColor: '#10b981'
      });
      loadSaaSData();
      setTimeout(() => setFormSuccess(null), 4000);
    } catch (err) {
      alert('Gagal mendaftarkan tenant');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTenants: Tenant[] = (tenantsData?.tenants || []).filter((t: Tenant) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.branding.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* SaaS Developer Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                <Shield className="w-3.5 h-3.5" />
                DEVELOPER: PT FAS TECHNOLOGY SOLUTIONS
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800/80 text-slate-300 border border-slate-700">
                Multi-Tenant B2B SaaS Architecture
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Pusat Operasional B2B SaaS & Management Portal
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Platform Pengadaan LPSE Multi-Tenant commercial-grade dikembangkan oleh <strong className="text-emerald-400 font-semibold">PT Fas Technology Solutions</strong> sebagai produk SaaS unggulan untuk dijual ke berbagai vendor & kontraktor di Indonesia.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-center gap-6 shrink-0 shadow-inner">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">MRR (Monthly Revenue)</span>
              <span className="text-xl font-mono font-black text-emerald-400">
                {tenantsData?.summary ? formatRupiah(tenantsData.summary.totalMrrIdr) : 'Rp 18.000.000'}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Active Tenants</span>
              <span className="text-xl font-mono font-black text-amber-400">
                {tenantsData?.summary ? tenantsData.summary.activeTenantsCount : 4} Perusahaan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main SaaS Navigation Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto no-scrollbar gap-2">
        <button
          onClick={() => setActiveTab('tenants')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'tenants'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Kelola Tenant Klien ({tenantsData?.summary?.totalTenants || 4})
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'architecture'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          Arsitektur Multi-Tenant & Schema DB
        </button>

        <button
          onClick={() => setActiveTab('openapi')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'openapi'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Open API & Webhooks ERP
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'health'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          Kesehatan System & Scraper Node
        </button>

        <button
          onClick={() => setActiveTab('gtm')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'gtm'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Rocket className="w-4 h-4" />
          Paket SaaS & Strategi Go-To-Market
        </button>
      </div>

      {/* TAB 1: TENANT MANAGEMENT */}
      {activeTab === 'tenants' && (
        <TenantManagementView
          tenants={tenantsData?.tenants || []}
          summaryData={tenantsData?.summary}
          loading={loading}
          onRefreshData={loadSaaSData}
          onSwitchTenant={onSwitchTenant}
          onOpenNewTenantModal={() => setShowNewTenantModal(true)}
        />
      )}

      {/* TAB 2: ARCHITECTURE & DATABASE SCHEMA */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                Desain Arsitektur Multi-Tenant & Isolasi Data Klien
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Diimplementasikan oleh PT Fas Technology Solutions menggunakan skema <strong className="text-white">Row-Level Security (RLS) PostgreSQL</strong> dengan kunci <code className="text-emerald-400 font-mono">tenant_id</code> terenkripsi pada setiap tabel.
              </p>
            </div>

            {/* Architecture Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Shield className="w-4 h-4" />
                  Isolasi Data Terenkripsi
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Data tender favorit, dokumen penawaran, analisis margin, dan daftar tim diisolasi penuh per tenant. Query database tidak bisa menembus boundary tenant lain.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <Palette className="w-4 h-4" />
                  White-Label Engine
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Setiap tenant dapat menyesuaikan Logo Perusahaan, Warna Aksen Aplikasi, Subdomain unik, serta domain kustom tanpa mengubah basis kode frontend.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  Scraper Node Isolation
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Mesin pyproc berjalan secara global di latar belakang (Redis BullMQ pool), lalu menyalurkan pembaharuan tender ke masing-masing tenant berdasarkan filter kata kunci.
                </p>
              </div>
            </div>

            {/* Database Schema Viewer */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center justify-between">
                <span>Skema Database PostgreSQL Multi-Tenant (Drizzle ORM)</span>
                <span className="text-xs font-mono text-emerald-400">src/db/schema.ts</span>
              </h4>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                <pre>{`// 1. Table Tenants (Data Perusahaan Klien SaaS PT Fas)
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // e.g., 'PT Kontraktor Jaya'
  npwp: varchar('npwp', { length: 30 }).notNull(),
  tier: varchar('tier').notNull().default('STARTER'), // STARTER, BUSINESS, ENTERPRISE
  subdomain: text('subdomain').unique().notNull(), // e.g., 'kontraktorjaya'
  customDomain: text('custom_domain'),
  primaryColor: varchar('primary_color', { length: 10 }).default('#10b981'),
  logoUrl: text('logo_url'),
  createdAt: timestamp('created_at').defaultNow()
});

// 2. Table Tenant Users (Role-based Team Members)
export const tenantUsers = pgTable('tenant_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  role: varchar('role').notNull(), // 'tenant_admin' | 'bidding_manager' | 'staff'
  createdAt: timestamp('created_at').defaultNow()
});

// 3. Table Tracked Tenders (Isolasi Pantauan Tender Klien)
export const tenantTrackedTenders = pgTable('tenant_tracked_tenders', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(), // Isolation Boundary
  tenderKode: varchar('tender_kode').notNull(),
  notes: text('notes'),
  statusTracking: varchar('status_tracking').default('DIAMATI'),
  estimatedMargin: numeric('estimated_margin'),
  createdAt: timestamp('created_at').defaultNow()
});`}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OPEN API & WEBHOOKS FOR ENTERPRISE CLIENTS */}
      {activeTab === 'openapi' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                  PT Fas Enterprise RESTful Open API & Webhooks
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Fitur unggulan untuk klien <strong className="text-purple-400">Enterprise</strong> untuk mengintegrasikan data tender LPSE langsung ke ERP (SAP, Odoo, Oracle) atau CRM perusahaan.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  REST API v1.0 Live
                </span>
              </div>
            </div>

            {/* Interactive API Tester Console */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: API Playground Controls */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Konsol Pengujian Live REST API
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Select Client Tenant Header:</label>
                    <select
                      value={selectedTenantId}
                      onChange={(e) => setSelectedTenantId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    >
                      {(tenantsData?.tenants || []).map((t: Tenant) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.tier})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">API Key Header (x-api-key):</label>
                    <input
                      type="text"
                      value={testApiKey}
                      onChange={(e) => setTestApiKey(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Endpoint URL:</label>
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 flex items-center justify-between">
                      <span className="text-emerald-400 font-bold">GET</span>
                      <span>/api/v1/openapi/tenders</span>
                    </div>
                  </div>

                  <button
                    onClick={handleTestOpenApi}
                    disabled={apiLoading}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    {apiLoading ? 'Memanggil API...' : '🚀 Eksekusi REST Request'}
                  </button>
                </div>

                {/* Sample Curl Snippet */}
                <div className="pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono text-slate-400">cURL Command Example:</span>
                    <button
                      onClick={() => copyToClipboard(`curl -X GET "https://ptfas.co.id/api/v1/openapi/tenders" \\\n  -H "x-api-key: ${testApiKey}" \\\n  -H "x-tenant-id: ${selectedTenantId}"`)}
                      className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Tersalin!' : 'Salin cURL'}
                    </button>
                  </div>
                  <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-mono text-slate-300 overflow-x-auto">
{`curl -X GET "https://ptfas.co.id/api/v1/openapi/tenders" \\
  -H "x-api-key: ${testApiKey}" \\
  -H "x-tenant-id: ${selectedTenantId}"`}
                  </pre>
                </div>
              </div>

              {/* Right Column: Live Response JSON */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-400" />
                      Respons JSON Server PT Fas
                    </h4>
                    {apiResponse && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        200 OK
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 max-h-80 overflow-y-auto">
                    {apiResponse ? (
                      <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
                    ) : (
                      <div className="text-slate-500 italic py-12 text-center text-xs">
                        Klik "Eksekusi REST Request" untuk menguji pengiriman data JSON dari server PT Fas.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs text-purple-200">
                  <span className="font-bold block mb-0.5">💡 Webhook Automatic Event Dispatch:</span>
                  Setiap kali pyproc scraper menemukan tender baru yang cocok dengan kriteria klien, webhook JSON dikirimkan otomatis ke URL ERP Klien dalam hitungan detik.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM HEALTH & SCRAPER CLUSTER */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Kesehatan Infrastruktur Cloud & Scraper Nodes LPSE
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Monitoring performa 680+ node LPSE, antrean job Redis BullMQ, dan catatan audit keamanan platform PT Fas.
                </p>
              </div>

              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs rounded-full border border-emerald-500/40">
                100% OPERATIONAL
              </span>
            </div>

            {/* Clusters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(healthData?.clusters || []).map((c: any, idx: number) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-white text-xs block">{c.nodeName}</span>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>Latency: <strong className="text-emerald-400">{c.latencyMs}ms</strong></span>
                      <span>Jobs: <strong className="text-amber-400">{c.activeJobs} active</strong></span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-emerald-400 block">{c.uptimePercent}% Uptime</span>
                    <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Normal
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Audit Trail Section */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm">Audit Log Keamanan & Aktivitas Sistem</h4>
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Waktu UTC</th>
                      <th className="p-3">Tenant / Perusahaan</th>
                      <th className="p-3">Aktivitas</th>
                      <th className="p-3">Detail Tindakan</th>
                      <th className="p-3 font-mono">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {(healthData?.auditLogs || []).map((l: any) => (
                      <tr key={l.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-mono text-[11px] text-slate-400">
                          {new Date(l.timestamp).toLocaleTimeString('id-ID')}
                        </td>
                        <td className="p-3 font-semibold text-white">{l.tenantName}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700">
                            {l.action}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300">{l.details}</td>
                        <td className="p-3 font-mono text-emerald-400">{l.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PRICING & GTM STRATEGY */}
      {activeTab === 'gtm' && (
        <div className="space-y-6">
          {/* Pricing Tiers Showcase */}
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-white text-center">
              Skema Paket Berlangganan SaaS (Pricing Tiers PT Fas)
            </h3>
            <p className="text-slate-400 text-xs text-center max-w-xl mx-auto">
              Penetapan harga komersial B2B berjenjang yang fleksibel untuk UKM, Kontraktor Menengah, hingga Korporasi Konstruksi BUMN.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {SUBSCRIPTION_TIERS.map((tier) => (
                <div
                  key={tier.tier}
                  className={`bg-slate-900 border rounded-2xl p-6 flex flex-col justify-between space-y-6 relative ${
                    tier.tier === 'BUSINESS'
                      ? 'border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                      : 'border-slate-800'
                  }`}
                >
                  {tier.tier === 'BUSINESS' && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                      PAKET TERLAKU (RECOMMENDED)
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-slate-400 block">{tier.target}</span>
                      <h4 className="text-lg font-black text-white">{tier.name}</h4>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-2xl font-black text-emerald-400 font-mono block">
                        {tier.priceLabel}
                      </span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-300">
                      {tier.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors">
                    Atur Detail Paket
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 6-Month Roadmap & Infrastructure Estimation */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h4 className="font-extrabold text-white text-base flex items-center gap-2">
              <Rocket className="w-5 h-5 text-emerald-400" />
              Rencana Pengembangan 6 Bulan & Estimasi Biaya Cloud PT Fas
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                  Timeline Peluncuran Komersial
                </span>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <strong className="text-emerald-400 font-bold block mb-0.5">Bulan 1-2: Fondasi & MVP Engine</strong>
                    <span className="text-slate-400">Setup NestJS/Node backend, PostgreSQL RLS, Scraping pyproc cluster, & Autentikasi Multi-tenant.</span>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <strong className="text-blue-400 font-bold block mb-0.5">Bulan 3-4: Fitur Premium & Open API</strong>
                    <span className="text-slate-400">White-labeling, REST API untuk Enterprise, Analitik Kompetitor, & WhatsApp Notification gateway.</span>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <strong className="text-purple-400 font-bold block mb-0.5">Bulan 5-6: Beta Pilot & Komersialisasi</strong>
                    <span className="text-slate-400">Uji coba dengan 5 perusahaan kontraktor Banten/DKI, integrasi Midtrans/Xendit, & pemasaran B2B.</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                  Estimasi Biaya Cloud GCP / AWS (Bulanan)
                </span>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Cloud SQL PostgreSQL (Managed):</span>
                    <strong className="text-emerald-400">Rp 1.800.000 / bln</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Cloud Run / Kubernetes Nodes:</span>
                    <strong className="text-emerald-400">Rp 2.400.000 / bln</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Redis Cache & BullMQ Queue:</span>
                    <strong className="text-emerald-400">Rp 850.000 / bln</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Scraping Proxy Pool & Bandwidth:</span>
                    <strong className="text-emerald-400">Rp 1.200.000 / bln</strong>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white text-sm">
                    <span>Total Cost / Month:</span>
                    <span className="text-amber-400">~ Rp 6.250.000 / bln</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add New Tenant */}
      {showNewTenantModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setShowNewTenantModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              Daftarkan Tenant Perusahaan Klien Baru
            </h3>

            <form onSubmit={handleCreateTenant} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Nama Perusahaan Klien:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Kontraktor Utama"
                  value={newForm.name}
                  onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Subdomain Kustom:</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    placeholder="kontraktorutama"
                    value={newForm.subdomain}
                    onChange={(e) => setNewForm({ ...newForm, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-l-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <span className="bg-slate-800 border border-l-0 border-slate-700 px-3 py-2 text-slate-400 rounded-r-xl font-mono text-[11px]">
                    .ptfas.co.id
                  </span>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Sektor Bisnis:</label>
                <input
                  type="text"
                  placeholder="Contoh: Konstruksi Jalan / Pengadaan IT"
                  value={newForm.sector}
                  onChange={(e) => setNewForm({ ...newForm, sector: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Pilihan Paket Langganan:</label>
                <select
                  value={newForm.tier}
                  onChange={(e) => setNewForm({ ...newForm, tier: e.target.value as SubscriptionTier })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-bold"
                >
                  <option value="STARTER">Starter Plan (Rp 1.500.000 / bln)</option>
                  <option value="BUSINESS">Business Pro Plan (Rp 4.500.000 / bln)</option>
                  <option value="ENTERPRISE">Enterprise Custom Plan (Rp 12.000.000 / bln)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Warna Brand Utama (Accent Color):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newForm.primaryColor}
                    onChange={(e) => setNewForm({ ...newForm, primaryColor: e.target.value })}
                    className="w-10 h-9 bg-slate-950 border border-slate-700 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono text-slate-300">{newForm.primaryColor}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg"
                >
                  Daftarkan & Aktifkan Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
