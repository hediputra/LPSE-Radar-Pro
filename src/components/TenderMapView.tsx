import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Filter,
  Search,
  Building2,
  DollarSign,
  Layers,
  Compass,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Maximize2,
  RotateCcw,
  Info,
  TrendingUp,
  Tag
} from 'lucide-react';
import { Tender } from '../types';
import { formatFullRupiah, formatRupiah, getStatusBadge } from '../services/api';
import { VendorTieringSystem } from './VendorTieringSystem';

interface TenderMapViewProps {
  tenders: Tender[];
  onSelectTender: (tender: Tender) => void;
  selectedLocation: string | null;
  onSelectLocation: (loc: string | null) => void;
}

interface RegionPreset {
  id: string;
  name: string;
  center: [number, number];
  zoom: number;
  countKey: string;
}

const REGION_PRESETS: RegionPreset[] = [
  { id: 'ALL', name: '🇮🇩 Seluruh Indonesia', center: [-2.548926, 118.014863], zoom: 5, countKey: 'all' },
  { id: 'JAVA_BANTEN', name: '🏢 DKI Jakarta, Banten & Jabar', center: [-6.5, 107.0], zoom: 8, countKey: 'jawa_barat' },
  { id: 'JAVA_CENTRAL_EAST', name: '🌋 Jateng, DIY & Jawa Timur', center: [-7.5, 111.0], zoom: 8, countKey: 'jawa_timur' },
  { id: 'SUMATRA', name: '🌴 Pulau Sumatra', center: [0.5, 101.5], zoom: 6, countKey: 'sumatra' },
  { id: 'KALIMANTAN', name: '🌲 Kalimantan (IKN)', center: [-1.0, 114.0], zoom: 6, countKey: 'kalimantan' },
  { id: 'SULAWESI', name: '🌊 Pulau Sulawesi', center: [-2.5, 120.5], zoom: 6, countKey: 'sulawesi' },
  { id: 'BALI_NUSA_PAPUA', name: '🏝️ Bali, NTB, NTT & Papua', center: [-4.0, 130.0], zoom: 5, countKey: 'timur' }
];

