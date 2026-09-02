import { db, initDatabase } from '../server/db/index.js';

console.log('🔄 Initializing DB and updating payment methods...');
initDatabase();

// 1. Reset payment_methods table with new details
db.exec('DELETE FROM payment_methods');

const insertPM = db.prepare(`
  INSERT INTO payment_methods (
    method_key, title, category, badge, account_title, account_number, iban_or_wallet, checkout_url, instructions, price_display, is_active, display_order
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertPM.run(
  'easypaisa',
  'Easypaisa Mobile Wallet',
  'wallet',
  'RECOMMENDED & FASTEST',
  'SARDAR SAMIULLAH',
  '03481095933',
  '',
  '',
  'Send course fee via Easypaisa Mobile App or USSD code and upload the transaction screenshot.',
  'PKR 3,900',
  1,
  1
);

insertPM.run(
  'jazzcash',
  'JazzCash Account',
  'wallet',
  'INSTANT MOBILE TRANSFER',
  'SARDAR SAMIULLAH',
  '03481095933',
  '',
  '',
  'Send course fee to JazzCash account and attach proof below.',
  'PKR 3,900',
  1,
  2
);

insertPM.run(
  'upaisa',
  'UPaisa Mobile Wallet',
  'wallet',
  'MOBILE TRANSFER',
  'SARDAR SAMIULLAH',
  '03481095933',
  '',
  '',
  'Send course fee via UPaisa app/agent and upload transaction proof.',
  'PKR 3,900',
  1,
  3
);

insertPM.run(
  'meezan_bank',
  'Meezan Bank Transfer',
  'bank',
  'DIRECT BANK / MOBILE APP / RAAST',
  'SARDAR SAMIULLAH',
  '0015010112560119',
  'PK94MEZN0015010112560119',
  '',
  'Transfer to Meezan Bank via Raast or IBFT using IBAN PK94MEZN0015010112560119 and upload confirmation screenshot.',
  'PKR 3,900',
  1,
  4
);

insertPM.run(
  'binance_crypto',
  'Binance Pay & USDT (Crypto)',
  'crypto',
  'CRYPTO / ZERO FEE',
  'Sami2026',
  '243182889',
  '0xae8da71c3ad92406e69edc24219918ea58c00dac',
  '',
  'Binance Pay ID: 243182889 (Nickname: Sami2026) or BEP20 USDT. Upload transfer hash/screenshot.',
  '$15 USDT',
  1,
  5
);

insertPM.run(
  'international_card',
  'Visa / Mastercard Card Checkout',
  'card',
  'OVERSEAS & INTERNATIONAL',
  'Online Card Checkout',
  '',
  '',
  'https://whop.com/checkout/plan_DsfaeyFcXlCwI',
  'Best for students in UAE, KSA, UK, USA. Pay securely with card and upload receipt proof.',
  '$15 USD',
  1,
  6
);

// 2. Update settings table
const updateSetting = db.prepare(`
  INSERT INTO settings (key, value) VALUES (?, ?)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value
`);

updateSetting.run('meezan_bank_title', 'SARDAR SAMIULLAH');
updateSetting.run('meezan_bank_account', '0015010112560119');
updateSetting.run('meezan_bank_iban', 'PK94MEZN0015010112560119');
updateSetting.run('easypaisa_title', 'SARDAR SAMIULLAH');
updateSetting.run('easypaisa_number', '03481095933');

// 3. Update CMS section 'payment_accounts'
const updateSection = db.prepare(`
  INSERT INTO cms_sections (section_key, title, content_json, is_visible)
  VALUES ('payment_accounts', 'Payment Methods & Bank Accounts', ?, 1)
  ON CONFLICT(section_key) DO UPDATE SET content_json = excluded.content_json
`);

updateSection.run(JSON.stringify({
  deposit_fee: '3,900',
  easypaisa: {
    account_title: 'SARDAR SAMIULLAH',
    account_number: '03481095933',
    is_recommended: true
  },
  jazzcash: {
    account_title: 'SARDAR SAMIULLAH',
    account_number: '03481095933'
  },
  upaisa: {
    account_title: 'SARDAR SAMIULLAH',
    account_number: '03481095933'
  },
  meezan_bank: {
    account_title: 'SARDAR SAMIULLAH',
    account_number: '0015010112560119',
    iban: 'PK94MEZN0015010112560119'
  },
  international_card: {
    whop_url: 'https://whop.com/checkout/plan_DsfaeyFcXlCwI',
    price_usd: '15'
  },
  binance_crypto: {
    binance_nickname: 'Sami2026',
    binance_pay_id: '243182889',
    bep20_wallet: '0xae8da71c3ad92406e69edc24219918ea58c00dac',
    network: 'BSC / BNB Smart Chain (BEP20)'
  }
}));

const rows = db.prepare('SELECT id, method_key, title, category, account_title, account_number, iban_or_wallet, is_active FROM payment_methods').all();
console.log('✅ Updated Payment Methods in DB:');
console.table(rows);
