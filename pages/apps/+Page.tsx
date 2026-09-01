import React, { useEffect } from 'react';
import { GraduationCap, ArrowRight, ShieldCheck, Globe, Smartphone, Laptop, CheckCircle2 } from 'lucide-react';

export default function AppsPage() {
  useEffect(() => {
    // Check if student has token
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/lms';
    }
  }, []);

  return (
    <div style={{ backgroundColor: '#0B0F19', color: '#FFFFFF', minHeight: '85vh', paddingBottom: '80px' }}>
      
      {/* Header Banner */}
      <section style={{
        background: 'linear-gradient(180deg, #0B0F19 0%, #111827 100%)',
        padding: '64px 0 50px 0',
        textAlign: 'center',
        borderBottom: '1px solid rgba(0, 160, 223, 0.25)',
        marginBottom: '40px'
      }}>
        <div className="site-container">
          <span className="badge-pill badge-cyan" style={{ marginBottom: '14px' }}>
            NEW: INSTANT WEB BROWSER LMS
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: '800', lineHeight: 1.2, maxWidth: '800px', margin: '0 auto 12px auto' }}>
            Access <span style={{ color: 'var(--primary)' }}>Sami Mentorship LMS</span> Directly in Browser
          </h1>
          <p style={{ color: '#94A3B8', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            No installation required. Stream all 36 HD dropshipping lectures seamlessly on iPhone (iOS), Android, iPad, Mac, and Windows laptops.
          </p>
        </div>
      </section>

      <div className="site-container" style={{ maxWidth: '840px' }}>
        
        {/* Main LMS Portal Card */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: '16px',
          border: '2px solid rgba(0, 160, 223, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 160, 223, 0.15)',
          padding: '40px 32px',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 160, 223, 0.15)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto'
          }}>
            <GraduationCap size={40} />
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
            Official Student Learning Portal
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: '560px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
            Log in with your registered email and 6-digit LMS Access Code to access all 11 modules, downloads, and weekly mastermind coaching.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', textAlign: 'left', marginBottom: '32px' }}>
            <div style={{ backgroundColor: '#0B0F19', padding: '16px', borderRadius: '10px', border: '1px solid #1F2937', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Smartphone size={24} color="var(--primary)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>iPhone & Android</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>100% Mobile Responsive</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#0B0F19', padding: '16px', borderRadius: '10px', border: '1px solid #1F2937', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Laptop size={24} color="var(--accent-green)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Mac & Windows</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Ultra HD Streaming</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#0B0F19', padding: '16px', borderRadius: '10px', border: '1px solid #1F2937', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={24} color="var(--accent-amber)" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>DRM Protected</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Secure Video Player</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a
              href="/login"
              className="btn btn-primary"
              style={{ padding: '14px 32px', fontSize: '1.05rem', fontWeight: 800, borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
            >
              <span>Log In to Student LMS</span>
              <ArrowRight size={18} />
            </a>

            <a
              href="/enrollment"
              className="btn btn-outline"
              style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', color: '#FFFFFF' }}
            >
              <span>Enroll Now (88% OFF)</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
