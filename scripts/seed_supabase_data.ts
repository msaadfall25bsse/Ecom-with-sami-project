import { supabase } from '../utils/supabaseClient.js';

const defaultPaymentMethods = [
  {
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
    method_key: 'meezan_bank',
    title: 'Meezan Bank Transfer',
    category: 'bank',
    badge: 'DIRECT IBFT / RAAST',
    account_title: 'SARDAR SAMIULLAH',
    account_number: '0015010112560119',
    iban_or_wallet: 'PK94MEZN0015010112560119',
    checkout_url: '',
    instructions: 'Transfer to Meezan Bank via Raast ID / IBFT and upload confirmation screenshot.',
    price_display: 'PKR 3,900',
    is_active: 1,
    display_order: 4
  },
  {
    method_key: 'binance_crypto',
    title: 'Binance Pay & USDT (Crypto)',
    category: 'crypto',
    badge: 'CRYPTO / ZERO FEE',
    account_title: 'Sami2026',
    account_number: '243182889',
    iban_or_wallet: '0xae8da71c3ad92406e69edc24219918ea58c00dac',
    checkout_url: '',
    instructions: 'Send $15 USDT via Binance Pay ID or BEP20 Wallet network and attach payment proof.',
    price_display: '$15 USDT',
    is_active: 1,
    display_order: 5
  },
  {
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

async function seedSupabase() {
  console.log('🌱 Seeding Supabase Database with official accounts...\n');

  for (const method of defaultPaymentMethods) {
    const { data, error } = await supabase
      .from('payment_methods')
      .upsert(method, { onConflict: 'method_key' });

    if (error) {
      console.error(`Error inserting ${method.method_key}:`, error.message);
    } else {
      console.log(`✅ Seeded: ${method.title}`);
    }
  }

  console.log('\n🎉 ALL 6 PAYMENT ACCOUNTS SEEDED INTO SUPABASE SUCCESSFULLY!');
}

seedSupabase();
