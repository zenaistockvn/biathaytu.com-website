'use client';

import { useState, useEffect } from 'react';
import type { SocialAccount } from '@/types';
import type { InboxMessage } from '@/lib/providers/types';

export default function InboxClient({ initialAccounts }: { initialAccounts: SocialAccount[] }) {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeAccount, setActiveAccount] = useState<SocialAccount | null>(
    initialAccounts.length > 0 ? initialAccounts[0] : null
  );
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch messages every 30s or when account changes
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeAccount) {
      fetchMessages();
      interval = setInterval(fetchMessages, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeAccount]);

  const fetchMessages = async () => {
    if (!activeAccount) return;
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/inbox?tenantId=${activeAccount.tenant_id}&platform=${activeAccount.platform}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch messages');
      
      setMessages(data.messages || []);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!activeAccount || !selectedMessage || !replyText.trim()) return;

    try {
      setReplying(true);
      const res = await fetch(`/api/inbox/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: activeAccount.tenant_id,
          platform: activeAccount.platform,
          platformId: activeAccount.account_id,
          conversationId: selectedMessage.extra?.conversationId,
          messageId: selectedMessage.platformMessageId,
          text: replyText
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send reply');
      
      setReplyText('');
      alert('Đã gửi phản hồi thành công!');
      fetchMessages(); // refresh msg queue
    } catch (err: unknown) {
      alert(`Error responding: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setReplying(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 200px)', gap: '0', background: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
      {/* Left Panel: Account Selection & Message List */}
      <div style={{ width: '350px', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
        
        {/* Account Switcher */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
            <select 
              value={activeAccount?.id || ''} 
              onChange={e => {
                  const acc = initialAccounts.find(a => a.id === e.target.value);
                  if (acc) {
                      setActiveAccount(acc);
                      setSelectedMessage(null);
                  }
              }}
              style={{ width: '100%', padding: '0.625rem', background: '#ffffff', color: '#111827', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: 500, outline: 'none' }}
            >
              {initialAccounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.platform.toUpperCase()} - {acc.account_name}
                </option>
              ))}
              {initialAccounts.length === 0 && <option value="">Chưa kết nối MXH nào</option>}
            </select>
        </div>

        {/* Loading & Errors */}
        {loading && messages.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>Đang tải tin nhắn...</div>}
        {error && <div style={{ padding: '1rem', color: '#ef4444', fontSize: '13px', background: '#fef2f2', borderBottom: '1px solid #fee2e2' }}>{error}</div>}

        {/* Message List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {messages.map(msg => (
            <div 
              key={msg.platformMessageId}
              onClick={() => setSelectedMessage(msg)}
              style={{ 
                padding: '1.25rem', 
                borderBottom: '1px solid #f3f4f6', 
                cursor: 'pointer',
                background: selectedMessage?.platformMessageId === msg.platformMessageId ? '#f3f4f6' : 'transparent',
                display: 'flex', gap: '1rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                 if (selectedMessage?.platformMessageId !== msg.platformMessageId) {
                    e.currentTarget.style.background = '#f9fafb';
                 }
              }}
              onMouseLeave={(e) => {
                 if (selectedMessage?.platformMessageId !== msg.platformMessageId) {
                    e.currentTarget.style.background = 'transparent';
                 }
              }}
            >
              <div style={{ width: '44px', height: '44px', background: 'var(--primary)', opacity: 0.9, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>
                  {msg.senderName.charAt(0)}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#111827', fontWeight: 600 }}>{msg.senderName}</h4>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                     {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ margin: '4px 0 8px', fontSize: '13px', color: '#4b5563', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {msg.text}
                </p>
                <span style={{ display: 'inline-block', fontSize: '11px', padding: '2px 8px', background: msg.messageType === 'dm' ? '#dbeafe' : '#f3f4f6', borderRadius: '12px', color: msg.messageType === 'dm' ? '#1e40af' : '#4b5563', fontWeight: 500 }}>
                    {msg.messageType.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
          {messages.length === 0 && !loading && !error && (
             <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>Không có tin nhắn nào trong hộp thư này</div>
          )}
        </div>
      </div>

      {/* Right Panel: Chat Box */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f9fafb' }}>
        {selectedMessage ? (
          <>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff' }}>
               <div style={{ width: '44px', height: '44px', background: 'var(--primary)', opacity: 0.9, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>
                  {selectedMessage.senderName.charAt(0)}
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#111827', fontSize: '16px', fontWeight: 600 }}>{selectedMessage.senderName}</h3>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6b7280' }}>{activeAccount?.platform.toUpperCase()} User</p>
              </div>
            </div>

            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
               {/* Display single selected message for now (full thread would require thread API) */}
               <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', padding: '1rem 1.25rem', borderRadius: '2px 16px 16px 16px', maxWidth: '75%', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                      <p style={{ margin: 0, color: '#1f2937', lineHeight: 1.5, fontSize: '14px' }}>{selectedMessage.text}</p>
                      <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '11px', color: '#9ca3af' }}>
                         {new Date(selectedMessage.timestamp).toLocaleString()}
                      </span>
                  </div>
               </div>
            </div>

            <div style={{ padding: '1.25rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.75rem', background: '#ffffff' }}>
              <input 
                 type="text" 
                 value={replyText}
                 onChange={e => setReplyText(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleReply()}
                 placeholder={`Viết tin nhắn trả lời ${selectedMessage.senderName}...`}
                 style={{ flex: 1, padding: '0.75rem 1.25rem', background: '#f9fafb', border: '1px solid #d1d5db', borderRadius: '24px', color: '#111827', outline: 'none', fontSize: '14px' }}
              />
              <button 
                 onClick={handleReply}
                 disabled={replying || !replyText.trim()}
                 style={{ 
                    padding: '0 1.5rem', 
                    background: 'var(--primary)', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '24px', 
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: replying || !replyText.trim() ? 'not-allowed' : 'pointer',
                    opacity: replying || !replyText.trim() ? 0.6 : 1,
                    transition: 'opacity 0.2s'
                 }}
              >
                {replying ? 'Đang gửi...' : 'Gửi đi'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
             <div style={{ fontSize: '48px', marginBottom: '1rem', opacity: 0.5 }}>💬</div>
             <div style={{ fontSize: '15px' }}>Chọn một cuộc trò chuyện ở cột trái để bắt đầu</div>
          </div>
        )}
      </div>
    </div>
  );
}
