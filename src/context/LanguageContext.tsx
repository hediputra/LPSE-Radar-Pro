import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'id' | 'en';

interface Translations {
  [key: string]: {
    id: string;
    en: string;
  };
}

const translations: Translations = {
  // Navigation
  nav_home: { id: 'Beranda', en: 'Home' },
  nav_tenders: { id: 'Daftar Tender', en: 'Tenders Directory' },
  nav_analytics: { id: 'Analitik Pasar', en: 'Market Analytics' },
  nav_buyer_portal: { id: 'Portal Buyer (S2C)', en: 'Buyer Portal (S2C)' },
  nav_pricing: { id: 'Paket & Harga', en: 'Pricing Plans' },
  nav_saas_admin: { id: 'SaaS Admin', en: 'SaaS Admin' },
  nav_docs: { id: 'Dokumentasi Pyproc', en: 'Pyproc Docs' },

  // AI Tender Suggestion Engine
  ai_engine_title: { id: 'AI Tender Suggestion Engine', en: 'AI Tender Suggestion Engine' },
  ai_engine_subtitle: {
    id: 'Rekomendasi tender paling presisi berdasarkan profil kualifikasi, SBU, histori kemenangan & rekam jejak regional vendor Anda.',
    en: 'Precision tender recommendations based on your qualification profile, SBU codes, win history, and regional footprint.'
  },
  ai_match_badge: { id: 'Kesesuaian AI High Match', en: 'High Match Score' },
  ai_score_label: { id: 'Skor Match', en: 'Match Score' },
  ai_why_recommended: { id: 'Alasan Rekomendasi:', en: 'Why Recommended:' },
  ai_suggested_tenders: { id: 'Tender Rekomendasi Teratas Hari Ini', en: 'Top Recommended Tenders Today' },
  ai_filter_high_match: { id: 'Tampilkan Hanya Match > 80%', en: 'Show Only > 80% Match' },

  // Peruri e-Sign
  peruri_badge: { id: 'Terintegrasi Perum Peruri Direct (Official)', en: 'Official Perum Peruri Direct Integration' },
  peruri_btn_sign: { id: 'Tanda Tangan Digital Peruri', en: 'Sign with Official Peruri' },
  peruri_btn_ematerai: { id: 'Bubuhi E-Materai Peruri Direct', en: 'Attach Peruri E-Stamp Direct' },
  peruri_certified_title: { id: 'Tender Terverifikasi BSRE & Peruri', en: 'BSRE & Peruri Certified Tender' },
  peruri_sign_status_signed: { id: 'Terbit & Ditandatangani Peruri', en: 'Issued & Peruri Signed' },
  peruri_sign_status_unsigned: { id: 'Belum Tanda Tangan Peruri', en: 'Pending Peruri Sign' },

  // LPSE Official Link
  lpse_official_link: { id: 'Sumber Resmi LPSE', en: 'Official LPSE Portal' },
  lpse_open_portal: { id: 'Buka Portal Resmi SPSE / LPSE', en: 'Open Official LPSE / SPSE Portal' },
  lpse_verified_badge: { id: 'Terverifikasi SPSE / LKPP', en: 'SPSE / LKPP Verified' },

  // General Buttons
  btn_detail: { id: 'Lihat Detail', en: 'View Details' },
  btn_track: { id: 'Pantau Tender', en: 'Track Tender' },
  btn_create_tender: { id: 'Buat Tender Baru', en: 'Create New Tender' },
  btn_switch_language: { id: 'Bahasa / Language', en: 'Language' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'id',
  setLanguage: () => {},
  t: (key) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('lpse_app_lang');
    return (saved === 'en' || saved === 'id') ? saved : 'id';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lpse_app_lang', lang);
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key]['id'];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
