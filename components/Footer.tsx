import React from 'react';
import { Mail, Phone, MapPin, Globe, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useContactConfig } from '../utils/contactConfig';

export function Footer() {
  const { email, displayPhone, headOffice, regionalOffice, getWhatsAppUrl } = useContactConfig();
  const whatsappUrl = getWhatsAppUrl('Hi Sami! I want to enroll in the UAE & KSA Dropshipping Course (PKR 3,900). Can you help me?');

  return (
    <footer style={{ backgroundColor: '#0B0F19', color: '#FFFFFF', paddingTop: '64px', paddingBottom: '36px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="site-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '50px' }}>
          
          {/* Column 1: Brand & Contact */}
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '14px' }}>
              Ecom <span style={{ color: 'var(--primary)' }}>With Sami</span>
            </div>
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.6 }}>
              Pakistan’s premier practical e-commerce academy helping students build profitable dropshipping stores in the UAE and Saudi Arabia.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
              <a href={`mailto:${email}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-subtle)' }}>
                <Mail size={16} color="var(--primary)" /> {email}
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-subtle)' }}>
                <Phone size={16} color="var(--primary)" /> {displayPhone} (WhatsApp)
              </a>
            </div>
          </div>

          {/* Column 2: Head Office & Regional */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', color: '#FFFFFF' }}>Offices & Locations</h4>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#F1F5F9' }}>Head Office:</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>{headOffice}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Globe size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#F1F5F9' }}>Regional Presence:</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>{regionalOffice}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', color: '#FFFFFF' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li><a href="/" style={{ color: 'var(--text-subtle)' }}>Home &amp; Overview</a></li>
              <li><a href="/#curriculum" style={{ color: 'var(--text-subtle)' }}>11-Module Curriculum</a></li>
              <li><a href="/success" style={{ color: 'var(--text-subtle)' }}>Student Success &amp; Proof</a></li>
              <li><a href="/about" style={{ color: 'var(--text-subtle)' }}>About Mentor Sami</a></li>
              <li><a href="/blogs" style={{ color: 'var(--text-subtle)' }}>Dropshipping Guides &amp; Blog</a></li>
              <li><a href="/support" style={{ color: 'var(--text-subtle)' }}>Student Support</a></li>
              <li><a href="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>🎓 Student LMS Login</a></li>
              <li><a href="/admin/login" style={{ color: '#94A3B8', fontSize: '0.82rem' }}>🔒 Admin Portal</a></li>
            </ul>
          </div>

          {/* Column 4: Trust & Guarantee */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', color: '#FFFFFF' }}>100% Secure &amp; Verified</h4>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-green)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '6px' }}>
                <ShieldCheck size={18} /> Verified Mentorship
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', lineHeight: 1.5 }}>
                Lifetime access to curriculum updates, supplier lists, and direct WhatsApp troubleshooting.
              </p>
            </div>
            <a href="/enrollment" className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.86rem' }}>
              Enroll for PKR 3,900
            </a>
          </div>

        </div>

        {/* Legal & Earnings Disclaimer */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          fontSize: '0.8rem',
          color: '#64748B',
          textAlign: 'center'
        }}>
          <p style={{ maxWidth: '960px', margin: '0 auto', lineHeight: 1.6 }}>
            <strong>Earnings &amp; Results Disclaimer:</strong> Results presented in student case studies and testimonials are not typical and will vary based on individual effort, budget, consistency, and market execution. Success in e-commerce requires dedicated practice, continuous testing, and adherence to proven operational guidelines.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', color: '#94A3B8' }}>
            <span>&copy; {new Date().getFullYear()} Ecom With Sami. All rights reserved.</span>
            <span>Made with passion for Pakistani Entrepreneurs.</span>
          </div>

          {/* Developer & Web Creation Agency Credit */}
          <div style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '0.82rem',
            color: '#94A3B8'
          }}>
            <span>Presented &amp; Crafted by <strong>Professional Web Development</strong></span>
            <span style={{ color: '#475569' }}>•</span>
            <span>Need a custom website for your business?</span>
            <a
              href="https://wa.me/923158960026?text=Hi%2C%20I%20saw%20the%20Ecom%20With%20Sami%20website%20and%20want%20to%20develop%20a%20website%20for%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#00A0DF',
                fontWeight: '700',
                textDecoration: 'none',
                backgroundColor: 'rgba(0, 160, 223, 0.1)',
                padding: '4px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(0, 160, 223, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <Phone size={13} color="#00A0DF" /> 03158960026 (WhatsApp)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
