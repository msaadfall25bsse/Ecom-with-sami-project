import React, { useState, useEffect } from 'react';

export function TopMarquee() {
  const [items, setItems] = useState<string[]>([
    '🔥 Master UAE & KSA Shopify Dropshipping',
    '⚡ 88% OFF Today',
    '💰 Just PKR 3,900',
    '🔒 Lifetime LMS Portal Access',
    '📱 WhatsApp Mentorship (9AM–5PM)',
    '🏆 9,700+ Students Trained',
    '🚀 Verified Suppliers Directory Included',
    '🎁 Free Bonuses Worth Rs 30,000+'
  ]);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/public/cms-content')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.sections?.marquee) {
          const m = data.sections.marquee;
          if (m.items && Array.isArray(m.items) && m.items.length > 0) {
            setItems(m.items);
          }
          if (m.is_active !== undefined) {
            setIsVisible(Boolean(m.is_active));
          }
        }
      })
      .catch(() => {});
  }, []);

  if (!isVisible || items.length === 0) return null;

  return (
    <div style={{
      backgroundColor: '#0B0F19',
      color: '#FFFFFF',
      overflow: 'hidden',
      padding: '8px 0',
      borderBottom: '1px solid rgba(0, 160, 223, 0.25)',
      fontSize: '0.86rem',
      fontWeight: '600'
    }}>
      <div className="animate-marquee" style={{ display: 'flex', gap: '36px', whiteSpace: 'nowrap' }}>
        {[...items, ...items, ...items].map((item, idx) => (
          <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span>{item}</span>
            <span style={{ color: 'var(--primary)', opacity: 0.6 }}>•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

