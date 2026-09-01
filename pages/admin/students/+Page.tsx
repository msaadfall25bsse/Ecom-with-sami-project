import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  Eye, 
  X, 
  PlayCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export default function StudentsDirectoryPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Student for Detail Drawer
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [studentDetails, setStudentDetails] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [searchTerm]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('sami_admin_token');
      let url = '/api/admin/students';
      if (searchTerm) url += `?search=${encodeURIComponent(searchTerm)}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const openStudentDetail = async (student: any) => {
    setSelectedStudent(student);
    setDetailLoading(true);
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch(`/api/admin/students/${student.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStudentDetails(data);
      }
    } catch (err) {
      console.error('Error loading student details:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleResetStrikes = async (studentId: number) => {
    if (!confirm('Are you sure you want to unlock this student account and reset all security strikes to 0?')) return;
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch(`/api/admin/students/${studentId}/reset-strikes`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Student account unlocked and security strikes reset to 0 successfully!');
        fetchStudents();
        if (selectedStudent && selectedStudent.id === studentId) {
          openStudentDetail({ ...selectedStudent, status: 'active', security_strikes: 0 });
        }
      }
    } catch (err) {
      console.error('Error unlocking student account:', err);
    }
  };

  const [statusFilter, setStatusFilter] = useState<'all' | 'banned' | 'active'>('all');

  const bannedCount = students.filter(s => s.status === 'suspended' || (s.security_strikes || 0) > 0).length;
  const activeCount = students.filter(s => s.status === 'active' && (!s.security_strikes || s.security_strikes === 0)).length;

  const displayStudents = students.filter(s => {
    if (statusFilter === 'banned') return s.status === 'suspended' || (s.security_strikes || 0) > 0;
    if (statusFilter === 'active') return s.status === 'active' && (!s.security_strikes || s.security_strikes === 0);
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            Enrolled Students Directory
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
            View all registered academy students, monitor live learning progress %, and manage security strike status.
          </p>
        </div>

        {bannedCount > 0 && (
          <a
            href="/admin/banned-students"
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              color: '#EF4444',
              fontSize: '0.86rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none'
            }}
          >
            <ShieldAlert size={16} />
            <span>{bannedCount} Banned / Flagged Students &rarr;</span>
          </a>
        )}
      </div>

      {/* Filter Bar with Status Tabs */}
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
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: statusFilter === 'all' ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
              backgroundColor: statusFilter === 'all' ? 'rgba(0, 160, 223, 0.2)' : 'transparent',
              color: statusFilter === 'all' ? '#FFFFFF' : '#94A3B8',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            All Students ({students.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('banned')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: statusFilter === 'banned' ? '1px solid #EF4444' : '1px solid rgba(239, 68, 68, 0.25)',
              backgroundColor: statusFilter === 'banned' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.08)',
              color: statusFilter === 'banned' ? '#FFFFFF' : '#FCA5A5',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🔒 Banned / Flagged ({bannedCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: statusFilter === 'active' ? '1px solid #10B981' : '1px solid rgba(16, 185, 129, 0.25)',
              backgroundColor: statusFilter === 'active' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.08)',
              color: statusFilter === 'active' ? '#FFFFFF' : '#6EE7B7',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ✅ Active ({activeCount})
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
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
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Students Table */}
      <div style={{
        backgroundColor: '#111827',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '14px 18px' }}>Student</th>
                <th style={{ padding: '14px 18px' }}>Contact Info</th>
                <th style={{ padding: '14px 18px' }}>Enrolled Course</th>
                <th style={{ padding: '14px 18px' }}>Learning Progress</th>
                <th style={{ padding: '14px 18px' }}>Security &amp; Status</th>
                <th style={{ padding: '14px 18px' }}>Last Active</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#94A3B8' }}>
                    Loading student records...
                  </td>
                </tr>
              ) : displayStudents.length > 0 ? (
                displayStudents.map(st => (
                  <tr key={st.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#FFFFFF' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0, 160, 223, 0.15)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          fontSize: '0.85rem'
                        }}>
                          {st.name ? st.name[0] : 'S'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700' }}>{st.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{st.city || 'Pakistan'} &bull; #{st.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div>{st.email}</div>
                      <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>{st.phone}</div>
                    </td>
                    <td style={{ padding: '14px 18px', color: '#E2E8F0', fontSize: '0.85rem' }}>
                      UAE &amp; KSA Dropshipping
                    </td>
                    <td style={{ padding: '14px 18px', minWidth: '170px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{st.progressPercentage}%</span>
                        <span style={{ color: '#94A3B8' }}>{st.completed_lessons || 0} / 36</span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${st.progressPercentage}%`,
                          backgroundColor: st.progressPercentage === 100 ? 'var(--accent-green)' : 'var(--primary)'
                        }} />
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      {st.status === 'suspended' || (st.security_strikes || 0) >= 2 ? (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.74rem',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                          color: '#EF4444',
                          border: '1px solid rgba(239, 68, 68, 0.4)'
                        }}>
                          🔒 SUSPENDED ({st.security_strikes || 2} Strikes)
                        </span>
                      ) : (st.security_strikes || 0) === 1 ? (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.74rem',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          backgroundColor: 'rgba(245, 158, 11, 0.15)',
                          color: '#F59E0B',
                          border: '1px solid rgba(245, 158, 11, 0.3)'
                        }}>
                          ⚠️ 1 Strike (Warned)
                        </span>
                      ) : (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.74rem',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          color: 'var(--accent-green)'
                        }}>
                          Active
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#94A3B8', fontSize: '0.8rem' }}>
                      {st.last_active_at ? new Date(st.last_active_at).toLocaleDateString() : 'Recent'}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        {(st.status === 'suspended' || (st.security_strikes || 0) > 0) && (
                          <button
                            type="button"
                            onClick={() => handleResetStrikes(st.id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              borderRadius: '6px',
                              color: '#10B981',
                              fontSize: '0.8rem',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                            title="Reset strikes & unlock student account"
                          >
                            🔓 Unlock
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openStudentDetail(st)}
                          style={{
                            padding: '7px 14px',
                            backgroundColor: 'rgba(0, 160, 223, 0.15)',
                            border: '1px solid rgba(0, 160, 223, 0.3)',
                            borderRadius: '6px',
                            color: '#FFFFFF',
                            fontSize: '0.82rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          Profile &amp; Progress
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#64748B' }}>
                    No student records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Progress Detail Drawer */}
      {selectedStudent && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
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
              maxWidth: '740px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              color: '#FFFFFF',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
              <div>
                <span className="badge-pill badge-green" style={{ fontSize: '0.75rem', marginBottom: '6px' }}>
                  STUDENT ID: STU-{selectedStudent.id}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
                  {selectedStudent.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Profile Overview Card */}
            <div style={{
              backgroundColor: '#1E293B',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '28px'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Email:</div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>{selectedStudent.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Phone / WhatsApp:</div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>{selectedStudent.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>City / Location:</div>
                <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>{selectedStudent.city || 'Pakistan'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Overall Course Progress:</div>
                <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary)' }}>
                  {studentDetails?.student?.progressPercentage || selectedStudent.progressPercentage}%
                </div>
              </div>
            </div>

            {/* Anti-Piracy DRM Security Status Card */}
            <div style={{
              backgroundColor: selectedStudent.status === 'suspended' || (selectedStudent.security_strikes || 0) >= 2
                ? 'rgba(239, 68, 68, 0.12)'
                : (selectedStudent.security_strikes || 0) === 1
                ? 'rgba(245, 158, 11, 0.1)'
                : '#1E293B',
              border: selectedStudent.status === 'suspended' || (selectedStudent.security_strikes || 0) >= 2
                ? '1px solid rgba(239, 68, 68, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '28px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <ShieldAlert size={18} color={selectedStudent.status === 'suspended' || (selectedStudent.security_strikes || 0) >= 2 ? '#EF4444' : '#10B981'} />
                  <span style={{ fontWeight: '800', fontSize: '0.92rem', color: '#FFFFFF' }}>
                    Forensic Anti-Piracy Security Status:
                  </span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    backgroundColor: selectedStudent.status === 'suspended' || (selectedStudent.security_strikes || 0) >= 2
                      ? '#DC2626'
                      : (selectedStudent.security_strikes || 0) === 1
                      ? '#D97706'
                      : '#059669',
                    color: '#FFFFFF'
                  }}>
                    {selectedStudent.status === 'suspended' || (selectedStudent.security_strikes || 0) >= 2
                      ? `🔒 Suspended (${selectedStudent.security_strikes || 2}/2 Strikes)`
                      : (selectedStudent.security_strikes || 0) === 1
                      ? '⚠️ 1/2 Strikes (Warned)'
                      : '✅ Clean Record (0 Strikes)'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                  {selectedStudent.status === 'suspended' || (selectedStudent.security_strikes || 0) >= 2
                    ? `Reason: ${selectedStudent.suspended_reason || 'Multiple unauthorized screenshot / recording attempts detected'}`
                    : 'Real-time DRM watermark active and session logged on every playback.'}
                </div>
              </div>

              {(selectedStudent.status === 'suspended' || (selectedStudent.security_strikes || 0) > 0) && (
                <button
                  type="button"
                  onClick={() => handleResetStrikes(selectedStudent.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '700',
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                  }}
                >
                  <span>🔓 Unlock Account &amp; Reset Strikes</span>
                </button>
              )}
            </div>

            {/* Curriculum Modules Progress Breakdown */}
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '16px', color: '#FFFFFF' }}>
                11-Module Learning Breakdown (LMS Synchronized)
              </h4>

              {detailLoading ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8' }}>
                  Loading completed lessons...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {studentDetails?.curriculum?.map((mod: any, mIdx: number) => {
                    const totalL = mod.lessons?.length || 0;
                    const compL = mod.lessons?.filter((l: any) => l.isCompleted)?.length || 0;
                    const modPct = totalL > 0 ? Math.round((compL / totalL) * 100) : 0;

                    return (
                      <div
                        key={mIdx}
                        style={{
                          backgroundColor: '#1E293B',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          padding: '16px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div style={{ fontWeight: '700', fontSize: '0.94rem' }}>
                            <span style={{ color: 'var(--primary)', marginRight: '6px' }}>Module {mod.module_number}:</span>
                            {mod.title}
                          </div>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            backgroundColor: modPct === 100 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 160, 223, 0.15)',
                            color: modPct === 100 ? 'var(--accent-green)' : 'var(--primary)'
                          }}>
                            {compL} / {totalL} Completed ({modPct}%)
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {mod.lessons?.map((les: any, lIdx: number) => (
                            <div
                              key={lIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.82rem',
                                padding: '6px 10px',
                                backgroundColor: les.isCompleted ? 'rgba(16, 185, 129, 0.06)' : 'rgba(0,0,0,0.2)',
                                borderRadius: '4px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle2 size={15} color={les.isCompleted ? 'var(--accent-green)' : '#64748B'} />
                                <span style={{ color: les.isCompleted ? '#FFFFFF' : '#94A3B8' }}>{les.title}</span>
                              </div>
                              <span style={{ color: '#64748B', fontSize: '0.75rem' }}>{les.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
