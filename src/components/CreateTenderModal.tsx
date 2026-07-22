import React, { useState } from 'react';
import {
  X,
  Plus,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  FileText,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  Tag,
  Paperclip,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { TenderCategory, TenderMethod, Tender } from '../types';
import { api, formatFullRupiah } from '../services/api';

interface CreateTenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTenderCreated: (newTender: Tender) => void;
}

export const CreateTenderModal: React.FC<CreateTenderModalProps> = ({
  isOpen,
  onClose,
  onTenderCreated
}) => {
  const [entityType, setEntityType] = useState<'Swasta' | 'BUMN' | 'Pemerintah'>('Swasta');
  const [judul, setJudul] = useState('');
  const [instansi, setInstansi] = useState('');
  const [satuanKerja, setSatuanKerja] = useState('');
  const [kategori, setKategori] = useState<TenderCategory>('Pekerjaan Konstruksi');
  const [metode, setMetode] = useState<TenderMethod>('Tender');
  const [nilaiHPS, setNilaiHPS] = useState<number>(1500000000);
  const [nilaiPagu, setNilaiPagu] = useState<number>(1650000000);
  const [lokasi, setLokasi] = useState('DKI Jakarta');
  const [tanggalBuka, setTanggalBuka] = useState(new Date().toISOString().split('T')[0]);
  const [tanggalTutup, setTanggalTutup] = useState(
    new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [deskripsi, setDeskripsi] = useState('');
  const [qualificationInput, setQualificationInput] = useState('');
  const [syaratKualifikasi, setSyaratKualifikasi] = useState<string[]>([
    'Memiliki NIB & SBU Berlaku',
    'Memiliki NPWP Perusahaan & SPT Tahunan Terakhir',
    'Pengalaman Kerja Sejenis Dalam 3 Tahun Terakhir'
  ]);
  const [docName, setDocName] = useState('');
  const [dokumenList, setDokumenList] = useState<{ id: string; name: string; type: string; size: string; downloadUrl: string }[]>([
    { id: 'doc-1', name: 'RKS_Lelang_Spesifikasi_Teknis.pdf', type: 'PDF', size: '2.5 MB', downloadUrl: '#' },
    { id: 'doc-2', name: 'Rencana_Anggaran_Biaya_BoQ.xlsx', type: 'XLSX', size: '1.1 MB', downloadUrl: '#' }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleAddQualification = () => {
    if (qualificationInput.trim()) {
      setSyaratKualifikasi([...syaratKualifikasi, qualificationInput.trim()]);
      setQualificationInput('');
    }
  };

  const handleRemoveQualification = (index: number) => {
    setSyaratKualifikasi(syaratKualifikasi.filter((_, i) => i !== index));
  };

  const handleAddDoc = () => {
    if (docName.trim()) {
      setDokumenList([
        ...dokumenList,
        {
          id: `doc-${Date.now()}`,
          name: docName.endsWith('.pdf') || docName.endsWith('.docx') ? docName : `${docName}.pdf`,
          type: docName.endsWith('.xlsx') ? 'XLSX' : 'PDF',
          size: '1.8 MB',
          downloadUrl: '#'
        }
      ]);
      setDocName('');
    }
  };

  const handleRemoveDoc = (id: string) => {
    setDokumenList(dokumenList.filter((d) => d.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!judul.trim()) {
      setErrorMessage('Judul lelang / paket pekerjaan wajib diisi.');
      return;
    }
    if (!instansi.trim()) {
      setErrorMessage('Nama perusahaan / instansi penyelenggara wajib diisi.');
      return;
    }
    if (!nilaiHPS || nilaiHPS <= 0) {
      setErrorMessage('Nilai HPS (Owner Estimate) harus lebih dari Rp 0.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.createTender({
        judul,
        instansi,
        satuanKerja: satuanKerja || 'Divisi Procurement & SCM',
        kategori,
        metode,
        tahunAnggaran: new Date().getFullYear(),
        nilaiPagu: nilaiPagu || nilaiHPS,
        nilaiHPS,
        lokasi,
        tanggalBuka,
        tanggalTutup,
        syaratKualifikasi,
        deskripsi,
        dokumen: dokumenList,
        entityType
      });

      setSuccessMessage(res.message);
      setTimeout(() => {
        setIsLoading(false);
        onTenderCreated(res.tender);
        onClose();
      }, 1000);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Gagal mempublikasikan lelang pekerjaan');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-sky-500 shrink-0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-800 shrink-0 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold text-amber-400">
            <Briefcase className="w-3.5 h-3.5" />
            <span>PORTAL PUBLIKASI LELANG SWASTA & BUMN</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Input / Publikasi Lelang Pekerjaan Baru
          </h2>
          <p className="text-xs text-slate-400">
            Publikasikan pengadaan barang/jasa perusahaan Swasta atau BUMN Anda ke jaringan ribuan vendor terverifikasi LPSE Radar.
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          
          {errorMessage && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form id="createTenderForm" onSubmit={handleSubmit} className="space-y-5 text-left">
            
            {/* Entity Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Kategori Entitas Penyelenggara Lelang
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setEntityType('Swasta')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    entityType === 'Swasta'
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-md shadow-sky-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Perusahaan Swasta</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEntityType('BUMN')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    entityType === 'BUMN'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>BUMN / BUMD</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEntityType('Pemerintah')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    entityType === 'Pemerintah'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Instansi LPSE / K/L/D</span>
                </button>
              </div>
            </div>

            {/* Judul Pekerjaan */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Judul Lelang / Paket Pekerjaan <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Pembangunan Gedung Kantor Pusat Cabang & Fasilitas Pendukung"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Nama Perusahaan & Divisi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Nama Perusahaan / Instansi <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={instansi}
                  onChange={(e) => setInstansi(e.target.value)}
                  placeholder={
                    entityType === 'Swasta'
                      ? 'PT Astra International Tbk'
                      : entityType === 'BUMN'
                      ? 'PT Pertamina (Persero)'
                      : 'Kementerian PUPR'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Satuan Kerja / Divisi Procurement
                </label>
                <input
                  type="text"
                  value={satuanKerja}
                  onChange={(e) => setSatuanKerja(e.target.value)}
                  placeholder="Divisi Supply Chain & General Procurement"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Kategori, Metode & Lokasi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Kategori Pekerjaan
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as TenderCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Pekerjaan Konstruksi">Pekerjaan Konstruksi</option>
                  <option value="Pengadaan Barang">Pengadaan Barang</option>
                  <option value="Jasa Konsultansi Badan Usaha">Jasa Konsultansi Badan Usaha</option>
                  <option value="Jasa Lainnya">Jasa Lainnya</option>
                  <option value="Jasa Konsultansi Perorangan">Jasa Konsultansi Perorangan</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Metode Pengadaan
                </label>
                <select
                  value={metode}
                  onChange={(e) => setMetode(e.target.value as TenderMethod)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Tender">Tender Terbuka</option>
                  <option value="Seleksi">Seleksi Terbatas</option>
                  <option value="Pengadaan Langsung">Pengadaan Langsung</option>
                  <option value="E-Purchasing">E-Procurement / Online</option>
                  <option value="Penunjukan Langsung">Penunjukan Langsung</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Lokasi Pekerjaan
                </label>
                <input
                  type="text"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  placeholder="Kota Jakarta Selatan, DKI Jakarta"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Nilai HPS & Pagu */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Nilai HPS / Owner Estimate (Rp) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    step="1000000"
                    value={nilaiHPS}
                    onChange={(e) => setNilaiHPS(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    {formatFullRupiah(nilaiHPS)}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Nilai Pagu Budget (Rp)
                  </label>
                  <input
                    type="number"
                    step="1000000"
                    value={nilaiPagu}
                    onChange={(e) => setNilaiPagu(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-sky-400 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    {formatFullRupiah(nilaiPagu)}
                  </span>
                </div>
              </div>
            </div>

            {/* Jadwal Penawaran */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Tanggal Buka Pendaftaran
                </label>
                <input
                  type="date"
                  value={tanggalBuka}
                  onChange={(e) => setTanggalBuka(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Batas Akhir Penawaran (Tutup)
                </label>
                <input
                  type="date"
                  value={tanggalTutup}
                  onChange={(e) => setTanggalTutup(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Syarat Kualifikasi */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Syarat Kualifikasi & Sertifikasi Vendor
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={qualificationInput}
                  onChange={(e) => setQualificationInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddQualification())}
                  placeholder="Tambahkan syarat (misal: Sertifikat ISO 9001 / SBU Gedung)"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddQualification}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {syaratKualifikasi.map((req, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300"
                  >
                    <Tag className="w-3 h-3 text-emerald-400" />
                    <span>{req}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQualification(idx)}
                      className="text-slate-500 hover:text-rose-400 ml-1 cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Lampiran Dokumen TOR / RKS */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Dokumen RKS / Syarat Teknis / TOR (Lampiran)
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="Nama file dokumen (Contoh: RKS_Teknis_Lengkap.pdf)"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddDoc}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Lampirkan</span>
                </button>
              </div>

              <div className="space-y-1.5 pt-1">
                {dokumenList.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span className="font-medium text-slate-200">{doc.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({doc.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(doc.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Deskripsi Pekerjaan */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Deskripsi Pekerjaan & Informasi Tambahan
              </label>
              <textarea
                rows={3}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Tuliskan gambaran umum lingkup pekerjaan, jadwal aanwijzing, atau catatan spesifik bagi calon kontraktor..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </form>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
          >
            Batal
          </button>

          <button
            type="submit"
            form="createTenderForm"
            disabled={isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Mempublikasikan...</span>
              </>
            ) : (
              <>
                <span>Publikasikan Lelang Pekerjaan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
