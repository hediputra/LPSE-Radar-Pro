# LPSE Radar PRO - Portal Tender Pengadaan Barang & Jasa Indonesia (pyproc Integrator)

LPSE Radar PRO adalah portal web intelijen, pemantauan, dan analisis data tender pengadaan barang/jasa pemerintah Indonesia yang terintegrasi dengan API/library Python **pyproc** ([github.com/wakataw/pyproc.git](https://github.com/wakataw/pyproc.git)).

---

## 1. Analisis & Pemahaman API pyproc

### A. Sumber Data API
- **SPSE (Sistem Pengadaan Secara Elektronik) v4.x**: Mengagregasi data dari >680 node LPSE di seluruh Indonesia (Kementerian PUPR, Kemenkeu, Kemenkes, Pemprov DKI Jakarta, Pemkot Surabaya, Pemda Bali, PT PLN, PT Telkom, dsb).
- **Format Data**: JSON & HTML DataTable parsing.

### B. Jenis Data Tersedia
- **Daftar Tender (`Lpse.get_tender_list()`)**: Kode tender, nama pengadaan, instansi, HPS, lokasi, status.
- **Detail Tender (`Lpse.get_tender_detail()`)**: Syarat kualifikasi, deskripsi, nilai Pagu vs HPS, Pokja.
- **Jadwal Tahapan (`Lpse.get_jadwal()`)**: Tanggal Aanwijzing, upload penawaran, evaluasi, dan pengumuman pemenang.
- **Peserta & Pemenang (`Lpse.get_peserta()`, `Lpse.get_pemenang()`)**: Nama vendor, NPWP, harga penawaran terkoreksi, dan status pemenang.

### C. Batasan API & Strategi Mitigasi
- **Rate Limiting & Cloudflare**: LPSE menerapkan rate-limit ketat. Sistem mengimplementasikan *background job scheduler* (tiap 2 jam) dengan *caching layer* lokal agar portal web dapat merespons kueri dengan kecepatan tinggi (&lt;50ms).

---

## 2. Arsitektur & Teknologi

- **Backend**: Node.js + Express (TypeScript) / Python Flask.
- **Scheduler**: Interval background job simulator yang mengeksekusi sinkronisasi periodik ke node LPSE.
- **Database**: PostgreSQL / SQLite (Tabel `tenders`, `schedules`, `participants`, `watchlists`).
- **Frontend**: React 19 + Tailwind CSS v4 + Recharts + Lucide Icons.

---

## 3. Fitur Utama App

1. **Dashboard Utama**: KPI total tender, total HPS, tender segera ditutup, grafik distribusi HPS per kategori, dan visualisasi instansi pemilik anggaran terbesar.
2. **Pencarian & Multi-Filter**: Pencarian teks bebas, filter instansi, kategori, metode lelang, status tahapan, range HPS, dan sorting.
3. **Detail Tender Interactive Modal**: Tahapan lelang stepper, checklist kualifikasi, berkas dokumen pengadaan (RAB/RKS), dan daftar vendor pemenang.
4. **Watchlist & Pusat Notifikasi**: Pengguna dapat "Lacak Tender" dan menerima notifikasi email & in-app ketika ada perubahan jadwal / pemenang.
5. **Analisis Tren & Peringkat Vendor**: Grafik tren bulanan dan papan peringkat vendor (*leaderboard*) pemenang tender terbesar di Indonesia.
6. **Ekspor Data CSV**: Mengunduh daftar tender hasil filter dalam format `.csv`.

---

## 4. Panduan Cara Menjalankan Proyek (Local Setup & Deployment)

### Menjalankan di Lokal

1. **Clone Repository**:
   ```bash
   git clone https://github.com/user/lpse-radar-portal.git
   cd lpse-radar-portal
   ```

2. **Install Dependensi**:
   ```bash
   npm install
   ```

3. **Pengaturan Environment Variables**:
   Salin `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Jalankan Dev Server**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

5. **Build Produksi & Start**:
   ```bash
   npm run build
   npm start
   ```

---

## 5. Kepatuhan Hukum & UU KIP

Penggunaan data pada portal ini mengacu pada **UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik (KIP)** di mana data pengadaan barang dan jasa pemerintah merupakan informasi terbuka untuk publik. Portal ini menggunakan data secara etis, mematuhi batas wajar akses, dan memberikan atribusi penuh kepada portal SPSE LPSE Republik Indonesia.
