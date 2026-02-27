'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, CheckCircle, AlertCircle, AlertTriangle, Mail, ExternalLink, ChevronDown, Shield, Globe, Zap, Search, Server, Lock } from 'lucide-react';

const scanSteps = [
  "Resolving DNS & connectivity...",
  "Verifying SSL certificate...",
  "Analyzing meta tags & Open Graph...",
  "Scanning security headers...",
  "Checking robots.txt & sitemap...",
  "Analyzing core vitality metrics...",
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

  // ─── MAIN LAYOUT ──────────────────────────────────────────
  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start w-full">
      {/* LEFT COLUMN: FORM */}
      <div className="w-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />
        <form onSubmit={runAudit} className="space-y-6 relative z-10">
          <div className="space-y-1 text-center lg:text-left">
            <h3 className="text-2xl font-bold text-white tracking-tight">Run Free Audit</h3>
            <p className="text-slate-400 text-sm">Real-time analysis. No fluff. Actual data.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Website URL</label>
              <input type="url" placeholder="https://example.com" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-200" value={url} onChange={(e) => setUrl(e.target.value)} disabled={status === 'loading'} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-200" value={name} onChange={(e) => setName(e.target.value)} disabled={status === 'loading'} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                <input type="email" placeholder="you@company.com" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-200" value={email} onChange={(e) => setEmail(e.target.value)} disabled={status === 'loading'} />
              </div>
            </div>
            <button type="submit" disabled={status === 'loading'} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]">
              {status === 'loading' ? 'Analyzing...' : 'Start Analysis'} <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT COLUMN: DYNAMIC CONTENT (Intro stats, Loading, Results, or Error) */}
      <div className="w-full h-full min-h-[400px]">
        {status === 'idle' && (
          <div className="hidden lg:flex relative h-full w-full bg-black/30 rounded-2xl border border-white/5 p-8 flex-col justify-center gap-6 shadow-inner">
            <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/5 transition-all hover:bg-white/[0.04]">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]"><Zap size={22} /></div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Workflow Speed</div>
                <div className="text-white font-bold text-lg tracking-tight">Increased by 300%</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/5 transition-all hover:bg-white/[0.04]">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]"><Search size={22} /></div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">SEO Score</div>
                <div className="text-white font-bold text-lg tracking-tight">98/100 Optimized</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/5 transition-all hover:bg-white/[0.04]">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]"><BarChart3 size={22} /></div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Revenue Growth</div>
                <div className="text-white font-bold text-lg tracking-tight">+25% Month over Month</div>
              </div>
            </div>
          </div>
        )}

        {status === 'loading' && (
          <div className="w-full h-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-15 animate-pulse rounded-full scale-150" />
              <Loader2 className="animate-spin text-blue-500 relative" size={52} />
            </div>
            <p className="font-semibold text-white text-lg mb-2">Analyzing your site...</p>
            <div className="h-5">
              <p className="text-slate-500 font-mono text-xs animate-pulse text-center">{scanStep}</p>
            </div>
            <div className="w-48 h-1 bg-white/5 rounded-full mt-8 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full animate-[progress_20s_ease-in-out_forwards]" />
            </div>
            <p className="text-slate-600 text-[10px] mt-4 uppercase tracking-widest text-center">This may take up to 30 seconds</p>
          </div>
        )}

        {status === 'error' && (
          <div className="w-full h-full bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden flex flex-col justify-center items-center min-h-[400px]">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <AlertCircle className="text-red-400" size={32} />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-bold text-white">Audit Failed</h3>
              <p className="text-slate-400 max-w-xs mx-auto text-sm">{errorMsg || 'Could not complete the analysis. The URL may be unreachable.'}</p>
            </div>
          </div>
        )}

        {status === 'results' && results && (
          <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Score Overview */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ScoreRing score={results.overallScore} size={100} strokeWidth={6} />
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div>
                    <span className={`text-xl font-black ${getScoreColor(results.overallScore)}`}>Grade {results.grade}</span>
                    <p className="text-slate-600 text-[10px] font-mono mt-0.5 truncate">{results.url}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    {results.checks.filter(c => c.status === 'pass').length > 0 && <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full"><CheckCircle size={10} />{results.checks.filter(c => c.status === 'pass').length} Passed</span>}
                    {results.checks.filter(c => c.status === 'warn').length > 0 && <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full"><AlertTriangle size={10} />{results.checks.filter(c => c.status === 'warn').length} Warn</span>}
                    {results.checks.filter(c => c.status === 'fail').length > 0 && <span className="flex items-center gap-1 text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full"><AlertCircle size={10} />{results.checks.filter(c => c.status === 'fail').length} Failed</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Checks List */}
            <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {results.checks.map((check, i) => {
                const isOpen = expandedChecks[i];
                const Icon = checkIcons[check.name] || Globe;
                return (
                  <div key={i} className={`bg-white/[0.03] border rounded-xl transition-all duration-300 ${getStatusBorderColor(check.status)} ${isOpen ? 'bg-white/[0.05] ring-1 ring-white/10' : ''}`}>
                    <button onClick={() => toggleCheck(i)} className="w-full flex items-center justify-between gap-4 p-4 text-left">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconBg(check.status)}`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-white font-bold text-sm block tracking-tight">{check.name}</span>
                          <p className="text-slate-500 text-[10px] mt-0.5 truncate">{check.summary}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 border-l border-white/10 pl-3">
                        <div className="flex flex-col items-end">
                          <span className={`text-sm font-black tabular-nums ${getScoreColor(check.score)}`}>{check.score}</span>
                          <span className="text-[8px] text-slate-600 uppercase tracking-tighter font-bold">Score</span>
                        </div>
                        <ChevronDown size={14} className={`text-slate-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 border-t border-white/5 bg-black/10 rounded-b-xl">
                        <div className="pt-4 space-y-3">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-end mb-1">
                              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Performance Metric</span>
                              <span className={`text-[10px] font-bold ${getScoreColor(check.score)}`}>{check.score}%</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${check.score >= 80 ? 'bg-green-500' : check.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${check.score}%`, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            {check.details.map((detail, j) => {
                              const isFail = detail.startsWith('❌');
                              const isWarn = detail.startsWith('⚠️') || detail.startsWith('💡');
                              return (
                                <div key={j} className={`p-3 rounded-lg text-[10px] font-mono leading-relaxed border ${isFail ? 'bg-red-500/5 border-red-500/10 text-red-300/90' : isWarn ? 'bg-amber-500/5 border-amber-500/10 text-amber-300/90' : 'bg-white/[0.02] border-white/5 text-slate-400'}`}>
                                  {detail}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <a href="/contact/" className="w-full px-5 py-3 rounded-xl bg-teal-500 text-black font-bold text-sm hover:bg-teal-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10 mt-2">
              Discuss Results <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
