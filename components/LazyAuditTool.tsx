'use client';

import dynamic from 'next/dynamic';

function AuditToolSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1fr_1.3fr] gap-8 items-start w-full transition-colors duration-300 animate-pulse">
      {/* LEFT COLUMN: FORM SKELETON */}
      <div className="w-full bg-white dark:bg-[#1e293b]/50 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl dark:shadow-2xl relative overflow-hidden min-h-[440px] flex flex-col justify-between">
        <div className="space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto lg:mx-0"></div>
            <div className="h-4 w-64 bg-slate-100 dark:bg-slate-800/60 rounded mx-auto lg:mx-0"></div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/40 rounded-xl"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/40 rounded-xl"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/40 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-xl mt-6"></div>
      </div>

      {/* RIGHT COLUMN SKELETON */}
      <div className="hidden lg:flex relative h-full min-h-[440px] w-full bg-white dark:bg-black/30 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 flex-col justify-center gap-6 shadow-xl dark:shadow-inner">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5">
            <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 flex-shrink-0"></div>
            <div className="space-y-2 flex-grow">
              <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-5 w-40 bg-slate-100 dark:bg-slate-800/60 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const AuditTool = dynamic(() => import('./AuditTool'), { 
  ssr: false,
  loading: () => <AuditToolSkeleton />
});

export default function LazyAuditTool() {
  return <AuditTool />;
}
