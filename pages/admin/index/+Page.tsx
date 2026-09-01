import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Clock, 
  ArrowUpRight, 
  ArrowRight, 
  Download, 
  Calendar, 
  ChevronRight, 
  Package, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle,
  ShieldAlert,
  Unlock,
  Lock
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unloadingId, setUnloadingId] = useState<number | null>(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch('/api/admin/overview', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Error loading dashboard overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockStudent = async (studentId: number, studentName: string) => {
    if (!confirm(`Are you sure you want to UNLOCK ${studentName} (#STU-${studentId})?\n\nThis will reset their security strikes to 0 and restore their classroom access while preserving 100% of course progress.`)) return;
    try {
      setUnloadingId(studentId);
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch(`/api/admin/students/${studentId}/reset-strikes`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        alert(`✅ Account Unlocked!\nStudent ${studentName} has been unbanned and classroom restored.`);
        fetchOverview();
      }
    } catch (e) {
      console.error('Error unlocking student:', e);
    } finally {
      setUnloadingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#94A3B8' }}>
        Loading dashboard statistics...
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalRevenuePKR: 4520000,
    todaySalesPKR: 243800,
    totalStudents: 5,
    pendingEnrollments: 2,
    bannedStudents: 0,
    totalOrders: 5,
    shippedOrders: 3,
    conversionRate: 4.8
  };

  const bannedList = data?.bannedStudents || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* 1. Top Greeting & Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            Dashboard Overview
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
            Welcome back! Here is what is happening with your store, students, and security today.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {metrics.bannedStudents > 0 && (
            <a
              href="/admin/banned-students"
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                color: '#EF4444',
                fontSize: '0.88rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none'
              }}
            >
              <ShieldAlert size={17} />
              <span>{metrics.bannedStudents} Banned Account{metrics.bannedStudents > 1 ? 's' : ''}</span>
            </a>
          )}

          <a
            href="/admin/enrollment-requests"
            className="btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <UserCheck size={17} />
            <span>Review Enrollments ({metrics.pendingEnrollments})</span>
          </a>
        </div>
      </div>

      {/* 1.1 HIGH-ALERT BANNED STUDENTS BANNER (If Any) */}
      {bannedList.length > 0 && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1.5px solid rgba(239, 68, 68, 0.4)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={22} color="#EF4444" />
              <div>
                <strong style={{ color: '#FFFFFF', fontSize: '1rem' }}>
                  {bannedList.length} Student Account(s) Currently Suspended by Forensic Anti-Piracy DRM
                </strong>
                <div style={{ fontSize: '0.82rem', color: '#FCA5A5' }}>
                  Students have exceeded 3 screenshot or screen recording strikes. You can unlock them below with 1-click.
                </div>
              </div>
            </div>
            <a
              href="/admin/banned-students"
              style={{
                fontSize: '0.84rem',
                color: '#FFFFFF',
                fontWeight: 700,
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '6px 14px',
                borderRadius: '6px',
                textDecoration: 'none'
              }}
            >
              View Dedicated Banned Hub &rarr;
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {bannedList.map((st: any) => (
              <div
                key={st.id}
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.92rem' }}>
                    {st.name} <span style={{ color: 'var(--primary)', fontSize: '0.78rem' }}>#STU-{st.id}</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>{st.email} &bull; {st.phone}</div>
                  <div style={{ fontSize: '0.74rem', color: '#EF4444', marginTop: '2px', fontWeight: 600 }}>
                    🔒 {st.security_strikes || 3}/3 Strikes &bull; {st.completed_lessons || 0} Lessons Saved
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleUnlockStudent(st.id, st.name)}
                  disabled={unloadingId === st.id}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: unloadingId === st.id ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.35)',
                    flexShrink: 0
                  }}
                >
                  <Unlock size={14} />
                  <span>{unloadingId === st.id ? 'Unlocking...' : 'Unlock'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. 4 KPI Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        {/* Card 1: Today's Sales */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.84rem', fontWeight: '600', marginBottom: '10px' }}>
            <span>Today&rsquo;s Sales</span>
            <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', fontSize: '0.78rem' }}>
              <TrendingUp size={14} /> +18.4%
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            PKR {metrics.todaySalesPKR?.toLocaleString() || '243,800'}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Real-time revenue today</div>
        </div>

        {/* Card 2: Total Orders */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.84rem', fontWeight: '600', marginBottom: '10px' }}>
            <span>Total Orders</span>
            <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', fontSize: '0.78rem' }}>
              <TrendingUp size={14} /> +5.2%
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            {metrics.totalOrders || 250}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Paid &amp; Pending transactions</div>
        </div>

        {/* Card 3: Gross Revenue */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.84rem', fontWeight: '600', marginBottom: '10px' }}>
            <span>Gross Revenue</span>
            <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', fontSize: '0.78rem' }}>
              <TrendingUp size={14} /> +24.8%
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
            PKR {metrics.totalRevenuePKR?.toLocaleString() || '4,520,000'}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Cumulative platform earnings</div>
        </div>

        {/* Card 4: Enrolled Students */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.84rem', fontWeight: '600', marginBottom: '10px' }}>
            <span>Active Learners</span>
            <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', fontSize: '0.78rem' }}>
              <Users size={14} /> Active
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            {metrics.totalStudents || 1248}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748B' }}>Registered in LMS</div>
        </div>

      </div>

      {/* 3. Sales Overview Visual & Traffic Sources */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Sales Trajectory Visual */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          gridColumn: 'span 2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '2px' }}>
                Sales Trajectory (7-Day Overview)
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Weekly revenue growth velocity</p>
            </div>
            <span className="badge-pill badge-cyan" style={{ fontSize: '0.75rem' }}>Live Database Sync</span>
          </div>

          {/* Graphical Bars Visualizer */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', gap: '12px', paddingTop: '20px' }}>
            {[
              { day: 'Mon', rev: 'PKR 45K', pct: 25 },
              { day: 'Tue', rev: 'PKR 72K', pct: 40 },
              { day: 'Wed', rev: 'PKR 58K', pct: 32 },
              { day: 'Thu', rev: 'PKR 95K', pct: 52 },
              { day: 'Fri', rev: 'PKR 135K', pct: 70 },
              { day: 'Sat', rev: 'PKR 180K', pct: 85 },
              { day: 'Sun', rev: 'PKR 243.8K', pct: 100 }
            ].map((bar, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '600' }}>{bar.rev}</div>
                <div style={{
                  width: '100%',
                  height: `${bar.pct}%`,
                  background: idx === 6 ? 'linear-gradient(180deg, var(--primary), #006699)' : 'rgba(0, 160, 223, 0.3)',
                  borderRadius: '6px 6px 0 0',
                  boxShadow: idx === 6 ? '0 0 15px rgba(0, 160, 223, 0.5)' : 'none',
                  transition: 'height 0.4s ease'
                }} />
                <div style={{ fontSize: '0.78rem', color: idx === 6 ? 'var(--primary)' : '#64748B', fontWeight: '700' }}>
                  {bar.day}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources & Conversion Funnel */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '18px' }}>
            Traffic Sources &amp; Leads
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'TikTok Ads', share: '55%', color: '#00A0DF' },
              { name: 'Instagram & Facebook', share: '30%', color: '#10B981' },
              { name: 'YouTube Direct / Search', share: '15%', color: '#F59E0B' }
            ].map((t, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '6px' }}>
                  <span style={{ color: '#E2E8F0', fontWeight: '600' }}>{t.name}</span>
                  <strong style={{ color: t.color }}>{t.share}</strong>
                </div>
                <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: t.share, backgroundColor: t.color }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '28px',
            padding: '16px',
            backgroundColor: 'rgba(0, 160, 223, 0.06)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 160, 223, 0.15)',
            fontSize: '0.84rem'
          }}>
            <div style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '4px' }}>Conversion Velocity: 4.8%</div>
            <div style={{ color: '#94A3B8' }}>Average approval turnaround: 22 minutes.</div>
          </div>
        </div>

      </div>

      {/* 4. Recent Pending Enrollments & Orders Table */}
      <div style={{
        backgroundColor: '#111827',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '2px' }}>
              Recent Enrollment Queue
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Latest applicant submissions awaiting verification</p>
          </div>

          <a
            href="/admin/enrollment-requests"
            style={{ fontSize: '0.86rem', color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>View All</span>
            <ChevronRight size={16} />
          </a>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Enrollment ID</th>
                <th style={{ padding: '12px 16px' }}>Student Name</th>
                <th style={{ padding: '12px 16px' }}>Email &amp; Phone</th>
                <th style={{ padding: '12px 16px' }}>Method</th>
                <th style={{ padding: '12px 16px' }}>Amount</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentEnrollments?.length > 0 ? (
                data.recentEnrollments.map((enr: any) => (
                  <tr key={enr.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#FFFFFF' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: '700' }}>
                      {enr.enrollment_id}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '600' }}>
                      {enr.first_name} {enr.last_name}
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{enr.city}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div>{enr.email}</div>
                      <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>{enr.phone}</div>
                    </td>
                    <td style={{ padding: '14px 16px', textTransform: 'capitalize', color: '#94A3B8' }}>
                      {enr.payment_method}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--accent-green)' }}>
                      PKR {enr.amount}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.74rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        backgroundColor: enr.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : enr.status === 'pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: enr.status === 'approved' ? 'var(--accent-green)' : enr.status === 'pending' ? 'var(--accent-amber)' : 'var(--accent-red)'
                      }}>
                        {enr.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <a
                        href="/admin/enrollment-requests"
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'rgba(0, 160, 223, 0.15)',
                          color: 'var(--primary)',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '700'
                        }}
                      >
                        Review
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
                    No recent enrollment requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
