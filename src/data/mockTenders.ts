import { Tender, VendorRanking, AppNotification, PyprocMeta } from '../types';

export const INITIAL_TENDERS: Tender[] = [
  {
    id: 'LPSE-PUPR-849201',
    kodeTender: '84920101',
    judul: 'Pembangunan Jembatan Gantung Perbatasan Sekayam Tahap II',
    instansi: 'Kementerian Pekerjaan Umum dan Perumahan Rakyat',
    satuanKerja: 'BPNPJ Wilayah Kalimantan Barat',
    kategori: 'Pekerjaan Konstruksi',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 18500000000,
    nilaiHPS: 17850000000,
    status: 'upload_penawaran',
    lokasi: 'Kabupaten Sanggau, Kalimantan Barat',
    tanggalBuka: '2026-07-10',
    tanggalTutup: '2026-07-28',
    syaratKualifikasi: [
      'Izin Usaha Jasa Konstruksi (IUJK) Sertifikasi Badan Usaha Subklasifikasi SI004 Jembatan',
      'Memiliki NPWP dan telah memenuhi kewajiban perpajakan tahun terakhir (SPT 2025)',
      'Memiliki Pengalaman Teknis Pembangunan Jembatan Baja Kategori Sedang/Besar minimal 1 pekerjaan dalam 5 tahun terakhir',
      'Memiliki Tenaga Ahli Utama Teknik Jembatan (SKK Jenjang 9)',
      'Sisa Kemampuan Paket (SKP) mencukupi'
    ],
    deskripsi: 'Pekerjaan fisik pembangunan jembatan gantung struktur baja panjang span 120m beserta fondasi borepile, pylon, rangka utama, dan jalan akses penghubung desa.',
    jadwal: [
      { step: 'Pengumuman Pasbakualifikasi', startDate: '2026-07-10', endDate: '2026-07-14', status: 'completed' },
      { step: 'Download Dokumen Pemilihan', startDate: '2026-07-11', endDate: '2026-07-22', status: 'completed' },
      { step: 'Pemberian Penjelasan (Aanwijzing)', startDate: '2026-07-15', endDate: '2026-07-15', status: 'completed' },
      { step: 'Upload Dokumen Penawaran', startDate: '2026-07-16', endDate: '2026-07-28', status: 'active' },
      { step: 'Pembukaan Dokumen Penawaran', startDate: '2026-07-28', endDate: '2026-07-29', status: 'upcoming' },
      { step: 'Evaluasi Administrasi & Teknis', startDate: '2026-07-29', endDate: '2026-08-04', status: 'upcoming' },
      { step: 'Penetapan & Pengumuman Pemenang', startDate: '2026-08-05', endDate: '2026-08-05', status: 'upcoming' },
      { step: 'Masa Sanggah', startDate: '2026-08-06', endDate: '2026-08-11', status: 'upcoming' }
    ],
    peserta: [
      { name: 'PT Citra Nusa Konstruksi', npwp: '01.234.567.8-012.000', offerPrice: 16900000000, correctedPrice: 16900000000 },
      { name: 'PT Borneo Utama Perkasa', npwp: '02.345.678.9-023.000', offerPrice: 17150000000, correctedPrice: 17150000000 },
      { name: 'PT Wijaya Karya Infrastruktur', npwp: '01.111.222.3-015.000', offerPrice: 17400000000, correctedPrice: 17400000000 }
    ],
    dokumen: [
      { id: 'doc-1', name: 'Dokumen_Pemilihan_Jembatan_Sekayam.pdf', type: 'PDF', size: '4.8 MB', downloadUrl: '#' },
      { id: 'doc-2', name: 'RAB_dan_Gambar_Teknis_Spesifikasi.zip', type: 'ZIP', size: '18.2 MB', downloadUrl: '#' },
      { id: 'doc-3', name: 'Berita_Acara_Aanwijzing_Jembatan.pdf', type: 'PDF', size: '1.1 MB', downloadUrl: '#' }
    ],
    isTracked: true,
    lastUpdated: '2026-07-20T10:30:00Z'
  },
  {
    id: 'LPSE-KEMENKES-392102',
    kodeTender: '39210205',
    judul: 'Pengadaan Alat Kesehatan CT-Scan 128 Slice RSUP Dr. Sardjito',
    instansi: 'Kementerian Kesehatan',
    satuanKerja: 'RSUP Dr. Sardjito Yogyakarta',
    kategori: 'Pengadaan Barang',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 22000000000,
    nilaiHPS: 21450000000,
    status: 'evaluasi',
    lokasi: 'Sleman, D.I. Yogyakarta',
    tanggalBuka: '2026-07-02',
    tanggalTutup: '2026-07-20',
    syaratKualifikasi: [
      'Izin Edar Alat Kesehatan dari Kementerian Kesehatan RI (AKL)',
      'Surat Penunjukan Keagenan / Distributor Resmi Pabrikan',
      'Sertifikat ISO 13485 Keandalan Sistem Manajemen Mutu Alat Kesehatan',
      'Garansi purna jual & suku cadang minimal 3 tahun disertai garansi teknisi bersertifikat'
    ],
    deskripsi: 'Pengadaan 1 set sistem CT-Scan 128 Slice beserta workstation diagnostik, UPS daya tinggi, sistem pendingin khusus ruangan, dan pelatihan teknis operator radiologi.',
    jadwal: [
      { step: 'Pengumuman Tender', startDate: '2026-07-02', endDate: '2026-07-06', status: 'completed' },
      { step: 'Aanwijzing Lapangan', startDate: '2026-07-08', endDate: '2026-07-08', status: 'completed' },
      { step: 'Batas Upload Penawaran', startDate: '2026-07-09', endDate: '2026-07-20', status: 'completed' },
      { step: 'Evaluasi Penawaran & Pembuktian Kualifikasi', startDate: '2026-07-21', endDate: '2026-07-26', status: 'active' },
      { step: 'Penetapan Pemenang', startDate: '2026-07-27', endDate: '2026-07-27', status: 'upcoming' }
    ],
    peserta: [
      { rank: 1, name: 'PT Siemens Healthineers Indonesia', npwp: '01.987.654.3-054.000', offerPrice: 20200000000, correctedPrice: 20200000000 },
      { rank: 2, name: 'PT GE Operations Indonesia', npwp: '01.444.555.6-062.000', offerPrice: 20850000000, correctedPrice: 20850000000 },
      { rank: 3, name: 'PT Medtek Utama Indonesia', npwp: '03.777.888.9-031.000', offerPrice: 21100000000, correctedPrice: 21100000000 }
    ],
    dokumen: [
      { id: 'doc-4', name: 'Spesifikasi_Teknis_CT_Scan_128_Slice.pdf', type: 'PDF', size: '3.4 MB', downloadUrl: '#' },
      { id: 'doc-5', name: 'Kualifikasi_Penyedia_Alkes.pdf', type: 'PDF', size: '890 KB', downloadUrl: '#' }
    ],
    isTracked: false,
    lastUpdated: '2026-07-21T08:15:00Z'
  },
  {
    id: 'LPSE-DKI-771029',
    kodeTender: '77102909',
    judul: 'Jasa Konsultansi Pengawasan Revitalisasi Kawasan Monas & Medan Merdeka',
    instansi: 'Pemerintah Provinsi DKI Jakarta',
    satuanKerja: 'Dinas Kebudayaan Provinsi DKI Jakarta',
    kategori: 'Jasa Konsultansi Badan Usaha',
    metode: 'Seleksi',
    tahunAnggaran: 2026,
    nilaiPagu: 3500000000,
    nilaiHPS: 3380000000,
    status: 'pemenang',
    lokasi: 'Jakarta Pusat, DKI Jakarta',
    tanggalBuka: '2026-06-15',
    tanggalTutup: '2026-07-18',
    syaratKualifikasi: [
      'Izin Usaha Jasa Konsultansi Arsitektur dan Cagar Budaya',
      'Pengalaman Manajemen Konstruksi Kawasan Cagar Budaya minimal 2 proyek besar',
      'Tenaga Ahli Utama Arsitektur Bentang Alam / Masterplan Cagar Budaya'
    ],
    deskripsi: 'Jasa pengawasan teknik dan asistensi arsitektur kawasan heritage Medan Merdeka mencakup pemeliharaan tugu, pencahayaan arsitektural, dan lanskap kawan.',
    jadwal: [
      { step: 'Pengumuman Seleksi', startDate: '2026-06-15', endDate: '2026-06-20', status: 'completed' },
      { step: 'Prakualifikasi & Aanwijzing', startDate: '2026-06-22', endDate: '2026-06-25', status: 'completed' },
      { step: 'Evaluasi Penawaran', startDate: '2026-07-01', endDate: '2026-07-12', status: 'completed' },
      { step: 'Pengumuman Pemenang', startDate: '2026-07-15', endDate: '2026-07-18', status: 'completed' },
      { step: 'Penandatanganan Kontrak', startDate: '2026-07-22', endDate: '2026-07-25', status: 'active' }
    ],
    peserta: [
      { rank: 1, name: 'PT Virama Karya (Persero)', npwp: '01.000.333.2-092.000', offerPrice: 3190000000, correctedPrice: 3190000000, isWinner: true },
      { rank: 2, name: 'PT Yodya Karya (Persero)', npwp: '01.000.444.3-093.000', offerPrice: 3250000000, correctedPrice: 3250000000 }
    ],
    pemenang: {
      name: 'PT Virama Karya (Persero)',
      npwp: '01.000.333.2-092.000',
      penawaran: 3190000000,
      hasilEvaluasi: 'Lulus Administrasi, Teknis (Skor 94.2), dan Biaya Terendah Terkoreksi'
    },
    dokumen: [
      { id: 'doc-6', name: 'KAK_Jasa_Konsultansi_Monas.pdf', type: 'PDF', size: '2.1 MB', downloadUrl: '#' },
      { id: 'doc-7', name: 'Pengumuman_Pemenang_Monas.pdf', type: 'PDF', size: '650 KB', downloadUrl: '#' }
    ],
    isTracked: true,
    lastUpdated: '2026-07-18T14:00:00Z'
  },
  {
    id: 'LPSE-KEMENKEU-112003',
    kodeTender: '11200388',
    judul: 'Pengembangan & Pemeliharaan Aplikasi Core Tax Administration System (CTAS) Module AI',
    instansi: 'Kementerian Keuangan',
    satuanKerja: 'Direktorat Jenderal Pajak (DJP)',
    kategori: 'Jasa Lainnya',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 45000000000,
    nilaiHPS: 43200000000,
    status: 'pengumuman',
    lokasi: 'Jakarta Selatan, DKI Jakarta',
    tanggalBuka: '2026-07-19',
    tanggalTutup: '2026-08-10',
    syaratKualifikasi: [
      'Sertifikasi ISO 27001 Sistem Manajemen Keamanan Informasi',
      'Sertifikasi CMMI Level 3 / DevSecOps Maturity Framework',
      'Pengalaman Mengembangkan Enterprise AI / Machine Learning Big Data Analytics sektor keuangan',
      'Tenaga Ahli AI/ML Engineer (Certified Cloud Solution Architect)'
    ],
    deskripsi: 'Pengembangan modul analitik kecerdasan buatan untuk deteksi anomali kepatuhan wajib pajak, pemrosesan dokumen faktur otomatis, dan fraud detection engine.',
    jadwal: [
      { step: 'Pengumuman Tender', startDate: '2026-07-19', endDate: '2026-07-24', status: 'active' },
      { step: 'Download Dokumen', startDate: '2026-07-20', endDate: '2026-08-01', status: 'active' },
      { step: 'Pemberian Penjelasan (Aanwijzing)', startDate: '2026-07-25', endDate: '2026-07-25', status: 'upcoming' },
      { step: 'Upload Penawaran', startDate: '2026-07-26', endDate: '2026-08-10', status: 'upcoming' }
    ],
    peserta: [],
    dokumen: [
      { id: 'doc-8', name: 'Dokumen_Pengadaan_CTAS_AI_DJP.pdf', type: 'PDF', size: '5.6 MB', downloadUrl: '#' }
    ],
    isTracked: false,
    lastUpdated: '2026-07-19T09:00:00Z'
  },
  {
    id: 'LPSE-SURABAYA-551982',
    kodeTender: '55198202',
    judul: 'Pemeliharaan Berkala Saluran Drainase Utama Wilayah Surabaya Barat',
    instansi: 'Pemerintah Kota Surabaya',
    satuanKerja: 'Dinas Sumber Daya Air dan Bina Marga',
    kategori: 'Pekerjaan Konstruksi',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 8200000000,
    nilaiHPS: 7950000000,
    status: 'prakualifikasi',
    lokasi: 'Kota Surabaya, Jawa Timur',
    tanggalBuka: '2026-07-15',
    tanggalTutup: '2026-07-30',
    syaratKualifikasi: [
      'SBU Subklasifikasi BS001 Saluran Air / Drainase',
      'Dukungan Peralatan Ekskavator dan Mobil Pump Hujan minimal 3 unit',
      'Pengalaman penanganan banjir/drainase perkotaan'
    ],
    deskripsi: 'Pengerukan sedimen, perbaikan dinding box culvert, dan pembuatan rumah pompa di kawasan Manukan dan Tandes untuk penanggulangan banjir.',
    jadwal: [
      { step: 'Pengumuman Prakualifikasi', startDate: '2026-07-15', endDate: '2026-07-21', status: 'completed' },
      { step: 'Pendaftaran & Kualifikasi', startDate: '2026-07-16', endDate: '2026-07-30', status: 'active' },
      { step: 'Pembuktian Kualifikasi', startDate: '2026-07-31', endDate: '2026-08-03', status: 'upcoming' }
    ],
    peserta: [
      { name: 'PT Surabaya Indah Karya', npwp: '02.999.888.1-061.000' },
      { name: 'CV Jawa Timur Drainase', npwp: '03.888.777.2-062.000' }
    ],
    dokumen: [
      { id: 'doc-9', name: 'Dokumen_Kualifikasi_Drainase_Sby.pdf', type: 'PDF', size: '2.8 MB', downloadUrl: '#' }
    ],
    isTracked: true,
    lastUpdated: '2026-07-17T11:20:00Z'
  },
  {
    id: 'LPSE-PLN-991203',
    kodeTender: '99120340',
    judul: 'Pengadaan Trafo Distribusi 20kV / 400V Ramah Lingkungan Substation Jawa-Bali',
    instansi: 'PT PLN (Persero)',
    satuanKerja: 'PLN Pusat Pengadaan Ketenagakerjaan & Transmisi',
    kategori: 'Pengadaan Barang',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 32000000000,
    nilaiHPS: 31100000000,
    status: 'upload_penawaran',
    lokasi: 'Bandung & Semarang, Jawa Barat/Jawa Tengah',
    tanggalBuka: '2026-07-08',
    tanggalTutup: '2026-07-27',
    syaratKualifikasi: [
      'Sertifikat TKDN minimal 40%',
      'Lulus Uji Jenis PLN Pusat Penelitian dan Pengembangan (Puslitbang PLN)',
      'Memiliki fasilitas pabrikasi di Indonesia / Konsorsium Lokal'
    ],
    deskripsi: 'Supply 150 unit Trafo Distribusi daya 250kVA - 630kVA dengan minyak ester nabati ramah lingkungan.',
    jadwal: [
      { step: 'Pengumuman Tender', startDate: '2026-07-08', endDate: '2026-07-12', status: 'completed' },
      { step: 'Upload Dokumen Penawaran', startDate: '2026-07-13', endDate: '2026-07-27', status: 'active' },
      { step: 'Pembukaan Penawaran', startDate: '2026-07-28', endDate: '2026-07-28', status: 'upcoming' }
    ],
    peserta: [
      { name: 'PT Trafoindo Prima Perkasa', npwp: '01.555.666.7-043.000' },
      { name: 'PT Schneider Electric Indonesia', npwp: '01.333.222.1-055.000' }
    ],
    dokumen: [
      { id: 'doc-10', name: 'Spesifikasi_Trafo_Ester_PLN.pdf', type: 'PDF', size: '6.1 MB', downloadUrl: '#' }
    ],
    isTracked: false,
    lastUpdated: '2026-07-18T16:45:00Z'
  },
  {
    id: 'LPSE-KEMHUB-442190',
    kodeTender: '44219011',
    judul: 'Pekerjaan Pengerukan Alur Pelayaran Pelabuhan Tanjung Perak Surabaya',
    instansi: 'Kementerian Perhubungan',
    satuanKerja: 'Direktorat Jenderal Perhubungan Laut',
    kategori: 'Pekerjaan Konstruksi',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 58000000000,
    nilaiHPS: 56200000000,
    status: 'selesai',
    lokasi: 'Pelabuhan Tanjung Perak, Surabaya',
    tanggalBuka: '2026-05-10',
    tanggalTutup: '2026-06-20',
    syaratKualifikasi: [
      'Izin Usaha Pengerukan dan Reklamasi (SIUPER)',
      'Memiliki Kapal Keruk jenis TSHD (Trailing Suction Hopper Dredger) berbendera Indonesia',
      'Pengalaman pengerukan pelabuhan internasional'
    ],
    deskripsi: 'Pengerukan sedimentasi lumpur laut hingga kedalaman -14m LWS sepanjang alur pelayaran 12 mil laut.',
    jadwal: [
      { step: 'Pengumuman Tender', startDate: '2026-05-10', endDate: '2026-05-15', status: 'completed' },
      { step: 'Evaluasi & Pemenang', startDate: '2026-06-01', endDate: '2026-06-15', status: 'completed' },
      { step: 'Penandatanganan Kontrak', startDate: '2026-06-20', endDate: '2026-06-20', status: 'completed' }
    ],
    peserta: [
      { rank: 1, name: 'PT Pengerukan Indonesia (Rukindo)', npwp: '01.000.123.4-091.000', offerPrice: 54100000000, correctedPrice: 54100000000, isWinner: true },
      { rank: 2, name: 'PT Adhi Karya (Persero) Tbk', npwp: '01.000.555.6-092.000', offerPrice: 55300000000, correctedPrice: 55300000000 }
    ],
    pemenang: {
      name: 'PT Pengerukan Indonesia (Rukindo)',
      npwp: '01.000.123.4-091.000',
      penawaran: 54100000000,
      hasilEvaluasi: 'Lulus Kualifikasi, Teknis 98%, dan Harga Terendah'
    },
    dokumen: [
      { id: 'doc-11', name: 'Kontrak_Selesai_Pengerukan_Perak.pdf', type: 'PDF', size: '1.9 MB', downloadUrl: '#' }
    ],
    isTracked: false,
    lastUpdated: '2026-06-25T12:00:00Z'
  },
  {
    id: 'LPSE-BALI-601933',
    kodeTender: '60193322',
    judul: 'Pengadaan Layanan Cloud Data Center & Smart Tourism Command Center Bali',
    instansi: 'Pemerintah Provinsi Bali',
    satuanKerja: 'Dinas Komunikasi, Informatika dan Statistik',
    kategori: 'Jasa Lainnya',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 6500000000,
    nilaiHPS: 6250000000,
    status: 'upload_penawaran',
    lokasi: 'Denpasar, Bali',
    tanggalBuka: '2026-07-12',
    tanggalTutup: '2026-07-29',
    syaratKualifikasi: [
      'Penyedia Data Center Terakreditasi Tier III Uptime Institute di Indonesia',
      'Konektivitas Fiber Optik Dedicated Redundant ke Kantor Gubernur',
      'Dukungan SLA 99.95% Layanan 24/7'
    ],
    deskripsi: 'Sewa infrastruktur server private cloud, storage 100TB, load balancer, dan video wall command center pariwisata terpadu.',
    jadwal: [
      { step: 'Pengumuman Tender', startDate: '2026-07-12', endDate: '2026-07-16', status: 'completed' },
      { step: 'Upload Penawaran', startDate: '2026-07-17', endDate: '2026-07-29', status: 'active' },
      { step: 'Pembukaan Penawaran', startDate: '2026-07-30', endDate: '2026-07-30', status: 'upcoming' }
    ],
    peserta: [
      { name: 'PT Telkom Indonesia (Persero) Tbk', npwp: '01.000.000.1-093.000' },
      { name: 'PT Indosat Tbk (Indosat Business)', npwp: '01.000.222.9-091.000' }
    ],
    dokumen: [
      { id: 'doc-12', name: 'RFP_Command_Center_Bali.pdf', type: 'PDF', size: '3.1 MB', downloadUrl: '#' }
    ],
    isTracked: true,
    lastUpdated: '2026-07-20T15:00:00Z'
  },
  {
    id: 'LPSE-JABAR-104829',
    kodeTender: '10482910',
    judul: 'Konstruksi Pembangunan Kampus II Universitas Pendidikan Indonesia Purwakarta',
    instansi: 'Pemerintah Provinsi Jawa Barat',
    satuanKerja: 'Dinas Perumahan dan Pemukiman Provinsi Jawa Barat',
    kategori: 'Pekerjaan Konstruksi',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 38000000000,
    nilaiHPS: 36700000000,
    status: 'upload_penawaran',
    lokasi: 'Kabupaten Purwakarta, Jawa Barat',
    tanggalBuka: '2026-07-05',
    tanggalTutup: '2026-07-27',
    syaratKualifikasi: [
      'Izin Usaha Jasa Konstruksi (IUJK) SBU Bangunan Gedung Pendidikan (BG007)',
      'Memiliki Pengalaman Fisik Gedung Bertingkat Minimal 4 Lantai',
      'Tenaga Ahli Utama Teknik Bangunan Gedung (SKK Jenjang 8)'
    ],
    deskripsi: 'Pembangunan struktur beton bertulang 5 lantai gedung laboratorium terpadu, auditorium, fasilitas kelistrikan dan sistem APAR.',
    jadwal: [
      { step: 'Pengumuman Tender', startDate: '2026-07-05', endDate: '2026-07-10', status: 'completed' },
      { step: 'Upload Dokumen Penawaran', startDate: '2026-07-11', endDate: '2026-07-27', status: 'active' },
      { step: 'Pembukaan Dokumen', startDate: '2026-07-28', endDate: '2026-07-28', status: 'upcoming' }
    ],
    peserta: [
      { name: 'PT Pembangunan Perumahan (Persero) Tbk', npwp: '01.000.222.2-092.000' },
      { name: 'PT Waskita Karya (Persero) Tbk', npwp: '01.000.777.8-091.000' }
    ],
    dokumen: [
      { id: 'doc-13', name: 'RAB_Gedung_UPI_Purwakarta.zip', type: 'ZIP', size: '24.5 MB', downloadUrl: '#' }
    ],
    isTracked: false,
    lastUpdated: '2026-07-21T09:10:00Z'
  },
  {
    id: 'LPSE-KEMDIKBUD-291048',
    kodeTender: '29104811',
    judul: 'Pengadaan Perangkat Server AI High Performance Computing (HPC) UI & ITB',
    instansi: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
    satuanKerja: 'Direktorat Jenderal Pendidikan Tinggi, Riset, dan Teknologi',
    kategori: 'Pengadaan Barang',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 28000000000,
    nilaiHPS: 27100000000,
    status: 'pengumuman',
    lokasi: 'Depok & Bandung, Jawa Barat',
    tanggalBuka: '2026-07-18',
    tanggalTutup: '2026-08-08',
    syaratKualifikasi: [
      'Distributor Resmi / Gold Partner Tier-1 Server Hardware (NVIDIA H100 / HGX Cluster)',
      'Sertifikat TKDN Barang / Jasa Pendukung',
      'Garansi Pabrikan 3 Tahun Onsite 24x7 Response Time'
    ],
    deskripsi: 'Pengadaan 4 unit supercomputer node GPU NVIDIA H100 SXM5 80GB, Infiniband 400Gbps networking, dan storage All-Flash NVMe 200TB.',
    jadwal: [
      { step: 'Pengumuman Tender', startDate: '2026-07-18', endDate: '2026-07-23', status: 'active' },
      { step: 'Aanwijzing Online', startDate: '2026-07-24', endDate: '2026-07-24', status: 'upcoming' },
      { step: 'Upload Penawaran', startDate: '2026-07-25', endDate: '2026-08-08', status: 'upcoming' }
    ],
    peserta: [],
    dokumen: [
      { id: 'doc-14', name: 'Spesifikasi_HPC_Cluster_Kemdikbud.pdf', type: 'PDF', size: '5.1 MB', downloadUrl: '#' }
    ],
    isTracked: true,
    lastUpdated: '2026-07-18T11:00:00Z'
  },
  {
    id: 'LPSE-OJK-582910',
    kodeTender: '58291042',
    judul: 'Jasa Audit Keamanan Siber & Penetration Testing Core Banking Infrastructure OJK',
    instansi: 'Otoritas Jasa Keuangan',
    satuanKerja: 'Departemen Teknologi Informasi OJK Pusat',
    kategori: 'Jasa Konsultansi Badan Usaha',
    metode: 'Seleksi',
    tahunAnggaran: 2026,
    nilaiPagu: 4800000000,
    nilaiHPS: 4650000000,
    status: 'evaluasi',
    lokasi: 'Jakarta Pusat, DKI Jakarta',
    tanggalBuka: '2026-06-28',
    tanggalTutup: '2026-07-19',
    syaratKualifikasi: [
      'Lisensi Resmi CREST / BSSN Registered Cybersecurity Service Provider',
      'Tim Penetration Tester Memiliki Sertifikasi OSCP, CISSP, & CISA',
      'Pengalaman Audit Sistem Keuangan Perbankan Nasional minimal 3 lembaga'
    ],
    deskripsi: 'Audit komprehensif vulnerability assessment, red teaming, dan threat modeling pada infrastruktur perizinan perbankan OJK.',
    jadwal: [
      { step: 'Pengumuman Seleksi', startDate: '2026-06-28', endDate: '2026-07-02', status: 'completed' },
      { step: 'Evaluasi Penawaran', startDate: '2026-07-12', endDate: '2026-07-24', status: 'active' }
    ],
    peserta: [
      { rank: 1, name: 'PT PricewaterhouseCoopers Indonesia Advisory', npwp: '01.222.333.4-051.000', offerPrice: 4420000000, correctedPrice: 4420000000 },
      { rank: 2, name: 'PT Ernst & Young Indonesia', npwp: '01.333.444.5-052.000', offerPrice: 4580000000, correctedPrice: 4580000000 }
    ],
    dokumen: [
      { id: 'doc-15', name: 'KAK_Audit_Siber_OJK_2026.pdf', type: 'PDF', size: '1.8 MB', downloadUrl: '#' }
    ],
    isTracked: false,
    lastUpdated: '2026-07-19T17:00:00Z'
  },
  {
    id: 'LPSE-TELKOM-781029',
    kodeTender: '78102941',
    judul: 'Pengadaan Kabel Serat Optik Submarine (Bawah Laut) Jalur Nusa Tenggara - Timor',
    instansi: 'PT Telkom Indonesia (Persero) Tbk',
    satuanKerja: 'Directorate Network & IT Solution Telkom',
    kategori: 'Pekerjaan Konstruksi',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 125000000000,
    nilaiHPS: 121000000000,
    status: 'upload_penawaran',
    lokasi: 'Kupang & Ende, Nusa Tenggara Timur',
    tanggalBuka: '2026-07-01',
    tanggalTutup: '2026-07-31',
    syaratKualifikasi: [
      'Pengalaman Pemasangan Submarine Cable System Minimal 100km',
      'Izin Operasional Kapal Cable Laying Berbendera Indonesia',
      'Garansi Sistem Fiber Optik 10 Tahun'
    ],
    deskripsi: 'Pengadaan dan penggelaran sistem kabel laut serat optik 96 core repeaterless sepanjang 140km untuk peningkatan kapasitas backbone broadband Indonesia Timur.',
    jadwal: [
      { step: 'Pengumuman Tender', startDate: '2026-07-01', endDate: '2026-07-06', status: 'completed' },
      { step: 'Upload Penawaran', startDate: '2026-07-07', endDate: '2026-07-31', status: 'active' },
      { step: 'Pembukaan Penawaran', startDate: '2026-08-01', endDate: '2026-08-01', status: 'upcoming' }
    ],
    peserta: [
      { name: 'PT Jaringan Ekspedisi Laut FO', npwp: '01.888.999.0-091.000' },
      { name: 'PT NEC Indonesia', npwp: '01.777.666.5-054.000' }
    ],
    dokumen: [
      { id: 'doc-16', name: 'Submarine_FO_NTT_Telkom.zip', type: 'ZIP', size: '32.0 MB', downloadUrl: '#' }
    ],
    isTracked: true,
    lastUpdated: '2026-07-21T07:30:00Z'
  },
  {
    id: 'LPSE-LEBAK-302911',
    kodeTender: '30291108',
    judul: 'Rekonstruksi Jalan Rangkasbitung - Citeras & Pembangunan Poned Puskesmas',
    instansi: 'Pemerintah Kabupaten Lebak',
    satuanKerja: 'Dinas Pekerjaan Umum dan Penataan Ruang Kab. Lebak',
    kategori: 'Pekerjaan Konstruksi',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 14200000000,
    nilaiHPS: 13850000000,
    status: 'upload_penawaran',
    lokasi: 'Kabupaten Lebak, Banten',
    tanggalBuka: '2026-07-12',
    tanggalTutup: '2026-07-22T16:00:00Z',
    syaratKualifikasi: [
      'Izin Usaha Jasa Konstruksi (IUJK) SBU Subklasifikasi Jalan (BS001)',
      'Pengalaman Pekerjaan Fisik Jalan Kabupaten / Provinsi minimal 1 pekerjaan 5 tahun terakhir',
      'Memiliki Asphalt Mixing Plant (AMP) berizin lokasi Banten / sekitarnya',
      'Sertifikat Standar K3 Konstruksi'
    ],
    deskripsi: 'Pekerjaan pelebaran dan perkerasan aspal hotmix jalan kabupaten koridor Rangkasbitung-Citeras sepanjang 8.5 km beserta perbaikan drainase beton dan pembangunan gedung Poned Puskesmas.',
    jadwal: [
      { step: 'Pengumuman Tender', startDate: '2026-07-12', endDate: '2026-07-16', status: 'completed' },
      { step: 'Download Dokumen Pemilihan', startDate: '2026-07-13', endDate: '2026-07-25', status: 'completed' },
      { step: 'Aanwijzing Lapangan', startDate: '2026-07-18', endDate: '2026-07-18', status: 'completed' },
      { step: 'Upload Dokumen Penawaran', startDate: '2026-07-19', endDate: '2026-07-30', status: 'active' },
      { step: 'Pembukaan Penawaran', startDate: '2026-07-31', endDate: '2026-07-31', status: 'upcoming' }
    ],
    peserta: [
      { name: 'PT Banten Utama Karya', npwp: '01.888.777.6-081.000' },
      { name: 'CV Lebak Sejahtera Konstruksi', npwp: '02.999.111.3-082.000' }
    ],
    dokumen: [
      { id: 'doc-17', name: 'Dokumen_Pemilihan_Jalan_Rangkasbitung.pdf', type: 'PDF', size: '3.8 MB', downloadUrl: '#' },
      { id: 'doc-18', name: 'RAB_Rekonstruksi_Lebak.zip', type: 'ZIP', size: '14.2 MB', downloadUrl: '#' }
    ],
    isTracked: true,
    lastUpdated: '2026-07-21T11:00:00Z'
  },
  {
    id: 'LPSE-BOGOR-412093',
    kodeTender: '41209312',
    judul: 'Pembangunan Gedung Rawat Inap RSUD Parung Kabupaten Bogor Tahap III',
    instansi: 'Pemerintah Kabupaten Bogor',
    satuanKerja: 'Dinas Kesehatan Kabupaten Bogor',
    kategori: 'Pekerjaan Konstruksi',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 26500000000,
    nilaiHPS: 25800000000,
    status: 'evaluasi',
    lokasi: 'Kabupaten Bogor, Jawa Barat',
    tanggalBuka: '2026-07-01',
    tanggalTutup: '2026-07-20',
    syaratKualifikasi: [
      'SBU Gedung Kesehatan / Rumah Sakit (BG008)',
      'Pengalaman Konstruksi Gedung Publik Bertingkat Minimal 3 Lantai',
      'Memiliki Surat Dukungan Bank Rekanan Daerah'
    ],
    deskripsi: 'Lanjutan pembangunan fisik gedung RSUD Parung 4 lantai mencakup pekerjaan arsitektur, MEP, gas medis, lift pasien, dan landscape.',
    jadwal: [
      { step: 'Pengumuman Tender', startDate: '2026-07-01', endDate: '2026-07-05', status: 'completed' },
      { step: 'Upload Penawaran', startDate: '2026-07-06', endDate: '2026-07-20', status: 'completed' },
      { step: 'Evaluasi Penawaran & Pembuktian', startDate: '2026-07-21', endDate: '2026-07-28', status: 'active' }
    ],
    peserta: [
      { rank: 1, name: 'PT Bogor Indah Perkasa', npwp: '01.444.333.2-042.000', offerPrice: 24900000000, correctedPrice: 24900000000 },
      { rank: 2, name: 'PT West Java Konstruksi', npwp: '02.555.666.1-043.000', offerPrice: 25300000000, correctedPrice: 25300000000 }
    ],
    dokumen: [
      { id: 'doc-19', name: 'Spesifikasi_Gedung_RSUD_Parung.pdf', type: 'PDF', size: '5.4 MB', downloadUrl: '#' }
    ],
    isTracked: false,
    lastUpdated: '2026-07-21T08:00:00Z'
  },
  {
    id: 'LPSE-BADUNG-902183',
    kodeTender: '90218355',
    judul: 'Pengadaan Alat Berat & Sistem Pengolahan Sampah Terpadu TPST Mengwi',
    instansi: 'Pemerintah Kabupaten Badung',
    satuanKerja: 'Dinas Lingkungan Hidup dan Kebersihan Kab. Badung',
    kategori: 'Pengadaan Barang',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 17500000000,
    nilaiHPS: 16900000000,
    status: 'upload_penawaran',
    lokasi: 'Kabupaten Badung, Bali',
    tanggalBuka: '2026-07-10',
    tanggalTutup: '2026-07-29',
    syaratKualifikasi: [
      'Distributor / Agen Resmi Peralatan Refuse Derived Fuel (RDF) & Shredder Sampah',
      'TKDN minimal 35%',
      'Garansi mesin & pemeliharaan berkala 2 tahun'
    ],
    deskripsi: 'Pengadaan 2 unit mesin pemilah sampah otomatis, 1 unit RDF plant kapasitas 100 ton/hari, dan 3 unit wheel loader untuk TPST Mengwi Badung.',
    jadwal: [
      { step: 'Pengumuman Tender', startDate: '2026-07-10', endDate: '2026-07-14', status: 'completed' },
      { step: 'Upload Penawaran', startDate: '2026-07-15', endDate: '2026-07-29', status: 'active' },
      { step: 'Pembukaan Penawaran', startDate: '2026-07-30', endDate: '2026-07-30', status: 'upcoming' }
    ],
    peserta: [
      { name: 'PT Bali Eco Teknindo', npwp: '03.111.222.3-901.000' }
    ],
    dokumen: [
      { id: 'doc-20', name: 'Dokumen_Pengadaan_TPST_Badung.pdf', type: 'PDF', size: '4.1 MB', downloadUrl: '#' }
    ],
    isTracked: true,
    lastUpdated: '2026-07-20T14:30:00Z'
  },
  {
    id: 'LPSE-SLEMAN-119203',
    kodeTender: '11920399',
    judul: 'Modernisasi Jaringan Irigasi Pertanian & Digital Smart Village Sleman',
    instansi: 'Pemerintah Kabupaten Sleman',
    satuanKerja: 'Dinas Pertanian, Pangan dan Perikanan Kab. Sleman',
    kategori: 'Jasa Lainnya',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 5400000000,
    nilaiHPS: 5150000000,
    status: 'pengumuman',
    lokasi: 'Kabupaten Sleman, D.I. Yogyakarta',
    tanggalBuka: '2026-07-19',
    tanggalTutup: '2026-08-05',
    syaratKualifikasi: [
      'Penyedia Solusi IoT Sensor Pertanian & Aplikasi Manajemen Distribusi Air',
      'Pengalaman Implementasi Smart Agriculture di Lembaga Pemerintah / BUMN'
    ],
    deskripsi: 'Pemasangan 80 titik IoT sensor debit air irigasi, automatic sluice gate control, serta dashboard monitoring pertanian Sleman.',
    jadwal: [
      { step: 'Pengumuman Tender', startDate: '2026-07-19', endDate: '2026-07-23', status: 'active' },
      { step: 'Aanwijzing', startDate: '2026-07-24', endDate: '2026-07-24', status: 'upcoming' },
      { step: 'Upload Penawaran', startDate: '2026-07-25', endDate: '2026-08-05', status: 'upcoming' }
    ],
    peserta: [],
    dokumen: [
      { id: 'doc-21', name: 'KAK_Smart_Village_Irigasi_Sleman.pdf', type: 'PDF', size: '2.3 MB', downloadUrl: '#' }
    ],
    isTracked: false,
    lastUpdated: '2026-07-19T10:00:00Z'
  },
  {
    id: 'LPSE-KUKAR-559102',
    kodeTender: '55910244',
    judul: 'Pembangunan Jembatan Penghubung Penunjang Kawasan IKN Tenggarong Seberang',
    instansi: 'Pemerintah Kabupaten Kutai Kartanegara',
    satuanKerja: 'Dinas Pekerjaan Umum Kab. Kutai Kartanegara',
    kategori: 'Pekerjaan Konstruksi',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 31000000000,
    nilaiHPS: 29800000000,
    status: 'upload_penawaran',
    lokasi: 'Kabupaten Kutai Kartanegara, Kalimantan Timur',
    tanggalBuka: '2026-07-08',
    tanggalTutup: '2026-07-28',
    syaratKualifikasi: [
      'SBU Konstruksi Jembatan & Jalan Raya (SI004)',
      'Pengalaman Pembangunan Jembatan Beton Bertulang / Girder Minimal 60m'
    ],
    deskripsi: 'Pembangunan jembatan pilar beton bentang 80m penghubung kecamatan Tenggarong Seberang menuju koridor logistik IKN Nusantara.',
    jadwal: [
      { step: 'Pengumuman Tender', startDate: '2026-07-08', endDate: '2026-07-12', status: 'completed' },
      { step: 'Upload Penawaran', startDate: '2026-07-13', endDate: '2026-07-28', status: 'active' }
    ],
    peserta: [
      { name: 'PT Kaltim Utama Konstruksi', npwp: '02.777.888.1-721.000' }
    ],
    dokumen: [
      { id: 'doc-22', name: 'Gambar_Teknis_Jembatan_Kukar.pdf', type: 'PDF', size: '8.2 MB', downloadUrl: '#' }
    ],
    isTracked: true,
    lastUpdated: '2026-07-20T16:00:00Z'
  },
  {
    id: 'LPSE-DELISERDANG-882019',
    kodeTender: '88201977',
    judul: 'Pembangunan Puskesmas Rawat Inap Pancur Batu & Pengadaan Ambulans',
    instansi: 'Pemerintah Kabupaten Deli Serdang',
    satuanKerja: 'Dinas Kesehatan Kabupaten Deli Serdang',
    kategori: 'Pekerjaan Konstruksi',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 8900000000,
    nilaiHPS: 8600000000,
    status: 'pemenang',
    lokasi: 'Kabupaten Deli Serdang, Sumatera Utara',
    tanggalBuka: '2026-06-10',
    tanggalTutup: '2026-07-15',
    syaratKualifikasi: [
      'IUJK Bangunan Kesehatan (BG008)',
      'SPT Tahun 2025 Memenuhi Syarat'
    ],
    deskripsi: 'Pembangunan gedung puskesmas 2 lantai fasilitas rawat inap emergency beserta 2 unit kendaraan ambulans medis.',
    jadwal: [
      { step: 'Pengumuman', startDate: '2026-06-10', endDate: '2026-06-15', status: 'completed' },
      { step: 'Pengumuman Pemenang', startDate: '2026-07-15', endDate: '2026-07-18', status: 'completed' }
    ],
    peserta: [
      { rank: 1, name: 'PT Sumut Bina Karya', npwp: '01.333.222.1-111.000', offerPrice: 8350000000, correctedPrice: 8350000000, isWinner: true }
    ],
    pemenang: {
      name: 'PT Sumut Bina Karya',
      npwp: '01.333.222.1-111.000',
      penawaran: 8350000000,
      hasilEvaluasi: 'Pemenang Berkualifikasi Administrasi & Harga Terendah'
    },
    dokumen: [
      { id: 'doc-23', name: 'BA_Hasil_Pemenang_DeliSerdang.pdf', type: 'PDF', size: '1.2 MB', downloadUrl: '#' }
    ],
    isTracked: false,
    lastUpdated: '2026-07-18T10:00:00Z'
  },
  {
    id: 'LPSE-JAYAPURA-773012',
    kodeTender: '77301210',
    judul: 'Pengadaan Sarana Air Bersih & PLTS Komunal Desa Sentani',
    instansi: 'Pemerintah Kabupaten Jayapura',
    satuanKerja: 'Dinas PUPR Kabupaten Jayapura',
    kategori: 'Pekerjaan Konstruksi',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 12000000000,
    nilaiHPS: 11500000000,
    status: 'upload_penawaran',
    lokasi: 'Kabupaten Jayapura, Papua',
    tanggalBuka: '2026-07-05',
    tanggalTutup: '2026-07-28',
    syaratKualifikasi: [
      'SBU Perpipaan Air Bersih & Energi Terbarukan',
      'Kemitraan Pengusaha Lokal Papua'
    ],
    deskripsi: 'Pemasangan pipa air bersih 12 km dari sumber mata air Gunung Cycloop dan pembangkit listrik tenaga surya (PLTS) 50 kWp untuk 3 desa di Sentani.',
    jadwal: [
      { step: 'Pengumuman Tender', startDate: '2026-07-05', endDate: '2026-07-10', status: 'completed' },
      { step: 'Upload Penawaran', startDate: '2026-07-11', endDate: '2026-07-28', status: 'active' }
    ],
    peserta: [
      { name: 'PT Papua Cenderawasih Mandiri', npwp: '04.555.666.7-951.000' }
    ],
    dokumen: [
      { id: 'doc-24', name: 'Dokumen_Air_Bersih_Jayapura.pdf', type: 'PDF', size: '3.6 MB', downloadUrl: '#' }
    ],
    isTracked: true,
    lastUpdated: '2026-07-21T06:00:00Z'
  },
  {
    id: 'LPSE-BANYUWANGI-661029',
    kodeTender: '66102980',
    judul: 'Pengadaan Sistem Smart Farming & Sarana Cold Storage Nelayan Muncar',
    instansi: 'Pemerintah Kabupaten Banyuwangi',
    satuanKerja: 'Dinas Perikanan Kab. Banyuwangi',
    kategori: 'Pengadaan Barang',
    metode: 'Tender',
    tahunAnggaran: 2026,
    nilaiPagu: 9800000000,
    nilaiHPS: 9450000000,
    status: 'upload_penawaran',
    lokasi: 'Kabupaten Banyuwangi, Jawa Timur',
    tanggalBuka: '2026-07-09',
    tanggalTutup: '2026-07-27',
    syaratKualifikasi: [
      'Spesifikasi Mesin Pendingin Industri Cold Storage 50 Ton',
      'Sertifikat TKDN minimal 40%'
    ],
    deskripsi: 'Pembangunan 1 unit cold storage kapasitas 50 ton dan pengadaan 20 unit flake ice maker untuk komoditas tangkapan nelayan Muncar.',
    jadwal: [
      { step: 'Pengumuman Tender', startDate: '2026-07-09', endDate: '2026-07-13', status: 'completed' },
      { step: 'Upload Penawaran', startDate: '2026-07-14', endDate: '2026-07-27', status: 'active' }
    ],
    peserta: [
      { name: 'PT East Java Refrigeration', npwp: '01.666.777.8-063.000' }
    ],
    dokumen: [
      { id: 'doc-25', name: 'RFP_Cold_Storage_Banyuwangi.pdf', type: 'PDF', size: '2.9 MB', downloadUrl: '#' }
    ],
    isTracked: false,
    lastUpdated: '2026-07-20T12:00:00Z'
  }
];