// Helper to determine coordinates from tender location / instansi
function getTenderCoordinates(tender: Tender): [number, number] {
  const text = `${tender.lokasi} ${tender.instansi} ${tender.satuanKerja} ${tender.judul}`.toLowerCase();

  if (text.includes('jakarta') || text.includes('lkpp') || text.includes('kementerian')) return [-6.2088 + (Math.random() - 0.5) * 0.15, 106.8456 + (Math.random() - 0.5) * 0.15];
  if (text.includes('lebak') || text.includes('banten') || text.includes('serang')) return [-6.5500 + (Math.random() - 0.5) * 0.1, 106.2500 + (Math.random() - 0.5) * 0.1];
  if (text.includes('bandung') || text.includes('jawabarat') || text.includes('jabar') || text.includes('bogor') || text.includes('bekasi')) return [-6.9175 + (Math.random() - 0.5) * 0.2, 107.6191 + (Math.random() - 0.5) * 0.2];
  if (text.includes('surabaya') || text.includes('jawatimur') || text.includes('jatim') || text.includes('malang')) return [-7.2575 + (Math.random() - 0.5) * 0.2, 112.7521 + (Math.random() - 0.5) * 0.2];
  if (text.includes('semarang') || text.includes('jawatengah') || text.includes('jateng') || text.includes('solo') || text.includes('yogyakarta')) return [-6.9667 + (Math.random() - 0.5) * 0.2, 110.4167 + (Math.random() - 0.5) * 0.2];
  if (text.includes('medan') || text.includes('sumut') || text.includes('aceh')) return [3.5952 + (Math.random() - 0.5) * 0.2, 98.6722 + (Math.random() - 0.5) * 0.2];
  if (text.includes('palembang') || text.includes('sumsel') || text.includes('lampung') || text.includes('padang')) return [-2.9761 + (Math.random() - 0.5) * 0.2, 104.7754 + (Math.random() - 0.5) * 0.2];
  if (text.includes('pekanbaru') || text.includes('riau') || text.includes('batam')) return [0.5071 + (Math.random() - 0.5) * 0.2, 101.4478 + (Math.random() - 0.5) * 0.2];
  if (text.includes('balikpapan') || text.includes('samarinda') || text.includes('kaltim') || text.includes('ikn') || text.includes('penajam')) return [-1.2379 + (Math.random() - 0.5) * 0.2, 116.8529 + (Math.random() - 0.5) * 0.2];
  if (text.includes('pontianak') || text.includes('kalbar')) return [-0.0263 + (Math.random() - 0.5) * 0.2, 109.3425 + (Math.random() - 0.5) * 0.2];
  if (text.includes('banjarmasin') || text.includes('kalsel') || text.includes('palangkaraya')) return [-3.3194 + (Math.random() - 0.5) * 0.2, 114.5908 + (Math.random() - 0.5) * 0.2];
  if (text.includes('makassar') || text.includes('sulsel') || text.includes('palu')) return [-5.1477 + (Math.random() - 0.5) * 0.2, 119.4327 + (Math.random() - 0.5) * 0.2];
  if (text.includes('manado') || text.includes('sulut') || text.includes('gorontalo')) return [1.4748 + (Math.random() - 0.5) * 0.2, 124.8428 + (Math.random() - 0.5) * 0.2];
  if (text.includes('denpasar') || text.includes('bali')) return [-8.6705 + (Math.random() - 0.5) * 0.1, 115.2126 + (Math.random() - 0.5) * 0.1];
  if (text.includes('mataram') || text.includes('ntb') || text.includes('lombok')) return [-8.5833 + (Math.random() - 0.5) * 0.1, 116.1167 + (Math.random() - 0.5) * 0.1];
  if (text.includes('kupang') || text.includes('ntt')) return [-10.1772 + (Math.random() - 0.5) * 0.2, 123.6070 + (Math.random() - 0.5) * 0.2];
  if (text.includes('jayapura') || text.includes('papua') || text.includes('sorong')) return [-2.5489 + (Math.random() - 0.5) * 0.3, 140.7181 + (Math.random() - 0.5) * 0.3];
  if (text.includes('ambon') || text.includes('maluku')) return [-3.6954 + (Math.random() - 0.5) * 0.2, 128.1814 + (Math.random() - 0.5) * 0.2];

  // Hash seed fallback across Indonesia landmass
  let hash = 0;
  for (let i = 0; i < tender.id.length; i++) {
    hash = (hash << 5) - hash + tender.id.charCodeAt(i);
  }
  const lat = -7.5 + ((Math.abs(hash) % 120) / 10 - 6);
  const lng = 106.0 + ((Math.abs(hash >> 2) % 320) / 10);
  return [lat, lng];
}

// Marker styling according to tender category
function getCategoryColor(category: string): { bg: string; border: string; text: string; hex: string } {
  switch (category) {
    case 'Pekerjaan Konstruksi':
      return { bg: 'bg-amber-500', border: 'border-amber-300', text: 'text-amber-300', hex: '#f59e0b' };
    case 'Pengadaan Barang':
      return { bg: 'bg-emerald-500', border: 'border-emerald-300', text: 'text-emerald-300', hex: '#10b981' };
    case 'Jasa Konsultansi Badan Usaha':
    case 'Jasa Konsultansi Perorangan':
      return { bg: 'bg-sky-500', border: 'border-sky-300', text: 'text-sky-300', hex: '#0284c7' };
    default:
      return { bg: 'bg-purple-500', border: 'border-purple-300', text: 'text-purple-300', hex: '#a855f7' };
  }
}

