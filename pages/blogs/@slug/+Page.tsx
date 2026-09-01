import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  BookOpen,
  MessageCircle,
  Tag
} from 'lucide-react';
import { CONTACT_CONFIG } from '../../../utils/contactConfig';

export default function BlogDetailPage() {
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const slug = pathParts[pathParts.length - 1];

      // 1. Fetch Blog Detail
      fetch(`/api/public/blogs/${slug}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.blog) {
            setBlog(data.blog);
          }
        })
        .catch(err => console.error('Error loading blog detail:', err))
        .finally(() => setLoading(false));

      // 2. Fetch Recent Blogs for sidebar/bottom
      fetch('/api/public/cms-content')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.blogs) {
            setRecentBlogs(data.blogs.filter((b: any) => b.slug !== slug).slice(0, 3));
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#F8FAFC', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-muted)' }}>Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{ backgroundColor: '#F8FAFC', minHeight: '80vh', padding: '80px 20px', textAlign: 'center' }}>
        <div className="site-container" style={{ maxWidth: '600px' }}>
          <BookOpen size={48} color="var(--primary)" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '12px' }}>Article Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>The requested blog post could not be found or has been moved.</p>
          <a href="/blogs" className="btn-primary" style={{ padding: '12px 28px' }}>
            <ArrowLeft size={16} /> Back to All Articles
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '90px' }}>
      
      {/* Top Breadcrumb & Article Header */}
      <section style={{
        background: 'linear-gradient(180deg, #0B0F19 0%, #111827 100%)',
        color: '#FFFFFF',
        padding: '54px 0 60px 0',
        borderBottom: '1px solid rgba(0, 160, 223, 0.25)'
      }}>
        <div className="site-container" style={{ maxWidth: '880px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <a
              href="/blogs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--primary)',
                fontSize: '0.88rem',
                fontWeight: '700'
              }}
            >
              <ArrowLeft size={16} /> Back to All Guides
            </a>

            <button
              type="button"
              onClick={handleShare}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                color: '#FFFFFF',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Share2 size={14} /> Share Guide
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {(blog.tags || 'Dropshipping, UAE').split(',').map((tag: string, idx: number) => (
              <span
                key={idx}
                style={{
                  backgroundColor: 'rgba(0, 160, 223, 0.15)',
                  border: '1px solid rgba(0, 160, 223, 0.3)',
                  color: 'var(--primary)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.76rem',
                  fontWeight: '800'
                }}
              >
                {tag.trim()}
              </span>
            ))}
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 2.9rem)',
            fontWeight: '800',
            lineHeight: 1.25,
            marginBottom: '20px'
          }}>
            {blog.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.86rem', color: 'var(--text-subtle)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} color="var(--primary)" /> {blog.author || 'Mentor Sami'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} /> {new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} /> 5 Min Read
            </span>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <div className="site-container" style={{ maxWidth: '880px', marginTop: '-30px' }}>
        
        {/* Featured Image */}
        {blog.image_url && (
          <div style={{
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            marginBottom: '36px',
            maxHeight: '440px',
            backgroundColor: '#0B0F19'
          }}>
            <img
              src={blog.image_url}
              alt={blog.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Article Body Box */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          padding: '44px 36px',
          boxShadow: 'var(--shadow-sm)',
          fontSize: '1.05rem',
          lineHeight: 1.8,
          color: '#334155'
        }}>
          
          {/* Excerpt Lead */}
          {blog.excerpt && (
            <div style={{
              fontSize: '1.18rem',
              fontWeight: '600',
              color: 'var(--text-dark)',
              borderLeft: '4px solid var(--primary)',
              paddingLeft: '18px',
              marginBottom: '28px',
              lineHeight: 1.6
            }}>
              {blog.excerpt}
            </div>
          )}

          {/* Full Content */}
          <div style={{ whiteSpace: 'pre-line' }}>
            {blog.content}
          </div>

          {/* Author Spotlight Box */}
          <div style={{
            marginTop: '44px',
            paddingTop: '32px',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, var(--primary), #004d73)',
              padding: '2px',
              flexShrink: 0
            }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                alt="Mentor Sami"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-dark)' }}>
                Written by {blog.author || 'Sami Ur Rehman'}
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                E-Commerce &amp; Media Buying Mentor who has trained 9,700+ Pakistani students to scale profitable stores in the UAE &amp; Saudi Arabia.
              </p>
            </div>
          </div>

        </div>

        {/* High Converting Enrollment Call to Action */}
        <div style={{
          marginTop: '48px',
          backgroundColor: '#0B0F19',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 32px',
          textAlign: 'center',
          color: '#FFFFFF',
          border: '1px solid rgba(0, 160, 223, 0.35)',
          boxShadow: '0 20px 45px rgba(0,0,0,0.4)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', backgroundColor: 'rgba(16, 185, 129, 0.15)', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--accent-green)', fontSize: '0.82rem', fontWeight: '800', marginBottom: '16px' }}>
            <Sparkles size={15} /> 88% DISCOUNT ACTIVE TODAY
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px' }}>
            Ready to Master UAE &amp; Saudi Arabia Dropshipping?
          </h3>
          <p style={{ color: 'var(--text-subtle)', maxWidth: '640px', margin: '0 auto 24px auto', fontSize: '0.96rem', lineHeight: 1.6 }}>
            Join 9,700+ successful students. Get lifetime access to all 36 HD video lectures, verified supplier list, weekly live coaching, and WhatsApp mentorship for just PKR 3,900.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a href="/enrollment" className="btn-primary" style={{ padding: '14px 34px', fontSize: '1.05rem' }}>
              <span>Enroll Now for PKR 3,900</span>
              <ArrowRight size={18} />
            </a>
            <a
              href={CONTACT_CONFIG.getWhatsAppUrl(`Hi Sami! I just read your guide "${blog.title}". Can you give me more details about joining the mentorship?`)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                backgroundColor: 'rgba(37, 211, 102, 0.15)',
                border: '1px solid rgba(37, 211, 102, 0.35)',
                borderRadius: 'var(--radius-md)',
                color: '#25D366',
                fontWeight: '700',
                fontSize: '0.96rem'
              }}
            >
              <MessageCircle size={18} /> Ask on WhatsApp
            </a>
          </div>
        </div>

        {/* More Recent Guides */}
        {recentBlogs.length > 0 && (
          <div style={{ marginTop: '54px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '20px' }}>
              More Practical Guides &amp; Insights
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              {recentBlogs.map(r => (
                <a
                  key={r.id}
                  href={`/blogs/${r.slug}`}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-light)',
                    padding: '20px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textDecoration: 'none'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: '800' }}>
                      {r.tags?.split(',')[0] || 'Dropshipping'}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-dark)', margin: '6px 0 10px 0', lineHeight: 1.4 }}>
                      {r.title}
                    </h4>
                  </div>
                  <span style={{ color: 'var(--primary)', fontSize: '0.84rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Read Article <ArrowRight size={14} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
