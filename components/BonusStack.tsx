import React, { useState, useEffect } from 'react';
import { Gift, Video, CheckCircle2, BookOpen, Calculator, LayoutTemplate, Sparkles, Star } from 'lucide-react';

export function BonusStack({ customData }: { customData?: any }) {
  const [bonusData, setBonusData] = useState<any>(customData || {
    tag: '🎁 FREE BONUSES',
    title: 'Free Bonuses Worth',
    highlight_value: 'Rs 30,000+',
    subtitle: 'Enroll in the course today and get these 6 exclusive power resources 100% FREE with your enrollment.',
    items: [
      { title: 'Weekly 2-Hour Live Class', desc: 'Join live coaching sessions every week with Sami to review ads, solve problems & stay on track.', value: 'Rs 10,000' },
      { title: 'Live Campaign & Pixel Audits', desc: 'Get your live ad campaigns and TikTok/Facebook pixels audited so you know exactly what to scale.', value: 'Rs 7,500' },
      { title: 'Facebook Zero to Hero E-Book', desc: 'A complete step-by-step PDF manual taking you from total beginner to confident advertiser.', value: 'Rs 3,500' },
      { title: 'Dropshipping P&L Margin Calculator', desc: 'Know your exact profit margins, product costs, ad budgets, and COD delivery returns in Excel.', value: 'Rs 3,000' },
      { title: 'Ultra-Fast Premium Shopify Themes', desc: 'Ready-to-use premium store themes optimized for mobile conversions and Arabic RTL layout.', value: 'Rs 4,000' },
      { title: '30+ High-Converting ChatGPT Prompts Pack', desc: 'Instant AI prompts to write compelling product descriptions, viral video hooks, and ad copy.', value: 'Rs 2,500' }
    ]
  });

  useEffect(() => {
    if (customData) {
      setBonusData(customData);
      return;
    }
    fetch('/api/public/cms-content')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.sections?.bonuses) {
          setBonusData(data.sections.bonuses);
        }
      })
      .catch(() => {});
  }, [customData]);

  const items = bonusData.items || [];

  return (
    <div className="lwaFbCard">
      {/* Top Banner Accent */}
      <span className="lwaFbBar" />

      {/* Header */}
      <div className="lwaFbHead">
        <span className="lwaFbTag">
          <Gift size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
          {bonusData.tag || '🎁 FREE BONUSES'}
        </span>
        <h2 className="lwaFbTitle">
          {bonusData.title || 'Free Bonuses Worth'} <span>{bonusData.highlight_value || 'Rs 30,000+'}</span>
        </h2>
        <p className="lwaFbSub">
          {bonusData.subtitle || 'Enroll in the course today and get these 6 exclusive power resources 100% FREE with your enrollment.'}
        </p>
      </div>

      {/* Grid */}
      <div className="lwaFbGrid">
        {items.map((b: any, idx: number) => (
          <div key={idx} className="lwaFbItem">
            <div>
              <div className="lwaFbIc">
                <Gift size={22} color="#00A0DF" />
              </div>
              <div className="lwaFbTxt">
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            </div>

            <div className="lwaFbVal">
              <span style={{ fontSize: '0.82rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                {b.value || b.val || 'Rs 5,000'}
              </span>
              <span className="lwaFbFree">
                FREE
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Value Summary Bar */}
      <div className="lwaFbTotal">
        <div className="lwaFbTotalL">
          🎁 TOTAL BONUS VALUE: Rs 30,000+
        </div>
        <div className="lwaFbTotalR">
          FREE with enrollment today
        </div>
      </div>

      <div className="lwaFbCta">
        <a href="/enrollment" className="lwaFbBtn">
          Claim All 6 Free Bonuses (PKR 3,900)
        </a>
      </div>
    </div>
  );
}
