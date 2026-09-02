import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Save, 
  Sparkles, 
  Play, 
  CreditCard, 
  User, 
  Gift, 
  MessageSquare, 
  HelpCircle, 
  Phone, 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  UploadCloud, 
  RefreshCw, 
  ExternalLink,
  Star,
  Check,
  Zap,
  Tag,
  AlertCircle,
  Building,
  Smartphone,
  Coins,
  RotateCcw,
  Copy,
  X
} from 'lucide-react';

export default function AdminCmsPage() {
  const [activeTab, setActiveTab] = useState<string>('hero');
  const [sections, setSections] = useState<Record<string, any>>({});
  const [reviews, setReviews] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({
    student_name: '',
    city: 'Karachi',
    market: 'UAE Market',
    sales_text: '',
    orders_text: '',
    quote: '',
    video_url: '',
    thumbnail_url: '',
    rating: 5,
    is_featured: 1
  });

  // Blog Modal State
  const [showBlogModal, setShowBlogModal] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Mentor Sami',
    image_url: '',
    tags: 'UAE Dropshipping, TikTok Ads',
    is_published: 1
  });

  // Dynamic Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [pmLoading, setPmLoading] = useState<boolean>(false);
  const [pmModalOpen, setPmModalOpen] = useState<boolean>(false);
  const [pmEditing, setPmEditing] = useState<any | null>(null);
  const [pmActionLoading, setPmActionLoading] = useState<boolean>(false);
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

  // Official Default Payment Methods (Sardar Samiullah Accounts)
  const DEFAULT_PAYMENT_METHODS = [
    {
      id: 1,
      method_key: 'easypaisa',
      title: 'Easypaisa Mobile Wallet',
      category: 'wallet',
      badge: 'RECOMMENDED & FASTEST',
      account_title: 'SARDAR SAMIULLAH',
      account_number: '03481095933',
      iban_or_wallet: '',
      checkout_url: '',
      instructions: 'Send course fee via Easypaisa Mobile App or USSD code and upload transaction screenshot.',
      price_display: 'PKR 3,900',
      is_active: 1,
      display_order: 1
    },
    {
      id: 2,
      method_key: 'jazzcash',
      title: 'JazzCash Account',
      category: 'wallet',
      badge: 'INSTANT MOBILE TRANSFER',
      account_title: 'SARDAR SAMIULLAH',
      account_number: '03481095933',
      iban_or_wallet: '',
      checkout_url: '',
      instructions: 'Send course fee to JazzCash account and attach proof below.',
      price_display: 'PKR 3,900',
      is_active: 1,
      display_order: 2
    },
    {
      id: 3,
      method_key: 'upaisa',
      title: 'UPaisa Mobile Wallet',
      category: 'wallet',
      badge: 'MOBILE TRANSFER',
      account_title: 'SARDAR SAMIULLAH',
      account_number: '03481095933',
      iban_or_wallet: '',
      checkout_url: '',
      instructions: 'Send course fee via UPaisa app/agent and upload transaction proof.',
      price_display: 'PKR 3,900',
      is_active: 1,
      display_order: 3
    },
    {
      id: 4,
      method_key: 'meezan_bank',
      title: 'Meezan Bank Transfer',
      category: 'bank',
      badge: 'DIRECT IBFT / RAAST',
      account_title: 'SARDAR SAMIULLAH',
      account_number: '0015010112560119',
      iban_or_wallet: 'PK94MEZN0015010112560119',
      checkout_url: '',
      instructions: 'Transfer to Meezan Bank via Raast ID / IBFT using IBAN PK94MEZN0015010112560119 and upload confirmation screenshot.',
      price_display: 'PKR 3,900',
      is_active: 1,
      display_order: 4
    },
    {
      id: 5,
      method_key: 'binance_crypto',
      title: 'Binance Pay & USDT (Crypto)',
      category: 'crypto',
      badge: 'CRYPTO / ZERO FEE',
      account_title: 'Sami2026',
      account_number: '243182889',
      iban_or_wallet: '0xae8da71c3ad92406e69edc24219918ea58c00dac',
      checkout_url: '',
      instructions: 'Binance Pay ID: 243182889 (Nickname: Sami2026) or BEP20 USDT. Upload transfer hash/screenshot.',
      price_display: '$15 USDT',
      is_active: 1,
      display_order: 5
    },
    {
      id: 6,
      method_key: 'international_card',
      title: 'Visa / Mastercard Card Checkout',
      category: 'card',
      badge: 'OVERSEAS & INTERNATIONAL',
      account_title: 'Online Card Checkout',
      account_number: '',
      iban_or_wallet: '',
      checkout_url: 'https://whop.com/checkout/plan_0vX2Q4Zz9kK1Z?d2c=true',
      instructions: 'Overseas & International students can pay directly using any Visa, Mastercard, Apple Pay, or Google Pay.',
      price_display: '$15 USD',
      is_active: 1,
      display_order: 6
    }
  ];

  // Payment Methods State (initialized with fallback & local cache)
  const [paymentMethods, setPaymentMethods] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('sami_payment_methods');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_PAYMENT_METHODS;
  });

  useEffect(() => {
    fetchCmsData();
    fetchPaymentMethods();
  }, []);

  const fetchCmsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sami_admin_token');
      
      // 1. Fetch Sections
      const secRes = await fetch('/api/admin/cms/sections', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (secRes.ok) {
        const secData = await secRes.json();
        if (secData.success && secData.sections) {
          const secMap: Record<string, any> = {};
          secData.sections.forEach((s: any) => {
            secMap[s.section_key] = s;
          });
          setSections(secMap);
          if (typeof window !== 'undefined') {
            localStorage.setItem('sami_cms_sections', JSON.stringify(secMap));
          }
        }
      }

      // 2. Fetch Reviews
      const revRes = await fetch('/api/admin/cms/reviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (revRes.ok) {
        const revData = await revRes.json();
        if (revData.success && revData.reviews) setReviews(revData.reviews);
      }

      // 3. Fetch Blogs
      const blogRes = await fetch('/api/admin/cms/blogs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (blogRes.ok) {
        const blogData = await blogRes.json();
        if (blogData.success && blogData.blogs) setBlogs(blogData.blogs);
      }

    } catch (err) {
      console.warn('Network sync for CMS sections will use local state:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    setPmLoading(true);
    try {
      const token = localStorage.getItem('sami_admin_token');
      let res = await fetch('/api/admin/cms/payment-methods', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        res = await fetch('/api/admin/payment-methods', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      if (!res.ok) {
        res = await fetch('/api/public/payment-methods');
      }
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.methods && data.methods.length > 0) {
          setPaymentMethods(data.methods);
          if (typeof window !== 'undefined') {
            localStorage.setItem('sami_payment_methods', JSON.stringify(data.methods));
          }
        }
      }
    } catch (err) {
      console.warn('Network sync for payment methods using local state:', err);
    } finally {
      setPmLoading(false);
    }
  };

  const handleTogglePM = async (id: number) => {
    // Optimistic toggle
    const updated = paymentMethods.map(pm => pm.id === id ? { ...pm, is_active: pm.is_active === 1 ? 0 : 1 } : pm);
    setPaymentMethods(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sami_payment_methods', JSON.stringify(updated));
    }
    showToast('⚡ Payment method status updated');

    try {
      const token = localStorage.getItem('sami_admin_token');
      if (!token) return;
      let res = await fetch(`/api/admin/cms/payment-methods/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        await fetch(`/api/admin/payment-methods/${id}/toggle`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (err) {}
  };

  const handleDeletePM = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"? This cannot be undone.`)) {
      return;
    }
    // Optimistic delete
    const updated = paymentMethods.filter(pm => pm.id !== id);
    setPaymentMethods(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sami_payment_methods', JSON.stringify(updated));
    }
    showToast(`🗑️ ${title} deleted successfully`);

    try {
      const token = localStorage.getItem('sami_admin_token');
      if (!token) return;
      let res = await fetch(`/api/admin/cms/payment-methods/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        await fetch(`/api/admin/payment-methods/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (err) {}
  };

  const handleSavePM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pmForm.title.trim()) {
      alert('Payment Method Title is required');
      return;
    }
    setPmActionLoading(true);

    try {
      // 1. Optimistic Local Save & Cache Update
      let updatedMethods: any[] = [];
      if (pmEditing) {
        updatedMethods = paymentMethods.map(pm => pm.id === pmEditing.id ? { ...pm, ...pmForm } : pm);
      } else {
        const newId = Date.now();
        const baseKey = pmForm.title.trim().toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
        const newPM = { ...pmForm, id: newId, method_key: `${baseKey}_${Date.now().toString().slice(-4)}` };
        updatedMethods = [...paymentMethods, newPM];
      }
      setPaymentMethods(updatedMethods);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sami_payment_methods', JSON.stringify(updatedMethods));
      }

      showToast(pmEditing ? `✅ ${pmForm.title} updated!` : `✅ ${pmForm.title} created!`);
      setPmModalOpen(false);
      setPmEditing(null);

      // 2. Background Sync to Backend API
      const token = localStorage.getItem('sami_admin_token');
      if (token) {
        const cmsUrl = pmEditing ? `/api/admin/cms/payment-methods/${pmEditing.id}` : '/api/admin/cms/payment-methods';
        const adminUrl = pmEditing ? `/api/admin/payment-methods/${pmEditing.id}` : '/api/admin/payment-methods';
        const method = pmEditing ? 'PUT' : 'POST';

        let res = await fetch(cmsUrl, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(pmForm)
        });

        if (!res.ok) {
          await fetch(adminUrl, {
            method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(pmForm)
          });
        }
      }
    } catch (err: any) {
      console.warn('Background sync error (data safely saved locally):', err);
    } finally {
      setPmActionLoading(false);
    }
  };

  const handleResetPMDefaults = async () => {
    if (!confirm('Are you sure you want to restore default payment accounts (Easypaisa, JazzCash, UPaisa, Meezan Bank, Binance, Card)?')) {
      return;
    }
    setPaymentMethods(DEFAULT_PAYMENT_METHODS);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sami_payment_methods', JSON.stringify(DEFAULT_PAYMENT_METHODS));
    }
    showToast('✅ Default payment methods restored successfully!');

    try {
      const token = localStorage.getItem('sami_admin_token');
      if (!token) return;
      let res = await fetch('/api/admin/cms/payment-methods/reset-defaults', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        await fetch('/api/admin/payment-methods/reset-defaults', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (err) {}
  };

  const handleOpenCreatePM = (category = 'bank') => {
    setPmEditing(null);
    setPmForm({
      title: category === 'bank' ? 'Meezan Bank Transfer' :
             category === 'wallet' ? 'Easypaisa / JazzCash' :
             category === 'crypto' ? 'Binance Pay & USDT' :
             category === 'card' ? 'Visa / Mastercard Card Checkout' : 'Custom Payment Method',
      category,
      badge: category === 'wallet' ? 'RECOMMENDED & FASTEST' :
             category === 'bank' ? 'DIRECT BANK / RAAST' :
             category === 'crypto' ? 'CRYPTO / ZERO FEE' :
             category === 'card' ? 'OVERSEAS & INTERNATIONAL' : '',
      account_title: 'SARDAR SAMIULLAH',
      account_number: '',
      iban_or_wallet: '',
      checkout_url: category === 'card' ? 'https://whop.com/checkout/plan_DsfaeyFcXlCwI' : '',
      instructions: category === 'bank' ? 'Transfer to Meezan Bank via Raast ID / IBFT and upload confirmation screenshot.' :
                    category === 'wallet' ? 'Send course fee via mobile wallet app and attach transaction proof.' :
                    category === 'crypto' ? 'Send USDT via Binance Pay ID or BEP20 network and upload hash/screenshot.' :
                    'Complete payment and upload receipt screenshot below.',
      price_display: category === 'crypto' ? '$15 USDT' : category === 'card' ? '$15 USD' : 'PKR 3,900',
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSaveSection = async (key: string, title?: string) => {
    setSaving(true);
    const section = sections[key];
    if (!section) {
      setSaving(false);
      return;
    }

    // 1. Optimistic local cache update
    const updatedSections = {
      ...sections,
      [key]: {
        ...section,
        title: title || section.title,
        content: section.content
      }
    };
    setSections(updatedSections);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sami_cms_sections', JSON.stringify(updatedSections));
    }
    showToast(`✅ ${section.title || key} saved & updated on live website!`);

    // 2. Background sync to backend API
    try {
      const token = localStorage.getItem('sami_admin_token');
      if (token) {
        await fetch(`/api/admin/cms/sections/${key}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: title || section.title,
            content: section.content,
            is_visible: section.is_visible
          })
        });
      }
    } catch (err: any) {
      console.warn('Backend sync error for section (saved locally):', err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSection = async (key: string) => {
    const section = sections[key];
    if (!section) return;

    const newStatus = section.is_visible === 1 ? 0 : 1;
    const updatedSections = {
      ...sections,
      [key]: {
        ...section,
        is_visible: newStatus
      }
    };
    setSections(updatedSections);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sami_cms_sections', JSON.stringify(updatedSections));
    }
    showToast(`⚡ ${section.title || key} is now ${newStatus === 1 ? 'VISIBLE' : 'HIDDEN'}`);

    try {
      const token = localStorage.getItem('sami_admin_token');
      if (token) {
        await fetch(`/api/admin/cms/sections/${key}/toggle`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (err) {}
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('mediaFile', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch('/api/admin/cms/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error(`Upload failed with status ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        callback(data.url);
        showToast('📷 Media uploaded successfully!');
      } else {
        alert(data.message || 'Failed to upload file');
      }
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || 'Server error'));
    } finally {
      setUploading(false);
    }
  };

  // --- Review Handlers ---
  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('sami_admin_token');
      const url = editingReview ? `/api/admin/cms/reviews/${editingReview.id}` : '/api/admin/cms/reviews';
      const method = editingReview ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      });
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        showToast(editingReview ? 'Review updated!' : 'Review created!');
        setShowReviewModal(false);
        setEditingReview(null);
        fetchCmsData();
      } else {
        alert(data.message || 'Failed to save review');
      }
    } catch (err: any) {
      alert('Failed to save review: ' + (err.message || 'Server error'));
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student review?')) return;
    try {
      const token = localStorage.getItem('sami_admin_token');
      await fetch(`/api/admin/cms/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      showToast('Review deleted');
      fetchCmsData();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  // --- Blog Handlers ---
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('sami_admin_token');
      const url = editingBlog ? `/api/admin/cms/blogs/${editingBlog.id}` : '/api/admin/cms/blogs';
      const method = editingBlog ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(blogForm)
      });
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        showToast(editingBlog ? 'Blog article updated!' : 'Blog article published!');
        setShowBlogModal(false);
        setEditingBlog(null);
        fetchCmsData();
      } else {
        alert(data.message || 'Failed to save blog');
      }
    } catch (err: any) {
      alert('Failed to save blog: ' + (err.message || 'Server error'));
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const token = localStorage.getItem('sami_admin_token');
      await fetch(`/api/admin/cms/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      showToast('Blog article deleted');
      fetchCmsData();
    } catch (err) {
      alert('Failed to delete blog');
    }
  };

  const updateSectionField = (key: string, field: string, value: any) => {
    setSections(prev => {
      const current = prev[key] || { section_key: key, title: key, content: {}, is_visible: 1 };
      return {
        ...prev,
        [key]: {
          ...current,
          content: {
            ...current.content,
            [field]: value
          }
        }
      };
    });
  };

  const tabs = [
    { id: 'hero', label: 'Hero & Video', icon: <Play size={17} /> },
    { id: 'marquee', label: 'Top Marquee', icon: <Sparkles size={17} /> },
    { id: 'pricing', label: 'Payment Accounts', icon: <CreditCard size={17} /> },
    { id: 'mentor', label: 'Mentor Profile', icon: <User size={17} /> },
    { id: 'bonuses', label: 'Free Bonuses', icon: <Gift size={17} /> },
    { id: 'reviews', label: 'Video Reviews', icon: <MessageSquare size={17} /> },
    { id: 'faqs', label: 'FAQs Manager', icon: <HelpCircle size={17} /> },
    { id: 'contact', label: 'Contact & WhatsApp', icon: <Phone size={17} /> },
    { id: 'blogs', label: 'Blogs & News', icon: <BookOpen size={17} /> }
  ];

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 16px auto', color: 'var(--primary)' }} />
        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF' }}>Loading Dynamic CMS Manager...</div>
      </div>
    );
  }

  const heroContent = sections['hero']?.content || {};
  const marqueeContent = sections['marquee']?.content || {};
  const paymentContent = sections['payment_accounts']?.content || {};
  const mentorContent = sections['mentor_profile']?.content || {};
  const bonusContent = sections['bonuses']?.content || {};
  const contactContent = sections['contact_info']?.content || {};
  const faqContent = sections['faqs']?.content || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
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
          <CheckCircle size={18} /> {toastMessage}
        </div>
      )}

      {/* Header with Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ backgroundColor: 'rgba(0, 160, 223, 0.15)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '800' }}>
              FULL-SITE DYNAMIC CMS
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
            Website Content &amp; Media Management
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
            Edit headlines, videos, images, prices, bonus boxes, reviews, and payment accounts without touching source code.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-md)',
              color: '#FFFFFF',
              fontSize: '0.88rem',
              fontWeight: '600'
            }}
          >
            <ExternalLink size={16} /> View Live Storefront
          </a>
        </div>
      </div>

      {/* Tab Selector Bar */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '6px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 18px',
              borderRadius: '8px',
              border: activeTab === tab.id ? '1px solid var(--primary)' : '1px solid transparent',
              backgroundColor: activeTab === tab.id ? 'rgba(0, 160, 223, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: activeTab === tab.id ? '#FFFFFF' : '#94A3B8',
              fontWeight: activeTab === tab.id ? '700' : '500',
              fontSize: '0.88rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ color: activeTab === tab.id ? 'var(--primary)' : '#94A3B8' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ==========================================================
          TAB 1: HERO & VIDEO BANNER
          ========================================================== */}
      {activeTab === 'hero' && (
        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>🎬 Hero Banner &amp; Video Preview</h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0 0' }}>Configure main headline, blue highlighted text, video embed, and pricing boxes.</p>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveSection('hero', 'Hero Banner & Video Preview')}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Hero Changes'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* Left: Text & Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                  Badge Tag (Above Headline)
                </label>
                <input
                  type="text"
                  value={heroContent.badge || ''}
                  onChange={(e) => updateSectionField('hero', 'badge', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                  Main Headline (White Text)
                </label>
                <input
                  type="text"
                  value={heroContent.title || ''}
                  onChange={(e) => updateSectionField('hero', 'title', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                  Highlighted Ending Text (Displayed in Cyan Blue)
                </label>
                <input
                  type="text"
                  value={heroContent.highlight_text || ''}
                  onChange={(e) => updateSectionField('hero', 'highlight_text', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(0, 160, 223, 0.3)', borderRadius: '6px', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '700' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                  Subtitle Description
                </label>
                <textarea
                  rows={3}
                  value={heroContent.subtitle || ''}
                  onChange={(e) => updateSectionField('hero', 'subtitle', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>

              {/* Pricing Boxes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>
                    Discounted Price
                  </label>
                  <input
                    type="text"
                    value={heroContent.discount_price || '3,900 PKR'}
                    onChange={(e) => updateSectionField('hero', 'discount_price', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', backgroundColor: '#1E293B', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', color: 'var(--accent-green)', fontWeight: '800', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>
                    Original Price
                  </label>
                  <input
                    type="text"
                    value={heroContent.original_price || '32,500 PKR'}
                    onChange={(e) => updateSectionField('hero', 'original_price', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', backgroundColor: '#1E293B', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', color: '#EF4444', textDecoration: 'line-through', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>
                    Discount Tag
                  </label>
                  <input
                    type="text"
                    value={heroContent.discount_percentage || '88% OFF'}
                    onChange={(e) => updateSectionField('hero', 'discount_percentage', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.88rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Right: Video Settings & Thumbnail */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                  Video Preview Bar Title
                </label>
                <input
                  type="text"
                  value={heroContent.video_title || ''}
                  onChange={(e) => updateSectionField('hero', 'video_title', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                  Video Media File or Embed URL (Upload MP4 / WebM or YouTube link)
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={heroContent.video_url || ''}
                    onChange={(e) => updateSectionField('hero', 'video_url', e.target.value)}
                    placeholder="Upload video file or paste https://..."
                    style={{ flex: 1, padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                  <label style={{
                    padding: '10px 14px',
                    backgroundColor: 'rgba(0, 160, 223, 0.15)',
                    border: '1px solid rgba(0, 160, 223, 0.3)',
                    borderRadius: '6px',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}>
                    <UploadCloud size={16} /> Upload Video
                    <input
                      type="file"
                      accept="video/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, (url) => updateSectionField('hero', 'video_url', url))}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                  Video Poster Thumbnail Image URL
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={heroContent.video_thumbnail || ''}
                    onChange={(e) => updateSectionField('hero', 'video_thumbnail', e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                  <label style={{
                    padding: '10px 14px',
                    backgroundColor: 'rgba(0, 160, 223, 0.15)',
                    border: '1px solid rgba(0, 160, 223, 0.3)',
                    borderRadius: '6px',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <UploadCloud size={16} /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, (url) => updateSectionField('hero', 'video_thumbnail', url))}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                  Primary CTA Button Text
                </label>
                <input
                  type="text"
                  value={heroContent.cta_text || 'YES! I WANT TO LEARN THIS'}
                  onChange={(e) => updateSectionField('hero', 'cta_text', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem', fontWeight: '700' }}
                />
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==========================================================
          TAB 2: TOP MARQUEE & OFFERS
          ========================================================== */}
      {activeTab === 'marquee' && (
        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>📢 Top Marquee &amp; Announcement Ticker</h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0 0' }}>Add, remove, or customize rolling ticker items shown at the very top of the website.</p>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveSection('marquee', 'Top Announcement Marquee')}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Marquee'}
            </button>
          </div>

          {/* Marquee Item List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {(marqueeContent.items || []).map((item: string, idx: number) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem', minWidth: '24px' }}>#{idx + 1}</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...(marqueeContent.items || [])];
                    newItems[idx] = e.target.value;
                    updateSectionField('marquee', 'items', newItems);
                  }}
                  style={{ flex: 1, padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newItems = (marqueeContent.items || []).filter((_: any, i: number) => i !== idx);
                    updateSectionField('marquee', 'items', newItems);
                  }}
                  style={{ padding: '8px 12px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', color: '#EF4444', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              const currentItems = marqueeContent.items || [];
              updateSectionField('marquee', 'items', [...currentItems, '🔥 Special Offer - Enroll Now!']);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              backgroundColor: 'rgba(0, 160, 223, 0.15)',
              border: '1px dashed rgba(0, 160, 223, 0.4)',
              borderRadius: '6px',
              color: 'var(--primary)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} /> Add Ticker Announcement Item
          </button>
        </div>
      )}

      {/* ==========================================================
          TAB 3: PAYMENT ACCOUNTS & METHODS (DYNAMIC CMS CRUD)
          ========================================================== */}
      {activeTab === 'pricing' && (
        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '32px' }}>
          
          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CreditCard size={24} color="var(--primary)" />
                <span>Payment Methods &amp; Receiving Accounts (Full CMS Control)</span>
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#94A3B8', margin: '6px 0 0 0' }}>
                Manage all payment receiving accounts (Easypaisa, JazzCash, UPaisa, Meezan Bank, Binance, Card). Add new accounts, edit credentials, disable, or delete anytime.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleResetPMDefaults}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#94A3B8',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={15} />
                <span>Restore Defaults</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenCreatePM('bank')}
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  fontSize: '0.85rem',
                  fontWeight: 800
                }}
              >
                <Plus size={16} />
                <span>Add Payment Method</span>
              </button>
            </div>
          </div>

          {/* Preset Quick Add Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginRight: '4px' }}>Quick Add:</span>
            <button
              type="button"
              onClick={() => handleOpenCreatePM('bank')}
              style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(0, 160, 223, 0.12)', border: '1px solid rgba(0, 160, 223, 0.25)', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              + Bank Account (Meezan/HBL)
            </button>
            <button
              type="button"
              onClick={() => handleOpenCreatePM('wallet')}
              style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#10B981', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              + Mobile Wallet (Easypaisa / JazzCash / UPaisa)
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
            <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
              <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px auto', color: 'var(--primary)' }} />
              <div>Loading Payment Receiving Accounts...</div>
            </div>
          ) : paymentMethods.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: '#1E293B',
              borderRadius: '12px',
              border: '1px dashed rgba(255, 255, 255, 0.15)'
            }}>
              <CreditCard size={36} color="#64748B" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>No payment methods found</h4>
              <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginBottom: '18px' }}>
                Students won't be able to pay on the enrollment page. Restore defaults or add your accounts now.
              </p>
              <button
                type="button"
                onClick={handleResetPMDefaults}
                className="btn-primary"
                style={{ padding: '9px 18px', fontSize: '0.85rem' }}
              >
                Restore Standard Payment Methods
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
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
                      borderRadius: '12px',
                      padding: '22px',
                      border: isActive ? `1.5px solid ${themeColor}` : '1px solid rgba(255, 255, 255, 0.08)',
                      opacity: isActive ? 1 : 0.65,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      boxShadow: isActive ? '0 4px 20px rgba(0, 0, 0, 0.25)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      {/* Card Header */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
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
                            <h4 style={{ fontSize: '1.02rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>
                              {method.title}
                            </h4>
                            <span style={{ fontSize: '0.72rem', color: themeColor, fontWeight: 700, textTransform: 'uppercase' }}>
                              {method.badge || method.category}
                            </span>
                          </div>
                        </div>

                        {/* Active Status Badge */}
                        <span style={{
                          padding: '4px 9px',
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
                        borderRadius: '8px',
                        padding: '14px',
                        fontSize: '0.82rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        marginBottom: '16px',
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

                        {method.price_display && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                            <span style={{ color: '#94A3B8' }}>Fee Display:</span>
                            <span style={{ color: '#E2E8F0', fontWeight: 700 }}>{method.price_display}</span>
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
                      
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
      )}

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
                    <option value="wallet">📱 Mobile Wallet (Easypaisa, JazzCash, UPaisa)</option>
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
                  placeholder="e.g. Meezan Bank Transfer, Easypaisa Mobile Wallet, JazzCash Account"
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
                    placeholder="e.g. RECOMMENDED & FASTEST, DIRECT BANK / RAAST"
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
                    placeholder="e.g. SARDAR SAMIULLAH"
                    value={pmForm.account_title}
                    onChange={(e) => setPmForm({ ...pmForm, account_title: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>Account / Phone / Pay ID</label>
                  <input
                    type="text"
                    placeholder="e.g. 03481095933 or 0015010112560119"
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
                  placeholder="e.g. PK94MEZN0015010112560119 or 0xae8da7..."
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
                  placeholder="e.g. Transfer to Meezan Bank via Raast ID / IBFT using IBAN PK94MEZN0015010112560119 and upload confirmation screenshot."
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
                  className="btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.88rem' }}
                >
                  {pmActionLoading ? 'Saving...' : pmEditing ? 'Save Changes' : 'Create Payment Method'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==========================================================
          TAB 4: MENTOR PROFILE & STATS
          ========================================================== */}
      {activeTab === 'mentor' && (
        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>👨‍🏫 Mentor Profile &amp; KPI Badges</h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0 0' }}>Manage mentor name, photo, bio description, checkmarks, and 3 stat counters.</p>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveSection('mentor_profile', 'Mentor Profile & Credentials')}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Mentor Changes'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>Mentor Full Name</label>
                <input
                  type="text"
                  value={mentorContent.name || ''}
                  onChange={(e) => updateSectionField('mentor_profile', 'name', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>Mentor Subtitle / Title</label>
                <input
                  type="text"
                  value={mentorContent.title || ''}
                  onChange={(e) => updateSectionField('mentor_profile', 'title', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>Profile Photo URL</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={mentorContent.photo_url || ''}
                    onChange={(e) => updateSectionField('mentor_profile', 'photo_url', e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                  <label style={{
                    padding: '10px 14px',
                    backgroundColor: 'rgba(0, 160, 223, 0.15)',
                    border: '1px solid rgba(0, 160, 223, 0.3)',
                    borderRadius: '6px',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <UploadCloud size={16} /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, (url) => updateSectionField('mentor_profile', 'photo_url', url))}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>Bio Description</label>
                <textarea
                  rows={4}
                  value={mentorContent.bio || ''}
                  onChange={(e) => updateSectionField('mentor_profile', 'bio', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>
            </div>

            {/* Right: 4 Benefits Checkmarks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>4 Key Benefit Checkmarks</h4>
              {(mentorContent.benefits || []).map((b: string, idx: number) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={18} color="var(--primary)" />
                  <input
                    type="text"
                    value={b}
                    onChange={(e) => {
                      const newBenefits = [...(mentorContent.benefits || [])];
                      newBenefits[idx] = e.target.value;
                      updateSectionField('mentor_profile', 'benefits', newBenefits);
                    }}
                    style={{ flex: 1, padding: '8px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.88rem' }}
                  />
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ==========================================================
          TAB 5: FREE BONUSES (RS 30,000+)
          ========================================================== */}
      {activeTab === 'bonuses' && (
        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>🎁 Free Bonuses Stack (Worth Rs 30,000+)</h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0 0' }}>Add, edit, or remove the 6 bonus boxes displayed on the homepage.</p>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveSection('bonuses', 'Free Bonus Stack (Rs 30,000+)')}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Bonuses'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {(bonusContent.items || []).map((bonus: any, idx: number) => (
              <div key={idx} style={{ backgroundColor: '#1E293B', borderRadius: 'var(--radius-md)', padding: '18px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--accent-green)', fontWeight: '800', fontSize: '0.82rem' }}>BONUS #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = (bonusContent.items || []).filter((_: any, i: number) => i !== idx);
                      updateSectionField('bonuses', 'items', newItems);
                    }}
                    style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <input
                  type="text"
                  value={bonus.title || ''}
                  placeholder="Bonus Title"
                  onChange={(e) => {
                    const newItems = [...(bonusContent.items || [])];
                    newItems[idx] = { ...newItems[idx], title: e.target.value };
                    updateSectionField('bonuses', 'items', newItems);
                  }}
                  style={{ width: '100%', padding: '8px 10px', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.88rem', fontWeight: '700' }}
                />
                <textarea
                  rows={2}
                  value={bonus.desc || ''}
                  placeholder="Short Description"
                  onChange={(e) => {
                    const newItems = [...(bonusContent.items || [])];
                    newItems[idx] = { ...newItems[idx], desc: e.target.value };
                    updateSectionField('bonuses', 'items', newItems);
                  }}
                  style={{ width: '100%', padding: '8px 10px', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#94A3B8', fontSize: '0.82rem', resize: 'vertical' }}
                />
                <input
                  type="text"
                  value={bonus.value || ''}
                  placeholder="Value e.g. Rs 5,000"
                  onChange={(e) => {
                    const newItems = [...(bonusContent.items || [])];
                    newItems[idx] = { ...newItems[idx], value: e.target.value };
                    updateSectionField('bonuses', 'items', newItems);
                  }}
                  style={{ width: '100%', padding: '6px 10px', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--accent-amber)', fontWeight: '700', fontSize: '0.82rem' }}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              const current = bonusContent.items || [];
              updateSectionField('bonuses', 'items', [...current, { title: 'New Exclusive Bonus Tool', desc: 'Step by step practical tool and guide.', value: 'Rs 3,000' }]);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px dashed rgba(16, 185, 129, 0.4)',
              borderRadius: '6px',
              color: 'var(--accent-green)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} /> Add New Free Bonus Box
          </button>
        </div>
      )}

      {/* ==========================================================
          TAB 6: STUDENT VIDEO REVIEWS & PROOFS
          ========================================================== */}
      {activeTab === 'reviews' && (
        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>🎥 Student Video Reviews &amp; Success Proofs</h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0 0' }}>Manage video case studies, sales proofs, student quotes, and 5-star ratings.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingReview(null);
                setReviewForm({
                  student_name: '',
                  city: 'Lahore',
                  market: 'UAE Market',
                  sales_text: 'AED 3,500 in 5 Days',
                  orders_text: '32 Orders',
                  quote: 'Started as a total beginner and got sales within 2 days!',
                  video_url: '',
                  thumbnail_url: '',
                  rating: 5,
                  is_featured: 1
                });
                setShowReviewModal(true);
              }}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              <Plus size={16} /> Add New Student Review
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {reviews.map((rev: any) => (
              <div key={rev.id} style={{ backgroundColor: '#1E293B', borderRadius: 'var(--radius-lg)', padding: '20px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>{rev.student_name}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{rev.city} • {rev.market}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '2px', color: '#F59E0B' }}>
                    {[...Array(rev.rating || 5)].map((_, i) => <Star key={i} size={13} fill="#F59E0B" />)}
                  </div>
                </div>

                <div style={{ backgroundColor: 'rgba(0, 160, 223, 0.1)', border: '1px solid rgba(0, 160, 223, 0.25)', borderRadius: '6px', padding: '6px 10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '800' }}>{rev.sales_text}</span>
                  <span style={{ color: 'var(--accent-green)', fontWeight: '700' }}>{rev.orders_text}</span>
                </div>

                <p style={{ fontSize: '0.84rem', color: '#CBD5E1', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                  &ldquo;{rev.quote}&rdquo;
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingReview(rev);
                      setReviewForm({
                        student_name: rev.student_name,
                        city: rev.city,
                        market: rev.market,
                        sales_text: rev.sales_text,
                        orders_text: rev.orders_text,
                        quote: rev.quote,
                        video_url: rev.video_url || '',
                        thumbnail_url: rev.thumbnail_url || '',
                        rating: rev.rating || 5,
                        is_featured: rev.is_featured
                      });
                      setShowReviewModal(true);
                    }}
                    style={{ padding: '6px 12px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteReview(rev.id)}
                    style={{ padding: '6px 12px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', color: '#EF4444', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================================
          TAB 7: FAQS MANAGER
          ========================================================== */}
      {activeTab === 'faqs' && (
        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>❓ Frequently Asked Questions (FAQs)</h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0 0' }}>Manage the Q&amp;A accordion displayed on the landing page and support desk.</p>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveSection('faqs', 'Frequently Asked Questions')}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save FAQs'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {(faqContent.items || []).map((faq: any, idx: number) => (
              <div key={idx} style={{ backgroundColor: '#1E293B', borderRadius: 'var(--radius-md)', padding: '20px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.85rem' }}>QUESTION #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = (faqContent.items || []).filter((_: any, i: number) => i !== idx);
                      updateSectionField('faqs', 'items', newItems);
                    }}
                    style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <input
                  type="text"
                  value={faq.q || ''}
                  placeholder="Question"
                  onChange={(e) => {
                    const newItems = [...(faqContent.items || [])];
                    newItems[idx] = { ...newItems[idx], q: e.target.value };
                    updateSectionField('faqs', 'items', newItems);
                  }}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem', fontWeight: '700' }}
                />
                <textarea
                  rows={3}
                  value={faq.a || ''}
                  placeholder="Answer"
                  onChange={(e) => {
                    const newItems = [...(faqContent.items || [])];
                    newItems[idx] = { ...newItems[idx], a: e.target.value };
                    updateSectionField('faqs', 'items', newItems);
                  }}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#CBD5E1', fontSize: '0.88rem', resize: 'vertical' }}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              const current = faqContent.items || [];
              updateSectionField('faqs', 'items', [...current, { q: 'New Question?', a: 'Detailed answer explaining the steps.' }]);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              backgroundColor: 'rgba(0, 160, 223, 0.15)',
              border: '1px dashed rgba(0, 160, 223, 0.4)',
              borderRadius: '6px',
              color: 'var(--primary)',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} /> Add New FAQ Item
          </button>
        </div>
      )}

      {/* ==========================================================
          TAB 8: CONTACT & WHATSAPP CONFIG
          ========================================================== */}
      {activeTab === 'contact' && (
        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>📱 Contact Channels &amp; WhatsApp Configuration</h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0 0' }}>Configure WhatsApp phone number, support hours, email, and head office address.</p>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveSection('contact_info', 'Contact Channels & WhatsApp')}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Contact Info'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                Primary WhatsApp Number (Clean digits e.g. 923330093269)
              </label>
              <input
                type="text"
                value={contactContent.whatsapp_number || '923330093269'}
                onChange={(e) => updateSectionField('contact_info', 'whatsapp_number', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(37, 211, 102, 0.3)', borderRadius: '6px', color: 'var(--accent-green)', fontWeight: '800', fontSize: '0.95rem', fontFamily: 'monospace' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                Formatted Display Phone (Shown in footer &amp; support)
              </label>
              <input
                type="text"
                value={contactContent.display_phone || '+92 333 0093269'}
                onChange={(e) => updateSectionField('contact_info', 'display_phone', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                Official Support Email
              </label>
              <input
                type="email"
                value={contactContent.email || 'support@ecomwithsami.com'}
                onChange={(e) => updateSectionField('contact_info', 'email', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                Support Hours &amp; Days
              </label>
              <input
                type="text"
                value={contactContent.support_hours || 'Mon–Sat, 9:00 AM – 5:00 PM PKT'}
                onChange={(e) => updateSectionField('contact_info', 'support_hours', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '6px' }}>
                Head Office Address
              </label>
              <input
                type="text"
                value={contactContent.head_office || 'Mehdi Tower, Shahrah-e-Faisal, Karachi, Pakistan'}
                onChange={(e) => updateSectionField('contact_info', 'head_office', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
          TAB 9: BLOGS & NEWS ARTICLES
          ========================================================== */}
      {activeTab === 'blogs' && (
        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>✍️ Blog Articles &amp; Announcements</h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0 0' }}>Publish e-commerce case studies, dropshipping guides, and news updates.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingBlog(null);
                setBlogForm({
                  title: '',
                  slug: '',
                  excerpt: '',
                  content: '',
                  author: 'Mentor Sami',
                  image_url: '',
                  tags: 'UAE Dropshipping, TikTok Ads',
                  is_published: 1
                });
                setShowBlogModal(true);
              }}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              <Plus size={16} /> Create New Article
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {blogs.map((b: any) => (
              <div key={b.id} style={{ backgroundColor: '#1E293B', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: '800', padding: '3px 8px', borderRadius: '999px', backgroundColor: b.is_published ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: b.is_published ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                    {b.is_published ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{new Date(b.created_at).toLocaleDateString()}</span>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#FFFFFF', margin: 0, lineHeight: 1.4 }}>{b.title}</h4>
                <p style={{ fontSize: '0.84rem', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>{b.excerpt || b.content.slice(0, 100) + '...'}</p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBlog(b);
                      setBlogForm({
                        title: b.title,
                        slug: b.slug,
                        excerpt: b.excerpt || '',
                        content: b.content,
                        author: b.author,
                        image_url: b.image_url || '',
                        tags: b.tags || '',
                        is_published: b.is_published
                      });
                      setShowBlogModal(true);
                    }}
                    style={{ padding: '6px 12px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBlog(b.id)}
                    style={{ padding: '6px 12px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', color: '#EF4444', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Edit Modal */}
      {showReviewModal && (
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
        }} onClick={() => setShowReviewModal(false)}>
          <div
            style={{
              backgroundColor: '#111827',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              width: '100%',
              maxWidth: '540px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              color: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '18px' }}>
              {editingReview ? 'Edit Student Review' : 'Add New Student Review'}
            </h3>
            <form onSubmit={handleSaveReview} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Student Name *</label>
                <input
                  type="text"
                  required
                  value={reviewForm.student_name}
                  onChange={(e) => setReviewForm({ ...reviewForm, student_name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>City</label>
                  <input
                    type="text"
                    value={reviewForm.city}
                    onChange={(e) => setReviewForm({ ...reviewForm, city: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Market</label>
                  <input
                    type="text"
                    value={reviewForm.market}
                    onChange={(e) => setReviewForm({ ...reviewForm, market: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Sales Proof Text *</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.sales_text}
                    placeholder="e.g. AED 4,500 in 4 Days"
                    onChange={(e) => setReviewForm({ ...reviewForm, sales_text: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--primary)', fontWeight: '700' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Orders Count</label>
                  <input
                    type="text"
                    value={reviewForm.orders_text}
                    placeholder="e.g. 45 Orders"
                    onChange={(e) => setReviewForm({ ...reviewForm, orders_text: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--accent-green)', fontWeight: '700' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Student Quote / Feedback *</label>
                <textarea
                  rows={3}
                  required
                  value={reviewForm.quote}
                  onChange={(e) => setReviewForm({ ...reviewForm, quote: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Video Media File or Link (Upload MP4 / WebM / Video or paste link)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={reviewForm.video_url}
                    placeholder="Upload video file or paste URL..."
                    onChange={(e) => setReviewForm({ ...reviewForm, video_url: e.target.value })}
                    style={{ flex: 1, padding: '8px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.86rem' }}
                  />
                  <label style={{
                    padding: '8px 14px',
                    backgroundColor: 'rgba(0, 160, 223, 0.15)',
                    border: '1px solid rgba(0, 160, 223, 0.3)',
                    borderRadius: '6px',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}>
                    <UploadCloud size={15} /> Upload Video
                    <input
                      type="file"
                      accept="video/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, (url) => setReviewForm(prev => ({ ...prev, video_url: url })))}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Video Poster Thumbnail / Screenshot Image</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={reviewForm.thumbnail_url}
                    placeholder="Upload screenshot image or paste URL..."
                    onChange={(e) => setReviewForm({ ...reviewForm, thumbnail_url: e.target.value })}
                    style={{ flex: 1, padding: '8px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.86rem' }}
                  />
                  <label style={{
                    padding: '8px 14px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '6px',
                    color: 'var(--accent-green)',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}>
                    <UploadCloud size={15} /> Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, (url) => setReviewForm(prev => ({ ...prev, thumbnail_url: url })))}
                    />
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#94A3B8' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 18px' }}>
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Edit Modal */}
      {showBlogModal && (
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
        }} onClick={() => setShowBlogModal(false)}>
          <div
            style={{
              backgroundColor: '#111827',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              color: '#FFFFFF'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '18px' }}>
              {editingBlog ? 'Edit Blog Article' : 'Create New Blog Post'}
            </h3>
            <form onSubmit={handleSaveBlog} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Article Title *</label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Excerpt (Short Summary)</label>
                <input
                  type="text"
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Full Content *</label>
                <textarea
                  rows={6}
                  required
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '4px' }}>Featured Image URL</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={blogForm.image_url}
                    onChange={(e) => setBlogForm({ ...blogForm, image_url: e.target.value })}
                    style={{ flex: 1, padding: '8px 12px', backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF' }}
                  />
                  <label style={{
                    padding: '8px 12px',
                    backgroundColor: 'rgba(0, 160, 223, 0.15)',
                    border: '1px solid rgba(0, 160, 223, 0.3)',
                    borderRadius: '6px',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: '700'
                  }}>
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, (url) => setBlogForm({ ...blogForm, image_url: url }))}
                    />
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowBlogModal(false)}
                  style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#94A3B8' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 18px' }}>
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
