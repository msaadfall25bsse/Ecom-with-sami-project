import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Lock, UserX, Eye, Info, X } from 'lucide-react';

interface LmsSecurityAlertBannerProps {
  studentName?: string;
  studentEmail?: string;
  ip?: string;
}

export const LmsSecurityAlertBanner: React.FC<LmsSecurityAlertBannerProps> = ({
  studentName,
  studentEmail,
  ip
}) => {
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  // Security warning alerts shown in the rolling marquee
  const alerts = [
    '🚫 STRICT COPYRIGHT WARNING: Screen recording, screenshot capturing, and lecture video downloading are strictly prohibited.',
    '⚖️ ZERO TOLERANCE: Any unauthorized recording or content leak will result in an IMMEDIATE PERMANENT ACCOUNT BAN without refund.',
    '🛡️ FORENSIC DRM ACTIVE: Your active session, Student ID, Email, and IP Address are dynamically watermarked and logged in real time.',
    '🔒 ONE-USER ACCOUNT POLICY: Sharing login credentials or accessing from unauthorized devices triggers automatic security lockout and device blacklist.',
    '🚨 LEGAL NOTICE: All curriculum materials are protected under International Intellectual Property & Copyright Laws.'
  ];

  return (
    <>
      {/* Top Rolling Security Marquee Bar - Full Width Clean Ticker */}
      <aside
        aria-label="Security Notice"
        style={{
          background: 'linear-gradient(90deg, #380707 0%, #15102A 50%, #380707 100%)',
          borderBottom: '1px solid rgba(239, 68, 68, 0.35)',
          boxShadow: '0 2px 10px rgba(239, 68, 68, 0.12)',
          color: '#FFFFFF',
          padding: '8px 0',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          fontSize: '0.82rem',
          zIndex: 35,
          width: '100%'
        }}
      >
        {/* Full-Width Animated Rolling Marquee */}
        <div
          style={{
            flex: 1,
            width: '100%',
            overflow: 'hidden',
            maskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)'
          }}
        >
          <div
            className="animate-marquee"
            style={{
              display: 'flex',
              gap: '48px',
              whiteSpace: 'nowrap',
              animationDuration: '85s'
            }}
          >
            {[...alerts, ...alerts].map((alert, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  color: '#FEE2E2',
                  fontSize: '0.82rem',
                  letterSpacing: '0.01em'
                }}
              >
                <span>{alert}</span>
                <span style={{ color: '#EF4444', opacity: 0.7 }}>•</span>
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* Full Security Policy & Ban Warning Modal */}
      {showPolicyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 15, 25, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowPolicyModal(false)}
        >
          <div
            style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              color: '#FFFFFF',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(239, 68, 68, 0.2)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPolicyModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#EF4444'
                }}
              >
                <ShieldAlert size={26} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  LMS Anti-Piracy &amp; DRM Policy
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 0 0', color: '#FFFFFF' }}>
                  Student Protection &amp; Account Security
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '20px' }}>
              To safeguard proprietary dropshipping blueprints, suppliers, and intellectual property, all student sessions in the <strong>Ecom With Sami VIP Classroom</strong> are protected by automated forensic security monitoring.
            </p>

            {/* Violations List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  backgroundColor: '#1E293B',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <AlertTriangle size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF' }}>
                    1. No Screen Recording or Screenshots
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>
                    Capturing lectures via screen recorders, snipping tools, browser plugins, or external capture devices is strictly prohibited.
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  backgroundColor: '#1E293B',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <Lock size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF' }}>
                    2. Dynamic Forensic Watermarking
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>
                    Every video stream is dynamically embedded with your visible and invisible forensic identifiers:
                    <span style={{ color: '#38BDF8', fontWeight: 600 }}> {studentName || 'Student'} ({studentEmail || 'Registered Email'}) • IP: {ip || 'Session IP'}</span>.
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  backgroundColor: '#1E293B',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}
              >
                <UserX size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#FCA5A5' }}>
                    3. Penalties &amp; Permanent Ban
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#CBD5E1', marginTop: '2px' }}>
                    Any detected attempt to pirate, download, resell, or share credentials will trigger an <strong>instant permanent ban</strong>, forfeiture of access without refund, and potential legal action.
                  </div>
                </div>
              </div>
            </div>

            {/* Close / Acknowledge Button */}
            <button
              type="button"
              onClick={() => setShowPolicyModal(false)}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.9rem',
                justifyContent: 'center',
                backgroundColor: '#DC2626',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)'
              }}
            >
              I Understand &bull; Continue Learning
            </button>
          </div>
        </div>
      )}
    </>
  );
};
