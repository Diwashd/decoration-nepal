'use client';

import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Search, RefreshCw, Download, Globe, FileText, Image, Link as LinkIcon, Layout } from 'lucide-react';
import Link from 'next/link';

interface AuditPage {
  url: string;
  title: { value: string; status: 'pass' | 'warning' | 'fail' };
  description: { value: string; status: 'pass' | 'warning' | 'fail' };
  ogImage: { value: string; status: 'pass' | 'warning' | 'fail' };
  h1: { value: string; status: 'pass' | 'warning' | 'fail' };
  wordCount: { value: number; status: 'pass' | 'warning' | 'fail' };
  score: number;
}

const mockAudit: AuditPage[] = [
  { url: '/', title: { value: '11:11 Decoration Nepal | Luxury Event Planning', status: 'pass' }, description: { value: 'Premium event decoration services in Nepal...', status: 'pass' }, ogImage: { value: '/og-image.jpg', status: 'pass' }, h1: { value: 'Elevate Events with Extraordinary Experiences', status: 'pass' }, wordCount: { value: 450, status: 'pass' }, score: 95 },
  { url: '/about', title: { value: 'About Us | 11:11 Decoration Nepal', status: 'pass' }, description: { value: 'A premier decorations company in Nepal...', status: 'pass' }, ogImage: { value: '/og-image.jpg', status: 'warning' }, h1: { value: 'Welcome to Eleven Eleven', status: 'pass' }, wordCount: { value: 380, status: 'pass' }, score: 88 },
  { url: '/services', title: { value: 'Our Services | 11:11 Decoration Nepal', status: 'pass' }, description: { value: 'Complete event solutions in Nepal...', status: 'pass' }, ogImage: { value: '/og-image.jpg', status: 'warning' }, h1: { value: 'We Stage Your Dreams', status: 'pass' }, wordCount: { value: 520, status: 'pass' }, score: 90 },
  { url: '/contact', title: { value: 'Contact Us | 11:11 Decoration Nepal', status: 'pass' }, description: { value: 'Book your extraordinary event today...', status: 'pass' }, ogImage: { value: '/og-image.jpg', status: 'warning' }, h1: { value: 'Book Your Extraordinary Event', status: 'pass' }, wordCount: { value: 280, status: 'warning' }, score: 85 },
  { url: '/planner', title: { value: 'Event Planner | 11:11 Decoration Nepal', status: 'pass' }, description: { value: 'Plan your dream event with our wizard...', status: 'pass' }, ogImage: { value: '/og-image.jpg', status: 'warning' }, h1: { value: 'Curate Your Masterpiece', status: 'pass' }, wordCount: { value: 150, status: 'warning' }, score: 82 },
  { url: '/blog', title: { value: 'Blog | 11:11 Decoration Nepal', status: 'pass' }, description: { value: 'Tips, guides, and inspiration...', status: 'pass' }, ogImage: { value: '/og-image.jpg', status: 'warning' }, h1: { value: 'Latest News & Updates', status: 'pass' }, wordCount: { value: 120, status: 'warning' }, score: 80 },
  { url: '/wedding-decoration', title: { value: 'Wedding Decoration in Nepal | 11:11', status: 'pass' }, description: { value: 'Complete wedding decoration services...', status: 'pass' }, ogImage: { value: '', status: 'fail' }, h1: { value: 'Wedding Decoration', status: 'pass' }, wordCount: { value: 0, status: 'fail' }, score: 60 },
  { url: '/birthday-decoration', title: { value: 'Birthday Decoration in Nepal | 11:11', status: 'pass' }, description: { value: 'Creative birthday party decorations...', status: 'pass' }, ogImage: { value: '', status: 'fail' }, h1: { value: 'Birthday Decoration', status: 'pass' }, wordCount: { value: 0, status: 'fail' }, score: 58 },
  { url: '/pasni-decoration', title: { value: 'Pasni Decoration in Nepal | 11:11', status: 'pass' }, description: { value: 'Traditional Pasni ceremony decoration...', status: 'pass' }, ogImage: { value: '', status: 'fail' }, h1: { value: 'Pasni Decoration', status: 'pass' }, wordCount: { value: 0, status: 'fail' }, score: 55 },
];

const statusIcons = { pass: CheckCircle, warning: AlertTriangle, fail: XCircle };
const statusColors = { pass: 'text-green-400', warning: 'text-yellow-400', fail: 'text-red-400' };

