import React, { useState, useEffect } from 'react';
import { 
  Play, CheckCircle, Check, ChevronDown, ChevronRight, Download, 
  ExternalLink, Search, Menu, X, ArrowLeft, ArrowRight, Shield, ShieldAlert,
  MessageCircle, Video, FileText, Calculator, LogOut, Award, Clock, BookOpen, GraduationCap
} from 'lucide-react';
import { LmsSecurityGuard } from '../../components/LmsSecurityGuard';
import { DynamicWatermark } from '../../components/DynamicWatermark';
import { LmsSecurityAlertBanner } from '../../components/LmsSecurityAlertBanner';
import { LmsStrikeWarningModal } from '../../components/LmsStrikeWarningModal';
import { LmsSuspensionScreen } from '../../components/LmsSuspensionScreen';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  is_completed: boolean;
  is_preview?: boolean;
}

interface Module {
  id: number;
  module_number: string;
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  lessons: Lesson[];
}

interface ActiveLessonData {
  id: number;
  moduleId: number;
  moduleNumber: string;
  moduleTitle: string;
  title: string;
  description: string;
  videoType: string;
  bunnyVideoId: string;
  vdocipherId: string;
  duration: string;
  attachmentPath?: string;
  notes: string;
  isCompleted: boolean;
}

interface WatermarkData {
  studentName: string;
  studentEmail: string;
  ip: string;
  timestamp: string;
  displayString: string;
}

