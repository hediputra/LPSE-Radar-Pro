export type SubscriptionTier = 'FREE' | 'STARTER' | 'BUSINESS' | 'ENTERPRISE';
export type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'canceled';

export interface TenantBranding {
  companyName: string;
  logoUrl?: string;
  primaryColor: string; // e.g. '#10b981'
  subdomain: string; // e.g. 'kontraktorjaya' -> kontraktorjaya.ptfas.co.id
  customDomain?: string;
}

export interface TenantUser {
  id: string;
  name: string;
  email: string;
  role: 'tenant_admin' | 'bidding_manager' | 'staff' | 'finance';
  lastActive: string;
  avatarUrl?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string; // e.g. 'fas_live_9281...'
  createdAt: string;
  lastUsedAt?: string;
  status: 'active' | 'revoked';
  rateLimitPerMin: number;
}

export interface TenantWebhook {
  id: string;
  url: string;
  events: string[]; // e.g. ['tender.new', 'tender.closing_soon', 'winner.announced']
  secretKey: string;
  status: 'active' | 'paused';
}

export interface Tenant {
  id: string;
  name: string;
  npwp: string;
  sector: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  userCount: number;
  maxUsers: number;
  branding: TenantBranding;
  users: TenantUser[];
  apiKeys: ApiKey[];
  webhooks: TenantWebhook[];
  mrrAmount: number; // in IDR
  joinedDate: string;
  expiresAt: string;
  trackedTendersCount: number;
  apiRequestsCount24h: number;
  lastSyncAt?: string;
  lastSyncStatus?: 'SUCCESS' | 'SYNCING' | 'FAILED' | 'PENDING';
  syncedRecordsCount?: number;
}

export interface SystemHealthMetric {
  nodeName: string;
  status: 'operational' | 'degraded' | 'offline';
  latencyMs: number;
  activeJobs: number;
  uptimePercent: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  tenantName: string;
  userName: string;
  action: string;
  details: string;
  ipAddress: string;
}

export const SUBSCRIPTION_TIERS = [
  {
    tier: 'FREE' as SubscriptionTier,
    name: 'Free Starter Plan',
    priceIdr: 0,
    priceLabel: 'Rp 0 / Selamanya',
    target: 'Vendor Pemula & Perorangan',
    features: [
      '1 Pengguna Tim',
      'Pencarian & Akses 50+ LPSE Terpopuler',
      'Notifikasi Ringkasan Email Mingguan',
      'Pantau Hingga 3 Tender Aktif',
      'Penyimpanan Dokumen 500 MB',
      'Dukungan Komunitas LPSE'
    ],
    maxUsers: 1,
    apiAccess: false,
    whiteLabel: false
  },
  {
    tier: 'STARTER' as SubscriptionTier,
    name: 'Starter Plan',
    priceIdr: 1500000,
    priceLabel: 'Rp 1.500.000 / bln',
    target: 'UMKM & Kontraktor Lokal',
    features: [
      'Hingga 3 Pengguna Tim',
      'Pencarian & Filter 680+ LPSE',
      'Notifikasi Email Harian',
      'Rekomendasi Tender Berbasis AI',
      'Penyimpanan Dokumen 5 GB'
    ],
    maxUsers: 3,
    apiAccess: false,
    whiteLabel: false
  },
  {
    tier: 'BUSINESS' as SubscriptionTier,
    name: 'Business Pro Plan',
    priceIdr: 4500000,
    priceLabel: 'Rp 4.500.000 / bln',
    target: 'Perusahaan Kontraktor & Supplier Menengah',
    features: [
      'Hingga 15 Pengguna Tim & Akses Role',
      'Notifikasi Real-time WhatsApp & Email',
      'White-label Logo & Warna Brand Kustom',
      'Analitik Pemenang & Kompetitor LPSE',
      'Kalkulator HPS & Generator Dokumen Auto',
      'Penyimpanan Dokumen 50 GB'
    ],
    maxUsers: 15,
    apiAccess: true,
    whiteLabel: true
  },
  {
    tier: 'ENTERPRISE' as SubscriptionTier,
    name: 'Enterprise Custom Plan',
    priceIdr: 12000000,
    priceLabel: 'Rp 12.000.000 / bln',
    target: 'Korporasi Konstruksi, BUMN & IT Integrator',
    features: [
      'Pengguna Tim Tanpa Batas (Unlimited)',
      'Akses Open REST API & Webhooks ERP (SAP/Odoo)',
      'Subdomain Kustom & Integrasi SSO (OAuth/SAML)',
      'Dedicated Server Scraping & SLA 99.9%',
      'Account Manager PT Fas Prioritas 24/7',
      'Audit Log Lengkap & Enkripsi ISO 27001'
    ],
    maxUsers: 999,
    apiAccess: true,
    whiteLabel: true
  }
];

