import React, { useEffect, useState } from 'react';
import { ShieldX, Lock, MessageCircle, LogOut, RefreshCw, CheckCircle2 } from 'lucide-react';

interface LmsSuspensionScreenProps {
  studentName?: string;
  studentEmail?: string;
  studentId?: string;
  ip?: string;
  suspendedReason?: string;
  adminWhatsApp?: string;
  onLogout?: () => void;
}

export const LmsSuspensionScreen: React.FC<LmsSuspensionScreenProps> = ({
  studentName = 'Enrolled Student',
  studentEmail = '',
  studentId = 'STU-001',
  ip = '127.0.0.1',
  suspendedReason = 'Account blocked due to multiple unauthorized screenshot or screen recording attempts (5/5 strikes)',
  adminWhatsApp = '+92 333 0093269',
  onLogout
}) => {
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [unlockedSuccess, setUnlockedSuccess] = useState(false);

  // Format WhatsApp Link with pre-filled message
  const cleanPhone = (adminWhatsApp || '923330093269').replace(/[^0-9]/g, '') || '923330093269';
  const prefilledMessage = encodeURIComponent(
    `Hello Admin,\n\nMy Student LMS Account has been BLOCKED due to 5 security strikes (Unauthorized Screenshot / Recording).\n\nStudent Name: ${studentName}\nEmail: ${studentEmail}\nStudent ID: #${studentId}\nIP Address: ${ip}\nReason: ${suspendedReason}\n\nI request an appeal to verify my identity and unlock my LMS access.`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${prefilledMessage}`;

  // Check if Admin has approved unlock in Admin Panel
  const checkUnlockStatus = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    try {
      setCheckingStatus(true);
      const res = await fetch('/api/lms/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        const data = await res.json();
        // If Admin has unlocked student: status is active and strikes are 0
        if (data.success && !data.isSuspended && data.student?.status === 'active' && (!data.student?.security_strikes || data.student?.security_strikes === 0)) {
          setUnlockedSuccess(true);
          localStorage.removeItem('lms_is_suspended');
          localStorage.removeItem('lms_local_strikes');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    } catch (err) {
      // silent
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    // Automatically poll every 4 seconds to check if Admin has clicked [Unlock]
    const interval = setInterval(checkUnlockStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070A11',
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(220, 38, 38, 0.18) 0%, transparent 65%)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: '#0F172A',
          border: '2px solid rgba(239, 68, 68, 0.8)',
          borderRadius: '20px',
          padding: '36px 28px',
          boxShadow: '0 25px 60px rgba(220, 38, 38, 0.3), 0 0 50px rgba(0,0,0,0.9)',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease'
        }}
      >
        {/* Unlocked banner if Admin just approved */}
        {unlockedSuccess ? (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', padding: '16px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#10B981' }}>
            <CheckCircle2 size={24} />
            <div style={{ textAlign: 'left' }}>
              <strong style={{ color: '#FFFFFF' }}>Account Unlocked by Admin!</strong>
              <div style={{ fontSize: '0.82rem' }}>Reopening classroom...</div>
            </div>
          </div>
        ) : null}

        {/* Suspension Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '2.5px solid #EF4444',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.45)'
            }}
          >
            <ShieldX size={44} />
          </div>
        </div>

        {/* Status Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '999px',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}
        >
          <Lock size={13} />
          <span>Access Revoked • 5/5 Strikes Triggered</span>
        </div>

        {/* Main Heading */}
        <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.85rem)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
          Student Account Suspended
        </h1>

        <p style={{ fontSize: '0.9rem', color: '#FCA5A5', margin: '0 auto 24px auto', maxWidth: '460px', lineHeight: 1.5 }}>
          Your access to video lectures and LMS materials has been permanently locked due to repeated unauthorized screenshot or screen recording attempts.
        </p>

        {/* Audit Details Card */}
        <div
          style={{
            backgroundColor: '#070A11',
            border: '1px solid #1E293B',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'left',
            fontSize: '0.82rem',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: '#94A3B8' }}>
            <div>
              <span style={{ color: '#64748B' }}>Student Name:</span>
              <div style={{ color: '#F1F5F9', fontWeight: 700 }}>{studentName}</div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Student ID:</span>
              <div style={{ color: '#00A0DF', fontWeight: 700 }}>#{studentId}</div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Registered Email:</span>
              <div style={{ color: '#F1F5F9', fontWeight: 700, wordBreak: 'break-all' }}>{studentEmail}</div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>IP Address:</span>
              <div style={{ color: '#F1F5F9', fontWeight: 700 }}>{ip}</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1E293B', marginTop: '12px', paddingTop: '10px', fontSize: '0.78rem', color: '#EF4444' }}>
            <strong>Violation:</strong> {suspendedReason}
          </div>
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* WhatsApp Unlock Appeal Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '14px 20px',
              borderRadius: '10px',
              backgroundColor: '#10B981',
              backgroundImage: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            <MessageCircle size={20} />
            <span>Contact Admin on WhatsApp to Unlock Account</span>
          </a>

          {/* Check Unlock Status manually */}
          <button
            type="button"
            onClick={checkUnlockStatus}
            disabled={checkingStatus}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#E2E8F0',
              fontWeight: 600,
              fontSize: '0.84rem',
              cursor: checkingStatus ? 'not-allowed' : 'pointer'
            }}
          >
            <RefreshCw size={15} className={checkingStatus ? 'animate-spin' : ''} />
            <span>{checkingStatus ? 'Checking Admin Approval...' : 'Check If Admin Unlocked Account'}</span>
          </button>

          {/* Logout Button */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                border: '1px solid #334155',
                color: '#94A3B8',
                fontWeight: 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <LogOut size={16} />
              <span>Logout from LMS Session</span>
            </button>
          )}
        </div>

        {/* Footer Support Notice */}
        <p style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '20px', marginBottom: 0 }}>
          Admin Support Desk: <strong>{adminWhatsApp || '+92 333 0093269'}</strong> • Status auto-checks every 4 seconds
        </p>
      </div>
    </div>
  );
};
