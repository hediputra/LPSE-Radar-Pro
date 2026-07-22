import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { VendorTieringSystem } from './VendorTieringSystem';

interface VendorLeaderboardMarqueeProps {
  onVendorClick: (tab?: string) => void;
}

const TOP_VENDORS = [
  {
    name: 'PT Waskita Karya (Persero) Tbk',
    shortName: 'WASKITA KARYA',
    rank: 1,
    contractValue: 'Rp 385,0 Miliar',
    winsCount: '42 Paket',
    badge: '🏆 Champion #1',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    svgLogo: (
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="url(#waskita-grad)" />
        <path d="M7 11L12 21L16 13L20 21L25 11" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="waskita-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0EA5E9" />
            <stop offset="1" stopColor="#0284C7" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    name: 'PT Pembangunan Perumahan (Persero) Tbk',
    shortName: 'PT PP (PERSERO)',
    rank: 2,
    contractValue: 'Rp 312,0 Miliar',
    winsCount: '38 Paket',
    badge: '🥇 Champion #2',
    badgeBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    svgLogo: (
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="url(#pp-grad)" />
        <path d="M9 22V10H16C18.2091 10 20 11.7909 20 14C20 16.2091 18.2091 18 16 18H9M16 18V22" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
        <defs>
          <linearGradient id="pp-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10B981" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    name: 'PT Wijaya Karya (Persero) Tbk',
    shortName: 'WIKA PERSERO',
    rank: 3,
    contractValue: 'Rp 295,5 Miliar',
    winsCount: '35 Paket',
    badge: '🥈 Champion #3',
    badgeBg: 'bg-slate-300/20 text-slate-100 border-slate-400/50',
    svgLogo: (
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="url(#wika-grad)" />
        <path d="M8 21L12 11L16 18L20 11L24 21" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="wika-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F43F5E" />
            <stop offset="1" stopColor="#BE123C" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    name: 'PT Adhi Karya (Persero) Tbk',
    shortName: 'ADHI KARYA',
    rank: 4,
    contractValue: 'Rp 240,8 Miliar',
    winsCount: '31 Paket',
    badge: '🥉 Top Champion',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
    svgLogo: (
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="url(#adhi-grad)" />
        <path d="M16 8L24 23H8L16 8Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="16" cy="18" r="2.5" fill="white" />
        <defs>
          <linearGradient id="adhi-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    name: 'PT Siemens Healthineers Indonesia',
    shortName: 'SIEMENS HEALTH',
    rank: 5,
    contractValue: 'Rp 184,0 Miliar',
    winsCount: '27 Paket',
    badge: '🏆 Alkes Champion',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
    svgLogo: (
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="url(#siemens-grad)" />
        <circle cx="16" cy="16" r="6.5" stroke="white" strokeWidth="2.2" />
        <path d="M16 12.5V19.5M12.5 16H19.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <defs>
          <linearGradient id="siemens-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#06B6D4" />
            <stop offset="1" stopColor="#0891B2" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    name: 'PT Telkom Indonesia (Persero) Tbk',
    shortName: 'TELKOM INDONESIA',
    rank: 6,
    contractValue: 'Rp 142,0 Miliar',
    winsCount: '45 Paket',
    badge: '🏆 Telco Champion',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
    svgLogo: (
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="url(#telkom-grad)" />
        <circle cx="16" cy="16" r="3.5" fill="white" />
        <path d="M9 16C9 12.134 12.134 9 16 9C19.866 9 23 12.134 23 16" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <defs>
          <linearGradient id="telkom-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E11D48" />
            <stop offset="1" stopColor="#9F1239" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    name: 'PT Virama Karya (Persero)',
    shortName: 'VIRAMA KARYA',
    rank: 7,
    contractValue: 'Rp 98,0 Miliar',
    winsCount: '31 Paket',
    badge: '🎖️ Konsultan Champion',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50',
    svgLogo: (
      <svg className="w-8 h-8 shrink-0" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="url(#virama-grad)" />
        <path d="M10 11L16 22L22 11" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="virama-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366F1" />
            <stop offset="1" stopColor="#4338CA" />
          </linearGradient>
        </defs>
      </svg>
    )
  }
];

// Duplicated array for smooth infinite wrap-around
const VENDORS_DOUBLED = [...TOP_VENDORS, ...TOP_VENDORS];

export const VendorLeaderboardMarquee: React.FC<VendorLeaderboardMarqueeProps> = ({ onVendorClick }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const xPosRef = useRef(0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    let lastTimestamp: number | null = null;
    const speed = 48; // Pixels per second (60fps optimized)

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (!isPausedRef.current && contentRef.current) {
        // Advance position based on actual frame time delta to ensure 60Hz/120Hz smooth performance
        xPosRef.current += speed * deltaTime;
        
        // Wrap around smoothly when half the content width has been scrolled
        const halfWidth = contentRef.current.scrollWidth / 2;
        if (halfWidth > 0 && xPosRef.current >= halfWidth) {
          xPosRef.current %= halfWidth;
        }

        contentRef.current.style.transform = `translate3d(-${xPosRef.current}px, 0, 0)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <section className="py-12 bg-slate-900/80 border-y border-slate-800/80 relative overflow-hidden">
      {/* Side fade gradient overlay masks */}
      <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[11px] font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>LEADERBOARD TENDER LPSE RI</span>
          </div>

          <h2 className="text-sm sm:text-base font-black text-white tracking-wider uppercase">
            Top Vendor (Papan Peringkat Vendor Pemenang Tender Teratas)
          </h2>
          <p className="text-xs text-slate-400">
            Daftar pemenang kontrak terbesar dari sistem pengadaan pemerintah LPSE Indonesia
          </p>
        </div>

        {/* RAF-optimized Hardware-Accelerated Marquee Container */}
        <div
          className="relative overflow-hidden w-full py-3 cursor-grab active:cursor-grabbing"
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
          onTouchStart={() => { isPausedRef.current = true; }}
          onTouchEnd={() => { isPausedRef.current = false; }}
        >
          <div
            ref={contentRef}
            className="flex gap-4 w-max will-change-transform"
            style={{ transform: 'translate3d(0, 0, 0)' }}
          >
            {VENDORS_DOUBLED.map((vendor, idx) => (
              <div
                key={idx}
                onClick={() => onVendorClick('competitors')}
                className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 w-[280px] shrink-0 space-y-3 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {vendor.svgLogo}
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono font-bold block tracking-wider">
                        #{vendor.rank} LEADERBOARD
                      </span>
                      <h3 className="font-extrabold text-white text-xs truncate max-w-[130px] group-hover:text-rose-400 transition-colors">
                        {vendor.shortName}
                      </h3>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-tight border ${vendor.badgeBg}`}>
                    {vendor.badge}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800/80 flex items-center justify-between font-mono">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Total Nilai Kontrak</span>
                    <span className="text-xs font-black text-emerald-400">{vendor.contractValue}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 block uppercase">Kemenangan</span>
                    <span className="text-xs font-bold text-slate-200">{vendor.winsCount}</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">Trust Score:</span>
                  <VendorTieringSystem
                    vendor={{
                      vendorName: vendor.name,
                      completedTenders: parseInt(vendor.winsCount) || 30
                    }}
                    compact
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
