export interface LpseNode {
  id: string;
  name: string; // e.g. "Kabupaten Lebak"
  code: string; // e.g. "lebakkab"
  province: string; // e.g. "Banten"
  type: 'kabupaten' | 'kota' | 'provinsi' | 'kementerian' | 'bumn';
  spseUrl: string; // e.g. "https://spse.inaproc.id/lebakkab/lelang"
  lpseUrl: string; // e.g. "https://lpse.lebakkab.go.id"
  activeTendersEstimate?: number;
}

export interface ProvinceData {
  name: string;
  regencies: string[]; // List of Kabupaten & Kota names
}

export const PROVINCES_DATA: ProvinceData[] = [
  {
    name: 'Banten',
    regencies: ['Kabupaten Lebak', 'Kabupaten Pandeglang', 'Kabupaten Serang', 'Kabupaten Tangerang', 'Kota Serang', 'Kota Cilegon', 'Kota Tangerang', 'Kota Tangerang Selatan']
  },
  {
    name: 'Jawa Barat',
    regencies: ['Kabupaten Bogor', 'Kabupaten Sukabumi', 'Kabupaten Cianjur', 'Kabupaten Bandung', 'Kabupaten Garut', 'Kabupaten Tasikmalaya', 'Kabupaten Ciamis', 'Kabupaten Kuningan', 'Kabupaten Cirebon', 'Kabupaten Majalengka', 'Kabupaten Sumedang', 'Kabupaten Indramayu', 'Kabupaten Subang', 'Kabupaten Purwakarta', 'Kabupaten Karawang', 'Kabupaten Bekasi', 'Kabupaten Bandung Barat', 'Kabupaten Pangandaran', 'Kota Bandung', 'Kota Bogor', 'Kota Depok', 'Kota Bekasi', 'Kota Cimahi', 'Kota Tasikmalaya', 'Kota Cirebon', 'Kota Banjar', 'Kota Sukabumi']
  },
  {
    name: 'DKI Jakarta',
    regencies: ['Pemprov DKI Jakarta', 'Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur', 'Kepulauan Seribu']
  },
  {
    name: 'Jawa Tengah',
    regencies: ['Kabupaten Cilacap', 'Kabupaten Banyumas', 'Kabupaten Purbalingga', 'Kabupaten Banjarnegara', 'Kabupaten Kebumen', 'Kabupaten Purworejo', 'Kabupaten Wonosobo', 'Kabupaten Magelang', 'Kabupaten Boyolali', 'Kabupaten Klaten', 'Kabupaten Sukoharjo', 'Kabupaten Wonogiri', 'Kabupaten Karanganyar', 'Kabupaten Sragen', 'Kabupaten Grobogan', 'Kabupaten Blora', 'Kabupaten Rembang', 'Kabupaten Pati', 'Kabupaten Kudus', 'Kabupaten Jepara', 'Kabupaten Demak', 'Kabupaten Semarang', 'Kabupaten Temanggung', 'Kabupaten Kendal', 'Kabupaten Batang', 'Kabupaten Pekalongan', 'Kabupaten Pemalang', 'Kabupaten Tegal', 'Kabupaten Brebes', 'Kota Semarang', 'Kota Surakarta', 'Kota Magelang', 'Kota Pekalongan', 'Kota Salatiga', 'Kota Tegal']
  },
  {
    name: 'D.I. Yogyakarta',
    regencies: ['Kabupaten Sleman', 'Kabupaten Bantul', 'Kabupaten Gunungkidul', 'Kabupaten Kulon Progo', 'Kota Yogyakarta']
  },
  {
    name: 'Jawa Timur',
    regencies: ['Kabupaten Banyuwangi', 'Kabupaten Pacitan', 'Kabupaten Ponorogo', 'Kabupaten Trenggalek', 'Kabupaten Tulungagung', 'Kabupaten Blitar', 'Kabupaten Kediri', 'Kabupaten Malang', 'Kabupaten Lumajang', 'Kabupaten Jember', 'Kabupaten Bondowoso', 'Kabupaten Situbondo', 'Kabupaten Probolinggo', 'Kabupaten Pasuruan', 'Kabupaten Sidoarjo', 'Kabupaten Mojokerto', 'Kabupaten Jombang', 'Kabupaten Nganjuk', 'Kabupaten Madiun', 'Kabupaten Magetan', 'Kabupaten Ngawi', 'Kabupaten Bojonegoro', 'Kabupaten Tuban', 'Kabupaten Lamongan', 'Kabupaten Gresik', 'Kabupaten Bangkalan', 'Kabupaten Sampang', 'Kabupaten Pamekasan', 'Kabupaten Sumenep', 'Kota Surabaya', 'Kota Malang', 'Kota Madiun', 'Kota Kediri', 'Kota Mojokerto', 'Kota Blitar', 'Kota Pasuruan', 'Kota Probolinggo', 'Kota Batu']
  },
  {
    name: 'Bali',
    regencies: ['Kabupaten Badung', 'Kabupaten Buleleng', 'Kabupaten Tabanan', 'Kabupaten Gianyar', 'Kabupaten Klungkung', 'Kabupaten Bangli', 'Kabupaten Karangasem', 'Kabupaten Jembrana', 'Kota Denpasar']
  },
  {
    name: 'Sumatera Utara',
    regencies: ['Kabupaten Deli Serdang', 'Kabupaten Asahan', 'Kabupaten Batubara', 'Kabupaten Dairi', 'Kabupaten Humbang Hasundutan', 'Kabupaten Karo', 'Kabupaten Labuhanbatu', 'Kabupaten Langkat', 'Kabupaten Mandailing Natal', 'Kabupaten Nias', 'Kabupaten Simalungun', 'Kabupaten Tapanuli Utara', 'Kabupaten Toba', 'Kota Medan', 'Kota Binjai', 'Kota Pematangsiantar', 'Kota Tebing Tinggi', 'Kota Padang Sidempuan']
  },
  {
    name: 'Kalimantan Timur',
    regencies: ['Kabupaten Kutai Kartanegara', 'Kabupaten Berau', 'Kabupaten Kutai Barat', 'Kabupaten Kutai Timur', 'Kabupaten Paser', 'Kabupaten Penajam Paser Utara', 'Kabupaten Mahakam Ulu', 'Kota Samarinda', 'Kota Balikpapan', 'Kota Bontang']
  },
  {
    name: 'Papua',
    regencies: ['Kabupaten Jayapura', 'Kabupaten Biak Numfor', 'Kabupaten Keerom', 'Kabupaten Kepulauan Yapen', 'Kabupaten Sarmi', 'Kabupaten Supiori', 'Kabupaten Waropen', 'Kota Jayapura']
  },
  {
    name: 'Sumatera Barat',
    regencies: ['Kabupaten Agam', 'Kabupaten Dharmasraya', 'Kabupaten Kepulauan Mentawai', 'Kabupaten Lima Puluh Kota', 'Kabupaten Padang Pariaman', 'Kabupaten Pasaman', 'Kabupaten Pesisir Selatan', 'Kabupaten Sijunjung', 'Kabupaten Solok', 'Kabupaten Tanah Datar', 'Kota Padang', 'Kota Bukittinggi', 'Kota Payakumbuh', 'Kota Solok']
  },
  {
    name: 'Riau & Kepulauan Riau',
    regencies: ['Kabupaten Kampar', 'Kabupaten Bengkalis', 'Kabupaten Indragiri Hilir', 'Kabupaten Pelalawan', 'Kabupaten Rokan Hilir', 'Kabupaten Siak', 'Kota Pekanbaru', 'Kota Dumai', 'Kota Batam', 'Kota Tanjungpinang', 'Kabupaten Bintan', 'Kabupaten Karimun']
  },
  {
    name: 'South / Central / West Sulawesi',
    regencies: ['Kabupaten Gowa', 'Kabupaten Bone', 'Kabupaten Maros', 'Kabupaten Luwu', 'Kota Makassar', 'Kota Palopo', 'Kota Parepare', 'Kabupaten Minahasa', 'Kota Manado', 'Kota Palu', 'Kota Mamuju']
  }
];

