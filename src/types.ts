export type TenderStatus =
  | 'pengumuman'
  | 'prakualifikasi'
  | 'upload_penawaran'
  | 'evaluasi'
  | 'pemenang'
  | 'selesai'
  | 'batal';

export type TenderCategory =
  | 'Pekerjaan Konstruksi'
  | 'Pengadaan Barang'
  | 'Jasa Konsultansi Badan Usaha'
  | 'Jasa Lainnya'
  | 'Jasa Konsultansi Perorangan';

export type TenderMethod =
  | 'Tender'
  | 'Pengadaan Langsung'
  | 'Seleksi'
  | 'E-Purchasing'
  | 'Penunjukan Langsung';

export interface ScheduleStep {
  step: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'active' | 'upcoming';
}

export interface Participant {
  rank?: number;
  name: string;
  npwp: string;
  offerPrice?: number;
  correctedPrice?: number;
  isWinner?: boolean;
}

export interface TenderDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  downloadUrl: string;
}

export interface QAMessage {
  id: string;
  tenderId: string;
  senderName: string;
  senderRole: 'vendor' | 'buyer';
  question: string;
  askedAt: string;
  answer?: string;
  answeredAt?: string;
  answeredBy?: string;
  status: 'pending' | 'answered';
}

export interface Tender {
  id: string;
  kodeTender: string;
  judul: string;
  instansi: string;
  satuanKerja: string;
  kategori: TenderCategory;
  metode: TenderMethod;
  tahunAnggaran: number;
  nilaiPagu: number;
  nilaiHPS: number;
  status: TenderStatus;
  lokasi: string;
  tanggalBuka: string;
  tanggalTutup: string;
  syaratKualifikasi: string[];
  deskripsi: string;
  jadwal: ScheduleStep[];
  peserta: Participant[];
  pemenang?: {
    name: string;
    npwp: string;
    penawaran: number;
    hasilEvaluasi: string;
  };
  dokumen: TenderDocument[];
  isTracked?: boolean;
  lastUpdated: string;
  source_url?: string; // Direct link to LPSE / SPSE official source
  sourceUrl?: string;
  lpseUrl?: string; // Official LPSE / SPSE portal direct link
  matchScore?: number; // 0 - 100 for AI Tender Suggestion Engine
  matchReasons?: string[];
  qaMessages?: QAMessage[];
}

export interface TenderFilterParams {
  search?: string;
  instansi?: string;
  kategori?: string;
  metode?: string;
  status?: string;
  lokasi?: string;
  minHps?: number;
  maxHps?: number;
  sortBy?: 'hps_desc' | 'hps_asc' | 'tutup_asc' | 'buka_desc';
  page?: number;
  limit?: number;
}

export interface TenderStats {
  totalTenders: number;
  totalValueHPS: number;
  closingSoonCount: number;
  newTodayCount: number;
  byCategory: { name: string; count: number; totalHps: number }[];
  byStatus: { name: string; count: number }[];
  byInstansiTop: { instansi: string; count: number; totalHps: number }[];
  monthlyTrends: { month: string; tenderCount: number; hpsMiliar: number }[];
}

export interface VendorRanking {
  rank: number;
  name: string;
  npwp: string;
  totalWins: number;
  totalContractValue: number;
  primaryCategory: string;
  topAgencies: string[];
}

export interface AppNotification {
  id: string;
  tenderId: string;
  tenderTitle: string;
  message: string;
  date: string;
  read: boolean;
  type: 'status_change' | 'schedule_update' | 'winner_announced' | 'new_question' | 'question_answered';
}

export interface PyprocMeta {
  version: string;
  githubUrl: string;
  supportedLpseNodes: number;
  lastSyncTimestamp: string;
  syncIntervalHours: number;
  cachedRecordsCount: number;
}

// ==========================================
// BUYER PROCUREMENT PLATFORM TYPES (Yonyou Inspired)
// ==========================================

