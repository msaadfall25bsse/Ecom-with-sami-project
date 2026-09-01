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
  Bell, 
  Shield, 
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Code2,
  Globe,
  Video
} from 'lucide-react';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  const [pendingCount, setPendingCount] = useState<number>(0);
  const [bannedCount, setBannedCount] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
      const token = localStorage.getItem('sami_admin_token');
      const user = localStorage.getItem('sami_admin_user');
      
      // Zero-Trust Guard: If no token, redirect to login
      if (!token && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
        return;
      }

      if (user) {
        try {
          setAdminUser(JSON.parse(user));
        } catch (e) {}
      }

      // Verify token with backend server
      if (token) {
        fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (!data.success || data.user?.role !== 'admin') {
              // Token invalid or revoked
              localStorage.removeItem('sami_admin_token');
              localStorage.removeItem('sami_admin_user');
              window.location.href = '/admin/login';
            } else {
              setAdminUser(data.user);
            }
          })
          .catch(() => {});

        // Fetch live pending and banned count
        fetch('/api/admin/overview', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              if (data.metrics?.pendingEnrollments !== undefined) {
                setPendingCount(data.metrics.pendingEnrollments);
              }
              if (data.metrics?.bannedStudents !== undefined) {
                setBannedCount(data.metrics.bannedStudents);
              }
            }
          })
          .catch(() => {});
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sami_admin_token');
    localStorage.removeItem('sami_admin_user');
    window.location.href = '/admin/login';
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={19} /> },
    { label: 'Enrollment Requests', path: '/admin/enrollment-requests', icon: <UserCheck size={19} />, badge: pendingCount > 0 ? `${pendingCount} New` : undefined },
    { label: 'Anti-Piracy & Banned', path: '/admin/banned-students', icon: <Shield size={19} color={bannedCount > 0 ? '#EF4444' : undefined} />, badge: bannedCount > 0 ? `${bannedCount} Banned` : undefined, badgeColor: '#EF4444' },
    { label: 'Students Directory', path: '/admin/students', icon: <Users size={19} /> },
    { label: 'Curriculum & Lessons', path: '/admin/curriculum', icon: <Video size={19} /> },
    { label: 'Student Progress', path: '/admin/student-progress', icon: <GraduationCap size={19} /> },
    { label: 'Order Management', path: '/admin/orders', icon: <ClipboardList size={19} /> },
    { label: 'Inventory & Courses', path: '/admin/inventory', icon: <Package size={19} /> },
    { label: 'Analytics', path: '/admin/analytics', icon: <LineChart size={19} /> },
    { label: 'Website CMS & Content', path: '/admin/cms', icon: <Globe size={19} /> },
    { label: 'Tracking Pixels', path: '/admin/pixels', icon: <Code2 size={19} /> },
    { label: 'Store Settings', path: '/admin/settings', icon: <Settings size={19} /> }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0B0F19', color: '#F8FAFC' }}>
      
      {/* Admin Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: '#111827',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100,
        transition: 'transform 0.3s ease'
      }} className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        
        {/* Sidebar Brand */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00A0DF, #006699)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Shield size={18} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#FFFFFF' }}>Sami Admin</div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Restricted Panel</div>
            </div>
          </a>

          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }} className="mobile-close">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '16px 12px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item, idx) => {
            const isActive = currentPath === item.path;
            return (
              <a
                key={idx}
                href={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  backgroundColor: isActive ? 'rgba(0, 160, 223, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(0, 160, 223, 0.3)' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: isActive ? 'var(--primary)' : '#94A3B8' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{ backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.65rem', fontWeight: '800', padding: '2px 7px', borderRadius: '999px' }}>
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Live Public Link & Logout */}
        <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
              borderRadius: '6px',
              fontSize: '0.82rem',
              color: '#94A3B8'
            }}
          >
            <span>View Live Website</span>
            <ExternalLink size={14} />
          </a>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '10px 12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '6px',
              color: '#EF4444',
              fontSize: '0.86rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile Sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 95
          }}
          className="admin-backdrop"
        />
      )}

      {/* Main Content Wrap */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0 }} className="admin-main-wrap">
        
        {/* Top Header */}
        <header style={{
          height: '64px',
          backgroundColor: '#111827',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none', background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '6px' }}
              className="mobile-hamburger"
              aria-label="Open sidebar menu"
            >
              <Menu size={22} />
            </button>
            <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#94A3B8' }} className="admin-header-title">
              Admin Portal &bull; <span style={{ color: '#FFFFFF' }}>Ecom With Sami</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.85rem'
              }}>
                SA
              </div>
              <div style={{ fontSize: '0.86rem', fontWeight: '600' }} className="admin-user-name">
                {adminUser?.name || 'Authorized Admin'}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main style={{ padding: '32px 28px', flex: 1, minWidth: 0, overflowX: 'hidden' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-main-wrap {
            margin-left: 0 !important;
          }
          .mobile-hamburger {
            display: block !important;
          }
          .admin-main-wrap main {
            padding: 20px 16px !important;
          }
        }

        @media (max-width: 480px) {
          .admin-header-title {
            font-size: 0.84rem !important;
          }
          .admin-user-name {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