export const FEATURED_LPSE_NODES: LpseNode[] = [
  {
    id: 'node-lebak',
    name: 'Kabupaten Lebak',
    code: 'lebakkab',
    province: 'Banten',
    type: 'kabupaten',
    spseUrl: 'https://spse.inaproc.id/lebakkab/lelang',
    lpseUrl: 'https://lpse.lebakkab.go.id',
    activeTendersEstimate: 14
  },
  {
    id: 'node-bogor',
    name: 'Kabupaten Bogor',
    code: 'bogorkab',
    province: 'Jawa Barat',
    type: 'kabupaten',
    spseUrl: 'https://spse.inaproc.id/bogorkab/lelang',
    lpseUrl: 'https://lpse.bogorkab.go.id',
    activeTendersEstimate: 28
  },
  {
    id: 'node-badung',
    name: 'Kabupaten Badung',
    code: 'badungkab',
    province: 'Bali',
    type: 'kabupaten',
    spseUrl: 'https://spse.inaproc.id/badungkab/lelang',
    lpseUrl: 'https://lpse.badungkab.go.id',
    activeTendersEstimate: 19
  },
  {
    id: 'node-sleman',
    name: 'Kabupaten Sleman',
    code: 'slemankab',
    province: 'D.I. Yogyakarta',
    type: 'kabupaten',
    spseUrl: 'https://spse.inaproc.id/slemankab/lelang',
    lpseUrl: 'https://lpse.slemankab.go.id',
    activeTendersEstimate: 12
  },
  {
    id: 'node-banyuwangi',
    name: 'Kabupaten Banyuwangi',
    code: 'banyuwangikab',
    province: 'Jawa Timur',
    type: 'kabupaten',
    spseUrl: 'https://spse.inaproc.id/banyuwangikab/lelang',
    lpseUrl: 'https://lpse.banyuwangikab.go.id',
    activeTendersEstimate: 16
  },
  {
    id: 'node-kukar',
    name: 'Kabupaten Kutai Kartanegara',
    code: 'kukarkab',
    province: 'Kalimantan Timur',
    type: 'kabupaten',
    spseUrl: 'https://spse.inaproc.id/kukarkab/lelang',
    lpseUrl: 'https://lpse.kukarkab.go.id',
    activeTendersEstimate: 22
  },
  {
    id: 'node-deliserdang',
    name: 'Kabupaten Deli Serdang',
    code: 'deliserdangkab',
    province: 'Sumatera Utara',
    type: 'kabupaten',
    spseUrl: 'https://spse.inaproc.id/deliserdangkab/lelang',
    lpseUrl: 'https://lpse.deliserdangkab.go.id',
    activeTendersEstimate: 15
  },
  {
    id: 'node-jayapura',
    name: 'Kabupaten Jayapura',
    code: 'jayapurakab',
    province: 'Papua',
    type: 'kabupaten',
    spseUrl: 'https://spse.inaproc.id/jayapurakab/lelang',
    lpseUrl: 'https://lpse.jayapurakab.go.id',
    activeTendersEstimate: 9
  },
  {
    id: 'node-surabaya',
    name: 'Kota Surabaya',
    code: 'surabaya',
    province: 'Jawa Timur',
    type: 'kota',
    spseUrl: 'https://spse.inaproc.id/surabaya/lelang',
    lpseUrl: 'https://lpse.surabaya.go.id',
    activeTendersEstimate: 35
  },
  {
    id: 'node-dki',
    name: 'Pemprov DKI Jakarta',
    code: 'jakarta',
    province: 'DKI Jakarta',
    type: 'provinsi',
    spseUrl: 'https://spse.inaproc.id/jakarta/lelang',
    lpseUrl: 'https://lpse.jakarta.go.id',
    activeTendersEstimate: 42
  },
  {
    id: 'node-pupr',
    name: 'Kementerian PUPR',
    code: 'pu',
    province: 'Nasional',
    type: 'kementerian',
    spseUrl: 'https://spse.inaproc.id/pu/lelang',
    lpseUrl: 'https://lpse.pu.go.id',
    activeTendersEstimate: 65
  },
  {
    id: 'node-kemenkeu',
    name: 'Kementerian Keuangan',
    code: 'kemkeu',
    province: 'Nasional',
    type: 'kementerian',
    spseUrl: 'https://spse.inaproc.id/kemkeu/lelang',
    lpseUrl: 'https://lpse.kemkeu.go.id',
    activeTendersEstimate: 21
  }
];

// Helper to generate node object dynamically for any kabupaten/kota
export function getLpseNodeForRegion(regionName: string, provinceName?: string): LpseNode {
  const clean = regionName.toLowerCase().replace(/kabupaten|kota|pemprov|pemkota/gi, '').trim();
  const code = clean.replace(/[^a-z0-0]/g, '') + (regionName.toLowerCase().includes('kabupaten') ? 'kab' : '');
  
  return {
    id: `node-${code}`,
    name: regionName,
    code: code,
    province: provinceName || 'Indonesia',
    type: regionName.toLowerCase().includes('kota') ? 'kota' : 'kabupaten',
    spseUrl: `https://spse.inaproc.id/${code}/lelang`,
    lpseUrl: `https://lpse.${code}.go.id`,
    activeTendersEstimate: Math.floor(Math.random() * 20) + 5
  };
}
