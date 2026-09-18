'use client';

import { useState } from 'react';
import { Save, FileText, Eye, Edit3, Globe, Info } from 'lucide-react';
import { Bot } from 'lucide-react';

const defaultContent = `# Eleven Eleven Decoration Nepal — llms.txt

> Eleven Eleven (11:11) is a premier decorations and event management company in Nepal, associated with Naulo Koseli (NK). We provide turnkey event solutions including decoration, venue finding, photography, catering, makeup, and entertainment across Kathmandu, Pokhara, and Chitwan.

## Core Services
- Decoration (stage, entrance gate, mandap, backdrop, balloons, florals)
- Venue Finding (party palaces, hotels, resorts, gardens)
- Photo & Video (wedding photography, cinematic video, drone, photo booth)
- Makeup Artist (bridal, party, airbrush, hair styling)
- Band Baja (live band, DJ, sound system, LED screens)
- Catering (buffet, sit-down, live counters, custom menus)

## Event Types
- Wedding, Birthday, Anniversary, Pasni, Haldi/Mehendi
- Date Planner, Surprise Plan, Proposal Setup
- Corporate Event, Inauguration Ceremony

## Locations
- Kathmandu Valley (heritage palaces, luxury hotels)
- Pokhara (lakeside resorts, mountain views)
- Chitwan (jungle lodges, riverside resorts)

## Contact
- Phone: +977-9847411305
- Email: event.eleveneleven@gmail.com
- Address: Jawalakhel, Lalitpur, Nepal
- Website: https://decorationnepal.com

## Pages
- Home: https://decorationnepal.com
- About: https://decorationnepal.com/about
- Services: https://decorationnepal.com/services
- Contact: https://decorationnepal.com/contact
- Event Planner: https://decorationnepal.com/planner`;

export default function LlmsTxtEditor() {
  const [content, setContent] = useState(defaultContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const lineCount = content.split('\n').length;
  const charCount = content.length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cream-contrast font-display flex items-center gap-3">
            <Bot className="w-8 h-8 text-primary" />
            llms.txt Editor
          </h1>
          <p className="text-on-surface-variant mt-1">Manage the LLM-friendly content file for AI discoverability.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-surface-container-high rounded-lg border border-outline-variant overflow-hidden">
            <button
              onClick={() => setViewMode('edit')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors ${
                viewMode === 'edit' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-cream-contrast'
              }`}
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors ${
                viewMode === 'preview' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-cream-contrast'
              }`}
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-primary text-on-primary px-6 py-2.5 rounded hover:bg-primary-fixed disabled:opacity-50 transition font-semibold text-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : saved ? '✓ Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Editor / Preview */}
        <div className="col-span-9">
          <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
            {viewMode === 'edit' ? (
              <div>
                <div className="flex items-center justify-between px-4 py-2 bg-surface-container-high border-b border-outline-variant">
                  <span className="text-xs text-on-surface-variant font-mono">llms.txt</span>
                  <span className="text-xs text-on-surface-variant">{lineCount} lines • {charCount} chars</span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-surface text-cream-contrast p-6 font-mono text-sm leading-relaxed resize-none focus:outline-none min-h-[600px]"
                  spellCheck={false}
                />
              </div>
            ) : (
              <div className="p-6 min-h-[600px]">
                <div className="prose prose-invert max-w-none">
                  <div className="text-sm font-mono text-on-surface-variant whitespace-pre-wrap leading-relaxed">
                    {content.split('\n').map((line, i) => {
                      if (line.startsWith('# ')) {
                        return <h1 key={i} className="text-2xl font-bold text-cream-contrast mt-6 mb-3 font-display">{line.slice(2)}</h1>;
                      }
                      if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-lg font-bold text-primary mt-6 mb-2 font-display">{line.slice(3)}</h2>;
                      }
                      if (line.startsWith('> ')) {
                        return <p key={i} className="text-on-surface-variant italic border-l-2 border-primary/30 pl-4 my-3">{line.slice(2)}</p>;
                      }
                      if (line.startsWith('- ')) {
                        return <p key={i} className="text-on-surface ml-4 my-1">• {line.slice(2)}</p>;
                      }
                      if (line.trim() === '') {
                        return <br key={i} />;
                      }
                      return <p key={i} className="text-on-surface my-1">{line}</p>;
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-3 space-y-6">
          {/* Info Card */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-5">
            <h3 className="text-sm font-bold text-cream-contrast mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" /> About llms.txt
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
              The llms.txt file helps AI assistants (ChatGPT, Claude, Perplexity) understand your business and recommend your services.
            </p>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Keep it concise (under 5000 chars)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Include contact info and service list</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>List key pages with URLs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Update when services change</span>
              </li>
            </ul>
          </div>

          {/* Format Guide */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-5">
            <h3 className="text-sm font-bold text-cream-contrast mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> Format Guide
            </h3>
            <div className="space-y-2 text-xs text-on-surface-variant font-mono">
              <p><span className="text-primary"># Title</span> → H1 heading</p>
              <p><span className="text-primary">## Section</span> → H2 heading</p>
              <p><span className="text-primary">{'>'} Quote</span> → Blockquote</p>
              <p><span className="text-primary">- Item</span> → Bullet point</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-5">
            <h3 className="text-sm font-bold text-cream-contrast mb-3">Stats</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Characters</span>
                <span className="text-cream-contrast font-semibold">{charCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Lines</span>
                <span className="text-cream-contrast font-semibold">{lineCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Status</span>
                <span className={`font-semibold ${charCount > 5000 ? 'text-red-400' : charCount > 3000 ? 'text-champagne-gold' : 'text-primary'}`}>
                  {charCount > 5000 ? 'Too long' : charCount > 3000 ? 'Good' : 'Concise'}
                </span>
              </div>
            </div>
          </div>

          {/* URL */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-5">
            <h3 className="text-sm font-bold text-cream-contrast mb-2">Live URL</h3>
            <a
              href="https://decorationnepal.com/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:text-primary-container transition-colors flex items-center gap-2"
            >
              <Globe className="w-3 h-3" />
              decorationnepal.com/llms.txt
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
