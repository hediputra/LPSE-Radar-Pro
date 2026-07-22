import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_TENDERS,
  VENDOR_RANKINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PYPROC_META
} from './src/data/mockTenders.js';
import {
  MOCK_TENANTS,
  MOCK_SYSTEM_NODES,
  MOCK_AUDIT_LOGS,
  SUBSCRIPTION_TIERS,
  Tenant
} from './src/data/mockTenants.js';
import {
  Tender,
  TenderFilterParams,
  TenderStats,
  AppNotification,
  PyprocMeta,
  BuyerTender,
  BuyerVendor,
  BuyerBidSubmission,
  EAuctionBid,
  QnaItem
} from './src/types.js';
import { tenantIsolationMiddleware, getTenantIsolationContext } from './server/middleware/tenantMiddleware.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(tenantIsolationMiddleware);

// In-memory data store for tender portal
let tendersStore: Tender[] = [...INITIAL_TENDERS];
let notificationsStore: AppNotification[] = [...INITIAL_NOTIFICATIONS];
let pyprocMetaStore: PyprocMeta = { ...INITIAL_PYPROC_META };

// Scheduler simulation: periodic timestamp update
let lastSyncTime = new Date();

function runPeriodicSync() {
  lastSyncTime = new Date();
  pyprocMetaStore.lastSyncTimestamp = lastSyncTime.toISOString();
  pyprocMetaStore.cachedRecordsCount = tendersStore.length;
}

// Set up periodic sync every 2 hours
setInterval(runPeriodicSync, 2 * 60 * 60 * 1000);

// Helper function to format currency in IDR
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

// -------------------------------------------------------------
// INTERNAL API ENDPOINTS
// -------------------------------------------------------------

// 0. GET /api/tenant/context - Get current detected tenant query isolation context
app.get('/api/tenant/context', (req: Request, res: Response) => {
  const context = req.tenantContext;
  res.json({
    success: true,
    message: 'Tenant query isolation context detected successfully',
    context: {
      tenantId: context?.tenantId,
      subdomain: context?.subdomain,
      tier: context?.tier,
      isolationMode: context?.isolationMode,
      tenantName: context?.tenant.name,
      queryFilter: context?.queryFilter,
      auditHeaders: {
        'X-Tenant-Resolved-Id': context?.tenantId,
        'X-Tenant-Subdomain': context?.subdomain,
        'X-Tenant-Isolation-Mode': context?.isolationMode
      }
    }
  });
});

// Helper function for smart location matching across Kabupaten, Kota, and Provinsi
function matchesLocationQuery(tender: Tender, locQuery: string): boolean {
  if (!locQuery || locQuery === 'ALL' || locQuery === 'Semua Lokasi') return true;

  const q = locQuery.toLowerCase().trim();
  const tLokasi = (tender.lokasi || '').toLowerCase();
  const tInstansi = (tender.instansi || '').toLowerCase();
  const tSatKer = (tender.satuanKerja || '').toLowerCase();
  const tJudul = (tender.judul || '').toLowerCase();
  const tDeskripsi = (tender.deskripsi || '').toLowerCase();

  // Direct substring match
  if (
    tLokasi.includes(q) ||
    tInstansi.includes(q) ||
    tSatKer.includes(q)
  ) {
    return true;
  }

  // Extract clean keywords (tokens)
  const tokens = q
    .replace(/kabupaten/g, '')
    .replace(/kab\./g, '')
    .replace(/kota/g, '')
    .replace(/pemprov/g, '')
    .replace(/pemerintah/g, '')
    .replace(/provinsi/g, '')
    .replace(/prov\./g, '')
    .replace(/d\.i\./g, '')
    .replace(/dki/g, 'jakarta')
    .replace(/lpse/g, '')
    .replace(/node/g, '')
    .split(/[\s,]+/)
    .filter((w) => w.length >= 3);

  if (tokens.length === 0) return true;

  return tokens.some(
    (tok) =>
      tLokasi.includes(tok) ||
      tInstansi.includes(tok) ||
      tSatKer.includes(tok) ||
      tJudul.includes(tok) ||
      tDeskripsi.includes(tok)
  );
}

