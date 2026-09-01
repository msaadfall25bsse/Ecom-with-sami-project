import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  ClipboardList, 
  Package, 
  LineChart, 
  Settings, 
  LogOut, 
  GraduationCap, 
  Shield, 
  ExternalLink,
  Menu, 
  X, 
  Code2, 
  Globe, 
  Video 
} from 'lucide-react';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  // 1. Instant Cached User Hydration
  const [adminUser, setAdminUser] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('sami_admin_user');
      if (cached) {
        try { return JSON.parse(cached); } catch {}
      }
    }
    return { name: 'Sami Admin', email: 'admin@samiecom.com' };
  });

  const [authStatus, setAuthStatus] = useState<'validating' | 'authorized' | 'unauthorized'>(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('sami_admin_token');
      if (token) return 'authorized';
      const path = (window.location.pathname || '').replace(/\/+$/, '');
      if (path === '/admin/login') return 'authorized';
      return 'unauthorized';
    }
    return 'authorized';
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [bannedCount, setBannedCount] = useState<number>(0);

  // 2. Lock body scroll on mobile when sidebar drawer is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (sidebarOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [sidebarOpen]);

  // 3. Silent Background Verification (Zero Reload Loop)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const path = (window.location.pathname || '').replace(/\/+$/, '') || '/admin';
    setCurrentPath(path);
    const token = localStorage.getItem('sami_admin_token');

    // If no token and not on login page, show unauthorized prompt without hard browser looping
    if (!token && path !== '/admin/login') {
      setAuthStatus('unauthorized');
      return;
    }

    if (token) {
      setAuthStatus('authorized');

      // Verify token silently
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('API unreachable');
          return res.json();
        })
        .then(data => {
          if (data && data.success === false) {
            localStorage.removeItem('sami_admin_token');
            localStorage.removeItem('sami_admin_user');
            setAuthStatus('unauthorized');
          } else if (data?.user) {
            setAuthStatus('authorized');
            setAdminUser(data.user);
            localStorage.setItem('sami_admin_user', JSON.stringify(data.user));
          }
        })
        .catch(() => {
          // If network glitch, offline, or static hosting, preserve authorized session
          setAuthStatus('authorized');
        });

      // Silent metrics sync
      fetch('/api/admin/overview', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            if (typeof data.metrics?.pendingEnrollments === 'number') {
              setPendingCount(data.metrics.pendingEnrollments);
            }
            if (typeof data.metrics?.bannedStudents === 'number') {
              setBannedCount(data.metrics.bannedStudents);
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sami_admin_token');
    localStorage.removeItem('sami_admin_user');
    window.location.href = '/admin/login';
  };

  // If unauthorized and session expired, render graceful login prompt instead of infinite reload loops
  if (authStatus === 'unauthorized') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0B0F19',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          backgroundColor: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          padding: '36px 28px',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00A0DF, #006699)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            margin: '0 auto 16px auto',
            boxShadow: '0 0 20px rgba(0, 160, 223, 0.35)'
          }}>
            <Shield size={26} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
            Admin Login Required
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94A3B8', marginBottom: '24px', lineHeight: 1.5 }}>
            Your admin session has ended or credentials were not found. Please log in to continue.
          </p>
          <a
            href="/admin/login"
            className="btn-primary"
            style={{
              display: 'block',
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.94rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxSizing: 'border-box'
            }}
          >
            Sign In to Admin Portal
          </a>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'Enrollment Requests', path: '/admin/enrollment-requests', icon: <UserCheck size={18} />, badge: pendingCount > 0 ? `${pendingCount}` : undefined },
    { label: 'Anti-Piracy & Banned', path: '/admin/banned-students', icon: <Shield size={18} />, badge: bannedCount > 0 ? `${bannedCount}` : undefined, badgeColor: '#EF4444' },
    { label: 'Students Directory', path: '/admin/students', icon: <Users size={18} /> },
    { label: 'Curriculum & Lessons', path: '/admin/curriculum', icon: <Video size={18} /> },
    { label: 'Student Progress', path: '/admin/student-progress', icon: <GraduationCap size={18} /> },
    { label: 'Order Management', path: '/admin/orders', icon: <ClipboardList size={18} /> },
    { label: 'Inventory & Courses', path: '/admin/inventory', icon: <Package size={18} /> },
    { label: 'Analytics', path: '/admin/analytics', icon: <LineChart size={18} /> },
    { label: 'Website CMS & Content', path: '/admin/cms', icon: <Globe size={18} /> },
    { label: 'Tracking Pixels', path: '/admin/pixels', icon: <Code2 size={18} /> },
    { label: 'Store Settings', path: '/admin/settings', icon: <Settings size={18} /> }
  ];

  return (
    <div className="admin-shell">
      {/* 1. Admin Sidebar Drawer */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        
        {/* Sidebar Brand */}
        <div style={{ padding: '20px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00A0DF, #006699)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0
            }}>
              <Shield size={19} />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#FFFFFF', lineHeight: 1.2 }}>Sami Admin</div>
              <div style={{ fontSize: '0.68rem', color: '#00A0DF', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Restricted Portal</div>
            </div>
          </a>

          <button 
            onClick={() => setSidebarOpen(false)} 
            style={{ display: 'none', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '6px' }} 
            className="mobile-hamburger"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '14px 10px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map((item, idx) => {
            const isActive = currentPath === item.path;
            return (
              <a
                key={idx}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '7px',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  backgroundColor: isActive ? 'rgba(0, 160, 223, 0.16)' : 'transparent',
                  border: isActive ? '1px solid rgba(0, 160, 223, 0.35)' : '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'background-color 0.15s ease, color 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                  <span style={{ color: isActive ? '#00A0DF' : (item.badgeColor || '#94A3B8'), display: 'flex' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{ 
                    backgroundColor: item.badgeColor || '#00A0DF', 
                    color: 'white', 
                    fontSize: '0.65rem', 
                    fontWeight: '800', 
                    padding: '2px 7px', 
                    borderRadius: '999px' 
                  }}>
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Live Public Link & Logout */}
        <div style={{ padding: '14px 12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 12px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '6px',
              fontSize: '0.8rem',
              color: '#94A3B8',
              textDecoration: 'none'
            }}
          >
            <span>View Live Website</span>
            <ExternalLink size={13} />
          </a>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '9px 12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '6px',
              color: '#EF4444',
              fontSize: '0.84rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <LogOut size={15} /> Log Out
          </button>
        </div>
      </aside>

      {/* 2. Backdrop for Mobile Drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 95
          }}
        />
      )}

      {/* 3. Main Content Container */}
      <div className="admin-main-wrap">
        {/* Sticky Top Header */}
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none', background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '4px' }}
              className="mobile-hamburger"
              aria-label="Toggle sidebar menu"
            >
              <Menu size={22} />
            </button>
            <div style={{ fontSize: '0.92rem', fontWeight: '600', color: '#94A3B8' }} className="admin-header-title">
              Admin Portal &bull; <span style={{ color: '#FFFFFF' }}>Ecom With Sami</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#00A0DF',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.8rem'
            }}>
              SA
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: '600', color: '#F1F5F9' }} className="admin-user-name">
              {adminUser?.name || 'Sami Admin'}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
