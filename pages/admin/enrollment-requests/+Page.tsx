import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Search, 
  Filter, 
  Check, 
  X, 
  Clock, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle,
  FileImage,
  ExternalLink,
  MessageCircle,
  Copy,
  Send,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

export default function EnrollmentRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selected Request for Review Modal
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Access Code Modal after Approval
  const [approvalModal, setApprovalModal] = useState<{
    open: boolean;
    studentName: string;
    email: string;
    phone: string;
    accessCode: string;
    emailSent: boolean;
    emailMessage: string;
  } | null>(null);

  const [copySuccess, setCopySuccess] = useState(false);
  const [whatsappGroupLink, setWhatsappGroupLink] = useState('https://chat.whatsapp.com/sami-mentorship-mastermind');

  useEffect(() => {
    fetchRequests();
    fetch('/api/public/contact-config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.whatsappGroupUrl) {
          setWhatsappGroupLink(data.whatsappGroupUrl);
        }
      })
      .catch(() => {});
  }, [statusFilter, searchTerm]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('sami_admin_token');
      let url = `/api/admin/enrollment-requests?status=${statusFilter}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Error fetching enrollment requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch(`/api/admin/enrollment-requests/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, adminNote })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessToast(`Application ${newStatus.toUpperCase()} successfully!`);
        setTimeout(() => setSuccessToast(''), 3000);
        
        if (newStatus === 'approved' && selectedReq) {
          setApprovalModal({
            open: true,
            studentName: `${selectedReq.first_name} ${selectedReq.last_name}`,
            email: selectedReq.email,
            phone: selectedReq.phone,
            accessCode: data.accessCode || 'SAMI' + Math.floor(100000 + Math.random() * 900000),
            emailSent: data.emailSent,
            emailMessage: data.emailMessage || ''
          });
        }

        setSelectedReq(null);
        setAdminNote('');
        fetchRequests();
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (err) {
      alert('Error updating status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResendAccess = async (reqItem: any) => {
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch(`/api/admin/enrollment-requests/${reqItem.id}/resend-access`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setApprovalModal({
          open: true,
          studentName: `${reqItem.first_name} ${reqItem.last_name}`,
          email: reqItem.email,
          phone: reqItem.phone,
          accessCode: data.accessCode,
          emailSent: data.emailSent,
          emailMessage: data.message
        });
      } else {
        alert(data.message || 'Failed to resend access');
      }
    } catch {
      alert('Error resending access code');
    }
  };

  const copyWhatsAppMessage = () => {
    if (!approvalModal) return;
    const groupLink = whatsappGroupLink || 'https://chat.whatsapp.com/sami-mentorship-mastermind';
    const msg = `🎓 *Assalam o Alaikum ${approvalModal.studentName}!*

Your enrollment in *Master UAE & KSA Dropshipping Mentorship* has been approved!

🌐 *Web LMS Classroom:* ${window.location.origin}/login
📧 *Login Email:* ${approvalModal.email}
🔑 *LMS Access Code:* *${approvalModal.accessCode}*

📲 *VIP WhatsApp Mentorship Group:*
${groupLink}

_Please log in on your browser to watch your 11 modules and 36 HD lectures._`;

    navigator.clipboard.writeText(msg);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Toast Notification */}
      {successToast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          backgroundColor: 'var(--accent-green)',
          color: '#FFFFFF',
          padding: '14px 22px',
          borderRadius: 'var(--radius-md)',
          fontWeight: '700',
          fontSize: '0.92rem',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={18} /> {successToast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            Enrollment Requests Queue
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
            Review submitted student applications, verify payment receipts, and provision LMS course access.
          </p>
        </div>
      </div>

      {/* Controls & Filters */}
      <div style={{
        backgroundColor: '#111827',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { label: 'All Requests', val: 'all' },
            { label: 'Pending Review', val: 'pending' },
            { label: 'Approved', val: 'approved' },
            { label: 'On Hold', val: 'on_hold' },
            { label: 'Rejected', val: 'rejected' }
          ].map(tab => (
            <button
              key={tab.val}
              onClick={() => setStatusFilter(tab.val)}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: statusFilter === tab.val ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: statusFilter === tab.val ? 'rgba(0, 160, 223, 0.15)' : 'transparent',
                color: statusFilter === tab.val ? '#FFFFFF' : '#94A3B8',
                fontWeight: statusFilter === tab.val ? '700' : '500',
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
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

      {/* Requests Table */}
      <div className="admin-table-responsive">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8', fontSize: '0.74rem', textTransform: 'uppercase', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '12px 16px' }}>Enrollment ID</th>
              <th style={{ padding: '12px 16px' }}>Student</th>
              <th style={{ padding: '12px 16px' }}>Contact</th>
              <th style={{ padding: '12px 16px' }}>Payment Method</th>
              <th style={{ padding: '12px 16px' }}>Amount</th>
              <th style={{ padding: '12px 16px' }}>Receipt</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '100px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '130px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '140px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '90px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '80px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '60px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '70px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}><div className="admin-skeleton" style={{ width: '60px', height: '24px', marginLeft: 'auto' }} /></td>
                </tr>
              ))
            ) : requests.length > 0 ? (
              requests.map(req => (
                  <tr key={req.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#FFFFFF' }}>
                    <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: '700' }}>
                      {req.enrollment_id}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: '700' }}>{req.first_name} {req.last_name}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{req.city} &bull; Lead: {req.hear_source || 'Direct'}</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div>{req.email}</div>
                      <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>{req.phone}</div>
                    </td>
                    <td style={{ padding: '14px 18px', textTransform: 'capitalize', color: '#94A3B8' }}>
                      {req.payment_method}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: '700', color: 'var(--accent-green)' }}>
                      PKR {req.amount}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      {req.screenshot_path ? (
                        <a
                          href={req.screenshot_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600' }}
                        >
                          <FileImage size={15} /> View Slip
                        </a>
                      ) : (
                        <span style={{ color: '#64748B', fontSize: '0.76rem' }}>No file</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.74rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        backgroundColor: req.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : req.status === 'pending' ? 'rgba(245, 158, 11, 0.15)' : req.status === 'on_hold' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: req.status === 'approved' ? 'var(--accent-green)' : req.status === 'pending' ? 'var(--accent-amber)' : req.status === 'on_hold' ? '#EAB308' : 'var(--accent-red)'
                      }}>
                        {req.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        {req.status === 'approved' && (
                          <button
                            type="button"
                            onClick={() => handleResendAccess(req)}
                            title="View / Copy Student Access Code"
                            style={{
                              padding: '7px 12px',
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              borderRadius: '6px',
                              color: 'var(--accent-green)',
                              fontSize: '0.82rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <KeyRound size={14} />
                            <span>Access Code</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => { setSelectedReq(req); setAdminNote(req.admin_note || ''); }}
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
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#64748B' }}>
                    No enrollment requests found matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      {/* Review Modal Drawer */}
      {selectedReq && (
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
        }} onClick={() => setSelectedReq(null)}>
          <div
            style={{
              backgroundColor: '#111827',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              width: '100%',
              maxWidth: '680px',
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
                <span className="badge-pill badge-cyan" style={{ fontSize: '0.75rem', marginBottom: '6px' }}>
                  {selectedReq.enrollment_id}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
                  Review Enrollment Application
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Applicant Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#1E293B', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Student Name</div>
                <div style={{ fontSize: '1.05rem', fontWeight: '700' }}>{selectedReq.first_name} {selectedReq.last_name}</div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>City: {selectedReq.city}</div>
              </div>

              <div style={{ backgroundColor: '#1E293B', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Payment &amp; Amount</div>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--accent-green)' }}>PKR {selectedReq.amount}</div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'capitalize' }}>Method: {selectedReq.payment_method}</div>
              </div>

              <div style={{ backgroundColor: '#1E293B', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Email Address</div>
                <div style={{ fontSize: '0.92rem', fontWeight: '600' }}>{selectedReq.email}</div>
              </div>

              <div style={{ backgroundColor: '#1E293B', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>WhatsApp Phone</div>
                <div style={{ fontSize: '0.92rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{selectedReq.phone}</span>
                  <a
                    href={`https://wa.me/${selectedReq.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#25D366', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Payment Receipt Image */}
            {selectedReq.screenshot_path && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '8px' }}>
                  Payment Screenshot Receipt:
                </div>
                <div style={{
                  backgroundColor: '#0B0F19',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '12px',
                  textAlign: 'center'
                }}>
                  <img
                    src={selectedReq.screenshot_path}
                    alt="Receipt"
                    style={{ maxHeight: '260px', maxWidth: '100%', borderRadius: '6px', objectFit: 'contain' }}
                  />
                  <div style={{ marginTop: '8px' }}>
                    <a
                      href={selectedReq.screenshot_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <ExternalLink size={13} /> Open Full Size Screenshot
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Reason Note */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                Admin Note / Decision Reason (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Verified transaction on Easypaisa portal. Account provisioned."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#1E293B',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleStatusUpdate(selectedReq.id, 'approved')}
                style={{
                  padding: '12px',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Check size={18} /> Approve &amp; Activate LMS
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleStatusUpdate(selectedReq.id, 'on_hold')}
                style={{
                  padding: '12px',
                  backgroundColor: '#F59E0B',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Clock size={18} /> Place On Hold
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleStatusUpdate(selectedReq.id, 'rejected')}
                style={{
                  padding: '12px',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <X size={18} /> Reject
              </button>
            </div>

          </div>
        </div>
      )}

      {/* APPROVAL & ACCESS CODE MODAL */}
      {approvalModal && approvalModal.open && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          padding: '20px'
        }} onClick={() => setApprovalModal(null)}>
          <div
            style={{
              backgroundColor: '#111827',
              borderRadius: '16px',
              border: '2px solid var(--accent-green)',
              width: '100%',
              maxWidth: '520px',
              padding: '32px 28px',
              color: '#FFFFFF',
              textAlign: 'center',
              boxShadow: '0 25px 60px rgba(16, 185, 129, 0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <CheckCircle2 size={36} />
            </div>

            <span className="badge-pill badge-green" style={{ marginBottom: '10px' }}>STUDENT LMS ACTIVATED</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>
              {approvalModal.studentName}
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginBottom: '20px' }}>
              LMS student account is ready. Send the Access Code via Email or WhatsApp.
            </p>

            {/* Access Code Display Card */}
            <div style={{ backgroundColor: '#0B0F19', border: '1px dashed rgba(0, 160, 223, 0.4)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>
                Student Access Code
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '0.1em', fontFamily: 'monospace' }}>
                {approvalModal.accessCode}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '6px' }}>
                Email: <strong style={{ color: '#FFFFFF' }}>{approvalModal.email}</strong>
              </div>
            </div>

            {/* Email dispatch feedback */}
            <div style={{ fontSize: '0.82rem', color: approvalModal.emailSent ? 'var(--accent-green)' : 'var(--accent-amber)', backgroundColor: '#1E293B', padding: '8px 14px', borderRadius: '6px', marginBottom: '20px' }}>
              {approvalModal.emailSent ? '✅ Automated Welcome Email dispatched to student inbox' : `ℹ️ ${approvalModal.emailMessage || 'SMTP unconfigured (Copy access message below for WhatsApp)'}`}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={copyWhatsAppMessage}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {copySuccess ? (
                  <>
                    <Check size={18} />
                    <span>Copied WhatsApp Message!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span>1-Click Copy Access Message for WhatsApp</span>
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/${approvalModal.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`🎓 Assalam o Alaikum ${approvalModal.studentName}!\n\nYour enrollment in Master UAE & KSA Dropshipping Mentorship has been approved!\n\n🌐 Web LMS Classroom: ${typeof window !== 'undefined' ? window.location.origin : ''}/login\n📧 Login Email: ${approvalModal.email}\n🔑 LMS Access Code: *${approvalModal.accessCode}*\n\n📲 VIP WhatsApp Mentorship Group:\n${whatsappGroupLink || 'https://chat.whatsapp.com/sami-mentorship-mastermind'}\n\nPlease log in on your browser to watch your 11 modules and 36 HD lectures.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.92rem'
                }}
              >
                <MessageCircle size={18} />
                <span>Open Direct WhatsApp Chat</span>
              </a>

              <button
                type="button"
                onClick={() => setApprovalModal(null)}
                style={{
                  background: 'none',
                  border: '1px solid #374151',
                  color: '#94A3B8',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  marginTop: '4px'
                }}
              >
                Done / Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
