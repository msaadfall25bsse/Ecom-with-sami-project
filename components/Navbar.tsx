import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, ArrowRight, Download, Sparkles, BookOpen, Users, HelpCircle, GraduationCap } from 'lucide-react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.96)' : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.85)',
        boxShadow: scrolled ? '0 4px 20px -2px rgba(15, 23, 42, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.02)',
        transition: 'all 0.25s ease'
      }}
    >
      <div
        className="nav-inner-container"
        style={{
          width: '100%',
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px'
        }}
      >
        
        {/* 1. BRAND LOGO (Comfortably on Left, Never Crowded) */}
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            flexShrink: 0
          }}
          className="brand-logo-group"
        >
          {/* Logo Icon Box with Gradient & Glow */}
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #00A0DF 0%, #0077B6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0, 160, 223, 0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              flexShrink: 0
            }}
            className="brand-icon-box"
          >
            <ShoppingBag size={19} strokeWidth={2.2} />
          </div>

          {/* Logo Typography */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: '#0F172A',
              whiteSpace: 'nowrap'
            }} className="brand-title-text">
              Ecom <span style={{ color: 'var(--primary)' }}>With Sami</span>
            </div>
            <div style={{
              fontSize: '0.66rem',
              fontWeight: '700',
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginTop: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap'
            }} className="brand-sub-badge">
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--accent-green)', display: 'inline-block' }} />
              Dropshipping Academy
            </div>
          </div>
        </a>

        {/* 2. DESKTOP NAVIGATION LINKS (Visible on Laptops & Desktops >= 1024px) */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '4px'
          }}
          className="desktop-nav"
        >
          {[
            { label: 'Home', href: '/' },
            { label: 'Curriculum', href: '/#curriculum' },
            { label: 'Success Stories', href: '/success' },
            { label: 'About Sami', href: '/about' },
            { label: 'Guides & Blog', href: '/blogs' },
            { label: 'Support', href: '/support' }
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="nav-link-item"
              style={{
                fontSize: '0.88rem',
                fontWeight: '600',
                color: '#334155',
                padding: '7px 12px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
                display: 'inline-block',
                whiteSpace: 'nowrap'
              }}
            >
              {item.label}
            </a>
          ))}

          {/* Student LMS Login Pill */}
          <a
            href="/login"
            className="nav-link-item lms-app-link"
            style={{
              fontSize: '0.88rem',
              fontWeight: '700',
              color: 'var(--primary)',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 160, 223, 0.08)',
              border: '1px solid rgba(0, 160, 223, 0.25)',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginLeft: '4px',
              whiteSpace: 'nowrap'
            }}
          >
            <GraduationCap size={15} />
            <span>Student LMS</span>
          </a>
        </nav>

        {/* 3. RIGHT ACTION BUTTONS (Enroll Now ALWAYS Visible on Mobile & Tablet!) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          
          {/* Top Bar "Enroll Now" Button - PROMINENT & ALWAYS VISIBLE ON ALL SCREENS */}
          <a
            href="/enrollment"
            className="header-enroll-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #00A0DF 0%, #0084BA 100%)',
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0, 160, 223, 0.3)',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              fontWeight: '700'
            }}
          >
            <span className="btn-label-desktop">Enroll Now</span>
            <span className="btn-label-mobile">Enroll</span>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: '800'
              }}
              className="price-tag-badge"
            >
              PKR 3,900
            </span>
            <ArrowRight size={13} strokeWidth={2.4} />
          </a>

          {/* Mobile & Tablet Hamburger Toggle Button (Positioned cleanly beside Enroll button) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              backgroundColor: mobileOpen ? 'rgba(0, 160, 223, 0.1)' : '#F8FAFC',
              border: '1px solid var(--border-light)',
              cursor: 'pointer',
              color: '#0F172A',
              padding: 0,
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            className="mobile-nav-toggle"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X size={19} color="var(--primary)" /> : <Menu size={19} />}
          </button>
        </div>

      </div>

      {/* 4. MOBILE & TABLET DRAWER NAVIGATION */}
      {mobileOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--border-light)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
            padding: '16px 20px 24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
          className="mobile-drawer-menu"
        >
          {[
            { label: 'Home & Blueprint', href: '/' },
            { label: '11-Module Curriculum', href: '/#curriculum' },
            { label: 'Student Success Proof', href: '/success' },
            { label: 'About Mentor Sami', href: '/about' },
            { label: 'E-Commerce Guides & Blog', href: '/blogs' },
            { label: 'Student Support & WhatsApp', href: '/support' }
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: '0.96rem',
                fontWeight: '600',
                color: '#1E293B',
                padding: '10px 4px',
                borderBottom: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textDecoration: 'none'
              }}
            >
              <span>{item.label}</span>
              <ArrowRight size={14} color="#94A3B8" />
            </a>
          ))}

          {/* Student LMS Classroom Login */}
          <a
            href="/login"
            onClick={() => setMobileOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              backgroundColor: 'rgba(0, 160, 223, 0.08)',
              borderRadius: '8px',
              color: 'var(--primary)',
              fontWeight: '700',
              fontSize: '0.92rem',
              textDecoration: 'none',
              marginTop: '4px'
            }}
          >
            <GraduationCap size={18} />
            <span>Student LMS Classroom Login</span>
          </a>

          {/* Mobile Full Checkout Action */}
          <div style={{ paddingTop: '8px' }}>
            <a
              href="/enrollment"
              onClick={() => setMobileOpen(false)}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.96rem',
                justifyContent: 'center'
              }}
            >
              <span>Enroll in Mentorship (PKR 3,900)</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      )}

      {/* 5. STRONG RESPONSIVE CSS FOR ALL SCREEN SIZES */}
      <style>{`
        /* Logo Hover Micro-Interactions */
        .brand-logo-group:hover .brand-icon-box {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 160, 223, 0.45);
        }

        /* Desktop Nav Link Hover */
        .nav-link-item:hover {
          color: var(--primary) !important;
          background-color: rgba(0, 160, 223, 0.06);
        }

        .lms-app-link:hover {
          background-color: rgba(0, 160, 223, 0.15) !important;
          transform: translateY(-1px);
        }

        /* Enroll Button Micro-Interactions */
        .header-enroll-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0, 160, 223, 0.45) !important;
          background: linear-gradient(135deg, #0090C8 0%, #006D9E 100%) !important;
        }

        /* --- SCREEN BREAKPOINTS --- */

        /* DESKTOP & LARGE SCREENS (>= 1024px) */
        @media (min-width: 1024px) {
          .nav-inner-container {
            padding: 0 32px !important;
            height: 70px !important;
          }
          .desktop-nav {
            display: flex !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
          .header-enroll-btn {
            padding: 8px 16px !important;
            font-size: 0.84rem !important;
          }
          .btn-label-desktop {
            display: inline !important;
          }
          .btn-label-mobile {
            display: none !important;
          }
          .price-tag-badge {
            display: inline !important;
          }
        }

        /* TABLETS & MEDIUM SCREENS (641px to 1023px) */
        @media (min-width: 641px) and (max-width: 1023px) {
          .nav-inner-container {
            padding: 0 24px !important;
            height: 66px !important;
          }
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: flex !important;
            width: 38px !important;
            height: 38px !important;
          }
          .header-enroll-btn {
            padding: 8px 14px !important;
            font-size: 0.82rem !important;
          }
          .btn-label-desktop {
            display: inline !important;
          }
          .btn-label-mobile {
            display: none !important;
          }
          .price-tag-badge {
            display: inline !important;
          }
        }

        /* SMARTPHONES & SMALL SCREENS (381px to 640px) */
        @media (min-width: 381px) and (max-width: 640px) {
          .nav-inner-container {
            padding: 0 16px !important;
            height: 62px !important;
          }
          .desktop-nav {
            display: none !important;
          }
          .brand-icon-box {
            width: 34px !important;
            height: 34px !important;
          }
          .brand-title-text {
            font-size: 1.08rem !important;
          }
          .brand-sub-badge {
            font-size: 0.60rem !important;
          }
          .mobile-nav-toggle {
            display: flex !important;
            width: 35px !important;
            height: 35px !important;
          }
          .header-enroll-btn {
            padding: 7px 11px !important;
            font-size: 0.78rem !important;
          }
          .btn-label-desktop {
            display: inline !important;
          }
          .btn-label-mobile {
            display: none !important;
          }
          .price-tag-badge {
            display: none !important;
          }
        }

        /* EXTRA COMPACT SMARTPHONES (<= 380px) */
        @media (max-width: 380px) {
          .nav-inner-container {
            padding: 0 12px !important;
            height: 58px !important;
          }
          .desktop-nav {
            display: none !important;
          }
          .brand-icon-box {
            width: 32px !important;
            height: 32px !important;
          }
          .brand-title-text {
            font-size: 0.98rem !important;
          }
          .brand-sub-badge {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: flex !important;
            width: 33px !important;
            height: 33px !important;
          }
          .header-enroll-btn {
            padding: 6px 9px !important;
            font-size: 0.74rem !important;
            gap: 4px !important;
          }
          .btn-label-desktop {
            display: none !important;
          }
          .btn-label-mobile {
            display: inline !important;
          }
          .price-tag-badge {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
