'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, ExternalLink, Sparkles } from 'lucide-react';

interface VerifiedN8nBadgeProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export default function VerifiedN8nBadge({ className = '', variant = 'compact' }: VerifiedN8nBadgeProps) {
  const creatorUrl = "https://n8n.io/creators/whoisalfaz/";

  if (variant === 'full') {
    return (
      <a
        href={creatorUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#EA4B71]/10 via-purple-500/10 to-teal-500/10 border border-[#EA4B71]/30 hover:border-[#EA4B71]/60 shadow-md hover:shadow-lg hover:shadow-[#EA4B71]/15 transition-all duration-300 backdrop-blur-sm ${className}`}
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-[#EA4B71]/20 text-[#EA4B71] border border-[#EA4B71]/30 group-hover:scale-110 transition-transform">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M21.4737 5.6842c-1.1772 0-2.1663.8051-2.4468 1.8947h-2.8955c-1.235 0-2.289.893-2.492 2.111l-.1038.623a1.263 1.263 0 0 1-1.246 1.0555H11.289c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947s-2.1663.8051-2.4467 1.8947H4.973c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947C1.1311 9.4737 0 10.6047 0 12s1.131 2.5263 2.5263 2.5263c1.1772 0 2.1663-.8051 2.4468-1.8947h1.4223c.2804 1.0896 1.2696 1.8947 2.4467 1.8947 1.1772 0 2.1663-.8051 2.4468-1.8947h1.0008a1.263 1.263 0 0 1 1.2459 1.0555l.1038.623c.203 1.218 1.257 2.111 2.492 2.111h.3692c.2804 1.0895 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263c-1.1772 0-2.1664.805-2.4468 1.8947h-.3692a1.263 1.263 0 0 1-1.246-1.0555l-.1037-.623A2.52 2.52 0 0 0 13.9607 12a2.52 2.52 0 0 0 .821-1.4794l.1038-.623a1.263 1.263 0 0 1 1.2459-1.0555h2.8955c.2805 1.0896 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263" />
          </svg>
        </div>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
            <span>Official Verified n8n Creator</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            3 Published Blueprints on n8n.io <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
          </span>
        </div>
      </a>
    );
  }

  // Compact Pill Variant
  return (
    <a
      href={creatorUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#EA4B71]/10 via-purple-500/10 to-teal-500/10 border border-[#EA4B71]/30 hover:border-[#EA4B71]/60 shadow-2xs hover:shadow-xs transition-all duration-200 backdrop-blur-sm ${className}`}
    >
      <div className="w-4 h-4 rounded-full bg-[#EA4B71]/20 flex items-center justify-center text-[#EA4B71] shrink-0">
        <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
          <path d="M21.4737 5.6842c-1.1772 0-2.1663.8051-2.4468 1.8947h-2.8955c-1.235 0-2.289.893-2.492 2.111l-.1038.623a1.263 1.263 0 0 1-1.246 1.0555H11.289c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947s-2.1663.8051-2.4467 1.8947H4.973c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947C1.1311 9.4737 0 10.6047 0 12s1.131 2.5263 2.5263 2.5263c1.1772 0 2.1663-.8051 2.4468-1.8947h1.4223c.2804 1.0896 1.2696 1.8947 2.4467 1.8947 1.1772 0 2.1663-.8051 2.4468-1.8947h1.0008a1.263 1.263 0 0 1 1.2459 1.0555l.1038.623c.203 1.218 1.257 2.111 2.492 2.111h.3692c.2804 1.0895 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263" />
        </svg>
      </div>
      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#EA4B71] dark:group-hover:text-[#EA4B71] transition-colors flex items-center gap-1">
        Verified n8n Creator
        <CheckCircle className="w-3 h-3 text-emerald-500" />
      </span>
    </a>
  );
}
