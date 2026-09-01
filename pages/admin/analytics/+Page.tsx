import React from 'react';
import { LineChart, TrendingUp, Users, DollarSign, Activity, ArrowUpRight, BarChart2, Globe, ShieldCheck } from 'lucide-react';

export default function AnalyticsDashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header (Page 7 of Stitch Design) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            Analytics Dashboard
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
            Deep revenue tracking, conversion funnel metrics, and marketing campaign performance.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge-pill badge-green" style={{ fontSize: '0.78rem' }}>
            <Activity size={14} /> Real-Time Tracking
          </span>
        </div>
      </div>

      {/* 4 Analytics Stat Cards (Page 7 of Stitch Design) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px' }}>Total Sales (PKR)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#FFFFFF' }}>PKR 124,500</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', marginTop: '4px' }}>+18.5% this week</div>
        </div>

        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px' }}>Avg. Order Value</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#FFFFFF' }}>PKR 3,900</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Standard single tier</div>
        </div>

        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px' }}>Conversion Rate</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--accent-green)' }}>4.8%</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Landing to Enrollment</div>
        </div>

        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px' }}>Total Visitors</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>45,210</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Unique visitors this month</div>
        </div>
      </div>

      {/* Visual Charts: Revenue & Traffic (Page 7 of Stitch Design) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Revenue Growth Trajectory */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          gridColumn: 'span 2'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '18px' }}>
            Revenue Growth Curve
          </h3>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '220px', gap: '14px', paddingTop: '20px' }}>
            {[
              { m: 'Week 1', val: 'PKR 180K', h: 30 },
              { m: 'Week 2', val: 'PKR 340K', h: 50 },
              { m: 'Week 3', val: 'PKR 590K', h: 72 },
              { m: 'Week 4', val: 'PKR 860K', h: 88 },
              { m: 'Week 5', val: 'PKR 1.25M', h: 100 }
            ].map((bar, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '700' }}>{bar.val}</div>
                <div style={{
                  width: '100%',
                  height: `${bar.h}%`,
                  background: 'linear-gradient(180deg, var(--primary), #004d73)',
                  borderRadius: '6px 6px 0 0',
                  boxShadow: '0 0 15px rgba(0, 160, 223, 0.3)'
                }} />
                <div style={{ fontSize: '0.8rem', color: '#FFFFFF', fontWeight: '600' }}>{bar.m}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '20px' }}>
            Conversion Funnel
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#E2E8F0', marginBottom: '6px' }}>
                <span>1. Site Visits</span>
                <strong>45,210 (100%)</strong>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '100%', backgroundColor: 'var(--primary)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#E2E8F0', marginBottom: '6px' }}>
                <span>2. Reached Checkout</span>
                <strong>12,450 (27.5%)</strong>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '27.5%', backgroundColor: 'var(--accent-amber)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#E2E8F0', marginBottom: '6px' }}>
                <span>3. Submitted Form</span>
                <strong>4,520 (10.0%)</strong>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '10%', backgroundColor: '#EC4899' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#E2E8F0', marginBottom: '6px' }}>
                <span>4. Verified &amp; Paid</span>
                <strong>2,170 (4.8%)</strong>
              </div>
              <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '4.8%', backgroundColor: 'var(--accent-green)' }} />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
