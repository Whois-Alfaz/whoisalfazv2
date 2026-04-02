/**
 * Encode/decode audit results for shareable URLs.
 * We compress: url, overallScore, grade, and checks (name, score, status, summary)
 * into a URL-safe base64 string.
 */

export interface ShareableCheck {
  n: string;  // name
  s: number;  // score
  st: string; // status (pass/warn/fail)
  sm: string; // summary
}

export interface ShareableResult {
  u: string;  // url
  o: number;  // overallScore
  g: string;  // grade
  c: ShareableCheck[];  // checks
  t: number;  // timestamp
}

export function encodeAuditResult(results: {
  url: string;
  overallScore: number;
  grade: string;
  checks: Array<{ name: string; score: number; status: string; summary: string }>;
}): string {
  const data: ShareableResult = {
    u: results.url,
    o: results.overallScore,
    g: results.grade,
    c: results.checks.map(ch => ({
      n: ch.name,
      s: ch.score,
      st: ch.status,
      sm: ch.summary,
    })),
    t: Date.now(),
  };
  const json = JSON.stringify(data);
  // Use btoa for base64, then make URL-safe
  const base64 = typeof window !== 'undefined'
    ? btoa(unescape(encodeURIComponent(json)))
    : Buffer.from(json).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeAuditResult(hash: string): ShareableResult | null {
  try {
    // Restore standard base64
    let base64 = hash.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const json = typeof window !== 'undefined'
      ? decodeURIComponent(escape(atob(base64)))
      : Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(json) as ShareableResult;
  } catch {
    return null;
  }
}
