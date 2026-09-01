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
  AlertCircle
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

  useEffect(() => {
    fetchCmsData();
  }, []);

  const fetchCmsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sami_admin_token');
      
      // 1. Fetch Sections
      const secRes = await fetch('/api/admin/cms/sections', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const secData = await secRes.json();
      if (secData.success) {
        const secMap: Record<string, any> = {};
        secData.sections.forEach((s: any) => {
          secMap[s.section_key] = s;
        });
        setSections(secMap);
      }

      // 2. Fetch Reviews
      const revRes = await fetch('/api/admin/cms/reviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const revData = await revRes.json();
      if (revData.success) setReviews(revData.reviews);

      // 3. Fetch Blogs
      const blogRes = await fetch('/api/admin/cms/blogs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const blogData = await blogRes.json();
      if (blogData.success) setBlogs(blogData.blogs);

    } catch (err) {
      console.error('Error fetching CMS data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSaveSection = async (key: string, title?: string) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('sami_admin_token');
      const section = sections[key];
      if (!section) return;

      const res = await fetch(`/api/admin/cms/sections/${key}`, {
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

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(text ? `HTTP ${res.status}: ${text.slice(0, 100)}` : `Backend server not reachable (HTTP ${res.status})`);
      }

      const data = await res.json();
      if (data.success) {
        showToast(`✅ ${section.title || key} saved & updated on live website!`);
      } else {
        alert(data.message || 'Failed to save section');
      }
    } catch (err: any) {
      alert('Error saving section: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSection = async (key: string) => {
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch(`/api/admin/cms/sections/${key}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        setSections({
          ...sections,
          [key]: {
            ...sections[key],
            is_visible: data.is_visible
          }
        });
        showToast(`⚡ ${data.message}`);
      }
    } catch (err) {
      alert('Error toggling section');
    }
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
          TAB 3: PAYMENT ACCOUNTS & BANKS
          ========================================================== */}
      {activeTab === 'pricing' && (
        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>💳 Payment Methods &amp; Bank Accounts</h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '4px 0 0 0' }}>Configure Easypaisa, Meezan Bank, Binance, and Crypto BEP20 accounts displayed on checkout.</p>
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveSection('payment_accounts', 'Payment Methods & Bank Accounts')}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.9rem' }}
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Payment Accounts'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* Easypaisa Box */}
            <div style={{ backgroundColor: '#1E293B', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.4rem' }}>📱</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-green)', margin: 0 }}>Easypaisa Account</h4>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>Account Title</label>
                  <input
                    type="text"
                    value={paymentContent.easypaisa?.account_title || ''}
                    onChange={(e) => {
                      updateSectionField('payment_accounts', 'easypaisa', {
                        ...paymentContent.easypaisa,
                        account_title: e.target.value
                      });
                    }}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>Account / Phone Number</label>
                  <input
                    type="text"
                    value={paymentContent.easypaisa?.account_number || ''}
                    onChange={(e) => {
                      updateSectionField('payment_accounts', 'easypaisa', {
                        ...paymentContent.easypaisa,
                        account_number: e.target.value
                      });
                    }}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--accent-green)', fontWeight: '800', fontFamily: 'monospace', fontSize: '0.95rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Meezan Bank Box */}
            <div style={{ backgroundColor: '#1E293B', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid rgba(0, 160, 223, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.4rem' }}>🏦</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>Meezan Bank Details</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>Company / Account Title</label>
                  <input
                    type="text"
                    value={paymentContent.meezan_bank?.account_title || ''}
                    onChange={(e) => {
                      updateSectionField('payment_accounts', 'meezan_bank', {
                        ...paymentContent.meezan_bank,
                        account_title: e.target.value
                      });
                    }}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>Account Number</label>
                  <input
                    type="text"
                    value={paymentContent.meezan_bank?.account_number || ''}
                    onChange={(e) => {
                      updateSectionField('payment_accounts', 'meezan_bank', {
                        ...paymentContent.meezan_bank,
                        account_number: e.target.value
                      });
                    }}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontFamily: 'monospace', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>IBAN Number</label>
                  <input
                    type="text"
                    value={paymentContent.meezan_bank?.iban || ''}
                    onChange={(e) => {
                      updateSectionField('payment_accounts', 'meezan_bank', {
                        ...paymentContent.meezan_bank,
                        iban: e.target.value
                      });
                    }}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--primary)', fontFamily: 'monospace', fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Binance & Crypto */}
            <div style={{ backgroundColor: '#1E293B', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.4rem' }}>₿</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-amber)', margin: 0 }}>Binance &amp; Crypto</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>Binance Pay ID</label>
                  <input
                    type="text"
                    value={paymentContent.binance_crypto?.binance_pay_id || ''}
                    onChange={(e) => {
                      updateSectionField('payment_accounts', 'binance_crypto', {
                        ...paymentContent.binance_crypto,
                        binance_pay_id: e.target.value
                      });
                    }}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontFamily: 'monospace', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>Binance Nickname</label>
                  <input
                    type="text"
                    value={paymentContent.binance_crypto?.binance_nickname || ''}
                    onChange={(e) => {
                      updateSectionField('payment_accounts', 'binance_crypto', {
                        ...paymentContent.binance_crypto,
                        binance_nickname: e.target.value
                      });
                    }}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>BEP20 Wallet Address (USDT/BNB)</label>
                  <input
                    type="text"
                    value={paymentContent.binance_crypto?.bep20_wallet || ''}
                    onChange={(e) => {
                      updateSectionField('payment_accounts', 'binance_crypto', {
                        ...paymentContent.binance_crypto,
                        bep20_wallet: e.target.value
                      });
                    }}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--accent-amber)', fontFamily: 'monospace', fontSize: '0.82rem' }}
                  />
                </div>
              </div>
            </div>

            {/* International Card Checkout */}
            <div style={{ backgroundColor: '#1E293B', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.4rem' }}>🌍</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>International Card Checkout</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>Whop / Stripe Card Checkout URL</label>
                  <input
                    type="text"
                    value={paymentContent.international_card?.whop_url || ''}
                    onChange={(e) => {
                      updateSectionField('payment_accounts', 'international_card', {
                        ...paymentContent.international_card,
                        whop_url: e.target.value
                      });
                    }}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#CBD5E1', marginBottom: '4px' }}>Fee in USD</label>
                  <input
                    type="text"
                    value={paymentContent.international_card?.price_usd || '15'}
                    onChange={(e) => {
                      updateSectionField('payment_accounts', 'international_card', {
                        ...paymentContent.international_card,
                        price_usd: e.target.value
                      });
                    }}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                </div>
              </div>
            </div>

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
