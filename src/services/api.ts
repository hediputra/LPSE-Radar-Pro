import {
  Tender,
  TenderFilterParams,
  TenderStats,
  VendorRanking,
  AppNotification,
  PyprocMeta,
  BuyerTender,
  BuyerVendor,
  BuyerBidSubmission,
  EAuctionBid,
  QnaItem
} from '../types';

export interface TendersApiResponse {
  data: Tender[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  meta: {
    allInstansi: string[];
    allKategori: string[];
    allMetode: string[];
    allLokasi: string[];
  };
}

export const api = {
  // Fetch paginated & filtered tenders
  getTenders: async (params: TenderFilterParams = {}): Promise<TendersApiResponse> => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.instansi) query.append('instansi', params.instansi);
    if (params.kategori) query.append('kategori', params.kategori);
    if (params.metode) query.append('metode', params.metode);
    if (params.status) query.append('status', params.status);
    if (params.lokasi) query.append('lokasi', params.lokasi);
    if (params.minHps) query.append('minHps', params.minHps.toString());
    if (params.maxHps) query.append('maxHps', params.maxHps.toString());
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const res = await fetch(`/api/tenders?${query.toString()}`);
    if (!res.ok) throw new Error('Gagal mengambil data tender');
    return res.json();
  },

  // Fetch single tender detail
  getTenderById: async (id: string): Promise<Tender> => {
    const res = await fetch(`/api/tenders/${id}`);
    if (!res.ok) throw new Error('Tender tidak ditemukan');
    return res.json();
  },

  // Create / Post new Tender for BUMN or Swasta or LPSE
  createTender: async (data: Partial<Tender> & { entityType?: 'Swasta' | 'BUMN' | 'Pemerintah' }): Promise<{ success: boolean; message: string; tender: Tender }> => {
    const res = await fetch('/api/tenders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || 'Gagal mempublikasikan lelang pekerjaan');
    }
    return res.json();
  },

  // Toggle tracking / follow watchlist
  toggleTrackTender: async (id: string): Promise<{ success: boolean; isTracked: boolean; message: string }> => {
    const res = await fetch(`/api/tenders/${id}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Gagal memperbarui status pelacakan');
    return res.json();
  },

  // Fetch dashboard statistics
  getStatistics: async (): Promise<TenderStats> => {
    const res = await fetch('/api/statistics');
    if (!res.ok) throw new Error('Gagal mengambil statistik dashboard');
    return res.json();
  },

  // Fetch vendor rankings
  getVendorRankings: async (): Promise<VendorRanking[]> => {
    const res = await fetch('/api/vendors/ranking');
    if (!res.ok) throw new Error('Gagal mengambil peringkat vendor');
    return res.json();
  },

  // Fetch notifications
  getNotifications: async (): Promise<AppNotification[]> => {
    const res = await fetch('/api/notifications');
    if (!res.ok) throw new Error('Gagal mengambil notifikasi');
    return res.json();
  },

  // Mark notification read
  markNotificationRead: async (id: string): Promise<void> => {
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
  },

  // Trigger manual pyproc sync
  triggerSync: async (): Promise<{ success: boolean; message: string; syncTimestamp: string; newRecordAdded?: Tender }> => {
    const res = await fetch('/api/sync', { method: 'POST' });
    if (!res.ok) throw new Error('Gagal melakukan sinkronisasi pyproc');
    return res.json();
  },

  // Trigger automated SPSE Inaproc Data Ingestion & Crawler Sync
  syncSpseInaproc: async (): Promise<{
    success: boolean;
    message: string;
    syncTimestamp: string;
    ingestedCount: number;
    totalTendersInStore: number;
    spsePortalsSynced: Array<{ name: string; slug: string; url: string; count: number }>;
    ingestedTenders: Tender[];
  }> => {
    const res = await fetch('/api/spse/sync-inaproc', { method: 'POST' });
    if (!res.ok) throw new Error('Gagal melakukan ekstraksi dan auto-ingest data SPSE Inaproc');
    return res.json();
  },

  // Get list of SPSE Inaproc portals
  getSpsePortals: async (): Promise<{
    portals: Array<{ name: string; slug: string; url: string; isOnline: boolean; activeTenderCount: number }>;
    totalPortals: number;
    mainPortalUrl: string;
  }> => {
    const res = await fetch('/api/spse/portals');
    if (!res.ok) throw new Error('Gagal mengambil daftar portal SPSE Inaproc');
    return res.json();
  },

  // Fetch pyproc API documentation metadata
  getPyprocDocs: async (): Promise<any> => {
    const res = await fetch('/api/pyproc-docs');
    if (!res.ok) throw new Error('Gagal mengambil dokumentasi pyproc');
    return res.json();
  },

  // Fetch PT Fas SaaS Subscribing Tenants
  getSaasTenants: async (): Promise<any> => {
    const res = await fetch('/api/saas/tenants');
    if (!res.ok) throw new Error('Gagal mengambil data tenant SaaS PT Fas');
    return res.json();
  },

  // Create new Tenant for PT Fas SaaS
  createSaasTenant: async (data: any): Promise<any> => {
    const res = await fetch('/api/saas/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Gagal mendaftarkan tenant');
    return res.json();
  },

  // Manually trigger data sync for specific tenant
  syncSaasTenant: async (tenantId: string): Promise<any> => {
    const res = await fetch(`/api/saas/tenants/${tenantId}/sync`, { method: 'POST' });
    if (!res.ok) throw new Error(`Gagal melakukan sinkronisasi manual untuk tenant ${tenantId}`);
    return res.json();
  },

  // Trigger manual data sync for ALL active tenants
  syncAllSaasTenants: async (): Promise<any> => {
    const res = await fetch('/api/saas/tenants/sync-all', { method: 'POST' });
    if (!res.ok) throw new Error('Gagal melakukan sinkronisasi massal seluruh tenant');
    return res.json();
  },

  // Update subscription status or tier for tenant
  updateSaasTenantStatus: async (tenantId: string, payload: { status?: string; tier?: string }): Promise<any> => {
    const res = await fetch(`/api/saas/tenants/${tenantId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Gagal memperbarui status tenant');
    return res.json();
  },

  // Fetch SaaS System Health & Cluster Status
  getSaasSystemHealth: async (): Promise<any> => {
    const res = await fetch('/api/saas/system-health');
    if (!res.ok) throw new Error('Gagal mengambil kesehatan sistem SaaS');
    return res.json();
  },

  // Call Enterprise Open API Tenders
  getOpenApiTenders: async (apiKey?: string, tenantId?: string): Promise<any> => {
    const res = await fetch('/api/v1/openapi/tenders', {
      headers: {
        'x-api-key': apiKey || 'fas_live_demo123',
        'x-tenant-id': tenantId || 'tenant-002'
      }
    });
    if (!res.ok) throw new Error('Gagal memanggil RESTful Open API');
    return res.json();
  },

  // Run pyproc scraper query
  runPyprocQuery: async (payload: { host: string; method: string; kodeTender?: string }): Promise<any> => {
    const res = await fetch('/api/pyproc/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Gagal mengeksekusi pyproc query');
    return res.json();
  },

  // Auto detect location based on user's IP address
  detectIpLocation: async (): Promise<any> => {
    const res = await fetch('/api/location/auto-detect');
    if (!res.ok) throw new Error('Gagal mendeteksi lokasi dari IP');
    return res.json();
  },

  // ==========================================
  // BUYER PROCUREMENT PLATFORM SERVICES
  // ==========================================
  getBuyerTenders: async (): Promise<{ status: string; total: number; tenders: BuyerTender[] }> => {
    const res = await fetch('/api/buyer/tenders');
    if (!res.ok) throw new Error('Gagal mengambil daftar tender buyer');
    return res.json();
  },

  createBuyerTender: async (payload: any): Promise<{ status: string; message: string; tender: BuyerTender }> => {
    const res = await fetch('/api/buyer/tenders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Gagal membuat tender baru');
    }
    return res.json();
  },

  getBuyerTenderById: async (id: string): Promise<{ status: string; tender: BuyerTender; bids: BuyerBidSubmission[]; qna: QnaItem[]; auctionBids: EAuctionBid[] }> => {
    const res = await fetch(`/api/buyer/tenders/${id}`);
    if (!res.ok) throw new Error('Tender buyer tidak ditemukan');
    return res.json();
  },

  updateBuyerTenderStatus: async (id: string, payload: { status?: string; approveStepLevel?: number; comment?: string }): Promise<{ status: string; message: string; tender: BuyerTender }> => {
    const res = await fetch(`/api/buyer/tenders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Gagal memperbarui status tender');
    return res.json();
  },

  getBuyerVendors: async (): Promise<{ status: string; total: number; vendors: BuyerVendor[] }> => {
    const res = await fetch('/api/buyer/vendors');
    if (!res.ok) throw new Error('Gagal mengambil daftar vendor SRM');
    return res.json();
  },

  updateBuyerVendorStatus: async (id: string, payload: { status: 'active' | 'blacklisted' | 'whitelisted'; reason?: string }): Promise<{ status: string; message: string; vendor: BuyerVendor }> => {
    const res = await fetch(`/api/buyer/vendors/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Gagal memperbarui status vendor');
    return res.json();
  },

  inviteBuyerVendors: async (id: string, vendorIds: string[]): Promise<{ status: string; message: string; invitedVendors: string[] }> => {
    const res = await fetch(`/api/buyer/tenders/${id}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorIds })
    });
    if (!res.ok) throw new Error('Gagal mengundang vendor');
    return res.json();
  },

  awardBuyerTender: async (tenderId: string, payload: { bidId: string; winnerName: string; winningAmount: number }): Promise<{ status: string; message: string; tender: BuyerTender }> => {
    const res = await fetch(`/api/buyer/tenders/${tenderId}/award`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Gagal menetapkan pemenang tender');
    return res.json();
  },

  postBuyerQna: async (tenderId: string, payload: { questionId?: string; answer?: string; question?: string; vendorName?: string }): Promise<{ status: string; message: string; qnaItem: QnaItem }> => {
    const res = await fetch(`/api/buyer/tenders/${tenderId}/qna`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Gagal memproses tanya-jawab');
    return res.json();
  },

  getBuyerAuction: async (tenderId: string): Promise<{ status: string; eAuctionActive: boolean; bids: EAuctionBid[] }> => {
    const res = await fetch(`/api/buyer/tenders/${tenderId}/auction`);
    if (!res.ok) throw new Error('Gagal mengambil data e-auction');
    return res.json();
  },

  postBuyerAuctionBid: async (tenderId: string, payload: { vendorAnonName: string; bidAmount: number }): Promise<{ status: string; message: string; bid: EAuctionBid }> => {
    const res = await fetch(`/api/buyer/tenders/${tenderId}/auction/bid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Gagal mengajukan penawaran e-auction');
    }
    return res.json();
  }

};

// Helper formatters
export function formatRupiah(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    return `Rp ${(amount / 1_000_000_000_000).toFixed(2)} Triliun`;
  }
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(2)} Miliar`;
  }
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)} Juta`;
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatFullRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'pengumuman':
      return { label: 'Pengumuman Tender', bg: 'bg-sky-500/10 text-sky-300 border-sky-500/30' };
    case 'prakualifikasi':
      return { label: 'Prakualifikasi', bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' };
    case 'upload_penawaran':
      return { label: 'Upload Penawaran', bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' };
    case 'evaluasi':
      return { label: 'Evaluasi Penawaran', bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
    case 'pemenang':
      return { label: 'Pengumuman Pemenang', bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30' };
    case 'selesai':
      return { label: 'Selesai / Kontrak', bg: 'bg-slate-800 text-slate-300 border-slate-700' };
    case 'batal':
      return { label: 'Dibatalkan', bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30' };
    default:
      return { label: status, bg: 'bg-slate-800 text-slate-300 border-slate-700' };
  }
}

export interface LpsePortalInfo {
  name: string;
  slug: string;
  baseUrl: string;
  lelangUrl: string;
  spseInaprocUrl: string;
  searchUrl: string;
  directUrl: string;
}

export function getLpsePortalInfo(tender: Partial<Tender>): LpsePortalInfo {
  const customUrl = tender.source_url || tender.sourceUrl || tender.lpseUrl;
  const kode = tender.kodeTender || '';
  const instansiLower = (tender.instansi || '').toLowerCase();
  const lokasiLower = (tender.lokasi || '').toLowerCase();
  const judulQuery = encodeURIComponent(tender.kodeTender || tender.judul || '');

  let slug = 'lkpp';
  let domain = 'lpse.lkpp.go.id';
  let name = 'SPSE LKPP National Portal';

  if (instansiLower.includes('pekerjaan umum') || instansiLower.includes('pupr')) {
    slug = 'pupr';
    domain = 'lpse.pu.go.id';
    name = 'LPSE Kementerian PUPR';
  } else if (instansiLower.includes('kesehatan') || instansiLower.includes('kemenkes')) {
    slug = 'kemkes';
    domain = 'lpse.kemkes.go.id';
    name = 'LPSE Kementerian Kesehatan';
  } else if (instansiLower.includes('perhubungan') || instansiLower.includes('kemenhub')) {
    slug = 'kemenhub';
    domain = 'lpse.dephub.go.id';
    name = 'LPSE Kementerian Perhubungan';
  } else if (instansiLower.includes('keuangan') || instansiLower.includes('kemenkeu')) {
    slug = 'kemenkeu';
    domain = 'lpse.kemenkeu.go.id';
    name = 'LPSE Kementerian Keuangan';
  } else if (instansiLower.includes('jakarta') || instansiLower.includes('dki')) {
    slug = 'jakarta';
    domain = 'lpse.jakarta.go.id';
    name = 'LPSE Provinsi DKI Jakarta';
  } else if (instansiLower.includes('surabaya')) {
    slug = 'surabaya';
    domain = 'lpse.surabaya.go.id';
    name = 'LPSE Kota Surabaya';
  } else if (instansiLower.includes('bandung')) {
    slug = 'bandung';
    domain = 'lpse.bandung.go.id';
    name = 'LPSE Kota Bandung';
  } else if (instansiLower.includes('banten') || lokasiLower.includes('banten')) {
    slug = 'bantenprov';
    domain = 'lpse.bantenprov.go.id';
    name = 'LPSE Provinsi Banten';
  } else if (instansiLower.includes('lebak') || lokasiLower.includes('lebak')) {
    slug = 'lebakkab';
    domain = 'lpse.lebakkab.go.id';
    name = 'LPSE Kabupaten Lebak';
  } else if (instansiLower.includes('jawa timur') || lokasiLower.includes('jawa timur')) {
    slug = 'jatimprov';
    domain = 'lpse.jatimprov.go.id';
    name = 'LPSE Provinsi Jawa Timur';
  } else if (instansiLower.includes('jawa barat') || lokasiLower.includes('jawa barat')) {
    slug = 'jabarprov';
    domain = 'lpse.jabarprov.go.id';
    name = 'LPSE Provinsi Jawa Barat';
  } else if (instansiLower.includes('jawa tengah') || lokasiLower.includes('jawa tengah')) {
    slug = 'jatengprov';
    domain = 'lpse.jatengprov.go.id';
    name = 'LPSE Provinsi Jawa Tengah';
  } else if (instansiLower.includes('agama') || instansiLower.includes('kemenag')) {
    slug = 'kemenag';
    domain = 'lpse.kemenag.go.id';
    name = 'LPSE Kementerian Agama';
  } else if (instansiLower.includes('pendidikan') || instansiLower.includes('kemdikbud')) {
    slug = 'kemdikbud';
    domain = 'lpse.kemdikbud.go.id';
    name = 'LPSE Kemendikbudristek';
  }

  const spseInaprocUrl = `https://spse.inaproc.id/${slug}/lelang`;
  const baseUrl = `https://spse.inaproc.id/${slug}`;
  const lelangUrl = `https://spse.inaproc.id/${slug}/lelang`;
  const searchUrl = `https://spse.inaproc.id/${slug}/lelang?txtnama=${judulQuery}`;
  
  const directUrl = customUrl && customUrl.trim() !== ''
    ? customUrl
    : (kode ? `https://spse.inaproc.id/${slug}/lelang/${kode}/pengumumanlelang` : spseInaprocUrl);

  return { name, slug, baseUrl, lelangUrl, spseInaprocUrl, searchUrl, directUrl };
}

export function getLpseUrl(tender: Partial<Tender>, mode: 'direct' | 'portal' | 'search' = 'direct'): string {
  const info = getLpsePortalInfo(tender);
  if (mode === 'portal') return info.lelangUrl;
  if (mode === 'search') return info.searchUrl;
  return info.directUrl;
}

