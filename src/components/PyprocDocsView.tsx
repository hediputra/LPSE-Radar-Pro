import React, { useState, useEffect } from 'react';
import {
  FileCode2,
  Database,
  Server,
  Layers,
  Cpu,
  ShieldCheck,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Terminal,
  BookOpen,
  ArrowRight,
  GitBranch,
  Globe,
  Play,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export const PyprocDocsView: React.FC = () => {
  const [docData, setDocData] = useState<any>(null);
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  // Interactive pyproc tester state
  const [selectedHost, setSelectedHost] = useState('https://lpse.pu.go.id');
  const [selectedMethod, setSelectedMethod] = useState('get_tender_list');
  const [selectedKode, setSelectedKode] = useState('84920101');
  const [isRunning, setIsRunning] = useState(false);
  const [queryResult, setQueryResult] = useState<any>(null);

  useEffect(() => {
    loadDocs();
    handleRunQuery();
  }, []);

  const loadDocs = async () => {
    try {
      const data = await api.getPyprocDocs();
      setDocData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(text);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const handleRunQuery = async () => {
    setIsRunning(true);
    try {
      const res = await api.runPyprocQuery({
        host: selectedHost,
        method: selectedMethod,
        kodeTender: selectedKode
      });
      setQueryResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-200">
      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5" />
              Blueprint & Integrasi pyproc Real
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              github.com/wakataw/pyproc
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Arsitektur Sistem, Analisis API pyproc & Scraper Interactive Engine
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Dokumentasi lengkap integrasi library Python pyproc (wakataw/pyproc), skema database PostgreSQL/SQLite, scheduler pembaruan data, dan playground eksekusi query pyproc live.
          </p>
        </div>

        <a
          href="https://github.com/wakataw/pyproc.git"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-xl text-xs border border-slate-700 transition-colors shrink-0 cursor-pointer"
        >
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>Repository wakataw/pyproc</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Interactive Live pyproc Query Tester / Playground */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              Interactive pyproc Python Scraper Playground
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulasi eksekusi kode Python pyproc langsung ke node LPSE SPSE 4.x Indonesia
            </p>
          </div>

          <button
            onClick={handleRunQuery}
            disabled={isRunning}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-slate-950" />
            )}
            <span>{isRunning ? 'Jalankan Query...' : 'Eksekusi pyproc'}</span>
          </button>
        </div>

        {/* Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Node Host LPSE / SPSE Inaproc</label>
            <select
              value={selectedHost}
              onChange={(e) => setSelectedHost(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <optgroup label="Kabupaten / Kota di Indonesia (INAPROC SPSE)">
                <option value="https://spse.inaproc.id/lebakkab/lelang">spse.inaproc.id/lebakkab (Kabupaten Lebak)</option>
                <option value="https://lpse.bogorkab.go.id">lpse.bogorkab.go.id (Kabupaten Bogor)</option>
                <option value="https://lpse.badungkab.go.id">lpse.badungkab.go.id (Kabupaten Badung)</option>
                <option value="https://lpse.slemankab.go.id">lpse.slemankab.go.id (Kabupaten Sleman)</option>
                <option value="https://lpse.banyuwangikab.go.id">lpse.banyuwangikab.go.id (Kabupaten Banyuwangi)</option>
                <option value="https://lpse.kukarkab.go.id">lpse.kukarkab.go.id (Kab. Kutai Kartanegara)</option>
                <option value="https://lpse.deliserdangkab.go.id">lpse.deliserdangkab.go.id (Kab. Deli Serdang)</option>
                <option value="https://lpse.jayapurakab.go.id">lpse.jayapurakab.go.id (Kabupaten Jayapura)</option>
                <option value="https://lpse.surabaya.go.id">lpse.surabaya.go.id (Pemkota Surabaya)</option>
                <option value="https://spse.inaproc.id">spse.inaproc.id (Portal Nasional 416 Kabupaten & 98 Kota)</option>
              </optgroup>
              <optgroup label="Kementerian & Lembaga Pusat">
                <option value="https://lpse.pu.go.id">lpse.pu.go.id (Kementerian PUPR)</option>
                <option value="https://lpse.kemkeu.go.id">lpse.kemkeu.go.id (Kementerian Keuangan)</option>
                <option value="https://lpse.kemkes.go.id">lpse.kemkes.go.id (Kementerian Kesehatan)</option>
                <option value="https://lpse.dephub.go.id">lpse.dephub.go.id (Kementerian Perhubungan)</option>
                <option value="https://lpse.jakarta.go.id">lpse.jakarta.go.id (Pemprov DKI Jakarta)</option>
                <option value="https://lpse.pln.co.id">lpse.pln.co.id (PT PLN Persero)</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Fungsi pyproc Method</label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="get_tender_list">Lpse.get_tender_list() - Daftar Tender</option>
              <option value="get_tender_detail">Lpse.get_tender_detail(kode) - Detail Tender</option>
              <option value="get_jadwal">Lpse.get_jadwal(kode) - Tahapan Jadwal</option>
              <option value="get_peserta">Lpse.get_peserta(kode) - Vendor Peserta</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Kode Tender SPSE</label>
            <input
              type="text"
              value={selectedKode}
              onChange={(e) => setSelectedKode(e.target.value)}
              placeholder="Contoh: 84920101"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Console & JSON Output Panel */}
        {queryResult && (
          <div className="space-y-3 pt-2">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  Kode Python Di-Generate:
                </span>
                <span className="text-[10px] text-slate-400">
                  Waktu Eksekusi: {queryResult.executedAt ? new Date(queryResult.executedAt).toLocaleTimeString('id-ID') : '-'}
                </span>
              </div>
              <pre className="text-slate-200 p-2 bg-slate-900 rounded overflow-x-auto text-[11px] leading-relaxed">
                {queryResult.pythonCodeExecuted}
              </pre>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                <span className="text-blue-400 font-bold flex items-center gap-1.5">
                  <Database className="w-4 h-4" />
                  Output pyproc Response JSON:
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                  Status: 200 OK • {queryResult.recordsCount ?? '1'} Record(s)
                </span>
              </div>
              <pre className="text-emerald-300 p-3 bg-slate-900 rounded overflow-x-auto max-h-64 text-[11px] leading-relaxed">
                {JSON.stringify(queryResult.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* 1. Deep Analysis of pyproc API */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          1. Analisis & Spesifikasi API pyproc (LPSE Scraper Engine)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 text-xs block">Sumber Data SPSE</span>
            <p className="text-slate-300 leading-relaxed">
              Mengambil data langsung dari server SPSE (Sistem Pengadaan Secara Elektronik) versi 4.x yang dioperasikan LKPP di 680+ LPSE instansi pusat dan daerah.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-blue-400 text-xs block">Mekanisme Autentikasi</span>
            <p className="text-slate-300 leading-relaxed">
              Daftar tender publik diakses via POST DataTable tanpa login. Detail tender tertentu membutuhkan pengelolaan session cookie (CookieJar).
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-purple-400 text-xs block">Mitigasi Rate Limiting</span>
            <p className="text-slate-300 leading-relaxed">
              Implementasi delay acak, caching local database, dan scheduler periodik tiap 2 jam untuk menghindari pemblokiran IP oleh Cloudflare/WAF SPSE.
            </p>
          </div>
        </div>

        {/* Mapped pyproc Python Functions Table */}
        <div className="pt-2">
          <h3 className="font-bold text-xs text-slate-300 mb-2">Fungsi Utama pyproc Python Library:</h3>
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Fungsi Python pyproc</th>
                  <th className="p-3">Endpoint SPSE Internal</th>
                  <th className="p-3">Struktur Output JSON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="p-3 font-mono text-emerald-400 font-semibold">Lpse.get_tender_list()</td>
                  <td className="p-3 font-mono text-slate-400 text-[11px]">POST /eproc4/dt/tender</td>
                  <td className="p-3">Kode tender, nama paket, instansi, HPS, status lelang</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-emerald-400 font-semibold">Lpse.get_tender_detail()</td>
                  <td className="p-3 font-mono text-slate-400 text-[11px]">GET /eproc4/lelang/{`{id}`}/pengumumanlelang</td>
                  <td className="p-3">Syarat kualifikasi, deskripsi, lokasi, Pagu vs HPS</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-emerald-400 font-semibold">Lpse.get_jadwal()</td>
                  <td className="p-3 font-mono text-slate-400 text-[11px]">GET /eproc4/lelang/{`{id}`}/jadwal</td>
                  <td className="p-3">Tahapan lelang, tanggal mulai & selesai, status aktif</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-emerald-400 font-semibold">Lpse.get_peserta()</td>
                  <td className="p-3 font-mono text-slate-400 text-[11px]">GET /eproc4/lelang/{`{id}`}/peserta</td>
                  <td className="p-3">Daftar vendor peserta, NPWP, harga penawaran</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. System Architecture Blueprint */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <Layers className="w-5 h-5 text-blue-400" />
          2. Blueprint Arsitektur Sistem & Data Flow
        </h2>

        {/* Visual Diagram */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center">
            <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl w-full md:w-48 text-emerald-400 font-bold">
              🌐 LPSE SPSE 4.x Portals
              <span className="block text-[10px] text-slate-400 font-normal mt-1">(PUPR, Kemenkeu, Pemda)</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-500 rotate-90 md:rotate-0" />

            <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl w-full md:w-52 text-blue-400 font-bold">
              🐍 pyproc Scraper Service
              <span className="block text-[10px] text-slate-400 font-normal mt-1">(Python Wrapper & Parser)</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-500 rotate-90 md:rotate-0" />

            <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl w-full md:w-52 text-purple-400 font-bold">
              ⏰ Scheduler (Celery / Cron)
              <span className="block text-[10px] text-slate-400 font-normal mt-1">(Fetch per 2 Jam & Cache)</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-500 rotate-90 md:rotate-0" />

            <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl w-full md:w-48 text-amber-400 font-bold">
              ⚡️ Express & React App
              <span className="block text-[10px] text-slate-400 font-normal mt-1">(REST API & Dashboard)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Database Schema Blueprint */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <Database className="w-5 h-5 text-purple-400" />
          3. Skema Database Relasional (PostgreSQL / SQLite)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Table 1: Tenders */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 block text-sm">Table: tenders</span>
            <div className="text-slate-300 space-y-1 text-[11px]">
              <p><span className="text-amber-400">id</span> VARCHAR(64) PRIMARY KEY</p>
              <p><span className="text-blue-400">kode_tender</span> VARCHAR(32) NOT NULL INDEX</p>
              <p>judul TEXT NOT NULL</p>
              <p>instansi VARCHAR(255) INDEX</p>
              <p>kategori VARCHAR(100) INDEX</p>
              <p>nilai_pagu NUMERIC(18,2)</p>
              <p>nilai_hps NUMERIC(18,2)</p>
              <p>status VARCHAR(50)</p>
              <p>tanggal_tutup TIMESTAMP INDEX</p>
            </div>
          </div>

          {/* Table 2: Schedules */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-purple-400 block text-sm">Table: tender_schedules</span>
            <div className="text-slate-300 space-y-1 text-[11px]">
              <p><span className="text-amber-400">id</span> BIGSERIAL PRIMARY KEY</p>
              <p><span className="text-blue-400">tender_id</span> VARCHAR(64) REFERENCES tenders(id)</p>
              <p>step_name VARCHAR(255)</p>
              <p>start_date TIMESTAMP</p>
              <p>end_date TIMESTAMP</p>
              <p>status VARCHAR(32)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Internal REST API Documentation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <Terminal className="w-5 h-5 text-amber-400" />
          4. Dokumentasi Internal REST API Portal
        </h2>

        <div className="space-y-3 text-xs">
          {[
            {
              method: 'GET',
              path: '/api/tenders',
              desc: 'Mengambil daftar tender ter-paginasi dengan multi-filter (search, instansi, kategori, min/max HPS).',
              query: '?search=jembatan&kategori=Pekerjaan%20Konstruksi&sortBy=hps_desc&page=1'
            },
            {
              method: 'GET',
              path: '/api/tenders/:id',
              desc: 'Mengambil detail lengkap tender, syarat kualifikasi, jadwal lelang, dan berkas dokumen.'
            },
            {
              method: 'POST',
              path: '/api/tenders/:id/track',
              desc: 'Menambahkan / menghapus tender dari daftar pelacakan (watchlist) pengguna.'
            },
            {
              method: 'GET',
              path: '/api/statistics',
              desc: 'Mengambil statistik agregat dashboard (Total HPS, tender ditutup, distribusi kategori).'
            },
            {
              method: 'POST',
              path: '/api/pyproc/run',
              desc: 'Mengeksekusi query scraper pyproc secara interaktif pada portal SPSE.'
            },
            {
              method: 'POST',
              path: '/api/sync',
              desc: 'Memicu sinkronisasi manual data tender dari pyproc secara real-time.'
            },
            {
              method: 'GET',
              path: '/api/export/csv',
              desc: 'Mengunduh berkas daftar tender dalam format CSV.'
            }
          ].map((apiDoc, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono">
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      apiDoc.method === 'GET'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {apiDoc.method}
                  </span>
                  <span className="font-bold text-white text-xs">{apiDoc.path}</span>
                </div>

                <button
                  onClick={() => handleCopy(`${apiDoc.method} ${apiDoc.path}`)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Salin endpoint"
                >
                  {copiedEndpoint === `${apiDoc.method} ${apiDoc.path}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <p className="text-slate-300 text-xs">{apiDoc.desc}</p>
              {apiDoc.query && (
                <p className="text-[11px] font-mono text-slate-400 bg-slate-900 p-1.5 rounded">
                  Parameter Contoh: {apiDoc.query}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Legal & Compliance */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3 text-xs">
        <h2 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          5. Kepatuhan Hukum & Atribusi Data (UU KIP No. 14 / 2008)
        </h2>

        <p className="text-slate-300 leading-relaxed">
          Seluruh data pengadaan barang dan jasa yang ditampilkan oleh portal ini bersumber dari portal resmi Sistem Pengadaan Secara Elektronik (SPSE) Republik Indonesia. Sesuai Undang-Undang No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik (KIP), informasi pengadaan barang/jasa pemerintah merupakan informasi publik yang terbuka secara transparan untuk masyarakat dan dunia usaha.
        </p>
      </div>
    </div>
  );
};
