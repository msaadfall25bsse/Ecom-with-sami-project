import React, { useState, useEffect } from 'react';
import { Lock, Mail, KeyRound, ArrowRight, ShieldCheck, HelpCircle, MessageSquare } from 'lucide-react';
import { useContactConfig } from '../../utils/contactConfig';

export default function StudentLoginPage() {
  const { getWhatsAppUrl } = useContactConfig();
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'student') {
          window.location.href = '/lms';
        } else if (user.role === 'admin') {
          window.location.href = '/admin';
        }
      } catch {}
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !accessCode.trim()) {
      setError('Please enter both your registered email address and Access Code.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          accessCode: accessCode.trim()
        })
      });

      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else if (data.user?.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/lms';
        }
      } else {
        setError(data.message || 'Invalid email or access code. Please check your credentials.');
      }
    } catch (err: any) {
      setError('Connection error. Please verify your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', backgroundColor: '#0B0F19', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(0, 160, 223, 0.12)', border: '1px solid rgba(0, 160, 223, 0.3)', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '14px' }}>
            <ShieldCheck size={16} />
            <span>VIP STUDENT CLASSROOM PORTAL</span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Sign In to <span style={{ color: 'var(--primary)' }}>Web LMS</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.92rem' }}>
            Enter your registered email and LMS Access Code to start learning
          </p>
        </div>

        {/* Login Box */}
        <div style={{ backgroundColor: '#111827', borderRadius: '16px', border: '1px solid #1F2937', padding: '32px 28px', boxShadow: '0 20px 45px rgba(0,0,0,0.45)' }}>
          {error && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', borderRadius: '8px', padding: '12px 16px', color: '#FCA5A5', fontSize: '0.88rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '6px' }}>
                Registered Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px 12px 40px', backgroundColor: '#0B0F19', border: '1px solid #374151', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '6px' }}>
                LMS Access Code / Password
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. SAMI749201"
                  value={accessCode}
                  onChange={e => setAccessCode(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px 12px 40px', backgroundColor: '#0B0F19', border: '1px solid #374151', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none', letterSpacing: '0.04em' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px' }}
            >
              {loading ? (
                <span>Logging In...</span>
              ) : (
                <>
                  <span>Enter Student Classroom</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Help note */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #1F2937', textAlign: 'center', fontSize: '0.85rem', color: '#94A3B8' }}>
            <p style={{ margin: '0 0 10px 0' }}>
              Haven't received your Access Code yet?
            </p>
            <a
              href={getWhatsAppUrl('Hello Sami, I enrolled in the Dropshipping Mentorship and need my LMS Access Code')}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontWeight: 700, textDecoration: 'none' }}
            >
              <MessageSquare size={16} />
              <span>Contact Admissions on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Not enrolled prompt */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: '#64748B' }}>
          <span>Not yet enrolled in the masterclass? </span>
          <a href="/enrollment" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Enroll Now (88% OFF)
          </a>
        </div>

      </div>
    </div>
  );
}