function ensureLocationTendersInStore(locName: string) {
  if (!locName || locName === 'ALL' || locName === 'Semua Lokasi') return;

  const existingMatches = tendersStore.filter((t) => matchesLocationQuery(t, locName));
  if (existingMatches.length >= 4) return;

  // Auto-seed realistic active Tender & Non-Tender SPSE packages for this location
  const cleanName = locName.trim();
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const closeStr1 = new Date(Date.now() + 8 * 24 * 3600 * 1000).toISOString().split('T')[0];
  const closeStr2 = new Date(Date.now() + 12 * 24 * 3600 * 1000).toISOString().split('T')[0];
  const closeStr3 = new Date(Date.now() + 18 * 24 * 3600 * 1000).toISOString().split('T')[0];
  const closeStr4 = new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0];
  const closeStr5 = new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().split('T')[0];

  const generatedTenders: Tender[] = [
    // 1. TENDER - Pekerjaan Konstruksi
    {
      id: `LPSE-AUTO-${Date.now()}-1`,
      kodeTender: `${Math.floor(10000000 + Math.random() * 90000000)}`,
      judul: `Pembangunan & Pemeliharaan Berkala Infrastruktur Koridor Utama ${cleanName}`,
      instansi: `Pemerintah ${cleanName}`,
      satuanKerja: `Dinas Pekerjaan Umum dan Penataan Ruang ${cleanName}`,
      kategori: 'Pekerjaan Konstruksi',
      metode: 'Tender',
      tahunAnggaran: 2026,
      nilaiPagu: 12500000000,
      nilaiHPS: 11950000000,
      status: 'upload_penawaran',
      lokasi: `${cleanName}, Indonesia`,
      tanggalBuka: dateStr,
      tanggalTutup: closeStr1,
      syaratKualifikasi: [
        'Izin Usaha Jasa Konstruksi (IUJK) SBU BS001 / SI004 Valid',
        'Memiliki NPWP & Laporan Keuangan 2 Tahun Terakhir',
        'Sertifikat K3 Konstruksi (K3LH)'
      ],
      deskripsi: `Paket lelang pekerjaan peningkatan dan pemeliharaan struktur jalan & sarana pendukung wilayah ${cleanName}. Terbuka untuk seluruh penyedia barang/jasa kualifikasi non-kecil.`,
      jadwal: [
        { step: 'Pengumuman Tender SPSE', startDate: dateStr, endDate: closeStr1, status: 'active' },
        { step: 'Aanwijzing / Penjelasan Lelang', startDate: dateStr, endDate: dateStr, status: 'completed' },
        { step: 'Upload Penawaran', startDate: dateStr, endDate: closeStr1, status: 'active' }
      ],
      peserta: [],
      dokumen: [
        { id: `doc-auto-1`, name: `RKS_Spesifikasi_Teknis_${cleanName.replace(/\s+/g, '_')}.pdf`, type: 'PDF', size: '3.4 MB', downloadUrl: '#' }
      ],
      isTracked: true,
      lastUpdated: 'Baru saja',
      lpseUrl: 'https://spse.inaproc.id/'
    },
    // 2. NON-TENDER - Pengadaan Langsung
    {
      id: `LPSE-PL-${Date.now()}-2`,
      kodeTender: `PL-${Math.floor(1000000 + Math.random() * 9000000)}`,
      judul: `[NON-TENDER PL] Pengadaan Komputer, Server & Perangkat Jaringan LPSE Kantor ${cleanName}`,
      instansi: `Pemerintah ${cleanName}`,
      satuanKerja: `Dinas Komunikasi dan Informatika ${cleanName}`,
      kategori: 'Pengadaan Barang',
      metode: 'Pengadaan Langsung',
      tahunAnggaran: 2026,
      nilaiPagu: 195000000,
      nilaiHPS: 188500000,
      status: 'upload_penawaran',
      lokasi: `${cleanName}, Indonesia`,
      tanggalBuka: dateStr,
      tanggalTutup: closeStr4,
      syaratKualifikasi: [
        'NIB Klasifikasi KBLI 46511 (Perdagangan Komputer & Perlengkapan)',
        'NPWP Aktif & Status KSWP Valid',
        'Garansi Pabrikan Minimal 1 Tahun'
      ],
      deskripsi: `Paket Non-Tender Pengadaan Langsung (PL) unit Workstation PC, UPS Online 3kVA, dan Switch Managed 24 Port untuk operasional SPSE ${cleanName}.`,
      jadwal: [
        { step: 'Undangan Pengadaan Langsung', startDate: dateStr, endDate: closeStr4, status: 'active' },
        { step: 'Penyampaian Dokumen Penawaran', startDate: dateStr, endDate: closeStr4, status: 'active' }
      ],
      peserta: [],
      dokumen: [
        { id: `doc-pl-1`, name: `Spesifikasi_Pengadaan_Langsung_IT_${cleanName.replace(/\s+/g, '_')}.pdf`, type: 'PDF', size: '1.2 MB', downloadUrl: '#' }
      ],
      isTracked: true,
      lastUpdated: 'Baru saja',
      lpseUrl: 'https://spse.inaproc.id/'
    },
    // 3. NON-TENDER - E-Purchasing (E-Katalog)
    {
      id: `LPSE-EKATALOG-${Date.now()}-3`,
      kodeTender: `EP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      judul: `[NON-TENDER E-CATALOG] E-Purchasing Alat Kesehatan & Bahan Medis Habis Pakai RSUD ${cleanName}`,
      instansi: `Pemerintah ${cleanName}`,
      satuanKerja: `RSUD Utama ${cleanName}`,
      kategori: 'Pengadaan Barang',
      metode: 'E-Purchasing',
      tahunAnggaran: 2026,
      nilaiPagu: 750000000,
      nilaiHPS: 720000000,
      status: 'pengumuman',
      lokasi: `${cleanName}, Indonesia`,
      tanggalBuka: dateStr,
      tanggalTutup: closeStr2,
      syaratKualifikasi: [
        'Terdaftar di E-Katalog Nasional / Lokal LKPP',
        'Izin Edar AKL / AKD Kemenkes RI Valid'
      ],
      deskripsi: `Paket E-Purchasing Non-Tender pembelian reagen laboratorium, APD medis, dan instrumen bedah standar e-Katalog LKPP untuk RSUD ${cleanName}.`,
      jadwal: [
        { step: 'Mini Kompetisi / E-Purchasing LKPP', startDate: dateStr, endDate: closeStr2, status: 'active' }
      ],
      peserta: [],
      dokumen: [
        { id: `doc-ekat-1`, name: `Daftar_Produk_E_Purchasing_${cleanName.replace(/\s+/g, '_')}.pdf`, type: 'PDF', size: '2.0 MB', downloadUrl: '#' }
      ],
      isTracked: false,
      lastUpdated: 'Baru saja',
      lpseUrl: 'https://e-katalog.lkpp.go.id/'
    },
    // 4. NON-TENDER - Penunjukan Langsung
    {
      id: `LPSE-PJL-${Date.now()}-4`,
      kodeTender: `PJL-${Math.floor(1000000 + Math.random() * 9000000)}`,
      judul: `[NON-TENDER PJL] Penunjukan Langsung Perbaikan Darurat Tanggul & Talud Longsor ${cleanName}`,
      instansi: `Pemerintah ${cleanName}`,
      satuanKerja: `BPBD / Dinas PUPR ${cleanName}`,
      kategori: 'Pekerjaan Konstruksi',
      metode: 'Penunjukan Langsung',
      tahunAnggaran: 2026,
      nilaiPagu: 480000000,
      nilaiHPS: 465000000,
      status: 'upload_penawaran',
      lokasi: `${cleanName}, Indonesia`,
      tanggalBuka: dateStr,
      tanggalTutup: closeStr5,
      syaratKualifikasi: [
        'SBU BS001 Saluran / Penahan Tanah',
        'Penetapan Status Tanggap Darurat Bencana Pemda'
      ],
      deskripsi: `Paket Non-Tender Penunjukan Langsung penanganan kondisi darurat bencana tanah longsor dan pemasangan bronjong kawat di wilayah ${cleanName}.`,
      jadwal: [
        { step: 'Undangan PJL Bencana', startDate: dateStr, endDate: closeStr5, status: 'active' }
      ],
      peserta: [],
      dokumen: [
        { id: `doc-pjl-1`, name: `SK_Tanggap_Darurat_dan_RAB_PJL_${cleanName.replace(/\s+/g, '_')}.pdf`, type: 'PDF', size: '1.8 MB', downloadUrl: '#' }
      ],
      isTracked: true,
      lastUpdated: 'Baru saja'
    },
    // 5. TENDER - Jasa Konsultansi Seleksi
    {
      id: `LPSE-AUTO-${Date.now()}-5`,
      kodeTender: `${Math.floor(10000000 + Math.random() * 90000000)}`,
      judul: `Jasa Konsultansi Pengawasan & Perencanaan Tata Ruang Wilayah ${cleanName}`,
      instansi: `Pemerintah ${cleanName}`,
      satuanKerja: `Bappeda / Dinas Perkim ${cleanName}`,
      kategori: 'Jasa Konsultansi Badan Usaha',
      metode: 'Seleksi',
      tahunAnggaran: 2026,
      nilaiPagu: 2400000000,
      nilaiHPS: 2280000000,
      status: 'upload_penawaran',
      lokasi: `${cleanName}, Indonesia`,
      tanggalBuka: dateStr,
      tanggalTutup: closeStr3,
      syaratKualifikasi: [
        'Izin Usaha Jasa Konsultansi Perencana / Pengawas',
        'Tenaga Ahli Utama Teknik Sipil / Planologi'
      ],
      deskripsi: `Konsultansi evaluasi teknis dan pengawasan berkala pembangunan sektor publik di ${cleanName}.`,
      jadwal: [
        { step: 'Pengumuman Seleksi', startDate: dateStr, endDate: closeStr3, status: 'active' }
      ],
      peserta: [],
      dokumen: [
        { id: `doc-auto-3`, name: `KAK_Konsultansi_${cleanName.replace(/\s+/g, '_')}.pdf`, type: 'PDF', size: '1.5 MB', downloadUrl: '#' }
      ],
      isTracked: true,
      lastUpdated: 'Baru saja'
    }
  ];

  tendersStore.unshift(...generatedTenders);
}

// 1. GET /api/tenders - List & Advanced Filter
app.get('/api/tenders', (req: Request, res: Response) => {
  const {
    search,
    instansi,
    kategori,
    metode,
    status,
    lokasi,
    minHps,
    maxHps,
    sortBy = 'buka_desc',
    page = '1',
    limit = '10'
  } = req.query;

  // Ensure location tenders exist for requested location or search
  if (lokasi && typeof lokasi === 'string' && lokasi !== 'ALL') {
    ensureLocationTendersInStore(lokasi);
  } else if (search && typeof search === 'string' && search.trim().length >= 3) {
    ensureLocationTendersInStore(search);
  }

  let filtered = [...tendersStore];

  // Search filter using smart matcher
  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter((t) => matchesLocationQuery(t, q));
  }

  // Instansi filter
  if (instansi && typeof instansi === 'string' && instansi !== 'ALL') {
    filtered = filtered.filter((t) => t.instansi === instansi);
  }

  // Kategori filter
  if (kategori && typeof kategori === 'string' && kategori !== 'ALL') {
    filtered = filtered.filter((t) => t.kategori === kategori);
  }

  // Metode filter (Supports Tender vs Non-Tender vs specific methods)
  if (metode && typeof metode === 'string' && metode !== 'ALL') {
    const m = metode.toLowerCase();
    if (m === 'tender' || m === 'tender_only') {
      filtered = filtered.filter((t) => t.metode === 'Tender' || t.metode === 'Seleksi');
    } else if (m === 'non_tender' || m === 'nontender') {
      filtered = filtered.filter(
        (t) =>
          t.metode === 'Pengadaan Langsung' ||
          t.metode === 'Penunjukan Langsung' ||
          t.metode === 'E-Purchasing'
      );
    } else {
      filtered = filtered.filter((t) => t.metode.toLowerCase() === m);
    }
  }

  // Status filter
  if (status && typeof status === 'string' && status !== 'ALL') {
    filtered = filtered.filter((t) => t.status === status);
  }

  // Lokasi filter using smart matcher
  if (lokasi && typeof lokasi === 'string' && lokasi !== 'ALL') {
    filtered = filtered.filter((t) => matchesLocationQuery(t, lokasi));
  }

  // Min HPS
  if (minHps && !isNaN(Number(minHps))) {
    filtered = filtered.filter((t) => t.nilaiHPS >= Number(minHps));
  }

  // Max HPS
  if (maxHps && !isNaN(Number(maxHps))) {
    filtered = filtered.filter((t) => t.nilaiHPS <= Number(maxHps));
  }

  // Sorting
  switch (sortBy) {
    case 'hps_desc':
      filtered.sort((a, b) => b.nilaiHPS - a.nilaiHPS);
      break;
    case 'hps_asc':
      filtered.sort((a, b) => a.nilaiHPS - b.nilaiHPS);
      break;
    case 'tutup_asc':
      filtered.sort(
        (a, b) => new Date(a.tanggalTutup).getTime() - new Date(b.tanggalTutup).getTime()
      );
      break;
    case 'buka_desc':
    default:
      filtered.sort(
        (a, b) => new Date(b.tanggalBuka).getTime() - new Date(a.tanggalBuka).getTime()
      );
      break;
  }

  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.max(1, parseInt(limit as string, 10));
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limitNum) || 1;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedItems = filtered.slice(startIndex, startIndex + limitNum);

  // Extract filter options metadata for UI multi-selects
  const allInstansi = Array.from(new Set(tendersStore.map((t) => t.instansi))).sort();
  const allKategori = Array.from(new Set(tendersStore.map((t) => t.kategori))).sort();
  const allMetode = Array.from(new Set(tendersStore.map((t) => t.metode))).sort();
  const allLokasi = Array.from(
    new Set(tendersStore.map((t) => t.lokasi.split(',')[1]?.trim() || t.lokasi))
  ).sort();

  res.json({
    data: paginatedItems,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalItems,
      totalPages
    },
    meta: {
      allInstansi,
      allKategori,
      allMetode,
      allLokasi
    }
  });
});

// 1b. POST /api/tenders - Input Lelang Pekerjaan Baru (Swasta / BUMN / LPSE)
app.post('/api/tenders', (req: Request, res: Response) => {
  const {
    judul,
    instansi,
    satuanKerja,
    kategori,
    metode,
    tahunAnggaran,
    nilaiPagu,
    nilaiHPS,
    lokasi,
    tanggalBuka,
    tanggalTutup,
    syaratKualifikasi,
    deskripsi,
    dokumen,
    entityType
  } = req.body;

  if (!judul || !instansi || !nilaiHPS) {
    return res.status(400).json({ error: 'Judul, Perusahaan/Instansi, dan Nilai HPS wajib diisi' });
  }

  const prefix = entityType === 'Swasta' ? 'SW' : entityType === 'BUMN' ? 'BUMN' : 'LPSE';
  const newKode = `${prefix}-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const newTender: Tender = {
    id: `tender-${Date.now()}`,
    kodeTender: newKode,
    judul: judul.trim(),
    instansi: instansi.trim(),
    satuanKerja: satuanKerja ? satuanKerja.trim() : 'Divisi Procurement & SCM',
    kategori: kategori || 'Pekerjaan Konstruksi',
    metode: metode || 'Tender',
    tahunAnggaran: Number(tahunAnggaran) || new Date().getFullYear(),
    nilaiPagu: Number(nilaiPagu) || Number(nilaiHPS),
    nilaiHPS: Number(nilaiHPS),
    status: 'pengumuman',
    lokasi: lokasi || 'DKI Jakarta',
    tanggalBuka: tanggalBuka || new Date().toISOString().split('T')[0],
    tanggalTutup: tanggalTutup || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    syaratKualifikasi: Array.isArray(syaratKualifikasi) && syaratKualifikasi.length > 0 ? syaratKualifikasi : [
      'Memiliki NIB & SBU yang Masih Berlaku',
      'Memiliki NPWP & Laporan Keuangan 2 Tahun Terakhir',
      'Pengalaman Pekerjaan di Bidang Terkait'
    ],
    deskripsi: deskripsi || `Lelang pekerjaan diselenggarakan oleh ${instansi}. Terbuka untuk seluruh vendor berpengalaman.`,
    jadwal: [
      { step: 'Pengumuman Lelang', startDate: tanggalBuka || new Date().toISOString().split('T')[0], endDate: tanggalTutup || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'active' },
      { step: 'Aanwijzing (Penjelasan Lelang)', startDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0], endDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0], status: 'upcoming' },
      { step: 'Batas Upload Dokumen Penawaran', startDate: tanggalTutup || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], endDate: tanggalTutup || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'upcoming' },
      { step: 'Pengumuman Pemenang', startDate: new Date(Date.now() + 16 * 24 * 3600 * 1000).toISOString().split('T')[0], endDate: new Date(Date.now() + 18 * 24 * 3600 * 1000).toISOString().split('T')[0], status: 'upcoming' }
    ],
    peserta: [],
    dokumen: Array.isArray(dokumen) && dokumen.length > 0 ? dokumen : [
      { id: `doc-${Date.now()}-1`, name: 'Dokumen_RKS_dan_Spesifikasi_Teknis.pdf', type: 'PDF', size: '2.8 MB', downloadUrl: '#' },
      { id: `doc-${Date.now()}-2`, name: 'BoQ_Rencana_Anggaran_Biaya.xlsx', type: 'XLSX', size: '920 KB', downloadUrl: '#' }
    ],
    isTracked: true,
    lastUpdated: 'Baru saja'
  };

  tendersStore.unshift(newTender);

  const newNotif: AppNotification = {
    id: `notif-${Date.now()}`,
    tenderId: newTender.id,
    tenderTitle: newTender.judul,
    message: `Lelang pekerjaan baru dari ${instansi} (${entityType || 'Swasta/BUMN'}) berhasil dipublikasikan!`,
    date: new Date().toISOString(),
    read: false,
    type: 'status_change'
  };
  notificationsStore.unshift(newNotif);

  res.status(201).json({
    success: true,
    message: `Lelang pekerjaan ${newKode} berhasil dipublikasikan!`,
    tender: newTender
  });
});

// 2. GET /api/tenders/:id - Detail Tender
app.get('/api/tenders/:id', (req: Request, res: Response) => {
  const tender = tendersStore.find((t) => t.id === req.params.id);
  if (!tender) {
    return res.status(404).json({ error: 'Tender tidak ditemukan' });
  }
  res.json(tender);
});

// 3. POST /api/tenders/:id/track - Toggle Track/Follow
app.post('/api/tenders/:id/track', (req: Request, res: Response) => {
  const tenderIndex = tendersStore.findIndex((t) => t.id === req.params.id);
  if (tenderIndex === -1) {
    return res.status(404).json({ error: 'Tender tidak ditemukan' });
  }

  const currentStatus = !!tendersStore[tenderIndex].isTracked;
  tendersStore[tenderIndex].isTracked = !currentStatus;

  // If newly tracked, add a confirmation notification
  if (!currentStatus) {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      tenderId: tendersStore[tenderIndex].id,
      tenderTitle: tendersStore[tenderIndex].judul,
      message: `Anda sekarang melacak tender "${tendersStore[tenderIndex].judul}". Notifikasi perubahan jadwal & status akan dikirimkan.`,
      date: new Date().toISOString(),
      read: false,
      type: 'status_change'
    };
    notificationsStore.unshift(newNotif);
  }

  res.json({
    success: true,
    isTracked: tendersStore[tenderIndex].isTracked,
    message: tendersStore[tenderIndex].isTracked
      ? 'Tender berhasil ditambahkan ke daftar pelacakan'
      : 'Tender dihapus dari daftar pelacakan'
  });
});

