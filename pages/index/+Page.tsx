import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Clock, 
  Tv, 
  Users, 
  Lock, 
  MapPin, 
  Building2, 
  Package, 
  CreditCard,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  BookOpen,
  Calendar,
  User
} from 'lucide-react';
import { CurriculumAccordion } from '../../components/CurriculumAccordion';
import { BonusStack } from '../../components/BonusStack';
import { ProofWall } from '../../components/ProofWall';
import { VideoModal } from '../../components/VideoModal';
import { analytics } from '../../utils/analytics';

export default function HomePage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState('Course Overview & Blueprint');
  const [videoUrl, setVideoUrl] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Dynamic CMS Sections & Reviews State
  const [cmsContent, setCmsContent] = useState<any>({
    hero: {
      badge: 'PAKISTAN’S #1 UAE & KSA DROPSHIPPING TRAINING',
      title: 'Learn how to start an online dropshipping store in UAE & KSA',
      highlight_text: 'step-by-step training',
      subtitle: 'Beginner friendly practical training from basics to high-profit ad scaling. No expensive software or company registration required.',
      video_title: 'Watch this 128 seconds video to learn how easy it is to start',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
      video_thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
      cta_text: 'YES! I WANT TO LEARN THIS',
      cta_subtext: 'Trusted by 9,700+ Pakistani Students',
      original_price: '32,500 PKR',
      discount_price: '3,900 PKR',
      discount_percentage: '88% OFF'
    },
    metrics_bar: {
      items: [
        { icon: 'Clock', title: '8 Hours', subtitle: 'Of practical training', color: 'var(--primary)' },
        { icon: 'Tv', title: '36 Lectures', subtitle: 'Ultra-HD video lessons', color: 'var(--accent-green)' },
        { icon: 'Lock', title: 'Lifetime Access', subtitle: 'Web, Windows & APK', color: 'var(--accent-amber)' },
        { icon: 'Users', title: 'Mentorship', subtitle: 'Direct WhatsApp included', color: '#EC4899' }
      ]
    },
    why_dropshipping: {
      tag: 'THE BEST OPPORTUNITY IN 2026',
      title: 'Why Dropshipping Is the Smartest Online Business Right Now',
      highlight_word: 'Smartest',
      subtitle: 'No big investment, no office, no inventory risk. Start with minimal capital right from your laptop or phone.',
      items: [
        { icon: 'MapPin', title: 'Work From Anywhere', desc: 'Run your Gulf store from your bedroom in Karachi, a cafe in Lahore, or anywhere in Pakistan.' },
        { icon: 'Building2', title: 'No Company Registration', desc: 'No expensive legal paperwork, trade licenses, or corporate setup needed to begin.' },
        { icon: 'Package', title: 'Zero Inventory, Zero Risk', desc: 'You never buy stock upfront. Your supplier ships only after a customer places an order.' },
        { icon: 'CreditCard', title: 'Get Paid in Local Bank', desc: 'Withdraw your earned profit straight to your Pakistani bank account or Payoneer.' }
      ]
    },
    mentor_profile: {
      tag: 'YOUR MENTOR',
      name: 'Sami Ur Rehman',
      title: 'Digital E-Commerce & Ads Expert',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: 'You don’t just need a course — you need direct mentorship and an active community. I will personally guide you through product hunting, supplier negotiations, and high-converting TikTok/Facebook ads.',
      benefits: [
        'Lifetime WhatsApp Support',
        'Private Facebook Mastermind',
        'Verified UAE & KSA Suppliers',
        'Weekly Live Ad Audits'
      ],
      stats: [
        { number: '9,700+', label: 'Students Mentored', color: 'var(--primary)' },
        { number: 'UAE & KSA', label: 'Market Focus', color: 'var(--accent-green)' },
        { number: 'Lifetime', label: 'Access & Updates', color: 'var(--accent-amber)' }
      ]
    },
    bonuses: {
      items: []
    },
    faqs: {
      items: [
        { q: 'Do I need a lot of money or inventory to start?', a: 'No! With dropshipping, you never buy products in advance. Your verified supplier in the UAE or Saudi Arabia only ships after a customer places an order on your store. You can start with minimal testing budget.' },
        { q: 'I am a complete beginner with zero computer skills. Can I do this?', a: 'Absolutely. The entire 11-module course is created in simple Urdu/Hindi from complete scratch. We show every single click on the screen, from creating your Shopify store to launching your first TikTok ad.' },
        { q: 'How do I receive payments from customers in UAE and Saudi Arabia?', a: 'In the Gulf market, 80%+ of customers order via Cash on Delivery (COD). Local courier companies collect cash at the customer doorstep and transfer your profit directly into your Pakistani bank account or Payoneer.' },
        { q: 'How does the WhatsApp Mentorship work?', a: 'Whenever you get stuck while building your store, finding products, or setting up your TikTok pixel, you can message our dedicated support team on WhatsApp from 9 AM to 5 PM for instant guidance.' },
        { q: 'How do I access the lectures after enrolling?', a: 'As soon as your enrollment is approved, you get instant login access to our web portal and can also download our dedicated Windows Desktop App or Android APK for smooth HD lecture streaming.' }
      ]
    }
  });

  const [studentReviews, setStudentReviews] = useState<any[]>([
    { student_name: 'Raza Ali', sales_text: '€662 in 6 Days', quote: 'Total beginner getting continuous sales in UAE market.', thumbnail_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80' },
    { student_name: 'Hamza Tariq', sales_text: 'AED 5,000 & 56 Orders', quote: 'Mentorship on WhatsApp helped me fix my TikTok pixel instantly.', thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
    { student_name: 'Bilal Farooq', sales_text: 'AED 1,485 in 3 Days', quote: 'The step-by-step layout formula converted traffic immediately.', thumbnail_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80' }
  ]);

  const [siteBlogs, setSiteBlogs] = useState<any[]>([]);

  useEffect(() => {
    // Track ViewContent for the main UAE/KSA Dropshipping Mastery Course
    analytics.trackViewContent({
      content_id: 'COURSE-UAE-01',
      content_name: 'UAE & KSA Dropshipping Mastery (From Scratch to Scaling)',
      content_type: 'product',
      value: 3900,
      currency: 'PKR'
    });

    // Hydrate Live CMS Data
    fetch('/api/public/cms-content')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.sections) {
            setCmsContent((prev: any) => ({
              ...prev,
              ...data.sections
            }));
          }
          if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
            setStudentReviews(data.reviews);
          }
          if (data.blogs && Array.isArray(data.blogs) && data.blogs.length > 0) {
            setSiteBlogs(data.blogs);
          }
        }
      })
      .catch(() => {});
  }, []);

  const openVideo = (title: string, url?: string) => {
    setVideoTitle(title);
    setVideoUrl(url || '');
    setVideoModalOpen(true);
  };

  const hero = cmsContent.hero || {};
  const metrics = cmsContent.metrics_bar?.items || [];
  const mentor = cmsContent.mentor_profile || {};
  const faqs = cmsContent.faqs?.items || [];

  return (
    <div style={{ backgroundColor: '#F8FAFC' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F9FF 100%)',
        paddingTop: '40px',
        paddingBottom: '60px',
        borderBottom: '1px solid #E2E8F0',
        overflow: 'hidden'
      }}>
        <div className="site-container" style={{ textAlign: 'center' }}>
          
          {/* Top Dropshipping Badge */}
          <div className="dropshipping-badge animate-float">
            <span className="badge-dot" />
            <span className="badge-blue">PAKISTAN’S #1</span>
            <span className="badge-dark">{hero.badge || 'UAE/KSA DROPSHIPPING TRAINING'}</span>
          </div>

          {/* Main Headline */}
          <h1 className="lwa-hero-title scroll-animate">
            {hero.title || 'Learn how to start an online dropshipping store in UAE & KSA'}{' '}
            <span style={{ color: '#00A0DF' }}>{hero.highlight_text || 'step-by-step training'}</span>
          </h1>

          {/* Subtitle */}
          <h2 className="lwa-hero-sub scroll-animate stagger-1">
            {hero.subtitle || 'Beginner Friendly Practical Training from Basics to Scaling'}
          </h2>

          {/* Hero Video Preview Card */}
          <div className="scroll-animate stagger-2" style={{
            maxWidth: '780px',
            margin: '0 auto 32px auto',
            backgroundColor: '#0B0F19',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid rgba(0, 160, 223, 0.35)',
            boxShadow: '0 20px 45px rgba(0, 160, 223, 0.2)',
            position: 'relative'
          }}>
            <div style={{
              padding: '14px 18px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <Sparkles size={18} color="#00A0DF" />
              <span style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '0.92rem' }}>
                {hero.video_title || 'Watch this 128 seconds video to learn how easy it is to start'}
              </span>
            </div>

            <div
              onClick={() => openVideo(hero.video_title || '128-Second Course Walkthrough & Proof', hero.video_url)}
              style={{
                position: 'relative',
                paddingTop: '52%',
                backgroundColor: '#000000',
                cursor: 'pointer',
                backgroundImage: `url(${hero.video_thumbnail || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(11, 15, 25, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: '#00A0DF',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(0, 160, 223, 0.85)',
                  transition: 'transform 0.25s ease'
                }}>
                  <Play size={32} fill="#FFFFFF" style={{ marginLeft: '4px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* CTA & Pricing Stack */}
          <div className="scroll-animate stagger-3" style={{ maxWidth: '580px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>
            <a href="/enrollment" className="lwa-cta-btn btn-shimmer pulse-glow" style={{ width: '100%' }}>
              <span>{hero.cta_text || 'YES! I WANT TO LEARN THIS'}</span>
              <ArrowRight size={20} />
            </a>

            {/* Discount Price Bar */}
            <div className="lwa-price-box" style={{ width: '100%' }}>
              Originally <span style={{ textDecoration: 'line-through', color: '#EF4444', fontWeight: '800' }}>{hero.original_price || '32,500 PKR'}</span> &mdash; Get Instant Access Today for Just <span style={{ color: '#00A0DF', fontWeight: '800', fontSize: '1.1rem' }}>{hero.discount_price || '3,900 PKR'}</span>
            </div>

            {/* Students trust proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <div style={{ display: 'flex', color: '#F59E0B' }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#F59E0B" />)}
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1E293B' }}>
                {hero.cta_subtext || 'Trusted by 9,700+ Pakistani Students'}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. 4-METRIC VALUE HIGHLIGHT BAR */}
      <section style={{ backgroundColor: '#0B0F19', color: '#FFFFFF', padding: '36px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="site-container">
          <div className="lwa-stats-lite scroll-animate">
            
            <div className="lwa-stat-lite card-interactive stagger-1">
              <div className="lwa-stat-icon-lite animate-float">⏱</div>
              <div className="lwa-stat-big-lite">8 Hours</div>
              <div className="lwa-stat-sub-lite">Of practical training</div>
            </div>

            <div className="lwa-stat-lite card-interactive stagger-2">
              <div className="lwa-stat-icon-lite animate-float">▶</div>
              <div className="lwa-stat-big-lite">36 Lectures</div>
              <div className="lwa-stat-sub-lite">Ultra-HD video lessons</div>
            </div>

            <div className="lwa-stat-lite card-interactive stagger-3">
              <div className="lwa-stat-icon-lite animate-float">🔒</div>
              <div className="lwa-stat-big-lite">Lifetime Access</div>
              <div className="lwa-stat-sub-lite">Web, Windows &amp; APK</div>
            </div>

            <div className="lwa-stat-lite card-interactive stagger-4">
              <div className="lwa-stat-icon-lite animate-float">👥</div>
              <div className="lwa-stat-big-lite">Mentorship</div>
              <div className="lwa-stat-sub-lite">Direct WhatsApp included</div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. WHY DROPSHIPPING IN 2026 */}
      <section className="lwaWd" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="site-container">
          <div className="lwaWdHead scroll-animate">
            <span className="lwaWdTag">THE BEST OPPORTUNITY IN 2026</span>
            <h2 className="lwaWdTitle">
              Why Dropshipping Is the <span>Smartest</span> Online Business Right Now
            </h2>
            <p className="lwaWdSub">
              No big investment, no office, no inventory risk. Start with minimal capital right from your laptop or phone.
            </p>
          </div>

          <div className="lwaWdGrid">
            {[
              {
                icon: <MapPin size={24} />,
                title: 'Work From Anywhere',
                desc: 'Run your Gulf store from your bedroom in Karachi, a cafe in Lahore, or anywhere in Pakistan.'
              },
              {
                icon: <Building2 size={24} />,
                title: 'No Company or Registration',
                desc: 'No expensive legal paperwork, trade licenses, or corporate setup needed to begin.'
              },
              {
                icon: <Package size={24} />,
                title: 'Zero Inventory, Zero Risk',
                desc: 'You never buy stock upfront. Your supplier ships only after a customer places an order.'
              },
              {
                icon: <CreditCard size={24} />,
                title: 'Get Paid in Your Local Bank',
                desc: 'Withdraw your earned profit straight to your Pakistani bank account or Payoneer.'
              }
            ].map((card, idx) => (
              <div key={idx} className={`lwaWdCard card-interactive scroll-animate stagger-${idx + 1}`}>
                <div className="lwaWdRow">
                  <div className="lwaWdIc">
                    {card.icon}
                  </div>
                  <div className="lwaWdTxt">
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lwaWdCta scroll-animate stagger-3">
            <a href="/enrollment" className="lwaWdBtn btn-shimmer pulse-glow">
              YES! I WANT TO LEARN THIS
            </a>
            <p className="lwaWdNote">Join 9,700+ students already building their stores</p>
          </div>
        </div>
      </section>

      {/* 3B. WHAT YOU GET ACCESS TO */}
      <section className="lwa-access">
        <div className="site-container">
          <div className="lwa-access-head scroll-animate">
            <span className="lwa-access-tag">WHAT YOU GET</span>
            <h2 className="lwa-access-title">Here’s What You’ll Get Access To</h2>
            <p className="lwa-access-sub">No prior experience required &mdash; learn step by step how to build and manage your own online store.</p>
          </div>

          <div className="lwa-access-grid">
            <div className="lwa-access-card card-interactive scroll-animate stagger-1">
              <div className="lwa-access-icon">
                <BookOpen size={24} />
              </div>
              <h3>Start &amp; Manage Your Own Store</h3>
              <p>Using Sami’s blueprint, build and scale your own e-commerce business. Student, job holder, or complete beginner &mdash; all you need is a laptop or phone.</p>
            </div>

            <div className="lwa-access-card card-interactive scroll-animate stagger-2">
              <div className="lwa-access-icon">
                <Sparkles size={24} />
              </div>
              <h3>Develop 8 Practical Skills</h3>
              <p>Design high-converting Shopify stores, spy winning products, and source verified UAE &amp; KSA suppliers. Master Facebook &amp; TikTok ads from pixels to scaling.</p>
            </div>

            <div className="lwa-access-card card-interactive scroll-animate stagger-3">
              <div className="lwa-access-icon">
                <MessageCircle size={24} />
              </div>
              <h3>Lifetime WhatsApp Support</h3>
              <p>Stuck during setup? Ask questions directly on WhatsApp from 9AM to 5PM. We make sure your learning journey stays completely smooth.</p>
            </div>

            <div className="lwa-access-card card-interactive scroll-animate stagger-4">
              <div className="lwa-access-icon">
                <Users size={24} />
              </div>
              <h3>Private Community Access</h3>
              <p>Get into private Facebook &amp; WhatsApp communities. Network with active dropshippers, share winning insights, and scale together.</p>
            </div>
          </div>

          <div className="lwa-access-cta scroll-animate stagger-2">
            <a href="/enrollment" className="lwa-access-btn btn-shimmer">
              YES! I WANT TO LEARN THIS
            </a>
          </div>
        </div>
      </section>

      {/* 4. MENTOR SHOWCASE (SAMI) */}
      <section className="lwa-mentor3">
        <div className="site-container">
          <div className="lwa-m3-card scroll-animate">
            <span className="lwa-m3-bar" />
            <div className="lwa-m3-grid">
              {/* Left Photo Wrap */}
              <div className="lwa-m3-left scroll-animate">
                <div className="lwa-m3-photo-wrap">
                  <img
                    src={mentor.photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"}
                    alt="Mentor Sami"
                    className="lwa-m3-photo"
                  />
                </div>
                <div className="lwa-m3-expert">
                  <Sparkles size={14} /> {mentor.title || 'Digital E-Commerce & Ads Expert'}
                </div>
              </div>

              {/* Right Bio & Stats */}
              <div className="lwa-m3-right scroll-animate">
                <span className="lwa-m3-tag">{mentor.tag || 'YOUR MENTOR'}</span>
                <h2 className="lwa-m3-name">{mentor.name || 'Sami Ur Rehman'}</h2>
                <p className="lwa-m3-intro">
                  {mentor.bio || 'You don’t just need a course — you need direct mentorship and an active community. Both are included in your enrollment today.'}
                </p>

                {/* 4 Benefits Checkmarks */}
                <div className="lwa-m3-benefits">
                  {(mentor.benefits || [
                    'Lifetime WhatsApp Support',
                    'Private Facebook Mastermind',
                    'Verified UAE & KSA Suppliers',
                    'Weekly Live Ad Audits'
                  ]).map((text: string, idx: number) => (
                    <div key={idx} className="lwa-m3-benefit card-interactive">
                      <span className="lwa-m3-check"><CheckCircle2 size={18} /></span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Stats Counters */}
                <div className="lwa-m3-stats">
                  <div>
                    <span className="lwa-m3-num">9,700+</span>
                    <span className="lwa-m3-lbl">Students Mentored</span>
                  </div>
                  <div>
                    <span className="lwa-m3-num">UAE &amp; KSA</span>
                    <span className="lwa-m3-lbl">Market Focus</span>
                  </div>
                  <div>
                    <span className="lwa-m3-num">Lifetime</span>
                    <span className="lwa-m3-lbl">Access &amp; Updates</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VIDEO REVIEWS & CASE STUDIES */}
      <section className="lwaProofReviews">
        <div className="site-container">
          <div className="lwaProofHead scroll-animate">
            <span>REAL STUDENT RESULTS</span>
            <h2>Hear What Our Students Are Saying</h2>
            <p>
              Real student video reviews sharing their sales breakthroughs and experience after joining the mentorship.
            </p>
          </div>

          <div className="lwaProofGrid">
            {studentReviews.map((v: any, idx: number) => (
              <div key={idx} className={`lwaProofCard card-interactive scroll-animate stagger-${(idx % 4) + 1}`}>
                <div>
                  <div className="lwaProofStars">★★★★★</div>
                  <h3>“{v.quote || v.title || 'Continuous sales and 24/7 WhatsApp mentorship.'}”</h3>
                </div>

                <div
                  className="lwaProofVideoBox"
                  onClick={() => openVideo(`Student Review: ${v.student_name || v.name} (${v.sales_text || v.stats})`, v.video_url)}
                  style={{
                    backgroundImage: `url(${v.thumbnail_url || v.thumb || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <button className="lwaProofPlay" type="button" aria-label="Play review video">
                    <Play size={22} fill="#FFFFFF" style={{ marginLeft: '2px' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lwaProofCta scroll-animate stagger-2">
            <a href="/enrollment" className="lwaProofBtn btn-shimmer">
              Get Access To The Full Course (PKR 3,900)
            </a>
            <p>Learn step-by-step with lifetime mentorship support.</p>
          </div>
        </div>
      </section>

      {/* 6. WHO IS THIS FOR? */}
      <section className="lwaWho">
        <div className="site-container">
          <div className="lwaWhoHead scroll-animate">
            <span className="lwaWhoTag">PERFECT FOR YOU IF...</span>
            <h2 className="lwaWhoTitle">Who Is This Program For?</h2>
            <p className="lwaWhoSub">
              No matter where you are starting from, this blueprint meets you at your current level.
            </p>
          </div>

          <div className="lwaWhoGrid">
            <div className="lwaWhoCard card-interactive scroll-animate stagger-1">
              <div className="lwaWhoIc" style={{ background: '#FFF4E0' }}>🌱</div>
              <h3>If You’re a Complete <span>Beginner</span></h3>
              <p>No idea how to start? I’ll guide you step by step. By the end, you’ll have a fully working Shopify store and a clear roadmap to your first sale.</p>
            </div>

            <div className="lwaWhoCard card-interactive scroll-animate stagger-2">
              <div className="lwaWhoIc" style={{ background: '#E7F0FF' }}>📣</div>
              <h3>If You’re <span>Struggling With Ads</span></h3>
              <p>Confused by Facebook or TikTok ads? Learn to create high-converting campaigns, target the right audience, and scale your sales the right way.</p>
            </div>

            <div className="lwaWhoCard card-interactive scroll-animate stagger-3">
              <div className="lwaWhoIc" style={{ background: '#EAF9EF' }}>💼</div>
              <h3>If You’re a <span>Business Owner</span></h3>
              <p>Want to add a profitable eCommerce stream? Learn to find winning products, source reliable UAE &amp; KSA suppliers, and automate your store.</p>
            </div>

            <div className="lwaWhoCard card-interactive scroll-animate stagger-4">
              <div className="lwaWhoIc" style={{ background: '#FDEAF1' }}>🚀</div>
              <h3>Ready to <span>Master Store Management</span></h3>
              <p>Start dropshipping with minimal investment while getting lifetime mentorship and proven strategies to grow your online business skills.</p>
            </div>

            <div className="lwaWhoCard card-interactive scroll-animate stagger-5">
              <div className="lwaWhoIc" style={{ background: '#EDEAFE' }}>📈</div>
              <h3>If You’re Already <span>Running a Store</span></h3>
              <p>Struggling to scale or manage campaigns? Learn advanced scaling techniques, automation tools, and ad strategies to reach the next level.</p>
            </div>

            <div className="lwaWhoCard card-interactive scroll-animate stagger-6">
              <div className="lwaWhoIc" style={{ background: '#E0F7F6' }}>💡</div>
              <h3>If You’re a <span>Freelancer or Side Hustler</span></h3>
              <p>Add dropshipping to your skillset and earn extra income online. Learn product research, ad mastery, and store management to start fast.</p>
            </div>
          </div>

          <div className="lwaWhoCta scroll-animate stagger-2">
            <a href="/enrollment" className="lwaWhoBtn btn-shimmer">
              YES! I WANT TO LEARN THIS
            </a>
          </div>
        </div>
      </section>

      {/* 7. 11-MODULE CURRICULUM SECTION */}
      <section id="curriculum" className="lwaCur">
        <div className="site-container">
          <div className="lwaCurHead scroll-animate">
            <span className="lwaCurTag">11 COMPLETE MODULES</span>
            <h2 className="lwaCurTitle">Everything You Get Inside the Course</h2>
            <p className="lwaCurSub">
              Start from zero and build your own UAE &amp; Saudi Arabia dropshipping empire, step by step.
            </p>
          </div>

          <div className="scroll-animate stagger-1">
            <CurriculumAccordion />
          </div>

          <div className="scroll-animate stagger-2" style={{ textAlign: 'center', marginTop: '36px' }}>
            <a href="/enrollment" className="lwa-cta-btn btn-shimmer">
              <span>Unlock Full 11-Module Curriculum (PKR 3,900)</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* 8. FREE BONUSES STACK */}
      <section className="lwaFb">
        <div className="site-container scroll-animate">
          <BonusStack />
        </div>
      </section>

      {/* 9. INFINITE VERTICAL SCROLLING PROOF WALL */}
      <section style={{ padding: '70px 0', backgroundColor: '#FFFFFF' }}>
        <div className="site-container">
          <div className="scroll-animate" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge-pill badge-green" style={{ marginBottom: '12px' }}>LIVE STUDENT PROOF</span>
            <h2 style={{ fontSize: 'clamp(1.65rem, 3.5vw, 2.5rem)', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '12px' }}>
              Real Results From Pakistani Students
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
              Real WhatsApp chats and verified revenue screenshots from active batch members.
            </p>
          </div>

          <div className="scroll-animate stagger-1">
            <ProofWall />
          </div>
        </div>
      </section>

      {/* 9B. LATEST E-COMMERCE GUIDES & BLOGS */}
      {siteBlogs.length > 0 && (
        <section style={{ padding: '70px 0', backgroundColor: '#F8FAFC', borderTop: '1px solid var(--border-light)' }}>
          <div className="site-container">
            <div className="scroll-animate" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="badge-pill badge-cyan" style={{ marginBottom: '10px' }}>FREE RESOURCES &amp; BLUEPRINTS</span>
                <h2 style={{ fontSize: 'clamp(1.65rem, 3.5vw, 2.4rem)', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
                  Latest Dropshipping <span style={{ color: 'var(--primary)' }}>Guides &amp; Strategies</span>
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '560px' }}>
                  Read our latest tactical articles on scaling ads, hunting winning products, and mastering Gulf e-commerce.
                </p>
              </div>

              <a
                href="/blogs"
                className="btn-secondary card-interactive"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.9rem' }}
              >
                <span>View All Guides</span>
                <ArrowRight size={16} />
              </a>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '26px'
            }}>
              {siteBlogs.slice(0, 3).map((b: any, idx: number) => (
                <article
                  key={b.id}
                  className={`card-interactive scroll-animate stagger-${idx + 1}`}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid var(--border-light)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{
                    height: '190px',
                    backgroundImage: `url(${b.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}>
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(11, 15, 25, 0.85)',
                      color: 'var(--primary)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {b.tags?.split(',')[0] || 'Guide'}
                    </span>
                  </div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={12} color="var(--primary)" /> {b.author || 'Mentor Sami'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {new Date(b.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px', lineHeight: 1.35 }}>
                        <a href={`/blogs/${b.slug}`} style={{ color: 'inherit' }}>
                          {b.title}
                        </a>
                      </h3>

                      <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
                        {b.excerpt || (b.content ? b.content.slice(0, 110) + '...' : '')}
                      </p>
                    </div>

                    <a
                      href={`/blogs/${b.slug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--primary)',
                        fontWeight: '700',
                        fontSize: '0.86rem',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-light)'
                      }}
                    >
                      Read Full Article <ArrowRight size={14} />
                    </a>
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* 10. FAQ ACCORDION */}
      <section style={{ padding: '70px 0', backgroundColor: '#FFFFFF' }}>
        <div className="site-container" style={{ maxWidth: '840px' }}>
          <div className="scroll-animate" style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span className="badge-pill badge-amber" style={{ marginBottom: '12px' }}>FREQUENTLY ASKED QUESTIONS</span>
            <h2 style={{ fontSize: 'clamp(1.65rem, 3vw, 2.3rem)', fontWeight: '800', color: 'var(--text-dark)' }}>
              Got Questions? We Have Answers
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq: any, idx: number) => {
              const isOpen = faqOpen === idx;
              return (
                <div
                  key={idx}
                  className={`card-interactive scroll-animate stagger-${(idx % 4) + 1}`}
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '12px',
                    border: '1px solid var(--border-light)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '18px 22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '14px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={20}
                      color="#00A0DF"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease',
                        flexShrink: 0
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 22px 18px 22px', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Final Action Box */}
          <div className="scroll-animate stagger-2" style={{
            marginTop: '50px',
            backgroundColor: '#0B0F19',
            borderRadius: '16px',
            padding: '36px 24px',
            textAlign: 'center',
            color: '#FFFFFF',
            border: '1px solid rgba(0, 160, 223, 0.35)',
            boxShadow: '0 20px 45px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '10px' }}>
              Ready to build your profitable Gulf dropshipping business?
            </h3>
            <p style={{ color: 'var(--text-subtle)', marginBottom: '24px', fontSize: '0.94rem' }}>
              Join 9,700+ successful students. Get instant lifetime LMS access + 6 free bonuses for just PKR 3,900.
            </p>
            <a href="/enrollment" className="lwa-cta-btn btn-shimmer pulse-glow" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
              Claim 88% Discount &amp; Enroll Now
            </a>
          </div>

        </div>
      </section>

      {/* Video Popup Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        title={videoTitle}
        videoUrl={videoUrl}
      />

    </div>
  );
}
