import { useState, useEffect } from 'react';

export interface ContactConfigData {
  whatsappNumber: string;
  displayPhone: string;
  adminWhatsApp: string;
  cleanAdminWhatsApp: string;
  whatsappGroupUrl: string;
  email: string;
  supportHours: string;
  headOffice: string;
  regionalOffice: string;
  whatsappDefaultMessage: string;
}

const defaultContactConfig: ContactConfigData = {
  // Primary Storefront WhatsApp Number (digits only for wa.me)
  whatsappNumber: '923330093269',

  // Formatted Display Phone Number
  displayPhone: '+92 333 0093269',

  // Student LMS Admin Desk WhatsApp Number
  adminWhatsApp: '+92 333 0093269',
  cleanAdminWhatsApp: '923330093269',

  // VIP Student WhatsApp Group Link
  whatsappGroupUrl: 'https://chat.whatsapp.com/sami-mentorship-mastermind',

  // Official Support Email
  email: 'support@ecomwithsami.com',

  // Support Timings
  supportHours: 'Mon–Sat, 9:00 AM – 5:00 PM PKT',

  // Office Locations
  headOffice: 'Mehdi Tower, Shahrah-e-Faisal, Karachi, Pakistan',
  regionalOffice: 'Business Bay, Dubai (UAE) & Olaya District, Riyadh (KSA)',

  // Default Inquiries Message
  whatsappDefaultMessage: 'Hi Sami! I want to enroll in the UAE & KSA Dropshipping Course (PKR 3,900). Can you help me?'
};

// Global in-memory cache
let currentConfig: ContactConfigData = { ...defaultContactConfig };
const listeners = new Set<(cfg: ContactConfigData) => void>();
let isFetching = false;
let hasFetched = false;

function notifyListeners() {
  listeners.forEach(cb => {
    try { cb({ ...currentConfig }); } catch {}
  });
}

/**
 * Fetch latest dynamic contact configuration from server
 */
export async function fetchContactConfig(): Promise<ContactConfigData> {
  if (typeof window === 'undefined') return currentConfig;
  
  try {
    isFetching = true;
    const res = await fetch('/api/public/contact-config');
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        currentConfig = {
          whatsappNumber: data.whatsappNumber || currentConfig.whatsappNumber,
          displayPhone: data.displayPhone || currentConfig.displayPhone,
          adminWhatsApp: data.adminWhatsApp || currentConfig.adminWhatsApp,
          cleanAdminWhatsApp: data.cleanAdminWhatsApp || (data.adminWhatsApp ? data.adminWhatsApp.replace(/[^0-9]/g, '') : currentConfig.cleanAdminWhatsApp),
          whatsappGroupUrl: data.whatsappGroupUrl || currentConfig.whatsappGroupUrl,
          email: data.email || currentConfig.email,
          supportHours: data.supportHours || currentConfig.supportHours,
          headOffice: data.headOffice || currentConfig.headOffice,
          regionalOffice: data.regionalOffice || currentConfig.regionalOffice,
          whatsappDefaultMessage: data.whatsappDefaultMessage || currentConfig.whatsappDefaultMessage
        };
        hasFetched = true;
        notifyListeners();
      }
    }
  } catch (err) {
    // Fallback to currentConfig
  } finally {
    isFetching = false;
  }
  return currentConfig;
}

/**
 * Helper to build custom wa.me chat URLs
 */
export function buildWhatsAppUrl(message?: string, numberOverride?: string): string {
  const number = (numberOverride || currentConfig.whatsappNumber || '923330093269').replace(/[^0-9]/g, '');
  const msg = message || currentConfig.whatsappDefaultMessage;
  const encoded = encodeURIComponent(msg);
  return `https://wa.me/${number}?text=${encoded}`;
}

/**
 * Helper to build Admin LMS Support wa.me link
 */
export function buildLmsSupportWhatsAppUrl(message?: string): string {
  const number = (currentConfig.cleanAdminWhatsApp || currentConfig.adminWhatsApp || currentConfig.whatsappNumber || '923330093269').replace(/[^0-9]/g, '');
  const msg = message || 'Hello Admin! I need assistance with my LMS Student Account.';
  const encoded = encodeURIComponent(msg);
  return `https://wa.me/${number}?text=${encoded}`;
}

/**
 * Backward-compatible CONTACT_CONFIG object
 */
export const CONTACT_CONFIG = {
  get whatsappNumber() { return currentConfig.whatsappNumber; },
  get displayPhone() { return currentConfig.displayPhone; },
  get adminWhatsApp() { return currentConfig.adminWhatsApp; },
  get cleanAdminWhatsApp() { return currentConfig.cleanAdminWhatsApp; },
  get whatsappGroupUrl() { return currentConfig.whatsappGroupUrl; },
  get email() { return currentConfig.email; },
  get supportHours() { return currentConfig.supportHours; },
  get headOffice() { return currentConfig.headOffice; },
  get regionalOffice() { return currentConfig.regionalOffice; },
  get whatsappDefaultMessage() { return currentConfig.whatsappDefaultMessage; },

  getWhatsAppUrl: (customMessage?: string, numberOverride?: string) => buildWhatsAppUrl(customMessage, numberOverride),
  getLmsSupportWhatsAppUrl: (customMessage?: string) => buildLmsSupportWhatsAppUrl(customMessage),
  getGroupInviteUrl: () => currentConfig.whatsappGroupUrl
};

/**
 * React Hook to subscribe to live dynamic contact & WhatsApp settings
 */
export function useContactConfig() {
  const [config, setConfig] = useState<ContactConfigData>({ ...currentConfig });

  useEffect(() => {
    const updateHandler = (newCfg: ContactConfigData) => {
      setConfig(newCfg);
    };

    listeners.add(updateHandler);

    if (!hasFetched && !isFetching) {
      fetchContactConfig();
    }

    return () => {
      listeners.delete(updateHandler);
    };
  }, []);

  return {
    ...config,
    getWhatsAppUrl: (message?: string, numberOverride?: string) => buildWhatsAppUrl(message, numberOverride || config.whatsappNumber),
    getLmsSupportWhatsAppUrl: (message?: string) => buildLmsSupportWhatsAppUrl(message),
    getGroupInviteUrl: () => config.whatsappGroupUrl || defaultContactConfig.whatsappGroupUrl,
    refreshContactConfig: fetchContactConfig
  };
}

// Auto-trigger fetch on client initialization if in browser
if (typeof window !== 'undefined') {
  setTimeout(() => {
    fetchContactConfig();
  }, 100);
}