export const MOCK_TENANTS: Tenant[] = [
  {
    id: 'tenant-001',
    name: 'PT Kontraktor Jaya Utama',
    npwp: '01.234.567.8-012.000',
    sector: 'Konstruksi & Infrastruktur Jalan',
    tier: 'BUSINESS',
    status: 'active',
    userCount: 8,
    maxUsers: 15,
    branding: {
      companyName: 'Kontraktor Jaya Portal',
      primaryColor: '#10b981', // Emerald
      subdomain: 'kontraktorjaya',
      customDomain: 'tender.kontraktorjaya.co.id'
    },
    mrrAmount: 4500000,
    joinedDate: '2025-11-15',
    expiresAt: '2026-11-15',
    trackedTendersCount: 18,
    apiRequestsCount24h: 3420,
    lastSyncAt: '5 menit lalu',
    lastSyncStatus: 'SUCCESS',
    syncedRecordsCount: 248,
    users: [
      { id: 'u1', name: 'Bambang Sudarmo', email: 'bambang@kontraktorjaya.co.id', role: 'tenant_admin', lastActive: '5 menit lalu' },
      { id: 'u2', name: 'Dewi Lestari', email: 'dewi@kontraktorjaya.co.id', role: 'bidding_manager', lastActive: '1 jam lalu' },
      { id: 'u3', name: 'Rian Pratama', email: 'rian@kontraktorjaya.co.id', role: 'staff', lastActive: 'Kemarin' }
    ],
    apiKeys: [
      { id: 'key-1', name: 'Production ERP SAP Connector', keyPrefix: 'fas_live_9281a...', createdAt: '2026-01-10', lastUsedAt: '2 menit lalu', status: 'active', rateLimitPerMin: 120 }
    ],
    webhooks: [
      { id: 'wh-1', url: 'https://erp.kontraktorjaya.co.id/api/webhooks/tenders', events: ['tender.new', 'winner.announced'], secretKey: 'whsec_98129381923', status: 'active' }
    ]
  },
  {
    id: 'tenant-002',
    name: 'CV Nusantara Techno Solusindo',
    npwp: '02.987.654.3-045.000',
    sector: 'Pengadaan Alat Kesehatan & IT Hardware',
    tier: 'ENTERPRISE',
    status: 'active',
    userCount: 24,
    maxUsers: 999,
    branding: {
      companyName: 'Nusantara Procurement Hub',
      primaryColor: '#3b82f6', // Blue
      subdomain: 'nusantaratechno',
      customDomain: 'lpse.nusantaratechno.com'
    },
    mrrAmount: 12000000,
    joinedDate: '2025-08-01',
    expiresAt: '2026-08-01',
    trackedTendersCount: 42,
    apiRequestsCount24h: 18900,
    lastSyncAt: '2 menit lalu',
    lastSyncStatus: 'SUCCESS',
    syncedRecordsCount: 512,
    users: [
      { id: 'u4', name: 'Andi Wijaya', email: 'andi@nusantaratechno.com', role: 'tenant_admin', lastActive: '10 menit lalu' },
      { id: 'u5', name: 'Fitri Handayani', email: 'fitri@nusantaratechno.com', role: 'bidding_manager', lastActive: '30 menit lalu' }
    ],
    apiKeys: [
      { id: 'key-2', name: 'Main API Key Odoo CRM', keyPrefix: 'fas_live_7731b...', createdAt: '2025-09-01', lastUsedAt: 'Sekarang', status: 'active', rateLimitPerMin: 300 }
    ],
    webhooks: [
      { id: 'wh-2', url: 'https://crm.nusantaratechno.com/hooks/lpse', events: ['tender.new', 'tender.closing_soon', 'schedule.change'], secretKey: 'whsec_5510293123', status: 'active' }
    ]
  },
  {
    id: 'tenant-003',
    name: 'PT Mitra Karya Konsultindo',
    npwp: '03.555.444.1-081.000',
    sector: 'Jasa Konsultansi Perencanaan Konstruksi',
    tier: 'STARTER',
    status: 'active',
    userCount: 2,
    maxUsers: 3,
    branding: {
      companyName: 'Mitra Karya Tender Suite',
      primaryColor: '#8b5cf6', // Purple
      subdomain: 'mitrakarya'
    },
    mrrAmount: 1500000,
    joinedDate: '2026-02-10',
    expiresAt: '2027-02-10',
    trackedTendersCount: 7,
    apiRequestsCount24h: 120,
    lastSyncAt: '1 jam lalu',
    lastSyncStatus: 'SUCCESS',
    syncedRecordsCount: 94,
    users: [
      { id: 'u6', name: 'Hendra Gunawan', email: 'hendra@mitrakarya.co.id', role: 'tenant_admin', lastActive: '3 jam lalu' }
    ],
    apiKeys: [],
    webhooks: []
  },
  {
    id: 'tenant-004',
    name: 'PT Banten Mandiri Utama',
    npwp: '01.888.777.6-081.000',
    sector: 'Pengaspalan Jalan & Infrastruktur Banten',
    tier: 'BUSINESS',
    status: 'trial',
    userCount: 4,
    maxUsers: 15,
    branding: {
      companyName: 'Banten Mandiri Bidding App',
      primaryColor: '#f59e0b', // Amber
      subdomain: 'bantenmandiri'
    },
    mrrAmount: 0,
    joinedDate: '2026-07-15',
    expiresAt: '2026-07-29',
    trackedTendersCount: 12,
    apiRequestsCount24h: 450,
    lastSyncAt: '15 menit lalu',
    lastSyncStatus: 'SUCCESS',
    syncedRecordsCount: 168,
    users: [
      { id: 'u7', name: 'Dedi Kurniawan', email: 'dedi@bantenmandiri.co.id', role: 'tenant_admin', lastActive: '12 menit lalu' }
    ],
    apiKeys: [],
    webhooks: []
  }
];

