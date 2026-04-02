import Link from 'next/link';
import { ArrowRight, Search, Zap } from 'lucide-react';

export default function DefaultContentFooter() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-5">
          <Link
            href="/audit"
            className="group p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-teal-500/30 dark:hover:border-teal-500/20 transition-all hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 dark:text-teal-400 mb-5 group-hover:scale-110 transition-transform">
              <Search size={22} />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2 uppercase tracking-tight transition-colors">
              Free Website Audit
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 transition-colors">
              Check your SEO score, page speed, SSL, and security headers in 30 seconds. No signup needed.
            </p>
            <span className="text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
              Run Audit <ArrowRight size={14} />
            </span>
          </Link>

          <Link
            href="/services"
            className="group p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-purple-500/30 dark:hover:border-purple-500/20 transition-all hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-none"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 dark:text-purple-400 mb-5 group-hover:scale-110 transition-transform">
              <Zap size={22} />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2 uppercase tracking-tight transition-colors">
              Automation Solutions
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 transition-colors">
              Custom n8n workflows, AI agents, and full-stack applications built for agencies and SaaS.
            </p>
            <span className="text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
              View Services <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
