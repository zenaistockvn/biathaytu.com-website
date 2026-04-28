'use client';

import { useState, useCallback } from 'react';
import AIWriterTab from './AIWriterTab';
import CreateTab from './CreateTab';
import MultiplyTab from './MultiplyTab';
import ImagePromptsTab from './ImagePromptsTab';
import AdCreativeTab from './AdCreativeTab';
import ContentTipsTab from './ContentTipsTab';
import HistoryTab from './HistoryTab';
import type { HistoryEntry } from './HistoryTab';
import type { Json } from '@/types/database';

type Tab = 'writer' | 'create' | 'multiply' | 'prompts' | 'ads' | 'tips' | 'history';

interface StudioProps {
  products: { id: string; name: string }[];
  imagePrompts: { id: string; style_id: string; style_name: string; style_icon: string; style_description: string; title: string; prompt: string; purpose: string | null; ratio: string | null }[];
  brandDNA: { id: string; name: string; heritage: string | null; tagline: string | null; colors: string | null; mood: string | null; visual_code: string | null }[];
  adSpecs: { id: string; platform_name: string; platform_icon: string; platform_color: string; element_name: string; char_limit: string; note: string | null; sort_order: number | null }[];
  adAngles: { id: string; name: string; icon: string; template: string; examples: Json; sort_order: number | null }[];
  contentTips: { id: string; title: string; description: string | null; section: string; content: Json; sort_order: number | null }[];
}

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'writer', label: 'AI Writer', icon: '✍️' },
  { key: 'create', label: 'Tạo Content', icon: '🚀' },
  { key: 'multiply', label: 'Nhân Bản', icon: '🔄' },
  { key: 'prompts', label: 'Image Prompts', icon: '📸' },
  { key: 'ads', label: 'Ad Creative', icon: '📣' },
  { key: 'tips', label: 'Content Tips', icon: '🧠' },
  { key: 'history', label: 'Lịch sử', icon: '📂' },
];

export default function StudioClientWrapper({ products, imagePrompts, brandDNA, adSpecs, adAngles, contentTips }: StudioProps) {
  const [activeTab, setActiveTab] = useState<Tab>('writer');
  const [multiplySource, setMultiplySource] = useState('');
  const [reuseEntry, setReuseEntry] = useState<HistoryEntry | null>(null);

  const handleUseAsMultiplySource = useCallback((caption: string) => {
    setMultiplySource(caption);
    setActiveTab('multiply');
  }, []);

  const handleReuseFromHistory = useCallback((entry: HistoryEntry) => {
    setReuseEntry(entry);
    setActiveTab('writer');
  }, []);

  return (
    <div>
      {/* Tabs */}
      <div className="studio-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`studio-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'writer' && (
        <AIWriterTab products={products} reuseEntry={reuseEntry} onReuseConsumed={() => setReuseEntry(null)} />
      )}

      {activeTab === 'create' && (
        <CreateTab products={products} onUseAsMultiplySource={handleUseAsMultiplySource} />
      )}

      {activeTab === 'multiply' && (
        <MultiplyTab products={products} initialSource={multiplySource} />
      )}

      {activeTab === 'prompts' && <ImagePromptsTab prompts={imagePrompts} brands={brandDNA} />}
      {activeTab === 'ads' && <AdCreativeTab specs={adSpecs} angles={adAngles} />}
      {activeTab === 'tips' && <ContentTipsTab tips={contentTips} />}
      {activeTab === 'history' && <HistoryTab onReuse={handleReuseFromHistory} />}
    </div>
  );
}
