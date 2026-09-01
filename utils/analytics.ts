// Production-Ready Unified Analytics & Pixel Tracking Manager
// Supports TikTok Pixel (Standard & Full-Funnel Events), Meta Pixel (fbq), GA4 (gtag), and Snapchat Pixel (snaptr)

declare global {
  interface Window {
    ttq?: any;
    fbq?: any;
    gtag?: any;
    snaptr?: any;
    dataLayer?: any[];
  }
}

export interface ProductEventParams {
  content_id: string;
  content_name: string;
  content_type?: string;
  value: number;
  currency: string;
  quantity?: number;
  description?: string;
}

export interface CheckoutEventParams extends ProductEventParams {
  num_items?: number;
}

export interface PurchaseEventParams extends ProductEventParams {
  order_id: string;
  event_id?: string;
}

export interface PaymentInfoEventParams {
  value: number;
  currency: string;
  payment_type?: string;
  content_id?: string;
}

// In-memory & sessionStorage event deduplication registry
const memoryEventRegistry = new Set<string>();

function isEventDuplicate(eventKey: string): boolean {
  if (typeof window === 'undefined') return true;
  
  if (memoryEventRegistry.has(eventKey)) {
    return true;
  }

  try {
    const sessionKey = `analytics_event_${eventKey}`;
    if (sessionStorage.getItem(sessionKey)) {
      return true;
    }
  } catch (e) {}

  return false;
}

function markEventFired(eventKey: string, persistInSession = false): void {
  if (typeof window === 'undefined') return;

  memoryEventRegistry.add(eventKey);

  if (persistInSession) {
    try {
      const sessionKey = `analytics_event_${eventKey}`;
      sessionStorage.setItem(sessionKey, String(Date.now()));
    } catch (e) {}
  }
}

class AnalyticsManager {
  private lastTrackedPath = '';

  // 1. PageView Event (with SPA navigation deduplication)
  public trackPageView(urlPath?: string): void {
    if (typeof window === 'undefined') return;

    const currentPath = urlPath || window.location.pathname;
    if (this.lastTrackedPath === currentPath) {
      return; // Deduplicate identical SPA route triggers
    }
    this.lastTrackedPath = currentPath;

    try {
      // TikTok Pixel PageView
      if (window.ttq && typeof window.ttq.page === 'function') {
        window.ttq.page();
      }

      // Meta Pixel PageView
      if (window.fbq && typeof window.fbq === 'function') {
        window.fbq('track', 'PageView');
      }

      // Google Analytics PageView
      if (window.gtag && typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', { page_path: currentPath });
      }

      // Snapchat Pixel PageView
      if (window.snaptr && typeof window.snaptr === 'function') {
        window.snaptr('track', 'PAGE_VIEW');
      }
    } catch (err) {
      // Never throw errors to user UI
      console.warn('[AnalyticsManager] PageView tracking failed silently:', err);
    }
  }

  // 2. ViewContent Event (Course/Product Details Page)
  public trackViewContent(params: ProductEventParams): void {
    if (typeof window === 'undefined') return;

    const dedupeKey = `ViewContent:${params.content_id}`;
    if (isEventDuplicate(dedupeKey)) return;
    markEventFired(dedupeKey);

    const payload = {
      content_id: params.content_id,
      content_name: params.content_name,
      content_type: params.content_type || 'product',
      value: params.value,
      currency: params.currency || 'PKR',
      quantity: params.quantity || 1
    };

    try {
      // TikTok Pixel ViewContent
      if (window.ttq && typeof window.ttq.track === 'function') {
        window.ttq.track('ViewContent', payload);
      }

      // Meta Pixel ViewContent
      if (window.fbq && typeof window.fbq === 'function') {
        window.fbq('track', 'ViewContent', payload);
      }

      // GA4 view_item
      if (window.gtag && typeof window.gtag === 'function') {
        window.gtag('event', 'view_item', {
          items: [{ item_id: params.content_id, item_name: params.content_name, price: params.value, quantity: 1 }],
          value: params.value,
          currency: params.currency
        });
      }
    } catch (err) {
      console.warn('[AnalyticsManager] ViewContent tracking failed silently:', err);
    }
  }

  // 3. InitiateCheckout Event (When entering /enrollment or starting purchase)
  public trackInitiateCheckout(params: CheckoutEventParams): void {
    if (typeof window === 'undefined') return;

    const dedupeKey = `InitiateCheckout:${params.content_id}`;
    if (isEventDuplicate(dedupeKey)) return;
    markEventFired(dedupeKey);

    const payload = {
      content_id: params.content_id,
      content_name: params.content_name,
      content_type: params.content_type || 'product',
      value: params.value,
      currency: params.currency || 'PKR',
      quantity: params.quantity || 1
    };

    try {
      // TikTok Pixel InitiateCheckout
      if (window.ttq && typeof window.ttq.track === 'function') {
        window.ttq.track('InitiateCheckout', payload);
      }

      // Meta Pixel InitiateCheckout
      if (window.fbq && typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout', payload);
      }

      // GA4 begin_checkout
      if (window.gtag && typeof window.gtag === 'function') {
        window.gtag('event', 'begin_checkout', {
          items: [{ item_id: params.content_id, item_name: params.content_name, price: params.value, quantity: 1 }],
          value: params.value,
          currency: params.currency
        });
      }
    } catch (err) {
      console.warn('[AnalyticsManager] InitiateCheckout tracking failed silently:', err);
    }
  }

