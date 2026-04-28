'use client';

import { useState, useCallback } from 'react';
import {
  VIDEO_PAGES,
  VIDEO_PROMPTS,
  PROMPT_TEMPLATES,
  TOOLS,
} from './videoPromptsData';
import type { VideoPrompt, VideoTool, PromptTemplate } from './videoPromptsData';

type FilterTool = 'all' | VideoTool;

export default function VideoPromptsClient() {
  const [pageFilter, setPageFilter] = useState('all');
  const [toolFilter, setToolFilter] = useState<FilterTool>('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'storyboard'>('cards');

  const filtered = VIDEO_PROMPTS.filter((p) => {
    if (pageFilter !== 'all' && p.pageId !== pageFilter) return false;
    if (toolFilter !== 'all' && p.tool !== toolFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.storyboard.toLowerCase().includes(q) ||
        p.product.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    }
  }, []);

  const getPageInfo = (pageId: string) =>
    VIDEO_PAGES.find((p) => p.id === pageId);

  const getToolInfo = (tool: VideoTool) =>
    TOOLS.find((t) => t.id === tool)!;

  // Group prompts by page when viewing all
  const groupedByPage = pageFilter === 'all'
    ? VIDEO_PAGES.filter((page) =>
        filtered.some((p) => p.pageId === page.id),
      )
    : [];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem 2rem' }}>

      {/* ─── Top Bar: Tool Filter + View Mode + Templates ─── */}
      <div className="flex gap-sm mb-md flex-wrap" style={{ alignItems: 'center' }}>
        <button
          onClick={() => setToolFilter('all')}
          className={`platform-btn ${toolFilter === 'all' ? 'active' : ''}`}
        >
          🎬 Tất cả
        </button>
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => setToolFilter(t.id)}
            className={`platform-btn ${toolFilter === t.id ? 'active' : ''}`}
            style={
              toolFilter === t.id
                ? { borderColor: t.color, background: `${t.color}15`, color: t.color }
                : {}
            }
          >
            {t.icon} {t.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setViewMode(viewMode === 'cards' ? 'storyboard' : 'cards')}
          className="btn btn-ghost"
          style={{ fontSize: '0.8rem' }}
        >
          {viewMode === 'cards' ? '📖 Xem kịch bản' : '📋 Xem cards'}
        </button>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className={`btn ${showTemplates ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.8rem' }}
        >
          📋 Templates
        </button>
      </div>

      {/* ─── Templates Panel ─── */}
      {showTemplates && (
        <div className="card mb-lg" style={{ padding: '1.25rem' }}>
          <div className="flex justify-between items-center mb-md">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
              📋 Quick-Start Templates — Storyselling Framework
            </h3>
            <button onClick={() => setShowTemplates(false)} className="modal-close">✕</button>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {PROMPT_TEMPLATES.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                copied={copied === tpl.id}
                onCopy={() => handleCopy(tpl.template, tpl.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ─── Page Filter (Storyselling Occasions) ─── */}
      <div className="flex gap-sm mb-md flex-wrap" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setPageFilter('all')}
          className={`cat-chip ${pageFilter === 'all' ? 'active' : ''}`}
        >
          📺 Tất cả
          <span className="cat-chip-count">{VIDEO_PROMPTS.length}</span>
        </button>
        {VIDEO_PAGES.map((page) => {
          const count = VIDEO_PROMPTS.filter(
            (p) =>
              p.pageId === page.id &&
              (toolFilter === 'all' || p.tool === toolFilter),
          ).length;
          if (count === 0 && toolFilter !== 'all') return null;
          return (
            <button
              key={page.id}
              onClick={() => setPageFilter(page.id)}
              className={`cat-chip ${pageFilter === page.id ? 'active' : ''}`}
              style={
                pageFilter === page.id
                  ? { border: `1px solid ${page.color}`, background: `${page.color}18`, color: page.color }
                  : {}
              }
            >
              {page.icon} {page.label}
              <span
                className="cat-chip-count"
                style={{ background: pageFilter === page.id ? `${page.color}30` : 'var(--bg)' }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── Page Insight Banner ─── */}
      {pageFilter !== 'all' && (() => {
        const page = getPageInfo(pageFilter);
        if (!page) return null;
        return (
          <div
            className="card mb-md"
            style={{
              padding: '1rem 1.25rem',
              borderLeft: `4px solid ${page.color}`,
              background: `${page.color}08`,
            }}
          >
            <div className="flex items-center gap-sm mb-sm">
              <span style={{ fontSize: '1.5rem' }}>{page.icon}</span>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{page.label}</h3>
                <p className="text-sm text-muted" style={{ margin: 0 }}>{page.description}</p>
              </div>
            </div>
            <blockquote
              style={{
                margin: '0.75rem 0 0',
                padding: '0.6rem 1rem',
                borderLeft: `3px solid ${page.color}`,
                background: `${page.color}10`,
                borderRadius: '0 var(--radius-xs) var(--radius-xs) 0',
                fontSize: '0.88rem',
                fontStyle: 'italic',
                color: 'var(--text)',
                lineHeight: 1.6,
              }}
            >
              💡 {page.insight}
            </blockquote>
          </div>
        );
      })()}

      {/* ─── Search ─── */}
      <div className="mb-md">
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Tìm theo tên, sản phẩm, nội dung kịch bản..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 450 }}
        />
      </div>

      {/* ─── Stats ─── */}
      <div className="flex justify-between items-center mb-md text-sm text-muted">
        <span>
          Hiển thị <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> /{' '}
          {VIDEO_PROMPTS.length} video prompts
        </span>
        <span className="text-xs" style={{ opacity: 0.6 }}>
          {viewMode === 'storyboard'
            ? 'Chế độ kịch bản — xem nội dung video tiếng Việt'
            : 'Click prompt để xem chi tiết • Copy để paste vào AI tool'}
        </span>
      </div>

      {/* ─── Prompt Cards / Storyboard View ─── */}
      {pageFilter === 'all' && groupedByPage.length > 0 ? (
        // Grouped view
        groupedByPage.map((page) => {
          const pagePrompts = filtered.filter((p) => p.pageId === page.id);
          if (pagePrompts.length === 0) return null;
          return (
            <div key={page.id} style={{ marginBottom: '2rem' }}>
              <div className="flex items-center gap-sm mb-sm" style={{ paddingBottom: '0.5rem', borderBottom: `2px solid ${page.color}30` }}>
                <span style={{ fontSize: '1.25rem' }}>{page.icon}</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: page.color }}>
                  {page.label}
                </h3>
                <span className="text-xs text-muted">— {page.description}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                {pagePrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    isExpanded={expanded === prompt.id}
                    isCopied={copied === prompt.id}
                    pageColor={page.color}
                    toolInfo={getToolInfo(prompt.tool)}
                    viewMode={viewMode}
                    onToggle={() => setExpanded(expanded === prompt.id ? null : prompt.id)}
                    onCopy={() => handleCopy(prompt.prompt, prompt.id)}
                    onCopyFull={() =>
                      handleCopy(`${prompt.prompt}\n\nAudio: ${prompt.audioHint}`, prompt.id)
                    }
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        // Flat view (filtered by a specific page)
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((prompt) => {
            const page = getPageInfo(prompt.pageId);
            return (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                isExpanded={expanded === prompt.id}
                isCopied={copied === prompt.id}
                pageColor={page?.color ?? '#6C5CE7'}
                toolInfo={getToolInfo(prompt.tool)}
                viewMode={viewMode}
                onToggle={() => setExpanded(expanded === prompt.id ? null : prompt.id)}
                onCopy={() => handleCopy(prompt.prompt, prompt.id)}
                onCopyFull={() =>
                  handleCopy(`${prompt.prompt}\n\nAudio: ${prompt.audioHint}`, prompt.id)
                }
              />
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</div>
          <p>Không tìm thấy prompt phù hợp</p>
          <p className="text-sm" style={{ opacity: 0.6 }}>Thử đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}

      {/* ─── Brand Compliance Footer ─── */}
      <div className="card" style={{ marginTop: '2rem', padding: '1.25rem', background: 'var(--primary-glow)', borderColor: 'rgba(108, 92, 231, 0.2)' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          ⚠️ Quy Tắc Nhãn Hiệu — Brand Compliance
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
          }}
        >
          <div>
            <strong style={{ color: 'var(--text)' }}>🍺 Sản phẩm</strong><br />
            • Bitburger: lon emerald green + gold, hoặc chai xanh<br />
            • Benediktiner: chai dark brown 500ml<br />
            • Weissbier: nhãn GOLD monastery<br />
            • Dunkel: nhãn RED-BROWN<br />
            • Nắp: standard metal crown cap — <strong>KHÔNG nắp bần/cork</strong>
          </div>
          <div>
            <strong style={{ color: 'var(--text)' }}>🥤 Ly bia</strong><br />
            • Bitburger Pils → Pilsner glass (thấp, thẳng)<br />
            • Weissbier/Dunkel → Weizen glass (tulip cao)<br />
            • Pils: crystal-clear golden, fine foam mỏng<br />
            • Weissbier: cloudy amber, thick WHITE foam<br />
            • Dunkel: cloudy chestnut-brown, TAN foam
          </div>
          <div>
            <strong style={{ color: 'var(--text)' }}>🚫 Tuyệt đối tránh</strong><br />
            • Text chữ trên chai/lon → overlay trong post-production<br />
            • Nắp bần/cork (Benediktiner dùng crown cap!)<br />
            • Cảnh nhậu nhẹt, say xỉn, party bê tha<br />
            • Nhân vật &lt; 25 tuổi<br />
            • Bia đỏ, bia đen cực đậm (KHÔNG có trong portfolio)
          </div>
          <div>
            <strong style={{ color: 'var(--text)' }}>💡 Workflow</strong><br />
            • <a href="https://dreamina.capcut.com" target="_blank" rel="noreferrer">Seedance: dreamina.capcut.com</a><br />
            • <a href="https://aistudio.google.com" target="_blank" rel="noreferrer">Veo 3: aistudio.google.com</a><br />
            • Upload pack shot ảnh SP → @Image1<br />
            • Generate 3-5 lần, chọn best<br />
            • Post-production: CapCut / Premiere Pro
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ Prompt Card Component ═══ */

function PromptCard({
  prompt,
  isExpanded,
  isCopied,
  pageColor,
  toolInfo,
  viewMode,
  onToggle,
  onCopy,
  onCopyFull,
}: {
  prompt: VideoPrompt;
  isExpanded: boolean;
  isCopied: boolean;
  pageColor: string;
  toolInfo: { icon: string; label: string; color: string };
  viewMode: 'cards' | 'storyboard';
  onToggle: () => void;
  onCopy: () => void;
  onCopyFull: () => void;
}) {
  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: 'hidden',
        borderLeftWidth: 4,
        borderLeftColor: pageColor,
        cursor: 'pointer',
      }}
      onClick={onToggle}
    >
      {/* Header */}
      <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: '0.35rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{prompt.name}</span>
          </div>
          {/* Vietnamese description — always visible */}
          <p className="text-sm" style={{ margin: '0 0 0.5rem', color: 'var(--text-muted)', lineHeight: 1.55, maxWidth: 600 }}>
            {prompt.description}
          </p>
          <div className="flex gap-sm flex-wrap" style={{ fontSize: '0.72rem' }}>
            <span className="badge" style={{ background: `${toolInfo.color}18`, color: toolInfo.color }}>
              {toolInfo.icon} {toolInfo.label}
            </span>
            <span className="badge" style={{ background: `${pageColor}18`, color: pageColor }}>
              {prompt.product}
            </span>
            <span className="badge badge-info">⏱ {prompt.duration}</span>
            <span className="badge" style={{ background: 'var(--bg)', color: 'var(--text-muted)' }}>
              📐 {prompt.aspect}
            </span>
          </div>
        </div>
        <div className="flex gap-sm items-center" style={{ flexShrink: 0 }}>
          <button
            onClick={(e) => { e.stopPropagation(); onCopy(); }}
            className="btn btn-ghost"
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
          >
            {isCopied ? '✅ Copied!' : '📋 Copy'}
          </button>
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              transition: 'transform 0.2s',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            ▼
          </span>
        </div>
      </div>

      {/* Storyboard View — always visible in storyboard mode */}
      {viewMode === 'storyboard' && !isExpanded && (
        <div
          style={{
            padding: '0 1.25rem 1rem',
            borderTop: '1px solid var(--border)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <pre
            style={{
              background: `${pageColor}06`,
              border: `1px solid ${pageColor}20`,
              borderRadius: 'var(--radius-xs)',
              padding: '1rem',
              fontSize: '0.82rem',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: "'Inter', sans-serif",
              color: 'var(--text)',
              margin: '0.75rem 0 0',
            }}
          >
            {prompt.storyboard}
          </pre>
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div
          style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--border)', animation: 'fadeIn 0.2s ease' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Storyboard (Vietnamese) */}
          <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <span className="text-xs" style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              📖 Kịch bản video (tiếng Việt)
            </span>
            <pre
              style={{
                background: `${pageColor}06`,
                border: `1px solid ${pageColor}20`,
                borderRadius: 'var(--radius-xs)',
                padding: '1rem',
                fontSize: '0.82rem',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: "'Inter', sans-serif",
                color: 'var(--text)',
                margin: '0.5rem 0 0',
              }}
            >
              {prompt.storyboard}
            </pre>
          </div>

          {/* Purpose + Product */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <span className="text-xs" style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                🎯 Mục đích
              </span>
              <p className="text-sm" style={{ margin: '0.25rem 0 0', color: 'var(--text)' }}>{prompt.purpose}</p>
            </div>
            <div>
              <span className="text-xs" style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                🍺 Sản phẩm
              </span>
              <p className="text-sm" style={{ margin: '0.25rem 0 0', color: 'var(--text)', fontWeight: 600 }}>{prompt.product}</p>
            </div>
          </div>

          {/* Prompt (English for AI) */}
          <div style={{ marginBottom: '1rem' }}>
            <div className="flex justify-between items-center mb-sm">
              <span className="text-xs" style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                🤖 Prompt cho AI (tiếng Anh)
              </span>
              <div className="flex gap-sm">
                <button onClick={onCopy} className="btn btn-ghost" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}>
                  {isCopied ? '✅' : '📋'} Copy Prompt
                </button>
                <button onClick={onCopyFull} className="btn btn-ghost" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}>
                  📋 Copy + Audio
                </button>
              </div>
            </div>
            <pre
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xs)',
                padding: '1rem',
                fontSize: '0.78rem',
                lineHeight: 1.65,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: 350,
                overflow: 'auto',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                color: 'var(--text)',
              }}
            >
              {prompt.prompt}
            </pre>
          </div>

          {/* Audio */}
          <div style={{ marginBottom: '1rem' }}>
            <span className="text-xs" style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              🔊 Âm thanh / SFX
            </span>
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.05), rgba(0, 184, 148, 0.05))',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.75rem 1rem',
                fontSize: '0.82rem',
                marginTop: '0.25rem',
                lineHeight: 1.6,
              }}
            >
              {prompt.audioHint}
            </div>
          </div>

          {/* Brand Notes */}
          <div style={{ marginBottom: '1rem' }}>
            <span className="text-xs" style={{ color: 'var(--warning)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              ⚠️ Quy tắc nhãn hiệu
            </span>
            <ul
              style={{
                margin: '0.5rem 0 0',
                paddingLeft: '1.25rem',
                fontSize: '0.78rem',
                color: 'var(--text)',
                lineHeight: 1.8,
              }}
            >
              {prompt.brandNotes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div>
            <span className="text-xs" style={{ color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              💡 Tips sử dụng
            </span>
            <ul
              style={{
                margin: '0.5rem 0 0',
                paddingLeft: '1.25rem',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                lineHeight: 1.8,
              }}
            >
              {prompt.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══ Template Card Component ═══ */

function TemplateCard({
  template,
  copied,
  onCopy,
}: {
  template: PromptTemplate;
  copied: boolean;
  onCopy: () => void;
}) {
  const tool = TOOLS.find((t) => t.id === template.tool)!;
  return (
    <div className="card" style={{ padding: '1rem', cursor: 'pointer' }} onClick={onCopy}>
      <div className="flex justify-between items-center mb-sm">
        <span style={{ fontSize: '1.2rem' }}>{template.icon}</span>
        <span className="badge" style={{ background: `${tool.color}18`, color: tool.color }}>
          {tool.icon} {tool.label}
        </span>
      </div>
      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{template.name}</h4>
      <p className="text-sm text-muted" style={{ margin: '0 0 0.75rem', lineHeight: 1.5 }}>{template.description}</p>
      <pre
        style={{
          background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xs)', padding: '0.6rem',
          fontSize: '0.7rem', lineHeight: 1.5, whiteSpace: 'pre-wrap',
          maxHeight: 120, overflow: 'hidden',
          fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)',
        }}
      >
        {template.template}
      </pre>
      <button
        className={`btn ${copied ? 'btn-primary' : 'btn-ghost'}`}
        style={{ fontSize: '0.75rem', width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}
        onClick={(e) => { e.stopPropagation(); onCopy(); }}
      >
        {copied ? '✅ Đã copy!' : '📋 Copy Template'}
      </button>
    </div>
  );
}
