import React, { useState } from 'react';
import { analytics } from '../utils/analytics';
import { useContactConfig } from '../utils/contactConfig';

export function WhatsAppWidget() {
  const { getWhatsAppUrl, displayPhone, supportHours } = useContactConfig();
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl = getWhatsAppUrl('Hi Sami! I want to inquire about the UAE & KSA Dropshipping Course.');

  return (
    <div
      className="floating-whatsapp-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}
    >
      {/* Floating Tooltip Pill */}
      <div
        className="whatsapp-tooltip-pill"
        style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '8px 14px',
          borderRadius: '20px',
          fontSize: '0.82rem',
          fontWeight: '600',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          border: '1px solid rgba(37, 211, 102, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: isHovered ? 'auto' : 'none',
          whiteSpace: 'nowrap'
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#25D366',
            boxShadow: '0 0 8px #25D366',
            display: 'inline-block'
          }}
        />
        <span>Chat on WhatsApp</span>
      </div>

      {/* Main WhatsApp Circular Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp-btn"
        aria-label="Chat with Mentor Sami on WhatsApp"
        title={`Direct WhatsApp Mentorship (${displayPhone})`}
        onClick={() => analytics.trackContact({ contact_channel: 'Floating WhatsApp Widget' })}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          backgroundImage: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45), 0 2px 6px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          position: 'relative',
          textDecoration: 'none',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
          willChange: 'transform'
        }}
      >
        {/* Animated Radar Pulse Ring */}
        <span
          className="whatsapp-pulse-ring"
          style={{
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            right: '-4px',
            bottom: '-4px',
            borderRadius: '50%',
            border: '2px solid #25D366',
            opacity: 0.8,
            animation: 'whatsappPulse 2.2s infinite'
          }}
        />

        {/* Official Authentic WhatsApp SVG Logo */}
        <svg
          viewBox="0 0 32 32"
          width="32"
          height="32"
          fill="currentColor"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
        >
          <path d="M16 0.5C7.44 0.5 0.5 7.44 0.5 16C0.5 18.736 1.213 21.31 2.457 23.54L0.6 30.4L7.65 28.58C9.79 29.74 12.24 30.5 16 30.5C24.56 30.5 31.5 23.56 31.5 16C31.5 7.44 24.56 0.5 16 0.5ZM16 27.95C12.65 27.95 10.45 27.16 8.52 26.02L8.06 25.75L3.88 26.84L4.99 22.77L4.7 22.31C3.45 20.32 2.79 18.21 2.79 16C2.79 8.7 8.7 2.79 16 2.79C23.3 2.79 29.21 8.7 29.21 16C29.21 23.3 23.3 27.95 16 27.95ZM22.74 19.38C22.37 19.2 20.55 18.3 20.21 18.18C19.87 18.06 19.63 18 19.38 18.37C19.14 18.74 18.45 19.55 18.24 19.79C18.03 20.03 17.82 20.06 17.45 19.88C17.08 19.7 15.89 19.31 14.48 18.05C13.38 17.07 12.64 15.86 12.43 15.49C12.22 15.12 12.41 14.92 12.59 14.74C12.76 14.57 12.96 14.31 13.14 14.1C13.32 13.89 13.38 13.74 13.5 13.5C13.62 13.26 13.56 13.05 13.47 12.87C13.38 12.69 12.65 10.89 12.35 10.16C12.06 9.45 11.76 9.55 11.54 9.54C11.33 9.53 11.09 9.53 10.85 9.53C10.61 9.53 10.22 9.62 9.89 9.98C9.56 10.34 8.62 11.22 8.62 13.02C8.62 14.82 9.93 16.56 10.11 16.8C10.29 17.04 12.68 20.73 16.34 22.31C17.21 22.69 17.89 22.91 18.42 23.08C19.29 23.36 20.08 23.32 20.71 23.23C21.41 23.13 22.87 22.35 23.17 21.5C23.47 20.65 23.47 19.92 23.38 19.77C23.29 19.62 23.08 19.53 22.74 19.38Z" />
        </svg>
      </a>
    </div>
  );
}