export const TenderMapView: React.FC<TenderMapViewProps> = ({
  tenders,
  onSelectTender,
  selectedLocation,
  onSelectLocation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [paguRange, setPaguRange] = useState<string>('ALL');
  const [activeTenderId, setActiveTenderId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Filtered tenders calculation
  const filteredTenders = useMemo(() => {
    return tenders.filter((t) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.judul.toLowerCase().includes(q);
        const matchCode = t.kodeTender.includes(q);
        const matchInstansi = t.instansi.toLowerCase().includes(q);
        const matchLocation = t.lokasi.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchInstansi && !matchLocation) return false;
      }

      // Category
      if (selectedCategory !== 'ALL' && t.kategori !== selectedCategory) {
        return false;
      }

      // Pagu range
      if (paguRange === 'UNDER_1B' && t.nilaiPagu >= 1_000_000_000) return false;
      if (paguRange === '1B_10B' && (t.nilaiPagu < 1_000_000_000 || t.nilaiPagu > 10_000_000_000)) return false;
      if (paguRange === '10B_50B' && (t.nilaiPagu < 10_000_000_000 || t.nilaiPagu > 50_000_000_000)) return false;
      if (paguRange === 'OVER_50B' && t.nilaiPagu <= 50_000_000_000) return false;

      // Region preset
      if (selectedRegion !== 'ALL') {
        const loc = `${t.lokasi} ${t.instansi}`.toLowerCase();
        if (selectedRegion === 'JAVA_BANTEN' && !loc.includes('jakarta') && !loc.includes('banten') && !loc.includes('lebak') && !loc.includes('bandung') && !loc.includes('jawa barat') && !loc.includes('bogor') && !loc.includes('lkpp')) return false;
        if (selectedRegion === 'JAVA_CENTRAL_EAST' && !loc.includes('semarang') && !loc.includes('surabaya') && !loc.includes('jawa tengah') && !loc.includes('jawa timur') && !loc.includes('yogyakarta') && !loc.includes('jateng') && !loc.includes('jatim')) return false;
        if (selectedRegion === 'SUMATRA' && !loc.includes('medan') && !loc.includes('sumatra') && !loc.includes('palembang') && !loc.includes('riau') && !loc.includes('aceh') && !loc.includes('lampung')) return false;
        if (selectedRegion === 'KALIMANTAN' && !loc.includes('kalimantan') && !loc.includes('balikpapan') && !loc.includes('samarinda') && !loc.includes('pontianak') && !loc.includes('ikn')) return false;
        if (selectedRegion === 'SULAWESI' && !loc.includes('sulawesi') && !loc.includes('makassar') && !loc.includes('manado') && !loc.includes('palu')) return false;
        if (selectedRegion === 'BALI_NUSA_PAPUA' && !loc.includes('bali') && !loc.includes('papua') && !loc.includes('ntb') && !loc.includes('ntt') && !loc.includes('jayapura') && !loc.includes('ambon')) return false;
      }

      return true;
    });
  }, [tenders, searchQuery, selectedCategory, paguRange, selectedRegion]);

  // Total Pagu of mapped tenders
  const totalMappedPagu = useMemo(() => {
    return filteredTenders.reduce((acc, curr) => acc + curr.nilaiPagu, 0);
  }, [filteredTenders]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-2.548926, 118.014863],
        zoom: 5,
        zoomControl: false,
        attributionControl: false
      });

      // Dark theme map tiles from CartoDB
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Add zoom control topright
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Markers on Map whenever filteredTenders change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => (m as L.Marker).remove());
    markersRef.current = {};

    filteredTenders.forEach((tender) => {
      const coords = getTenderCoordinates(tender);
      const categoryStyle = getCategoryColor(tender.kategori);

      // Custom divIcon marker
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="relative group cursor-pointer">
            <div class="w-7 h-7 rounded-full ${categoryStyle.bg} border-2 ${categoryStyle.border} shadow-lg flex items-center justify-center text-slate-950 font-black text-[10px] transform transition-transform group-hover:scale-125">
              ${tender.kodeTender.slice(-2)}
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 ${categoryStyle.bg} rotate-45"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
      });

      const marker = L.marker(coords, { icon: customIcon }).addTo(map);

      // Popup Content
      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 bg-slate-900 text-slate-100 rounded-xl border border-slate-700 shadow-2xl max-w-xs space-y-2';
      popupContent.innerHTML = `
        <div class="space-y-1">
          <div class="flex items-center justify-between text-[10px]">
            <span class="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono font-bold">SPSE #${tender.kodeTender}</span>
            <span class="font-semibold ${categoryStyle.text}">${tender.kategori}</span>
          </div>
          <h4 class="font-bold text-white text-xs leading-snug hover:text-sky-300 transition-colors">${tender.judul}</h4>
          <p class="text-[11px] text-slate-400 font-medium">${tender.instansi}</p>
        </div>

        <div class="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
          <div class="flex justify-between items-center text-[11px]">
            <span class="text-slate-400">Nilai Pagu:</span>
            <span class="font-extrabold text-emerald-400 font-mono">${formatRupiah(tender.nilaiPagu)}</span>
          </div>
          <div class="flex justify-between items-center text-[11px]">
            <span class="text-slate-400">Lokasi Node:</span>
            <span class="font-semibold text-slate-300 truncate max-w-[140px]">${tender.lokasi}</span>
          </div>
        </div>

        <button
          id="btn-popup-view-${tender.id}"
          class="w-full py-1.5 px-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-md"
        >
          <span>Lihat Detail & Analisis SPSE</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      `;

      marker.bindPopup(popupContent, { maxWidth: 300 });

      // Click listener on popup button
      marker.on('popupopen', () => {
        setActiveTenderId(tender.id);
        const btn = document.getElementById(`btn-popup-view-${tender.id}`);
        if (btn) {
          btn.onclick = () => onSelectTender(tender);
        }
      });

      markersRef.current[tender.id] = marker;
    });
  }, [filteredTenders, onSelectTender]);

  // Change Map View when Region Preset is selected
  const handleSelectRegion = (preset: RegionPreset) => {
    setSelectedRegion(preset.id);
    if (mapRef.current) {
      mapRef.current.flyTo(preset.center, preset.zoom, { duration: 1.2 });
    }
  };

  // Focus specific tender on map
  const handleFocusTenderOnMap = (tender: Tender) => {
    setActiveTenderId(tender.id);
    const coords = getTenderCoordinates(tender);
    if (mapRef.current) {
      mapRef.current.flyTo(coords, 11, { duration: 1 });
      const marker = markersRef.current[tender.id];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedRegion('ALL');
    setSearchQuery('');
    setSelectedCategory('ALL');
    setPaguRange('ALL');
    if (mapRef.current) {
      mapRef.current.flyTo([-2.548926, 118.014863], 5, { duration: 1 });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] min-h-[600px] bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* Top Filter Bar */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 shrink-0 z-20 shadow-lg">
        {/* Region Presets Slider / Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 max-w-full">
          <span className="text-xs font-extrabold text-slate-400 flex items-center gap-1 shrink-0 pr-1">
            <Compass className="w-4 h-4 text-emerald-400" />
            Wilayah:
          </span>

          {REGION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectRegion(preset)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border flex items-center gap-1.5 ${
                selectedRegion === preset.id
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-extrabold scale-105'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border-slate-700'
              }`}
            >
              <span>{preset.name}</span>
            </button>
          ))}
        </div>

        {/* Category & Pagu Filters */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer font-medium"
          >
            <option value="ALL">📦 Semua Kategori</option>
            <option value="Pekerjaan Konstruksi">🏗️ Pekerjaan Konstruksi</option>
            <option value="Pengadaan Barang">🚚 Pengadaan Barang</option>
            <option value="Jasa Konsultansi Badan Usaha">💼 Jasa Konsultansi</option>
            <option value="Jasa Lainnya">🛠️ Jasa Lainnya</option>
          </select>

          {/* Pagu Range */}
          <select
            value={paguRange}
            onChange={(e) => setPaguRange(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer font-medium"
          >
            <option value="ALL">💰 Semua Nilai Pagu</option>
            <option value="UNDER_1B">&lt; Rp 1 Miliar</option>
            <option value="1B_10B">Rp 1 M - Rp 10 M</option>
            <option value="10B_50B">Rp 10 M - Rp 50 M</option>
            <option value="OVER_50B">&gt; Rp 50 Miliar (Mega Proyek)</option>
          </select>

          {/* Reset button */}
          <button
            onClick={handleResetFilters}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
            title="Reset Filter Peta"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Map View Area */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Leaflet Container */}
        <div ref={mapContainerRef} className="w-full h-full z-0 bg-slate-950" />

        {/* Map Floating Summary Badge (Top Left) */}
        <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 shadow-2xl space-y-1.5 max-w-xs pointer-events-auto">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Intelijen Peta SPSE Indonesia
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
              LIVE GEOLOCATION
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{filteredTenders.length}</span>
            <span className="text-xs text-slate-300 font-semibold">Tender Aktif Terpetakan</span>
          </div>

          <div className="text-[11px] text-emerald-400 font-bold font-mono pt-1 border-t border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-normal">Total Pagu Wilayah:</span>
            <span>{formatFullRupiah(totalMappedPagu)}</span>
          </div>
        </div>

        {/* Map Legend (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 shadow-2xl hidden sm:block pointer-events-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Legenda Marker Kategori:
          </span>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span className="text-slate-300">Konstruksi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-slate-300">Pengadaan Barang</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
              <span className="text-slate-300">Konsultansi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
              <span className="text-slate-300">Jasa Lainnya</span>
            </div>
          </div>
        </div>

        {/* Collapsible Side Panel - Active Tenders List on Map */}
        <div
          className={`absolute top-0 right-0 bottom-0 z-10 bg-slate-900/95 backdrop-blur-md border-l border-slate-800 transition-all duration-300 flex flex-col shadow-2xl ${
            isSidebarOpen ? 'w-80 sm:w-96' : 'w-10'
          }`}
        >
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -left-3 top-4 z-20 w-6 h-10 bg-slate-800 border border-slate-700 text-slate-300 rounded-l-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer shadow-md"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${isSidebarOpen ? '' : 'rotate-180'}`} />
          </button>

          {isSidebarOpen && (
            <div className="flex flex-col h-full overflow-hidden p-3 space-y-3">
              {/* Sidebar Header & Search */}
              <div className="space-y-2 shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    Daftar Tender Terpilih ({filteredTenders.length})
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Klik untuk Lokasi</span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter nama, kode, instansi..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Tender Cards Scroll Area */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                {filteredTenders.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 space-y-2">
                    <Info className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="font-semibold text-xs">Tidak ada tender sesuai filter di wilayah ini.</p>
                    <button
                      onClick={handleResetFilters}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Reset Filter Peta
                    </button>
                  </div>
                ) : (
                  filteredTenders.map((tender) => {
                    const isActive = activeTenderId === tender.id;
                    const catStyle = getCategoryColor(tender.kategori);

                    return (
                      <div
                        key={tender.id}
                        onClick={() => handleFocusTenderOnMap(tender)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                          isActive
                            ? 'bg-sky-950/80 border-sky-400 shadow-lg ring-1 ring-sky-400/50'
                            : 'bg-slate-950/80 hover:bg-slate-800/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-[10px] font-bold">
                            #{tender.kodeTender}
                          </span>
                          <span className={`text-[10px] font-bold ${catStyle.text}`}>
                            {tender.kategori}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-white text-xs leading-snug line-clamp-2">
                          {tender.judul}
                        </h4>

                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-900">
                          <span className="text-slate-400 truncate max-w-[150px]">{tender.instansi}</span>
                          <span className="font-black text-emerald-400 font-mono">
                            {formatRupiah(tender.nilaiPagu)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          {tender.pemenang ? (
                            <VendorTieringSystem
                              vendor={{
                                vendorName: tender.pemenang.name,
                                npwp: tender.pemenang.npwp
                              }}
                              compact
                              size="sm"
                            />
                          ) : (
                            <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                              <Tag className="w-3 h-3" /> Status: {tender.status.replace('_', ' ')}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTender(tender);
                            }}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded-lg transition-colors flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Detail</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
