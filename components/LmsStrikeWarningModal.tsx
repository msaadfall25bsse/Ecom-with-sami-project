import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, Lock, Shield, ShieldX, XCircle } from 'lucide-react';

interface LmsStrikeWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  strikeCount: number;
  studentName?: string;
  studentEmail?: string;
  studentId?: string;
  ip?: string;
  timestamp?: string;
}

export const LmsStrikeWarningModal: React.FC<LmsStrikeWarningModalProps> = ({
  isOpen,
  onClose,
  strikeCount = 1,
  studentName = 'Enrolled Student',
  studentEmail = '',
  studentId = 'STU-001',
  ip = '127.0.0.1',
  timestamp = new Date().toLocaleString()
}) => {
  if (!isOpen) return null;

  const isFinalWarning = strikeCount === 4;
  const isSevereWarning = strikeCount === 3;
  const remainingStrikes = Math.max(0, 5 - strikeCount);

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 15, 25, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          backgroundColor: '#111827',
          border: isFinalWarning ? '2px solid #EF4444' : isSevereWarning ? '2px solid #F97316' : '2px solid #F59E0B',
          borderRadius: '20px',
          padding: '30px 24px',
          boxShadow: isFinalWarning
            ? '0 25px 60px rgba(239, 68, 68, 0.4), 0 0 50px rgba(0, 0, 0, 0.95)'
            : '0 25px 60px rgba(245, 158, 11, 0.35), 0 0 50px rgba(0, 0, 0, 0.95)',
          color: '#FFFFFF',
          position: 'relative',
          textAlign: 'center'
        }}
      >
        {/* Warning Icon Header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: isFinalWarning ? 'rgba(239, 68, 68, 0.2)' : isSevereWarning ? 'rgba(249, 115, 22, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              border: isFinalWarning ? '2px solid #EF4444' : isSevereWarning ? '2px solid #F97316' : '2px solid #F59E0B',
              color: isFinalWarning ? '#EF4444' : isSevereWarning ? '#F97316' : '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isFinalWarning ? '0 0 30px rgba(239, 68, 68, 0.6)' : '0 0 25px rgba(245, 158, 11, 0.5)'
            }}
          >
            <ShieldAlert size={36} />
          </div>
        </div>

        {/* 5-STRIKE VISUAL LIFE METER */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.76rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, marginBottom: '10px' }}>
            ANTI-PIRACY 5-STRIKE TRACKER
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
            {/* Strike 1 */}
            <div
              style={{
                backgroundColor: strikeCount >= 1 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
                border: strikeCount >= 1 ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px 4px',
                color: strikeCount >= 1 ? '#EF4444' : '#64748B',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              {strikeCount >= 1 ? <ShieldX size={16} /> : <Shield size={16} />}
              <span style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                {strikeCount >= 1 ? 'STK 1 ❌' : 'STK 1'}
              </span>
              <span style={{ fontSize: '0.6rem', color: strikeCount >= 1 ? '#FCA5A5' : '#64748B' }}>
                {strikeCount >= 1 ? 'USED' : 'SAFE'}
              </span>
            </div>

            {/* Strike 2 */}
            <div
              style={{
                backgroundColor: strikeCount >= 2 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
                border: strikeCount >= 2 ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px 4px',
                color: strikeCount >= 2 ? '#EF4444' : '#64748B',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              {strikeCount >= 2 ? <ShieldX size={16} /> : <Shield size={16} />}
              <span style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                {strikeCount >= 2 ? 'STK 2 ❌' : 'STK 2'}
              </span>
              <span style={{ fontSize: '0.6rem', color: strikeCount >= 2 ? '#FCA5A5' : '#64748B' }}>
                {strikeCount >= 2 ? 'USED' : 'SAFE'}
              </span>
            </div>

            {/* Strike 3 */}
            <div
              style={{
                backgroundColor: strikeCount >= 3 ? 'rgba(249, 115, 22, 0.22)' : 'rgba(255,255,255,0.05)',
                border: strikeCount >= 3 ? '1.5px solid #F97316' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px 4px',
                color: strikeCount >= 3 ? '#F97316' : '#64748B',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              {strikeCount >= 3 ? <ShieldX size={16} /> : <Shield size={16} />}
              <span style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                {strikeCount >= 3 ? 'STK 3 ⚠️' : 'STK 3'}
              </span>
              <span style={{ fontSize: '0.6rem', color: strikeCount >= 3 ? '#FDBA74' : '#64748B' }}>
                {strikeCount >= 3 ? 'USED' : 'SAFE'}
              </span>
            </div>

            {/* Strike 4 */}
            <div
              style={{
                backgroundColor: strikeCount >= 4 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255,255,255,0.05)',
                border: strikeCount >= 4 ? '1.5px solid #EF4444' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px 4px',
                color: strikeCount >= 4 ? '#EF4444' : '#64748B',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              {strikeCount >= 4 ? <ShieldX size={16} /> : <Shield size={16} />}
              <span style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                {strikeCount >= 4 ? 'STK 4 🚨' : 'STK 4'}
              </span>
              <span style={{ fontSize: '0.6rem', color: strikeCount >= 4 ? '#FCA5A5' : '#64748B' }}>
                {strikeCount >= 4 ? 'FINAL' : 'SAFE'}
              </span>
            </div>

            {/* Strike 5 (BAN) */}
            <div
              style={{
                backgroundColor: strikeCount >= 5 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.06)',
                border: strikeCount >= 5 ? '1.5px solid #EF4444' : '1px dashed rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                padding: '8px 4px',
                color: '#EF4444',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <Lock size={16} />
              <span style={{ fontSize: '0.68rem', fontWeight: 800 }}>
                STK 5
              </span>
              <span style={{ fontSize: '0.6rem', color: '#EF4444', fontWeight: 700 }}>
                ⛔ BAN
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            {isFinalWarning
              ? '🚨 FINAL DANGER WARNING: Strike 4 of 5'
              : isSevereWarning
              ? '⚠️ SEVERE WARNING: Strike 3 of 5'
              : `⚠️ WARNING: Screenshot / Capture Attempt (${strikeCount}/5)`}
          </h2>
          <p style={{ fontSize: '0.85rem', color: isFinalWarning ? '#FCA5A5' : isSevereWarning ? '#FDBA74' : '#FDE68A', margin: 0, lineHeight: 1.45 }}>
            {isFinalWarning
              ? 'You have only 1 strike left! The 5th capture attempt will IMMEDIATELY & PERMANENTLY BAN your student account.'
              : `Screenshot or screen recording attempt logged. You have ${remainingStrikes} strike${remainingStrikes === 1 ? '' : 's'} remaining.`}
          </p>
        </div>

        {/* Incident Audit Details Box */}
        <div
          style={{
            backgroundColor: '#0B0F19',
            border: '1px solid #1F2937',
            borderRadius: '10px',
            padding: '12px 14px',
            fontSize: '0.78rem',
            marginBottom: '16px',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', color: '#94A3B8' }}>
            <div>
              <span style={{ color: '#64748B' }}>Student:</span> <strong style={{ color: '#E2E8F0' }}>{studentName}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Student ID:</span> <strong style={{ color: '#00A0DF' }}>#{studentId}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>IP Address:</span> <strong style={{ color: '#E2E8F0' }}>{ip}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Timestamp:</span> <strong style={{ color: '#E2E8F0' }}>{timestamp}</strong>
            </div>
          </div>
        </div>

        {/* Policy Notice & Consequence Warning */}
        <div
          style={{
            backgroundColor: isFinalWarning ? 'rgba(239, 68, 68, 0.15)' : isSevereWarning ? 'rgba(249, 115, 22, 0.15)' : 'rgba(245, 158, 11, 0.1)',
            borderLeft: isFinalWarning ? '3px solid #EF4444' : isSevereWarning ? '3px solid #F97316' : '3px solid #F59E0B',
            padding: '12px 14px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '0.82rem',
            color: '#CBD5E1',
            lineHeight: 1.55,
            textAlign: 'left'
          }}
        >
          <p style={{ margin: 0 }}>
            {isFinalWarning ? (
              <>
                <strong style={{ color: '#FFFFFF' }}>⚠️ CRITICAL DANGER (Strike 4 of 5):</strong> This is your 4th warning. If you take <strong style={{ color: '#EF4444' }}>ONE MORE screenshot or recording (Strike 5)</strong>, your LMS account will be <strong style={{ color: '#EF4444' }}>PERMANENTLY BLOCKED</strong>. Video lectures will be locked and you will have to appeal directly to Admin via WhatsApp.
              </>
            ) : isSevereWarning ? (
              <>
                <strong style={{ color: '#FFFFFF' }}>⚠️ SEVERE WARNING (Strike 3 of 5):</strong> Unauthorized capture detected. If you reach 5 strikes, your LMS account will be <strong style={{ color: '#EF4444' }}>PERMANENTLY BLOCKED</strong> without refund.
              </>
            ) : (
              <>
                <strong style={{ color: '#FFFFFF' }}>Notice (Strike {strikeCount} of 5):</strong> Course material is strictly copyrighted. If you reach 5 strikes, your student account will be <strong style={{ color: '#EF4444' }}>PERMANENTLY BLOCKED</strong> and locked until Admin WhatsApp identity verification.
              </>
            )}
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '13px 20px',
            borderRadius: '10px',
            backgroundColor: isFinalWarning ? '#DC2626' : isSevereWarning ? '#EA580C' : 'var(--primary, #00A0DF)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '0.92rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: isFinalWarning ? '0 4px 16px rgba(220, 38, 38, 0.4)' : '0 4px 16px rgba(0, 160, 223, 0.4)'
          }}
        >
          <CheckCircle size={18} />
          <span>I Understand &amp; Agree (Resume Lecture)</span>
        </button>
      </div>
    </div>
  );
};
