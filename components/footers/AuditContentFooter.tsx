'use client';

import { useState } from 'react';
import { Shield, Globe, Zap, Search, Server, Lock, ChevronDown, CheckCircle } from 'lucide-react';

const checks = [
  {
    icon: Zap,
    title: 'Performance & Core Web Vitals',
    color: 'text-teal-500 dark:text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    description:
      'We use the official Google PageSpeed Insights API to measure your real-world performance. This includes First Contentful Paint (FCP), Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), Total Blocking Time (TBT), and Speed Index. These Core Web Vitals directly impact your Google search rankings.',
  },
  {
    icon: Search,
    title: 'Meta Tags & Open Graph',
    color: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    description:
      'We scan your page\'s HTML head for essential SEO tags: title tag length, meta description quality, Open Graph tags (og:title, og:description, og:image), viewport configuration for mobile responsiveness, and canonical URL to prevent duplicate content issues.',
  },
  {
    icon: Lock,
    title: 'SSL Certificate',
    color: 'text-green-500 dark:text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    description:
      'We connect directly to your server\'s TLS handshake to verify your SSL certificate. We check the certificate issuer, expiration date, days remaining until renewal, and subject validity. An expired or missing SSL certificate will cause browsers to show security warnings and hurt your rankings.',
  },
  {
    icon: Shield,
    title: 'Security Headers',
    color: 'text-purple-500 dark:text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    description:
      'We verify six critical HTTP security headers: Strict-Transport-Security (HSTS), Content-Security-Policy (CSP), X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and Permissions-Policy. Missing security headers leave your website vulnerable to XSS attacks, clickjacking, and data injection.',
  },
  {
    icon: Globe,
    title: 'Robots.txt & Sitemap',
    color: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    description:
      'We fetch your /robots.txt to verify crawl directives and check for a sitemap reference. We also fetch /sitemap.xml to confirm it exists and count the number of indexed URLs. A missing or misconfigured sitemap prevents search engines from discovering your pages.',
  },
  {
    icon: Server,
    title: 'DNS & Connectivity',
    color: 'text-rose-500 dark:text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    description:
      'We resolve your domain\'s A and AAAA records, measure DNS lookup latency, detect CDN usage via multiple IP addresses, check IPv6 support, and identify redirect chains. Slow DNS resolution or unnecessary redirects add latency to every page load.',
  },
];

const tips = [
  'Enable HSTS and configure a Content-Security-Policy header to protect against XSS and clickjacking attacks.',
  'Compress images to WebP or AVIF format and lazy-load below-the-fold content to improve your PageSpeed score.',
  'Create a complete sitemap.xml listing all important pages and reference it in your robots.txt file.',
  'Write a meta title between 50-60 characters and a meta description between 120-160 characters for every page.',
  'Set up automatic SSL certificate renewal to prevent expiration warnings that drive visitors away.',
  'Use a Content Delivery Network (CDN) to reduce DNS latency and serve assets from edge locations globally.',
];

const faqs = [
  {
    q: 'Is this website audit tool free?',
    a: 'Yes, completely free. You can run unlimited audits without creating an account or entering any payment information. Optionally provide your email to receive a copy of your results.',
  },
  {
    q: 'How accurate is this website audit?',
    a: 'We use the official Google PageSpeed Insights API for performance data and connect directly to your server for SSL, DNS, and security header checks. The results reflect real-world conditions, not simulated tests.',
  },
  {
    q: 'What is a good website audit score?',
    a: 'A score of 80 or above is considered good. Scores of 90+ are excellent. Anything below 50 indicates critical issues that are likely hurting your search rankings and user experience.',
  },
  {
    q: 'How often should I audit my website?',
    a: 'We recommend running an audit after every major deployment, design change, or at least once a month. SSL certificates, security headers, and performance can change without you noticing.',
  },
  {
    q: 'What should I fix first if my score is low?',
    a: 'Start with critical security issues (missing SSL, no security headers), then fix SEO fundamentals (title tags, meta descriptions, sitemap), and finally optimize performance (image compression, lazy loading, CDN).',
  },
];

export default function AuditContentFooter() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="max-w-6xl mx-auto mt-32 space-y-32">
      {/* ─── WHAT DOES THIS TOOL CHECK? ─── */}
      <div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight text-center transition-colors duration-300">
          What Does This Tool <span className="text-teal-600 dark:text-blue-500">Check?</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-2xl mx-auto mb-16 leading-relaxed transition-colors duration-300">
          Our free website audit runs six independent checks against your site using real API connections, not simulated data.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checks.map((check) => (
            <div
              key={check.title}
              className={`p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 group shadow-sm dark:shadow-none`}
            >
              <div
                className={`w-12 h-12 rounded-xl ${check.bg} border ${check.border} flex items-center justify-center ${check.color} mb-5 group-hover:scale-110 transition-transform`}
              >
                <check.icon size={22} />
              </div>
              <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-3 uppercase tracking-tight transition-colors">
                {check.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors">{check.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── HOW TO IMPROVE YOUR SCORE ─── */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight text-center transition-colors duration-300">
          How to Improve Your <span className="text-teal-600 dark:text-teal-500">Website Score</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-2xl mx-auto mb-12 leading-relaxed transition-colors duration-300">
          If your audit score is below 80, start with these high-impact fixes.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="flex gap-4 p-5 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-teal-500/20 transition-all shadow-sm dark:shadow-none"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 dark:text-teal-400">
                <CheckCircle size={16} />
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium transition-colors">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FREQUENTLY ASKED QUESTIONS ─── */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight text-center transition-colors duration-300">
          Frequently Asked <span className="text-purple-600 dark:text-purple-500">Questions</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-2xl mx-auto mb-12 leading-relaxed transition-colors duration-300">
          Everything you need to know about this free website audit tool.
        </p>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-purple-500/30 bg-purple-50 dark:bg-purple-500/5'
                    : 'border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/10'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-slate-900 dark:text-white font-bold text-[15px] transition-colors">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-500 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-purple-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 -mt-1">
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
