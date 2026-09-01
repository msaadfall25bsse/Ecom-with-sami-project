import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
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
  Phone,
  Plus,
  Trash2,
  Edit3,
  Building,
  Check,
  Copy,
  X,
  Coins,
  RotateCcw
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
    regional_office: 'Business Bay, Dubai (UAE) & Olaya District, Riyadh (KSA)',
    // Payment Credentials
    meezan_bank_title: 'ECOM WITH SAMI (PVT) LTD',
    meezan_bank_account: '53020115677150',
    meezan_bank_iban: 'PK27MEZN0053020115677150',
    easypaisa_title: 'Sami Ur Rehman',
    easypaisa_number: '03315137294',
    binance_pay_id: '243182889',
    binance_name: 'Sami2026',
    crypto_bep20_wallet: '',
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

  // Dynamic Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [pmLoading, setPmLoading] = useState(false);
  const [pmModalOpen, setPmModalOpen] = useState(false);
  const [pmEditing, setPmEditing] = useState<any | null>(null);
  const [pmActionLoading, setPmActionLoading] = useState(false);
  const [copiedPmField, setCopiedPmField] = useState<string | null>(null);
  const [pmForm, setPmForm] = useState({
    title: '',
    category: 'bank',
    badge: '',
    account_title: '',
    account_number: '',
    iban_or_wallet: '',
    checkout_url: '',
    instructions: '',
    price_display: 'PKR 3,900',
    is_active: 1,
    display_order: 0
  });

  useEffect(() => {
    fetchSettings();
    fetchAdminProfile();
    fetchPaymentMethods();
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

  const fetchPaymentMethods = async () => {
    setPmLoading(true);
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch('/api/admin/payment-methods', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPaymentMethods(data.methods || []);
      }
    } catch (err) {
      console.error('Error loading payment methods:', err);
    } finally {
      setPmLoading(false);
    }
  };

  const handleTogglePM = async (id: number) => {
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch(`/api/admin/payment-methods/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPaymentMethods(prev => prev.map(m => m.id === id ? { ...m, is_active: data.is_active } : m));
        setToast(data.message || 'Payment method status updated');
        setTimeout(() => setToast(''), 3500);
      } else {
        alert(data.message || 'Failed to toggle status');
      }
    } catch (err: any) {
      alert('Error updating payment method status: ' + err.message);
    }
  };

  const handleDeletePM = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"? Students will no longer see this payment method.`)) {
      return;
    }
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch(`/api/admin/payment-methods/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPaymentMethods(prev => prev.filter(m => m.id !== id));
        setToast(data.message || 'Payment method deleted');
        setTimeout(() => setToast(''), 3500);
      } else {
        alert(data.message || 'Failed to delete payment method');
      }
    } catch (err: any) {
      alert('Error deleting payment method: ' + err.message);
    }
  };

  const handleSavePM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pmForm.title.trim()) {
      alert('Please enter a Payment Method Title');
      return;
    }
    setPmActionLoading(true);
    try {
      const token = localStorage.getItem('sami_admin_token');
      const url = pmEditing ? `/api/admin/payment-methods/${pmEditing.id}` : '/api/admin/payment-methods';
      const method = pmEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pmForm)
      });
      const data = await res.json();
      if (data.success) {
        setToast(pmEditing ? '✅ Payment method updated successfully!' : '✅ New payment method created!');
        setTimeout(() => setToast(''), 3500);
        setPmModalOpen(false);
        setPmEditing(null);
        fetchPaymentMethods();
      } else {
        alert(data.message || 'Failed to save payment method');
      }
    } catch (err: any) {
      alert('Error saving payment method: ' + err.message);
    } finally {
      setPmActionLoading(false);
    }
  };

  const handleResetPMDefaults = async () => {
    if (!confirm('Are you sure you want to reset payment methods to standard defaults (Easypaisa, Meezan Bank, JazzCash, Binance Pay, International Card)?')) {
      return;
    }
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch('/api/admin/payment-methods/reset-defaults', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPaymentMethods(data.methods || []);
        setToast('✅ Standard default payment methods restored!');
        setTimeout(() => setToast(''), 3500);
      }
    } catch (err: any) {
      alert('Error resetting payment methods: ' + err.message);
    }
  };

  const handleOpenCreatePM = (category = 'bank') => {
    let presetBadge = 'DIRECT BANK / MOBILE APP';
    let presetPrice = 'PKR 3,900';
    let presetTitle = '';
    let presetInstructions = 'Deposit course fee and upload the payment proof / screenshot below.';

    if (category === 'wallet') {
      presetBadge = 'INSTANT MOBILE TRANSFER';
      presetTitle = 'JazzCash Mobile Account';
    } else if (category === 'crypto') {
      presetBadge = 'CRYPTO / ZERO FEE';
      presetPrice = '$15 USDT';
      presetTitle = 'Binance Pay / USDT Crypto';
      presetInstructions = 'Send USDT or transfer via Binance Pay ID and attach screenshot.';
    } else if (category === 'card') {
      presetBadge = 'OVERSEAS & INTERNATIONAL';
      presetPrice = '$15 USD';
      presetTitle = 'Visa / Mastercard Card Checkout';
      presetInstructions = 'Pay securely with international debit/credit card and upload receipt.';
    } else {
      presetTitle = 'Bank Alfalah / Habib Bank';
    }

    setPmEditing(null);
    setPmForm({
      title: presetTitle,
      category,
      badge: presetBadge,
      account_title: 'Sami Ur Rehman',
      account_number: '',
      iban_or_wallet: '',
      checkout_url: '',
      instructions: presetInstructions,
      price_display: presetPrice,
      is_active: 1,
      display_order: paymentMethods.length + 1
    });
    setPmModalOpen(true);
  };

  const handleOpenEditPM = (method: any) => {
    setPmEditing(method);
    setPmForm({
      title: method.title || '',
      category: method.category || 'bank',
      badge: method.badge || '',
      account_title: method.account_title || '',
      account_number: method.account_number || '',
      iban_or_wallet: method.iban_or_wallet || '',
      checkout_url: method.checkout_url || '',
      instructions: method.instructions || '',
      price_display: method.price_display || 'PKR 3,900',
      is_active: method.is_active ?? 1,
      display_order: method.display_order ?? 0
    });
    setPmModalOpen(true);
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPmField(fieldId);
    setTimeout(() => setCopiedPmField(null), 2000);
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

        {/* Section 3: Dynamic Payment Methods & Receiving Accounts Manager */}
        <div style={{
          backgroundColor: '#111827',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          border: '1px solid rgba(0, 160, 223, 0.4)',
          boxShadow: '0 4px 25px rgba(0, 160, 223, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 160, 223, 0.2)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CreditCard size={20} />
              </div>
              <span>Payment Methods &amp; Receiving Accounts (Full Dynamic Control)</span>
            </h3>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleResetPMDefaults}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  color: '#94A3B8',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={14} />
                <span>Restore Defaults</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenCreatePM('bank')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: 'var(--primary)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0, 160, 223, 0.3)'
                }}
              >
                <Plus size={16} />
                <span>Add Payment Method</span>
              </button>
            </div>
          </div>

          <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '20px' }}>
            Add, edit, disable, or delete any payment receiving account. If you want to remove Binance, International Card, or any bank account, simply <strong>click Disable or Delete</strong> below and it will immediately disappear from the student enrollment page.
          </p>

          {/* Preset Quick Add Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', marginRight: '4px' }}>Quick Add:</span>
            <button
              type="button"
              onClick={() => handleOpenCreatePM('bank')}
              style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(0, 160, 223, 0.12)', border: '1px solid rgba(0, 160, 223, 0.25)', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              + Bank Account
            </button>
            <button
              type="button"
              onClick={() => handleOpenCreatePM('wallet')}
              style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#10B981', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              + Mobile Wallet (Easypaisa / JazzCash / SadaPay)
            </button>
            <button
              type="button"
              onClick={() => handleOpenCreatePM('crypto')}
              style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)', color: '#F59E0B', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              + Crypto (Binance Pay / USDT)
            </button>
            <button
              type="button"
              onClick={() => handleOpenCreatePM('card')}
              style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.25)', color: '#A855F7', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              + Card Checkout (Visa/Mastercard)
            </button>
          </div>

          {/* Payment Methods Cards Grid */}
          {pmLoading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#94A3B8' }}>Loading Payment Methods...</div>
          ) : paymentMethods.length === 0 ? (
            <div style={{
              padding: '36px',
              textAlign: 'center',
              backgroundColor: '#1E293B',
              borderRadius: '8px',
              border: '1px dashed rgba(255, 255, 255, 0.15)'
            }}>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '14px' }}>No payment methods found. Students won't be able to pay on checkout.</p>
              <button
                type="button"
                onClick={handleResetPMDefaults}
                style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: 'var(--primary)', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Restore Standard Payment Methods
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
              {paymentMethods.map((method) => {
                const isActive = method.is_active === 1;
                const isBank = method.category === 'bank';
                const isWallet = method.category === 'wallet';
                const isCrypto = method.category === 'crypto';
                const isCard = method.category === 'card';

                const themeColor = isBank ? 'var(--primary)' : isWallet ? '#10B981' : isCrypto ? '#F59E0B' : '#A855F7';

                return (
                  <div
                    key={method.id}
                    style={{
                      backgroundColor: '#1E293B',
                      borderRadius: '10px',
                      padding: '20px',
                      border: isActive ? `1.5px solid ${themeColor}` : '1px solid rgba(255, 255, 255, 0.08)',
                      opacity: isActive ? 1 : 0.65,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      boxShadow: isActive ? '0 4px 15px rgba(0, 0, 0, 0.2)' : 'none'
                    }}
                  >
                    <div>
                      {/* Card Header */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            color: themeColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {isBank && <Building size={20} />}
                            {isWallet && <Smartphone size={20} />}
                            {isCrypto && <Coins size={20} />}
                            {isCard && <CreditCard size={20} />}
                            {!isBank && !isWallet && !isCrypto && !isCard && <Globe size={20} />}
                          </div>
                          <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                              {method.title}
                            </h4>
                            <span style={{ fontSize: '0.72rem', color: themeColor, fontWeight: 700, textTransform: 'uppercase' }}>
                              {method.badge || method.category}
                            </span>
                          </div>
                        </div>

                        {/* Active Status Badge */}
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '999px',
                          backgroundColor: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                          color: isActive ? '#10B981' : '#EF4444',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          whiteSpace: 'nowrap'
                        }}>
                          {isActive ? '● Active' : '○ Disabled'}
                        </span>
                      </div>

                      {/* Card Details Table */}
                      <div style={{
                        backgroundColor: '#0F172A',
                        borderRadius: '6px',
                        padding: '12px',
                        fontSize: '0.82rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        marginBottom: '14px',
                        border: '1px solid rgba(255, 255, 255, 0.06)'
                      }}>
                        {method.account_title && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                            <span style={{ color: '#94A3B8' }}>Account Title:</span>
                            <strong style={{ color: '#FFFFFF', textAlign: 'right' }}>{method.account_title}</strong>
                          </div>
                        )}

                        {method.account_number && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <span style={{ color: '#94A3B8' }}>{isCrypto ? 'Pay ID / Number:' : 'Account Number:'}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ color: '#FFFFFF', fontWeight: 800, fontFamily: 'monospace' }}>{method.account_number}</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(method.account_number, `acc_${method.id}`)}
                                style={{ background: 'none', border: 'none', color: copiedPmField === `acc_${method.id}` ? '#10B981' : '#94A3B8', cursor: 'pointer', padding: '2px' }}
                                title="Copy Account Number"
                              >
                                {copiedPmField === `acc_${method.id}` ? <Check size={14} /> : <Copy size={14} />}
                              </button>
                            </div>
                          </div>
                        )}

                        {method.iban_or_wallet && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <span style={{ color: '#94A3B8' }}>{isCrypto ? 'Wallet Address:' : 'IBAN:'}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ color: themeColor, fontWeight: 700, fontFamily: 'monospace', fontSize: '0.78rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {method.iban_or_wallet}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(method.iban_or_wallet, `iban_${method.id}`)}
                                style={{ background: 'none', border: 'none', color: copiedPmField === `iban_${method.id}` ? '#10B981' : '#94A3B8', cursor: 'pointer', padding: '2px' }}
                                title="Copy IBAN / Wallet"
                              >
                                {copiedPmField === `iban_${method.id}` ? <Check size={14} /> : <Copy size={14} />}
                              </button>
                            </div>
                          </div>
                        )}

                        {method.checkout_url && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <span style={{ color: '#94A3B8' }}>Checkout Link:</span>
                            <a
                              href={method.checkout_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <span>Test Link</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        )}

                        {method.instructions && (
                          <div style={{ fontSize: '0.76rem', color: '#94A3B8', fontStyle: 'italic', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '6px' }}>
                            {method.instructions}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Action Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                      
                      {/* Toggle Active / Inactive */}
                      <button
                        type="button"
                        onClick={() => handleTogglePM(method.id)}
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          borderRadius: '6px',
                          backgroundColor: isActive ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                          border: isActive ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                          color: isActive ? '#F87171' : '#10B981',
                          fontWeight: 700,
                          fontSize: '0.76rem',
                          cursor: 'pointer'
                        }}
                      >
                        {isActive ? 'Hide from Website' : 'Show on Website'}
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditPM(method)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#FFFFFF',
                          fontWeight: 600,
                          fontSize: '0.76rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeletePM(method.id, method.title)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          color: '#EF4444',
                          fontWeight: 600,
                          fontSize: '0.76rem',
                          cursor: 'pointer'
                        }}
                        title="Delete this payment method"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Modal: Add / Edit Payment Method */}
        {pmModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 99999
          }}>
            <div style={{
              backgroundColor: '#111827',
              border: '1px solid rgba(0, 160, 223, 0.4)',
              borderRadius: '16px',
              padding: '28px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={20} color="var(--primary)" />
                  <span>{pmEditing ? 'Edit Payment Method' : 'Add New Payment Method'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => { setPmModalOpen(false); setPmEditing(null); }}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSavePM} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Category & Display Order */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>Category</label>
                    <select
                      value={pmForm.category}
                      onChange={(e) => setPmForm({ ...pmForm, category: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                    >
                      <option value="bank">🏦 Bank Account (Meezan, HBL, etc.)</option>
                      <option value="wallet">📱 Mobile Wallet (Easypaisa, JazzCash)</option>
                      <option value="crypto">₿ Crypto / Binance Pay</option>
                      <option value="card">💳 Card Checkout (Visa/Mastercard)</option>
                      <option value="custom">🌐 Custom Method</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>Display Order</label>
                    <input
                      type="number"
                      value={pmForm.display_order}
                      onChange={(e) => setPmForm({ ...pmForm, display_order: Number(e.target.value) })}
                      style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Method Title */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>
                    Payment Method Title <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Meezan Bank Transfer, JazzCash Account, Binance Pay"
                    value={pmForm.title}
                    onChange={(e) => setPmForm({ ...pmForm, title: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(0, 160, 223, 0.4)', borderRadius: '6px', color: '#FFFFFF', fontWeight: '700', outline: 'none' }}
                  />
                </div>

                {/* Badge Tag & Price Display */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>Badge / Tag (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. RECOMMENDED, DIRECT IBFT, ZERO FEE"
                      value={pmForm.badge}
                      onChange={(e) => setPmForm({ ...pmForm, badge: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>Amount / Currency Display</label>
                    <input
                      type="text"
                      placeholder="e.g. PKR 3,900 or $15 USD"
                      value={pmForm.price_display}
                      onChange={(e) => setPmForm({ ...pmForm, price_display: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Account Title & Account Number */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>Account Title / Beneficiary Name</label>
                    <input
                      type="text"
                      placeholder="e.g. ECOM WITH SAMI (PVT) LTD or Sami Ur Rehman"
                      value={pmForm.account_title}
                      onChange={(e) => setPmForm({ ...pmForm, account_title: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>Account / Phone / Pay ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 53020115677150 or 03315137294"
                      value={pmForm.account_number}
                      onChange={(e) => setPmForm({ ...pmForm, account_number: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontFamily: 'monospace', fontWeight: '700', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* IBAN / Crypto Wallet Address */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>IBAN Number / Crypto Wallet Address</label>
                  <input
                    type="text"
                    placeholder="e.g. PK27MEZN0053020115677150 or 0xae8da7..."
                    value={pmForm.iban_or_wallet}
                    onChange={(e) => setPmForm({ ...pmForm, iban_or_wallet: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontFamily: 'monospace', outline: 'none' }}
                  />
                </div>

                {/* Checkout Link URL (for Cards) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>Card / External Checkout URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. https://whop.com/checkout/... or Stripe URL"
                    value={pmForm.checkout_url}
                    onChange={(e) => setPmForm({ ...pmForm, checkout_url: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                  />
                </div>

                {/* Instructions */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>Student Instructions &amp; Proof Note</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Send course fee and upload payment proof/screenshot below."
                    value={pmForm.instructions}
                    onChange={(e) => setPmForm({ ...pmForm, instructions: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.84rem', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                {/* Active Status Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                  <input
                    type="checkbox"
                    id="pm_is_active"
                    checked={pmForm.is_active === 1}
                    onChange={(e) => setPmForm({ ...pmForm, is_active: e.target.checked ? 1 : 0 })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <label htmlFor="pm_is_active" style={{ fontSize: '0.86rem', fontWeight: '700', color: '#FFFFFF', cursor: 'pointer' }}>
                    Active (Show on Student Enrollment &amp; Checkout Page)
                  </label>
                </div>

                {/* Modal Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => { setPmModalOpen(false); setPmEditing(null); }}
                    style={{ padding: '10px 18px', borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid #374151', color: '#94A3B8', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pmActionLoading}
                    style={{ padding: '10px 24px', borderRadius: '6px', backgroundColor: 'var(--primary)', border: 'none', color: '#FFFFFF', fontWeight: 800, cursor: 'pointer' }}
                  >
                    {pmActionLoading ? 'Saving...' : pmEditing ? 'Save Changes' : 'Create Payment Method'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* Section 4: Web LMS & Security Settings */}
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

        {/* Section 5: Automated Email (SMTP) Configuration */}
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
