import React, { useState } from 'react';
import {
  MapPin,
  Globe,
  Navigation,
  X,
  Search,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Building2,
  Layers,
  Sparkles,
  Compass
} from 'lucide-react';
import { PROVINCES_DATA, FEATURED_LPSE_NODES, getLpseNodeForRegion, LpseNode } from '../data/indonesiaNodes';
import { api } from '../services/api';

interface LocationNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: string | null;
  onSelectLocation: (locationName: string | null) => void;
}

export const LocationNodeModal: React.FC<LocationNodeModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [isDetectingIp, setIsDetectingIp] = useState(false);
  const [detectedIpInfo, setDetectedIpInfo] = useState<any>(null);

  if (!isOpen) return null;

  const handleAutoDetectIp = async () => {
    setIsDetectingIp(true);
    try {
      const data = await api.detectIpLocation();
      setDetectedIpInfo(data);
      if (data.detectedLocation) {
        onSelectLocation(data.detectedLocation);
      }
    } catch (err) {
      console.error('IP Detection error', err);
    } finally {
      setIsDetectingIp(false);
    }
  };

  const handleSelectNode = (nodeName: string | null) => {
    onSelectLocation(nodeName);
    onClose();
  };

  // Filter regencies across provinces
  const filteredProvinces = PROVINCES_DATA.filter((prov) => {
    if (selectedProvince !== 'ALL' && prov.name !== selectedProvince) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      prov.name.toLowerCase().includes(term) ||
      prov.regencies.some((r) => r.toLowerCase().includes(term))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Pilih Lokasi & LPSE Node Pengadaan
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  416 Kab • 98 Kota • 38 Provinsi
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Gunakan Deteksi IP Otomatis atau pilih Kabupaten/Kota untuk memfilter tender SPSE lokasi Anda.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* IP Auto Detect Banner */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Navigation className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                Deteksi Lokasi Berdasarkan IP Address
                {detectedIpInfo && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    IP: {detectedIpInfo.ip} • {detectedIpInfo.city}, {detectedIpInfo.regionName}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Sistem akan secara otomatis mengenali wilayah Kabupaten/Kota lokasi koneksi internet Anda.
              </p>
            </div>
          </div>

          <button
            onClick={handleAutoDetectIp}
            disabled={isDetectingIp}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isDetectingIp ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            <span>{isDetectingIp ? 'Mendeteksi IP...' : '📍 Deteksi Lokasi Saya Sekarang'}</span>
          </button>
        </div>

        {/* Search & Province Filters */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari Kabupaten / Kota (contoh: Lebak, Bogor, Badung, Sleman, Surabaya)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">Semua Provinsi (38 Provinsi)</option>
              {PROVINCES_DATA.map((prov) => (
                <option key={prov.name} value={prov.name}>
                  {prov.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          
          {/* Quick Active Location Badge */}
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Filter Lokasi Terpasang:</span>
              <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {selectedLocation || 'Semua Lokasi Indonesia (Nasional)'}
              </span>
            </div>

            {selectedLocation && (
              <button
                onClick={() => handleSelectNode(null)}
                className="text-slate-400 hover:text-rose-400 text-[11px] underline cursor-pointer"
              >
                Reset Filter Lokasi
              </button>
            )}
          </div>

          {/* Featured Nodes Grid */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              LPSE Nodes Terpopuler & Kabupaten Utama:
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              <button
                onClick={() => handleSelectNode(null)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedLocation === null
                    ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="text-xs font-bold">Semua Lokasi</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Seluruh Indonesia</div>
              </button>

              {FEATURED_LPSE_NODES.map((node) => {
                const isSelected = selectedLocation?.toLowerCase().includes(node.name.toLowerCase().replace('kabupaten ', ''));
                return (
                  <button
                    key={node.id}
                    onClick={() => handleSelectNode(node.name)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold shadow-md'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate pr-1">{node.name}</span>
                      <a
                        href={node.spseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-slate-500 hover:text-emerald-400 transition-colors"
                        title={`Buka portal SPSE Inaproc ${node.name}`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                      <span>{node.province}</span>
                      <span className="text-emerald-400 font-mono font-semibold">
                        ~{node.activeTendersEstimate} Paket
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* All Provinces & Regencies List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              Daftar Seluruh Kabupaten & Kota per Provinsi (SPSE INAPROC Portal):
            </h3>

            {filteredProvinces.map((prov) => (
              <div key={prov.name} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    Provinsi {prov.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {prov.regencies.length} Kab/Kota
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  {prov.regencies.map((regency) => {
                    const nodeInfo = getLpseNodeForRegion(regency, prov.name);
                    const isSelected = selectedLocation?.toLowerCase().includes(regency.toLowerCase().replace('kabupaten ', '').replace('kota ', ''));

                    return (
                      <div
                        key={regency}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <button
                          onClick={() => handleSelectNode(regency)}
                          className="hover:text-emerald-400 cursor-pointer"
                        >
                          {regency}
                        </button>

                        <a
                          href={nodeInfo.spseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-emerald-400 transition-colors ml-1"
                          title={`Buka SPSE Inaproc (${nodeInfo.spseUrl})`}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Mematuhi UU KIP No. 14/2008 & Sistem Informasi Pengadaan Barang/Jasa LKPP.</span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Tutup Window
          </button>
        </div>

      </div>
    </div>
  );
};