  // 4. AddPaymentInfo Event (When selecting/filling payment method)
  public trackAddPaymentInfo(params: PaymentInfoEventParams): void {
    if (typeof window === 'undefined') return;

    const dedupeKey = `AddPaymentInfo:${params.payment_type || 'default'}`;
    if (isEventDuplicate(dedupeKey)) return;
    markEventFired(dedupeKey);

    const payload = {
      value: params.value,
      currency: params.currency || 'PKR',
      payment_type: params.payment_type || 'direct_transfer'
    };

    try {
      // TikTok Pixel AddPaymentInfo
      if (window.ttq && typeof window.ttq.track === 'function') {
        window.ttq.track('AddPaymentInfo', payload);
      }

      // Meta Pixel AddPaymentInfo
      if (window.fbq && typeof window.fbq === 'function') {
        window.fbq('track', 'AddPaymentInfo', payload);
      }

      // GA4 add_payment_info
      if (window.gtag && typeof window.gtag === 'function') {
        window.gtag('event', 'add_payment_info', {
          value: params.value,
          currency: params.currency,
          payment_type: params.payment_type
        });
      }
    } catch (err) {
      console.warn('[AnalyticsManager] AddPaymentInfo tracking failed silently:', err);
    }
  }

  // 5. Purchase / CompletePayment Event (STRICTLY IDEMPOTENT BY ORDER ID)
  public trackPurchase(params: PurchaseEventParams): void {
    if (typeof window === 'undefined') return;

    // Idempotency check with persistent session guard against refresh & re-render
    const dedupeKey = `Purchase:${params.order_id}`;
    if (isEventDuplicate(dedupeKey)) {
      return;
    }
    markEventFired(dedupeKey, true); // Persisted across reloads

    const eventId = params.event_id || `order_${params.order_id}`;
    const payload = {
      content_id: params.content_id,
      content_name: params.content_name,
      content_type: params.content_type || 'product',
      value: params.value,
      currency: params.currency || 'PKR',
      quantity: params.quantity || 1,
      order_id: params.order_id,
      event_id: eventId
    };

    try {
      // TikTok Pixel CompletePayment (Standard TikTok Purchase conversion event)
      if (window.ttq && typeof window.ttq.track === 'function') {
        window.ttq.track('CompletePayment', payload, { event_id: eventId });
      }

      // Meta Pixel Purchase
      if (window.fbq && typeof window.fbq === 'function') {
        window.fbq('track', 'Purchase', payload, { eventID: eventId });
      }

      // GA4 purchase
      if (window.gtag && typeof window.gtag === 'function') {
        window.gtag('event', 'purchase', {
          transaction_id: params.order_id,
          value: params.value,
          currency: params.currency,
          items: [{ item_id: params.content_id, item_name: params.content_name, price: params.value, quantity: params.quantity || 1 }]
        });
      }
    } catch (err) {
      console.warn('[AnalyticsManager] Purchase tracking failed silently:', err);
    }
  }

  // 6. SubmitForm Event (Support / Contact / Lead Forms)
  public trackSubmitForm(params: { form_name: string }): void {
    if (typeof window === 'undefined') return;

    try {
      // TikTok Pixel SubmitForm
      if (window.ttq && typeof window.ttq.track === 'function') {
        window.ttq.track('SubmitForm', { form_name: params.form_name });
      }

      // Meta Pixel Lead
      if (window.fbq && typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', { content_name: params.form_name });
      }

      // GA4 generate_lead
      if (window.gtag && typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', { form_name: params.form_name });
      }
    } catch (err) {
      console.warn('[AnalyticsManager] SubmitForm tracking failed silently:', err);
    }
  }

  // 7. Contact Event (WhatsApp Chat Click / Email Click)
  public trackContact(params: { contact_channel: string }): void {
    if (typeof window === 'undefined') return;

    try {
      // TikTok Pixel Contact
      if (window.ttq && typeof window.ttq.track === 'function') {
        window.ttq.track('Contact', { contact_channel: params.contact_channel });
      }

      // Meta Pixel Contact
      if (window.fbq && typeof window.fbq === 'function') {
        window.fbq('track', 'Contact', { content_name: params.contact_channel });
      }

      // GA4 contact
      if (window.gtag && typeof window.gtag === 'function') {
        window.gtag('event', 'contact', { method: params.contact_channel });
      }
    } catch (err) {
      console.warn('[AnalyticsManager] Contact tracking failed silently:', err);
    }
  }

  // 8. CompleteRegistration Event (Student Account Provisioning)
  public trackCompleteRegistration(params: { user_id?: string; email?: string }): void {
    if (typeof window === 'undefined') return;

    const dedupeKey = `CompleteRegistration:${params.user_id || params.email || 'user'}`;
    if (isEventDuplicate(dedupeKey)) return;
    markEventFired(dedupeKey, true);

    try {
      // TikTok Pixel CompleteRegistration
      if (window.ttq && typeof window.ttq.track === 'function') {
        window.ttq.track('CompleteRegistration', { status: 'success' });
      }

      // Meta Pixel CompleteRegistration
      if (window.fbq && typeof window.fbq === 'function') {
        window.fbq('track', 'CompleteRegistration', { status: 'success' });
      }

      // GA4 sign_up
      if (window.gtag && typeof window.gtag === 'function') {
        window.gtag('event', 'sign_up', { method: 'email' });
      }
    } catch (err) {
      console.warn('[AnalyticsManager] CompleteRegistration tracking failed silently:', err);
    }
  }
}

export const analytics = new AnalyticsManager();