export const VENDOR_RANKINGS: VendorRanking[] = [
  {
    rank: 1,
    name: 'PT Wijaya Karya (Persero) Tbk',
    npwp: '01.000.111.1-091.000',
    totalWins: 42,
    totalContractValue: 385000000000,
    primaryCategory: 'Pekerjaan Konstruksi',
    topAgencies: ['Kementerian PUPR', 'Kementerian Perhub', 'Pemprov DKI']
  },
  {
    rank: 2,
    name: 'PT Pembangunan Perumahan (Persero) Tbk',
    npwp: '01.000.222.2-092.000',
    totalWins: 38,
    totalContractValue: 312000000000,
    primaryCategory: 'Pekerjaan Konstruksi',
    topAgencies: ['Kementerian PUPR', 'PT PLN (Persero)', 'Pemkota Surabaya']
  },
  {
    rank: 3,
    name: 'PT Siemens Healthineers Indonesia',
    npwp: '01.987.654.3-054.000',
    totalWins: 27,
    totalContractValue: 184000000000,
    primaryCategory: 'Pengadaan Barang',
    topAgencies: ['Kementerian Kesehatan', 'RSUP Dr. Sardjito', 'Pemda Bali']
  },
  {
    rank: 4,
    name: 'PT Virama Karya (Persero)',
    npwp: '01.000.333.2-092.000',
    totalWins: 31,
    totalContractValue: 98000000000,
    primaryCategory: 'Jasa Konsultansi Badan Usaha',
    topAgencies: ['Pemprov DKI Jakarta', 'Kementerian PUPR', 'Kemenkeu']
  },
  {
    rank: 5,
    name: 'PT Telkom Indonesia (Persero) Tbk',
    npwp: '01.000.000.1-093.000',
    totalWins: 45,
    totalContractValue: 142000000000,
    primaryCategory: 'Jasa Lainnya',
    topAgencies: ['Kementerian Keuangan', 'Pemprov Bali', 'Kemenkominfo']
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    tenderId: 'LPSE-PUPR-849201',
    tenderTitle: 'Pembangunan Jembatan Gantung Perbatasan Sekayam Tahap II',
    message: 'Batas akhir Upload Dokumen Penawaran tersisa 7 hari lagi (28 Juli 2026).',
    date: '2026-07-21T09:00:00Z',
    read: false,
    type: 'schedule_update'
  },
  {
    id: 'notif-2',
    tenderId: 'LPSE-DKI-771029',
    tenderTitle: 'Jasa Konsultansi Pengawasan Revitalisasi Kawasan Monas & Medan Merdeka',
    message: 'Pemenang tender telah diumumkan: PT Virama Karya (Persero) dengan nilai penawaran Rp 3.190.000.000.',
    date: '2026-07-18T14:00:00Z',
    read: true,
    type: 'winner_announced'
  },
  {
    id: 'notif-3',
    tenderId: 'LPSE-SURABAYA-551982',
    tenderTitle: 'Pemeliharaan Berkala Saluran Drainase Utama Wilayah Surabaya Barat',
    message: 'Status tender diperbarui ke Prakualifikasi (Pendaftaran aktif).',
    date: '2026-07-16T10:15:00Z',
    read: true,
    type: 'status_change'
  }
];

export const INITIAL_PYPROC_META: PyprocMeta = {
  version: 'pyproc 0.4.2-lpse4.x',
  githubUrl: 'https://github.com/wakataw/pyproc.git',
  supportedLpseNodes: 680,
  lastSyncTimestamp: new Date().toISOString(),
  syncIntervalHours: 2,
  cachedRecordsCount: INITIAL_TENDERS.length
};
