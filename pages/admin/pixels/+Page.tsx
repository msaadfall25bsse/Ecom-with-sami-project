import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Activity, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface TrackingPixel {
  id: number;
  platform_name: string;
  pixel_id: string | null;
  custom_code: string | null;
  is_active: number;
  placement: string;
  created_at: string;
  updated_at: string;
}

export default function TrackingPixelsPage() {
  const [pixels, setPixels] = useState<TrackingPixel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPixel, setEditingPixel] = useState<TrackingPixel | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    platform_name: 'Meta Pixel',
    pixel_id: '',
    custom_code: '',
    placement: 'head',
    is_active: true
  });

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchPixels();
  }, []);

  const fetchPixels = async () => {
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch('/api/admin/pixels', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPixels(data.pixels || []);
      }
    } catch (err) {
      console.error('Error fetching pixels:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenAddModal = () => {
    setEditingPixel(null);
    setFormData({
      platform_name: 'Meta Pixel',
      pixel_id: '',
      custom_code: '',
      placement: 'head',
      is_active: true
    });
    setErrorMessage('');
    setShowModal(true);
  };

  const handleOpenEditModal = (p: TrackingPixel) => {
    setEditingPixel(p);
    setFormData({
      platform_name: p.platform_name,
      pixel_id: p.pixel_id || '',
      custom_code: p.custom_code || '',
      placement: p.placement || 'head',
      is_active: p.is_active === 1
    });
    setErrorMessage('');
    setShowModal(true);
  };

  const handleToggle = async (p: TrackingPixel) => {
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch(`/api/admin/pixels/${p.id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Pixel "${p.platform_name}" ${data.is_active === 1 ? 'Activated' : 'Paused'}`);
        fetchPixels();
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" tracking pixel?`)) {
      return;
    }
    try {
      const token = localStorage.getItem('sami_admin_token');
      const res = await fetch(`/api/admin/pixels/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Tracking pixel deleted`);
        fetchPixels();
      }
    } catch (err) {
      alert('Error deleting pixel');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.pixel_id && !formData.custom_code) {
      setErrorMessage('Please enter either a Pixel / Measurement ID or Custom Script Code.');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('sami_admin_token');
      const url = editingPixel ? `/api/admin/pixels/${editingPixel.id}` : '/api/admin/pixels';
      const method = editingPixel ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        showToast(editingPixel ? 'Tracking pixel updated!' : 'Tracking pixel created!');
        setShowModal(false);
        fetchPixels();
      } else {
        setErrorMessage(data.message || 'Failed to save pixel');
      }
    } catch (err) {
      setErrorMessage('Network connection error');
    } finally {
      setSaving(false);
    }
  };

  const getPlatformBadge = (name: string) => {
    switch (name) {
      case 'Meta Pixel':
        return { bg: 'rgba(24, 119, 242, 0.15)', color: '#1877F2', border: 'rgba(24, 119, 242, 0.3)', icon: '🟦' };
      case 'TikTok Pixel':
        return { bg: 'rgba(0, 0, 0, 0.4)', color: '#00F2FE', border: 'rgba(0, 242, 254, 0.3)', icon: '🎵' };
      case 'Google Analytics 4':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)', icon: '📊' };
      case 'Snapchat Pixel':
        return { bg: 'rgba(234, 179, 8, 0.15)', color: '#EAB308', border: 'rgba(234, 179, 8, 0.3)', icon: '👻' };
      case 'Pinterest Pixel':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.3)', icon: '📌' };
      default:
        return { bg: 'rgba(147, 51, 234, 0.15)', color: '#A855F7', border: 'rgba(147, 51, 234, 0.3)', icon: '⚙️' };
    }
  };

  const activeCount = pixels.filter(p => p.is_active === 1).length;
  const pausedCount = pixels.filter(p => p.is_active === 0).length;

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
          <Check size={18} /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
            Tracking Pixels &amp; Analytics
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8' }}>
            Manage Meta Pixel, Google Analytics 4, TikTok, Snapchat, and custom tracking codes without modifying source code.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} />
          <span>Add Tracking Pixel</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', padding: '22px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px' }}>Active Injections</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--accent-green)' }}>{activeCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Live on public storefront</div>
        </div>

        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', padding: '22px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px' }}>Paused / Inactive</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#94A3B8' }}>{pausedCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Temporarily disabled</div>
        </div>

        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', padding: '22px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px' }}>Configured Pixels</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>{pixels.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Saved in database</div>
        </div>

        <div style={{ backgroundColor: '#111827', borderRadius: 'var(--radius-lg)', padding: '22px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ color: '#94A3B8', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px' }}>Script Engine</div>
          <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--accent-green)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={18} /> Zero Hydration Lag
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Async &amp; defer enabled</div>
        </div>
      </div>

      {/* Pixels Data Table */}
      <div className="admin-table-responsive">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8', fontSize: '0.74rem', textTransform: 'uppercase', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '12px 16px' }}>Platform Name</th>
              <th style={{ padding: '12px 16px' }}>Pixel / Measurement ID</th>
              <th style={{ padding: '12px 16px' }}>Placement</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Quick Toggle</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '120px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '150px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '90px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '70px', height: '18px' }} /></td>
                  <td style={{ padding: '14px 16px' }}><div className="admin-skeleton" style={{ width: '50px', height: '24px' }} /></td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}><div className="admin-skeleton" style={{ width: '60px', height: '24px', marginLeft: 'auto' }} /></td>
                </tr>
              ))
            ) : pixels.length > 0 ? (
                pixels.map(p => {
                  const badge = getPlatformBadge(p.platform_name);
                  const isActive = p.is_active === 1;

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#FFFFFF' }}>
                      
                      {/* Platform */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.2rem' }}>{badge.icon}</span>
                          <div>
                            <div style={{ fontWeight: '700' }}>{p.platform_name}</div>
                            {p.custom_code && (
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Contains Custom Code Snippet</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Pixel ID */}
                      <td style={{ padding: '14px 18px' }}>
                        {p.pixel_id ? (
                          <span style={{
                            fontFamily: 'monospace',
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            color: 'var(--primary)',
                            fontSize: '0.85rem'
                          }}>
                            {p.pixel_id}
                          </span>
                        ) : (
                          <span style={{ color: '#64748B', fontSize: '0.8rem', fontStyle: 'italic' }}>
                            Custom Script Snippet
                          </span>
                        )}
                      </td>

                      {/* Placement */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.76rem',
                          fontFamily: 'monospace',
                          backgroundColor: p.placement === 'head' ? 'rgba(0, 160, 223, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          color: p.placement === 'head' ? 'var(--primary)' : 'var(--accent-amber)',
                          border: `1px solid ${p.placement === 'head' ? 'rgba(0, 160, 223, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`
                        }}>
                          &lt;{p.placement}&gt;
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.74rem',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          backgroundColor: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isActive ? 'var(--accent-green)' : 'var(--accent-red)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                          {isActive ? 'Active' : 'Paused'}
                        </span>
                      </td>

                      {/* Toggle Button */}
                      <td style={{ padding: '14px 18px' }}>
                        <button
                          type="button"
                          onClick={() => handleToggle(p)}
                          title={`Click to ${isActive ? 'Pause' : 'Activate'}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '5px 10px',
                            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.06)',
                            border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                            borderRadius: '6px',
                            color: isActive ? 'var(--accent-green)' : '#94A3B8',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          {isActive ? <ToggleRight size={18} color="var(--accent-green)" /> : <ToggleLeft size={18} color="#94A3B8" />}
                          <span>{isActive ? 'ON' : 'OFF'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            style={{
                              padding: '6px 10px',
                              backgroundColor: 'rgba(0, 160, 223, 0.12)',
                              border: '1px solid rgba(0, 160, 223, 0.3)',
                              borderRadius: '6px',
                              color: 'var(--primary)',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Edit3 size={14} /> Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.platform_name)}
                            style={{
                              padding: '6px 10px',
                              backgroundColor: 'rgba(239, 68, 68, 0.12)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '6px',
                              color: '#EF4444',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#64748B' }}>
                    No tracking pixels configured yet. Click &ldquo;Add Tracking Pixel&rdquo; above to set up your first pixel.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      {/* Add / Edit Modal Drawer */}
      {showModal && (
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
        }} onClick={() => setShowModal(false)}>
          <div
            style={{
              backgroundColor: '#111827',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              width: '100%',
              maxWidth: '580px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              color: '#FFFFFF',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
                  {editingPixel ? 'Edit Tracking Pixel' : 'Add New Tracking Pixel'}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                  Configure your tracking ID or custom JavaScript code.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#EF4444',
                fontSize: '0.84rem',
                fontWeight: '600',
                marginBottom: '18px'
              }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Platform Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                  Select Platform *
                </label>
                <select
                  value={formData.platform_name}
                  onChange={(e) => setFormData({ ...formData, platform_name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#1E293B',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                >
                  <option value="Meta Pixel">Meta (Facebook) Pixel</option>
                  <option value="TikTok Pixel">TikTok Pixel</option>
                  <option value="Google Analytics 4">Google Analytics 4 (GA4)</option>
                  <option value="Snapchat Pixel">Snapchat Pixel</option>
                  <option value="Pinterest Pixel">Pinterest Pixel</option>
                  <option value="Google Tag Manager">Google Tag Manager (GTM)</option>
                  <option value="Custom Script">Custom JavaScript / HTML Tag</option>
                </select>
              </div>

              {/* Pixel / Measurement ID */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                  Pixel / Measurement ID
                </label>
                <input
                  type="text"
                  placeholder={
                    formData.platform_name === 'Meta Pixel' ? 'e.g. 1084920489382109' :
                    formData.platform_name === 'Google Analytics 4' ? 'e.g. G-SAMI2026ECOM' :
                    formData.platform_name === 'TikTok Pixel' ? 'e.g. CTIKTOK992019482' :
                    formData.platform_name === 'Snapchat Pixel' ? 'e.g. SNAP-893012-TRK' :
                    formData.platform_name === 'Google Tag Manager' ? 'e.g. GTM-XXXXXX' :
                    'e.g. Platform Pixel Identifier'
                  }
                  value={formData.pixel_id}
                  onChange={(e) => setFormData({ ...formData, pixel_id: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#1E293B',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                <span style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                  Standard SDK initialization will be generated automatically from this ID.
                </span>
              </div>

              {/* Custom Script Textarea */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                  Custom Code Snippet / Raw Script (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder={`<!-- Paste custom pixel code or event triggers here -->\n<script>\n  // custom tracking logic\n</script>`}
                  value={formData.custom_code}
                  onChange={(e) => setFormData({ ...formData, custom_code: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#1E293B',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontFamily: 'monospace',
                    fontSize: '0.82rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Placement & Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                    Injection Placement
                  </label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      backgroundColor: '#1E293B',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  >
                    <option value="head">&lt;head&gt; (Standard &amp; Recommended)</option>
                    <option value="body">&lt;body&gt; (Footer / Body End)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#E2E8F0', marginBottom: '6px' }}>
                    Initial Status
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', height: '42px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', color: '#FFFFFF' }}>
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                      />
                      <span>Enable on Storefront</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                  style={{ padding: '10px 18px', fontSize: '0.88rem' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                  style={{ padding: '10px 22px', fontSize: '0.88rem' }}
                >
                  {saving ? 'Saving...' : editingPixel ? 'Update Pixel' : 'Save & Inject Pixel'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