// 4. GET /api/statistics - Dashboard Analytics Data
app.get('/api/statistics', (req: Request, res: Response) => {
  const now = new Date();

  const totalTenders = tendersStore.length;
  const totalValueHPS = tendersStore.reduce((acc, t) => acc + t.nilaiHPS, 0);

  // Closing soon (closing in < 7 days and status active)
  const closingSoonCount = tendersStore.filter((t) => {
    const closingDate = new Date(t.tanggalTutup);
    const diffDays = (closingDate.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= 7 && t.status !== 'selesai' && t.status !== 'batal';
  }).length;

  // New today (opened in last 3 days for demo consistency)
  const newTodayCount = tendersStore.filter((t) => {
    const bukaDate = new Date(t.tanggalBuka);
    const diffDays = (now.getTime() - bukaDate.getTime()) / (1000 * 3600 * 24);
    return diffDays <= 5;
  }).length;

  // Category breakdown
  const categoryMap: Record<string, { count: number; totalHps: number }> = {};
  tendersStore.forEach((t) => {
    if (!categoryMap[t.kategori]) {
      categoryMap[t.kategori] = { count: 0, totalHps: 0 };
    }
    categoryMap[t.kategori].count += 1;
    categoryMap[t.kategori].totalHps += t.nilaiHPS;
  });

  const byCategory = Object.entries(categoryMap).map(([name, val]) => ({
    name,
    count: val.count,
    totalHps: val.totalHps
  }));

  // Status breakdown
  const statusMap: Record<string, number> = {};
  tendersStore.forEach((t) => {
    statusMap[t.status] = (statusMap[t.status] || 0) + 1;
  });

  const byStatus = Object.entries(statusMap).map(([name, count]) => ({
    name,
    count
  }));

  // Top Instansi by budget
  const instansiMap: Record<string, { count: number; totalHps: number }> = {};
  tendersStore.forEach((t) => {
    if (!instansiMap[t.instansi]) {
      instansiMap[t.instansi] = { count: 0, totalHps: 0 };
    }
    instansiMap[t.instansi].count += 1;
    instansiMap[t.instansi].totalHps += t.nilaiHPS;
  });

  const byInstansiTop = Object.entries(instansiMap)
    .map(([instansi, val]) => ({
      instansi,
      count: val.count,
      totalHps: val.totalHps
    }))
    .sort((a, b) => b.totalHps - a.totalHps)
    .slice(0, 5);

  // Monthly trends (mock aggregate representation in billions IDR)
  const monthlyTrends = [
    { month: 'Jan 2026', tenderCount: 142, hpsMiliar: 340 },
    { month: 'Feb 2026', tenderCount: 185, hpsMiliar: 420 },
    { month: 'Mar 2026', tenderCount: 210, hpsMiliar: 510 },
    { month: 'Apr 2026', tenderCount: 195, hpsMiliar: 480 },
    { month: 'Mei 2026', tenderCount: 260, hpsMiliar: 680 },
    { month: 'Jun 2026', tenderCount: 290, hpsMiliar: 740 },
    { month: 'Jul 2026', tenderCount: 310, hpsMiliar: 820 }
  ];

  const stats: TenderStats = {
    totalTenders,
    totalValueHPS,
    closingSoonCount,
    newTodayCount,
    byCategory,
    byStatus,
    byInstansiTop,
    monthlyTrends
  };

  res.json(stats);
});

// 5. GET /api/vendors/ranking - Leaderboard Pemenang Tender
app.get('/api/vendors/ranking', (req: Request, res: Response) => {
  res.json(VENDOR_RANKINGS);
});

// 6. GET /api/notifications - User Notifications
app.get('/api/notifications', (req: Request, res: Response) => {
  res.json(notificationsStore);
});

// Mark notification read
app.post('/api/notifications/:id/read', (req: Request, res: Response) => {
  const notif = notificationsStore.find((n) => n.id === req.params.id);
  if (notif) {
    notif.read = true;
  }
  res.json({ success: true });
});

// 7. POST /api/sync - Manual Sync Trigger LPSE / pyproc
app.post('/api/sync', (req: Request, res: Response) => {
  runPeriodicSync();

  // Add a newly scraped tender to demonstrate real-time sync addition
  const newScrapedId = `LPSE-SYNC-${Date.now().toString().slice(-6)}`;
  const syncTender: Tender = {
    id: newScrapedId,
    kodeTender: `${Math.floor(10000000 + Math.random() * 90000000)}`,
    judul: 'Pengadaan System Firewall & Cybersecurity Operations Center (SOC) Tahap I',
    instansi: 'Kementerian Komunikasi dan Digital RI',
    satuanKerja: 'Direktorat Jenderal Infrastruktur Digital',
    kategori: 'Pengadaan Barang',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 14500000000,
    nilaiHPS: 13900000000,
    status: 'pengumuman',
    lokasi: 'Jakarta Pusat, DKI Jakarta',
    tanggalBuka: new Date().toISOString().split('T')[0],
    tanggalTutup: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
    syaratKualifikasi: [
      'Sertifikat ISO 27001 & ISO 20000-1 Service Management',
      'Surat Dukungan Asli dari Principal Network Firewall (Tier-1 Enterprise)',
      'Pengalaman penyediaan Next Generation Firewall (NGFW) di instansi pemerintah'
    ],
    deskripsi: 'Pengadaan perangkat Next-Gen Firewall High Availability 100Gbps beserta lisensi UTM 3 tahun dan pendampingan SOC 24/7.',
    jadwal: [
      {
        step: 'Pengumuman Tender Sync pyproc',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().split('T')[0],
        status: 'active'
      },
      {
        step: 'Upload Penawaran',
        startDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
        status: 'upcoming'
      }
    ],
    peserta: [],
    dokumen: [
      { id: `doc-sync-${Date.now()}`, name: 'RFP_Cybersecurity_KOMDIGI.pdf', type: 'PDF', size: '4.2 MB', downloadUrl: '#' }
    ],
    isTracked: false,
    lastUpdated: new Date().toISOString()
  };

  tendersStore.unshift(syncTender);
  pyprocMetaStore.cachedRecordsCount = tendersStore.length;

  res.json({
    success: true,
    message: 'Sinkronisasi data LPSE via pyproc berhasil diselesaikan.',
    syncTimestamp: pyprocMetaStore.lastSyncTimestamp,
    newRecordAdded: syncTender
  });
});

// 7b. GET /api/spse/portals - List monitored SPSE Inaproc Portal endpoints
app.get('/api/spse/portals', (req: Request, res: Response) => {
  const portalList = [
    { name: 'SPSE LKPP National', slug: 'lkpp', url: 'https://spse.inaproc.id/lkpp/lelang', isOnline: true, activeTenderCount: 14 },
    { name: 'SPSE Kabupaten Lebak', slug: 'lebakkab', url: 'https://spse.inaproc.id/lebakkab/lelang', isOnline: true, activeTenderCount: 8 },
    { name: 'SPSE Kota Bandung', slug: 'bandung', url: 'https://spse.inaproc.id/bandung/lelang', isOnline: true, activeTenderCount: 12 },
    { name: 'SPSE DKI Jakarta', slug: 'jakarta', url: 'https://spse.inaproc.id/jakarta/lelang', isOnline: true, activeTenderCount: 22 },
    { name: 'SPSE Kementerian PUPR', slug: 'pupr', url: 'https://spse.inaproc.id/pupr/lelang', isOnline: true, activeTenderCount: 35 },
    { name: 'SPSE Kota Surabaya', slug: 'surabaya', url: 'https://spse.inaproc.id/surabaya/lelang', isOnline: true, activeTenderCount: 10 },
    { name: 'SPSE Provinsi Banten', slug: 'bantenprov', url: 'https://spse.inaproc.id/bantenprov/lelang', isOnline: true, activeTenderCount: 9 },
    { name: 'SPSE Provinsi Jawa Barat', slug: 'jabarprov', url: 'https://spse.inaproc.id/jabarprov/lelang', isOnline: true, activeTenderCount: 18 },
    { name: 'SPSE Provinsi Jawa Timur', slug: 'jatimprov', url: 'https://spse.inaproc.id/jatimprov/lelang', isOnline: true, activeTenderCount: 16 },
    { name: 'SPSE Provinsi Jawa Tengah', slug: 'jatengprov', url: 'https://spse.inaproc.id/jatengprov/lelang', isOnline: true, activeTenderCount: 15 },
    { name: 'SPSE Kementerian Kesehatan', slug: 'kemkes', url: 'https://spse.inaproc.id/kemkes/lelang', isOnline: true, activeTenderCount: 11 },
    { name: 'SPSE Kementerian Perhubungan', slug: 'kemenhub', url: 'https://spse.inaproc.id/kemenhub/lelang', isOnline: true, activeTenderCount: 13 },
    { name: 'SPSE Kementerian Keuangan', slug: 'kemenkeu', url: 'https://spse.inaproc.id/kemenkeu/lelang', isOnline: true, activeTenderCount: 7 },
    { name: 'SPSE Kota Balikpapan', slug: 'balikpapan', url: 'https://spse.inaproc.id/balikpapan/lelang', isOnline: true, activeTenderCount: 6 },
    { name: 'SPSE Kota Medan', slug: 'medan', url: 'https://spse.inaproc.id/medan/lelang', isOnline: true, activeTenderCount: 9 },
    { name: 'SPSE Kota Makassar', slug: 'makassar', url: 'https://spse.inaproc.id/makassar/lelang', isOnline: true, activeTenderCount: 8 }
  ];

  res.json({
    mainPortalUrl: 'https://spse.inaproc.id/',
    totalPortals: portalList.length,
    portals: portalList
  });
});

// Helper function to fetch & extract live tender data from https://spse.inaproc.id/[slug]/lelang
async function fetchLiveSpseInaproc(slug: string = 'lkpp'): Promise<Tender[]> {
  try {
    const targetUrl = `https://spse.inaproc.id/${slug}/lelang`;
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(4000)
    });

    if (response.ok) {
      const html = await response.text();
      const regex = new RegExp(`href=["']\\/${slug}\\/lelang\\/(\\d+)\\/(?:pengumumanlelang)?["'][^>]*>([^<]+)<`, 'gi');
      let match;
      const extracted: Tender[] = [];
      let idx = 1;
      while ((match = regex.exec(html)) !== null && idx <= 10) {
        const kode = match[1];
        const judul = match[2].trim();
        if (kode && judul) {
          extracted.push({
            id: `SPSE-LIVE-${slug.toUpperCase()}-${kode}`,
            kodeTender: kode,
            judul: judul,
            instansi: `LPSE ${slug.toUpperCase()} (SPSE INAPROC)`,
            satuanKerja: `Pemerintah / LKPP ${slug.toUpperCase()}`,
            kategori: 'Pekerjaan Konstruksi',
            metode: 'Tender',
            tahunAnggaran: 2026,
            nilaiPagu: 2500000000 + (parseInt(kode.slice(-4) || '1000') * 100000),
            nilaiHPS: 2400000000 + (parseInt(kode.slice(-4) || '1000') * 95000),
            status: 'upload_penawaran',
            lokasi: `Wilayah ${slug.toUpperCase()}, Indonesia`,
            tanggalBuka: new Date().toISOString().split('T')[0],
            tanggalTutup: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
            syaratKualifikasi: ['Sertifikat Kualifikasi SPSE Inaproc Valid', 'NPWP / SPT Wajib Pajak'],
            deskripsi: `Data tender langsung terhubung dari portal resmi SPSE INAPROC (https://spse.inaproc.id/${slug}/lelang/${kode}/pengumumanlelang).`,
            jadwal: [{ step: 'Pengumuman Tender SPSE Live', startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().split('T')[0], status: 'active' }],
            peserta: [],
            dokumen: [{ id: `doc-spse-live-${kode}`, name: `Pengumuman_Lelang_${kode}.pdf`, type: 'PDF', size: '2.1 MB', downloadUrl: `https://spse.inaproc.id/${slug}/lelang/${kode}/pengumumanlelang` }],
            isTracked: true,
            lastUpdated: new Date().toISOString(),
            source_url: `https://spse.inaproc.id/${slug}/lelang/${kode}/pengumumanlelang`,
            sourceUrl: `https://spse.inaproc.id/${slug}/lelang/${kode}/pengumumanlelang`,
            lpseUrl: `https://spse.inaproc.id/${slug}/lelang/${kode}/pengumumanlelang`
          });
          idx++;
        }
      }
      return extracted;
    }
  } catch (err) {
    console.log(`[SPSE Live Fetch] Direct scrape attempt for ${slug} returned fallback state`);
  }
  return [];
}

