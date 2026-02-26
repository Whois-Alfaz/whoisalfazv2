'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, CheckCircle, AlertCircle, AlertTriangle, Mail, ExternalLink } from 'lucide-react';

const scanSteps = [
  "Resolving DNS...",
  "Checking SSL certificate...",
  "Analyzing meta tags...",
  "Scanning security headers...",
  "Fetching sitemap & robots.txt...",
  "Running PageSpeed analysis...",
  "Calculating scores...",
];

export default function AuditTool({ source = 'audit_tool' }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | results | error
  const [scanStep, setScanStep] = useState('');
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const runAudit = async (e) => {
    e.preventDefault();
    if (!url) return;
    setStatus('loading');
    setResults(null);
    setErrorMsg('');

    // Start visual progress
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < scanSteps.length) {
        setScanStep(scanSteps[stepIndex]);
        stepIndex++;
      }
    }, 2500);

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
    } catch (error) {
      clearInterval(stepInterval);
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20';
    if (score >= 50) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  const getStatusIcon = (checkStatus) => {
    if (checkStatus === 'pass') return <CheckCircle size={16} className="text-green-400" />;
    if (checkStatus === 'warn') return <AlertTriangle size={16} className="text-amber-400" />;
    return <AlertCircle size={16} className="text-red-400" />;
  };

  const getGradeRing = (score) => {
    if (score >= 80) return 'border-green-500 text-green-400';
    if (score >= 50) return 'border-amber-500 text-amber-400';
    return 'border-red-500 text-red-400';
  };

  // ─── FORM STATE ──────────────────────────────────────────
  if (status === 'idle') {
    return (
      <div className="w-full max-w-lg mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl my-12 relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>

        <form onSubmit={runAudit} className="space-y-6 relative z-10">
          <div className="space-y-1 text-center">
            <h3 className="text-2xl font-bold text-white tracking-tight">Run Free Audit</h3>
            <p className="text-slate-400 text-sm">Real-time analysis. No fluff. Actual data.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Website URL</label>
              <input
                type="url" placeholder="https://example.com" required
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-200"
                value={url} onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Name</label>
                <input
                  type="text" placeholder="John Doe"
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-200"
                  value={name} onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                <input
                  type="email" placeholder="you@company.com" required
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white placeholder:text-slate-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all duration-200"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
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
      <div className="w-full max-w-lg mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl my-12 relative overflow-hidden">
        <div className="text-sm space-y-6 py-10 flex flex-col items-center justify-center min-h-[300px] relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse"></div>
            <Loader2 className="animate-spin text-blue-500 relative" size={48} />
          </div>
          <div className="space-y-2 text-center">
            <p className="font-medium text-white text-lg animate-pulse">Analyzing...</p>
            <p className="text-slate-500 font-mono text-xs">{scanStep}</p>
            <p className="text-slate-600 text-xs mt-4">This takes 15-30 seconds (real API calls)</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS STATE ──────────────────────────────────────
  if (status === 'results' && results) {
    return (
      <div className="w-full max-w-2xl mx-auto my-12 space-y-6">
        {/* Overall Score Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50"></div>

          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 ${getGradeRing(results.overallScore)} mb-4`}>
            <span className="text-4xl font-black">{results.grade}</span>
          </div>

          <p className="text-white text-xl font-bold">{results.overallScore}/100</p>
          <p className="text-slate-500 text-xs font-mono mt-1">{results.url}</p>

          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-teal-400">
            <Mail size={14} />
            <span>Full report sent to {email}</span>
          </div>
        </div>

        {/* Individual Checks */}
        <div className="grid gap-4">
          {results.checks.map((check, i) => (
            <details key={i} className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden group`}>
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <span className="text-white font-medium text-sm">{check.name}</span>
                </div>
                <span className={`text-sm font-bold ${getScoreColor(check.score)} ${getScoreBg(check.score)} px-3 py-1 rounded-full border`}>
                  {check.score}/100
                </span>
              </summary>
              <div className="px-4 pb-4 border-t border-white/5">
                <p className="text-slate-400 text-sm mt-3 mb-3">{check.summary}</p>
                <ul className="space-y-1.5">
                  {check.details.map((detail, j) => (
                    <li key={j} className="text-xs text-slate-500 font-mono leading-relaxed">{detail}</li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => { setStatus('idle'); setResults(null); }}
            className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-all text-center"
          >
            Analyze Another URL
          </button>
          <a
            href="/contact"
            className="flex-1 px-6 py-3 rounded-xl bg-teal-500 text-black font-bold text-sm hover:bg-teal-400 transition-all flex items-center justify-center gap-2"
          >
            Discuss Results <ExternalLink size={14} />
          </a>
        </div>
      </div>
    );
  }

  // ─── ERROR STATE ────────────────────────────────────────
  return (
    <div className="w-full max-w-lg mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl my-12 relative overflow-hidden">
      <div className="py-8 space-y-6 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
          <AlertCircle className="text-red-400" size={32} />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">Audit Failed</h3>
          <p className="text-slate-400 max-w-xs mx-auto text-sm">{errorMsg || 'Could not complete the analysis. The URL may be unreachable.'}</p>
        </div>

        <button onClick={() => setStatus('idle')} className="text-sm text-slate-500 hover:text-white transition-colors underline decoration-slate-800 underline-offset-4">
          Try Again
        </button>
      </div>
    </div>
  );
}