export type BuyerTenderStatus =
  | 'draft'
  | 'pending_approval'
  | 'active'
  | 'evaluating'
  | 'closed'
  | 'awarded'
  | 'cancelled';

export type OfferSystemType = 'Satu File' | 'Dua File' | 'Tertutup (Khusus Undangan)';
export type SelectionMethod = 'Lelang Terbuka' | 'Lelang Terbatas' | 'Penunjukan Langsung' | 'E-Purchasing' | 'Tender Kilat';
export type EvaluationMethod = 'Harga Terendah' | 'Kualitas & Harga' | 'Kualitas' | 'Penilaian Komprehensif';

export interface ApprovalStep {
  level: number;
  role: string;
  approverName: string;
  status: 'approved' | 'pending' | 'rejected';
  approvedAt?: string;
  comment?: string;
}

export interface BuyerTender {
  id: string;
  kodeTender: string;
  judul: string;
  deskripsi: string;
  kategori: TenderCategory;
  instansi: string;
  satuanKerja: string;
  lokasi: string;
  spesifikasiTeknis: string;
  dokumenPengadaan: TenderDocument[];
  syaratKualifikasi: string[];
  tanggalBuka: string;
  tanggalTutup: string;
  tanggalPembukaan: string;
  nilaiPagu: number;
  nilaiHPS: number;
  sistemPenawaran: OfferSystemType;
  metodePemilihan: SelectionMethod;
  metodeEvaluasi: EvaluationMethod;
  bobotKualitas?: number;
  bobotHarga?: number;
  jumlahPemenang: number;
  status: BuyerTenderStatus;
  approvalWorkflow: ApprovalStep[];
  eAuctionEnabled: boolean;
  eAuctionEndAt?: string;
  eAuctionMinBidStep?: number;
  esignStatus: 'unsigned' | 'pending_signature' | 'signed_peruri';
  peruriCertId?: string;
  peruriSignDate?: string;
  invitedVendors: string[];
  createdAt: string;
  updatedAt: string;
  totalBidsCount?: number;
  winningBidAmount?: number;
  winningVendorName?: string;
}

export interface BuyerVendor {
  id: string;
  name: string;
  npwp: string;
  email: string;
  phone: string;
  category: TenderCategory;
  rating: number; // 1 to 5
  performanceScore: number; // 0 to 100
  status: 'active' | 'blacklisted' | 'whitelisted' | 'pending';
  totalBidsSubmitted: number;
  totalWins: number;
  completedContractsCount: number;
  srmNotes?: string;
  registeredDate: string;
  sbuCode?: string;
  nibNumber?: string;
}

export interface BuyerBidSubmission {
  id: string;
  tenderId: string;
  vendorId: string;
  vendorName: string;
  vendorNpwp: string;
  offerPrice: number;
  technicalScore: number;
  commercialScore: number;
  finalScore: number;
  submittedAt: string;
  documents: { name: string; url: string; size: string }[];
  status: 'submitted' | 'shortlisted' | 'winner' | 'rejected';
  notes?: string;
}

export interface EAuctionBid {
  id: string;
  tenderId: string;
  vendorId: string;
  vendorAnonName: string; // e.g., "Vendor #03"
  bidAmount: number;
  timestamp: string;
  isWinningRank1: boolean;
}

export interface QnaItem {
  id: string;
  tenderId: string;
  vendorName: string;
  question: string;
  askedAt: string;
  buyerAnswer?: string;
  answeredAt?: string;
  isOfficial: boolean;
}

export interface VendorMetrics {
  vendorName: string;
  npwp?: string;
  completedTenders?: number;
  totalBids?: number;
  winRate?: number;
  verifiedCerts?: string[];
  hasBlacklistHistory?: boolean;
  yearsActive?: number;
  customScore?: number;
}

export interface VendorTierInfo {
  tierLevel: 1 | 2 | 3 | 4;
  tierName: string;
  badgeLabel: string;
  score: number;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  iconName: string;
  description: string;
  reliabilityLabel: string;
}