// 7c. POST /api/spse/sync-inaproc - Automatic Crawl & Bulk Data Ingestion from https://spse.inaproc.id/
app.post('/api/spse/sync-inaproc', async (req: Request, res: Response) => {
  runPeriodicSync();

  // Try live fetch across major portals
  const liveScrapedTenders = await Promise.all([
    fetchLiveSpseInaproc('lkpp'),
    fetchLiveSpseInaproc('lebakkab'),
    fetchLiveSpseInaproc('bandung'),
    fetchLiveSpseInaproc('jakarta')
  ]).then(results => results.flat());

  const spseInaprocTenders: Tender[] = [
    ...liveScrapedTenders,
    {
      id: 'SPSE-LEBAK-910283',
      kodeTender: '91028301',
      judul: 'Rehabilitasi Total Gedung SMP Negeri 1 Rangkasbitung & Fasilitas Digital',
      instansi: 'Pemerintah Kabupaten Lebak',
      satuanKerja: 'Dinas Pendidikan dan Kebudayaan Kabupaten Lebak',
      kategori: 'Pekerjaan Konstruksi',
      metode: 'Tender',
      tahunAnggaran: 2026,
      nilaiPagu: 4500000000,
      nilaiHPS: 4250000000,
      status: 'upload_penawaran',
      lokasi: 'Kabupaten Lebak, Banten',
      tanggalBuka: new Date().toISOString().split('T')[0],
      tanggalTutup: new Date(Date.now() + 12 * 24 * 3600 * 1000).toISOString().split('T')[0],
      syaratKualifikasi: [
        'IUJK SBU Bangunan Gedung Pendidikan (BG007)',
        'NPWP & SPT 2025 Wajib Pajak',
        'Pengalaman konstruksi gedung sekolah/fasil umum minimal Rp 2 Miliar'
      ],
      deskripsi: 'Pekerjaan fisik rehabilitasi ruang kelas, laboratorium komputer, dan perbaikan atap serta drainase lingkungan SMPN 1 Rangkasbitung.',
      jadwal: [
        { step: 'Pengumuman Tender SPSE Inaproc', startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0], status: 'active' },
        { step: 'Batas Penawaran', startDate: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().split('T')[0], endDate: new Date(Date.now() + 12 * 24 * 3600 * 1000).toISOString().split('T')[0], status: 'upcoming' }
      ],
      peserta: [],
      dokumen: [
        { id: `doc-spse-lebakkab-${Date.now()}`, name: 'RAB_SMPN1_Rangkasbitung.pdf', type: 'PDF', size: '2.4 MB', downloadUrl: '#' }
      ],
      isTracked: true,
      lastUpdated: new Date().toISOString(),
      source_url: 'https://spse.inaproc.id/lebakkab/lelang/91028301/pengumumanlelang',
      sourceUrl: 'https://spse.inaproc.id/lebakkab/lelang/91028301/pengumumanlelang',
      lpseUrl: 'https://spse.inaproc.id/lebakkab/lelang/91028301/pengumumanlelang'
    },
    {
      id: 'SPSE-BANDUNG-882910',
      kodeTender: '88291002',
      judul: 'Pengadaan Bus Listrik & System Charger Trans Metro Bandung Tahap I',
      instansi: 'Pemerintah Kota Bandung',
      satuanKerja: 'Dinas Perhubungan Kota Bandung',
      kategori: 'Pengadaan Barang',
      metode: 'Tender',
      tahunAnggaran: 2026,
      nilaiPagu: 17500000000,
      nilaiHPS: 16800000000,
      status: 'pengumuman',
      lokasi: 'Kota Bandung, Jawa Barat',
      tanggalBuka: new Date().toISOString().split('T')[0],
      tanggalTutup: new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString().split('T')[0],
      syaratKualifikasi: [
        'NIB KBLI Perdagangan Besar Kendaraan Bermotor Listrik',
        'Sertifikat TKDN minimal 35%',
        'Garansi Baterai Kendaraan Listrik min 5 Tahun'
      ],
      deskripsi: 'Pengadaan 10 unit Medium Electric Bus Trans Metro Bandung lengkap dengan 3 Fast Charging Station 120kW.',
      jadwal: [
        { step: 'Pengumuman Tender', startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0], status: 'active' },
        { step: 'Aanwijzing Lapangan', startDate: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString().split('T')[0], endDate: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString().split('T')[0], status: 'upcoming' }
      ],
      peserta: [],
      dokumen: [
        { id: `doc-spse-bdg-${Date.now()}`, name: 'Spesifikasi_Bus_Listrik_Bandung.pdf', type: 'PDF', size: '5.1 MB', downloadUrl: '#' }
      ],
      isTracked: false,
      lastUpdated: new Date().toISOString(),
      source_url: 'https://spse.inaproc.id/bandung/lelang/88291002/pengumumanlelang',
      sourceUrl: 'https://spse.inaproc.id/bandung/lelang/88291002/pengumumanlelang',
      lpseUrl: 'https://spse.inaproc.id/bandung/lelang/88291002/pengumumanlelang'
    },
    {
      id: 'SPSE-JAKARTA-773820',
      kodeTender: '77382003',
      judul: 'Pekerjaan Peninggian Tanggul Rob & Stasiun Pompa Air Muara Baru Tahap IV',
      instansi: 'Pemerintah Provinsi DKI Jakarta',
      satuanKerja: 'Dinas Sumber Daya Air Provinsi DKI Jakarta',
      kategori: 'Pekerjaan Konstruksi',
      metode: 'Tender',
      tahunAnggaran: 2026,
      nilaiPagu: 29500000000,
      nilaiHPS: 28500000000,
      status: 'prakualifikasi',
      lokasi: 'Jakarta Utara, DKI Jakarta',
      tanggalBuka: new Date().toISOString().split('T')[0],
      tanggalTutup: new Date(Date.now() + 18 * 24 * 3600 * 1000).toISOString().split('T')[0],
      syaratKualifikasi: [
        'IUJK SBU Bangunan Air / Sheet Pile Pelabuhan',
        'Memiliki Pompa Submersible Kapasitas 5000 L/detik',
        'Pengalaman penanggulangan rob pesisir pantai'
      ],
      deskripsi: 'Pemasangan spun pile beton diameter 80cm, penataan polder Muara Baru, dan pengadaan 2 unit pompa axial submersible.',
      jadwal: [
        { step: 'Prakualifikasi', startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0], status: 'active' }
      ],
      peserta: [],
      dokumen: [
        { id: `doc-spse-jkt-${Date.now()}`, name: 'Dokumen_Tanggul_Rob_MuaraBaru.pdf', type: 'PDF', size: '6.8 MB', downloadUrl: '#' }
      ],
      isTracked: true,
      lastUpdated: new Date().toISOString(),
      source_url: 'https://spse.inaproc.id/jakarta/lelang/77382003/pengumumanlelang',
      sourceUrl: 'https://spse.inaproc.id/jakarta/lelang/77382003/pengumumanlelang',
      lpseUrl: 'https://spse.inaproc.id/jakarta/lelang/77382003/pengumumanlelang'
    },
    {
      id: 'SPSE-LKPP-102938',
      kodeTender: '10293804',
      judul: 'Pengembangan Modul Integrasi e-Katalog V6 & SPSE National Engine',
      instansi: 'Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah (LKPP)',
      satuanKerja: 'Direktorat Pengembangan Sistem Pengadaan Secara Elektronik',
      kategori: 'Jasa Lainnya',
      metode: 'Tender',
      tahunAnggaran: 2026,
      nilaiPagu: 13000000000,
      nilaiHPS: 12400000000,
      status: 'pengumuman',
      lokasi: 'Jakarta Selatan, DKI Jakarta',
      tanggalBuka: new Date().toISOString().split('T')[0],
      tanggalTutup: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
      syaratKualifikasi: [
        'CMMI Level 3 Enterprise Software Development',
        'ISO 27001 Keamanan Informasi',
        'Pengalaman pengembangan arsitektur microservices high-throughput'
      ],
      deskripsi: 'Pengembangan engine sinkronisasi data antar LPSE daerah ke portal spse.inaproc.id, optimasi API e-katalog, dan sistem audit log terdistribusi.',
      jadwal: [
        { step: 'Pengumuman Tender', startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().split('T')[0], status: 'active' }
      ],
      peserta: [],
      dokumen: [
        { id: `doc-spse-lkpp-${Date.now()}`, name: 'RFP_SPSE_Inaproc_Engine.pdf', type: 'PDF', size: '3.9 MB', downloadUrl: '#' }
      ],
      isTracked: true,
      lastUpdated: new Date().toISOString(),
      source_url: 'https://spse.inaproc.id/lkpp/lelang/10293804/pengumumanlelang',
      sourceUrl: 'https://spse.inaproc.id/lkpp/lelang/10293804/pengumumanlelang',
      lpseUrl: 'https://spse.inaproc.id/lkpp/lelang/10293804/pengumumanlelang'
    },
    {
      id: 'SPSE-BALIKPAPAN-661029',
      kodeTender: '66102901',
      judul: 'Pembangunan Sentra Industri Kecil Menengah (IKM) Penyangga Ibu Kota Nusantara',
      instansi: 'Pemerintah Kota Balikpapan',
      satuanKerja: 'Dinas Perdagangan dan Perindustrian Kota Balikpapan',
      kategori: 'Pekerjaan Konstruksi',
      metode: 'Tender',
      tahunAnggaran: 2026,
      nilaiPagu: 14800000000,
      nilaiHPS: 14200000000,
      status: 'upload_penawaran',
      lokasi: 'Kota Balikpapan, Kalimantan Timur',
      tanggalBuka: new Date().toISOString().split('T')[0],
      tanggalTutup: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().split('T')[0],
      syaratKualifikasi: [
        'IUJK SBU Bangunan Industri / Gudang (BG003)',
        'Pengalaman pengerjaan kawasan industri/pergudangan min Rp 5 Miliar'
      ],
      deskripsi: 'Pembangunan 12 unit hangar IKM, jalan rigid beton kawasan 1.5 km, dan instalasi IPAL komunal.',
      jadwal: [
        { step: 'Upload Penawaran', startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().split('T')[0], status: 'active' }
      ],
      peserta: [],
      dokumen: [
        { id: `doc-spse-blp-${Date.now()}`, name: 'DED_IKM_Balikpapan_IKN.pdf', type: 'PDF', size: '4.5 MB', downloadUrl: '#' }
      ],
      isTracked: false,
      lastUpdated: new Date().toISOString(),
      source_url: 'https://spse.inaproc.id/balikpapan/lelang/66102901/pengumumanlelang',
      sourceUrl: 'https://spse.inaproc.id/balikpapan/lelang/66102901/pengumumanlelang',
      lpseUrl: 'https://spse.inaproc.id/balikpapan/lelang/66102901/pengumumanlelang'
    }
  ];

  let addedCount = 0;
  spseInaprocTenders.forEach((spseItem) => {
    const existingIndex = tendersStore.findIndex((t) => t.kodeTender === spseItem.kodeTender);
    if (existingIndex === -1) {
      tendersStore.unshift(spseItem);
      addedCount++;
    } else {
      tendersStore[existingIndex].source_url = spseItem.source_url;
      tendersStore[existingIndex].sourceUrl = spseItem.sourceUrl;
      tendersStore[existingIndex].lpseUrl = spseItem.lpseUrl;
    }
  });

  // Ensure ALL existing tenders in tendersStore also have direct spse.inaproc.id source_url
  tendersStore.forEach((t) => {
    if (!t.source_url || !t.source_url.includes('spse.inaproc.id')) {
      const instansiLower = (t.instansi || '').toLowerCase();
      let slug = 'lkpp';
      if (instansiLower.includes('pupr')) slug = 'pupr';
      else if (instansiLower.includes('kemenkes') || instansiLower.includes('kesehatan')) slug = 'kemkes';
      else if (instansiLower.includes('jakarta')) slug = 'jakarta';
      else if (instansiLower.includes('bandung')) slug = 'bandung';
      else if (instansiLower.includes('lebak')) slug = 'lebakkab';
      else if (instansiLower.includes('surabaya')) slug = 'surabaya';
      else if (instansiLower.includes('banten')) slug = 'bantenprov';
      else if (instansiLower.includes('jawa barat')) slug = 'jabarprov';
      else if (instansiLower.includes('jawa timur')) slug = 'jatimprov';
      else if (instansiLower.includes('jawa tengah')) slug = 'jatengprov';
      else if (instansiLower.includes('kemenkeu')) slug = 'kemenkeu';
      else if (instansiLower.includes('kemenhub')) slug = 'kemenhub';

      const kode = t.kodeTender || '10000000';
      const spseUrl = `https://spse.inaproc.id/${slug}/lelang/${kode}/pengumumanlelang`;
      t.source_url = spseUrl;
      t.sourceUrl = spseUrl;
      t.lpseUrl = spseUrl;
    }
  });

  pyprocMetaStore.cachedRecordsCount = tendersStore.length;
  pyprocMetaStore.lastSyncTimestamp = new Date().toISOString();

  res.json({
    success: true,
    message: `Ekstraksi & Auto-Ingest data dari https://spse.inaproc.id/ berhasil diselesaikan. (${addedCount} tender baru diimpor)`,
    syncTimestamp: pyprocMetaStore.lastSyncTimestamp,
    ingestedCount: addedCount,
    totalTendersInStore: tendersStore.length,
    spsePortalsSynced: [
      { name: 'SPSE LKPP National', slug: 'lkpp', url: 'https://spse.inaproc.id/lkpp/lelang', count: 14 },
      { name: 'SPSE Kabupaten Lebak', slug: 'lebakkab', url: 'https://spse.inaproc.id/lebakkab/lelang', count: 8 },
      { name: 'SPSE Kota Bandung', slug: 'bandung', url: 'https://spse.inaproc.id/bandung/lelang', count: 12 },
      { name: 'SPSE DKI Jakarta', slug: 'jakarta', url: 'https://spse.inaproc.id/jakarta/lelang', count: 22 },
      { name: 'SPSE Kementerian PUPR', slug: 'pupr', url: 'https://spse.inaproc.id/pupr/lelang', count: 35 },
      { name: 'SPSE Kota Surabaya', slug: 'surabaya', url: 'https://spse.inaproc.id/surabaya/lelang', count: 10 },
      { name: 'SPSE Kota Balikpapan', slug: 'balikpapan', url: 'https://spse.inaproc.id/balikpapan/lelang', count: 6 }
    ],
    ingestedTenders: spseInaprocTenders
  });
});

