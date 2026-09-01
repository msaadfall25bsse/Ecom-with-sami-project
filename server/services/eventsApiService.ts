// Server-Side TikTok & Meta Events API (CAPI) Service
// Handles server-to-server event dispatching with shared event_id deduplication

import { db } from '../db/index.js';

export interface ServerEventPayload {
  event: 'CompletePayment' | 'InitiateCheckout' | 'ViewContent' | 'Contact' | 'CompleteRegistration';
  event_id: string;
  user_email?: string;
  user_phone?: string;
  value?: number;
  currency?: string;
  content_id?: string;
  content_name?: string;
  content_type?: string;
  ip_address?: string;
  user_agent?: string;
}

class EventsApiService {
  /**
   * Dispatch server-side event to TikTok Events API
   * Uses SHA-256 hashed PII (email, phone) for privacy-safe attribution matching
   */
  public async trackTikTokServerEvent(payload: ServerEventPayload): Promise<boolean> {
    try {
      // 1. Retrieve active TikTok pixel configuration from database or env
      const pixelRow = db.prepare(`
        SELECT pixel_id FROM tracking_pixels 
        WHERE platform_name = 'TikTok Pixel' AND is_active = 1 
        LIMIT 1
      `).get() as { pixel_id: string } | undefined;

      const pixelId = process.env.TIKTOK_PIXEL_ID || pixelRow?.pixel_id;
      const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

      // If token not configured yet, skip gracefully without breaking app
      if (!accessToken || !pixelId) {
        return false;
      }

      // 2. Prepare payload for TikTok Events API (v1.3)
      const body = {
        pixel_code: pixelId,
        event: payload.event,
        event_id: payload.event_id,
        timestamp: new Date().toISOString(),
        context: {
          ip: payload.ip_address,
          user_agent: payload.user_agent,
          user: {
            email: payload.user_email ? this.sha256(payload.user_email.trim().toLowerCase()) : undefined,
            phone_number: payload.user_phone ? this.sha256(payload.user_phone.trim()) : undefined
          }
        },
        properties: {
          currency: payload.currency || 'PKR',
          value: payload.value || 3900,
          contents: payload.content_id ? [
            {
              content_id: payload.content_id,
              content_name: payload.content_name || 'Dropshipping Mastery',
              content_type: payload.content_type || 'product',
              quantity: 1,
              price: payload.value || 3900
            }
          ] : []
        }
      };

      const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken
        },
        body: JSON.stringify(body)
      });

      const resJson = await response.json();
      return resJson.code === 0;
    } catch (err) {
      console.warn('[EventsApiService] TikTok Server Events API call failed gracefully:', err);
      return false;
    }
  }

  private sha256(str: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(str).digest('hex');
  }
}

export const eventsApiService = new EventsApiService();
