import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  Sliders,
  ChevronRight,
  TrendingUp,
  MapPin,
  Building2,
  FileCheck,
  Zap,
  Tag,
  ThumbsUp,
  Briefcase,
  ExternalLink
} from 'lucide-react';
import { Tender } from '../types';
import { formatRupiah, getStatusBadge, getLpseUrl } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface AITenderSuggestionEngineProps {
  tenders: Tender[];
  onSelectTender: (tender: Tender) => void;
}

export const AITenderSuggestionEngine: React.FC<AITenderSuggestionEngineProps> = ({
  tenders,
  onSelectTender
}) => {
  const { language, t } = useLanguage();

  // Selected vendor persona filter for simulation
  const [vendorProfileCategory, setVendorProfileCategory] = useState<string>('Pekerjaan Konstruksi');
  const [vendorSbuCode, setVendorSbuCode] = useState<string>('BG004 (Gedung)');
  const [minMatchThreshold, setMinMatchThreshold] = useState<number>(75);

  // Compute matched tenders with AI scoring algorithm
  const suggestedTenders = tenders.map((tender, index) => {
    let baseScore = 70;

    // SBU / Category Match
    if (tender.kategori === vendorProfileCategory) {
      baseScore += 18;
    } else {
      baseScore -= 15;
    }

    // Regional Proximity bonus (e.g. Banten, Jakarta, Jawa Barat)
    if (tender.lokasi.includes('Kab. Lebak') || tender.lokasi.includes('Banten') || tender.lokasi.includes('Pusat')) {
      baseScore += 8;
    }

    // Budget range suitability (HPS between 1M and 100M)
    if (tender.nilaiHPS > 1_000_000_000 && tender.nilaiHPS < 80_000_000_000) {
      baseScore += 4;
    }

    // Index modifier for realistic variation
    const finalScore = Math.min(98, Math.max(55, baseScore + ((index * 7) % 11) - 4));

    // Reasons generator
    const reasons: string[] = [];
    if (tender.kategori === vendorProfileCategory) {
      reasons.push(language === 'id' ? `100% Sesuai SBU Kategori ${vendorProfileCategory}` : `100% Matches SBU Category ${vendorProfileCategory}`);
    } else {
      reasons.push(language === 'id' ? 'Kategori SBU Silang Berpotensi Konsorsium' : 'Cross-category SBU Consortium Opportunity');
    }

    if (tender.lokasi.includes('Lebak') || tender.lokasi.includes('Banten')) {
      reasons.push(language === 'id' ? 'Lokasi Proyek di Wilayah Domisili Utama' : 'Project Location in Primary Headquarters Area');
    } else {
      reasons.push(language === 'id' ? 'Riwayat Menang Tender Instansi Sejenis' : 'History of Wins with Similar Agency');
    }

    reasons.push(language === 'id' ? 'Rasio Kepadatan Kompetitor Rendah (High Win Opportunity)' : 'Low Competitor Density (High Win Opportunity)');

    return {
      ...tender,
      matchScore: finalScore,
      matchReasons: reasons
    };
  })
  .filter((t) => t.matchScore >= minMatchThreshold)
  .sort((a, b) => b.matchScore - a.matchScore)
  .slice(0, 5);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-sky-500/30 rounded-2xl p-5 shadow-2xl space-y-5 text-slate-100 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-sky-500/20 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                {t('ai_engine_title')}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-500/20 text-sky-300 border border-sky-500/40 uppercase">
                v2.4 Smart Ranking
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              {t('ai_engine_subtitle')}
            </p>
          </div>
        </div>

        {/* Vendor Profile Selector Simulation */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
          <div className="text-left px-2">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">
              {language === 'id' ? 'Profil SBU Vendor:' : 'Vendor SBU Profile:'}
            </span>
            <span className="text-xs font-black text-emerald-400 font-mono">{vendorSbuCode}</span>
          </div>

          <select
            value={vendorProfileCategory}
            onChange={(e) => setVendorProfileCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500 font-medium cursor-pointer"
          >
            <option value="Pekerjaan Konstruksi">Pekerjaan Konstruksi</option>
            <option value="Pengadaan Barang">Pengadaan Barang</option>
            <option value="Jasa Konsultansi Badan Usaha">Jasa Konsultansi</option>
            <option value="Jasa Lainnya">Jasa Lainnya</option>
          </select>

          <button
            onClick={() => setMinMatchThreshold(minMatchThreshold === 75 ? 85 : 75)}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer border ${
              minMatchThreshold === 85
                ? 'bg-sky-500 text-slate-950 border-sky-400'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {minMatchThreshold === 85 ? '> 85% Match Only' : 'All Matches'}
          </button>
        </div>
      </div>

      {/* Suggested Tenders Grid */}
      <div className="grid grid-cols-1 gap-3">
        {suggestedTenders.map((tender, rankIdx) => (
          <div
            key={tender.id}
            onClick={() => onSelectTender(tender)}
            className="group bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500/50 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl relative overflow-hidden"
          >
            {/* Top Match Rank Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-black flex items-center justify-center font-mono">
                  #{rankIdx + 1}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Kode: #{tender.kodeTender}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-800 text-slate-300 border border-slate-700">
                  {tender.kategori}
                </span>
              </div>

              {/* Match Score Indicator */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 mr-1.5">{t('ai_score_label')}:</span>
                  <span className={`text-base font-black font-mono ${
                    tender.matchScore >= 90 ? 'text-emerald-400' : 'text-sky-400'
                  }`}>
                    {tender.matchScore}%
                  </span>
                </div>
                <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className={`h-full ${tender.matchScore >= 90 ? 'bg-emerald-400' : 'bg-sky-400'}`}
                    style={{ width: `${tender.matchScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Title & Agency */}
            <h3 className="font-extrabold text-white group-hover:text-sky-300 text-sm sm:text-base leading-snug transition-colors">
              {tender.judul}
            </h3>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300 mt-2">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {tender.instansi}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {tender.lokasi}
              </span>
              <span className="flex items-center gap-1 font-bold text-emerald-400 font-mono">
                HPS: {formatRupiah(tender.nilaiHPS)}
              </span>
            </div>

            {/* AI Match Reason Pills */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" /> {t('ai_why_recommended')}
                </span>
                {tender.matchReasons?.map((reason, rIdx) => (
                  <span
                    key={rIdx}
                    className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-medium flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    {reason}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={getLpseUrl(tender)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-2.5 py-1 rounded-lg bg-sky-950 hover:bg-sky-900 text-sky-300 font-bold text-[11px] border border-sky-800/80 flex items-center gap-1 transition-colors"
                  title="Buka Pengumuman Resmi LPSE"
                >
                  <ExternalLink className="w-3 h-3 text-sky-400" />
                  <span>{t('lpse_official_link')}</span>
                </a>

                <span className="text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  {t('btn_detail')} <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