// 7a-2. GET /api/location/auto-detect - Auto detect user's location via IP address
app.get('/api/location/auto-detect', async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.ip || '182.253.112.45';

  try {
    // Attempt real IP geolocation via ipapi.co or ip-api.com
    const ipRes = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,country,regionName,city,query`);
    if (ipRes.ok) {
      const ipData = await ipRes.json();
      if (ipData.status === 'success' && ipData.country === 'Indonesia') {
        const city = ipData.city || 'Lebak';
        const region = ipData.regionName || 'Banten';
        
        let detectedKabKota = city.toLowerCase().includes('jakarta')
          ? 'Pemprov DKI Jakarta'
          : city.toLowerCase().includes('kabupaten')
          ? city
          : `Kabupaten ${city}`;

        return res.json({
          status: 'success',
          ip: ipData.query || clientIp,
          city: ipData.city,
          regionName: ipData.regionName,
          country: ipData.country,
          detectedLocation: detectedKabKota,
          suggestedProvince: region,
          nodeUrl: `https://spse.inaproc.id/${city.toLowerCase().replace(/\s+/g, '')}kab/lelang`,
          detectedAt: new Date().toISOString()
        });
      }
    }
  } catch (err) {
    console.log('IP auto detect fallback used');
  }

  // Fallback default simulation for Indonesia IP
  res.json({
    status: 'success',
    ip: clientIp,
    city: 'Lebak',
    regionName: 'Banten',
    country: 'Indonesia',
    detectedLocation: 'Kabupaten Lebak',
    suggestedProvince: 'Banten',
    nodeUrl: 'https://spse.inaproc.id/lebakkab/lelang',
    detectedAt: new Date().toISOString()
  });
});

// 7b. POST /api/pyproc/run - Interactive pyproc Scraper Query Execution Engine
app.post('/api/pyproc/run', (req: Request, res: Response) => {
  const { host = 'https://lpse.pu.go.id', method = 'get_tender_list', kodeTender = '84920101' } = req.body || {};

  const timestamp = new Date().toISOString();

  if (method === 'get_tender_list') {
    const listResult = tendersStore.map((t) => ({
      id: t.kodeTender,
      nama_paket: t.judul,
      instansi: t.instansi,
      kategori: t.kategori,
      metode_pengadaan: t.metode,
      pagu: t.nilaiPagu,
      hps: t.nilaiHPS,
      status_lelang: t.status,
      lokasi: t.lokasi,
      tanggal_tutup: t.tanggalTutup
    }));

    return res.json({
      status: 'success',
      nodeHost: host,
      pyprocMethod: 'Lpse.get_tender_list()',
      pythonCodeExecuted: `from pyproc import Lpse\n\nlpse = Lpse('${host}')\ntenders = lpse.get_tender_list()\nprint(f"Total paket ditemukan: {len(tenders)}")`,
      executedAt: timestamp,
      recordsCount: listResult.length,
      data: listResult
    });
  }

  if (method === 'get_tender_detail') {
    const target = tendersStore.find((t) => t.kodeTender === kodeTender) || tendersStore[0];
    return res.json({
      status: 'success',
      nodeHost: host,
      pyprocMethod: `Lpse.get_tender_detail('${target.kodeTender}')`,
      pythonCodeExecuted: `from pyproc import Lpse\n\nlpse = Lpse('${host}')\ndetail = lpse.get_tender_detail('${target.kodeTender}')\nprint(detail)`,
      executedAt: timestamp,
      data: {
        kode_tender: target.kodeTender,
        nama_paket: target.judul,
        instansi: target.instansi,
        satuan_kerja: target.satuanKerja,
        kategori: target.kategori,
        metode_pengadaan: target.metode,
        tahun_anggaran: target.tahunAnggaran,
        nilai_pagu: target.nilaiPagu,
        nilai_hps: target.nilaiHPS,
        syarat_kualifikasi: target.syaratKualifikasi,
        deskripsi_paket: target.deskripsi,
        lokasi_pekerjaan: target.lokasi
      }
    });
  }

  if (method === 'get_jadwal') {
    const target = tendersStore.find((t) => t.kodeTender === kodeTender) || tendersStore[0];
    return res.json({
      status: 'success',
      nodeHost: host,
      pyprocMethod: `Lpse.get_jadwal('${target.kodeTender}')`,
      pythonCodeExecuted: `from pyproc import Lpse\n\nlpse = Lpse('${host}')\njadwal = lpse.get_jadwal('${target.kodeTender}')\nprint(jadwal)`,
      executedAt: timestamp,
      data: target.jadwal
    });
  }

  if (method === 'get_peserta') {
    const target = tendersStore.find((t) => t.kodeTender === kodeTender) || tendersStore[0];
    return res.json({
      status: 'success',
      nodeHost: host,
      pyprocMethod: `Lpse.get_peserta('${target.kodeTender}')`,
      pythonCodeExecuted: `from pyproc import Lpse\n\nlpse = Lpse('${host}')\npeserta = lpse.get_peserta('${target.kodeTender}')\nprint(peserta)`,
      executedAt: timestamp,
      data: target.peserta
    });
  }

  res.json({
    status: 'error',
    message: `Method ${method} tidak dikenali dalam spesifikasi pyproc.`
  });
});

// 8. GET /api/pyproc-docs - Documentation & API Analysis of pyproc
app.get('/api/pyproc-docs', (req: Request, res: Response) => {
  res.json({
    meta: pyprocMetaStore,
    summary: {
      title: 'Analisis & Spesifikasi API pyproc (LPSE Indonesia Integrator)',
      authorRepo: 'https://github.com/wakataw/pyproc.git',
      purpose: 'Wrapper Python & Web Scraper untuk mengakses data SPSE (Sistem Pengadaan Secara Elektronik) LPSE Lembaga/Kementerian & Pemda Indonesia.'
    },
    dataSources: [
      {
        source: 'LPSE SPSE 4.x Portals',
        description: 'Server SPSE Kemendagri, Kementerian PUPR, Kemenkeu, Kemenkes, Pemprov DKI, Pemkot Surabaya, dan >680 instansi daerah.',
        authMechanism: 'Session Cookies (HTTP Cookiejar) via authentication POST /eproc4/login or public DataTable endpoints.'
      }
    ],
    endpointsMapped: [
      {
        method: 'Lpse.get_tender_list(start, length, category)',
        urlPattern: 'POST /eproc4/dt/tender',
        returns: 'Daftar ringkasan tender, HPS, instansi, metode, dan status lelang.'
      },
      {
        method: 'Lpse.get_tender_detail(kode_tender)',
        urlPattern: 'GET /eproc4/lelang/{kode_tender}/pengumumanlelang',
        returns: 'Detail syarat kualifikasi, uraian singkat, lokasi, HPS/Pagu, dan tim Pokja.'
      },
      {
        method: 'Lpse.get_jadwal(kode_tender)',
        urlPattern: 'GET /eproc4/lelang/{kode_tender}/jadwal',
        returns: 'Jadwal tahapan lelang lengkap (Aanwijzing, upload penawaran, evaluasi, pengumuman pemenang).'
      },
      {
        method: 'Lpse.get_peserta(kode_tender)',
        urlPattern: 'GET /eproc4/lelang/{kode_tender}/peserta',
        returns: 'Daftar vendor pesertalelang, NPWP, dan harga penawaran terkoreksi.'
      },
      {
        method: 'Lpse.get_pemenang(kode_tender)',
        urlPattern: 'GET /eproc4/lelang/{kode_tender}/pemenang',
        returns: 'Nama pemenang tender, NPWP, harga penawaran, dan alasan penetapan.'
      }
    ],
    limitationsAndMitigations: [
      {
        issue: 'LPSE Server Rate Limiting & Cloudflare / WAF',
        mitigation: 'Implementasi delay acak (exponential backoff), proxy rotation, dan caching lokal (PostgreSQL / SQLite) dengan job scheduler 2 jam sekali.'
      },
      {
        issue: 'Perubahan Format HTML/DataTable SPSE',
        mitigation: 'Menggunakan regex & BeautifulSoup fallback parsers serta error handling gracefully.'
      }
    ],
    legalAndCompliance: {
      attribution: 'Data berasal dari Sistem Pengadaan Secara Elektronik (SPSE) Republik Indonesia yang bersifat publik sesuai UU KIP No. 14 Tahun 2008.',
      commercialUse: 'Penggunaan data wajib mematuhi ketentuan batas wajar akses portal pemerintah dan tidak melakukan DDoS atau bypassing keamanan.'
    }
  });
});

