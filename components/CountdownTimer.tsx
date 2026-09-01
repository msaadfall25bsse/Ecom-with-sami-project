import React, { useState, useEffect } from 'react';
import { Clock, Flame, ShieldCheck, Zap, Users } from 'lucide-react';

export function CountdownTimer({ initialHours = 2, initialMinutes = 27, initialSeconds = 38 }: { initialHours?: number; initialMinutes?: number; initialSeconds?: number }) {
  const [totalSeconds, setTotalSeconds] = useState(initialHours * 3600 + initialMinutes * 60 + initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTotalSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      border: '1.5px solid rgba(0, 160, 223, 0.3)',
      boxShadow: '0 10px 30px rgba(0, 160, 223, 0.1)',
      padding: '24px 28px',
      maxWidth: '780px',
      margin: '0 auto 36px auto'
    }}>
      {/* Clock Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#EF4444', fontWeight: '700', fontSize: '1.05rem' }}>
          <Clock size={22} className="animate-pulse" />
          <span>Offer ends in:</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { val: pad(hours), lbl: 'HRS' },
            { val: pad(minutes), lbl: 'MIN' },
            { val: pad(seconds), lbl: 'SEC' }
          ].map((unit, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#0B0F19',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '8px 14px',
                textAlign: 'center',
                minWidth: '60px',
                border: '1px solid rgba(0, 160, 223, 0.3)'
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'monospace', color: 'var(--primary)', lineHeight: 1 }}>
                {unit.val}
              </div>
              <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.05em', marginTop: '3px' }}>
                {unit.lbl}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seats Left Bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: '700', marginBottom: '8px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B91C1C' }}>
            <Flame size={18} color="#EF4444" /> Only 12 seats left at this price
          </span>
          <span style={{ color: 'var(--primary)' }}>88% Filled</span>
        </div>
        <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: '88%',
            background: 'linear-gradient(90deg, var(--primary), #EF4444)',
            borderRadius: '999px'
          }} />
        </div>
      </div>

      {/* 3 Trust Badges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        paddingTop: '16px',
        borderTop: '1px solid #F1F5F9',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: 'var(--text-dark)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="var(--accent-green)" />
          <span>Lifetime Access</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="var(--primary)" />
          <span>Instant LMS Activation</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} color="var(--accent-amber)" />
          <span>9,700+ Enrolled Students</span>
        </div>
      </div>
    </div>
  );
}
