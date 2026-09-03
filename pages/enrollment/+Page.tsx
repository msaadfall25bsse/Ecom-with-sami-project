import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  UploadCloud, 
  Clock, 
  Flame, 
  ShieldCheck, 
  Zap, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  MessageCircle, 
  ArrowRight,
  ExternalLink,
  CreditCard,
  Building,
  Smartphone,
  Coins,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CountdownTimer } from '../../components/CountdownTimer';
import { analytics } from '../../utils/analytics';
import { CONTACT_CONFIG } from '../../utils/contactConfig';

export default function EnrollmentPage() {
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

  // Dynamic Payment Methods & Active Filter
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
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [pmLoading, setPmLoading] = useState<boolean>(false);
  
  // Copied states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    hearSource: 'TikTok',
    paymentMethod: 'easypaisa'
  });

  // File Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [screenshotBase64, setScreenshotBase64] = useState<string>('');

  // Status State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  // 1. InitiateCheckout Tracking on Page Load & Fetch Live Dynamic Payment Methods
  useEffect(() => {
    analytics.trackInitiateCheckout({
      content_id: 'COURSE-UAE-01',
      content_name: 'Master UAE & KSA Dropshipping',
      content_type: 'product',
      value: 3900,
      currency: 'PKR',
      quantity: 1
    });

    fetch('/api/public/payment-methods')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.methods && data.methods.length > 0) {
          setPaymentMethods(data.methods);
          if (typeof window !== 'undefined') {
            localStorage.setItem('sami_payment_methods', JSON.stringify(data.methods));
          }
          setFormData(prev => ({
            ...prev,
            paymentMethod: data.methods[0].method_key || data.methods[0].title
          }));
        }
      })
      .catch(() => {})
      .finally(() => setPmLoading(false));
  }, []);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    analytics.trackAddPaymentInfo({
      content_id: 'COURSE-UAE-01',
      value: 3900,
      currency: 'PKR',
      payment_type: filter
    });
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }

      // Fast, lightweight client-side compression to avoid Hostinger 413 Payload Too Large
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawResult = event.target?.result as string;
        const img = new Image();
        img.src = rawResult;
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const MAX_DIM = 1200;
            let w = img.width;
            let h = img.height;
            if (w > h && w > MAX_DIM) {
              h = Math.round((h * MAX_DIM) / w);
              w = MAX_DIM;
            } else if (h > MAX_DIM) {
              w = Math.round((w * MAX_DIM) / h);
              h = MAX_DIM;
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/jpeg', 0.82);
            setScreenshotBase64(compressed);
          } catch {
            setScreenshotBase64(rawResult);
          }
        };
        img.onerror = () => {
          setScreenshotBase64(rawResult);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.city) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMessage('Please provide a valid email address (e.g. yourname@gmail.com).');
      return;
    }

    if (!selectedFile && !screenshotBase64) {
      setErrorMessage('Please attach a screenshot of your payment receipt before submitting.');
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('city', formData.city);
      data.append('hearSource', formData.hearSource);
      data.append('paymentMethod', formData.paymentMethod || 'easypaisa');
      data.append('courseId', '1');
      if (screenshotBase64) {
        data.append('screenshotBase64', screenshotBase64);
      } else if (selectedFile) {
        data.append('screenshot', selectedFile);
      }

      const res = await fetch('/api/enrollments', {
        method: 'POST',
        body: data
      });

      const text = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {
        json = { success: false, message: 'Server responded with an unexpected format. Please retry.' };
      }

      if (json.success) {
        setSuccessData(json);

        // 3. Purchase / CompletePayment Tracking (strictly idempotent by enrollmentId)
        analytics.trackPurchase({
          order_id: json.enrollmentId || `ENR-${Date.now()}`,
          content_id: 'COURSE-UAE-01',
          content_name: 'Master UAE & KSA Dropshipping',
          content_type: 'product',
          value: 3900,
          currency: 'PKR',
          quantity: 1
        });

        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      } else {
        setErrorMessage(json.message || 'Failed to submit enrollment. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('Network connection error. If payment was made, please contact us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', paddingBottom: '90px' }}>
      
      {/* 1. Header & Urgency Bar */}
      <section style={{
        background: 'linear-gradient(180deg, #0B0F19 0%, #111827 100%)',
        color: '#FFFFFF',
        padding: '54px 0 40px 0',
        textAlign: 'center',
        borderBottom: '1px solid rgba(0, 160, 223, 0.25)',
        marginBottom: '40px'
      }}>
        <div className="site-container">
          <span className="badge-pill badge-cyan" style={{ marginBottom: '14px' }}>
            SECURE ENROLLMENT CHECKOUT
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: '800', lineHeight: 1.2, maxWidth: '800px', margin: '0 auto 12px auto' }}>
            Complete Your Enrollment in <span style={{ color: 'var(--primary)' }}>Sami Mentorship</span>
          </h1>
          <p style={{ color: 'var(--text-subtle)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
            Special 88% Discount Active. Follow the 3 simple steps below to get instant access.
          </p>
        </div>
      </section>

      <div className="site-container" style={{ maxWidth: '900px' }}>
        
        {/* Urgency Countdown & Seats Bar */}
        <CountdownTimer />

        {/* If successfully submitted: Display Success Portal */}
        {successData ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '2px solid var(--accent-green)',
            boxShadow: '0 20px 45px rgba(16, 185, 129, 0.15)',
            padding: '44px 32px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--accent-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <CheckCircle2 size={44} />
            </div>

            <span className="badge-pill badge-green" style={{ marginBottom: '12px' }}>
              APPLICATION SUBMITTED SUCCESSFULLY
            </span>

            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '12px' }}>
              Welcome to the Academy, {successData.details?.name}!
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
              Your enrollment request has been received. Our admissions team is verifying your payment screenshot. You will receive an SMS and WhatsApp confirmation shortly.
            </p>

            {/* Application ID Card */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: 'var(--radius-md)',
              border: '1.5px dashed var(--primary)',
              padding: '18px 24px',
              maxWidth: '440px',
              margin: '0 auto 32px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Your Enrollment ID</div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--primary)', fontFamily: 'monospace' }}>
                  {successData.enrollmentId}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(successData.enrollmentId, 'enr_id')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  backgroundColor: copiedKey === 'enr_id' ? 'var(--accent-green)' : '#FFFFFF',
                  color: copiedKey === 'enr_id' ? '#FFFFFF' : 'var(--text-dark)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {copiedKey === 'enr_id' ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedKey === 'enr_id' ? 'Copied' : 'Copy ID'}</span>
              </button>
            </div>

            {/* Next Step Action Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
              textAlign: 'left',
              marginBottom: '36px'
            }}>
              <div style={{
                backgroundColor: '#0B0F19',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                color: '#FFFFFF',
                border: '1px solid rgba(0, 160, 223, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <GraduationCap size={22} color="var(--primary)" />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Web LMS Classroom Access</h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '18px', lineHeight: 1.5 }}>
                  Once your payment receipt is verified by admissions, your 6-digit Access Code will be sent to your email to start learning on any device (iPhone, Android, Mac, Windows).
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a
                    href="/login"
                    className="btn-primary"
                    style={{ padding: '10px', fontSize: '0.88rem', textAlign: 'center', textDecoration: 'none' }}
                  >
                    Go to Student LMS Login
                  </a>
                </div>
              </div>

              <div style={{
                backgroundColor: '#F0FDF4',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                border: '1px solid rgba(37, 211, 102, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <MessageCircle size={22} color="#16A34A" />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#166534' }}>Instant WhatsApp Verification</h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#15803D', marginBottom: '18px', lineHeight: 1.5 }}>
                  Want fast-track instant approval? Send your Enrollment ID <strong>{successData.enrollmentId}</strong> to our WhatsApp desk.
                </p>
                <a
                  href={CONTACT_CONFIG.getWhatsAppUrl(`Hi Sami! I just submitted my enrollment form. My Enrollment ID is ${successData.enrollmentId}. Please verify my payment.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ backgroundColor: '#25D366', color: '#FFFFFF', padding: '12px', width: '100%', fontSize: '0.9rem' }}
                >
                  <MessageCircle size={18} /> Chat with Admissions
                </a>
              </div>
            </div>

            <a href="/" className="btn-secondary">
              Return to Homepage
            </a>
          </div>
        ) : (
          <>
            {/* 2. 3 Simple Steps Banner */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-light)',
              padding: '36px 28px',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '36px'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <span className="badge-pill badge-cyan" style={{ marginBottom: '10px' }}>QUICK &amp; EASY</span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-dark)' }}>
                  Follow These <span style={{ color: 'var(--primary)' }}>3 Simple Steps</span> to Get Instant Access
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                {[
                  {
                    num: '01',
                    title: 'Deposit the Fee',
                    desc: 'Deposit Rs 3,900 to Meezan Bank, Easypaisa, Card or Binance below.'
                  },
                  {
                    num: '02',
                    title: 'Take a Screenshot',
                    desc: 'Capture a clear screenshot of your transaction receipt.'
                  },
                  {
                    num: '03',
                    title: 'Fill the Form',
                    desc: 'Complete the form below and attach your payment screenshot.'
                  }
                ].map((step, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                      padding: '24px 20px',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      fontSize: '1.8rem',
                      fontWeight: '900',
                      color: 'rgba(0, 160, 223, 0.25)',
                      marginBottom: '8px'
                    }}>
                      {step.num}
                    </div>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '6px' }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Choose Payment Method Selector */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-light)',
              padding: '36px 28px',
              boxShadow: 'var(--shadow-md)',
              marginBottom: '36px'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <span className="badge-pill badge-green" style={{ marginBottom: '8px' }}>SECURE CHECKOUT</span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-dark)' }}>
                  Choose Payment Method
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Select one option below. We will display the exact active payment details you need.
                </p>
              </div>

              {/* Dynamic Category Filter Tabs */}
              {(() => {
                const hasBank = paymentMethods.some(m => m.category === 'bank');
                const hasWallet = paymentMethods.some(m => m.category === 'wallet');
                const hasCrypto = paymentMethods.some(m => m.category === 'crypto');
                const hasCard = paymentMethods.some(m => m.category === 'card');

                const filterTabs = [
                  { id: 'all', label: 'All Methods', icon: '🌟' },
                  ...(hasWallet ? [{ id: 'wallet', label: 'Easypaisa / JazzCash', icon: '📱' }] : []),
                  ...(hasBank ? [{ id: 'bank', label: 'Bank Transfer', icon: '🏦' }] : []),
                  ...(hasCrypto ? [{ id: 'crypto', label: 'Binance / Crypto', icon: '₿' }] : []),
                  ...(hasCard ? [{ id: 'card', label: 'International Card', icon: '💳' }] : [])
                ];

                if (filterTabs.length <= 1) return null;

                return (
                  <div
                    className="checkout-tabs"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${Math.min(filterTabs.length, 4)}, 1fr)`,
                      gap: '10px',
                      marginBottom: '24px'
                    }}
                  >
                    {filterTabs.map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleFilterChange(tab.id)}
                        style={{
                          padding: '12px 8px',
                          borderRadius: 'var(--radius-md)',
                          border: activeFilter === tab.id ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                          backgroundColor: activeFilter === tab.id ? 'rgba(0, 160, 223, 0.08)' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span style={{ fontSize: '1.3rem' }}>{tab.icon}</span>
                        <strong style={{ fontSize: '0.86rem', color: 'var(--text-dark)', textAlign: 'center', lineHeight: 1.2 }}>{tab.label}</strong>
                      </button>
                    ))}
                  </div>
                );
              })()}

              {/* Dynamic Payment Method Cards List */}
              {pmLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading active payment methods...
                </div>
              ) : paymentMethods.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px dashed var(--border-light)' }}>
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>No payment methods currently active. Please contact support on WhatsApp.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {paymentMethods
                    .filter(m => activeFilter === 'all' ? true : m.category === activeFilter)
                    .map((method) => {
                      const isBank = method.category === 'bank';
                      const isWallet = method.category === 'wallet';
                      const isCrypto = method.category === 'crypto';
                      const isCard = method.category === 'card';

                      const borderColor = isWallet ? 'var(--accent-green)' : isBank ? 'var(--primary)' : isCrypto ? 'var(--accent-amber)' : 'var(--border-light)';
                      const iconColor = isWallet ? 'var(--accent-green)' : isBank ? 'var(--primary)' : isCrypto ? 'var(--accent-amber)' : '#A855F7';

                      return (
                        <div
                          key={method.id}
                          style={{
                            backgroundColor: '#F8FAFC',
                            borderRadius: 'var(--radius-md)',
                            border: `1.5px solid ${borderColor}`,
                            padding: '22px',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)'
                          }}
                        >
                          {/* Card Top Title & Badge */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0 }}>
                                  {method.title}
                                </h4>
                                {method.price_display && (
                                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)', backgroundColor: 'rgba(0, 160, 223, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                                    {method.price_display}
                                  </span>
                                )}
                              </div>
                              {method.badge && (
                                <span style={{ fontSize: '0.76rem', color: iconColor, fontWeight: '800', textTransform: 'uppercase', display: 'block', marginTop: '2px' }}>
                                  {method.badge}
                                </span>
                              )}
                            </div>

                            <div style={{ color: iconColor }}>
                              {isBank && <Building size={24} />}
                              {isWallet && <Smartphone size={24} />}
                              {isCrypto && <Coins size={24} />}
                              {isCard && <CreditCard size={24} />}
                              {!isBank && !isWallet && !isCrypto && !isCard && <CreditCard size={24} />}
                            </div>
                          </div>

                          {/* Card Details Table */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
                            
                            {/* Account Title */}
                            {method.account_title && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Account Title / Beneficiary:</span>
                                <strong style={{ color: 'var(--text-dark)' }}>{method.account_title}</strong>
                              </div>
                            )}

                            {/* Account Number / Phone / Pay ID */}
                            {method.account_number && (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: method.iban_or_wallet ? '1px solid #E2E8F0' : 'none', paddingBottom: method.iban_or_wallet ? '8px' : '0' }}>
                                <div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    {isCrypto ? 'Binance Pay ID / Number:' : isWallet ? 'Mobile Account Number:' : 'Account Number:'}
                                  </div>
                                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-dark)', fontFamily: 'monospace' }}>
                                    {method.account_number}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleCopy(method.account_number, `acc_${method.id}`)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 16px',
                                    backgroundColor: copiedKey === `acc_${method.id}` ? 'var(--accent-green)' : 'var(--primary)',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    fontWeight: '700',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {copiedKey === `acc_${method.id}` ? <Check size={16} /> : <Copy size={16} />}
                                  <span>{copiedKey === `acc_${method.id}` ? 'Copied!' : 'Copy'}</span>
                                </button>
                              </div>
                            )}

                            {/* IBAN / Wallet Address */}
                            {method.iban_or_wallet && (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    {isCrypto ? 'USDT / BNB Wallet Address:' : 'IBAN Number:'}
                                  </div>
                                  <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-dark)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                    {method.iban_or_wallet}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleCopy(method.iban_or_wallet, `iban_${method.id}`)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 14px',
                                    backgroundColor: copiedKey === `iban_${method.id}` ? 'var(--accent-green)' : '#FFFFFF',
                                    color: copiedKey === `iban_${method.id}` ? '#FFFFFF' : 'var(--text-dark)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontWeight: '700',
                                    fontSize: '0.82rem',
                                    cursor: 'pointer',
                                    flexShrink: 0
                                  }}
                                >
                                  {copiedKey === `iban_${method.id}` ? <Check size={15} /> : <Copy size={15} />}
                                  <span>{copiedKey === `iban_${method.id}` ? 'Copied!' : 'Copy'}</span>
                                </button>
                              </div>
                            )}

                            {/* External Card Checkout URL */}
                            {method.checkout_url && (
                              <div style={{ marginTop: '6px' }}>
                                <a
                                  href={method.checkout_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-primary"
                                  style={{ width: '100%', padding: '12px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                  <span>Proceed to Online Checkout ({method.price_display || '$15 USD'})</span>
                                  <ExternalLink size={16} />
                                </a>
                              </div>
                            )}

                            {/* Instructions */}
                            {method.instructions && (
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0 0', lineHeight: 1.4, fontStyle: 'italic' }}>
                                ℹ️ {method.instructions}
                              </p>
                            )}

                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

            </div>

            {/* 4. Enrollment Submission Form */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-light)',
              padding: '36px 32px',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <span className="badge-pill badge-amber" style={{ marginBottom: '8px' }}>LAST STEP</span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-dark)' }}>
                  Fill Out &amp; Submit Your Details
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                  As soon as you submit, our admissions team will verify your receipt and provision your LMS access.
                </p>
              </div>

              {errorMessage && (
                <div style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid var(--accent-red)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'var(--accent-red)',
                  fontWeight: '600',
                  fontSize: '0.92rem',
                  marginBottom: '24px'
                }}>
                  <AlertCircle size={20} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Row 1: Names */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '6px' }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muhammad"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ali"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                </div>

                {/* Row 2: Email & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '6px' }}>
                      Email Address * <span style={{ color: 'var(--primary)', fontSize: '0.78rem', fontWeight: '600' }}>(For LMS Account Login)</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      WhatsApp Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+92 300 1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                </div>

                {/* Row 3: City & Source */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '6px' }}>
                      Your City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karachi, Lahore, Rawalpindi"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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
                      Where did you hear about Sami?
                    </label>
                    <select
                      value={formData.hearSource}
                      onChange={(e) => setFormData({ ...formData, hearSource: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        fontSize: '0.95rem',
                        outline: 'none',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <option value="TikTok">TikTok</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Friend/Referral">Friend / Referral</option>
                    </select>
                  </div>
                </div>

                {/* Selected Payment Method Used to Deposit */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '6px' }}>
                    Payment Account Used to Deposit *
                  </label>
                  <select
                    required
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--primary)',
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      color: 'var(--text-dark)',
                      outline: 'none',
                      backgroundColor: '#F0F9FF'
                    }}
                  >
                    {paymentMethods.map(pm => (
                      <option key={pm.id} value={pm.method_key || pm.title}>
                        {pm.title} {pm.account_number ? `(${pm.account_number})` : ''} — {pm.price_display || 'PKR 3,900'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Upload Payment Screenshot Box */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '8px' }}>
                    Upload Payment Screenshot / Receipt *
                  </label>

                  <div style={{
                    border: '2px dashed var(--primary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '28px 20px',
                    textAlign: 'center',
                    backgroundColor: 'rgba(0, 160, 223, 0.03)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}>
                    <input
                      type="file"
                      required
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        opacity: 0,
                        cursor: 'pointer',
                        width: '100%',
                        height: '100%'
                      }}
                    />

                    {selectedFile ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        {filePreview && (
                          <img
                            src={filePreview}
                            alt="Receipt Preview"
                            style={{ maxWidth: '140px', maxHeight: '140px', borderRadius: '6px', objectFit: 'contain', border: '1px solid var(--border-light)' }}
                          />
                        )}
                        <span style={{ color: 'var(--accent-green)', fontWeight: '700', fontSize: '0.92rem' }}>
                          ✓ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Click or drop another file to replace</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <UploadCloud size={38} color="var(--primary)" />
                        <span style={{ fontWeight: '700', color: 'var(--text-dark)', fontSize: '0.95rem' }}>
                          Tap to select or drop payment screenshot
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Supports JPG, PNG, WEBP &amp; PDF (Max 10MB)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '1.15rem',
                    fontWeight: '800',
                    marginTop: '10px'
                  }}
                >
                  {submitting ? 'Verifying & Submitting...' : 'Submit Enrollment & Claim Access (PKR 3,900)'}
                </button>

                <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  🔒 256-Bit SSL Encrypted &bull; 100% Safe &amp; Verified Admissions
                </div>

              </form>
            </div>
          </>
        )}

      </div>

      <style>{`
        @media (max-width: 640px) {
          .checkout-tabs {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
