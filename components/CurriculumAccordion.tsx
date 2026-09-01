import React, { useState } from 'react';
import { ChevronDown, CheckCircle2, PlayCircle, Clock } from 'lucide-react';

interface ModuleItem {
  id?: number;
  module_number: string;
  title: string;
  description: string;
  lesson_count?: number;
  lessons?: { title: string; duration?: string }[];
}

export function CurriculumAccordion({ modules }: { modules?: ModuleItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const defaultModules: ModuleItem[] = [
    {
      module_number: '01',
      title: 'The Right Mindset to Actually Succeed',
      description: 'The common beginner mistakes that make most people quit, business fundamentals, mental resilience, and daily routine.',
      lessons: [
        { title: 'The common mistakes that make beginners quit early', duration: '12:40' },
        { title: 'Treating your store like a real cash-flow business', duration: '18:15' },
        { title: 'Staying consistent and focused through your first week', duration: '14:20' }
      ]
    },
    {
      module_number: '02',
      title: 'Set Up Your High-Converting Shopify Store (Paid Theme Free)',
      description: 'Theme customization, premium layout, ChatGPT product description prompts, and essential trust elements.',
      lessons: [
        { title: 'Picking a brand name that customers instantly trust', duration: '15:10' },
        { title: 'Installing and customizing your premium Shopify theme', duration: '24:35' },
        { title: 'High-converting product page layout blueprint', duration: '21:50' },
        { title: 'ChatGPT prompts to write persuasive product descriptions', duration: '16:40' }
      ]
    },
    {
      module_number: '03',
      title: 'Finding Winning Products (No Paid Tools Needed)',
      description: 'TikTok Creative Center, Facebook Ad Library, organic spy methods, and viral testing criteria.',
      lessons: [
        { title: 'The 3-point winning product criteria for UAE & KSA', duration: '19:45' },
        { title: 'Spying on profitable ads using TikTok Ad Library', duration: '22:15' },
        { title: 'Finding viral products on Instagram Reels and Pinterest', duration: '17:30' }
      ]
    },
    {
      module_number: '04',
      title: 'Testing Products the Smart Way (Low Budget)',
      description: '3-step validation framework, testing spreadsheets, knowing when to kill or push a product harder.',
      lessons: [
        { title: 'Setting up low-budget product validation campaigns', duration: '18:50' },
        { title: 'Reading initial metrics: CPC, CTR, and Add-to-Carts', duration: '20:10' },
        { title: 'Product validation tracking sheet walkthrough', duration: '14:05' }
      ]
    },
    {
      module_number: '05',
      title: 'TikTok Ads — From First Campaign to Pro',
      description: 'TikTok Agency Ad account setup for free, Business Center, Pixel integration, and campaign architecture.',
      lessons: [
        { title: 'How to get a TikTok Agency Account for free', duration: '16:20' },
        { title: 'Connecting TikTok Pixel to Shopify flawlessly', duration: '19:40' },
        { title: 'Launching your first test campaign step-by-step', duration: '28:15' },
        { title: 'Analyzing TikTok Ad metrics and identifying winning creatives', duration: '23:30' }
      ]
    },
    {
      module_number: '06',
      title: 'Facebook & Instagram Ads Mastery (2026 Strategy)',
      description: 'Meta Business Suite, Conversion API (CAPI) setup, audience targeting, and creative testing.',
      lessons: [
        { title: 'Setting up Meta Business Suite & avoiding account bans', duration: '25:10' },
        { title: 'Facebook Pixel + Conversions API (CAPI) setup', duration: '21:00' },
        { title: 'Broad vs Interest targeting in UAE & Saudi Arabia', duration: '24:45' },
        { title: 'Retargeting campaigns to recover abandoned checkouts', duration: '18:30' }
      ]
    },
    {
      module_number: '07',
      title: 'Making Scroll-Stopping Video Ads on Your Phone',
      description: '3-second hook formula, AI video scripts, CapCut editing templates, and Arabic voiceovers.',
      lessons: [
        { title: 'The 3-second hook formula that stops the scroll', duration: '15:25' },
        { title: 'Filming and editing engaging UGC video ads on mobile', duration: '22:10' },
        { title: 'Using AI voiceovers and Arabic subtitles for GCC buyers', duration: '17:40' }
      ]
    },
    {
      module_number: '08',
      title: '5 Proven Scaling Strategies (CBO & Horizontal Scaling)',
      description: 'Budget doubling rules, lookalike audiences, Advantage+ campaigns, and multi-market expansion.',
      lessons: [
        { title: 'Vertical vs Horizontal scaling explained simply', duration: '20:50' },
        { title: 'Advantage+ Campaign Budget Optimization (CBO) scaling', duration: '26:15' },
        { title: 'Expanding winning products from UAE into Saudi Arabia', duration: '19:30' }
      ]
    },
    {
      module_number: '09',
      title: 'Turning Visitors Into Real Cash Orders (COD Optimization)',
      description: 'Cash on Delivery checkout optimization, WhatsApp order confirmation, and reducing return rates.',
      lessons: [
        { title: 'Building trust for Cash on Delivery (COD) shoppers', duration: '21:15' },
        { title: 'Setting up 1-click COD checkout forms on Shopify', duration: '18:40' },
        { title: 'Automating WhatsApp order confirmation to boost delivery rate to 85%+', duration: '24:00' }
      ]
    },
    {
      module_number: '10',
      title: 'Verified UAE & Saudi Arabia Suppliers Directory',
      description: 'Direct supplier contacts, fast shipping fulfillment centers, and private packaging agreements.',
      lessons: [
        { title: 'How local dropshipping fulfillment works in Dubai and Riyadh', duration: '23:10' },
        { title: 'Direct supplier contacts directory & negotiation scripts', duration: '27:45' },
        { title: 'Managing cash flow and courier payouts', duration: '19:15' }
      ]
    },
    {
      module_number: '11',
      title: 'Lifetime Mentorship & Live Support Ecosystem',
      description: 'Weekly live coaching calls, community networking, and ad account troubleshooting.',
      lessons: [
        { title: 'Joining the private Discord and WhatsApp mastermind groups', duration: '11:20' },
        { title: 'How to participate in weekly live ad audits with Sami', duration: '14:50' }
      ]
    }
  ];

  const list = (modules && modules.length > 0) ? modules : defaultModules;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '920px', margin: '0 auto', width: '100%' }}>
      {list.map((m, idx) => {
        const isOpen = openIndex === idx;
        const num = m.module_number || String(idx + 1).padStart(2, '0');
        const lessonItems = m.lessons || [
          { title: 'Step-by-step practical implementation', duration: '18:00' },
          { title: 'Live store demo & action items', duration: '22:30' }
        ];

        return (
          <div
            key={idx}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: isOpen ? '1.5px solid #00A0DF' : '1px solid #E2E8F0',
              boxShadow: isOpen ? '0 8px 24px rgba(0, 160, 223, 0.12)' : '0 2px 4px rgba(0,0,0,0.02)',
              overflow: 'hidden',
              transition: 'all 0.25s ease'
            }}
          >
            {/* Accordion Header */}
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="curriculum-item-btn"
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: isOpen ? '#00A0DF' : 'rgba(0, 160, 223, 0.1)',
                  color: isOpen ? '#FFFFFF' : '#00A0DF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  flexShrink: 0
                }}>
                  {num}
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A', marginBottom: '2px', lineHeight: 1.3 }}>
                    {m.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.4, margin: 0 }}>
                    {m.description}
                  </p>
                </div>
              </div>

              <div style={{
                color: isOpen ? '#00A0DF' : '#64748B',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s ease',
                flexShrink: 0
              }}>
                <ChevronDown size={20} />
              </div>
            </button>

            {/* Accordion Content (Lessons Breakdown) */}
            {isOpen && (
              <div style={{
                padding: '0 20px 18px 20px',
                borderTop: '1px solid #F1F5F9',
                backgroundColor: '#FAFCFE'
              }}>
                <div style={{ paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {lessonItems.map((les, lIdx) => (
                    <div
                      key={lIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px solid #EDF2F7',
                        fontSize: '0.84rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
                        <PlayCircle size={16} color="#00A0DF" style={{ flexShrink: 0 }} />
                        <span>{les.title}</span>
                      </div>
                      {les.duration && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B', fontSize: '0.76rem', fontWeight: '600', flexShrink: 0 }}>
                          <Clock size={12} /> {les.duration}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
