import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Unlock, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MessageCircle, 
  Eye, 
  X, 
  GraduationCap, 
  FileText, 
  RefreshCw,
  Lock,
  UserX
} from 'lucide-react';

export default function BannedStudentsPage() {
  const [bannedStudents, setBannedStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Selected Student for Audit Logs Drawer
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    fetchBannedStudents();
  }, []);

  const fetchBannedStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch('/api/admin/students', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        // Filter only banned or suspended students or students with strikes
        const filtered = (data.students || []).filter(
          (s: any) => s.status === 'suspended' || (s.security_strikes || 0) >= 3 || (s.security_strikes || 0) > 0
        );
        setBannedStudents(filtered);
      }
    } catch (err) {
      console.error('Error fetching banned students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockStudent = async (studentId: number, studentName: string) => {
    if (!confirm(`Are you sure you want to UNLOCK ${studentName} (#STU-${studentId})?\n\nThis will reset security strikes to 0, activate their account, and preserve 100% of their lecture progress.`)) {
      return;
    }

    try {
      setActionLoading(studentId);
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch(`/api/admin/students/${studentId}/reset-strikes`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Account Unlocked!\nStudent ${studentName} (#STU-${studentId}) has been unbanned. Their LMS classroom is now active and course progress has been preserved.`);
        fetchBannedStudents();
        if (selectedStudent && selectedStudent.id === studentId) {
          setSelectedStudent(null);
        }
      } else {
        alert(`❌ Failed: ${data.message}`);
      }
    } catch (err) {
      console.error('Error unlocking student:', err);
      alert('Error unlocking student account.');
    } finally {
      setActionLoading(null);
    }
  };

  const openAuditLogs = async (student: any) => {
    setSelectedStudent(student);
    setLogsLoading(true);
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch(`/api/admin/students/${student.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.securityLogs || []);
      }
    } catch (err) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  const filteredList = bannedStudents.filter(st => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      st.name?.toLowerCase().includes(term) ||
      st.email?.toLowerCase().includes(term) ||
      st.phone?.includes(term) ||
      String(st.id).includes(term)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.18)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldAlert size={22} />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
              Anti-Piracy &amp; Banned Students
            </h1>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', margin: 0 }}>
            Manage students flagged by Forensic DRM for screenshot/recording violations. 1-click unban restores LMS classroom while preserving 100% of their course progress.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchBannedStudents}
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Banned List</span>
        </button>
      </div>

      {/* 2. Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        <div style={{
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.1)'
        }}>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Currently Banned / Locked</span>
            <Lock size={18} color="#EF4444" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#EF4444' }}>
            {bannedStudents.filter(s => s.status === 'suspended' || s.security_strikes >= 3).length}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginTop: '4px' }}>
            Awaiting Admin WhatsApp verification
          </div>
        </div>

        <div style={{
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Warned (1 or 2 Strikes)</span>
            <AlertTriangle size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#F59E0B' }}>
            {bannedStudents.filter(s => s.security_strikes > 0 && s.security_strikes < 3 && s.status !== 'suspended').length}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginTop: '4px' }}>
            Under forensic observation
          </div>
        </div>

        <div style={{
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          border: '1px solid rgba(16, 185, 129, 0.25)'
        }}>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Progress Retention</span>
            <CheckCircle2 size={18} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#10B981', marginTop: '4px' }}>
            100% Guaranteed
          </div>
          <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginTop: '6px' }}>
            Students resume exactly at their current lecture
          </div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div style={{
        backgroundColor: '#111827',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ fontSize: '0.92rem', color: '#FFFFFF', fontWeight: '700' }}>
          Flagged Accounts: <span style={{ color: '#EF4444' }}>{filteredList.length}</span>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0, width: '100%', maxWidth: '100%' }}>
          <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by student name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              backgroundColor: '#1E293B',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#FFFFFF',
              fontSize: '0.86rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* 4. Banned Students Table */}
      <div className="admin-table-responsive">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8', fontSize: '0.74rem', textTransform: 'uppercase', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '12px 16px' }}>Student</th>
              <th style={{ padding: '12px 16px' }}>Contact Info</th>
              <th style={{ padding: '12px 16px' }}>Security Strikes</th>
              <th style={{ padding: '12px 16px' }}>Violation Reason</th>
              <th style={{ padding: '12px 16px' }}>Saved Progress</th>
              <th style={{ padding: '12px 16px' }}>Incident Date</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Admin Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '120px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '130px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '90px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '140px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '80px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '90px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}><div className="admin-skeleton" style={{ width: '60px', height: '24px', marginLeft: 'auto' }} /></td>
                </tr>
              ))
            ) : filteredList.length > 0 ? (
                filteredList.map(st => {
                  const isSuspended = st.status === 'suspended' || (st.security_strikes || 0) >= 3;
                  const cleanPhone = (st.phone || '').replace(/[^0-9]/g, '');
                  const whatsappMsg = encodeURIComponent(
                    `Hello ${st.name},\n\nYour Sami Academy LMS student account (#STU-${st.id}) has been reviewed and UNLOCKED by Admin.\n\nYou can now log in to the LMS and continue your course lectures right where you left off.`
                  );
                  const studentWhatsAppUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${whatsappMsg}` : null;

                  return (
                    <tr key={st.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#FFFFFF', backgroundColor: isSuspended ? 'rgba(239, 68, 68, 0.04)' : undefined }}>
                      {/* Student Name */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: isSuspended ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                            color: isSuspended ? '#EF4444' : '#F59E0B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '0.85rem'
                          }}>
                            {st.name ? st.name[0] : 'S'}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: '#FFFFFF' }}>{st.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>ID: #STU-{st.id} &bull; {st.city || 'Pakistan'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontSize: '0.84rem' }}>{st.email}</div>
                        <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>{st.phone}</div>
                      </td>

                      {/* Security Strikes */}
                      <td style={{ padding: '14px 18px' }}>
                        {isSuspended ? (
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '0.74rem',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            backgroundColor: 'rgba(239, 68, 68, 0.2)',
                            color: '#EF4444',
                            border: '1px solid rgba(239, 68, 68, 0.5)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Lock size={12} />
                            <span>BANNED ({st.security_strikes || 3}/3 Strikes)</span>
                          </span>
                        ) : (
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '0.74rem',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            backgroundColor: 'rgba(245, 158, 11, 0.15)',
                            color: '#F59E0B',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <AlertTriangle size={12} />
                            <span>WARNED ({st.security_strikes}/3 Strikes)</span>
                          </span>
                        )}
                      </td>

                      {/* Violation Reason */}
                      <td style={{ padding: '14px 18px', maxWidth: '240px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#FCA5A5', lineHeight: 1.4 }}>
                          {st.suspended_reason || 'Unauthorized screenshot or screen recording attempt detected'}
                        </div>
                      </td>

                      {/* Saved Course Progress */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', marginBottom: '3px' }}>
                          <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{st.progressPercentage || 0}% Completed</span>
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>({st.completed_lessons || 0}/36)</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                          ✓ Progress 100% Preserved
                        </span>
                      </td>

                      {/* Incident Date */}
                      <td style={{ padding: '14px 18px', color: '#94A3B8', fontSize: '0.78rem' }}>
                        {st.last_strike_at ? new Date(st.last_strike_at).toLocaleString() : 'Recent'}
                      </td>

                      {/* Action Buttons */}
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          
                          {/* 1. PRIMARY UNLOCK BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleUnlockStudent(st.id, st.name)}
                            disabled={actionLoading === st.id}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#10B981',
                              backgroundImage: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                              border: 'none',
                              borderRadius: '6px',
                              color: '#FFFFFF',
                              fontSize: '0.84rem',
                              fontWeight: '800',
                              cursor: actionLoading === st.id ? 'not-allowed' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <Unlock size={15} />
                            <span>{actionLoading === st.id ? 'Unlocking...' : 'Unlock Account'}</span>
                          </button>

                          {/* 2. WhatsApp Student */}
                          {studentWhatsAppUrl && (
                            <a
                              href={studentWhatsAppUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Send WhatsApp confirmation to student"
                              style={{
                                padding: '8px 12px',
                                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                borderRadius: '6px',
                                color: '#10B981',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                textDecoration: 'none'
                              }}
                            >
                              <MessageCircle size={15} />
                              <span>WhatsApp</span>
                            </a>
                          )}

                          {/* 3. View Audit Logs */}
                          <button
                            type="button"
                            onClick={() => openAuditLogs(st)}
                            title="View forensic security audit log"
                            style={{
                              padding: '8px 12px',
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '6px',
                              color: '#E2E8F0',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>
                    <ShieldCheck size={48} color="#10B981" style={{ margin: '0 auto 12px auto', opacity: 0.8 }} />
                    <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.1rem', marginBottom: '4px' }}>
                      No Banned or Flagged Accounts
                    </div>
                    <p style={{ fontSize: '0.86rem', color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>
                      All registered student accounts have clean security records with zero strikes.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      {/* 5. Forensic Audit Log Drawer Modal */}
      {selectedStudent && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }} onClick={() => setSelectedStudent(null)}>
          <div
            style={{
              backgroundColor: '#111827',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '28px',
              color: '#FFFFFF',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
              <div>
                <span className="badge-pill badge-red" style={{ fontSize: '0.74rem', marginBottom: '6px' }}>
                  STUDENT ID: #STU-{selectedStudent.id}
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>
                  Forensic Security Audit Logs: {selectedStudent.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Unlock Banner */}
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ fontWeight: 800, color: '#10B981', fontSize: '0.94rem' }}>
                  Restore Student Access
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  Course progress ({selectedStudent.progressPercentage || 0}%) will remain intact.
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleUnlockStudent(selectedStudent.id, selectedStudent.name)}
                style={{
                  padding: '8px 18px',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                🔓 Unlock Now
              </button>
            </div>

            {/* Logs List */}
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '12px', color: '#E2E8F0' }}>
              Recorded Violation Incidents
            </h4>

            {logsLoading ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8' }}>
                Loading audit trail...
              </div>
            ) : auditLogs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {auditLogs.map((log: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      fontSize: '0.82rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, color: '#EF4444' }}>
                        🚨 Strike {log.strike_count}: {log.event_type}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ color: '#CBD5E1', marginBottom: '4px' }}>
                      {log.details}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      IP: {log.ip_address} &bull; Device: {log.user_agent}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                No detailed log entries recorded for this student.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
