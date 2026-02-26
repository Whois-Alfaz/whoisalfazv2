'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, CheckCircle, AlertCircle, AlertTriangle, Mail, ExternalLink, ChevronDown, Shield, Globe, Zap, Search, Server, Lock } from 'lucide-react';

const scanSteps = [
  "Resolving DNS & connectivity...",
  "Verifying SSL certificate...",
  "Analyzing meta tags & Open Graph...",
  "Scanning security headers...",
  "Checking robots.txt & sitemap...",
  "Running PageSpeed analysis...",
  "Calculating final scores...",
];

const checkIcons = {
  'Performance & Core Web Vitals': Zap,
  'Meta Tags & Open Graph': Search,
  'SSL Certificate': Lock,
  'Security Headers': Shield,
  'Robots.txt & Sitemap': Globe,
  'DNS & Connectivity': Server,
};

// SVG Score Ring
function ScoreRing({ score, size = 130, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.2s ease-out' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-white">{score}</span>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">/ 100</span>
      </div>
    </div>
  );
}

export default function AuditTool() {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [scanStep, setScanStep] = useState('');
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [expandedChecks, setExpandedChecks] = useState({});

  const toggleCheck = (i) => setExpandedChecks(prev => ({ ...prev, [i]: !prev[i] }));

  const runAudit = async (e) => {
    e.preventDefault();
    if (!url) return;
    setStatus('loading');
    setResults(null);
    setErrorMsg('');
    setExpandedChecks({});

    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < scanSteps.length) {
        setScanStep(scanSteps[stepIndex]);
        stepIndex++;
      }
    }, 3000);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, name: name || 'Audit User', email }),
      });

      clearInterval(stepInterval);
      const data = await response.json();

      if (response.ok && data.success) {
        setResults(data.results);
        setStatus('results');
      } else {
        setErrorMsg(data.error || 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      clearInterval(stepInterval);
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  const getStatusBorderColor = (s) => {
    if (s === 'pass') return 'border-green-500/15 hover:border-green-500/30';
    if (s === 'warn') return 'border-amber-500/15 hover:border-amber-500/30';
    return 'border-red-500/15 hover:border-red-500/30';
  };

  const getIconBg = (s) => {
    if (s === 'pass') return 'bg-green-500/10 text-green-400';
    if (s === 'warn') return 'bg-amber-500/10 text-amber-400';
    return 'bg-red-500/10 text-red-400';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  // ─── FORM STATE ──────────────────────────────────────────
  if (status === 'idle') {
    return (
      <div className="w-full max-w-lg mx-auto bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl my-12 relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />
        <form onSubmit={runAudit} className="space-y-6 relative z-10">
          <div className="space-y-1 text-center">
            <h3 className="text-2xl font-bold text-white tracking-tight">Run Free Audit</h3>
            <p className="text-slate-400 text-sm">Real-time analysis. No fluff. Actual data.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Website URL</label>
              <input type="url" placeholder="https://example.com" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-200" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-200" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                <input type="email" placeholder="you@company.com" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-200" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]">
              Start Analysis <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ─── LOADING STATE ──────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="w-full max-w-lg mx-auto bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl my-12 relative overflow-hidden">
        <div className="py-12 flex flex-col items-center justify-center min-h-[320px]">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-15 animate-pulse rounded-full scale-150" />
            <Loader2 className="animate-spin text-blue-500 relative" size={52} />
          </div>
          <p className="font-semibold text-white text-lg mb-2">Analyzing your site...</p>
          <div className="h-5">
            <p className="text-slate-500 font-mono text-xs animate-pulse">{scanStep}</p>
          </div>
          <div className="w-48 h-1 bg-white/5 rounded-full mt-8 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full animate-[progress_20s_ease-in-out_forwards]" />
          </div>
          <p className="text-slate-600 text-[10px] mt-4 uppercase tracking-widest">This may take up to 30 seconds</p>
        </div>
      </div>
    );
  }

  // ─── RESULTS STATE ──────────────────────────────────────
  if (status === 'results' && results) {
    const passCount = results.checks.filter(c => c.status === 'pass').length;
    const warnCount = results.checks.filter(c => c.status === 'warn').length;
    const failCount = results.checks.filter(c => c.status === 'fail').length;

    return (
      <div className="w-full max-w-3xl mx-auto my-12 space-y-4">

        {/* ─── Score Overview ─── */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing score={results.overallScore} />

            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <span className={`text-2xl font-black ${getScoreColor(results.overallScore)}`}>Grade {results.grade}</span>
                <p className="text-slate-600 text-xs font-mono mt-1 truncate">{results.url}</p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {passCount > 0 && <span className="flex items-center gap-1 text-[11px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full"><CheckCircle size={10} />{passCount} Passed</span>}
                {warnCount > 0 && <span className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full"><AlertTriangle size={10} />{warnCount} Warning{warnCount > 1 ? 's' : ''}</span>}
                {failCount > 0 && <span className="flex items-center gap-1 text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full"><AlertCircle size={10} />{failCount} Failed</span>}
              </div>

              <p className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] text-teal-400/70">
                <Mail size={11} /> Detailed report sent to {email}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Checks Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {results.checks.map((check, i) => {
            const isOpen = expandedChecks[i];
            const Icon = checkIcons[check.name] || Globe;

            return (
              <div key={i} className={`bg-white/[0.03] border rounded-xl transition-all duration-200 ${getStatusBorderColor(check.status)} ${isOpen ? 'md:col-span-2' : ''}`}>
                <button onClick={() => toggleCheck(i)} className="w-full flex items-center gap-3 p-4 text-left">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconBg(check.status)}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-white font-semibold text-sm block">{check.name}</span>
                    <p className="text-slate-500 text-[11px] mt-0.5 truncate">{check.summary}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-sm font-bold tabular-nums ${getScoreColor(check.score)}`}>{check.score}</span>
                    <ChevronDown size={14} className={`text-slate-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-white/5">
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-3 mb-4">
                      <div className={`h-full rounded-full ${check.score >= 80 ? 'bg-green-500' : check.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${check.score}%`, transition: 'width 0.8s ease' }} />
                    </div>
                    <div className="space-y-1.5">
                      {check.details.map((detail, j) => {
                        const isFail = detail.startsWith('❌');
                        const isWarn = detail.startsWith('⚠️') || detail.startsWith('💡');
                        return (
                          <div key={j} className={`px-3 py-2 rounded-lg text-xs font-mono leading-relaxed ${isFail ? 'bg-red-500/5 text-red-300/90' : isWarn ? 'bg-amber-500/5 text-amber-300/90' : 'bg-white/[0.02] text-slate-400'}`}>
                            {detail}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── Actions ─── */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button onClick={() => { setStatus('idle'); setResults(null); setExpandedChecks({}); }} className="flex-1 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-all text-center font-medium">
            Analyze Another URL
          </button>
          <a href="/contact/" className="flex-1 px-5 py-3 rounded-xl bg-teal-500 text-black font-bold text-sm hover:bg-teal-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10">
            Discuss Results <ExternalLink size={14} />
          </a>
        </div>
      </div>
    );
  }

  // ─── ERROR STATE ────────────────────────────────────────
  return (
    <div className="w-full max-w-lg mx-auto bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl my-12 relative overflow-hidden">
      <div className="py-10 space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20">
          <AlertCircle className="text-red-400" size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">Audit Failed</h3>
          <p className="text-slate-400 max-w-xs mx-auto text-sm">{errorMsg || 'Could not complete the analysis. The URL may be unreachable.'}</p>
        </div>
        <button onClick={() => setStatus('idle')} className="text-sm text-slate-500 hover:text-white transition-colors underline decoration-slate-800 underline-offset-4">Try Again</button>
      </div>
    </div>
  );
}
