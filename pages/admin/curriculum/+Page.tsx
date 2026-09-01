import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../components/AdminLayout';
import { 
  Video, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, 
  Search, ChevronDown, ChevronRight, Play, Clock, FileText, 
  ExternalLink, Layers, Save, X
} from 'lucide-react';

interface Lesson {
  id: number;
  module_id: number;
  title: string;
  description: string;
  video_type: string;
  bunny_video_id: string;
  vdocipher_id: string;
  duration: string;
  attachment_path?: string;
  notes: string;
  sort_order: number;
  is_preview?: number;
}

interface Module {
  id: number;
  module_number: string;
  title: string;
  description: string;
  sort_order: number;
  lessons: Lesson[];
}

export default function AdminCurriculumPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal states
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleForm, setModuleForm] = useState({ title: '', module_number: '', description: '', sort_order: 0 });

  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    video_type: 'bunny',
    bunny_video_id: '',
    vdocipher_id: '',
    duration: '15:00',
    notes: '',
    sort_order: 0
  });

  const [saving, setSaving] = useState(false);

  const fetchCurriculum = async () => {
    const token = localStorage.getItem('sami_admin_token');
    try {
      const res = await fetch('/api/admin/curriculum', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setModules(data.modules || []);
        // Expand first 2 modules by default
        if (data.modules.length > 0 && Object.keys(expandedModules).length === 0) {
          const initialExpanded: Record<number, boolean> = {};
          data.modules.slice(0, 3).forEach((m: Module) => { initialExpanded[m.id] = true; });
          setExpandedModules(initialExpanded);
        }
      }
    } catch (err) {
      console.error('Error fetching curriculum:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const toggleModule = (id: number) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- Module Handlers ---
  const handleOpenAddModule = () => {
    setEditingModule(null);
    setModuleForm({
      title: '',
      module_number: String(modules.length + 1).padStart(2, '0'),
      description: '',
      sort_order: modules.length + 1
    });
    setModuleModalOpen(true);
  };

  const handleOpenEditModule = (mod: Module) => {
    setEditingModule(mod);
    setModuleForm({
      title: mod.title,
      module_number: mod.module_number,
      description: mod.description || '',
      sort_order: mod.sort_order
    });
    setModuleModalOpen(true);
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleForm.title.trim()) return;

    setSaving(true);
    const token = localStorage.getItem('sami_admin_token');

    try {
      const url = editingModule
        ? `/api/admin/curriculum/modules/${editingModule.id}`
        : '/api/admin/curriculum/modules';
      const method = editingModule ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(moduleForm)
      });

      const data = await res.json();
      if (data.success) {
        showToast('success', editingModule ? 'Module updated successfully!' : 'New module created!');
        setModuleModalOpen(false);
        fetchCurriculum();
      } else {
        showToast('error', data.message || 'Failed to save module');
      }
    } catch {
      showToast('error', 'Network error while saving module');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModule = async (mod: Module) => {
    if (!confirm(`Are you sure you want to delete Module "${mod.title}" and all its ${mod.lessons?.length || 0} lectures? This action cannot be undone.`)) {
      return;
    }

    const token = localStorage.getItem('sami_admin_token');
    try {
      const res = await fetch(`/api/admin/curriculum/modules/${mod.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Module and lectures deleted');
        fetchCurriculum();
      } else {
        showToast('error', data.message || 'Failed to delete module');
      }
    } catch {
      showToast('error', 'Error deleting module');
    }
  };

  // --- Lesson Handlers ---
  const handleOpenAddLesson = (moduleId: number) => {
    const mod = modules.find(m => m.id === moduleId);
    const lessonCount = mod?.lessons?.length || 0;

    setSelectedModuleId(moduleId);
    setEditingLesson(null);
    setLessonForm({
      title: '',
      description: '',
      video_type: 'bunny',
      bunny_video_id: '',
      vdocipher_id: '',
      duration: '15:00',
      notes: '',
      sort_order: lessonCount + 1
    });
    setLessonModalOpen(true);
  };

  const handleOpenEditLesson = (lesson: Lesson) => {
    setSelectedModuleId(lesson.module_id);
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description || '',
      video_type: lesson.video_type || 'bunny',
      bunny_video_id: lesson.bunny_video_id || '',
      vdocipher_id: lesson.vdocipher_id || '',
      duration: lesson.duration || '15:00',
      notes: lesson.notes || '',
      sort_order: lesson.sort_order || 0
    });
    setLessonModalOpen(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.title.trim() || !selectedModuleId) return;

    setSaving(true);
    const token = localStorage.getItem('sami_admin_token');

    try {
      const url = editingLesson
        ? `/api/admin/curriculum/lessons/${editingLesson.id}`
        : '/api/admin/curriculum/lessons';
      const method = editingLesson ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...lessonForm,
          module_id: selectedModuleId
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast('success', editingLesson ? 'Lecture updated successfully!' : 'New lecture added!');
        setLessonModalOpen(false);
        fetchCurriculum();
      } else {
        showToast('error', data.message || 'Failed to save lecture');
      }
    } catch {
      showToast('error', 'Network error while saving lecture');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (lesson: Lesson) => {
    if (!confirm(`Are you sure you want to delete lecture: "${lesson.title}"?`)) return;

    const token = localStorage.getItem('sami_admin_token');
    try {
      const res = await fetch(`/api/admin/curriculum/lessons/${lesson.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Lecture deleted');
        fetchCurriculum();
      } else {
        showToast('error', data.message || 'Failed to delete lecture');
      }
    } catch {
      showToast('error', 'Error deleting lecture');
    }
  };

  const totalLecturesCount = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);

  const filteredModules = modules.map(mod => {
    if (!searchQuery.trim()) return mod;
    const lessons = mod.lessons.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return { ...mod, lessons };
  }).filter(mod => mod.lessons.length > 0 || !searchQuery.trim());

  return (
    <AdminLayout>
      <div style={{ padding: '24px 32px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="badge-pill badge-cyan" style={{ fontSize: '0.75rem' }}>WEB LMS CURRICULUM CMS</span>
              <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>&bull; Real-time sync with Student Portal</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
              Course Modules & Video Lectures
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', marginTop: '4px' }}>
              Manage curriculum structure, update Bunny Stream / VdoCipher DRM video IDs, and add lesson notes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleOpenAddModule}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontWeight: 700, borderRadius: '8px' }}
            >
              <Plus size={18} />
              <span>Add New Module</span>
            </button>

            <a
              href="/lms"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontWeight: 600, borderRadius: '8px', textDecoration: 'none', color: '#FFFFFF' }}
            >
              <ExternalLink size={16} />
              <span>Preview Live LMS</span>
            </a>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div
            style={{
              padding: '14px 20px',
              borderRadius: '8px',
              marginBottom: '20px',
              backgroundColor: notification.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${notification.type === 'success' ? 'var(--accent-green)' : '#EF4444'}`,
              color: notification.type === 'success' ? '#A7F3D0' : '#FECACA',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Stats Metrics & Search Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Total Modules</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>{modules.length}</div>
          </div>
          <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Total HD Lectures</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>{totalLecturesCount}</div>
          </div>
          <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>Student Access Mode</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-green)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-green)' }} />
              Direct Web LMS
            </div>
          </div>
        </div>

        {/* Search filter */}
        <div style={{ marginBottom: '20px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input
            type="text"
            placeholder="Search modules or lectures by title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 14px 12px 42px', backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '8px', color: '#FFFFFF', fontSize: '0.95rem', outline: 'none' }}
          />
        </div>

        {/* MODULES & LESSONS LIST */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid rgba(0, 160, 223, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }} />
            <span>Loading course curriculum...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredModules.map(mod => {
              const isExpanded = expandedModules[mod.id];

              return (
                <div
                  key={mod.id}
                  style={{
                    backgroundColor: '#111827',
                    border: '1px solid #1F2937',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Module Card Header */}
                  <div
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                      backgroundColor: '#161F30',
                      borderBottom: isExpanded ? '1px solid #1F2937' : 'none'
                    }}
                  >
                    <div
                      onClick={() => toggleModule(mod.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
                    >
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: '#000000', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
                        {mod.module_number}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#FFFFFF' }}>
                          {mod.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                          {mod.lessons?.length || 0} Lectures &bull; {mod.description || 'No description'}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenAddLesson(mod.id)}
                        className="btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700, borderRadius: '6px', color: 'var(--primary)', borderColor: 'rgba(0, 160, 223, 0.4)' }}
                      >
                        <Plus size={15} />
                        <span>Add Lecture</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditModule(mod)}
                        title="Edit Module"
                        style={{ background: 'none', border: '1px solid #374151', color: '#94A3B8', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <Edit2 size={15} />
                      </button>

                      <button
                        onClick={() => handleDeleteModule(mod)}
                        title="Delete Module"
                        style={{ background: 'none', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#EF4444', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <Trash2 size={15} />
                      </button>

                      <button
                        onClick={() => toggleModule(mod.id)}
                        style={{ background: 'none', border: 'none', color: '#94A3B8', padding: '6px', cursor: 'pointer' }}
                      >
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Lessons Table */}
                  {isExpanded && (
                    <div style={{ padding: '12px 16px' }}>
                      {mod.lessons && mod.lessons.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {mod.lessons.map((lesson, idx) => (
                            <div
                              key={lesson.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '12px',
                                padding: '12px 16px',
                                backgroundColor: '#0B0F19',
                                border: '1px solid #1F2937',
                                borderRadius: '8px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                <div style={{ color: 'var(--primary)', opacity: 0.7 }}>
                                  <Play size={16} />
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFFFFF' }}>
                                    {idx + 1}. {lesson.title}
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
                                    <span>Duration: {lesson.duration || '15:00'}</span>
                                    <span>Type: <strong style={{ color: '#E2E8F0' }}>{lesson.video_type || 'bunny'}</strong></span>
                                    {lesson.bunny_video_id && <span>Bunny ID: <code style={{ color: '#38BDF8' }}>{lesson.bunny_video_id}</code></span>}
                                    {lesson.vdocipher_id && <span>VdoCipher ID: <code style={{ color: 'var(--accent-green)' }}>{lesson.vdocipher_id}</code></span>}
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                  onClick={() => handleOpenEditLesson(lesson)}
                                  className="btn btn-outline"
                                  style={{ padding: '6px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '6px' }}
                                >
                                  <Edit2 size={14} />
                                  <span>Edit</span>
                                </button>

                                <button
                                  onClick={() => handleDeleteLesson(lesson)}
                                  style={{ background: 'none', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#EF4444', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '24px', color: '#64748B', fontSize: '0.9rem' }}>
                          No lectures in this module yet. Click <strong>"Add Lecture"</strong> above to add your first video lecture.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL: ADD / EDIT MODULE */}
        {moduleModalOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
            <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '16px', maxWidth: '540px', width: '100%', padding: '28px', color: '#FFFFFF', boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  {editingModule ? 'Edit Curriculum Module' : 'Add New Curriculum Module'}
                </h3>
                <button onClick={() => setModuleModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveModule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '6px' }}>
                    Module Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Setting Up Shopify for UAE/KSA"
                    value={moduleForm.title}
                    onChange={e => setModuleForm({ ...moduleForm, title: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid #374151', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '6px' }}>
                      Module Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 01"
                      value={moduleForm.module_number}
                      onChange={e => setModuleForm({ ...moduleForm, module_number: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid #374151', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '6px' }}>
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={moduleForm.sort_order}
                      onChange={e => setModuleForm({ ...moduleForm, sort_order: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid #374151', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '6px' }}>
                    Module Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of what students will master in this module..."
                    value={moduleForm.description}
                    onChange={e => setModuleForm({ ...moduleForm, description: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid #374151', borderRadius: '6px', color: '#FFFFFF', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setModuleModalOpen(false)}
                    className="btn btn-outline"
                    style={{ padding: '10px 18px', borderRadius: '6px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', borderRadius: '6px', fontWeight: 700 }}
                  >
                    {saving ? 'Saving...' : 'Save Module'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT LESSON */}
        {lessonModalOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
            <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '16px', maxWidth: '600px', width: '100%', padding: '28px', color: '#FFFFFF', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  {editingLesson ? 'Edit Video Lecture' : 'Add New Video Lecture'}
                </h3>
                <button onClick={() => setLessonModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveLesson} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '6px' }}>
                    Parent Module *
                  </label>
                  <select
                    value={selectedModuleId || ''}
                    onChange={e => setSelectedModuleId(Number(e.target.value))}
                    required
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid #374151', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                  >
                    {modules.map(m => (
                      <option key={m.id} value={m.id}>
                        Module {m.module_number}: {m.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '6px' }}>
                    Lecture Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Finding Winning High-Margin Products in Dubai"
                    value={lessonForm.title}
                    onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid #374151', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '6px' }}>
                      Streaming Provider
                    </label>
                    <select
                      value={lessonForm.video_type}
                      onChange={e => setLessonForm({ ...lessonForm, video_type: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid #374151', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                    >
                      <option value="bunny">Bunny Stream (Fast CDN)</option>
                      <option value="vdocipher">VdoCipher (Strict DRM)</option>
                      <option value="direct">Direct Stream / Embed</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '6px' }}>
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 18:30"
                      value={lessonForm.duration}
                      onChange={e => setLessonForm({ ...lessonForm, duration: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid #374151', borderRadius: '6px', color: '#FFFFFF', outline: 'none' }}
                    />
                  </div>
                </div>

                {lessonForm.video_type === 'bunny' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '6px' }}>
                      Bunny Video ID / GUID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 8d39f4e2-892b-4fa8-b271-9f9312019482"
                      value={lessonForm.bunny_video_id}
                      onChange={e => setLessonForm({ ...lessonForm, bunny_video_id: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid #374151', borderRadius: '6px', color: '#FFFFFF', outline: 'none', fontFamily: 'monospace' }}
                    />
                  </div>
                )}

                {lessonForm.video_type === 'vdocipher' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '6px' }}>
                      VdoCipher Video OTP / ID
                    </label>
                    <input
                      type="text"
                      placeholder="VdoCipher Video ID"
                      value={lessonForm.vdocipher_id}
                      onChange={e => setLessonForm({ ...lessonForm, vdocipher_id: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid #374151', borderRadius: '6px', color: '#FFFFFF', outline: 'none', fontFamily: 'monospace' }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '6px' }}>
                    Lecture Summary & Action Steps
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description shown to students under the video player..."
                    value={lessonForm.description}
                    onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid #374151', borderRadius: '6px', color: '#FFFFFF', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '6px' }}>
                    Instructor Key Notes / Takeaways
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Key bullet points and practical implementation takeaways..."
                    value={lessonForm.notes}
                    onChange={e => setLessonForm({ ...lessonForm, notes: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#0B0F19', border: '1px solid #374151', borderRadius: '6px', color: '#FFFFFF', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setLessonModalOpen(false)}
                    className="btn btn-outline"
                    style={{ padding: '10px 18px', borderRadius: '6px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary"
                    style={{ padding: '10px 20px', borderRadius: '6px', fontWeight: 700 }}
                  >
                    {saving ? 'Saving...' : 'Save Lecture'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