export default function SeoAuditPage() {
  const [audit] = useState<AuditPage[]>(mockAudit);
  const [filter, setFilter] = useState<'all' | 'pass' | 'warning' | 'fail'>('all');
  const [scanning, setScanning] = useState(false);

  const filtered = filter === 'all' ? audit : audit.filter((p) => {
    if (filter === 'fail') return p.title.status === 'fail' || p.description.status === 'fail' || p.ogImage.status === 'fail' || p.wordCount.status === 'fail';
    if (filter === 'warning') return p.title.status === 'warning' || p.description.status === 'warning' || p.ogImage.status === 'warning' || p.wordCount.status === 'warning';
    return p.title.status === 'pass' && p.description.status === 'pass' && p.ogImage.status === 'pass' && p.wordCount.status === 'pass';
  });

  const avgScore = Math.round(audit.reduce((sum, p) => sum + p.score, 0) / audit.length);
  const totalIssues = audit.reduce((sum, p) => {
    let issues = 0;
    if (p.title.status !== 'pass') issues++;
    if (p.description.status !== 'pass') issues++;
    if (p.ogImage.status !== 'pass') issues++;
    if (p.h1.status !== 'pass') issues++;
    if (p.wordCount.status !== 'pass') issues++;
    return sum + issues;
  }, 0);

  const runScan = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 2000);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cream-contrast font-display flex items-center gap-3">
            <Search className="w-8 h-8 text-primary" />
            SEO Audit
          </h1>
          <p className="text-on-surface-variant mt-1">Scan all pages for SEO issues and get fix recommendations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={runScan}
            disabled={scanning}
            className="flex items-center space-x-2 border border-outline text-on-surface-variant px-4 py-2.5 rounded hover:bg-surface-container-high disabled:opacity-50 transition font-semibold text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Scanning...' : 'Re-scan'}</span>
          </button>
          <button className="flex items-center space-x-2 border border-outline text-on-surface-variant px-4 py-2.5 rounded hover:bg-surface-container-high transition font-semibold text-sm">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-surface-container border border-outline-variant rounded-xl p-4 text-center">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Pages Scanned</p>
          <p className="text-2xl font-bold text-cream-contrast font-display mt-1">{audit.length}</p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-4 text-center">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Avg Score</p>
          <p className={`text-2xl font-bold font-display mt-1 ${avgScore >= 80 ? 'text-green-400' : avgScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{avgScore}%</p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-4 text-center">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Issues Found</p>
          <p className="text-2xl font-bold text-yellow-400 font-display mt-1">{totalIssues}</p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-4 text-center">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Passed</p>
          <p className="text-2xl font-bold text-green-400 font-display mt-1">{audit.filter((p) => p.score >= 80).length}</p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-4 text-center">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Needs Work</p>
          <p className="text-2xl font-bold text-red-400 font-display mt-1">{audit.filter((p) => p.score < 80).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pass', 'warning', 'fail'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase transition-colors ${
              filter === f ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant border border-outline-variant'
            }`}
          >
            {f === 'all' ? 'All Pages' : f === 'pass' ? '✓ Passed' : f === 'warning' ? '⚠ Warnings' : '✗ Failed'}
          </button>
        ))}
      </div>

      {/* Audit Table */}
      <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Score</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Page</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Title</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Description</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">OG Image</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Words</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((page) => {
              const Icon = statusIcons[page.score >= 80 ? 'pass' : page.score >= 60 ? 'warning' : 'fail'];
              const color = page.score >= 80 ? 'text-green-400' : page.score >= 60 ? 'text-yellow-400' : 'text-red-400';
              return (
                <tr key={page.url} className="border-b border-outline-variant/50 hover:bg-surface-container-high/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center" style={{ borderColor: page.score >= 80 ? '#22c55e' : page.score >= 60 ? '#eab308' : '#ef4444' }}>
                        <span className={`text-xs font-bold ${color}`}>{page.score}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-cream-contrast">{page.url}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {React.createElement(statusIcons[page.title.status], { className: `w-4 h-4 ${statusColors[page.title.status]}` })}
                      <span className="text-xs text-on-surface-variant truncate max-w-[200px]">{page.title.value}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {React.createElement(statusIcons[page.description.status], { className: `w-4 h-4 ${statusColors[page.description.status]}` })}
                      <span className="text-xs text-on-surface-variant truncate max-w-[200px]">{page.description.value}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {React.createElement(statusIcons[page.ogImage.status], { className: `w-4 h-4 ${statusColors[page.ogImage.status]}` })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {React.createElement(statusIcons[page.wordCount.status], { className: `w-4 h-4 ${statusColors[page.wordCount.status]}` })}
                      <span className="text-xs text-on-surface-variant">{page.wordCount.value}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link href="/admin/seo" className="text-xs text-primary hover:text-primary-container font-semibold">
                      Fix →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
