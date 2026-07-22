import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TenderListView } from './components/TenderListView';
import { TenderDetailModal } from './components/TenderDetailModal';
import { WatchlistView } from './components/WatchlistView';
import { AnalyticsView } from './components/AnalyticsView';
import { PyprocDocsView } from './components/PyprocDocsView';
import { SaaSAdminPortalView } from './components/SaaSAdminPortalView';
import { BuyerDashboardView } from './components/BuyerDashboardView';
import { LandingPageView } from './components/LandingPageView';
import { MobileAppView } from './components/MobileAppView';
import { CompetitorAnalysisView } from './components/CompetitorAnalysisView';
import { TenderMapView } from './components/TenderMapView';
import { AuthModal } from './components/AuthModal';
import { CreateTenderModal } from './components/CreateTenderModal';
import { Tender, TenderStats, AppNotification } from './types';
import { MOCK_TENANTS, Tenant, SubscriptionTier } from './data/mockTenants';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authInitialTier, setAuthInitialTier] = useState<SubscriptionTier>('FREE');
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  // Create Tender Modal State (Private / BUMN)
  const [isCreateTenderOpen, setIsCreateTenderOpen] = useState(false);

  // Multi-Tenant state for PT Fas SaaS Platform
  const [currentTenant, setCurrentTenant] = useState<Tenant>(MOCK_TENANTS[0]);

  // Location & Node filter state
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Search & Filter state passed to list
  const [listSearch, setListSearch] = useState('');
  const [listCategory, setListCategory] = useState('ALL');
  const [listStatus, setListStatus] = useState('ALL');

  // Shared statistics & tenders state for tracked counters
  const [stats, setStats] = useState<TenderStats | null>(null);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSelectLocation = async (locationName: string | null) => {
    setSelectedLocation(locationName);
    if (locationName) {
      setListSearch(locationName);
    }
    // Reload tenders list with location filter applied
    try {
      const tRes = await api.getTenders({
        lokasi: locationName || undefined,
        limit: 100
      });
      setTenders(tRes.data);
    } catch (err) {
      console.error('Error loading tenders for location:', err);
    }
  };

  const loadInitialData = async () => {
    try {
      const [sData, tRes, nData] = await Promise.all([
        api.getStatistics(),
        api.getTenders({ limit: 100 }),
        api.getNotifications()
      ]);
      setStats(sData);
      setTenders(tRes.data);
      setNotifications(nData);
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  };

  const handleToggleTrack = async (tenderId: string) => {
    try {
      const res = await api.toggleTrackTender(tenderId);

      // Update local tenders list
      setTenders((prev) =>
        prev.map((t) => (t.id === tenderId ? { ...t, isTracked: res.isTracked } : t))
      );

      // Update selected tender if modal is open
      if (selectedTender && selectedTender.id === tenderId) {
        setSelectedTender((prev) => (prev ? { ...prev, isTracked: res.isTracked } : null));
      }

      // Refresh notifications
      const notifs = await api.getNotifications();
      setNotifications(notifs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavigateTab = (tab: string, filterParam?: { category?: string; status?: string }) => {
    if (filterParam?.category) {
      setListCategory(filterParam.category);
    }
    if (filterParam?.status) {
      setListStatus(filterParam.status);
    }
    setActiveTab(tab);
  };

  const handleHeaderSearch = (query: string) => {
    setListSearch(query);
    setActiveTab('tenders');
  };

  const handleOpenAuthModal = (mode: 'login' | 'signup', tier: SubscriptionTier = 'FREE') => {
    setAuthMode(mode);
    setAuthInitialTier(tier);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (tenant: Tenant, email?: string) => {
    if (email) {
      setCurrentUserEmail(email);
    }
    setCurrentTenant(tenant);
    setIsAuthModalOpen(false);
    setActiveTab('dashboard');
  };

  const trackedTenders = tenders.filter((t) => t.isTracked);

  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        {/* Quick App Shortcut Bar at the Very Top */}
        <div className="bg-slate-900 border-b border-slate-800 text-slate-300 py-1.5 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-medium text-slate-400">
                Mockup Landing Page LPSE Radar Pro • PT Fas Technology Solutions
              </span>
            </div>

            <div className="flex items-center gap-3 font-semibold text-[11px]">
              <button
                onClick={() => handleOpenAuthModal('login')}
                className="text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                Masuk ke Akun Anda &rarr;
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={() => handleOpenAuthModal('signup', 'FREE')}
                className="text-sky-400 hover:text-sky-300 hover:underline cursor-pointer font-bold"
              >
                Daftar Paket Free (Gratis)
              </button>
              <span className="text-slate-700">|</span>
              <button
                onClick={() => setActiveTab('saas-portal')}
                className="text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
              >
                Portal SaaS PT Fas
              </button>
            </div>
          </div>
        </div>

        {/* Landing Page Content */}
        <LandingPageView
          onEnterApp={(tab) => setActiveTab(tab || 'dashboard')}
          onOpenAuthModal={handleOpenAuthModal}
        />

        {/* Global Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          mode={authMode}
          initialTier={authInitialTier}
          onClose={() => setIsAuthModalOpen(false)}
          onSwitchMode={(m) => setAuthMode(m)}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearchSubmit={handleHeaderSearch}
        trackedCount={trackedTenders.length}
        selectedLocation={selectedLocation}
        onSelectLocation={handleSelectLocation}
        onSyncComplete={loadInitialData}
        currentTenant={currentTenant}
        onSwitchTenant={(t) => setCurrentTenant(t)}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenCreateTenderModal={() => setIsCreateTenderOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            tenders={tenders}
            selectedLocation={selectedLocation}
            onSelectLocation={handleSelectLocation}
            onSelectTender={(t) => setSelectedTender(t)}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'tenders' && (
          <TenderListView
            initialSearch={listSearch}
            initialCategory={listCategory}
            initialStatus={listStatus}
            selectedLocation={selectedLocation}
            onSelectTender={(t) => setSelectedTender(t)}
            onToggleTrack={handleToggleTrack}
            onOpenCreateTenderModal={() => setIsCreateTenderOpen(true)}
          />
        )}

        {activeTab === 'map' && (
          <TenderMapView
            tenders={tenders}
            onSelectTender={(t) => setSelectedTender(t)}
            selectedLocation={selectedLocation}
            onSelectLocation={handleSelectLocation}
          />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistView
            trackedTenders={trackedTenders}
            notifications={notifications}
            onSelectTender={(t) => setSelectedTender(t)}
            onUntrackTender={handleToggleTrack}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsView />}

        {activeTab === 'competitors' && <CompetitorAnalysisView />}

        {activeTab === 'mobile-app' && (
          <MobileAppView
            currentTenant={currentTenant}
            onSelectTender={(t) => setSelectedTender(t)}
          />
        )}

        {activeTab === 'pyproc-docs' && <PyprocDocsView />}

        {activeTab === 'buyer-dashboard' && (
          <BuyerDashboardView
            onOpenCreateModal={() => setIsCreateTenderOpen(true)}
          />
        )}

        {activeTab === 'saas-portal' && (
          <SaaSAdminPortalView
            currentTenant={currentTenant}
            onSwitchTenant={(t) => setCurrentTenant(t)}
          />
        )}
      </main>

      {/* Tender Detail Modal */}
      <TenderDetailModal
        tender={selectedTender}
        onClose={() => setSelectedTender(null)}
        onToggleTrack={handleToggleTrack}
      />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authMode}
        initialTier={authInitialTier}
        onClose={() => setIsAuthModalOpen(false)}
        onSwitchMode={(m) => setAuthMode(m)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Modal Input Lelang Pekerjaan Swasta / BUMN */}
      <CreateTenderModal
        isOpen={isCreateTenderOpen}
        onClose={() => setIsCreateTenderOpen(false)}
        onTenderCreated={(newTender) => {
          loadInitialData();
          setSelectedTender(newTender);
        }}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-200">LPSE Radar PRO</span> • B2B Procurement SaaS Platform developed by <strong className="text-emerald-400 font-semibold">PT Fas Technology Solutions</strong>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Multi-Tenant Architecture • Powered by pyproc Python Scraper Engine. Mematuhi UU KIP No. 14/2008.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('saas-portal')}
              className="text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              Pusat Operasional PT Fas
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('pyproc-docs')}
              className="hover:text-emerald-400 underline cursor-pointer"
            >
              API & pyproc Specs
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
