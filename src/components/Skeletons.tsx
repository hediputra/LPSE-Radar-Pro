import React from 'react';

// Dashboard View Skeleton Component
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse pb-12">
      {/* Hero Banner Skeleton */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <div className="h-5 w-36 bg-slate-800 rounded-full"></div>
              <div className="h-4 w-40 bg-slate-800/60 rounded"></div>
            </div>
            <div className="h-7 w-3/4 max-w-xl bg-slate-800 rounded-lg"></div>
            <div className="h-4 w-5/6 max-w-2xl bg-slate-800/70 rounded"></div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-10 w-36 bg-slate-800 rounded-xl"></div>
            <div className="h-10 w-28 bg-slate-800 rounded-xl"></div>
          </div>
        </div>
      </div>

      {/* 4 KPI Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-28 bg-slate-800 rounded"></div>
              <div className="w-9 h-9 bg-slate-800 rounded-xl"></div>
            </div>
            <div className="h-8 w-28 bg-slate-800 rounded-lg"></div>
            <div className="h-3 w-36 bg-slate-800/60 rounded"></div>
          </div>
        ))}
      </div>

      {/* Category Shortcut Chips Skeleton */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="h-4 w-36 bg-slate-800 rounded"></div>
        <div className="flex flex-wrap items-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-28 bg-slate-800 rounded-xl"></div>
          ))}
        </div>
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart Card Skeleton */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="space-y-1">
            <div className="h-5 w-48 bg-slate-800 rounded"></div>
            <div className="h-3 w-64 bg-slate-800/60 rounded"></div>
          </div>
          <div className="h-64 bg-slate-950 rounded-xl border border-slate-800/80 p-4 flex items-end justify-between gap-3">
            {[40, 75, 55, 85, 35].map((heightPct, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className="w-full bg-slate-800 rounded-t-md transition-all"
                  style={{ height: `${heightPct}%` }}
                ></div>
                <div className="h-3 w-10 bg-slate-800/60 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart Card Skeleton */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="space-y-1">
            <div className="h-5 w-48 bg-slate-800 rounded"></div>
            <div className="h-3 w-64 bg-slate-800/60 rounded"></div>
          </div>
          <div className="h-64 bg-slate-950 rounded-xl border border-slate-800/80 p-4 flex items-center justify-center gap-6">
            <div className="w-40 h-40 rounded-full border-8 border-slate-800 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-slate-900"></div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                  <div className="h-3 w-24 bg-slate-800 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Tenders Skeleton */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="space-y-1">
            <div className="h-5 w-56 bg-slate-800 rounded"></div>
            <div className="h-3 w-40 bg-slate-800/60 rounded"></div>
          </div>
          <div className="h-8 w-24 bg-slate-800 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-slate-800 rounded"></div>
                <div className="h-4 w-20 bg-slate-800 rounded"></div>
              </div>
              <div className="h-5 w-full bg-slate-800 rounded"></div>
              <div className="h-4 w-2/3 bg-slate-800/70 rounded"></div>
              <div className="flex items-center justify-between pt-2">
                <div className="h-5 w-28 bg-slate-800 rounded"></div>
                <div className="h-7 w-20 bg-slate-800 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Tender List View Skeleton Component
interface TenderListSkeletonProps {
  viewMode?: 'grid' | 'table';
  count?: number;
}

export const TenderListSkeleton: React.FC<TenderListSkeletonProps> = ({
  viewMode = 'grid',
  count = 6
}) => {
  if (viewMode === 'table') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-pulse">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="h-4 w-48 bg-slate-800 rounded"></div>
          <div className="h-4 w-24 bg-slate-800 rounded"></div>
        </div>
        <div className="divide-y divide-slate-800">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-20 bg-slate-800 rounded"></div>
                  <div className="h-4 w-28 bg-slate-800 rounded-full"></div>
                </div>
                <div className="h-5 w-3/4 bg-slate-800 rounded"></div>
                <div className="h-3.5 w-1/2 bg-slate-800/70 rounded"></div>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <div className="space-y-1 text-right">
                  <div className="h-3 w-16 bg-slate-800/60 rounded ml-auto"></div>
                  <div className="h-5 w-28 bg-slate-800 rounded"></div>
                </div>
                <div className="h-9 w-24 bg-slate-800 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 flex flex-col justify-between"
        >
          <div className="space-y-3">
            {/* Top Row */}
            <div className="flex items-start justify-between gap-2">
              <div className="h-6 w-32 bg-slate-800 rounded-full"></div>
              <div className="w-8 h-8 bg-slate-800 rounded-xl"></div>
            </div>

            {/* Code & Title */}
            <div className="space-y-1.5">
              <div className="h-3 w-20 bg-slate-800/60 rounded"></div>
              <div className="h-5 w-full bg-slate-800 rounded"></div>
              <div className="h-5 w-3/4 bg-slate-800 rounded"></div>
            </div>

            {/* Instansi & Location */}
            <div className="space-y-1.5 pt-1">
              <div className="h-3.5 w-2/3 bg-slate-800/80 rounded"></div>
              <div className="h-3.5 w-1/2 bg-slate-800/80 rounded"></div>
            </div>

            {/* HPS Price Box */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
              <div className="h-3 w-24 bg-slate-800/60 rounded"></div>
              <div className="h-6 w-44 bg-slate-800 rounded"></div>
            </div>
          </div>

          {/* Footer Tags & Buttons */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-20 bg-slate-800 rounded-lg"></div>
              <div className="h-5 w-16 bg-slate-800 rounded-lg"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 bg-slate-800 rounded-xl"></div>
              <div className="h-8 w-24 bg-slate-800 rounded-xl"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Analytics View Skeleton Component
export const AnalyticsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse pb-12">
      {/* Banner Skeleton */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="h-5 w-36 bg-slate-800 rounded-full"></div>
        <div className="h-7 w-2/3 bg-slate-800 rounded-lg"></div>
        <div className="h-4 w-1/2 bg-slate-800/70 rounded"></div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="h-4 w-32 bg-slate-800 rounded"></div>
            <div className="h-8 w-28 bg-slate-800 rounded-lg"></div>
            <div className="h-3 w-40 bg-slate-800/60 rounded"></div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-72 bg-slate-900/80"></div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-72 bg-slate-900/80"></div>
      </div>
    </div>
  );
};