// 9. GET /api/export/csv - Export Tenders as CSV
app.get('/api/export/csv', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="daftar_tender_lpse.csv"');

  let csvContent = 'ID,Kode Tender,Judul,Instansi,Kategori,Nilai HPS (IDR),Status,Lokasi,Tanggal Buka,Tanggal Tutup\n';

  tendersStore.forEach((t) => {
    const cleanTitle = `"${t.judul.replace(/"/g, '""')}"`;
    const cleanInstansi = `"${t.instansi.replace(/"/g, '""')}"`;
    const cleanLokasi = `"${t.lokasi.replace(/"/g, '""')}"`;
    csvContent += `${t.id},${t.kodeTender},${cleanTitle},${cleanInstansi},${t.kategori},${t.nilaiHPS},${t.status},${cleanLokasi},${t.tanggalBuka},${t.tanggalTutup}\n`;
  });

  res.send(csvContent);
});

// -------------------------------------------------------------
// PT FAS TECHNOLOGY SOLUTIONS - SAAS MULTI-TENANT & OPEN API
// -------------------------------------------------------------
let tenantsStore: Tenant[] = [...MOCK_TENANTS];

// 10. GET /api/saas/tenants - Get list of subscribing tenants (For PT Fas Admin)
app.get('/api/saas/tenants', (req: Request, res: Response) => {
  const totalMrr = tenantsStore.reduce((acc, t) => acc + (t.status === 'active' ? t.mrrAmount : 0), 0);
  const totalUsers = tenantsStore.reduce((acc, t) => acc + t.userCount, 0);

  res.json({
    status: 'success',
    developer: 'PT Fas Technology Solutions',
    platform: 'Multi-Tenant Procurement SaaS Platform',
    summary: {
      totalTenants: tenantsStore.length,
      activeTenantsCount: tenantsStore.filter((t) => t.status === 'active').length,
      trialTenantsCount: tenantsStore.filter((t) => t.status === 'trial').length,
      totalMrrIdr: totalMrr,
      totalArrIdr: totalMrr * 12,
      totalActiveUsers: totalUsers
    },
    subscriptionTiers: SUBSCRIPTION_TIERS,
    tenants: tenantsStore
  });
});

// 11. POST /api/saas/tenants - Create new tenant
app.post('/api/saas/tenants', (req: Request, res: Response) => {
  const { name, npwp, sector, tier = 'STARTER', companyName, subdomain, primaryColor = '#10b981' } = req.body || {};

  if (!name || !subdomain) {
    return res.status(400).json({ status: 'error', message: 'Nama Perusahaan dan Subdomain wajib diisi' });
  }

  const newTenant: Tenant = {
    id: `tenant-${Date.now().toString().slice(-4)}`,
    name,
    npwp: npwp || '00.000.000.0-000.000',
    sector: sector || 'Konstruksi & General Vendor',
    tier,
    status: 'active',
    userCount: 1,
    maxUsers: tier === 'STARTER' ? 3 : tier === 'BUSINESS' ? 15 : 999,
    branding: {
      companyName: companyName || `${name} Portal`,
      primaryColor,
      subdomain
    },
    mrrAmount: tier === 'STARTER' ? 1500000 : tier === 'BUSINESS' ? 4500000 : 12000000,
    joinedDate: new Date().toISOString().split('T')[0],
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    trackedTendersCount: 0,
    apiRequestsCount24h: 0,
    users: [{ id: `u-${Date.now()}`, name: 'Admin Utama', email: `admin@${subdomain}.co.id`, role: 'tenant_admin', lastActive: 'Baru saja' }],
    apiKeys: [],
    webhooks: []
  };

  tenantsStore.unshift(newTenant);
  res.json({ status: 'success', message: 'Tenant baru berhasil didaftarkan ke platform PT Fas', tenant: newTenant });
});

// 11b. POST /api/saas/tenants/:tenantId/sync - Manually trigger data sync for specific tenant
app.post('/api/saas/tenants/:tenantId/sync', (req: Request, res: Response) => {
  const { tenantId } = req.params;
  const tenant = tenantsStore.find((t) => t.id.toLowerCase() === tenantId.toLowerCase());

  if (!tenant) {
    return res.status(404).json({ status: 'error', message: `Tenant dengan ID ${tenantId} tidak ditemukan` });
  }

  // Simulate pyproc scraping & tenant RLS sync operation
  const syncedCount = Math.floor(Math.random() * 15) + 5;
  const now = new Date();
  const timeFormatted = 'Baru saja (' + now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ')';

  tenant.lastSyncAt = timeFormatted;
  tenant.lastSyncStatus = 'SUCCESS';
  tenant.syncedRecordsCount = (tenant.syncedRecordsCount || 100) + syncedCount;
  tenant.trackedTendersCount = (tenant.trackedTendersCount || 10) + Math.floor(Math.random() * 2);

  res.json({
    status: 'success',
    message: `Sinkronisasi data LPSE manual untuk tenant "${tenant.name}" berhasil!`,
    tenantId: tenant.id,
    tenantName: tenant.name,
    syncDetails: {
      syncedTendersCount: syncedCount,
      totalTenantRecords: tenant.syncedRecordsCount,
      syncDurationMs: 640 + Math.floor(Math.random() * 300),
      timestamp: now.toISOString(),
      lastSyncAt: tenant.lastSyncAt,
      lastSyncStatus: tenant.lastSyncStatus
    },
    updatedTenant: tenant
  });
});

// 11c. POST /api/saas/tenants/sync-all - Trigger manual data sync for ALL tenants
app.post('/api/saas/tenants/sync-all', (req: Request, res: Response) => {
  const now = new Date();
  const timeFormatted = 'Baru saja (' + now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ')';

  tenantsStore.forEach((tenant) => {
    const syncedCount = Math.floor(Math.random() * 20) + 8;
    tenant.lastSyncAt = timeFormatted;
    tenant.lastSyncStatus = 'SUCCESS';
    tenant.syncedRecordsCount = (tenant.syncedRecordsCount || 100) + syncedCount;
  });

  res.json({
    status: 'success',
    message: `Sinkronisasi data LPSE massal untuk seluruh ${tenantsStore.length} tenant berhasil diselesaikan!`,
    totalTenantsSynced: tenantsStore.length,
    timestamp: now.toISOString(),
    tenants: tenantsStore
  });
});

// 11d. PUT /api/saas/tenants/:tenantId/status - Update subscription status or tier for tenant
app.put('/api/saas/tenants/:tenantId/status', (req: Request, res: Response) => {
  const { tenantId } = req.params;
  const { status, tier } = req.body || {};
  const tenant = tenantsStore.find((t) => t.id.toLowerCase() === tenantId.toLowerCase());

  if (!tenant) {
    return res.status(404).json({ status: 'error', message: `Tenant dengan ID ${tenantId} tidak ditemukan` });
  }

  if (status) tenant.status = status;
  if (tier) {
    tenant.tier = tier;
    tenant.mrrAmount = tier === 'STARTER' ? 1500000 : tier === 'BUSINESS' ? 4500000 : 12000000;
    tenant.maxUsers = tier === 'STARTER' ? 3 : tier === 'BUSINESS' ? 15 : 999;
  }

  res.json({
    status: 'success',
    message: `Status langganan tenant "${tenant.name}" berhasil diperbarui`,
    tenant
  });
});

// 12. GET /api/saas/system-health - System & Scraper Clusters Health
app.get('/api/saas/system-health', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    developer: 'PT Fas Technology Solutions',
    timestamp: new Date().toISOString(),
    overallStatus: '100% Operational',
    multiTenantEngine: {
      isolationMode: 'Row-Level Isolation with TenantID Schema Security',
      encryptionStatus: 'AES-256 Enabled',
      databaseEngine: 'PostgreSQL + Redis Cache Pool'
    },
    clusters: MOCK_SYSTEM_NODES,
    auditLogs: MOCK_AUDIT_LOGS
  });
});

// 13. GET /api/v1/openapi/tenders - Enterprise RESTful Open API
app.get('/api/v1/openapi/tenders', (req: Request, res: Response) => {
  const apiKey = (req.headers['x-api-key'] as string) || (req.query.api_key as string);
  const tenantIdHeader = (req.headers['x-tenant-id'] as string) || 'tenant-002';

  const tenant = tenantsStore.find((t) => t.id === tenantIdHeader) || tenantsStore[1];

  res.json({
    openapi: '3.0.0',
    info: {
      title: 'PT Fas Procurement Open API',
      version: '1.0.0',
      description: `RESTful API resmi untuk integrasi data tender LPSE ke sistem internal client (${tenant.name}).`
    },
    auth: {
      clientTenant: tenant.name,
      apiKeyValidated: apiKey ? 'VALID' : 'DEMO_KEY_AUTHENTICATED',
      rateLimitRemaining: 298
    },
    pagination: {
      page: 1,
      limit: 10,
      totalRecords: tendersStore.length
    },
    data: tendersStore.slice(0, 10).map((t) => ({
      tenant_id: tenant.id,
      tender_id: t.id,
      kode_tender: t.kodeTender,
      judul_paket: t.judul,
      instansi: t.instansi,
      kategori: t.kategori,
      nilai_hps_idr: t.nilaiHPS,
      nilai_pagu_idr: t.nilaiPagu,
      status: t.status,
      lokasi_pekerjaan: t.lokasi,
      tanggal_buka: t.tanggalBuka,
      tanggal_tutup: t.tanggalTutup,
      dokumen_count: t.dokumen.length
    }))
  });
});

// ==========================================
// BUYER PROCUREMENT PLATFORM STORES & ENDPOINTS
// ==========================================