export default function StudentLmsPage() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [curriculum, setCurriculum] = useState<Module[]>([]);
  const [stats, setStats] = useState({ totalLessons: 36, completedLessons: 0, progressPercentage: 0 });
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [lessonData, setLessonData] = useState<ActiveLessonData | null>(null);
  const [navigation, setNavigation] = useState<{ prevLesson: any; nextLesson: any }>({ prevLesson: null, nextLesson: null });
  const [watermark, setWatermark] = useState<WatermarkData | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [downloads, setDownloads] = useState<any[]>([]);
  const [mentorshipLinks, setMentorshipLinks] = useState<any[]>([]);

  // Anti-Piracy 2-Strike Enforcement State
  const [isSuspended, setIsSuspended] = useState(false);
  const [suspendedReason, setSuspendedReason] = useState('Multiple unauthorized screenshot or screen recording attempts detected (2/2 strikes)');
  const [adminWhatsApp, setAdminWhatsApp] = useState('+92 333 0093269');
  const [whatsappGroupUrl, setWhatsappGroupUrl] = useState('https://chat.whatsapp.com/sami-mentorship-mastermind');
  const [strikeModalOpen, setStrikeModalOpen] = useState(false);
  const [strikeCount, setStrikeCount] = useState(0);
  const [lastStrikeInfo, setLastStrikeInfo] = useState({ type: 'screenshot', ip: '127.0.0.1', timestamp: new Date().toLocaleString() });

  // UI state
  const [activeTab, setActiveTab] = useState<'notes' | 'downloads' | 'coaching'>('notes');
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [markingProgress, setMarkingProgress] = useState(false);

  // 1. Initial Load: Check Auth & Fetch LMS Dashboard + Curriculum
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const initLMS = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch Dashboard
        const dashRes = await fetch('/api/lms/dashboard', { headers });
        if (dashRes.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        const dashData = await dashRes.json();

        // 1. Calculate highest strike count between backend and client storage
        const backendStrikes = dashData.student?.security_strikes || (dashData.isSuspended ? 3 : 0);
        const localStrikes = Number(typeof window !== 'undefined' ? (localStorage.getItem('lms_local_strikes') || '0') : '0');
        const effectiveStrikes = Math.max(backendStrikes, localStrikes);

        // 2. Check if Admin has explicitly approved and unlocked the student
        const isOfficiallyUnlockedByAdmin = dashData.success && !dashData.isSuspended && dashData.student?.status === 'active' && (!dashData.student?.security_strikes || dashData.student?.security_strikes === 0);

        if (isOfficiallyUnlockedByAdmin) {
          // Admin has cleared the student -> Reset strikes to 0 and allow entry
          localStorage.removeItem('lms_is_suspended');
          localStorage.removeItem('lms_local_strikes');
          setStrikeCount(0);
          setIsSuspended(false);
        } else if (effectiveStrikes >= 3 || dashData.isSuspended || dashData.student?.status === 'suspended' || localStorage.getItem('lms_is_suspended') === 'true') {
          // 3. STUDENT IS BANNED (3 Strikes reached) -> LOCKOUT SCREEN!
          localStorage.setItem('lms_is_suspended', 'true');
          localStorage.setItem('lms_local_strikes', '3');
          setStrikeCount(3);
          setIsSuspended(true);
          setStudent(dashData.student || JSON.parse(localStorage.getItem('user') || '{}'));
          setSuspendedReason(dashData.suspendedReason || 'Account blocked due to multiple unauthorized screenshot or screen recording attempts (3/3 strikes)');
          if (dashData.adminWhatsApp) {
            setAdminWhatsApp(dashData.adminWhatsApp);
          }

          // Re-sync with backend if backend didn't have suspended flag yet
          if (!dashData.isSuspended) {
            fetch('/api/lms/security-strike', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ eventType: 'suspension_enforcement', details: 'Persistent 3-strike lockout' })
            }).catch(() => {});
          }

          setLoading(false);
          return;
        } else {
          // 4. Student has 1 or 2 strikes -> PRESERVE STRIKES ACROSS REFRESH (DO NOT RESET TO 0)
          if (effectiveStrikes > 0) {
            localStorage.setItem('lms_local_strikes', String(effectiveStrikes));
            setStrikeCount(effectiveStrikes);
          }
          setIsSuspended(false);
        }

        if (dashData.success) {
          setStudent(dashData.student);
          setAnnouncement(dashData.announcement);
          setDownloads(dashData.downloads || []);
          setMentorshipLinks(dashData.mentorshipLinks || []);
          if (dashData.adminWhatsApp) {
            setAdminWhatsApp(dashData.adminWhatsApp);
          }
          if (dashData.whatsappGroupUrl) {
            setWhatsappGroupUrl(dashData.whatsappGroupUrl);
          }
        }

        // Fetch Curriculum
        const curRes = await fetch('/api/lms/curriculum', { headers });
        const curData = await curRes.json();

        if (curData.success) {
          setCurriculum(curData.curriculum);
          setStats(curData.stats);

          // Expand first module by default
          if (curData.curriculum.length > 0) {
            setExpandedModules({ [curData.curriculum[0].id]: true });
          }

          // Pick recommended lesson
          const targetLessonId = dashData.course?.nextLessonId || (curData.curriculum[0]?.lessons[0]?.id ?? 1);
          setActiveLessonId(targetLessonId);
          await loadLesson(targetLessonId, token);
        }
      } catch (err) {
        console.error('Error loading LMS:', err);
      } finally {
        setLoading(false);
      }
    };

    initLMS();
  }, []);

  // 1.1 Handle Anti-Piracy Security Violation (Screenshot / Screen Recording / DevTools)
  const handleSecurityViolation = async (eventType: string, details?: string) => {
    if (isSuspended || (typeof window !== 'undefined' && localStorage.getItem('lms_is_suspended') === 'true')) {
      setIsSuspended(true);
      return;
    }

    // 1. Increment Strike Count from stored state
    const prevLocal = Number(localStorage.getItem('lms_local_strikes') || '0');
    const currentLocal = prevLocal + 1;
    localStorage.setItem('lms_local_strikes', String(currentLocal));
    setStrikeCount(currentLocal);
    setLastStrikeInfo({
      type: eventType,
      ip: watermark?.ip || '127.0.0.1',
      timestamp: new Date().toLocaleString()
    });

    // Close any previous open modal
    setStrikeModalOpen(false);

    // 2. If 3rd strike reached -> Immediate Instant Permanent Ban!
    if (currentLocal >= 3) {
      localStorage.setItem('lms_is_suspended', 'true');
      localStorage.setItem('lms_local_strikes', '3');
      setIsSuspended(true);
      setSuspendedReason('Account blocked due to multiple unauthorized screenshot or screen recording attempts (3/3 strikes)');
    } else {
      // Strike 1 or Strike 2 -> Open Warning Modal
      setTimeout(() => {
        setStrikeModalOpen(true);
      }, 30);
    }

    // 3. Synchronize strike with backend database
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await fetch('/api/lms/security-strike', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ eventType, details })
        });

        const data = await res.json();
        if (data.success) {
          if (data.isSuspended || data.strikeCount >= 3) {
            localStorage.setItem('lms_is_suspended', 'true');
            localStorage.setItem('lms_local_strikes', '3');
            setIsSuspended(true);
            setSuspendedReason(data.suspendedReason || 'Account blocked due to multiple unauthorized screenshot or screen recording attempts (3/3 strikes)');
            if (data.adminWhatsApp) {
              setAdminWhatsApp(data.adminWhatsApp);
            }
          }
        }
      } catch (err) {
        console.error('Error syncing security strike with backend:', err);
      }
    }
  };

  // 2. Load Single Lesson Playback
  const loadLesson = async (lessonId: number, tokenOverride?: string) => {
    const token = tokenOverride || localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`/api/lms/lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setLessonData(data.lesson);
        setNavigation(data.navigation);
        setWatermark(data.watermark);
        setActiveLessonId(lessonId);

        // Auto expand module containing this lesson
        setExpandedModules(prev => ({
          ...prev,
          [data.lesson.moduleId]: true
        }));
      }
    } catch (err) {
      console.error('Error fetching lesson:', err);
    }
  };

  // Toggle Module Accordion
  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Mark Lesson Complete / Incomplete
  const handleToggleComplete = async () => {
    if (!activeLessonId || markingProgress) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const newStatus = !lessonData?.isCompleted;
    setMarkingProgress(true);

    try {
      const res = await fetch('/api/lms/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          lessonId: activeLessonId,
          completed: newStatus
        })
      });

      const data = await res.json();
      if (data.success) {
        // Update local lesson state
        if (lessonData) {
          setLessonData({ ...lessonData, isCompleted: newStatus });
        }

        // Update curriculum list state
        setCurriculum(prev => prev.map(mod => ({
          ...mod,
          lessons: mod.lessons.map(l => l.id === activeLessonId ? { ...l, is_completed: newStatus } : l)
        })));

        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Error toggling completion:', err);
    } finally {
      setMarkingProgress(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0B0F19', color: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid rgba(0, 160, 223, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#94A3B8' }}>Loading Your VIP Classroom...</h3>
      </div>
    );
  }

  // 1. Permanent Account Suspension Lockdown Screen (Strike 2 Triggered)
  if (isSuspended) {
    return (
      <LmsSuspensionScreen
        studentName={student?.name || 'Enrolled Student'}
        studentEmail={student?.email || ''}
        studentId={String(student?.id || 1).padStart(4, '0')}
        ip={watermark?.ip || lastStrikeInfo.ip || '127.0.0.1'}
        suspendedReason={suspendedReason}
        adminWhatsApp={adminWhatsApp}
        onLogout={handleLogout}
      />
    );
  }

  // Filter curriculum based on search query
  const filteredCurriculum = curriculum.map(mod => {
    if (!searchQuery.trim()) return mod;
    const filteredLessons = mod.lessons.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return {
      ...mod,
      lessons: filteredLessons
    };
  }).filter(mod => mod.lessons.length > 0);

  return (
    <LmsSecurityGuard enabled={!isSuspended} onSecurityViolation={handleSecurityViolation}>
      {/* Strike 1 Warning Modal (High Alert Notice) */}
      <LmsStrikeWarningModal
        isOpen={strikeModalOpen}
        onClose={() => setStrikeModalOpen(false)}
        strikeCount={strikeCount || 1}
        studentName={student?.name || 'Enrolled Student'}
        studentEmail={student?.email || ''}
        studentId={String(student?.id || 1).padStart(4, '0')}
        ip={lastStrikeInfo.ip || watermark?.ip || '127.0.0.1'}
        timestamp={lastStrikeInfo.timestamp}
      />

      <div style={{ minHeight: '100vh', backgroundColor: '#0B0F19', color: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
        
        {/* TOP VIP LMS HEADER BAR */}
        <header style={{
          height: '64px',
          backgroundColor: '#111827',
          borderBottom: '1px solid #1F2937',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(8px, 2vw, 20px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Left: Hamburger & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flexShrink: 1 }}>
            {/* Mobile & Tablet Curriculum Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="d-lg-none"
              aria-label="Open Course Curriculum"
              style={{
                width: '34px',
                height: '34px',
                background: '#1F2937',
                border: '1px solid #374151',
                color: '#FFFFFF',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Brand Logo */}
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#FFFFFF', minWidth: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--primary), #0077B6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1rem',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0, 160, 223, 0.3)'
              }}>
                S
              </div>
              <div style={{ lineHeight: 1.15, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 'clamp(0.82rem, 1.8vw, 0.94rem)', letterSpacing: '-0.02em', whiteSpace: 'nowrap', color: '#F8FAFC' }}>
                  ECOM WITH SAMI
                </div>
                <div className="d-none d-sm-block" style={{ fontSize: '0.64rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.04em' }}>
                  VIP CLASSROOM LMS
                </div>
              </div>
            </a>
          </div>

          {/* Center: Slim Desktop Progress Pill */}
          <div
            className="d-none d-md-flex"
            style={{
              height: '36px',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#111827',
              padding: '0 14px',
              borderRadius: '8px',
              border: '1px solid #1F2937',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
              flexShrink: 0
            }}
          >
            <GraduationCap size={15} color="var(--primary)" />
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Progress:</span>
              <strong style={{ color: '#FFFFFF' }}>{stats.completedLessons}</strong>
              <span style={{ color: '#64748B' }}>/{stats.totalLessons}</span>
            </div>
            <div style={{ width: '70px', height: '5px', backgroundColor: '#1E293B', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${stats.progressPercentage}%`, background: 'linear-gradient(90deg, #00A0DF, #10B981)', transition: 'width 0.4s ease' }} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#10B981' }}>{stats.progressPercentage}%</span>
          </div>

          {/* Right Group: Mobile progress pill + WhatsApp + Profile + Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {/* Compact Mobile Progress Pill (shown only on < 768px) */}
            <div
              className="d-md-none"
              style={{
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#111827',
                padding: '0 8px',
                borderRadius: '6px',
                border: '1px solid #1F2937',
                fontSize: '0.72rem',
                fontWeight: 700,
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ color: '#94A3B8' }}>{stats.completedLessons}/{stats.totalLessons}</span>
              <span style={{ color: '#10B981' }}>({stats.progressPercentage}%)</span>
            </div>

            {/* VIP WhatsApp Link */}
            <a
              href={whatsappGroupUrl || 'https://chat.whatsapp.com/sami-mentorship-mastermind'}
              target="_blank"
              rel="noopener noreferrer"
              className="d-none d-sm-flex"
              style={{
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--accent-green)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0 10px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              <MessageCircle size={14} />
              <span className="d-none d-md-inline">VIP WhatsApp</span>
            </a>

            {/* Live Security Strike Badge */}
            <div
              style={{
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0 10px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 800,
                backgroundColor: strikeCount === 0 ? 'rgba(16, 185, 129, 0.12)' : strikeCount === 1 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.2)',
                color: strikeCount === 0 ? 'var(--accent-green)' : strikeCount === 1 ? '#F59E0B' : '#EF4444',
                border: strikeCount === 0 ? '1px solid rgba(16, 185, 129, 0.3)' : strikeCount === 1 ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(239, 68, 68, 0.5)'
              }}
              title="Anti-Piracy Strike Monitor (Max 3 strikes allowed)"
            >
              <ShieldAlert size={14} />
              <span>{strikeCount}/3 Strikes</span>
            </div>

            {/* Student Profile Pill */}
            <div style={{
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 8px',
              background: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.72rem',
                color: '#FFFFFF',
                flexShrink: 0
              }}>
                {student?.name ? student.name[0].toUpperCase() : 'S'}
              </div>
              <div className="d-none d-md-block" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#F8FAFC', whiteSpace: 'nowrap' }}>
                {student?.name || 'Student'}
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              style={{
                height: '34px',
                background: 'transparent',
                border: '1px solid #374151',
                color: '#94A3B8',
                padding: '0 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              <LogOut size={14} />
              <span className="d-none d-md-inline">Logout</span>
            </button>
          </div>
        </header>

        {/* TOP SECURITY ANNOUNCEMENT & ANTI-PIRACY ROLLING TICKER BAR */}
        <LmsSecurityAlertBanner
          studentName={student?.name}
          studentEmail={student?.email}
          ip={watermark?.ip}
        />

        {/* Announcement Banner */}
        {announcement && (
          <div style={{ backgroundColor: 'rgba(0, 160, 223, 0.1)', borderBottom: '1px solid rgba(0, 160, 223, 0.2)', padding: '8px 16px', fontSize: '0.82rem', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '6px' }}>
            <span>📢 {announcement}</span>
          </div>
        )}

        {/* MAIN LMS CLASSROOM VIEW WITH RESPONSIVE LAYOUT */}
        <div className="lms-layout-wrap">
          
          {/* LEFT CURRICULUM SIDEBAR (DESKTOP STICKY & TABLET/MOBILE OFF-CANVAS DRAWER) */}
          <aside className={`lms-sidebar-drawer ${mobileMenuOpen ? 'drawer-open' : ''}`}>
            
            {/* Drawer Top Header (Shown on Mobile / Tablet) */}
            <div className="d-lg-none" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid #1F2937',
              backgroundColor: '#0B0F19'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.92rem', color: '#FFFFFF' }}>
                <BookOpen size={18} color="var(--primary)" />
                <span>COURSE CURRICULUM</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <X size={15} /> Close
              </button>
            </div>

            {/* Sidebar Search Header */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #1F2937' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>11 MODULES INDEX</span>
                <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: '#1F2937', color: 'var(--primary)', fontWeight: 700 }}>
                  {stats.completedLessons}/{stats.totalLessons} Done
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="text"
                  placeholder="Search 36 lectures..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px 8px 30px', backgroundColor: '#0B0F19', border: '1px solid #374151', borderRadius: '6px', color: '#FFFFFF', fontSize: '0.82rem', outline: 'none' }}
                />
              </div>
            </div>

            {/* Modules & Lessons Scrollable Accordion */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
              {filteredCurriculum.map(module => {
                const isExpanded = expandedModules[module.id];
                const isModuleFinished = module.completedLessons === module.totalLessons && module.totalLessons > 0;

                return (
                  <div key={module.id} style={{ borderBottom: '1px solid #1F2937' }}>
                    {/* Module Accordion Header */}
                    <button
                      type="button"
                      onClick={() => toggleModule(module.id)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'transparent',
                        border: 'none',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          backgroundColor: isModuleFinished ? 'rgba(16, 185, 129, 0.15)' : '#1F2937',
                          color: isModuleFinished ? 'var(--accent-green)' : '#94A3B8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          flexShrink: 0
                        }}>
                          {isModuleFinished ? <Check size={14} /> : module.module_number}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#E2E8F0', lineHeight: 1.3 }}>
                            {module.title}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                            {module.completedLessons}/{module.totalLessons} Completed
                          </div>
                        </div>
                      </div>
                      <div style={{ color: '#64748B', flexShrink: 0 }}>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </div>
                    </button>

                    {/* Lessons list inside module */}
                    {isExpanded && (
                      <div style={{ backgroundColor: '#0B0F19', padding: '2px 0' }}>
                        {module.lessons.map(lesson => {
                          const isActive = lesson.id === activeLessonId;

                          return (
                            <button
                              key={lesson.id}
                              type="button"
                              onClick={() => {
                                loadLesson(lesson.id);
                                setMobileMenuOpen(false);
                                if (typeof window !== 'undefined') {
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                              }}
                              style={{
                                width: '100%',
                                padding: '10px 14px 10px 28px',
                                background: isActive ? 'rgba(0, 160, 223, 0.12)' : 'transparent',
                                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                                borderTop: 'none',
                                borderRight: 'none',
                                borderBottom: 'none',
                                color: isActive ? 'var(--primary)' : '#CBD5E1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'background 0.2s ease'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, paddingRight: '8px' }}>
                                {lesson.is_completed ? (
                                  <CheckCircle size={15} color="var(--accent-green)" style={{ flexShrink: 0 }} />
                                ) : (
                                  <Play size={13} style={{ opacity: isActive ? 1 : 0.6, flexShrink: 0 }} />
                                )}
                                <span style={{ fontSize: '0.8rem', fontWeight: isActive ? 700 : 500, lineHeight: 1.3 }}>
                                  {lesson.title}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.7rem', color: '#64748B', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                {lesson.duration}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Backdrop Overlay for Mobile & Tablet Drawer */}
          {mobileMenuOpen && (
            <div
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(4px)',
                zIndex: 99990
              }}
            />
          )}

          {/* Floating Mobile & Tablet Curriculum Pill Trigger */}
          <button
            type="button"
            className="lms-floating-curriculum-trigger"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Course Modules Menu"
          >
            <BookOpen size={17} />
            <span>Curriculum ({stats.completedLessons}/{stats.totalLessons})</span>
          </button>

          {/* RIGHT LECTURE CONTENT AREA (100% RESPONSIVE) */}
          <main className="lms-main-content">
            
            {lessonData ? (
              <div>
                {/* Lesson Header Navigation Path & Meta */}
                <div className="lms-lesson-meta">
                  <div className="lms-lesson-path">
                    <span style={{ backgroundColor: 'rgba(0, 160, 223, 0.15)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '0.74rem' }}>
                      MODULE {lessonData.moduleNumber}
                    </span>
                    <span>&bull;</span>
                    <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{lessonData.moduleTitle}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#111827', padding: '3px 8px', borderRadius: '6px', border: '1px solid #1F2937' }}>
                      <Clock size={13} color="var(--accent-amber)" />
                      <span>{lessonData.duration}</span>
                    </span>
                    {lessonData.isCompleted && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.25)', fontWeight: 700 }}>
                        <CheckCircle size={13} />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                </div>

                <h1 className="lms-lesson-title">
                  {lessonData.title}
                </h1>

                {/* 16:9 SECURE VIDEO PLAYER CONTAINER WITH DYNAMIC DRM WATERMARK */}
                <div className="lms-video-wrapper">
                  {/* Dynamic Moving Watermark Overlay */}
                  {watermark && (
                    <DynamicWatermark
                      studentName={watermark.studentName}
                      studentEmail={watermark.studentEmail}
                      ip={watermark.ip}
                    />
                  )}

                  {/* Video Player Source */}
                  <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    {lessonData.vdocipherId ? (
                      // 1. VdoCipher Encrypted DRM Player
                      <iframe
                        src={`https://player.vdocipher.com/v2/?otp=${lessonData.vdocipherId}`}
                        style={{ width: '100%', height: '100%', border: 0 }}
                        allow="encrypted-media; autoplay; fullscreen"
                        allowFullScreen
                      />
                    ) : lessonData.bunnyVideoId ? (
                      // 2. Bunny Stream Player
                      <iframe
                        src={`https://iframe.mediadelivery.net/embed/400877/${lessonData.bunnyVideoId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`}
                        loading="lazy"
                        style={{ border: 0, width: '100%', height: '100%' }}
                        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                        allowFullScreen
                      />
                    ) : (
                      // 3. Fallback High Definition Video Canvas
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)', color: '#94A3B8', padding: '16px', textAlign: 'center' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(0, 160, 223, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                          <Video size={28} />
                        </div>
                        <h4 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '4px', fontSize: '1rem' }}>{lessonData.title}</h4>
                        <p style={{ fontSize: '0.82rem', maxWidth: '420px', color: '#94A3B8' }}>
                          Lecture streaming is active. Video duration: {lessonData.duration}.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* RESPONSIVE TOUCH ACTION NAVIGATION DECK (PREVIOUS / COMPLETE / NEXT) */}
                <div className="lms-action-deck">
                  
                  {/* Previous Lesson Button */}
                  <button
                    type="button"
                    disabled={!navigation.prevLesson}
                    onClick={() => navigation.prevLesson && loadLesson(navigation.prevLesson.id)}
                    className="lms-btn-nav lms-btn-nav-prev"
                    title={navigation.prevLesson ? `Previous: ${navigation.prevLesson.title}` : 'No previous lecture'}
                  >
                    <ArrowLeft size={16} />
                    <span>Previous Lecture</span>
                  </button>

                  {/* Mark as Complete Toggle (Primary Centerpiece) */}
                  <button
                    type="button"
                    onClick={handleToggleComplete}
                    disabled={markingProgress}
                    className={`lms-btn-complete-center ${lessonData.isCompleted ? 'lms-btn-completed-done' : 'lms-btn-complete-active'}`}
                  >
                    {lessonData.isCompleted ? (
                      <>
                        <CheckCircle size={18} />
                        <span>Completed (Click to Re-watch)</span>
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        <span>Mark as Completed</span>
                      </>
                    )}
                  </button>

                  {/* Next Lesson Button */}
                  <button
                    type="button"
                    disabled={!navigation.nextLesson}
                    onClick={() => navigation.nextLesson && loadLesson(navigation.nextLesson.id)}
                    className="lms-btn-nav lms-btn-nav-next"
                    title={navigation.nextLesson ? `Next: ${navigation.nextLesson.title}` : 'Course completed!'}
                  >
                    <span>Next Lecture</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Sub-Player Anti-Piracy DRM Security Status Strip */}
                <div className="lms-security-strip">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Shield size={14} color="#EF4444" style={{ flexShrink: 0 }} />
                    <span>
                      <strong style={{ color: '#FFFFFF' }}>Encrypted DRM Protection:</strong> Screen recording, capturing screenshots, or account sharing results in immediate account suspension.
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                    Student: #{student?.id || 'VIP'}-{watermark?.ip || 'SECURE'}
                  </div>
                </div>

                {/* TABBED RESOURCES, NOTES & MENTORSHIP */}
                <div style={{ backgroundColor: '#111827', borderRadius: '14px', border: '1px solid #1F2937', overflow: 'hidden' }}>
                  
                  {/* Tabs Header with Smooth Horizontal Swipe */}
                  <div className="lms-tab-scroll">
                    <button
                      type="button"
                      onClick={() => setActiveTab('notes')}
                      className="lms-tab-btn"
                      style={{
                        borderBottom: activeTab === 'notes' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                        color: activeTab === 'notes' ? 'var(--primary)' : '#94A3B8',
                        backgroundColor: activeTab === 'notes' ? 'rgba(0, 160, 223, 0.08)' : 'transparent'
                      }}
                    >
                      <FileText size={17} />
                      <span>Lecture Notes &amp; Blueprint</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('downloads')}
                      className="lms-tab-btn"
                      style={{
                        borderBottom: activeTab === 'downloads' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                        color: activeTab === 'downloads' ? 'var(--primary)' : '#94A3B8',
                        backgroundColor: activeTab === 'downloads' ? 'rgba(0, 160, 223, 0.08)' : 'transparent'
                      }}
                    >
                      <Download size={17} />
                      <span>Downloads ({downloads.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('coaching')}
                      className="lms-tab-btn"
                      style={{
                        borderBottom: activeTab === 'coaching' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                        color: activeTab === 'coaching' ? 'var(--primary)' : '#94A3B8',
                        backgroundColor: activeTab === 'coaching' ? 'rgba(0, 160, 223, 0.08)' : 'transparent'
                      }}
                    >
                      <Video size={17} />
                      <span>Live Mentorship &amp; Zoom</span>
                    </button>
                  </div>

                  {/* Tab 1: Notes & Description */}
                  {activeTab === 'notes' && (
                    <div style={{ padding: '22px 18px', color: '#E2E8F0', lineHeight: 1.7 }}>
                      <h4 style={{ fontWeight: 800, color: '#FFFFFF', marginBottom: '10px', fontSize: '1.1rem' }}>Overview</h4>
                      <p style={{ color: '#94A3B8', fontSize: '0.9rem', whiteSpace: 'pre-line', marginBottom: '20px' }}>
                        {lessonData.description || 'In this lecture, we cover the exact operational blueprint, tools, and execution methodology to master UAE & KSA dropshipping cash flow.'}
                      </p>

                      {lessonData.notes && (
                        <div style={{ backgroundColor: '#0B0F19', border: '1px solid #1F2937', borderRadius: '8px', padding: '16px', marginBottom: '18px' }}>
                          <h5 style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: '6px', fontSize: '0.92rem' }}>Instructor Key Takeaways</h5>
                          <div style={{ whiteSpace: 'pre-line', color: '#CBD5E1', fontSize: '0.88rem' }}>
                            {lessonData.notes}
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '16px' }}>
                        <div style={{ background: '#0B0F19', padding: '14px', borderRadius: '8px', border: '1px solid #1F2937' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.84rem', marginBottom: '4px' }}>
                            <Clock size={15} />
                            <span>Recommended Pace</span>
                          </div>
                          <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: 0 }}>Watch 2 to 3 lectures daily and implement every step immediately on your Shopify store.</p>
                        </div>

                        <div style={{ background: '#0B0F19', padding: '14px', borderRadius: '8px', border: '1px solid #1F2937' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.84rem', marginBottom: '4px' }}>
                            <Shield size={15} />
                            <span>Need Help?</span>
                          </div>
                          <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: 0 }}>Post your questions inside our VIP WhatsApp group or join Saturday live Zoom calls.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: VIP Downloads */}
                  {activeTab === 'downloads' && (
                    <div style={{ padding: '22px 18px' }}>
                      <h4 style={{ fontWeight: 800, color: '#FFFFFF', marginBottom: '6px', fontSize: '1.1rem' }}>Download Student Resources</h4>
                      <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginBottom: '18px' }}>
                        Access high-value spreadsheets, templates, and supplier lists included with your enrollment.
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {downloads.map(item => (
                          <div
                            key={item.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '10px',
                              padding: '14px 16px',
                              backgroundColor: '#0B0F19',
                              borderRadius: '8px',
                              border: '1px solid #1F2937'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: 'rgba(0, 160, 223, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Calculator size={20} />
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF' }}>{item.title}</div>
                                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>{item.type} &bull; {item.size}</div>
                              </div>
                            </div>

                            <a
                              href={item.url}
                              download
                              className="btn btn-outline"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}
                            >
                              <Download size={15} />
                              <span>Download</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Mentorship & Zoom */}
                  {activeTab === 'coaching' && (
                    <div style={{ padding: '22px 18px' }}>
                      <h4 style={{ fontWeight: 800, color: '#FFFFFF', marginBottom: '6px', fontSize: '1.1rem' }}>Live Coaching &amp; Mentorship Links</h4>
                      <p style={{ color: '#94A3B8', fontSize: '0.86rem', marginBottom: '18px' }}>
                        Connect with Sami and fellow students to get store audits and scaling advice.
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                        {mentorshipLinks.map((link, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '18px',
                              backgroundColor: '#0B0F19',
                              borderRadius: '10px',
                              border: '1px solid #1F2937',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div>
                              <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: 'rgba(0, 160, 223, 0.2)', color: 'var(--primary)', display: 'inline-block', marginBottom: '8px' }}>
                                {link.badge}
                              </span>
                              <h5 style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '4px' }}>
                                {link.title}
                              </h5>
                              <p style={{ color: '#94A3B8', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '16px' }}>
                                {link.description}
                              </p>
                            </div>

                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary"
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', borderRadius: '6px', fontWeight: 700, fontSize: '0.84rem', textDecoration: 'none' }}
                            >
                              <span>Open Mastermind Room</span>
                              <ExternalLink size={15} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
                <BookOpen size={44} color="var(--primary)" style={{ margin: '0 auto 16px auto', opacity: 0.8 }} />
                <h3 style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.25rem', marginBottom: '8px' }}>Select a Lecture to Begin</h3>
                <p style={{ fontSize: '0.88rem', maxWidth: '400px', margin: '0 auto 20px auto' }}>
                  Choose any lecture from the 11 modules curriculum index to start learning.
                </p>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <BookOpen size={16} />
                  <span>Browse Curriculum (36 Lectures)</span>
                </button>
              </div>
            )}

          </main>

        </div>

      </div>
    </LmsSecurityGuard>
  );
}
