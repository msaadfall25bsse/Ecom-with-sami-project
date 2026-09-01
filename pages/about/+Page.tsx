import React from 'react';
import { Target, HeartHandshake, Award, Users, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC' }}>
      
      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(180deg, #0B0F19 0%, #111827 100%)',
        color: '#FFFFFF',
        padding: '72px 0 60px 0',
        textAlign: 'center',
        borderBottom: '1px solid rgba(0, 160, 223, 0.25)'
      }}>
        <div className="site-container">
          <span className="badge-pill badge-cyan" style={{ marginBottom: '16px' }}>OUR MISSION &amp; STORY</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: '800', lineHeight: 1.2, maxWidth: '840px', margin: '0 auto 16px auto' }}>
            Empowering the Next Generation of <span style={{ color: 'var(--primary)' }}>E-Commerce Entrepreneurs</span>
          </h1>
          <p style={{ color: 'var(--text-subtle)', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
            Transforming Pakistani youth from job seekers into independent digital store owners in the high-purchasing Gulf markets.
          </p>
        </div>
      </section>

      {/* Story & Mentor Profile */}
      <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
        <div className="site-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            
            <div>
              <span className="badge-pill badge-amber" style={{ marginBottom: '12px' }}>THE JOURNEY</span>
              <h2 style={{ fontSize: '2.3rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '18px' }}>
                Why I Founded <span style={{ color: 'var(--primary)' }}>Ecom With Sami</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '16px' }}>
                Years ago, starting in e-commerce from Pakistan felt almost impossible. Between expensive payment gateways, inventory risks, and theoretical courses taught by people who had never run an ad, most beginners failed before making their first dollar.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '24px' }}>
                I discovered that the Gulf market (UAE and Saudi Arabia) offered the perfect ecosystem: high order values, reliable local Cash on Delivery couriers, and zero upfront inventory requirements. I built this academy to provide Pakistani students with the exact step-by-step roadmap, live ad audits, and direct supplier connections needed to succeed.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Over 9,700 students trained across Pakistan and abroad',
                  'Direct supplier directories in Dubai and Riyadh',
                  'Dedicated WhatsApp support desk available 6 days a week',
                  'Weekly live campaign reviews and strategy updates'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: 'var(--text-dark)', fontWeight: '600' }}>
                    <CheckCircle2 size={18} color="var(--primary)" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Card */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                maxWidth: '400px',
                margin: '0 auto',
                backgroundColor: '#0B0F19',
                borderRadius: 'var(--radius-xl)',
                padding: '16px',
                border: '1px solid rgba(0, 160, 223, 0.3)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  alt="Sami Ur Rehman"
                  style={{
                    width: '100%',
                    height: '380px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-lg)'
                  }}
                />
                <div style={{ padding: '16px 12px 6px 12px', color: '#FFFFFF' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Sami Ur Rehman</h3>
                  <p style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>Founder &amp; Head Mentor</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8FAFC' }}>
        <div className="site-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="badge-pill badge-cyan" style={{ marginBottom: '12px' }}>CORE PILLARS</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-dark)' }}>
              What Makes Us Different
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              { icon: <Target size={28} color="var(--primary)" />, title: '100% Practical Action', desc: 'No boring theories. We build a live store, hunt live products, and launch live ads together on screen.' },
              { icon: <HeartHandshake size={28} color="var(--accent-green)" />, title: 'WhatsApp Mentorship', desc: 'Never get stuck alone. Direct WhatsApp assistance from 9 AM to 5 PM solves your technical hiccups.' },
              { icon: <Award size={28} color="var(--accent-amber)" />, title: 'Verified Supplier Lists', desc: 'Exclusive access to vetted Gulf suppliers who fulfill orders with fast shipping and Arabic packaging.' },
              { icon: <Users size={28} color="#EC4899" />, title: 'Active Mastermind', desc: 'Join a private network of ambitious Pakistani dropshippers sharing real wins, strategies, and ad insights.' }
            ].map((p, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-light)',
                  padding: '30px 24px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px'
                }}>
                  {p.icon}
                </div>
                <h3 style={{ fontSize: '1.18rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '8px' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <a href="/enrollment" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
              Join the Academy for PKR 3,900 <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
