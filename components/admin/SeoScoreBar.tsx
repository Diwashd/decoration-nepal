'use client';

import { useMemo } from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface SeoScoreBarProps {
  title: string;
  description: string;
  keywords: string;
  slug?: string;
  showDetails?: boolean;
}

interface SeoIssue {
  type: 'pass' | 'warning' | 'fail';
  message: string;
}

export default function SeoScoreBar({ title, description, keywords, slug, showDetails = true }: SeoScoreBarProps) {
  const analysis = useMemo(() => {
    const issues: SeoIssue[] = [];
    let score = 0;

    // Title checks
    const titleLen = title.length;
    if (titleLen === 0) {
      issues.push({ type: 'fail', message: 'Title is missing' });
    } else if (titleLen < 30) {
      issues.push({ type: 'warning', message: `Title is too short (${titleLen}/60)` });
      score += 2;
    } else if (titleLen <= 60) {
      issues.push({ type: 'pass', message: `Title length is good (${titleLen}/60)` });
      score += 10;
    } else {
      issues.push({ type: 'warning', message: `Title is too long (${titleLen}/60) — may be truncated in search results` });
      score += 5;
    }

    // Description checks
    const descLen = description.length;
    if (descLen === 0) {
      issues.push({ type: 'fail', message: 'Meta description is missing' });
    } else if (descLen < 120) {
      issues.push({ type: 'warning', message: `Description is short (${descLen}/160)` });
      score += 4;
    } else if (descLen <= 160) {
      issues.push({ type: 'pass', message: `Description length is good (${descLen}/160)` });
      score += 10;
    } else {
      issues.push({ type: 'warning', message: `Description is too long (${descLen}/160) — may be truncated` });
      score += 5;
    }

    // Keywords check
    const keywordList = keywords.split(',').map((k) => k.trim()).filter(Boolean);
    if (keywordList.length === 0) {
      issues.push({ type: 'warning', message: 'No keywords defined' });
    } else if (keywordList.length < 3) {
      issues.push({ type: 'warning', message: `Only ${keywordList.length} keyword(s) — add more for better coverage` });
      score += 3;
    } else {
      issues.push({ type: 'pass', message: `${keywordList.length} keywords defined` });
      score += 5;
    }

    // Title contains primary keyword
    if (keywordList.length > 0 && title) {
      const primaryKeyword = keywordList[0].toLowerCase();
      if (title.toLowerCase().includes(primaryKeyword)) {
        issues.push({ type: 'pass', message: 'Title contains primary keyword' });
        score += 5;
      } else {
        issues.push({ type: 'warning', message: 'Title doesn\'t contain primary keyword' });
        score += 2;
      }
    }

    // Description contains keyword
    if (keywordList.length > 0 && description) {
      const hasKeyword = keywordList.some((k) => description.toLowerCase().includes(k.toLowerCase()));
      if (hasKeyword) {
        issues.push({ type: 'pass', message: 'Description contains target keywords' });
        score += 5;
      } else {
        issues.push({ type: 'warning', message: 'Description doesn\'t contain any target keywords' });
        score += 2;
      }
    }

    // Slug check
    if (slug) {
      if (slug.includes('_')) {
        issues.push({ type: 'warning', message: 'Slug contains underscores — use hyphens instead' });
      } else if (slug.length > 75) {
        issues.push({ type: 'warning', message: 'Slug is very long — consider shortening' });
      } else {
        issues.push({ type: 'pass', message: 'Slug looks good' });
        score += 3;
      }
    }

    // Cap at 100
    score = Math.min(100, score);

    const passCount = issues.filter((i) => i.type === 'pass').length;
    const warnCount = issues.filter((i) => i.type === 'warning').length;
    const failCount = issues.filter((i) => i.type === 'fail').length;

    const getGrade = (s: number) => {
      if (s >= 90) return { label: 'A+', color: 'text-green-400', bg: 'bg-green-500' };
      if (s >= 80) return { label: 'A', color: 'text-green-400', bg: 'bg-green-500' };
      if (s >= 70) return { label: 'B+', color: 'text-yellow-400', bg: 'bg-yellow-500' };
      if (s >= 60) return { label: 'B', color: 'text-yellow-400', bg: 'bg-yellow-500' };
      if (s >= 40) return { label: 'C', color: 'text-orange-400', bg: 'bg-orange-500' };
      return { label: 'D', color: 'text-red-400', bg: 'bg-red-500' };
    };

    return { issues, score, passCount, warnCount, failCount, grade: getGrade(score) };
  }, [title, description, keywords, slug]);

  return (
    <div className="bg-surface-container-high rounded-lg p-4 border border-outline-variant/30">
      {/* Score Bar */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <div className="h-2 bg-surface rounded-full overflow-hidden">
            <div
              className={`h-full ${analysis.grade.bg} transition-all duration-500`}
              style={{ width: `${analysis.score}%` }}
            />
          </div>
        </div>
        <span className={`text-lg font-bold font-display ${analysis.grade.color}`}>{analysis.grade.label}</span>
        <span className="text-xs text-on-surface-variant">{analysis.score}/100</span>
      </div>

      {/* Issues */}
      {showDetails && (
        <div className="space-y-1.5">
          {analysis.issues.map((issue, i) => {
            const Icon = issue.type === 'pass' ? CheckCircle : issue.type === 'warning' ? AlertTriangle : XCircle;
            const color = issue.type === 'pass' ? 'text-green-400' : issue.type === 'warning' ? 'text-yellow-400' : 'text-red-400';
            return (
              <div key={i} className="flex items-start gap-2">
                <Icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${color}`} />
                <span className="text-xs text-on-surface-variant">{issue.message}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-outline-variant/30 text-xs">
        <span className="text-green-400">{analysis.passCount} passed</span>
        <span className="text-yellow-400">{analysis.warnCount} warnings</span>
        {analysis.failCount > 0 && <span className="text-red-400">{analysis.failCount} failed</span>}
      </div>
    </div>
  );
}
