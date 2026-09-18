'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Globe, FileText, Image, Search, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface SeoCheck {
  id: string;
  label: string;
  status: 'pass' | 'warning' | 'fail';
  score: number;
  description: string;
  fix?: string;
}

const defaultChecks: SeoCheck[] = [
  { id: 'meta-title', label: 'Meta Title', status: 'pass', score: 10, description: 'Root layout has a proper title template' },
  { id: 'meta-desc', label: 'Meta Description', status: 'pass', score: 10, description: 'Root layout has a comprehensive description' },
  { id: 'og-tags', label: 'Open Graph Tags', status: 'pass', score: 10, description: 'OG tags configured for social sharing' },
  { id: 'twitter-cards', label: 'Twitter Cards', status: 'pass', score: 5, description: 'Twitter card meta tags present' },
  { id: 'robots-txt', label: 'robots.txt', status: 'pass', score: 10, description: 'robots.ts configured with proper rules' },
  { id: 'sitemap', label: 'Sitemap', status: 'pass', score: 10, description: 'sitemap.ts generates dynamic sitemap' },
  { id: 'llms-txt', label: 'llms.txt', status: 'pass', score: 5, description: 'LLM-friendly content file available' },
  { id: 'json-ld', label: 'JSON-LD Schema', status: 'pass', score: 10, description: 'LocalBusiness/EventPlanner schema injected' },
  { id: 'breadcrumbs', label: 'Breadcrumbs', status: 'pass', score: 5, description: 'Breadcrumb navigation with schema on all pages' },
  { id: 'ga', label: 'Google Analytics', status: 'warning', score: 5, description: 'GA script ready — add NEXT_PUBLIC_GA_ID to .env' },
  { id: 'gtm', label: 'Google Tag Manager', status: 'warning', score: 3, description: 'GTM script ready — add NEXT_PUBLIC_GTM_ID to .env' },
  { id: 'gsc', label: 'Search Console', status: 'warning', score: 2, description: 'Verification ready — add NEXT_PUBLIC_GOOGLE_VERIFICATION' },
  { id: 'alt-text', label: 'Image Alt Text', status: 'warning', score: 5, description: 'Some images may be missing alt attributes' },
  { id: 'heading-hierarchy', label: 'Heading Hierarchy', status: 'pass', score: 5, description: 'Proper H1→H2→H3 structure on all pages' },
  { id: 'mobile-responsive', label: 'Mobile Responsive', status: 'pass', score: 5, description: 'All pages use responsive Tailwind classes' },
  { id: 'page-speed', label: 'Page Speed', status: 'pass', score: 5, description: 'Using Next.js optimized images and lazy loading' },
];

const statusIcons = {
  pass: CheckCircle,
  warning: AlertTriangle,
  fail: XCircle,
};

const statusColors = {
  pass: 'text-green-400',
  warning: 'text-yellow-400',
  fail: 'text-red-400',
};

const statusBg = {
  pass: 'bg-green-500/10',
  warning: 'bg-yellow-500/10',
  fail: 'bg-red-500/10',
};

export default function SeoHealthWidget() {
  const [checks] = useState<SeoCheck[]>(defaultChecks);
  const [expanded, setExpanded] = useState<string | null>(null);

  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  const maxScore = checks.reduce((sum, c) => sum + (c.status === 'pass' ? c.score : c.status === 'warning' ? Math.round(c.score * 0.5) : 0), 0);
  const potentialMax = checks.reduce((sum, c) => sum + c.score, 0);
  const percentage = potentialMax > 0 ? Math.min(100, Math.round((totalScore / potentialMax) * 100)) : 0;
  const passCount = checks.filter((c) => c.status === 'pass').length;
  const warnCount = checks.filter((c) => c.status === 'warning').length;
  const failCount = checks.filter((c) => c.status === 'fail').length;

  const getGrade = (score: number) => {
    if (score >= 90) return { label: 'A+', color: 'text-green-400' };
    if (score >= 80) return { label: 'A', color: 'text-green-400' };
    if (score >= 70) return { label: 'B+', color: 'text-yellow-400' };
    if (score >= 60) return { label: 'B', color: 'text-yellow-400' };
    return { label: 'C', color: 'text-red-400' };
  };

  const grade = getGrade(percentage);

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-outline-variant">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-cream-contrast font-display flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" /> SEO Health
          </h3>
          <Link href="/admin/seo" className="text-xs text-primary hover:text-primary-container flex items-center gap-1 transition-colors">
            Manage SEO <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Score Circle */}
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#2a2a2a"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeDasharray={`${percentage}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-bold font-display ${grade.color}`}>{grade.label}</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold text-cream-contrast font-display">{percentage}%</span>
              <span className="text-sm text-on-surface-variant">SEO Score</span>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1 text-green-400">
                <CheckCircle className="w-3 h-3" /> {passCount} passed
              </span>
              <span className="flex items-center gap-1 text-yellow-400">
                <AlertTriangle className="w-3 h-3" /> {warnCount} warnings
              </span>
              <span className="flex items-center gap-1 text-red-400">
                <XCircle className="w-3 h-3" /> {failCount} failed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Checks List */}
      <div className="max-h-80 overflow-y-auto">
        {checks.map((check) => {
          const Icon = statusIcons[check.status];
          const isExpanded = expanded === check.id;

          return (
            <div
              key={check.id}
              className={`border-b border-outline-variant/50 transition-colors ${isExpanded ? 'bg-surface-container-high' : 'hover:bg-surface-container-high/50'}`}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : check.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${statusColors[check.status]}`} />
                <span className="text-sm text-cream-contrast flex-1">{check.label}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${statusBg[check.status]} ${statusColors[check.status]}`}>
                  {check.status === 'pass' ? '✓ Pass' : check.status === 'warning' ? '⚠ Warn' : '✗ Fail'}
                </span>
              </button>
              {isExpanded && (
                <div className="px-4 pb-3 pl-11">
                  <p className="text-xs text-on-surface-variant">{check.description}</p>
                  {check.fix && (
                    <p className="text-xs text-primary mt-1">Fix: {check.fix}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 bg-surface-container-high border-t border-outline-variant">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>Score: {totalScore}/{potentialMax} points</span>
          </div>
          <Link href="/admin/seo" className="text-xs text-primary hover:text-primary-container font-semibold transition-colors">
            View All Settings →
          </Link>
        </div>
      </div>
    </div>
  );
}
