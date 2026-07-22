import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Tablet,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  Radio,
  MapPin,
  TrendingUp,
  SlidersHorizontal,
  Bookmark,
  Share2,
  RefreshCw,
  Zap,
  Code2,
  Download,
  Copy,
  ExternalLink,
  ShieldCheck,
  Check,
  Building2,
  Wifi,
  Battery,
  Signal,
  Sparkles,
  ChevronRight,
  Layers,
  FileCode2,
  SmartphoneNfc
} from 'lucide-react';
import { Tender } from '../types';
import { api, formatRupiah } from '../services/api';
import { Tenant, MOCK_TENANTS } from '../data/mockTenants';

interface MobileAppViewProps {
  currentTenant?: Tenant;
  onSelectTender?: (tender: Tender) => void;
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({
  currentTenant = MOCK_TENANTS[0],
  onSelectTender
}) => {
  // Mobile Simulator States
  const [deviceType, setDeviceType] = useState<'ios' | 'android'>('ios');
  const [mobileTab, setMobileTab] = useState<'radar' | 'notifications' | 'watchlist' | 'analytics' | 'profile'>('radar');
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(3);
  const [trackedIds, setTrackedIds] = useState<string[]>([]);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'app' | 'api' | 'push' | 'package'>('app');

  // Load live tenders from API
  const fetchMobileTenders = async () => {
    setLoading(true);
    try {
      const res = await api.getTenders();
      const list = res.data || [];
      setTenders(list);
      // Pre-fill tracked IDs
      const initialTracked = list.filter((t: Tender) => t.isTracked).map((t: Tender) => t.id);
      setTrackedIds(initialTracked);
    } catch (err) {
      console.error('Failed to load mobile tenders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMobileTenders();
  }, []);

  // Toggle tender tracking inside simulator
  const toggleTrackTender = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isCurrentlyTracked = trackedIds.includes(id);
    const newTracked = isCurrentlyTracked
      ? trackedIds.filter((tId) => tId !== id)
      : [...trackedIds, id];

    setTrackedIds(newTracked);

    // Trigger simulated mobile push alert when tracking
    if (!isCurrentlyTracked) {
      triggerPushAlert('📌 Tender Ditambahkan ke Pantauan Mobile!', 'Status tender akan terus dipantau secara real-time via FCM/APNs.');
    }

    try {
      await api.toggleTrackTender(id);
    } catch (err) {
      console.error('Watchlist sync error:', err);
    }
  };

  // Trigger simulated native push notification banner
  const triggerPushAlert = (title: string, body: string) => {
    setActiveNotification(`${title}: ${body}`);
    setNotificationCount((prev) => prev + 1);
    setTimeout(() => {
      setActiveNotification(null);
    }, 4000);
  };

  // Filtered tenders for mobile simulator
  const filteredTenders = tenders.filter((t) => {
    if (!t) return false;
    const title = t.nama || t.judul || '';
    const instansiName = t.instansi || '';
    const lpseLoc = t.lpseLocation || t.lokasi || '';
    const category = t.kategori || '';

    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instansiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lpseLoc.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'SEMUA' ||
      category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handleCopyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(label);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  // Code Snippets for React Native Expo Export
  const REACT_NATIVE_APP_CODE = `// App.tsx - LPSE Radar Pro Native Mobile Application (React Native + Expo)
// Compatible with iOS (APNs) and Android (FCM Push Notifications)

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  RefreshControl
} from 'react-native';
import { fetchTendersFromApi, Tender } from './src/api/client';
import { registerForPushNotificationsAsync } from './src/services/pushService';

export default function App() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
    registerForPushNotificationsAsync();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchTendersFromApi('https://ais-dev-l2vlpsecaao2pp4zi5qohg-444268511035.asia-east1.run.app/api/tenders');
      setTenders(data.tenders);
    } catch (error) {
      console.error('Native Mobile Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Native App Header */}
      <View style={styles.header}>
        <Text style={styles.title}>LPSE Radar Pro Native</Text>
        <Text style={styles.subTitle}>Live Sync • ${currentTenant.name}</Text>
      </View>

      {/* Mobile Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari Tender, Instansi, atau LPSE..."
          placeholderTextColor="#64748b"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Tender List */}
      <FlatList
        data={tenders.filter(t => t.nama.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor="#f43f5e" />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.badge}>{item.lpseLocation}</Text>
              <Text style={styles.pagu}>Rp {(item.pagu / 1000000000).toFixed(1)} M</Text>
            </View>
            <Text style={styles.tenderTitle}>{item.nama}</Text>
            <Text style={styles.instansi}>{item.instansi}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { padding: 16, backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#ffffff' },
  subTitle: { fontSize: 12, color: '#f43f5e' },
  searchContainer: { padding: 12 },
  searchInput: { backgroundColor: '#0f172a', color: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#334155' },
  card: { backgroundColor: '#0f172a', marginHorizontal: 12, marginVertical: 6, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#1e293b' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  badge: { color: '#38bdf8', fontSize: 11, fontWeight: '600' },
  pagu: { color: '#10b981', fontWeight: 'bold' },
  tenderTitle: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  instansi: { color: '#94a3b8', fontSize: 12, marginTop: 4 }
});`;

  const REACT_NATIVE_API_CODE = `// src/api/client.ts - RESTful API Sync Connector to PT Fas Web Server
import axios from 'axios';

const BASE_URL = 'https://ais-dev-l2vlpsecaao2pp4zi5qohg-444268511035.asia-east1.run.app';

export interface Tender {
  id: string;
  kodeTender: string;
  nama: string;
  instansi: string;
  pagu: number;
  hps: number;
  kategori: string;
  lpseLocation: string;
  akhirPendaftaran: string;
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-tenant-id': '${currentTenant.id}',
    'x-client-platform': 'React-Native-Expo'
  }
});

export const fetchTendersFromApi = async (overrideUrl?: string) => {
  const response = await apiClient.get(overrideUrl || '/api/tenders');
  return response.data;
};

export const syncMobileWatchlist = async (tenderId: string) => {
  const response = await apiClient.post(\`/api/watchlist/\${tenderId}/toggle\`);
  return response.data;
};`;

  const PUSH_SERVICE_CODE = `// src/services/pushService.ts - Expo Push Notification & APNs/FCM Sync
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Gagal mendapatkan permission push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Mobile Expo Push Token:', token);
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('lpse-alerts', {
      name: 'LPSE Tender Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}`;

  const PACKAGE_JSON_CODE = `{
  "name": "lpse-radar-pro-mobile",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build:android": "eas build --platform android --profile production",
    "build:ios": "eas build --platform ios --profile production"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-status-bar": "~1.12.1",
    "expo-notifications": "~0.28.1",
    "expo-device": "~6.0.2",
    "react": "18.2.0",
    "react-native": "0.74.1",
    "axios": "^1.6.8",
    "lucide-react-native": "^0.378.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    "typescript": "^5.1.3"
  },
  "private": true
}`;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner / Header Description */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 border border-rose-500/40 rounded-full text-xs text-rose-300 font-bold">
              <SmartphoneNfc className="w-4 h-4 text-rose-400" />
              <span>Aplikasi Native iOS & Android • Direct API Sync</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              LPSE Radar Pro Native Mobile App
            </h1>
            
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Pantau tender LPSE di manapun Anda berada tanpa Webview! Aplikasi native dibangun dengan **React Native & Expo**, mendukung **Push Notifications real-time (APNs & FCM)**, dan terhubung langsung ke database portal utama.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => triggerPushAlert('🔔 Tes Push Notification Native', 'Tender baru PUPR Jalan Tol Rp 120M telah terdeteksi!')}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4 animate-bounce" />
              Simulasi Push Alert
            </button>

            <a
              href="#native-code-export"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              Export Source Code
            </a>
          </div>
        </div>
      </div>

      {/* GRID LAYOUT: Left (Device Simulator Frame) & Right (App Features & Code) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE MOBILE DEVICE SIMULATOR (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          {/* Device Frame Controls Bar */}
          <div className="w-full max-w-[380px] bg-slate-900 border border-slate-800 rounded-xl p-2 mb-4 flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold text-slate-400 pl-2">Pilih Frame Perangkat:</span>
            
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setDeviceType('ios')}
                className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  deviceType === 'ios'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                iOS (iPhone 16)
              </button>

              <button
                onClick={() => setDeviceType('android')}
                className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  deviceType === 'android'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                Android (Pixel 9)
              </button>
            </div>
          </div>

          {/* REALISTIC NATIVE MOBILE DEVICE FRAME */}
          <div className={`relative w-[360px] h-[720px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 ${
            deviceType === 'ios' ? 'border-slate-700 ring-4 ring-slate-800/60' : 'border-slate-800 ring-2 ring-slate-700/50'
          } flex flex-col overflow-hidden`}>
            
            {/* Top Device Hardware Notch / Dynamic Island */}
            {deviceType === 'ios' ? (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-950 rounded-full z-50 flex items-center justify-between px-2.5 border border-slate-800/80 shadow-md">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse"></div>
              </div>
            ) : (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-950 border border-slate-800 rounded-full z-50"></div>
            )}

            {/* Simulated Status Bar (Time, Battery, Wifi) */}
            <div className="pt-2 px-6 pb-2 flex items-center justify-between text-[11px] font-mono text-slate-300 z-40 select-none">
              <span className="font-bold">09:41</span>
              <div className="flex items-center gap-2 text-slate-400">
                <Signal className="w-3 h-3 text-emerald-400" />
                <span className="text-[9px] font-bold text-emerald-400">5G</span>
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              </div>
            </div>

            {/* PUSH NOTIFICATION BANNER (FLOATING TOAST) */}
            {activeNotification && (
              <div className="absolute top-12 left-4 right-4 z-50 bg-slate-900/95 border border-rose-500/60 p-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs text-white animate-fade-in flex items-start gap-2.5">
                <div className="p-1.5 bg-rose-600 rounded-xl text-white shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-extrabold text-rose-300 text-[11px] block">LPSE Radar Push System</span>
                  <p className="text-[11px] text-slate-200 leading-tight">{activeNotification}</p>
                </div>
              </div>
            )}

            {/* INNER NATIVE APP CONTAINER */}
            <div className="flex-1 bg-slate-900 rounded-[36px] overflow-hidden flex flex-col border border-slate-800/80 relative">
              
              {/* App Bar Header inside Mobile */}
              <div className="bg-slate-950 p-3.5 border-b border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-black text-xs text-white block -mb-0.5">LPSE Radar Native</span>
                      <span className="text-[9px] text-emerald-400 font-mono font-semibold">
                        ● Direct API Live
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setMobileTab('notifications')}
                    className="relative p-1.5 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 hover:text-white"
                  >
                    <Bell className="w-4 h-4" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Mobile Search Bar */}
                {mobileTab === 'radar' && (
                  <div className="relative pt-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    <input
                      type="text"
                      placeholder="Cari tender di HP..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                )}
              </div>

              {/* TAB CONTENT INSIDE MOBILE SCREEN */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-800">
                
                {/* 1. RADAR FEED TAB */}
                {mobileTab === 'radar' && (
                  <>
                    {/* Category Filter Pills inside Mobile */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
                      {['SEMUA', 'Pekerjaan Konstruksi', 'Pengadaan Barang', 'Jasa Konsultansi'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer font-medium ${
                            selectedCategory === cat
                              ? 'bg-rose-600 text-white font-bold'
                              : 'bg-slate-950 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {loading ? (
                      <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-rose-500 animate-spin" />
                        <span>Mengambil data dari REST API...</span>
                      </div>
                    ) : filteredTenders.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-500">
                        Tidak ada tender yang cocok.
                      </div>
                    ) : (
                      filteredTenders.map((tender) => {
                        if (!tender) return null;
                        const isTracked = trackedIds.includes(tender.id);
                        return (
                          <div
                            key={tender.id}
                            onClick={() => onSelectTender && onSelectTender(tender)}
                            className="bg-slate-950 border border-slate-800/90 rounded-xl p-3 space-y-2 hover:border-slate-700 transition-all cursor-pointer relative"
                          >
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-400 font-semibold border border-sky-800/50">
                                {tender.lpseLocation || tender.lokasi || 'LPSE'}
                              </span>
                              <button
                                onClick={(e) => toggleTrackTender(tender.id, e)}
                                className={`p-1 rounded-md transition-all ${
                                  isTracked
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                                title="Simpan ke Watchlist Mobile"
                              >
                                <Bookmark className="w-3.5 h-3.5 fill-current" />
                              </button>
                            </div>

                            <h4 className="font-bold text-xs text-white leading-snug line-clamp-2">
                              {tender.nama || tender.judul || 'Tender Noname'}
                            </h4>

                            <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                              <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                              <span className="truncate">{tender.instansi || '-'}</span>
                            </div>

                            <div className="pt-1 border-t border-slate-900 flex items-center justify-between text-[10px]">
                              <div>
                                <span className="text-[9px] text-slate-500 block">Nilai Pagu</span>
                                <span className="font-mono font-extrabold text-emerald-400">
                                  {formatRupiah(tender.nilaiPagu || (tender as any).pagu || 0)}
                                </span>
                              </div>

                              <div className="text-right">
                                <span className="text-[9px] text-slate-500 block">Tutup Pendaftaran</span>
                                <span className="font-mono text-rose-300 font-bold flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
                                  {tender.akhirPendaftaran || tender.tanggalTutup || '-'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </>
                )}

                {/* 2. NOTIFICATION LOG TAB */}
                {mobileTab === 'notifications' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-white">Log Push Alert (APNs / FCM)</span>
                      <button
                        onClick={() => setNotificationCount(0)}
                        className="text-[10px] text-slate-400 hover:text-white"
                      >
                        Tandai Dibaca
                      </button>
                    </div>

                    {[
                      {
                        title: '⚡ Tender Baru PUPR Jatim',
                        msg: 'Pembangunan Jalan Tol Seksi 3 senilai Rp 120,5 Miliar diterbitkan.',
                        time: '2 menit lalu'
                      },
                      {
                        title: '⏰ Pengingat Deadline',
                        msg: 'Tender Peningkatan RS Kemenkes ditutup dalam 12 jam.',
                        time: '1 jam lalu'
                      },
                      {
                        title: '🏆 Hasil Pengumuman LPSE',
                        msg: 'Pengumuman pemenang tender Konsultansi Surabaya telah rilis.',
                        time: '3 jam lalu'
                      }
                    ].map((n, i) => (
                      <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-400 text-[11px]">{n.title}</span>
                          <span className="text-[9px] text-slate-500">{n.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-relaxed">{n.msg}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. WATCHLIST TAB */}
                {mobileTab === 'watchlist' && (
                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-white block pb-1 border-b border-slate-800">
                      Pantauan Terfavorit ({trackedIds.length})
                    </span>
                    {trackedIds.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-500">
                        Belum ada tender yang dipantau. Tekan ikon bookmark pada tender.
                      </div>
                    ) : (
                      tenders
                        .filter((t) => t && trackedIds.includes(t.id))
                        .map((t) => (
                          <div key={t.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                            <span className="font-bold text-white text-[11px] block">{t.nama || t.judul || 'Tender'}</span>
                            <span className="font-mono text-emerald-400 text-[10px] font-bold block">
                              {formatRupiah(t.nilaiPagu || (t as any).pagu || 0)}
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                )}

                {/* 4. ANALYTICS TAB */}
                {mobileTab === 'analytics' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <span className="font-bold text-white text-[11px] block">Statistik HP Native</span>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-400 text-[9px] block">Total Tender</span>
                          <span className="text-lg font-black font-mono text-white">1,248</span>
                        </div>
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                          <span className="text-slate-400 text-[9px] block">Total Pagu</span>
                          <span className="text-sm font-black font-mono text-emerald-400">Rp 4.2 T</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. PROFILE TAB */}
                {mobileTab === 'profile' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-center">
                      <div className="w-12 h-12 rounded-full bg-rose-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-lg">
                        AP
                      </div>
                      <span className="font-black text-white text-sm block">Andi Pratama</span>
                      <span className="text-[10px] text-slate-400 block">{currentTenant.name}</span>
                      <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] rounded font-mono border border-emerald-500/30">
                        {currentTenant.tier} TENANT
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-[10px] text-slate-300">
                      <span className="font-bold text-white block">Status Koneksi Website</span>
                      <div className="flex items-center justify-between">
                        <span>API Server:</span>
                        <span className="text-emerald-400 font-mono font-bold">Online (200 OK)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Push Notification Token:</span>
                        <span className="text-sky-400 font-mono text-[9px]">ExponentPushToken[xyz123...]</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* MOBILE BOTTOM NAVIGATION BAR */}
              <div className="bg-slate-950 border-t border-slate-800 p-1.5 flex items-center justify-around text-[10px] z-40">
                <button
                  onClick={() => setMobileTab('radar')}
                  className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-all ${
                    mobileTab === 'radar' ? 'text-rose-500 font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Radio className="w-4 h-4" />
                  <span>Radar</span>
                </button>

                <button
                  onClick={() => setMobileTab('notifications')}
                  className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-all relative ${
                    mobileTab === 'notifications' ? 'text-rose-500 font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>Alerts</span>
                </button>

                <button
                  onClick={() => setMobileTab('watchlist')}
                  className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-all ${
                    mobileTab === 'watchlist' ? 'text-rose-500 font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Pantauan</span>
                </button>

                <button
                  onClick={() => setMobileTab('analytics')}
                  className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-all ${
                    mobileTab === 'analytics' ? 'text-rose-500 font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Analitik</span>
                </button>

                <button
                  onClick={() => setMobileTab('profile')}
                  className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-all ${
                    mobileTab === 'profile' ? 'text-rose-500 font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Profil</span>
                </button>
              </div>

              {/* Mobile Home Bar Indicator */}
              <div className="py-1 bg-slate-950 flex justify-center">
                <div className="w-24 h-1 bg-slate-700 rounded-full"></div>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: REACT NATIVE CODE EXPORTER & ARCHITECTURE SUITE (7 Cols) */}
        <div id="native-code-export" className="lg:col-span-7 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  Export React Native / Expo Codebase
                </span>
                <h3 className="text-lg font-black text-white">Source Code Native Ready-to-Build</h3>
              </div>

              <a
                href="/api/v1/openapi/tenders"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg border border-slate-700 flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                API Specs JSON
              </a>
            </div>

            {/* Code Tabs Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs border-b border-slate-800">
              <button
                onClick={() => setActiveCodeTab('app')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeCodeTab === 'app'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                App.tsx
              </button>

              <button
                onClick={() => setActiveCodeTab('api')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeCodeTab === 'api'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                api/client.ts
              </button>

              <button
                onClick={() => setActiveCodeTab('push')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeCodeTab === 'push'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                pushService.ts
              </button>

              <button
                onClick={() => setActiveCodeTab('package')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeCodeTab === 'package'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                package.json
              </button>
            </div>

            {/* Code Viewer Container */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>
                  {activeCodeTab === 'app' && 'App.tsx'}
                  {activeCodeTab === 'api' && 'src/api/client.ts'}
                  {activeCodeTab === 'push' && 'src/services/pushService.ts'}
                  {activeCodeTab === 'package' && 'package.json'}
                </span>

                <button
                  onClick={() => {
                    const codeToCopy =
                      activeCodeTab === 'app' ? REACT_NATIVE_APP_CODE :
                      activeCodeTab === 'api' ? REACT_NATIVE_API_CODE :
                      activeCodeTab === 'push' ? PUSH_SERVICE_CODE : PACKAGE_JSON_CODE;
                    handleCopyCode(codeToCopy, activeCodeTab);
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] rounded flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSnippet === activeCodeTab ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-[380px] scrollbar-thin scrollbar-thumb-slate-800">
                {activeCodeTab === 'app' && REACT_NATIVE_APP_CODE}
                {activeCodeTab === 'api' && REACT_NATIVE_API_CODE}
                {activeCodeTab === 'push' && PUSH_SERVICE_CODE}
                {activeCodeTab === 'package' && PACKAGE_JSON_CODE}
              </pre>
            </div>

            {/* Steps to Build Android & iOS App using Expo CLI */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-3 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Langkah Kompilasi Native App (.APK / .AAB / .IPA)
              </span>

              <ol className="space-y-2 text-slate-300 list-decimal list-inside pl-1 leading-relaxed">
                <li>
                  <strong className="text-white">Install Expo CLI:</strong> Jalankan perintah{' '}
                  <code className="bg-slate-900 px-1.5 py-0.5 rounded text-rose-300 font-mono">npm i -g eas-cli</code>
                </li>
                <li>
                  <strong className="text-white">Inisialisasi Project:</strong> Buat folder baru lalu tempelkan berkas-berkas di atas.
                </li>
                <li>
                  <strong className="text-white">Build Android APK:</strong> Jalankan perintah{' '}
                  <code className="bg-slate-900 px-1.5 py-0.5 rounded text-emerald-300 font-mono">eas build -p android --profile preview</code>
                </li>
                <li>
                  <strong className="text-white">Build iOS App Store:</strong> Jalankan perintah{' '}
                  <code className="bg-slate-900 px-1.5 py-0.5 rounded text-sky-300 font-mono">eas build -p ios --profile production</code>
                </li>
              </ol>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