export const MOCK_SYSTEM_NODES: SystemHealthMetric[] = [
  { nodeName: 'Node Cluster 1 (PUPR & Kementerian)', status: 'operational', latencyMs: 124, activeJobs: 18, uptimePercent: 99.98 },
  { nodeName: 'Node Cluster 2 (Banten & Jawa Barat)', status: 'operational', latencyMs: 89, activeJobs: 24, uptimePercent: 99.95 },
  { nodeName: 'Node Cluster 3 (Jateng, Jogja & Jatim)', status: 'operational', latencyMs: 110, activeJobs: 31, uptimePercent: 99.99 },
  { nodeName: 'Node Cluster 4 (Sumatera & Kalimantan)', status: 'operational', latencyMs: 145, activeJobs: 12, uptimePercent: 99.90 },
  { nodeName: 'Node Cluster 5 (Bali, Nusa Tenggara & Papua)', status: 'operational', latencyMs: 168, activeJobs: 9, uptimePercent: 99.85 },
  { nodeName: 'pyproc Scraping Proxy Pool', status: 'operational', latencyMs: 210, activeJobs: 45, uptimePercent: 99.92 }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-101', timestamp: '2026-07-21T18:05:00Z', tenantName: 'PT Kontraktor Jaya Utama', userName: 'Bambang Sudarmo', action: 'API_KEY_CREATED', details: 'Dibuat API Key baru: Production ERP SAP Connector', ipAddress: '182.253.112.45' },
  { id: 'log-102', timestamp: '2026-07-21T17:40:00Z', tenantName: 'CV Nusantara Techno Solusindo', userName: 'Andi Wijaya', action: 'WEBHOOK_UPDATED', details: 'Diperbarui URL Webhook ke crm.nusantaratechno.com', ipAddress: '110.138.92.12' },
  { id: 'log-103', timestamp: '2026-07-21T16:12:00Z', tenantName: 'PT Banten Mandiri Utama', userName: 'Dedi Kurniawan', action: 'TENANT_BRANDING_CHANGE', details: 'Mengubah warna kustom branding ke #f59e0b', ipAddress: '180.252.18.99' },
  { id: 'log-104', timestamp: '2026-07-21T15:30:00Z', tenantName: 'PT Fas System Operations', userName: 'Super Admin PT Fas', action: 'GLOBAL_NODE_SYNC', details: 'Sinkronisasi massal 680 node LPSE selesai dalam 3.2 detik', ipAddress: '10.0.4.1' }
];
