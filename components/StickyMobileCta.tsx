import React, { useState, useEffect } from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { usePageContext } from 'vike-react/usePageContext';

export function StickyMobileCta() {
  const pageContext = usePageContext();
  const urlPathname = pageContext?.urlPathname || '/';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past 260px on mobile
      if (window.scrollY > 260) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide on admin and checkout/enrollment pages
  if (urlPathname.startsWith('/admin') || urlPathname === '/enrollment' || urlPathname === '/checkout') {
    return null;
  }

  if (!visible) return null;

  return (
    <div
      className="mobile-sticky-cta"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTop: '1.5px solid rgba(0, 160, 223, 0.25)',
        boxShadow: '0 -8px 25px rgba(0, 0, 0, 0.12)',
        padding: '10px 16px',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-dark)' }}>PKR 3,900</span>
          <span style={{ fontSize: '0.76rem', textDecoration: 'line-through', color: '#EF4444', fontWeight: '600' }}>32,500</span>
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--accent-green)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
          🔥 88% Discount Active
        </div>
      </div>

      <a
        href="/enrollment"
        className="btn-primary"
        style={{
          padding: '10px 18px',
          fontSize: '0.88rem',
          fontWeight: '800',
          whiteSpace: 'nowrap',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 4px 14px rgba(0, 160, 223, 0.4)'
        }}
      >
        <span>Join Now</span>
        <ArrowRight size={15} />
      </a>

      <style>{`
        @media (min-width: 769px) {
          .mobile-sticky-cta {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
