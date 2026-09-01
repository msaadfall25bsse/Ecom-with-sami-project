import React, { useState, useEffect } from 'react';
import { Star, Play, CheckCircle2, ArrowRight, TrendingUp, ShieldCheck } from 'lucide-react';
import { ProofWall } from '../../components/ProofWall';
import { VideoModal } from '../../components/VideoModal';

export default function SuccessPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalVideoUrl, setModalVideoUrl] = useState('');

  const [reviews, setReviews] = useState<any[]>([
    {
      student_name: 'Raza Ali',
      city: 'Lahore',
      market: 'UAE Market',
      sales_text: '€662 in 6 Days',
      orders_text: '48 Orders',
      badge: 'First Time Dropshipper',
      thumbnail_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      quote: 'Raza was completely new to Shopify. After watching Module 3 (Product Hunting) and Module 5 (TikTok Ads), he launched a simple test campaign with a small daily budget. Within 6 days, his store generated €662 in confirmed orders with an 84% fulfillment rate.'
    },
    {
      student_name: 'Hamza Tariq',
      city: 'Islamabad',
      market: 'UAE Market',
      sales_text: 'AED 5,000 / Week',
      orders_text: '56 Orders',
      badge: 'Scaled with CBO',
      thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      quote: 'Hamza previously struggled with Facebook ad bans. In our course, he learned how to set up Meta Business Suite and CAPI tracking properly. He scaled a single winning home gadget in UAE to AED 5,000 in weekly revenue.'
    },
    {
      student_name: 'Bilal Farooq',
      city: 'Karachi',
      market: 'KSA Market',
      sales_text: 'AED 1,485 in 3 Days',
      orders_text: '22 Orders',
      badge: 'Local COD Mastery',
      thumbnail_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      quote: 'Working a full-time 9-to-5 job, Bilal dedicated 1.5 hours in the evening. He utilized our direct Dubai supplier contact list, eliminating upfront inventory costs entirely.'
    },
    {
      student_name: 'Zainab Bibi',
      city: 'Faisalabad',
      market: 'Saudi Arabia',
      sales_text: 'PKR 480,000 / Mo',
      orders_text: '110 Orders',
      badge: 'Saudi Arabia Expansion',
      thumbnail_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      quote: 'Zainab leveraged our Arabic script prompts for TikTok videos and targeted female beauty accessories in Riyadh. Her store achieved over 110 orders in her very first month.'
    }
  ]);

  useEffect(() => {
    fetch('/api/public/cms-content')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {});
  }, []);

  const openVideo = (title: string, url?: string) => {
    setModalTitle(title);
    setModalVideoUrl(url || '');
    setModalOpen(true);
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC' }}>
      
      {/* Header Banner */}
      <section style={{
        background: 'linear-gradient(180deg, #0B0F19 0%, #111827 100%)',
        color: '#FFFFFF',
        padding: '72px 0 60px 0',
        textAlign: 'center',
        borderBottom: '1px solid rgba(0, 160, 223, 0.25)'
      }}>
        <div className="site-container">
          <div className="badge-pill badge-cyan" style={{ marginBottom: '16px' }}>
            <TrendingUp size={14} /> VERIFIED STUDENT CASE STUDIES
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: '800', lineHeight: 1.2, maxWidth: '800px', margin: '0 auto 16px auto' }}>
            From Dreams to Dollars: <span style={{ color: 'var(--primary)' }}>Our Student Results</span>
          </h1>
          <p style={{ color: 'var(--text-subtle)', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
            Real Pakistani students sharing unedited profit dashboards, store revenue records, and video testimonials.
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section style={{ padding: '80px 0' }}>
        <div className="site-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {reviews.map((cs: any, idx: number) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-light)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Video Image Preview with Click-To-Play */}
                <div
                  onClick={() => openVideo(`Case Study: ${cs.student_name || cs.name} (${cs.sales_text || cs.sales})`, cs.video_url)}
                  style={{
                    position: 'relative',
                    paddingTop: '54%',
                    cursor: 'pointer',
                    backgroundImage: `url(${cs.thumbnail_url || cs.image || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#0B0F19'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(11, 15, 25, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 25px rgba(0, 160, 223, 0.8)',
                      transition: 'transform 0.2s ease'
                    }}>
                      <Play size={26} fill="white" style={{ marginLeft: '3px' }} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span className="badge-pill badge-green" style={{ fontSize: '0.75rem' }}>{cs.badge || cs.market || 'Verified Student'}</span>
                      <div style={{ display: 'flex', color: '#F59E0B' }}>
                        {[...Array(cs.rating || 5)].map((_, i) => <Star key={i} size={14} fill="#F59E0B" />)}
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '4px' }}>
                      {cs.student_name || cs.name} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>({cs.city})</span>
                    </h3>

                    <div style={{
                      backgroundColor: 'rgba(0, 160, 223, 0.08)',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      color: 'var(--primary)',
                      fontWeight: '800',
                      fontSize: '1.05rem',
                      display: 'inline-block',
                      marginBottom: '16px'
                    }}>
                      {cs.sales_text || cs.sales}
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      {cs.quote || cs.story}
                    </p>
                  </div>

                  <div style={{ paddingTop: '20px', marginTop: '20px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-green)', fontWeight: '700', fontSize: '0.85rem' }}>
                    <ShieldCheck size={16} /> Verified Store Revenue
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infinite Proof Wall Section */}
      <section style={{ padding: '40px 0 80px 0', backgroundColor: '#FFFFFF' }}>
        <div className="site-container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span className="badge-pill badge-cyan" style={{ marginBottom: '10px' }}>COMMUNITY HIGHLIGHTS</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-dark)' }}>
              Live WhatsApp Community Proof
            </h2>
          </div>
          <ProofWall />
        </div>
      </section>

      {/* Call to action */}
      <section style={{ padding: '60px 0 90px 0' }}>
        <div className="site-container" style={{ textAlign: 'center' }}>
          <div style={{
            backgroundColor: '#0B0F19',
            borderRadius: 'var(--radius-xl)',
            padding: '48px 32px',
            color: '#FFFFFF',
            border: '1px solid rgba(0, 160, 223, 0.3)',
            maxWidth: '860px',
            margin: '0 auto'
          }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '12px' }}>
              Ready to write your own success story?
            </h2>
            <p style={{ color: 'var(--text-subtle)', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px auto' }}>
              Join thousands of Pakistani students currently generating daily cash flow from UAE &amp; Saudi dropshipping.
            </p>
            <a href="/enrollment" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
              Enroll Today for Just PKR 3,900 <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Direct Video & Embed Modal */}
      <VideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        videoUrl={modalVideoUrl}
      />

    </div>
  );
}
