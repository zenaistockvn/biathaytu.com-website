'use client';

import { useState } from 'react';

interface PromptModalProps {
  type: 'image' | 'video';
  title: string;
  content: string;
  onClose: () => void;
}

export default function PromptModal({ type, title, content, onClose }: PromptModalProps) {
  const [copied, setCopied] = useState(false);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <h3 className="modal-title">
            {type === 'image' ? '🖼️' : '🎬'} {title}
          </h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="prompt-box">{content}</div>

        <div className="flex gap-sm mt-md" style={{ justifyContent: 'flex-end' }}>
          <button
            onClick={copyPrompt}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem' }}
          >
            {copied ? '✓ Đã copy prompt!' : '📋 Copy Prompt'}
          </button>
        </div>
      </div>
    </div>
  );
}
