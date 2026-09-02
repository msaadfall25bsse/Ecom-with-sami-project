import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Bell, 
  Smartphone, 
  Globe, 
  Mail, 
  Lock, 
  Video, 
  MessageCircle, 
  Link2, 
  MessageSquare, 
  HelpCircle,
  KeyRound,
  Shield,
  AlertCircle,
  ExternalLink,
  Clock,
  MapPin,
  Phone
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({
    store_name: 'Ecom With Sami',
    contact_email: 'support@ecomwithsami.com',
    contact_phone: '+92 333 0093269',
    display_phone: '+92 333 0093269',
    base_currency: 'PKR',
    timezone: 'Asia/Karachi',
    course_fee_pkr: '3900',
    course_fee_usd: '15',
    seats_left: '12',
    announcement_text: '🔥 Ramadan Special: UAE & KSA Dropshipping Course 88% OFF - Enroll for PKR 3,900 Today!',
    // WhatsApp Support & Mentorship Settings
    admin_whatsapp: '+92 333 0093269',
    whatsapp_number: '923330093269',
    whatsapp_group_link: 'https://chat.whatsapp.com/sami-mentorship-mastermind',
    whatsapp_default_message: 'Hi Sami! I want to enroll in the UAE & KSA Dropshipping Course (PKR 3,900). Can you help me?',
    support_hours: 'Mon–Sat, 9:00 AM – 5:00 PM PKT',
    head_office: 'Mehdi Tower, Shahrah-e-Faisal, Karachi, Pakistan',
    // LMS & Security Settings
    lms_title: 'Ecom With Sami - VIP Student Portal',
    lms_announcement: '🔥 Welcome to Sami Mentorship! Watch lectures in sequence and join our weekly live coaching mastermind.',
    lms_watermark_enabled: '1',
    lms_devtools_block_enabled: '1',
    // SMTP Email Settings
    smtp_host: '',
    smtp_port: '587',
    smtp_user: '',
    smtp_pass: '',
    smtp_from_name: 'Ecom With Sami Admissions',
    smtp_from_email: 'admissions@ecomwithsami.com'
  });

  // Admin Account Credentials State
  const [adminCreds, setAdminCreds] = useState({
    name: 'Sami Admin',
    email: 'admin@samiecom.com',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [credsSaving, setCredsSaving] = useState(false);
  const [credsError, setCredsError] = useState('');
  const [credsSuccess, setCredsSuccess] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchSettings();
    fetchAdminProfile();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch('/api/admin/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings((prev: any) => ({ ...prev, ...data.settings }));
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };



  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch('/api/admin/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.admin) {
        setAdminCreds(prev => ({
          ...prev,
          name: data.admin.name || 'Sami Admin',
          email: data.admin.email || 'admin@samiecom.com'
        }));
      }
    } catch (err) {
      console.error('Error fetching admin profile:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setToast('Platform & WhatsApp settings saved successfully!');
        setTimeout(() => setToast(''), 3000);
      }
    } catch (err) {
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAdminCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredsError('');
    setCredsSuccess('');

    if (!adminCreds.email) {
      setCredsError('Admin login email is required.');
      return;
    }

    if (adminCreds.newPassword) {
      if (!adminCreds.currentPassword) {
        setCredsError('Please enter your Current Password to confirm password change.');
        return;
      }
      if (adminCreds.newPassword.length < 6) {
        setCredsError('New password must be at least 6 characters long.');
        return;
      }
      if (adminCreds.newPassword !== adminCreds.confirmNewPassword) {
        setCredsError('New Password and Confirm Password do not match.');
        return;
      }
    }

    setCredsSaving(true);
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch('/api/admin/credentials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: adminCreds.name,
          email: adminCreds.email,
          currentPassword: adminCreds.currentPassword,
          newPassword: adminCreds.newPassword
        })
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = { message: 'Server response could not be parsed. Please restart the dev server if it was running before update.' };
      }
      if (res.ok && data.success) {
        if (data.token) {
          localStorage.setItem('sami_admin_token', data.token);
        }
        if (data.user) {
          localStorage.setItem('sami_admin_user', JSON.stringify(data.user));
        }
        setCredsSuccess('✅ Admin login credentials updated successfully! Use your new email/password for future logins.');
        setAdminCreds(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }));
        setTimeout(() => setCredsSuccess(''), 6000);
      } else {
        setCredsError(data.message || `Failed to update admin credentials (${res.status} ${res.statusText})`);
      }
    } catch (err: any) {
      setCredsError(err?.message || 'Error updating admin credentials. Please ensure backend server is reachable.');
    } finally {
      setCredsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          backgroundColor: '#10B981',
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
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            Store &amp; Platform Settings
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
            Manage store metadata, admin login credentials, WhatsApp contact numbers, payment receiver accounts, and video DRM policies.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🔐 SECTION A: ADMIN LOGIN CREDENTIALS & SECURITY (EMAIL & PASSWORD) */}
      {/* ========================================================================= */}
      <div style={{
        backgroundColor: '#111827',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        border: '1px solid rgba(0, 160, 223, 0.4)',
        boxShadow: '0 4px 25px rgba(0, 160, 223, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 160, 223, 0.18)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <KeyRound size={18} />
            </div>
            <span>Admin Login Credentials &amp; Security</span>
          </h3>
          <span style={{
            padding: '4px 12px',
            borderRadius: '999px',
            backgroundColor: 'rgba(0, 160, 223, 0.15)',
            border: '1px solid rgba(0, 160, 223, 0.3)',
            color: 'var(--primary)',
            fontSize: '0.76rem',
            fontWeight: 800,
            textTransform: 'uppercase'
          }}>
            Protected Admin Account
          </span>
        </div>

        <p style={{ color: '#94A3B8', fontSize: '0.86rem', lineHeight: 1.5, marginBottom: '22px' }}>
          Change the administrator account login email and password used to sign in to the Admin Panel at <code style={{ color: 'var(--primary)', backgroundColor: 'rgba(0, 160, 223, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>/admin/login</code>.
        </p>

        {/* Credentials Error / Success Banners */}
        {credsError && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#EF4444',
            fontSize: '0.86rem',
            fontWeight: 600,
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{credsError}</span>
          </div>
        )}

        {credsSuccess && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#10B981',
            fontSize: '0.86rem',
            fontWeight: 700,
            marginBottom: '20px'
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{credsSuccess}</span>
          </div>
        )}

        <form onSubmit={handleUpdateAdminCredentials}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '20px' }}>
            
            {/* 1. Admin Display Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                Admin Display Name
              </label>
              <input
                type="text"
                required
                value={adminCreds.name}
                onChange={(e) => setAdminCreds({ ...adminCreds, name: e.target.value })}
                placeholder="Sami Admin"
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            {/* 2. Admin Login Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                Admin Login Email (Sign-in Email)
              </label>
              <input
                type="email"
                required
                value={adminCreds.email}
                onChange={(e) => setAdminCreds({ ...adminCreds, email: e.target.value })}
                placeholder="admin@samiecom.com"
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(0, 160, 223, 0.3)', borderRadius: '6px', color: '#FFFFFF', fontWeight: '700', outline: 'none' }}
              />
            </div>

            {/* 3. Current Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                Current Password <span style={{ color: '#94A3B8', fontWeight: 'normal' }}>(Required to change password)</span>
              </label>
              <input
                type="password"
                value={adminCreds.currentPassword}
                onChange={(e) => setAdminCreds({ ...adminCreds, currentPassword: e.target.value })}
                placeholder="Enter current password"
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            {/* 4. New Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                New Password <span style={{ color: '#94A3B8', fontWeight: 'normal' }}>(Leave blank to keep current)</span>
              </label>
              <input
                type="password"
                value={adminCreds.newPassword}
                onChange={(e) => setAdminCreds({ ...adminCreds, newPassword: e.target.value })}
                placeholder="Min 6 characters"
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            {/* 5. Confirm New Password */}
            {adminCreds.newPassword && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={adminCreds.confirmNewPassword}
                  onChange={(e) => setAdminCreds({ ...adminCreds, confirmNewPassword: e.target.value })}
                  placeholder="Re-type new password"
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                />
              </div>
            )}

          </div>

          <button
            type="submit"
            disabled={credsSaving}
            style={{
              padding: '10px 22px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '800',
              fontSize: '0.88rem',
              cursor: credsSaving ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(0, 160, 223, 0.35)'
            }}
          >
            <KeyRound size={16} />
            <span>{credsSaving ? 'Updating Credentials...' : 'Update Admin Login Credentials'}</span>
          </button>
        </form>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Section 1: General Platform Information */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="var(--primary)" /> General Store Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>Store Name</label>
              <input
                type="text"
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>Contact Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>Base Currency</label>
              <input
                type="text"
                value={settings.base_currency}
                onChange={(e) => setSettings({ ...settings, base_currency: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>Timezone</label>
              <input
                type="text"
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: WhatsApp Support & LMS Mentorship Control */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 4px 25px rgba(16, 185, 129, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageCircle size={20} />
              </div>
              <span>WhatsApp &amp; Community Mentorship Hub (Live Dynamic Control)</span>
            </h3>
            <span style={{
              padding: '4px 12px',
              borderRadius: '999px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#10B981',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase'
            }}>
              Active Across Website &amp; LMS
            </span>
          </div>

          <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '24px' }}>
            Update WhatsApp contact numbers, VIP student community group links, and support hours. Changes saved here take effect <strong>instantly</strong> across the floating WhatsApp widget, student LMS portal, video lockout appeals, and automated emails without editing any code.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px', marginBottom: '22px' }}>
            
            {/* 1. Public Website WhatsApp Number */}
            <div style={{
              backgroundColor: '#1E293B',
              borderRadius: '10px',
              padding: '18px',
              border: '1px solid rgba(0, 160, 223, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
                  <MessageSquare size={16} color="var(--primary)" />
                  <span>Storefront / Website WhatsApp Support Number</span>
                </label>
                <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginBottom: '10px', lineHeight: 1.4 }}>
                  Used for the floating WhatsApp button, footer chat, admissions help, blogs, and support page.
                </div>
                <input
                  type="text"
                  placeholder="e.g. 923330093269 or +92 333 0093269"
                  value={settings.whatsapp_number || ''}
                  onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#0F172A',
                    border: '1px solid rgba(0, 160, 223, 0.35)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '0.92rem',
                    fontWeight: '700',
                    outline: 'none',
                    marginBottom: '12px'
                  }}
                />
              </div>

              {settings.whatsapp_number && (
                <a
                  href={`https://wa.me/${String(settings.whatsapp_number).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings.whatsapp_default_message || 'Hi Sami! Testing WhatsApp from Admin Settings.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(0, 160, 223, 0.15)',
                    border: '1px solid rgba(0, 160, 223, 0.3)',
                    color: 'var(--primary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <span>Test Storefront WhatsApp Link</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>

            {/* 2. LMS Student Support WhatsApp */}
            <div style={{
              backgroundColor: '#1E293B',
              borderRadius: '10px',
              padding: '18px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
                  <Smartphone size={16} color="#10B981" />
                  <span>Student LMS Desk WhatsApp Number</span>
                </label>
                <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginBottom: '10px', lineHeight: 1.4 }}>
                  Students reach this number for classroom help, security strike lockout appeals, and account unlocking.
                </div>
                <input
                  type="text"
                  placeholder="e.g. +92 333 0093269"
                  value={settings.admin_whatsapp || ''}
                  onChange={(e) => setSettings({ ...settings, admin_whatsapp: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#0F172A',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '0.92rem',
                    fontWeight: '700',
                    outline: 'none',
                    marginBottom: '12px'
                  }}
                />
              </div>

              {settings.admin_whatsapp && (
                <a
                  href={`https://wa.me/${String(settings.admin_whatsapp).replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Admin! Testing Student LMS Support desk link from Admin Settings.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#10B981',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <span>Test LMS Support Desk Link</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>

            {/* 3. VIP WhatsApp Mentorship Group Link */}
            <div style={{
              backgroundColor: '#1E293B',
              borderRadius: '10px',
              padding: '18px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
                  <Link2 size={16} color="#F59E0B" />
                  <span>VIP WhatsApp Mentorship Community Link</span>
                </label>
                <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginBottom: '10px', lineHeight: 1.4 }}>
                  Invite link provided in LMS header, Live Coaching Mastermind tab, and 1-Click WhatsApp student approval templates.
                </div>
                <input
                  type="text"
                  placeholder="https://chat.whatsapp.com/..."
                  value={settings.whatsapp_group_link || ''}
                  onChange={(e) => setSettings({ ...settings, whatsapp_group_link: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#0F172A',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '0.92rem',
                    outline: 'none',
                    marginBottom: '12px'
                  }}
                />
              </div>

              {settings.whatsapp_group_link && (
                <a
                  href={settings.whatsapp_group_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    color: '#F59E0B',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <span>Test VIP Group Invite Link</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>

          </div>

          {/* Secondary Contact & Support Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            
            {/* Display Phone */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                <Phone size={14} color="var(--primary)" />
                <span>Formatted Display Phone Number</span>
              </label>
              <input
                type="text"
                placeholder="+92 333 0093269"
                value={settings.display_phone || settings.contact_phone || ''}
                onChange={(e) => setSettings({ ...settings, display_phone: e.target.value, contact_phone: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            {/* Support Working Hours */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                <Clock size={14} color="var(--accent-green)" />
                <span>Support Hours / Timings</span>
              </label>
              <input
                type="text"
                placeholder="Mon–Sat, 9:00 AM – 5:00 PM PKT"
                value={settings.support_hours || ''}
                onChange={(e) => setSettings({ ...settings, support_hours: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            {/* Head Office */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                <MapPin size={14} color="#F59E0B" />
                <span>Head Office Location</span>
              </label>
              <input
                type="text"
                placeholder="Mehdi Tower, Shahrah-e-Faisal, Karachi, Pakistan"
                value={settings.head_office || ''}
                onChange={(e) => setSettings({ ...settings, head_office: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            {/* Regional Office */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                <Globe size={14} color="#38BDF8" />
                <span>Regional Office Location</span>
              </label>
              <input
                type="text"
                placeholder="Business Bay, Dubai (UAE) & Olaya District, Riyadh (KSA)"
                value={settings.regional_office || ''}
                onChange={(e) => setSettings({ ...settings, regional_office: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

          </div>

          {/* Pre-filled WhatsApp Inquiry Message */}
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
              Default Pre-filled WhatsApp Inquiry Message (For Storefront Visitors)
            </label>
            <input
              type="text"
              placeholder="Hi Sami! I want to enroll in the UAE & KSA Dropshipping Course (PKR 3,900). Can you help me?"
              value={settings.whatsapp_default_message || ''}
              onChange={(e) => setSettings({ ...settings, whatsapp_default_message: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
            />
          </div>

        </div>

        {/* Section 3: Web LMS & Security Settings */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video size={18} color="var(--primary)" /> Web LMS Classroom &amp; DRM Security
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                LMS Student Classroom Announcement Ticker
              </label>
              <input
                type="text"
                value={settings.lms_announcement || settings.announcement_text}
                onChange={(e) => setSettings({ ...settings, lms_announcement: e.target.value, announcement_text: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                  Dynamic Floating DRM Watermark
                </label>
                <select
                  value={settings.lms_watermark_enabled ?? '1'}
                  onChange={(e) => setSettings({ ...settings, lms_watermark_enabled: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                >
                  <option value="1">Enabled (Displays Student Name, Email &amp; Live IP on Video)</option>
                  <option value="0">Disabled</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                  Anti-Piracy &amp; DevTools Guard
                </label>
                <select
                  value={settings.lms_devtools_block_enabled ?? '1'}
                  onChange={(e) => setSettings({ ...settings, lms_devtools_block_enabled: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                >
                  <option value="1">Strict Protection (Blocks Right-Click, PrintScreen, DevTools)</option>
                  <option value="0">Standard Mode</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Automated Email (SMTP) Configuration */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={18} color="var(--accent-green)" /> Automated Email Dispatch (SMTP Settings)
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '20px' }}>
            When an enrollment is approved, the system automatically emails the VIP student their LMS Access Code and login instructions.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>SMTP Host</label>
              <input
                type="text"
                placeholder="e.g. smtp.gmail.com or mail.ecomwithsami.com"
                value={settings.smtp_host || ''}
                onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>SMTP Port</label>
              <input
                type="text"
                placeholder="587 or 465"
                value={settings.smtp_port || '587'}
                onChange={(e) => setSettings({ ...settings, smtp_port: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>SMTP Username / Email</label>
              <input
                type="text"
                placeholder="admissions@ecomwithsami.com"
                value={settings.smtp_user || ''}
                onChange={(e) => setSettings({ ...settings, smtp_user: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>SMTP Password / App Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={settings.smtp_pass || ''}
                onChange={(e) => setSettings({ ...settings, smtp_pass: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>Sender Display Name</label>
              <input
                type="text"
                placeholder="Ecom With Sami Admissions"
                value={settings.smtp_from_name || ''}
                onChange={(e) => setSettings({ ...settings, smtp_from_name: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>From Email Address</label>
              <input
                type="email"
                placeholder="admissions@ecomwithsami.com"
                value={settings.smtp_from_email || ''}
                onChange={(e) => setSettings({ ...settings, smtp_from_email: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ padding: '14px 28px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Save size={18} />
            <span>{saving ? 'Saving Changes...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