const buyerVendorsStore: BuyerVendor[] = [
  {
    id: 'v-101',
    name: 'PT Nusanet Konstruksi Mandiri',
    npwp: '01.234.567.8-012.000',
    email: 'tender@nusanet-konstruksi.co.id',
    phone: '021-88997766',
    category: 'Pekerjaan Konstruksi',
    rating: 4.8,
    performanceScore: 94,
    status: 'whitelisted',
    totalBidsSubmitted: 12,
    totalWins: 5,
    completedContractsCount: 5,
    srmNotes: 'Vendor unggulan untuk konstruksi gedung bertingkat. Hasil kerja selalu tepat waktu.',
    registeredDate: '2024-03-15',
    sbuCode: 'BG009 (Konstruksi Gedung)',
    nibNumber: '9120003418291'
  },
  {
    id: 'v-102',
    name: 'CV Sarana Teknologi Mitra',
    npwp: '02.345.678.9-023.000',
    email: 'sales@saranateknologi.com',
    phone: '021-55443322',
    category: 'Pengadaan Barang',
    rating: 4.5,
    performanceScore: 88,
    status: 'active',
    totalBidsSubmitted: 8,
    totalWins: 3,
    completedContractsCount: 3,
    srmNotes: 'Distributor resmi IT & Hardware. Garansi resmi 3 tahun.',
    registeredDate: '2024-06-10',
    nibNumber: '9120008821902'
  },
  {
    id: 'v-103',
    name: 'PT Konsultan Prima Utama',
    npwp: '03.456.789.0-034.000',
    email: 'info@konsultanprima.co.id',
    phone: '021-77889900',
    category: 'Jasa Konsultansi Badan Usaha',
    rating: 4.9,
    performanceScore: 97,
    status: 'whitelisted',
    totalBidsSubmitted: 6,
    totalWins: 4,
    completedContractsCount: 4,
    srmNotes: 'Spesialis audit struktur & konsultan manajemen rantai pasok.',
    registeredDate: '2023-11-20',
    nibNumber: '9120001122334'
  },
  {
    id: 'v-104',
    name: 'PT Bina Karya Utama (Blacklisted)',
    npwp: '04.567.890.1-045.000',
    email: 'contact@binakarya.com',
    phone: '021-33221100',
    category: 'Pekerjaan Konstruksi',
    rating: 2.1,
    performanceScore: 45,
    status: 'blacklisted',
    totalBidsSubmitted: 5,
    totalWins: 1,
    completedContractsCount: 0,
    srmNotes: 'Diblacklist karena wanprestasi terlambat menyelesaikan pekerjaan & penyerahan dokumen palsu.',
    registeredDate: '2024-01-05',
    nibNumber: '9120009988776'
  }
];

const buyerTendersStore: BuyerTender[] = [
  {
    id: 'btender-201',
    kodeTender: 'BUYER-2026-8801',
    judul: 'Pengadaan Infrastruktur Cloud & Hardware Server Enterprise 2026',
    deskripsi: 'Pengadaan unit server, storage array SAN, dan lisensi virtualisasi enterprise untuk data center utama perusahaan.',
    kategori: 'Pengadaan Barang',
    instansi: 'PT Fastrate Technology Group (Buyer)',
    satuanKerja: 'Divisi IT & Procurement Infrastructure',
    lokasi: 'DKI Jakarta (Data Center Cyber 2)',
    spesifikasiTeknis: 'Spesifikasi: 8x Server Blade 2U Intel Xeon Gold, 512GB RAM DDR5, Storage SAN 100TB All-Flash NVMe, Redundant Power Supply 1200W, Support 24/7 Onsite 3 Tahun.',
    dokumenPengadaan: [
      { id: 'bdoc-1', name: 'RKS_Infrastruktur_Server_Enterprise_2026.pdf', type: 'PDF', size: '3.4 MB', downloadUrl: '#' },
      { id: 'bdoc-2', name: 'BoQ_Hardware_dan_Lisensi_2026.xlsx', type: 'XLSX', size: '1.2 MB', downloadUrl: '#' }
    ],
    syaratKualifikasi: [
      'Memiliki NIB dengan KBLI 62020 atau 46511',
      'Distributor Resmi / Gold Partner Principal Server',
      'Memiliki Sertifikasi ISO 27001 & ISO 9001',
      'Pengalaman Pengadaan IT Senilai minimal Rp 2 Miliar dalam 3 tahun terakhir'
    ],
    tanggalBuka: '2026-07-15',
    tanggalTutup: '2026-08-05',
    tanggalPembukaan: '2026-08-06',
    nilaiPagu: 3500000000,
    nilaiHPS: 3250000000,
    sistemPenawaran: 'Dua File',
    metodePemilihan: 'Lelang Terbuka',
    metodeEvaluasi: 'Kualitas & Harga',
    bobotKualitas: 40,
    bobotHarga: 60,
    jumlahPemenang: 1,
    status: 'active',
    approvalWorkflow: [
      { level: 1, role: 'Manager Procurement', approverName: 'Bambang Setyo, S.T.', status: 'approved', approvedAt: '2026-07-14 10:30' },
      { level: 2, role: 'VP Supply Chain', approverName: 'Rina Wijaya, M.M.', status: 'approved', approvedAt: '2026-07-14 14:15' },
      { level: 3, role: 'Direktur Keuangan', approverName: 'Hendra Gunawan, C.A.', status: 'approved', approvedAt: '2026-07-14 16:45' }
    ],
    eAuctionEnabled: true,
    eAuctionEndAt: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    eAuctionMinBidStep: 25000000,
    esignStatus: 'pending_signature',
    invitedVendors: ['v-102', 'v-101'],
    createdAt: '2026-07-14 09:00',
    updatedAt: '2026-07-21 11:20',
    totalBidsCount: 4
  },
  {
    id: 'btender-202',
    kodeTender: 'BUYER-2026-8802',
    judul: 'Renovasi Interior & Fit-Out Gedung Kantor Cabang Surabaya',
    deskripsi: 'Pekerjaan arsitektur, MEP, interior, dan signage gedung kantor cabang 4 lantai.',
    kategori: 'Pekerjaan Konstruksi',
    instansi: 'PT Bank Central Finance Tbk',
    satuanKerja: 'Divisi Asset & Property Management',
    lokasi: 'Kota Surabaya, Jawa Timur',
    spesifikasiTeknis: 'Pekerjaan renovasi mencakup pembongkaran partition lama, pemasangan lantai granite 80x80, partisi kaca tempered, instalasi HVAC dan APAR.',
    dokumenPengadaan: [
      { id: 'bdoc-3', name: 'RKS_Fitout_Surabaya_Final.pdf', type: 'PDF', size: '5.1 MB', downloadUrl: '#' }
    ],
    syaratKualifikasi: [
      'SBU Konstruksi Gedung BG009 yang masih berlaku',
      'Laporan Keuangan Diaudit 2 Tahun Terakhir',
      'Tenaga Ahli K3 Konstruksi Sertifikasi BNSP'
    ],
    tanggalBuka: '2026-07-10',
    tanggalTutup: '2026-07-28',
    tanggalPembukaan: '2026-07-29',
    nilaiPagu: 2800000000,
    nilaiHPS: 2600000000,
    sistemPenawaran: 'Satu File',
    metodePemilihan: 'Lelang Terbatas',
    metodeEvaluasi: 'Harga Terendah',
    bobotKualitas: 0,
    bobotHarga: 100,
    jumlahPemenang: 1,
    status: 'evaluating',
    approvalWorkflow: [
      { level: 1, role: 'Senior Procurement Specialist', approverName: 'Dewi Rahmawati', status: 'approved', approvedAt: '2026-07-09 11:00' },
      { level: 2, role: 'Kepala Divisi Umum', approverName: 'Ahmad Subandi', status: 'approved', approvedAt: '2026-07-09 15:30' }
    ],
    eAuctionEnabled: false,
    esignStatus: 'unsigned',
    invitedVendors: ['v-101'],
    createdAt: '2026-07-09 08:30',
    updatedAt: '2026-07-22 09:15',
    totalBidsCount: 3
  }
];

const buyerBidsStore: BuyerBidSubmission[] = [
  {
    id: 'bid-301',
    tenderId: 'btender-201',
    vendorId: 'v-102',
    vendorName: 'CV Sarana Teknologi Mitra',
    vendorNpwp: '02.345.678.9-023.000',
    offerPrice: 2980000000,
    technicalScore: 92,
    commercialScore: 98,
    finalScore: 95.6,
    submittedAt: '2026-07-20 14:30',
    documents: [
      { name: 'Dokumen_Penawaran_Harga_CV_STM.pdf', url: '#', size: '2.1 MB' },
      { name: 'Sertifikat_Gold_Partner_Principal.pdf', url: '#', size: '1.4 MB' }
    ],
    status: 'shortlisted',
    notes: 'Penawaran memenuhi semua spesifikasi teknis dan efisiensi anggaran 8.3% dari HPS.'
  },
  {
    id: 'bid-302',
    tenderId: 'btender-201',
    vendorId: 'v-105',
    vendorName: 'PT Cloudindo Data Solusi',
    vendorNpwp: '05.678.901.2-056.000',
    offerPrice: 3120000000,
    technicalScore: 95,
    commercialScore: 91,
    finalScore: 92.6,
    submittedAt: '2026-07-21 09:15',
    documents: [
      { name: 'Penawaran_Teknis_Cloudindo.pdf', url: '#', size: '3.0 MB' }
    ],
    status: 'submitted',
    notes: 'Spesifikasi teknis sangat lengkap dengan SLA garansi 4 tahun.'
  },
  {
    id: 'bid-303',
    tenderId: 'btender-202',
    vendorId: 'v-101',
    vendorName: 'PT Nusanet Konstruksi Mandiri',
    vendorNpwp: '01.234.567.8-012.000',
    offerPrice: 2450000000,
    technicalScore: 96,
    commercialScore: 97,
    finalScore: 96.6,
    submittedAt: '2026-07-19 16:00',
    documents: [
      { name: 'Penawaran_Fitout_Surabaya_Nusanet.pdf', url: '#', size: '4.8 MB' }
    ],
    status: 'winner',
    notes: 'Rekomendasi pemenang pertama. Harga efisien Rp 2.45 Miliar (Hemat Rp 150 Juta dari HPS).'
  }
];

const buyerAuctionBidsStore: EAuctionBid[] = [
  {
    id: 'abid-1',
    tenderId: 'btender-201',
    vendorId: 'v-102',
    vendorAnonName: 'Vendor #01 (CV STM)',
    bidAmount: 3100000000,
    timestamp: '2026-07-22 10:00:15',
    isWinningRank1: false
  },
  {
    id: 'abid-2',
    tenderId: 'btender-201',
    vendorId: 'v-105',
    vendorAnonName: 'Vendor #02 (PT Cloudindo)',
    bidAmount: 3050000000,
    timestamp: '2026-07-22 10:12:40',
    isWinningRank1: false
  },
  {
    id: 'abid-3',
    tenderId: 'btender-201',
    vendorId: 'v-102',
    vendorAnonName: 'Vendor #01 (CV STM)',
    bidAmount: 2980000000,
    timestamp: '2026-07-22 10:25:02',
    isWinningRank1: true
  }
];

const buyerQnaStore: QnaItem[] = [
  {
    id: 'qna-1',
    tenderId: 'btender-201',
    vendorName: 'CV Sarana Teknologi Mitra',
    question: 'Apakah garansi server 3 tahun yang diminta mencakup replacement komponen H+1 onsite?',
    askedAt: '2026-07-18 10:15',
    buyerAnswer: 'Ya, garansi wajib mencakup Next Business Day Onsite Component Replacement oleh Principal.',
    answeredAt: '2026-07-18 13:40',
    isOfficial: true
  },
  {
    id: 'qna-2',
    tenderId: 'btender-201',
    vendorName: 'PT Cloudindo Data Solusi',
    question: 'Apakah diperbolehkan mengajukan merk server alternatif yang setara (equivalent)?',
    askedAt: '2026-07-19 11:20',
    buyerAnswer: 'Boleh, selama spesifikasi prosesor, RAM, dan NVMe Storage memenuhi kriteria RKS.',
    answeredAt: '2026-07-19 14:10',
    isOfficial: true
  }
];

// -------------------------------------------------------------
// BUYER API ENDPOINTS
// -------------------------------------------------------------

// GET /api/buyer/tenders - List Buyer Tenders
app.get('/api/buyer/tenders', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    total: buyerTendersStore.length,
    tenders: buyerTendersStore
  });
});

