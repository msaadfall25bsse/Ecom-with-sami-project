import React from 'react';
import { Star, TrendingUp, CheckCircle, Award } from 'lucide-react';

export function ProofWall() {
  const col1 = [
    {
      name: 'Raza Ali',
      city: 'Lahore',
      sales: '€662 in 6 Days',
      orders: '24 Orders',
      quote: 'Launched my first TikTok test ad campaign following Sami’s hook formula. First sale within 18 hours!',
      market: 'UAE & Europe'
    },
    {
      name: 'Hamza Tariq',
      city: 'Islamabad',
      sales: 'AED 5,000 / Week',
      orders: '56 Orders',
      quote: 'The direct supplier contacts in Dubai changed everything. Fast 2-day delivery and cash flow payout on time.',
      market: 'UAE Market'
    },
    {
      name: 'Bilal Farooq',
      city: 'Karachi',
      sales: 'AED 1,485 in 3 Days',
      orders: '19 Orders',
      quote: 'Started as a total beginner with zero Shopify knowledge. The 11 modules are so easy and step-by-step.',
      market: 'Saudi Arabia'
    },
    {
      name: 'Zainab Bibi',
      city: 'Faisalabad',
      sales: 'PKR 480,000 / Mo',
      orders: '110+ Orders',
      quote: 'The WhatsApp mentorship answered every question I had during my ad setup. Never felt alone.',
      market: 'UAE & KSA'
    }
  ];

  const col2 = [
    {
      name: 'Usman Ghani',
      city: 'Rawalpindi',
      sales: 'AED 8,200',
      orders: '78 Orders',
      quote: 'Scaled my product using Advantage+ CBO scaling taught in Module 8. Best investment of my life.',
      market: 'KSA Market'
    },
    {
      name: 'Saad Ahmed',
      city: 'Multan',
      sales: 'PKR 320,000 Profit',
      orders: '42 Orders',
      quote: 'Verified suppliers with Arabic packaging makes local buyers trust the store. Return rate dropped to 11%.',
      market: 'UAE Market'
    },
    {
      name: 'Farhan Zaheer',
      city: 'Peshawar',
      sales: 'AED 3,100',
      orders: '35 Orders',
      quote: 'I wasted money on other YouTube videos, but this practical course actually showed how to run ads.',
      market: 'Dubai & Sharjah'
    },
    {
      name: 'Tariq Mehmood',
      city: 'Sialkot',
      sales: '€1,150 in 10 Days',
      orders: '49 Orders',
      quote: 'The Windows LMS app allows me to watch lectures offline. Super convenient and high quality!',
      market: 'UAE / GCC'
    }
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: '620px', borderRadius: 'var(--radius-xl)', backgroundColor: '#0B0F19', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Top & Bottom Gradient Fades */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '90px',
        background: 'linear-gradient(to bottom, #0B0F19 10%, transparent 100%)',
        zIndex: 10,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '90px',
        background: 'linear-gradient(to top, #0B0F19 10%, transparent 100%)',
        zIndex: 10,
        pointerEvents: 'none'
      }} />

      {/* 2-Column Animated Slider */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', height: '100%' }}>
        
        {/* Column 1 */}
        <div style={{ overflow: 'hidden' }}>
          <div className="animate-scroll-up" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[...col1, ...col1].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 160, 223, 0.2)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '0.85rem'
                    }}>
                      {item.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{item.city} • {item.market}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '2px', color: '#F59E0B' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#F59E0B" />)}
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(0, 160, 223, 0.1)',
                  border: '1px solid rgba(0, 160, 223, 0.2)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '800' }}>{item.sales}</span>
                  <span style={{ color: 'var(--accent-green)', fontWeight: '700' }}>{item.orders}</span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', lineHeight: 1.5, fontStyle: 'italic' }}>
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 */}
        <div style={{ overflow: 'hidden' }} className="proof-col-2">
          <div className="animate-scroll-down" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[...col2, ...col2].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      color: 'var(--accent-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '0.85rem'
                    }}>
                      {item.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{item.city} • {item.market}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '2px', color: '#F59E0B' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#F59E0B" />)}
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ color: 'var(--accent-green)', fontWeight: '800' }}>{item.sales}</span>
                  <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{item.orders}</span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', lineHeight: 1.5, fontStyle: 'italic' }}>
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .proof-col-2 {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
