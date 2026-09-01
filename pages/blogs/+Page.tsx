import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, User, ArrowRight, Tag, Search, Sparkles } from 'lucide-react';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  useEffect(() => {
    fetch('/api/public/cms-content')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.blogs) {
          setBlogs(data.blogs);
        }
      })
      .catch(err => console.error('Error loading blogs:', err))
      .finally(() => setLoading(false));
  }, []);

  const allTags = ['All', 'UAE Dropshipping', 'TikTok Ads', 'Product Hunting', 'Saudi Arabia', 'Scaling'];

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (b.excerpt && b.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (b.tags && b.tags.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = selectedTag === 'All' || (b.tags && b.tags.toLowerCase().includes(selectedTag.toLowerCase()));
    return matchesSearch && matchesTag;
  });

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '90px' }}>
      
      {/* Header Banner */}
      <section style={{
        background: 'linear-gradient(180deg, #0B0F19 0%, #111827 100%)',
        color: '#FFFFFF',
        padding: '64px 0 54px 0',
        textAlign: 'center',
        borderBottom: '1px solid rgba(0, 160, 223, 0.25)'
      }}>
        <div className="site-container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', backgroundColor: 'rgba(0, 160, 223, 0.15)', borderRadius: '999px', border: '1px solid rgba(0, 160, 223, 0.35)', marginBottom: '18px' }}>
            <Sparkles size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              PRACTICAL E-COMMERCE BLUEPRINTS
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
            fontWeight: '800',
            lineHeight: 1.2,
            maxWidth: '850px',
            margin: '0 auto 16px auto'
          }}>
            Latest UAE &amp; KSA Dropshipping <span style={{ color: 'var(--primary)' }}>Guides &amp; News</span>
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-subtle)',
            maxWidth: '620px',
            margin: '0 auto 32px auto',
            lineHeight: 1.6
          }}>
            Actionable strategies, TikTok media buying tactics, winning product criteria, and Gulf market insights from Mentor Sami.
          </p>

          {/* Search Bar */}
          <div style={{
            maxWidth: '520px',
            margin: '0 auto',
            position: 'relative'
          }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search guides, strategies, niches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-full)',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                outline: 'none',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Tag Filters & Content */}
      <div className="site-container" style={{ marginTop: '40px' }}>
        
        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '32px' }}>
          {allTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                border: selectedTag === tag ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                backgroundColor: selectedTag === tag ? 'var(--primary)' : '#FFFFFF',
                color: selectedTag === tag ? '#FFFFFF' : 'var(--text-dark)',
                fontSize: '0.86rem',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Loading latest articles...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            padding: '60px 24px',
            textAlign: 'center'
          }}>
            <BookOpen size={40} color="var(--primary)" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
              No Articles Found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              No guides match your search criteria. Try a different search keyword.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {filteredBlogs.map(blog => (
              <article
                key={blog.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-light)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                }}
              >
                {/* Featured Image */}
                <div style={{
                  position: 'relative',
                  paddingTop: '54%',
                  backgroundColor: '#0B0F19',
                  backgroundImage: `url(${blog.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    backgroundColor: 'rgba(11, 15, 25, 0.85)',
                    backdropFilter: 'blur(4px)',
                    color: 'var(--primary)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    border: '1px solid rgba(0, 160, 223, 0.3)'
                  }}>
                    {blog.tags?.split(',')[0] || 'Dropshipping'}
                  </div>
                </div>

                {/* Article Info */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={13} color="var(--primary)" /> {blog.author || 'Mentor Sami'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} /> {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 style={{
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      color: 'var(--text-dark)',
                      marginBottom: '10px',
                      lineHeight: 1.35
                    }}>
                      <a href={`/blogs/${blog.slug}`} style={{ color: 'inherit' }}>
                        {blog.title}
                      </a>
                    </h2>

                    <p style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.55,
                      marginBottom: '18px'
                    }}>
                      {blog.excerpt || (blog.content ? blog.content.slice(0, 120) + '...' : '')}
                    </p>
                  </div>

                  <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <a
                      href={`/blogs/${blog.slug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--primary)',
                        fontWeight: '700',
                        fontSize: '0.9rem'
                      }}
                    >
                      Read Full Guide <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Enrollment Banner at Bottom of Blogs */}
        <div style={{
          marginTop: '64px',
          backgroundColor: '#0B0F19',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 32px',
          textAlign: 'center',
          color: '#FFFFFF',
          border: '1px solid rgba(0, 160, 223, 0.3)'
        }}>
          <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '10px' }}>
            Want Step-by-Step Video Mentorship from Sami?
          </h3>
          <p style={{ color: 'var(--text-subtle)', maxWidth: '640px', margin: '0 auto 24px auto', fontSize: '0.98rem' }}>
            Get lifetime access to the complete 11-module masterclass + 6 free bonus tools for just PKR 3,900 today.
          </p>
          <a href="/enrollment" className="btn-primary" style={{ padding: '15px 36px', fontSize: '1.05rem' }}>
            Enroll Now (PKR 3,900) &mdash; 88% OFF
          </a>
        </div>

      </div>
    </div>
  );
}
