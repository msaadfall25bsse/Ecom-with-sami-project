import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import { analytics } from '../../utils/analytics';
import { useContactConfig } from '../../utils/contactConfig';

export default function SupportPage() {
  const { email, displayPhone, supportHours, headOffice, getWhatsAppUrl } = useContactConfig();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        // Track SubmitForm event on successful support message
        analytics.trackSubmitForm({ form_name: 'Support Contact Form' });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setError(data.message || 'Failed to submit contact request');
      }
    } catch (err: any) {
      setError('Connection error. Please contact us via WhatsApp directly.');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    { q: 'How long does it take for my enrollment to be approved?', a: 'Enrollments with attached payment screenshots are reviewed by our team typically within 15 to 45 minutes.' },
    { q: 'How do I access the Web LMS Classroom after approval?', a: 'Once approved, you will automatically receive an email with your VIP 6-digit Access Code. You can then log in directly at /login on any browser (iPhone, Android, Mac, Windows).' },
    { q: 'What if I am facing issues playing a video?', a: 'Make sure you are logged in with your registered student email. If issues persist, message us on WhatsApp with a screenshot of your screen.' },
    { q: 'What are the WhatsApp mentorship support hours?', a: `Our dedicated student support team is active ${supportHours || 'from Monday to Saturday, 9:00 AM to 5:00 PM PKT'}.` }
  ];

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
          <span className="badge-pill badge-cyan" style={{ marginBottom: '16px' }}>STUDENT HELP DESK</span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: '800', lineHeight: 1.2, maxWidth: '800px', margin: '0 auto 16px auto' }}>
            We&rsquo;re Here to <span style={{ color: 'var(--primary)' }}>Help You Succeed</span>
          </h1>
          <p style={{ color: 'var(--text-subtle)', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
            Have a question before joining, or need help with your student LMS account? Reach out to our team.
          </p>
        </div>
      </section>

      {/* Main Support Grid */}
      <section style={{ padding: '80px 0' }}>
        <div className="site-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px' }}>
            
            {/* Left: Instant WhatsApp Card & Office Locations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* WhatsApp Highlight Box */}
              <div style={{
                backgroundColor: '#111827',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                padding: '36px 28px',
                border: '1px solid rgba(37, 211, 102, 0.4)',
                boxShadow: '0 12px 30px rgba(37, 211, 102, 0.15)'
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                  boxShadow: '0 0 20px rgba(37, 211, 102, 0.5)'
                }}>
                  <MessageCircle size={28} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '8px' }}>
                  Fastest Option: WhatsApp Support
                </h3>
                <p style={{ color: 'var(--text-subtle)', fontSize: '0.92rem', marginBottom: '20px', lineHeight: 1.5 }}>
                  Chat directly with our support team for instant answers about course modules, payment methods, or technical setup.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#94A3B8', marginBottom: '24px' }}>
                  <Clock size={16} color="var(--primary)" /> Support Timing: {supportHours}
                </div>
                <a
                  href={getWhatsAppUrl('Hi Sami! I need help with the Dropshipping Course.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ backgroundColor: '#25D366', color: '#FFFFFF', width: '100%', padding: '14px', fontSize: '0.98rem' }}
                  onClick={() => analytics.trackContact({ contact_channel: 'Support Page WhatsApp Button' })}
                >
                  <MessageCircle size={20} /> Open WhatsApp Chat
                </a>
              </div>

              {/* Office Details */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '16px' }}>
                  Official Contact Channels
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Mail size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--text-dark)' }}>Email:</strong>
                      <a href={`mailto:${email}`} style={{ color: 'var(--text-muted)' }}>{email}</a>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Phone size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--text-dark)' }}>Call / WhatsApp:</strong>
                      <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>
                        {displayPhone}
                      </a>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--text-dark)' }}>Head Office:</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{headOffice}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Validated Contact Form */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '36px 32px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
                Send Us a Message
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
                Fill out the form below and our team will get back to you promptly.
              </p>

              {success && (
                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid var(--accent-green)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'var(--accent-green)',
                  fontWeight: '600',
                  marginBottom: '20px'
                }}>
                  <CheckCircle2 size={22} />
                  <span>Thank you! Your message has been sent successfully. We will reply shortly.</span>
                </div>
              )}

              {error && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid var(--accent-red)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'var(--accent-red)',
                  fontWeight: '600',
                  marginBottom: '20px'
                }}>
                  <AlertCircle size={22} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '6px' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Muhammad Ali"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. name@gmail.com"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '6px' }}>
                    WhatsApp / Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +92 300 1234567"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '6px' }}>
                    Your Message / Question *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.95rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '6px' }}
                >
                  <Send size={18} /> {loading ? 'Sending...' : 'Submit Message'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Support FAQ */}
      <section style={{ padding: '0 0 80px 0' }}>
        <div className="site-container" style={{ maxWidth: '820px' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-dark)', textAlign: 'center', marginBottom: '28px' }}>
            Support Quick FAQs
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
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
                      size={18}
                      color="var(--primary)"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease'
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 16px 20px', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