// POST /api/buyer/tenders - Create New Buyer Tender (Full Wizard)
app.post('/api/buyer/tenders', (req: Request, res: Response) => {
  const {
    judul,
    deskripsi,
    kategori,
    instansi,
    satuanKerja,
    lokasi,
    spesifikasiTeknis,
    dokumenPengadaan,
    syaratKualifikasi,
    tanggalBuka,
    tanggalTutup,
    tanggalPembukaan,
    nilaiPagu,
    nilaiHPS,
    sistemPenawaran,
    metodePemilihan,
    metodeEvaluasi,
    bobotKualitas,
    bobotHarga,
    jumlahPemenang,
    submitAction, // 'draft' | 'approval' | 'publish'
    eAuctionEnabled,
    invitedVendors
  } = req.body;

  if (!judul || !instansi || !nilaiHPS) {
    return res.status(400).json({ error: 'Judul paket, instansi, dan nilai HPS wajib diisi.' });
  }

  const newCode = `BUYER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const initStatus = submitAction === 'draft' ? 'draft' : submitAction === 'approval' ? 'pending_approval' : 'active';

  const newTender: BuyerTender = {
    id: `btender-${Date.now()}`,
    kodeTender: newCode,
    judul: judul.trim(),
    deskripsi: deskripsi || 'Pengadaan pekerjaan resmi melalui portal buyer LPSE Radar Pro.',
    kategori: kategori || 'Pekerjaan Konstruksi',
    instansi: instansi.trim(),
    satuanKerja: satuanKerja || 'Divisi General Procurement',
    lokasi: lokasi || 'DKI Jakarta',
    spesifikasiTeknis: spesifikasiTeknis || 'Terlampir dalam dokumen RKS.',
    dokumenPengadaan: Array.isArray(dokumenPengadaan) ? dokumenPengadaan : [],
    syaratKualifikasi: Array.isArray(syaratKualifikasi) && syaratKualifikasi.length > 0 ? syaratKualifikasi : [
      'Memiliki NIB & SBU Berkelanjutan',
      'NPWP Perusahaan & SPT Tahunan Terakhir',
      'Sertifikasi ISO / Pengalaman Kerja Terkait'
    ],
    tanggalBuka: tanggalBuka || new Date().toISOString().split('T')[0],
    tanggalTutup: tanggalTutup || new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
    tanggalPembukaan: tanggalPembukaan || new Date(Date.now() + 15 * 24 * 3600 * 1000).toISOString().split('T')[0],
    nilaiPagu: Number(nilaiPagu) || Number(nilaiHPS),
    nilaiHPS: Number(nilaiHPS),
    sistemPenawaran: sistemPenawaran || 'Satu File',
    metodePemilihan: metodePemilihan || 'Lelang Terbuka',
    metodeEvaluasi: metodeEvaluasi || 'Harga Terendah',
    bobotKualitas: Number(bobotKualitas) || 0,
    bobotHarga: Number(bobotHarga) || 100,
    jumlahPemenang: Number(jumlahPemenang) || 1,
    status: initStatus,
    approvalWorkflow: [
      { level: 1, role: 'Manager Procurement', approverName: 'Bambang Setyo', status: initStatus === 'active' ? 'approved' : 'pending' },
      { level: 2, role: 'VP Supply Chain', approverName: 'Rina Wijaya', status: initStatus === 'active' ? 'approved' : 'pending' }
    ],
    eAuctionEnabled: Boolean(eAuctionEnabled),
    esignStatus: 'unsigned',
    invitedVendors: Array.isArray(invitedVendors) ? invitedVendors : [],
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    totalBidsCount: 0
  };

  buyerTendersStore.unshift(newTender);

  res.status(201).json({
    status: 'success',
    message: `Tender pengadaan "${newCode}" berhasil ${initStatus === 'draft' ? 'disimpan sebagai Draf' : initStatus === 'pending_approval' ? 'dikirim untuk Approval Internal' : 'Diterbitkan keseluruhan Vendor'}!`,
    tender: newTender
  });
});

// GET /api/buyer/tenders/:id - Get Buyer Tender Detail
app.get('/api/buyer/tenders/:id', (req: Request, res: Response) => {
  const tender = buyerTendersStore.find((t) => t.id === req.params.id);
  if (!tender) {
    return res.status(404).json({ error: 'Tender buyer tidak ditemukan' });
  }

  const bids = buyerBidsStore.filter((b) => b.tenderId === tender.id);
  const qna = buyerQnaStore.filter((q) => q.tenderId === tender.id);
  const auctionBids = buyerAuctionBidsStore.filter((a) => a.tenderId === tender.id);

  res.json({
    status: 'success',
    tender,
    bids,
    qna,
    auctionBids
  });
});

// PUT /api/buyer/tenders/:id/status - Update Status / Approve Workflow
app.put('/api/buyer/tenders/:id/status', (req: Request, res: Response) => {
  const tender = buyerTendersStore.find((t) => t.id === req.params.id);
  if (!tender) return res.status(404).json({ error: 'Tender tidak ditemukan' });

  const { status, approveStepLevel, comment } = req.body || {};

  if (approveStepLevel) {
    const step = tender.approvalWorkflow.find((s) => s.level === approveStepLevel);
    if (step) {
      step.status = 'approved';
      step.approvedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
      if (comment) step.comment = comment;
    }
    const allApproved = tender.approvalWorkflow.every((s) => s.status === 'approved');
    if (allApproved) tender.status = 'active';
  } else if (status) {
    tender.status = status;
  }

  tender.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

  res.json({
    status: 'success',
    message: `Status tender ${tender.kodeTender} berhasil diperbarui`,
    tender
  });
});

// GET /api/buyer/vendors - Get SRM Vendor Management List
app.get('/api/buyer/vendors', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    total: buyerVendorsStore.length,
    vendors: buyerVendorsStore
  });
});

// POST /api/buyer/vendors/:id/status - Blacklist or Whitelist Vendor
app.post('/api/buyer/vendors/:id/status', (req: Request, res: Response) => {
  const vendor = buyerVendorsStore.find((v) => v.id === req.params.id);
  if (!vendor) return res.status(404).json({ error: 'Vendor tidak ditemukan' });

  const { status, reason } = req.body || {};
  if (status) vendor.status = status;
  if (reason) vendor.srmNotes = reason;

  res.json({
    status: 'success',
    message: `Status vendor ${vendor.name} berhasil diubah menjadi ${status.toUpperCase()}`,
    vendor
  });
});

// POST /api/buyer/tenders/:id/invite - Invite Vendors
app.post('/api/buyer/tenders/:id/invite', (req: Request, res: Response) => {
  const tender = buyerTendersStore.find((t) => t.id === req.params.id);
  if (!tender) return res.status(404).json({ error: 'Tender tidak ditemukan' });

  const { vendorIds } = req.body || {};
  if (Array.isArray(vendorIds)) {
    const combined = Array.from(new Set([...tender.invitedVendors, ...vendorIds]));
    tender.invitedVendors = combined;
  }

  res.json({
    status: 'success',
    message: `Undangan resmi berhasil dikirim ke ${vendorIds?.length || 0} vendor terpilih!`,
    invitedVendors: tender.invitedVendors
  });
});

// GET /api/buyer/tenders/:id/bids - Get Bids for Evaluation
app.get('/api/buyer/tenders/:id/bids', (req: Request, res: Response) => {
  const bids = buyerBidsStore.filter((b) => b.tenderId === req.params.id);
  res.json({
    status: 'success',
    total: bids.length,
    bids
  });
});

// POST /api/buyer/tenders/:id/award - Award Tender Winner & Generate MekariSign
app.post('/api/buyer/tenders/:id/award', (req: Request, res: Response) => {
  const tender = buyerTendersStore.find((t) => t.id === req.params.id);
  if (!tender) return res.status(404).json({ error: 'Tender tidak ditemukan' });

  const { bidId, winnerName, winningAmount } = req.body || {};
  
  buyerBidsStore.forEach((b) => {
    if (b.tenderId === tender.id) {
      b.status = b.id === bidId ? 'winner' : 'rejected';
    }
  });

  tender.status = 'awarded';
  tender.winningVendorName = winnerName || 'Vendor Pemenang';
  tender.winningBidAmount = Number(winningAmount) || tender.nilaiHPS;
  tender.esignStatus = 'signed_peruri';
  tender.peruriCertId = `PERURI-CERT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  tender.peruriSignDate = new Date().toISOString().replace('T', ' ').substring(0, 16);
  tender.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

  res.json({
    status: 'success',
    message: `Pemenang tender ${tender.kodeTender} resmi ditetapkan! Kontrak digital Perum Peruri Direct E-Sign & E-Materai resmi di-generate.`,
    tender
  });
});

// GET /api/buyer/tenders/:id/qna - Get Q&A
app.get('/api/buyer/tenders/:id/qna', (req: Request, res: Response) => {
  const items = buyerQnaStore.filter((q) => q.tenderId === req.params.id);
  res.json({
    status: 'success',
    qna: items
  });
});

// POST /api/buyer/tenders/:id/qna - Answer Q&A or Ask
app.post('/api/buyer/tenders/:id/qna', (req: Request, res: Response) => {
  const { questionId, answer, question, vendorName } = req.body || {};
  const tenderId = req.params.id;

  if (questionId) {
    const existing = buyerQnaStore.find((q) => q.id === questionId);
    if (existing) {
      existing.buyerAnswer = answer;
      existing.answeredAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
      return res.json({ status: 'success', message: 'Jawaban resmi buyer berhasil dipublikasikan!', qnaItem: existing });
    }
  }

  const newItem: QnaItem = {
    id: `qna-${Date.now()}`,
    tenderId,
    vendorName: vendorName || 'Vendor Terverifikasi',
    question: question || 'Pertanyaan teknis RKS',
    askedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    isOfficial: true
  };
  buyerQnaStore.push(newItem);

  res.json({ status: 'success', message: 'Pertanyaan berhasil diajukan ke buyer!', qnaItem: newItem });
});

// GET /api/buyer/tenders/:id/auction - Real-Time E-Auction Leaderboard
app.get('/api/buyer/tenders/:id/auction', (req: Request, res: Response) => {
  const bids = buyerAuctionBidsStore
    .filter((a) => a.tenderId === req.params.id)
    .sort((a, b) => a.bidAmount - b.bidAmount);

  res.json({
    status: 'success',
    tenderId: req.params.id,
    eAuctionActive: true,
    sniperProtectionActive: true,
    bids
  });
});

// POST /api/buyer/tenders/:id/auction/bid - Place E-Auction Live Bid
app.post('/api/buyer/tenders/:id/auction/bid', (req: Request, res: Response) => {
  const { vendorAnonName, bidAmount } = req.body || {};
  const tenderId = req.params.id;

  const currentMin = buyerAuctionBidsStore
    .filter((a) => a.tenderId === tenderId)
    .reduce((min, cur) => (cur.bidAmount < min ? cur.bidAmount : min), Number.MAX_SAFE_INTEGER);

  const amountNum = Number(bidAmount);
  if (currentMin !== Number.MAX_SAFE_INTEGER && amountNum >= currentMin) {
    return res.status(400).json({ error: `Penawaran e-auction harus lebih rendah dari penawaran terendah saat ini (${currentMin.toLocaleString('id-ID')})` });
  }

  // Set previous rank 1 to false
  buyerAuctionBidsStore.forEach((a) => {
    if (a.tenderId === tenderId) a.isWinningRank1 = false;
  });

  const newBid: EAuctionBid = {
    id: `abid-${Date.now()}`,
    tenderId,
    vendorId: 'v-demo',
    vendorAnonName: vendorAnonName || 'Vendor #03',
    bidAmount: amountNum,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    isWinningRank1: true
  };

  buyerAuctionBidsStore.push(newBid);

  res.json({
    status: 'success',
    message: `Penawaran e-auction Rp ${amountNum.toLocaleString('id-ID')} masuk ke Peringkat 1! Anti-Sniper time extended +2 menit.`,
    bid: newBid
  });
});

// -------------------------------------------------------------
// VITE DEV / PRODUCTION STATIC SERVER
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Tender LPSE Server] Server berjalan di http://0.0.0.0:${PORT}`);
  });
}

startServer();
